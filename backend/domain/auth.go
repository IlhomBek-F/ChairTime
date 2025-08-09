package domain

import (
	"github.com/golang-jwt/jwt/v4"
)

type Authenticator interface {
	GenerateToken(claims jwt.Claims) (string, error)
}

type LoginRepo interface {
	GetUserByName(username string) (User, error)
	Login(username, password string) (LoginRes, error)
}

type LoginPayload struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Credential struct {
	ID          int    `json:"id"`
	AccessToken string `json:"access_token"`
}

type LoginRes = SuccessResWithData[Credential]
