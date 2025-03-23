package services

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
	"os"
	"tempestboard/core/utils"
	"tempestboard/models"
	"time"
)

var secretKey = []byte(os.Getenv("SECRET_KEY"))

type AuthService struct {
	db *gorm.DB
}

type loginDto struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type registerDto struct {
	Username        string `json:"username" binding:"required"`
	Email           string `json:"email" binding:"required"`
	Password        string `json:"password" binding:"required"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

func NewAuthService(db *gorm.DB) *AuthService {
	return &AuthService{db: db}
}

func (s *AuthService) LoginService(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

	var a loginDto
	var u models.User

	err := utils.BodyDecoder(r, &a)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	s.db.First(&u, "email = ?", a.Email)

	match := checkPasswordHash(a.Password, u.Password)
	if !match {
		w.WriteHeader(http.StatusUnauthorized)
	}

	token, err := creatToken(u.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		MaxAge:   86400,
		Path:     "/",
		Secure:   false,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write([]byte("{}"))
	if err != nil {
		return
	}
}

func (s *AuthService) RegisterService(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

	var a registerDto
	var u models.User

	err := utils.BodyDecoder(r, &a)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	if a.Password != a.ConfirmPassword {
		fmt.Printf("Passwords do not match, %s, %s\n", a.Password, a.ConfirmPassword)
		http.Error(w, "Passwords isn't same", http.StatusBadRequest)
		return
	}

	hashedPwd, err := hashPassword(a.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	u.Email = a.Email
	u.Username = a.Username
	u.Password = hashedPwd
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()

	result := s.db.Create(&u)
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusBadRequest)
		return
	}

	token, err := creatToken(u.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		MaxAge:   86400,
		Path:     "/",
		Secure:   false,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write([]byte("{}"))
	if err != nil {
		return
	}
}

func creatToken(userID uint) (string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
		"iss": "tempestboard",
		"exp": time.Now().Add(time.Hour * 72).Unix(),
		"iat": time.Now().Unix(),
	})

	tokenString, err := claims.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
