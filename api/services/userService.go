package services

import (
	"fmt"
	"gorm.io/gorm"
	"net/http"
	"tempestboard/core/utils"
	"tempestboard/models"
)

type UserService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{db: db}
}

func (s *UserService) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	var user models.User

	token, err := utils.GetTokenFromCookie(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
	}

	uid, err := token.Claims.GetSubject()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

	res := s.db.First(&user, "id = ?", uid)
	if res.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write([]byte(fmt.Sprintf(`{"user": "%v"`, user)))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

}
