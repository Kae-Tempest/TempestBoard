package internal

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func GetSecretKey() []byte {
	return []byte(os.Getenv("SECRET_KEY"))
}

type AccountService struct {
	repo UserRepository
	log  *slog.Logger
}

func NewAccountService(repo UserRepository, log *slog.Logger) *AccountService {
	return &AccountService{repo: repo, log: log}

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
