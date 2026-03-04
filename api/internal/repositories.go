package internal

import (
	"context"

	"github.com/jmoiron/sqlx"
)

/////////////////////////
// ACCOUNT REPOSITORY //
////////////////////////

type accountRepository struct {
	db *sqlx.DB
}

func NewAccountRepository(db *sqlx.DB) UserRepository {
	return &accountRepository{db: db}
}

func (r *accountRepository) GetByID(ctx context.Context, id string) (*User, error) {
	var user User

	err := r.db.GetContext(ctx, &user, `SELECT * FROM users WHERE id = $1`, id)

	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *accountRepository) GetByEmail(ctx context.Context, email string) (*User, error) {
	var user User
	err := r.db.GetContext(ctx, &user, `SELECT * FROM users WHERE email = $1`, email)

	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *accountRepository) Create(ctx context.Context, user *User) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO users (email, password, username) VALUES ($1, $2, $3)`,
		user.Email, user.Password, user.Username)
	return err
}

func (r *accountRepository) Update(ctx context.Context, user *User) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE users SET email = $1, username = $2, first_name = $3, last_name = $4 WHERE id = $5`,
		user.Email, user.Username, user.FirstName, user.LastName, user.ID)
	return err
}

func (r *accountRepository) UpdatePassword(ctx context.Context, password string, id string) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE users SET password = $1 WHERE id = $2`,
		password, id)
	return err
}

//////////////////////////
// PASSWORD REPOSITORY //
/////////////////////////

type passwordResetTokenRepository struct {
	db *sqlx.DB
}

func NewPasswordResetTokenRepository(db *sqlx.DB) PasswordResetTokenRepository {
	return &passwordResetTokenRepository{db: db}
}

func (r *passwordResetTokenRepository) Create(ctx context.Context, token *PasswordResetToken) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
		token.UserID, token.Token, token.ExpiresAt)
	return err
}

func (r *passwordResetTokenRepository) GetByToken(ctx context.Context, token string) (*PasswordResetToken, error) {
	var rt PasswordResetToken
	err := r.db.GetContext(ctx, &rt, `SELECT * FROM password_reset_tokens WHERE token = $1`, token)
	if err != nil {
		return nil, err
	}

	var u User
	err = r.db.GetContext(ctx, &u, `SELECT * FROM users WHERE id = $1`, rt.UserID)
	if err != nil {
		return nil, err
	}
	rt.User = u
	return &rt, nil
}

func (r *passwordResetTokenRepository) DeleteByUserID(ctx context.Context, userID uint) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM password_reset_tokens WHERE user_id = $1`, userID)
	return err
}

/////////////////////////
// PROJECT REPOSITORY //
////////////////////////

type projectRepository struct {
	db *sqlx.DB
}

func NewProjectRepository(db *sqlx.DB) ProjectRepository {
	return &projectRepository{db: db}
}

func (r *projectRepository) GetByID(ctx context.Context, id string) (*Project, error) {
	var p Project

	err := r.db.GetContext(ctx, &p, `SELECT * FROM projects WHERE id = $1`, id)
	if err != nil {
		return nil, err
	}

	return &p, nil
}

func (r *projectRepository) GetByName(ctx context.Context, name string) ([]*Project, error) {
	var p []*Project

	err := r.db.SelectContext(ctx, &p, `SELECT * FROM projects WHERE name LIKE '%' || $1 || '%'`, name)
	if err != nil {
		return nil, err
	}

	return p, nil
}

func (r *projectRepository) GetByOwner(ctx context.Context, ownerID string) ([]*Project, error) {
	var p []*Project

	err := r.db.SelectContext(ctx, &p, `SELECT * FROM projects WHERE owner_id = $1`, ownerID)
	if err != nil {
		return nil, err
	}

	return p, nil
}

func (r *projectRepository) GetByTagName(ctx context.Context, tagName string) ([]*Project, error) {
	var p []*Project

	err := r.db.SelectContext(ctx, &p, `SELECT * FROM projects WHERE tag_name = $1`, tagName)
	if err != nil {
		return nil, err
	}

	return p, nil
}

func (r *projectRepository) GetByState(ctx context.Context, state string) ([]*Project, error) {
	var p []*Project

	err := r.db.SelectContext(ctx, &p, `SELECT * FROM projects WHERE state = $1`, state)
	if err != nil {
		return nil, err
	}

	return p, nil
}

func (r *projectRepository) Create(ctx context.Context, project *Project) error {
	return nil
}

func (r *projectRepository) Update(ctx context.Context, project *Project) error {
	return nil
}

func (r *projectRepository) Delete(ctx context.Context, projectID string) error {
	return nil
}

func (r *projectRepository) DeleteThumbnail(ctx context.Context, projectID string) error {
	return nil
}
