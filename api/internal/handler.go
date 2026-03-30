package internal

import (
	"encoding/json"
	"net/http"
	"strconv"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/codes"
)

type AccountHandler struct {
	service *AccountService
}

func NewAccountHandler(service *AccountService) *AccountHandler {
	return &AccountHandler{service: service}
}

func (h *AccountHandler) setTokenCookie(w http.ResponseWriter, token string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		MaxAge:   86400,
		Path:     "/",
		Secure:   false,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
}

func (h *AccountHandler) Me(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("account-handler").Start(r.Context(), "Me")
	defer span.End()

	userID, ok := GetUserIDFromContext(ctx)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	user, err := h.service.GetUserByID(ctx, userID)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(user); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
	}
}

func (h *AccountHandler) Login(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("account-handler").Start(r.Context(), "Login")
	defer span.End()

	var req LoginDto
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	token, err := h.service.Login(ctx, req.Email, req.Password)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusUnauthorized)
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
			span.RecordError(err)
		}
		return
	}

	h.setTokenCookie(w, token)
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	if _, err := w.Write([]byte("{}")); err != nil {
		span.RecordError(err)
	}
}

func (h *AccountHandler) Register(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("account-handler").Start(r.Context(), "Register")
	defer span.End()

	var req RegisterDto
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	token, err := h.service.Register(ctx, req)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusBadRequest)
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
			span.RecordError(err)
		}
		return
	}

	h.setTokenCookie(w, token)
	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	if _, err := w.Write([]byte("{}")); err != nil {
		span.RecordError(err)
	}
}

func (h *AccountHandler) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("account-handler").Start(r.Context(), "ForgotPassword")
	defer span.End()

	var req ForgotPasswordDto
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if err := h.service.ForgotPassword(ctx, req.Email); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Failed to send reset email"})
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]string{"message": "Email sent if user exists"})
}

func (h *AccountHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("account-handler").Start(r.Context(), "ResetPassword")
	defer span.End()

	var req ResetPasswordDto
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if err := h.service.ResetPassword(ctx, req); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusBadRequest)
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]string{"message": "Password updated successfully"})
}

func (h *AccountHandler) UpdatePassword(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("account-handler").Start(r.Context(), "UpdatePassword")
	defer span.End()

	userId, _ := GetUserIDFromContext(ctx)
	var dto PasswordDto
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	user, err := h.service.repo.GetByID(ctx, strconv.Itoa(int(userId)))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusBadRequest)
	}

	errUPassword := h.service.UpdatePassword(ctx, dto, user)
	if errUPassword != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, errUPassword.Error())
		w.WriteHeader(http.StatusBadRequest)
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *AccountHandler) Logout(w http.ResponseWriter, r *http.Request) {
	_, span := otel.Tracer("account-handler").Start(r.Context(), "Logout")
	defer span.End()

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		MaxAge:   -1,
		Path:     "/",
		HttpOnly: true,
	})
	w.WriteHeader(http.StatusOK)
}

type ProjectHandler struct {
	service *ProjectService
}

func NewProjectHandler(service *ProjectService) *ProjectHandler {
	return &ProjectHandler{service: service}
}

