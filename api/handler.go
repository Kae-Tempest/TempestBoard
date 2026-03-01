package main

import (
	"encoding/json"
	"net/http"

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
