package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	i "tempestboard.com/m/v2/internal"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		slog.Warn("Could not load .env file", "error", err)
	}

	db, err := i.InitDB()
	if err != nil {
		slog.Error("Failed to connect to database", "error", err)
		os.Exit(1)
	}
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true}))

	ctx := context.Background()
	shutdown, err := i.SetupOTelSDK(ctx)
	if err != nil {
		logger.Error("Failed to initialize OpenTelemetry: %v\n", err)
		os.Exit(1)
	}
	defer func() {
		_ = shutdown(context.Background())
	}()

	accountRepo := i.NewAccountRepository(db)
	resetRepo := i.NewPasswordResetTokenRepository(db)
	emailService := i.NewEmailService(logger)
	accountService := i.NewAccountService(accountRepo, resetRepo, emailService, logger)
	AccountHandler := i.NewAccountHandler(accountService)
	projectRepo := i.NewProjectRepository(db)
	projectService := i.NewProjectService(projectRepo, accountRepo, logger)
	ProjectHandler := i.NewProjectHandler(projectService)

	mux := http.NewServeMux()
	mux.Handle("POST /login", otelhttp.NewHandler(http.HandlerFunc(AccountHandler.Login), "Login"))
	mux.Handle("POST /register", otelhttp.NewHandler(http.HandlerFunc(AccountHandler.Register), "Register"))
	mux.Handle("POST /forgot-password", otelhttp.NewHandler(http.HandlerFunc(AccountHandler.ForgotPassword), "ForgotPassword"))
	mux.Handle("POST /reset-password", otelhttp.NewHandler(http.HandlerFunc(AccountHandler.ResetPassword), "ResetPassword"))

	// Protected routes
	mux.Handle("GET /users/me", i.Auth(otelhttp.NewHandler(http.HandlerFunc(AccountHandler.Me), "Me")))
	mux.Handle("PUT /users/update-password", i.Auth(otelhttp.NewHandler(http.HandlerFunc(AccountHandler.UpdatePassword), "UpdatePassword")))

	mux.Handle("GET /project/{id}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(ProjectHandler.GetByID), "GetByID")))

	slog.Info("Server listening on :8080")

	if err := http.ListenAndServe(":8080", mux); err != nil && !errors.Is(err, http.ErrServerClosed) {
		logger.Error("HTTP server error", "error", err)
		os.Exit(1)
	}
}
