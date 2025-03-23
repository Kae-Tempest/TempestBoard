package models

import (
	"database/sql"
	"gorm.io/gorm"
	"time"
)

type Milestone struct {
	gorm.Model
	Name        string
	ProjectID   Project
	Issues      []Issue
	Description sql.NullString
	StartDate   time.Time
	DueDate     sql.NullTime
}
