package internal

import (
	"context"
)

type UserRepository interface {
	GetByID(ctx context.Context, id string) (*User, error)
	GetByEmail(ctx context.Context, email string) (*User, error)
	Create(ctx context.Context, user *User) error
	Update(ctx context.Context, user *User) error
	UpdatePassword(ctx context.Context, password string, id string) error
}

type PasswordResetTokenRepository interface {
	Create(ctx context.Context, token *PasswordResetToken) error
	GetByToken(ctx context.Context, token string) (*PasswordResetToken, error)
	DeleteByUserID(ctx context.Context, userID uint) error
}

type ProjectRepository interface {
	GetByID(ctx context.Context, id string) (*Project, error)
	GetByOwner(ctx context.Context, ownerID string) ([]*Project, error)
	GetByName(ctx context.Context, name string) ([]*Project, error)
	GetByTagName(ctx context.Context, tagName string) ([]*Project, error)
	GetByState(ctx context.Context, state string) ([]*Project, error)
	Create(ctx context.Context, project *Project) error
	Update(ctx context.Context, project *Project) error
	Delete(ctx context.Context, projectID string) error
	DeleteThumbnail(ctx context.Context, projectID string) error
}

type IssueRepository interface {
	GetByID(ctx context.Context, id string) (*Issue, error)
	GetAll(ctx context.Context, userId string) ([]*Issue, error)
	Create(ctx context.Context, issue *Issue) error
	Update(ctx context.Context, issue *Issue) error
	Delete(ctx context.Context, issueID string) error
	DeleteAttachment(ctx context.Context, issueID string) error
	GetProjectIssueNumber(ctx context.Context, projectID string) (int16, error)
}
