package auth

import (
	"errors"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type JwtAuthenticator struct {
	AccessTokenSecret  string
	RefreshTokenSecret string
	aud                string
	iss                string
}

type CustomClaims struct {
	Role int
	jwt.RegisteredClaims
}

func NewJwtAuthenticator(accessTokenSecret, refreshTokenSecret, aud, iss string) *JwtAuthenticator {
	return &JwtAuthenticator{
		AccessTokenSecret:  accessTokenSecret,
		RefreshTokenSecret: refreshTokenSecret,
		aud:                aud,
		iss:                iss,
	}
}

func (a *JwtAuthenticator) GenerateToken(claims CustomClaims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(a.AccessTokenSecret))

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
		return nil, errors.New("error parsing token")
	}

	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("error parsing token")
}

func (a JwtAuthenticator) GenerateRefreshToken(claims CustomClaims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(a.RefreshTokenSecret))

	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (a JwtAuthenticator) CreateNewClaims(userId, roleId int, exp time.Duration, iss string) CustomClaims {
	now := time.Now()

	return CustomClaims{
		Role: roleId,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   strconv.Itoa(userId),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(exp)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Audience:  jwt.ClaimStrings{iss},
		},
	}
}
