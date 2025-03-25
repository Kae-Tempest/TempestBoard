package models

import (
	"database/sql"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username  string         `gorm:"unique" json:"username"`
	Password  string         `json:"-"` // Password excluded from JSON responses
	Email     string         `gorm:"unique" json:"email"`
	Roles     []*Role        `gorm:"many2many:user_roles" json:"roles"`
	FirstName sql.NullString `json:"firstName,omitempty"`
	LastName  sql.NullString `json:"lastName,omitempty"`
	Avatar    sql.NullString `json:"avatar,omitempty"`
}
