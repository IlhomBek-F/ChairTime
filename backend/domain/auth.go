package domain

import "github.com/golang-jwt/jwt/v4"

type Authenticator interface {
	GenerateToken(claims jwt.Claims) (string, error)
}
