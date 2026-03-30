package internal

import (
	"context"
	"fmt"

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
	_, err := r.db.ExecContext(ctx, `
			WITH inserted_project AS (
			    INSERT INTO projects (name, description, tag_name, state, owner_id)
			    VALUES ($1, $2, $3, $4, $5)
			    RETURNING id
			)
			INSERT INTO project_users (project_id, user_id)
			SELECT id, $5
			FROM inserted_project;
		`,
		project.Name, project.Description, project.TagName, project.State, project.OwnerID)
	return err
}

func (r *projectRepository) Update(ctx context.Context, project *Project) error {
	_, err := r.db.ExecContext(ctx, `
		    WITH updated_project AS (
		    	UPDATE projects
		    	SET name = $1, description = $2, tag_name = $3, state = $4
		    	WHERE id = $5
		    	RETURNING id
		    ),
		    deleted AS (
				DELETE FROM project_users
		    	WHERE project_id = (SELECT id FROM updated_project)
		    )
		    INSERT INTO project_users (project_id, user_id)
		    SELECT (SELECT id FROM updated_project), UNNEST($6::int[])
		`,
		project.Name, project.Description, project.TagName, project.State, project.ID, project.Users)
	if err != nil {
		return err
	}
	return nil
}

func (r *projectRepository) Delete(ctx context.Context, projectID string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM projects WHERE id = $1`, projectID)
	return err
}

func (r *projectRepository) DeleteThumbnail(ctx context.Context, projectID string) error {
	_, err := r.db.ExecContext(ctx, `UPDATE projects SET thumbnail = NULL WHERE id = $1`, projectID)
	return err
}

////////////////////////
/// ISSUE REPOSITORY ///
////////////////////////

type issueRepository struct {
	db *sqlx.DB
}

func NewIssueRepository(db *sqlx.DB) IssueRepository {
	return &issueRepository{db: db}
}

func (r *issueRepository) GetByID(ctx context.Context, id string) (*Issue, error) {
	var i Issue

	err := r.db.GetContext(ctx, &i, "SELECT * FROM issues WHERE id = $1", id)
	if err != nil {
		return nil, err
	}

	return &i, nil
}

func (r *issueRepository) GetAll(ctx context.Context, userId string) ([]*Issue, error) {
	var i []*Issue

	err := r.db.SelectContext(ctx, &i, "SELECT * FROM issues WHERE creator_id = $1 OR assigned_id = $1", userId)
	if err != nil {
		return nil, err
	}

	return i, nil
}

func (r *issueRepository) Create(ctx context.Context, issue *Issue) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO issues 
    (creator_id, assigned_id, project_id, issue_number, description, priority_id, state_id, attachment) 
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		issue.CreatorID, issue.AssignedID, issue.ProjectID, issue.IssueNumber, issue.Description, issue.Priority.ID, issue.State.ID, issue.Attachment.String)
	return err
}

func (r *issueRepository) Update(ctx context.Context, issue *Issue) error {
	_, err := r.db.ExecContext(ctx, `UPDATE issues SET description = $1, priority_id = $2, state_id = $3, attachment = $4, assigned_id = $5 WHERE id = $6`,
		issue.Description, issue.Priority.ID, issue.State.ID, issue.Attachment.String, issue.AssignedID, issue.ID)
	return err
}

func (r *issueRepository) Delete(ctx context.Context, issueID string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM issues WHERE id = $1`, issueID)
	return err
}

func (r *issueRepository) DeleteAttachment(ctx context.Context, issueID string) error {
	_, err := r.db.ExecContext(ctx, `UPDATE issues SET attachment = NULL WHERE id = $1`, issueID)
	return err
}

func (r *issueRepository) GetProjectIssueNumber(ctx context.Context, projectID string) (int16, error) {
	var issueNumber int16
	err := r.db.GetContext(ctx, &issueNumber, `SELECT COUNT(*) FROM issues WHERE project_id = $1`, projectID)
	if err != nil {
		return 0, err
	}
	return issueNumber, nil
}

