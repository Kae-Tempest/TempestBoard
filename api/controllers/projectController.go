package controllers

import (
	"net/http"
	"tempestboard/services"
)

type ProjectController struct {
	services *services.Services
}

func NewProjectController(services *services.Services) *ProjectController {
	return &ProjectController{
		services: services,
	}
}

func (c *ProjectController) Create(w http.ResponseWriter, r *http.Request) {
	c.services.Project.CreateProject(w, r)
}
