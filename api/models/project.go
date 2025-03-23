package models

import (
	"database/sql"
	"gorm.io/gorm"
)

type Project struct {
	gorm.Model
	OwnerID     uint   `gorm:"foreignKey:ID;references:users"`
	Users       []User `gorm:"many2many:project_users;"`
	Name        string
	Description string
	Thumbnail   sql.NullString
}
