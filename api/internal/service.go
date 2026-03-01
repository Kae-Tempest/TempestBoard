package internal

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/codes"
	"golang.org/x/crypto/bcrypt"
)

func GetSecretKey() []byte {
	return []byte(os.Getenv("SECRET_KEY"))
}

type AccountService struct {
	repo         UserRepository
	resetRepo    PasswordResetTokenRepository
	emailService *EmailService
	log          *slog.Logger
}

func NewAccountService(repo UserRepository, resetRepo PasswordResetTokenRepository, emailService *EmailService, log *slog.Logger) *AccountService {
	return &AccountService{repo: repo, resetRepo: resetRepo, emailService: emailService, log: log}
}

func (s *AccountService) createToken(userID uint64) (string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": fmt.Sprintf("%d", userID),
		"iss": "threadStocks",
		"exp": time.Now().Add(time.Hour * 72).Unix(),
		"iat": time.Now().Unix(),
	})

	return claims.SignedString(GetSecretKey())
}

func (s *AccountService) GetUserByID(ctx context.Context, id uint) (*User, error) {
	return s.repo.GetByID(ctx, strconv.Itoa(int(id)))
}

func (s *AccountService) Login(ctx context.Context, email, password string) (string, error) {
	user, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", errors.New("invalid credentials")
	}

	return s.createToken(user.ID)
}

func (s *AccountService) Register(ctx context.Context, req RegisterDto) (string, error) {
	if req.Password != req.ConfirmPassword {
		return "", errors.New("passwords do not match")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 14)
	if err != nil {
		return "", err
	}

	user := &User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	if err := s.repo.Create(ctx, user); err != nil {
		return "", err
	}

	return s.createToken(user.ID)
}

func (s *AccountService) generateSecureToken(length int) string {
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return ""
	}
	return hex.EncodeToString(b)
}

func (s *AccountService) ForgotPassword(ctx context.Context, email string) error {
	ctx, span := otel.Tracer("account-service").Start(ctx, "ForgotPassword")
	defer span.End()

	user, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		// On ne leak pas l'existence du mail, mais on log pour nous
		s.log.Info("Forgot password requested for non-existent email", "email", email)
		return nil
	}

	token := s.generateSecureToken(32)

	// Supprimer les anciens tokens de l'utilisateur
	_ = s.resetRepo.DeleteByUserID(ctx, uint(user.ID))

	resetToken := &PasswordResetToken{
		UserID:    uint(user.ID),
		Token:     token,
		ExpiresAt: time.Now().Add(time.Hour),
	}

	if err := s.resetRepo.Create(ctx, resetToken); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return err
	}

	go func(ctx context.Context, email, token string) {
		ctx, span := otel.Tracer("account-service").Start(ctx, "SendPasswordResetEmail")
		defer span.End()

		if err := s.emailService.SendPasswordResetEmail(email, token); err != nil {
			span.RecordError(err)
			span.SetStatus(codes.Error, err.Error())
			s.log.Error("Failed to send password reset email", "error", err, "email", email)
		} else {
			s.log.Info("Password reset email sent successfully", "email", email)
		}
	}(context.WithoutCancel(ctx), user.Email, token)

	return nil
}

func (s *AccountService) ResetPassword(ctx context.Context, req ResetPasswordDto) error {
	if req.NewPassword != req.ConfirmPassword {
		return errors.New("passwords do not match")
	}

	s.log.Info("ResetPassword called", "token_length", len(req.Token), "token_prefix", req.Token[:min(8, len(req.Token))])

	resetToken, err := s.resetRepo.GetByToken(ctx, req.Token)
	if err != nil {
		s.log.Error("Failed to find reset token", "error", err, "token_prefix", req.Token[:min(8, len(req.Token))])
		return errors.New("invalid or expired token")
	}

	s.log.Info("Token found", "user_id", resetToken.UserID, "expires_at", resetToken.ExpiresAt, "now", time.Now())

	if resetToken.ExpiresAt.Before(time.Now()) {
		s.log.Warn("Token expired", "expires_at", resetToken.ExpiresAt, "now", time.Now())
		_ = s.resetRepo.DeleteByUserID(ctx, resetToken.UserID)
		return errors.New("token expired")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), 14)
	if err != nil {
		return err
	}

	user := resetToken.User
	user.Password = string(hashedPassword)

	if err := s.repo.Update(ctx, &user); err != nil {
		return err
	}

	_ = s.resetRepo.DeleteByUserID(ctx, uint(user.ID))

	return nil
}

func (s *AccountService) UpdatePassword(ctx context.Context, req PasswordDto, user *User) error {
	if req.NewPassword != req.ConfirmNewPassWord {
		s.log.Error("passwords do not match")
		s.log.Info(req.NewPassword)
		s.log.Info(req.ConfirmNewPassWord)
		return errors.New("passwords do not match")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.CurrentPassword)); err != nil {
		return errors.New("invalid current password")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), 14)
	if err != nil {
		return err
	}

	if err := s.repo.UpdatePassword(ctx, string(hashedPassword), strconv.FormatUint(user.ID, 10)); err != nil {
		return err
	}

	return nil
}
