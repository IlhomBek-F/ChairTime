package auth

import (
	"errors"

	"github.com/golang-jwt/jwt/v4"
)

type JwtAuthenticator struct {
	secret string
	aud    string
	iss    string
}

type CustomClaims struct {
	Role int
	jwt.RegisteredClaims
}

func NewJwtAuthenticator(secret, aud, iss string) *JwtAuthenticator {
	return &JwtAuthenticator{
		secret: secret,
		aud:    aud,
		iss:    iss,
	}
}

func (a *JwtAuthenticator) GenerateToken(claims CustomClaims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(a.secret))

	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (a JwtAuthenticator) ParseToken(tokenStr, secretKey string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("error parsing token")
}
