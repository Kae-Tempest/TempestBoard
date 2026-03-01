package internal

import "context"

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
