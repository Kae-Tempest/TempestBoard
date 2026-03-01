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
