package main

import (
	"database/sql"
	"time"
)

type AutoIncr struct {
	ID        uint64    `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	DeletedAt time.Time `json:"deleted_at" db:"deleted_at"`
}

type User struct {
	AutoIncr
	Username  string         `json:"username" db:"username"`
	Password  string         `json:"-" db:"password"`
	Email     string         `json:"email" db:"email"`
	FirstName sql.NullString `json:"first_name" db:"first_name"`
	LastName  sql.NullString `json:"last_name" db:"last_name"`
	Avatar    sql.NullString `json:"avatar" db:"avatar"`
}

type UserDto struct {
	Username  string `json:"username,omitempty"`
	Password  string `json:"password,omitempty"`
	Email     string `json:"email,omitempty"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	Avatar    []byte `json:"avatar,omitempty"`
	AvatarExt string
}

type Project struct {
	AutoIncr
	OwnerID     uint           `json:"owner" db:"owner_id"`
	Users       []User         `json:"users"`
	Name        string         `json:"name" db:"name"`
	Description string         `json:"description" db:"description"`
	State       string         `json:"state" db:"state"`
	TagName     string         `json:"tag_name" db:"tag_name"`
	Thumbnail   sql.NullString `json:"thumbnail" db:"thumbnail"`
}

type ProjectDto struct {
	OwnerID      int    `json:"owner"`
	Name         string `json:"name"`
	Description  string `json:"description"`
	Thumbnail    []byte `json:"thumbnail"`
	ThumbnailExt string `json:"thumbnailExt"`
	State        string `json:"state"`
}

type LoginDto struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterDto struct {
	Username        string `json:"username"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirm_password"`
}

type Issue struct {
	AutoIncr
	CreatorID   uint           `json:"creator_id" db:"creator_id"`
	AssignedID  uint           `json:"assigned_id" db:"assigned_id"`
	ProjectID   uint           `json:"project_id" db:"project_id"`
	IssueNumber int16          `json:"issue_number" db:"issue_number"`
	Description sql.NullString `json:"description,omitempty" db:"description"`
	Priority    Priority       `json:"priority" db:"priority"`
	State       State          `json:"state" db:"state"`
	Attachment  sql.NullString `json:"attachment,omitempty" db:"attachment"`
}

type IssueDto struct {
	CreatorID     uint           `json:"creator_id"`
	AssignedID    uint           `json:"assigned_id"`
	ProjectID     uint           `json:"project_id"`
	IssueNumber   int16          `json:"issue_number"`
	Description   sql.NullString `json:"description,omitempty"`
	Priority      Priority       `json:"priority"`
	State         State          `json:"state"`
	Attachment    sql.NullString `json:"attachment"`
	AttachmentExt string         `json:"attachment_ext"`
}

type State struct {
	AutoIncr
	ProjectID  uint    `json:"project_id" db:"project_id"`
	Name       string  `json:"name" db:"name"`
	IsDefault  bool    `json:"is_default" db:"is_default"`
	IsActive   bool    `json:"is_active" db:"is_active"`
	IsBacklog  bool    `json:"is_backlog" db:"is_backlog"`
	IsCanceled bool    `json:"is_canceled" db:"is_canceled"`
	Issues     []Issue `json:"issues"`
}

type Priority struct {
	AutoIncr
	ProjectID uint   `json:"project_id" db:"project_id"`
	Name      string `json:"name" db:"name"`
	Color     string `json:"color" db:"color"`
}

type StateDto struct {
	ProjectID  uint    `json:"project_id"`
	Name       string  `json:"name"`
	IsDefault  bool    `json:"is_default"`
	IsActive   bool    `json:"is_active"`
	IsBacklog  bool    `json:"is_backlog"`
	IsCanceled bool    `json:"is_canceled"`
	Issues     []Issue `json:"issues"`
}

type PriorityDto struct {
	ProjectID uint   `json:"project_id"`
	Name      string `json:"name"`
	Color     string `json:"color"`
}

type Milestone struct {
	AutoIncr
	Name        string         `json:"name" db:"name"`
	ProjectID   uint           `json:"project_id" db:"project_id"`
	Issues      []Issue        `json:"issues"`
	Description sql.NullString `json:"description,omitempty" db:"description"`
	StartDate   time.Time      `json:"start_date" db:"start_date"`
	DueDate     sql.NullTime   `json:"due_date,omitempty" db:"due_date"`
}

type MilestoneDto struct {
	Name        string         `json:"name"`
	ProjectID   uint           `json:"project_id"`
	Issues      []Issue        `json:"issues"`
	Description sql.NullString `json:"description,omitempty"`
	StartDate   time.Time      `json:"start_date"`
	DueDate     sql.NullTime   `json:"due_date,omitempty"`
}

type Comment struct {
	AutoIncr
	IssueID       Issue
	UserID        User
	Content       string
	IsAnswer      bool
	CommentParent *Comment
	IsThread      bool
	IsResolved    bool
	Attachments   sql.NullString
}

type CommentDto struct {
	IssueID       uint   `json:"issue_id"`
	UserID        uint   `json:"user_id"`
	Content       string `json:"content"`
	IsAnswer      bool   `json:"is_answer"`
	CommentParent uint   `json:"comment_parent"`
	IsThread      bool   `json:"is_thread"`
	IsResolved    bool   `json:"is_resolved"`
	Attachments   string `json:"attachments"`
}
