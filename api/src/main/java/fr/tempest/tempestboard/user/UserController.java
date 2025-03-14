package fr.tempest.tempestboard.user;

import fr.tempest.tempestboard.config.RequiresRole;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/users/", name = "users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @GetMapping("{id}")
    @RequiresRole("ADMIN")
    public ResponseEntity<User> findById(@PathVariable long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    @PatchMapping("{id}/change-password")
    public ResponseEntity<User> changePassword(@PathVariable long id, @RequestParam("newPassword") String newPassword) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        user.get().setPassword(newPassword);
        userRepository.save(user.get());
        return new ResponseEntity<>(user.get(), HttpStatus.OK);
    }

    @PatchMapping("{id}")
    public ResponseEntity<User> update(@PathVariable long id, @RequestBody User user) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User updatedUser = userOptional.get();
            if (user.getUsername() != null) {
                updatedUser.setUsername(user.getUsername());
            }

            if (user.getEmail() != null) {
                updatedUser.setEmail(user.getEmail());
            }

            if (user.getFirstName() != null) {
                updatedUser.setFirstName(user.getFirstName());
            }

            if (user.getLastName() != null) {
                updatedUser.setLastName(user.getLastName());
            }

            return new ResponseEntity<>(userRepository.save(updatedUser), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}