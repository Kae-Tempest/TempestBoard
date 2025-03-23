package services

import (
	"gorm.io/gorm"
)

type Services struct {
	Login *AuthService
	User  *UserService
	// Add other services here
}

func NewServices(db *gorm.DB) *Services {
	return &Services{
		Login: NewAuthService(db),
		User:  NewUserService(db),
		// Initialize other services
	}
}
