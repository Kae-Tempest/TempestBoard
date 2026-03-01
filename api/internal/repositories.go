package internal

import (
	"context"

	"github.com/jmoiron/sqlx"
)

type accountRepository struct {
	db *sqlx.DB
}

func NewAccountRepository(db *sqlx.DB) UserRepository {
	return &accountRepository{db: db}
}

func (r *accountRepository) GetByID(ctx context.Context, id string) (*User, error) {
	var user User

	err := r.db.GetContext(ctx, `SELECT * FROM users WHERE id = $1`, id)

	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *accountRepository) GetByEmail(ctx context.Context, email string) (*User, error) {
	var user User
	err := r.db.GetContext(ctx, `SELECT * FROM users WHERE email = $1`, email)

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
