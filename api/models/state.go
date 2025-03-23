package models

import "gorm.io/gorm"

type State struct {
	gorm.Model
	ProjectID  Project
	Name       string
	IsDefault  bool
	IsActive   bool
	IsBacklog  bool
	IsCanceled bool
	Issues     []Issue
}
