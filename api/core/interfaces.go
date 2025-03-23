package core

import (
	"gorm.io/gorm"
	"tempestboard/controllers"
)

type App struct {
	DB          *gorm.DB
	Controllers *controllers.Controllers
}
