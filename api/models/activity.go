package models

import "gorm.io/gorm"

type Activity struct {
	gorm.Model
	ActivityType string
	IssueID      Issue
	UserID       User
	Content      string
}
