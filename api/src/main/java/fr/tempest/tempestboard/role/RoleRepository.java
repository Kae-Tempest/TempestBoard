package fr.tempest.tempestboard.role;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface RoleRepository extends JpaRepository<Role, Long> {
    List<Role> findAllByProjectId(Long projectId);

    List<Role> findByNameIn(Set<String> userRoles);

    List<Role> findByUsersId(long id);
}
