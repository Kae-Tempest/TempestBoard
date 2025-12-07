package core

import (
	"tempestboard/controllers"

	"gorm.io/gorm"
)

type App struct {
	DB          *gorm.DB
	Controllers *controllers.Controllers
}
