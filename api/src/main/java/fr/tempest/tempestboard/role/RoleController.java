package fr.tempest.tempestboard.role;

import fr.tempest.tempestboard.config.RequiresPermission;
import fr.tempest.tempestboard.config.RequiresRole;
import fr.tempest.tempestboard.permission.Permission;
import fr.tempest.tempestboard.permission.PermissionRepository;
import fr.tempest.tempestboard.project.Project;
import fr.tempest.tempestboard.project.ProjectRepository;
import fr.tempest.tempestboard.user.User;
import fr.tempest.tempestboard.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping(value = "/api/roles/", name = "roles")
public class RoleController {
    public RoleController(ProjectRepository projectRepository, UserRepository userRepository, PermissionRepository permissionRepository, RoleRepository roleRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
    }

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;

    @GetMapping
    @RequiresRole("ADMIN")
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    @GetMapping("{id}")
    @RequiresPermission("MANAGE_PERMISSIONS")
    public ResponseEntity<Role> getRole(@PathVariable Long id) {
        Optional<Role> role = roleRepository.findById(id);
        return role.map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @RequiresPermission("CREATE_ROLE")
    public ResponseEntity<Role> createRole(@RequestBody CreateRoleDto roleDto) {
        Optional<Project> project = projectRepository.findById(roleDto.getProject());
        if (project.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<Permission> permissionsList = permissionRepository.findAllById(roleDto.getPermissions());
        if (permissionsList.isEmpty() && !roleDto.getPermissions().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<User> usersList = userRepository.findAllById(roleDto.getUsers());
        if (usersList.isEmpty() && !roleDto.getUsers().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Set<User> user = new HashSet<>(usersList);
        Set<Permission> permissions = new HashSet<>(permissionsList);


        Role role = new Role();
        role.setName(roleDto.getName());
        role.setUsers(user);
        role.setPermissions(permissions);
        role.setProject(project.get());

        return new ResponseEntity<>(roleRepository.save(role), HttpStatus.CREATED);

    }

    @PatchMapping("{id}")
    @RequiresPermission({"EDIT_ROLE", "MANAGE_PERMISSIONS"})
    public ResponseEntity<Role> updateRole(@PathVariable Long id, @RequestBody CreateRoleDto roleDto) {
        Optional<Role> role = roleRepository.findById(id);
        if (role.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (roleDto.getName() != null) {
            role.get().setName(roleDto.getName());
        }

        if (roleDto.getProject() != null) {
            Optional<Project> project = projectRepository.findById(roleDto.getProject());
            if (project.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            role.get().setProject(project.get());
        }

        if (roleDto.getUsers() != null) {
            List<User> usersList = userRepository.findAllById(roleDto.getUsers());
            if (usersList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            Set<User> user = new HashSet<>(usersList);
            role.get().setUsers(user);
        }

        if (roleDto.getPermissions() != null) {
            List<Permission> permissionsList = permissionRepository.findAllById(roleDto.getPermissions());
            if (permissionsList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            Set<Permission> permissions = new HashSet<>(permissionsList);
            role.get().setPermissions(permissions);
        }

        roleRepository.save(role.get());
        return new ResponseEntity<>(role.get(), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    @RequiresPermission("DELETE_ROLE")
    public ResponseEntity<Role> deleteRole(@PathVariable Long id) {
        Optional<Role> role = roleRepository.findById(id);
        if (role.isPresent()) {
            roleRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

}
