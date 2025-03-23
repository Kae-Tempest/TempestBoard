package models

import (
	"database/sql"
	"gorm.io/gorm"
)

type Issue struct {
	gorm.Model
	CreatorID   User
	AssignedID  User
	ProjectID   Project
	ProjectTag  string
	TicketID    int16
	Description sql.NullString
	Priority    string
	State       State
	Tags        Tag `gorm:"many2many:issue_tags;"`
	Milestone   Milestone
	Attachments sql.NullString
}