func (h *ProjectHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("project-handler").Start(r.Context(), "GetByID")

	p, err := h.service.GetByID(ctx, r.PathValue("id"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(p); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return
	}
}

func (h *ProjectHandler) GetByOwner(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("project-handler").Start(r.Context(), "GetByOwner")

	p, err := h.service.GetByOwner(ctx, r.PathValue("id"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(p); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return
	}
}

func (h *ProjectHandler) GetByName(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("project-handler").Start(r.Context(), "GetByName")

	p, err := h.service.GetByName(ctx, r.PathValue("name"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(p); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return
	}
}

func (h *ProjectHandler) GetByTagName(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("project-handler").Start(r.Context(), "GetByTagName")

	p, err := h.service.GetByTagName(ctx, r.PathValue("tag_name"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusNotFound)
		return

	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(p); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return
	}
}

func (h *ProjectHandler) Create(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("project-handler").Start(r.Context(), "Create")

	var req ProjectDto
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	p, err := h.service.Create(ctx, req)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusUnauthorized)
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
			span.RecordError(err)
		}
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(p); err != nil {
		span.RecordError(err)
	}
}

func (h *ProjectHandler) Update(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("project-handler").Start(r.Context(), "Update")

	var req Project
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	_, err := h.service.Update(ctx, &req)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusUnauthorized)
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
			span.RecordError(err)
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *ProjectHandler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("project-handler").Start(r.Context(), "Delete")

	err := h.service.Delete(ctx, r.PathValue("id"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusUnauthorized)
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
			span.RecordError(err)
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

type IssueHandler struct {
	service *IssueService
}

func NewIssueHandler(service *IssueService) *IssueHandler {
	return &IssueHandler{service: service}
}

func (h *IssueHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("issue-handler").Start(r.Context(), "GetByID")

	issues, err := h.service.GetByID(ctx, r.PathValue("id"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(issues); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
	}
}

func (h *IssueHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("issue-handler").Start(r.Context(), "GetAll")

	issues, err := h.service.GetAll(ctx, r.PathValue("user_id"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(issues); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
	}
}

func (h *IssueHandler) Create(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("issue-handler").Start(r.Context(), "Create")

	var req IssueDto
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	issues, err := h.service.Create(ctx, req)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusUnauthorized)
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
			span.RecordError(err)
		}
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(issues); err != nil {
		span.RecordError(err)
	}
}

func (h *IssueHandler) Update(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("issue-handler").Start(r.Context(), "Update")

	var req Issue
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	_, err := h.service.Update(ctx, &req)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusUnauthorized)
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
			span.RecordError(err)
		}
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *IssueHandler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("issue-handler").Start(r.Context(), "Delete")

	err := h.service.Delete(ctx, r.PathValue("id"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusUnauthorized)
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
			span.RecordError(err)
		}
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

type StateHandler struct {
	service *StateService
}

func NewStateHandler(service *StateService) *StateHandler {
	return &StateHandler{service: service}
}

func (h *StateHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("state-handler").Start(r.Context(), "GetByID")

	states, err := h.service.GetByID(ctx, r.PathValue("id"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(states); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
	}
}

func (h *StateHandler) GetByProject(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("state-handler").Start(r.Context(), "GetByProject")

	states, err := h.service.GetByProject(ctx, r.PathValue("project_id"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(states); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
	}
}

func (h *StateHandler) GetByName(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("state-handler").Start(r.Context(), "GetByName")

	states, err := h.service.GetByName(ctx, r.PathValue("name"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(states); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
	}
}

func (h *StateHandler) GetByState(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("state-handler").Start(r.Context(), "GetByState")

	states, err := h.service.GetByState(ctx, r.PathValue("state_id"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(states); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
	}
}

func (h *StateHandler) Create(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("state-handler").Start(r.Context(), "Create")

	var req StateDto
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	states, err := h.service.Create(ctx, req)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusUnauthorized)
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
			span.RecordError(err)
		}
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(states); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
	}
}

func (h *StateHandler) Update(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("state-handler").Start(r.Context(), "Update")

	var req State
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	_, err := h.service.Update(ctx, &req)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusUnauthorized)
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
			span.RecordError(err)
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *StateHandler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("state-handler").Start(r.Context(), "Delete")

	err := h.service.Delete(ctx, r.PathValue("id"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusUnauthorized)
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
			span.RecordError(err)
		}
		return
	}
}

type PriorityHandler struct {
	service *PriorityService
}

func NewPriorityHandler(service *PriorityService) *PriorityHandler {
	return &PriorityHandler{service: service}
}

func (h *PriorityHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("priority-handler").Start(r.Context(), "GetByID")

	priority, err := h.service.GetByID(ctx, r.PathValue("id"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(priority); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
	}
}

func (h *PriorityHandler) GetByProject(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("priority-handler").Start(r.Context(), "GetByProject")

	priority, err := h.service.GetByProject(ctx, r.PathValue("project_id"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(priority); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
	}
}

func (h *PriorityHandler) Create(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("priority-handler").Start(r.Context(), "Create")

	var req PriorityDto
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	priority, err := h.service.Create(ctx, req)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusUnauthorized)
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
			span.RecordError(err)
		}
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(priority); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
	}
}

func (h *PriorityHandler) Update(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("priority-handler").Start(r.Context(), "Update")

	var req Priority
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	_, err := h.service.Update(ctx, &req)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusUnauthorized)
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
			span.RecordError(err)
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *PriorityHandler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx, span := otel.Tracer("priority-handler").Start(r.Context(), "Delete")

	err := h.service.Delete(ctx, r.PathValue("id"))
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		w.WriteHeader(http.StatusUnauthorized)
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{"error": err.Error()}); err != nil {
			span.RecordError(err)
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
