package fr.tempest.tempestboard.projectinvitation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectInvationRepository extends JpaRepository<ProjectInvitation, Long> {
    Optional<ProjectInvitation> findByToken(String token);
}