////////////////////////
/// STATE REPOSITORY ///
////////////////////////

type stateRepository struct {
	db *sqlx.DB
}

func NewStateRepository(db *sqlx.DB) StateRepository {
	return &stateRepository{db: db}
}

var allowedState = map[string]bool{
	"is_active":   true,
	"is_default":  true,
	"is_backlog":  true,
	"is_canceled": true,
}

func (r *stateRepository) GetByID(ctx context.Context, id string) (*State, error) {
	var s State
	err := r.db.GetContext(ctx, &s, `SELECT * FROM states WHERE id = $1`, id)
	if err != nil {
		return nil, err
	}
	return &s, nil
}
func (r *stateRepository) GetByProject(ctx context.Context, projectID string) ([]*State, error) {
	var states []*State
	err := r.db.SelectContext(ctx, &states, `SELECT * FROM states WHERE project_id = $1`, projectID)
	if err != nil {
		return nil, err
	}
	return states, nil
}
func (r *stateRepository) GetByName(ctx context.Context, name string) (*State, error) {
	var s State
	err := r.db.GetContext(ctx, &s, `SELECT * FROM states WHERE name = $1`, name)
	if err != nil {
		return nil, err
	}
	return &s, nil
}
func (r *stateRepository) GetByState(ctx context.Context, state string) ([]*State, error) {
	var states []*State

	if !allowedState[state] {
		return nil, fmt.Errorf("invalid State: %s", state)
	}
	query := fmt.Sprintf("SELECT * FROM states WHERE %s = true", state)
	err := r.db.SelectContext(ctx, &states, query, state)
	if err != nil {
		return nil, err
	}
	return states, nil
}
func (r *stateRepository) Create(ctx context.Context, state *State) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO states (project_id, name, is_default, is_active, is_backlog, is_canceled) VALUES ($1, $2, $3, $4, $5, $6)`,
		state.ProjectID, state.Name, state.IsDefault, state.IsActive, state.IsBacklog, state.IsCanceled)
	return err
}
func (r *stateRepository) Update(ctx context.Context, state *State) error {
	_, err := r.db.ExecContext(ctx, `UPDATE states SET name = $1, is_active = $2, is_backlog = $3, is_canceled = $4 WHERE id = $5`,
		state.Name, state.IsActive, state.IsBacklog, state.IsCanceled, state.ID)
	return err
}
func (r *stateRepository) Delete(ctx context.Context, stateID string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM states WHERE id = $1`, stateID)
	return err
}

////////////////////////
/// Priority REPOSITORY ///
////////////////////////

type priorityRepository struct {
	db *sqlx.DB
}

func NewPriorityRepository(db *sqlx.DB) PriorityRepository {
	return &priorityRepository{db: db}
}

func (r *priorityRepository) GetByID(ctx context.Context, id string) (*Priority, error) {
	var p Priority
	err := r.db.GetContext(ctx, &p, `SELECT * FROM priorities WHERE id = $1`, id)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *priorityRepository) GetByProject(ctx context.Context, projectID string) ([]*Priority, error) {
	var p []*Priority
	err := r.db.SelectContext(ctx, &p, `SELECT * FROM priorities WHERE project_id = $1`, projectID)
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (r *priorityRepository) Create(ctx context.Context, priority *Priority) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO priorities (project_id, name, color) VALUES ($1, $2, $3)`,
		priority.ProjectID, priority.Name, priority.Color)
	return err
}

func (r *priorityRepository) Update(ctx context.Context, priority *Priority) error {
	_, err := r.db.ExecContext(ctx, `UPDATE priorities SET name = $2, color = $3 WHERE id = $4`,
		priority.Name, priority.Color, priority.ID)
	return err
}

func (r *priorityRepository) Delete(ctx context.Context, priorityID string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM priorities WHERE id = $1`, priorityID)
	return err
}
