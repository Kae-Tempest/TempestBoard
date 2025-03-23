package models

import "gorm.io/gorm"

type ProjectInvitation struct {
	gorm.Model
	Email       string
	ProjectID   Project
	Token       string `gorm:"size:100"`
	IsUserExist bool
}
