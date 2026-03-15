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

	w.WriteHeader(http.StatusOK)
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
