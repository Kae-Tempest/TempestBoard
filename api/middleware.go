package main

import (
	"context"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const UserIDKey contextKey = "userID"

func Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString, err := getTokenFromRequest(r)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}
			return GetSecretKey(), nil
		})

		if err != nil || !token.Valid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		sub, ok := claims["sub"].(string)
		if !ok {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		var userID uint
		id64, err := strconv.ParseUint(sub, 10, 32)
		if err == nil {
			userID = uint(id64)
		}

		ctx := context.WithValue(r.Context(), UserIDKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GetUserIDFromContext(ctx context.Context) (uint, bool) {
	userID, ok := ctx.Value(UserIDKey).(uint)
	return userID, ok
}

func getTokenFromRequest(r *http.Request) (string, error) {
	// Check cookie
	cookie, err := r.Cookie("token")
	if err == nil {
		return cookie.Value, nil
	}

	// Check Authorization header
	authHeader := r.Header.Get("Authorization")
	if authHeader != "" {
		parts := strings.Split(authHeader, " ")
		if len(parts) == 2 && parts[0] == "Bearer" {
			return parts[1], nil
		}
	}

	return "", errors.New("no token found")
}
