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

	issueRepo := i.NewIssueRepository(db)
	issueService := i.NewIssueService(issueRepo, logger)
	IssueHandler := i.NewIssueHandler(issueService)

	stateRepo := i.NewStateRepository(db)
	stateService := i.NewStateService(stateRepo, logger)
	StateHandler := i.NewStateHandler(stateService)

	priorityRepo := i.NewPriorityRepository(db)
	priorityService := i.NewPriorityService(priorityRepo, logger)
	PriorityHandler := i.NewPriorityHandler(priorityService)

	mux := http.NewServeMux()
	mux.Handle("POST /login", otelhttp.NewHandler(http.HandlerFunc(AccountHandler.Login), "Login"))
	mux.Handle("POST /register", otelhttp.NewHandler(http.HandlerFunc(AccountHandler.Register), "Register"))
	mux.Handle("POST /forgot_password", otelhttp.NewHandler(http.HandlerFunc(AccountHandler.ForgotPassword), "ForgotPassword"))
	mux.Handle("POST /reset_password", otelhttp.NewHandler(http.HandlerFunc(AccountHandler.ResetPassword), "ResetPassword"))

	// Protected routes
	mux.Handle("GET /users/me", i.Auth(otelhttp.NewHandler(http.HandlerFunc(AccountHandler.Me), "Me")))
	mux.Handle("PUT /users/update_password", i.Auth(otelhttp.NewHandler(http.HandlerFunc(AccountHandler.UpdatePassword), "UpdatePassword")))

	mux.Handle("GET /project/{id}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(ProjectHandler.GetByID), "GetByID")))
	mux.Handle("GET /project/owner/{id}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(ProjectHandler.GetByOwner), "GetByOwner")))
	mux.Handle("GET /project/name/{name}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(ProjectHandler.GetByName), "GetByName")))
	mux.Handle("GET /project/tag_name", i.Auth(otelhttp.NewHandler(http.HandlerFunc(ProjectHandler.GetByTagName), "GetByTagName")))
	mux.Handle("POST /project/create", i.Auth(otelhttp.NewHandler(http.HandlerFunc(ProjectHandler.Create), "Create")))
	mux.Handle("PUT /project/update", i.Auth(otelhttp.NewHandler(http.HandlerFunc(ProjectHandler.Update), "Update")))
	mux.Handle("DELETE /project/{id}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(ProjectHandler.Delete), "Delete")))

	mux.Handle("GET /issues/{id}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(IssueHandler.GetByID), "GetByID")))
	mux.Handle("GET /issues/user/{user_id}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(IssueHandler.GetAll), "GetAll")))
	mux.Handle("POST /issues/create", i.Auth(otelhttp.NewHandler(http.HandlerFunc(IssueHandler.Create), "Create")))
	mux.Handle("PUT /issues/update", i.Auth(otelhttp.NewHandler(http.HandlerFunc(IssueHandler.Update), "Update")))
	mux.Handle("DELETE /issues/{id}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(IssueHandler.Delete), "Delete")))

	mux.Handle("GET /states/{id}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(StateHandler.GetByID), "GetByID")))
	mux.Handle("GET /states/project/{id}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(StateHandler.GetByProject), "GetByProject")))
	mux.Handle("GET /states/name/{name}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(StateHandler.GetByName), "GetByName")))
	mux.Handle("GET /states/state/{state)", i.Auth(otelhttp.NewHandler(http.HandlerFunc(StateHandler.GetByState), "GetByState")))
	mux.Handle("POST /states/create", i.Auth(otelhttp.NewHandler(http.HandlerFunc(StateHandler.Create), "Create")))
	mux.Handle("PUT /states/update", i.Auth(otelhttp.NewHandler(http.HandlerFunc(StateHandler.Update), "Update")))
	mux.Handle("DELETE /states/{id}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(StateHandler.Delete), "Delete")))

	mux.Handle("GET /priorities/{id}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(PriorityHandler.GetByID), "GetByID")))
	mux.Handle("GET /priorities/project/{id}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(PriorityHandler.GetByProject), "GetByProject")))
	mux.Handle("POST /priorities/create", i.Auth(otelhttp.NewHandler(http.HandlerFunc(PriorityHandler.Create), "Create")))
	mux.Handle("PUT /priorities/update", i.Auth(otelhttp.NewHandler(http.HandlerFunc(PriorityHandler.Update), "Update")))
	mux.Handle("DELETE /priorities/{id}", i.Auth(otelhttp.NewHandler(http.HandlerFunc(PriorityHandler.Delete), "Delete")))

	slog.Info("Server listening on :8080")

	if err := http.ListenAndServe(":8080", mux); err != nil && !errors.Is(err, http.ErrServerClosed) {
		logger.Error("HTTP server error", "error", err)
		os.Exit(1)
	}
}
