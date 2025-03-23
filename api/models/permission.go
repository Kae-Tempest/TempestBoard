package models

import (
	"gorm.io/gorm"
)

type Permission struct {
	gorm.Model
	Name        string `gorm:"unique"`
	Description string
	Roles       []*Role `gorm:"many2many:permission_roles"`
}
