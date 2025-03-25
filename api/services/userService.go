package services

import (
	"encoding/json"
	"fmt"
	"gorm.io/gorm"
	"log"
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
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
	var user models.User
	token, err := utils.GetTokenFromCookie(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
	}

	uid, err := token.Claims.GetSubject()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
	fmt.Printf("%v", uid)
	res := s.db.First(&user, "id = ?", uid)
	if res.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	jsonData, err := json.Marshal(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Printf("Error marshaling user to JSON: %v", err)
		err := json.NewEncoder(w).Encode(map[string]string{"error": "Failed to serialize user data"})
		if err != nil {
			log.Printf("Error serializing user to JSON: %v", err)
			return
		}
		return
	}

	_, err = w.Write(jsonData)
	if err != nil {
		log.Printf("Error writing response: %v", err)
		return
	}

}
