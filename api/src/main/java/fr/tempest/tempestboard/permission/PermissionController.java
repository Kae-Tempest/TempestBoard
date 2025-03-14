package fr.tempest.tempestboard.permission;

import fr.tempest.tempestboard.config.RequiresPermission;
import fr.tempest.tempestboard.config.RequiresRole;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/permissions/", name = "permissions")
public class PermissionController {
    public PermissionController(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    private final PermissionRepository permissionRepository;

    @GetMapping
    @RequiresRole("ADMIN")
    public ResponseEntity<List<Permission>> getPermissions() {
        return new ResponseEntity<>(permissionRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("{id}")
    @RequiresPermission("MANAGE_PERMISSIONS")
    public ResponseEntity<Permission> getPermission(@PathVariable Long id) {
        Optional<Permission> permission = permissionRepository.findById(id);
        return permission.map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @RequiresRole("ADMIN")
    public ResponseEntity<Permission> createPermission(@RequestBody Permission permission) {
        return new ResponseEntity<>(permissionRepository.save(permission), HttpStatus.CREATED);
    }

    @PatchMapping("{id}")
    @RequiresRole("ADMIN")
    public ResponseEntity<Permission> updatePermission(@PathVariable Long id, @RequestBody Permission permission) {
        Optional<Permission> existingPermission = permissionRepository.findById(id);
        if (existingPermission.isPresent()) {
            if (permission.getName() != null) {
                existingPermission.get().setName(permission.getName());
            }
            if (permission.getDescription() != null) {
                existingPermission.get().setDescription(permission.getDescription());
            }
            permissionRepository.save(existingPermission.get());
            return new ResponseEntity<>(permissionRepository.save(existingPermission.get()), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("{id}")
    @RequiresRole("ADMIN")
    public ResponseEntity<Permission> deletePermission(@PathVariable Long id) {
        Optional<Permission> permission = permissionRepository.findById(id);
        if (permission.isPresent()) {
            permissionRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
