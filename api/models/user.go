package models

import (
	"database/sql"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username  string `gorm:"unique"`
	Password  string
	Email     string  `gorm:"unique"`
	Roles     []*Role `gorm:"many2many:user_roles"`
	FirstName sql.NullString
	LastName  sql.NullString
	Avatar    sql.NullString
}
