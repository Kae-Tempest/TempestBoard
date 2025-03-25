package router

import (
	"net/http"
	"tempestboard/core"
	"tempestboard/core/middleware"
)

/**
* Applique les Middleware de haut en bas
* ```go
* mux.Handle("/api/users", chain(http.HandlerFunc(usersHandler), authMiddleware, loggingMiddleware))
* ```
 */
func chain(h http.Handler, middlewares ...func(http.Handler) http.Handler) http.Handler {
	for _, m := range middlewares {
		h = m(h)
	}
	return h
}

func Router(s *http.ServeMux, a *core.App) {
	s.HandleFunc("/login", a.Controllers.Auth.HandleLogin)
	s.HandleFunc("/register", a.Controllers.Auth.HandleRegister)
	s.Handle("/users/me", chain(
		http.HandlerFunc(a.Controllers.User.Me),
		middleware.AuthMiddleware))
	s.Handle("/projects", chain(
		http.HandlerFunc(a.Controllers.Project.Create),
		middleware.AuthMiddleware))

}
