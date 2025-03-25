package services

import (
	"gorm.io/gorm"
)

type Services struct {
	Login   *AuthService
	User    *UserService
	Project *ProjectService
	// Add other services here
}

func NewServices(db *gorm.DB) *Services {
	return &Services{
		Login:   NewAuthService(db),
		User:    NewUserService(db),
		Project: NewProjectService(db),
		// Initialize other services
	}
}
