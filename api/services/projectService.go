package services

import (
	"database/sql"
	"fmt"
	"gorm.io/gorm"
	"net/http"
	"tempestboard/core/utils"
	"tempestboard/models"
)

type ProjectService struct {
	db *gorm.DB
}

func NewProjectService(db *gorm.DB) *ProjectService {
	return &ProjectService{db: db}
}

func (s *ProjectService) CreateProject(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

	var p models.Project
	var o models.User
	var dto models.ProjectDto

	err := utils.BodyDecoder(r, &dto)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
	}

	if dto.OwnerID == 0 {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	result := s.db.First(&o, dto.OwnerID)
	if result.Error != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if dto.Thumbnail != nil {
		filePath, err := utils.SaveFileToDisk(dto.Thumbnail, "thumbnail", dto.Name, dto.ThumbnailExt)
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		p.Thumbnail = sql.NullString{
			String: filePath,
			Valid:  true,
		}
	}

	if dto.Description != "" {
		p.Description = dto.Description
	}

	p.OwnerID = o.ID
	p.Name = dto.Name
	p.State = dto.State

	result = s.db.Create(&p)
	if result.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "text/plain")
	_, err = w.Write([]byte("Project created successfully"))
	if err != nil {
		return
	}

}
