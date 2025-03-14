package fr.tempest.tempestboard.resetpassword;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ResetPasswordRepository extends JpaRepository<ResetPassword, Long> {
    ResetPassword findByToken(String token);
}
