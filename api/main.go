package main

import (
	"errors"
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
	"tempestboard/controllers"
	"tempestboard/core"
	"tempestboard/database"
	"tempestboard/models"
	"tempestboard/router"
)

func main() {

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %s", err)
	}

	app, err := newApp()
	if err != nil {
		fmt.Printf("Failed to initialize application: %v\n", err)
		os.Exit(1)
	}

	mux := http.NewServeMux()
	router.Router(mux, app)

	err = http.ListenAndServe(":8080", mux)
	if errors.Is(err, http.ErrServerClosed) {
		fmt.Println("http server closed")
	} else if err != nil {
		fmt.Println("http server error:", err)
		os.Exit(1)
	}
}

func newApp() (*core.App, error) {
	db, err := database.NewConnection()
	if err != nil {
		return nil, fmt.Errorf("database connection error: %v", err)
	}

	a := &core.App{
		DB: db,
	}

	a.Controllers = controllers.NewControllers(a.DB)

	err = a.DB.AutoMigrate(&models.User{}, &models.Project{}, &models.Role{}, &models.Permission{})
	if err != nil {
		return nil, err
	}

	return a, nil
}
