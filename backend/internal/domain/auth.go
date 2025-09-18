package domain

import (
	"chairTime/internal/auth"
)

type Authenticator interface {
	GenerateToken(claims auth.CustomClaims) (string, error)
	GenerateRefreshToken(claims auth.CustomClaims) (string, error)
	ParseToken(token, secretKey string) (*auth.CustomClaims, error)
}

type LoginPayload struct {
	Username string `json:"username" validate:"required,min=3,max=20"`
	Password string `json:"password" validate:"required,min=4,max=72"`
}

type CreateAccountPayload struct {
	Username string `json:"username" validate:"required,min=3,max=20"`
	Password string `json:"password" validate:"required,min=4,max=72"`
	Phone    string `json:"phone" validate:"required,min=4,max=20"`
}

type Credential struct {
	Role         int    `json:"role"`
	ID           int    `json:"id"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type RefreshTokenPayload struct {
	RereshToken string `json:"refresh_token"`
}

type LoginRes = SuccessResWithData[Credential]
type SignUpRes = SuccessResWithData[User]
