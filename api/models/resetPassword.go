package models

import "gorm.io/gorm"

type ResetPassword struct {
	gorm.Model
	Email             string
	LinkExpiryMinutes int16
	Token             string
}
