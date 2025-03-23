package controllers

import (
	"net/http"
	"tempestboard/services"
)

type AuthController struct {
	services *services.Services
}

func NewAuthController(services *services.Services) *AuthController {
	return &AuthController{
		services: services,
	}
}

func (c *AuthController) HandleLogin(w http.ResponseWriter, r *http.Request) {
	c.services.Login.LoginService(w, r)
}

func (c *AuthController) HandleRegister(w http.ResponseWriter, r *http.Request) {
	c.services.Login.RegisterService(w, r)
}
