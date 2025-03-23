package models

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Name        string
	ProjectID   uint         `gorm:"foreignKey:ID;references:projects"`
	Users       []User       `gorm:"many2many:user_roles"`
	Permissions []Permission `gorm:"many2many:permission_roles"`
}
