package fr.tempest.tempestboard.auth;

import fr.tempest.tempestboard.config.EmailService;
import fr.tempest.tempestboard.config.JwtUtils;
import fr.tempest.tempestboard.resetpassword.ResetDto;
import fr.tempest.tempestboard.resetpassword.ResetPassword;
import fr.tempest.tempestboard.resetpassword.ResetPasswordRepository;
import fr.tempest.tempestboard.user.User;
import fr.tempest.tempestboard.user.UserRepository;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    public AuthController(ResetPasswordRepository resetPasswordRepository, AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.resetPasswordRepository = resetPasswordRepository;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final ResetPasswordRepository resetPasswordRepository;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    public static final ResponseEntity<?> badRequest = ResponseEntity.badRequest().body("Error during registration");
    public static final ResponseEntity<?> unauthorized = ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    Dotenv dotenv = Dotenv.load();

    public static UUID secureRandomUUID() {
        SecureRandom ng = new SecureRandom();
        byte[] randomBytes = new byte[16];
        ng.nextBytes(randomBytes);
        randomBytes[6] &= (byte) 0x0f;  /* clear version        */
        randomBytes[6] |= (byte) 0x40;  /* set to version 4     */
        randomBytes[8] &= (byte) 0x3f;  /* clear variant        */
        randomBytes[8] |= (byte) 0x80;  /* set to IETF variant  */
        return UUID.nameUUIDFromBytes(randomBytes);
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto registerDto) {
        try {
            if (userRepository.findByEmail(registerDto.getEmail()) != null) {
                return badRequest;
            }
            User user = new User();
            user.setUsername(registerDto.getUsername());
            user.setEmail(registerDto.getEmail());
            user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
            User savedUser = userRepository.save(user);
            userRepository.flush();

            Map<String, Object> claims = new HashMap<>();
            claims.put("token", jwtUtils.generateToken(savedUser.getEmail()));
            claims.put("type", "Bearer");
            return new ResponseEntity<>(claims, HttpStatus.OK);
        } catch (AuthenticationException e) {
            return badRequest;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto user) {
        logger.info(user.getEmail(), user.getPassword());
        logger.info("Login attempt for {}", user.getEmail());
        logger.info("with password {}", user.getPassword());
        try {
            logger.debug("login {}", user.getEmail());
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
            logger.debug(authentication.toString());
            if (authentication.isAuthenticated()) {
                logger.debug("logged in");
                Map<String, Object> authData = new HashMap<>();
                authData.put("token", jwtUtils.generateToken(user.getEmail()));
                authData.put("type", "Bearer");
                return ResponseEntity.ok(authData);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error to authenticate");
        } catch (AuthenticationException e) {
            logger.error("Authentication failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error to authenticate or Invalid email or password");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        UUID token = secureRandomUUID();
        String resetLink = String.format("%s/reset-password?email=%stoken=%s"
                , dotenv.get("FRONTEND_URL"), email, token);
        try {
            EmailService.sendResetPassword(
                    email, resetLink
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to send reset password email: " + e.getMessage());
        }

        ResetPassword resetPassword = new ResetPassword();
        resetPassword.setEmail(email);
        resetPassword.setToken(token.toString());
        resetPassword.setLinkExpiryMinutes(15);


        resetPasswordRepository.save(resetPassword);


        return new ResponseEntity<>(HttpStatus.OK);
    }


    @PostMapping("/resetPassord")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetDto resetDto) {
        ResetPassword resetPassword = resetPasswordRepository.findByToken(resetDto.getToken());
        if (resetPassword == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        LocalDateTime currentDateTime = LocalDateTime.now();

        LocalDateTime dateTime15MinutesAgo = currentDateTime.minusMinutes(resetPassword.getLinkExpiryMinutes());

        if (currentDateTime.isAfter(dateTime15MinutesAgo)) {
            resetPasswordRepository.delete(resetPassword);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (resetDto.getPassword().equals(resetDto.getNewPassword())) {
            User user = userRepository.findByEmail(resetDto.getEmail());
            if (user == null) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            user.setPassword(passwordEncoder.encode(resetDto.getNewPassword()));
            userRepository.save(user);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
