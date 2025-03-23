package models

import (
	"database/sql"
	"gorm.io/gorm"
)

type Comment struct {
	gorm.Model
	IssueID       Issue
	UserID        User
	Content       string
	IsAnswer      bool
	CommentParent *Comment
	IsThread      bool
	IsResolved    bool
	Attachments   sql.NullString
}
