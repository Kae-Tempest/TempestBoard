package models

import (
	"database/sql"
	"gorm.io/gorm"
)

type Project struct {
	gorm.Model
	OwnerID     uint   `gorm:"foreignKey:ID;references:users"`
	Users       []User `gorm:"many2many:project_users;"`
	Name        string
	Description string
	State       string
	Thumbnail   sql.NullString
}

type ProjectDto struct {
	OwnerID     int    `json:"owner"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Thumbnail   []byte `json:"thumbnail"`
	ThumbnailExt string `json:"thumbnailExt"`
	State       string `json:"state"`
}
