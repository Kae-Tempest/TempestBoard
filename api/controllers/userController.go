package controllers

import (
	"net/http"
	"tempestboard/services"
)

type UserController struct {
	services *services.Services
}

func NewUserController(services *services.Services) *UserController {
	return &UserController{
		services: services,
	}
}

func (c *UserController) Me(w http.ResponseWriter, r *http.Request) {
	c.services.User.GetCurrentUser(w, r)
}
