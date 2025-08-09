package controllers

import (
	"chairTime/api"
	"chairTime/domain"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Login(app *api.Application, e echo.Context) error {
	var userCredential domain.LoginPayload

	if err := e.Bind(&userCredential); err != nil {
		return app.BadRequestResponse(e, err)
	}

	user, err := app.Repository.Auth.GetUserByName(userCredential.Username)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.UnauthorizedErrorResponse(e, err)
		} else {
			return app.InternalServerError(e, err)
		}
	}

	passwordErr := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userCredential.Password))

	if passwordErr != nil {
		return app.UnauthorizedErrorResponse(e, passwordErr)
	}

	claims := jwt.RegisteredClaims{
		Subject:   strconv.Itoa(user.ID),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(app.Config.Auth.Exp)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		NotBefore: jwt.NewNumericDate(time.Now()),
		Audience:  jwt.ClaimStrings{app.Config.Auth.Iss},
	}

	token, err := app.Authenticator.GenerateToken(claims)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.LoginRes{
		Status:  http.StatusOK,
		Message: "Success",
		Data: domain.Credential{
			ID:          user.ID,
			AccessToken: token,
		},
	}

	return e.JSON(http.StatusOK, successRes)
}
