package controllers

import (
	"chairTime/internal/app"
	"chairTime/internal/auth"
	"chairTime/internal/domain"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

// RefreshToken godoc
//
//	@Summary		Refresh token
//	@Description	Refresh token
//	@Tags			Authentication
//	@Accept			json
//	@Produce		json
//	@Param			payload	body		domain.RefreshTokenPayload	true "Refresh token"
//	@Success		201		{object}	domain.LoginRes		"Refresh token"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/auth/refresh_token [post]
func GenerateRefreshToken(app *app.Application, e echo.Context) error {
	var refreshTokenPayload domain.RefreshTokenPayload

	if err := e.Bind(&refreshTokenPayload); err != nil {
		return app.BadRequestResponse(e, err)
	}

	claims, err := app.Authenticator.ParseToken(refreshTokenPayload.RereshToken, app.Config.Auth.RefreshTokenSecret)

	if err != nil {
		return app.UnauthorizedErrorResponse(e, errors.New("failed parsing token"))
	}

	userId, parseUserIdErr := strconv.Atoi(claims.Subject)

	if parseUserIdErr != nil {
		return app.UnauthorizedErrorResponse(e, errors.New("failed parsing token"))
	}

	claimsAccessToken := auth.CustomClaims{
		Role: claims.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   claims.RegisteredClaims.Subject,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(app.Config.Auth.AccessTokenExp)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Audience:  jwt.ClaimStrings{app.Config.Auth.Iss},
		},
	}

	claimsRefreshToken := auth.CustomClaims{
		Role: claims.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   claims.RegisteredClaims.Subject,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(app.Config.Auth.RefreshTokenExp)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Audience:  jwt.ClaimStrings{app.Config.Auth.Iss},
		},
	}

	accessToken, accessTokenErr := app.Authenticator.GenerateToken(claimsAccessToken)
	refreshToken, refreshTokenErr := app.Authenticator.GenerateRefreshToken(claimsRefreshToken)

	if accessTokenErr != nil || refreshTokenErr != nil {
		return app.UnauthorizedErrorResponse(e, errors.New("failed generating refresh token"))
	}

	successRes := domain.LoginRes{
		Status:  http.StatusCreated,
		Message: "Success",
		Data: domain.Credential{
			Role:         claims.Role,
			ID:           userId,
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
		},
	}

	return e.JSON(http.StatusCreated, successRes)
}
