package fr.tempest.tempestboard.projectinvitation;

import fr.tempest.tempestboard.config.EmailService;
import fr.tempest.tempestboard.config.RequiresPermission;
import fr.tempest.tempestboard.project.Project;
import fr.tempest.tempestboard.project.ProjectRepository;
import fr.tempest.tempestboard.user.User;
import fr.tempest.tempestboard.user.UserRepository;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.SecureRandom;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping(value = "/api/project-invitations/", name = "project-invitations")
public class ProjectInvitationController {
    public ProjectInvitationController(ProjectRepository projectRepository, UserRepository userRepository, ProjectInvationRepository projectInvitationRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectInvitationRepository = projectInvitationRepository;
    }

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectInvationRepository projectInvitationRepository;
    public String invitationLink;
    public Boolean isExistingUser = false;
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

    @PostMapping("/send-invitation")
    @RequiresPermission("MANAGE_PROJECT_MEMBERS")
    public ResponseEntity<String> sendInvitation(@RequestBody InvitationDto invitationDto) {
        try {
            Optional<Project> project = projectRepository.findById(invitationDto.getProject());

            if (project.isEmpty()) {
                return new ResponseEntity<>("Project not found", HttpStatus.NOT_FOUND);
            }

            User user = userRepository.findByEmail(invitationDto.getEmail());

            UUID token = secureRandomUUID();

            if (user == null) {
                invitationLink = String.format("%s/register?token=%s&email=%s",
                        dotenv.get("FRONTEND_URL"),
                        token,
                        invitationDto.getEmail());
                isExistingUser = true;
            }


            invitationLink = String.format("%s/accept-invitation?token=%s",
                    dotenv.get("FRONTEND_URL"),
                    token);

            EmailService.sendProjectInvitation(
                    invitationDto.getEmail(),
                    project.get().getName(),
                    invitationLink

            );
            ProjectInvitation projectInvitation = new ProjectInvitation();
            projectInvitation.setProject(project.get());
            projectInvitation.setEmail(invitationDto.getEmail());
            projectInvitation.setToken(token.toString());
            projectInvitation.setUserExist(isExistingUser);

            projectInvitationRepository.save(projectInvitation);

            return ResponseEntity.ok("Invitation email sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to send invitation email: " + e.getMessage());
        }
    }

    @PostMapping("/accept")
    public ResponseEntity<String> acceptInvitation(@RequestBody String token) {
        Optional<ProjectInvitation> projectInvitation = projectInvitationRepository.findByToken(token);
        if (projectInvitation.isEmpty()) {
            return new ResponseEntity<>("Invitation not found", HttpStatus.NOT_FOUND);
        }

        Optional<Project> project = projectRepository.findById(projectInvitation.get().getProject().getId());
        if (project.isEmpty()) {
            return new ResponseEntity<>("Project not found", HttpStatus.NOT_FOUND);
        }

        User user = userRepository.findByEmail(projectInvitation.get().getEmail());
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        Project actualProject = project.get();
        Set<User> userList = actualProject.getUsers();

        if (userList.contains(user)) {
            return new ResponseEntity<>("User is already in this project", HttpStatus.CONFLICT);
        }

        userList.add(user);
        projectRepository.save(actualProject);

        projectInvitationRepository.delete(projectInvitation.get());

        return ResponseEntity.ok("Invitation accepted successfully!");
    }
}
