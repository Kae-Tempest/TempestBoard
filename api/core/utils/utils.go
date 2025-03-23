package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"os"
)

var secretKey = []byte(os.Getenv("SECRET_KEY"))

func BodyDecoder(r *http.Request, dest interface{}) error {
	contentType := r.Header.Get("Content-Type")

	switch contentType {
	case "application/json":
		return json.NewDecoder(r.Body).Decode(dest)
	default:
		return fmt.Errorf("unsupported content type")
	}
}

func VerifyToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return token, nil
}

func GetTokenFromCookie(r *http.Request) (*jwt.Token, error) {
	tokenString, err := r.Cookie("token")
	if err != nil && errors.Is(err, http.ErrNoCookie) {
		return nil, http.ErrNoCookie
	}

	token, err := VerifyToken(tokenString.Value)
	if err != nil {
		fmt.Printf("Token verification failed: %v\\n", err)
		return nil, err
	}
	
	return token, nil
}
