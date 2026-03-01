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
	accountService := i.NewAccountService(accountRepo, logger)
	AccountHandler := i.NewAccountHandler(accountService)

	mux := http.NewServeMux()
	mux.Handle("POST /login", otelhttp.NewHandler(http.HandlerFunc(AccountHandler.Login), "Login"))

	slog.Info("Server listening on :8080")

	if err := http.ListenAndServe(":8080", mux); err != nil && !errors.Is(err, http.ErrServerClosed) {
		logger.Error("HTTP server error", "error", err)
		os.Exit(1)
	}
}
