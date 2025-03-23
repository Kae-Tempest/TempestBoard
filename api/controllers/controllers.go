package controllers

import (
	"gorm.io/gorm"
	"tempestboard/services"
)

type Controllers struct {
	Auth *AuthController
	User *UserController
	// Add other controllers here
}

func NewControllers(db *gorm.DB) *Controllers {
	newServices := services.NewServices(db)

	return &Controllers{
		Auth: NewAuthController(newServices),
		User: NewUserController(newServices),
		// Initialize other controllers
	}
}
