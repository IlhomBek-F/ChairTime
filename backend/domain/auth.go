package domain

import (
	"github.com/golang-jwt/jwt/v4"
)

type Authenticator interface {
	GenerateToken(claims jwt.Claims) (string, error)
}

type LoginPayload struct {
	Username string `json:"username" validate:"required,min=3,max=20"`
	Password string `json:"password" validate:"required,min=4,max=72"`
}

type Credential struct {
	ID          int    `json:"id"`
	AccessToken string `json:"access_token"`
}

type LoginRes = SuccessResWithData[Credential]
