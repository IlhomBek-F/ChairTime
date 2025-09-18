package controllers

import (
	_ "chairTime/docs"
	"chairTime/internal/app"
	"chairTime/internal/auth"
	"chairTime/internal/domain"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Sign in godoc
//
//	@Summary		Sign in to account
//	@Description	Sign in to account
//	@Tags			Authentication
//	@Accept			json
//	@Produce		json
//	@Param			payload	body		domain.LoginPayload	true "User credentials"
//	@Success		201		{object}	domain.LoginRes		"Logged in"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/auth/sign-in [post]
func SignIn(app *app.Application, e echo.Context) error {
	userCredential := new(domain.LoginPayload)

	if err := e.Bind(&userCredential); err != nil {
		return app.BadRequestResponse(e, err)
	}

	if err := e.Validate(userCredential); err != nil {
		return app.BadRequestResponse(e, err)
	}

	client, err := app.Repository.Auth.GetUserByName(userCredential.Username)
	master, masterErr := app.Repository.Master.GetMasterByName(userCredential.Username)
	admin, adErr := app.Repository.Admin.GetAdminByName(userCredential.Username)

	if isUnexpectedError(err, masterErr, adErr) {
		return app.InternalServerError(e, err)
	}

	if errors.Is(err, gorm.ErrRecordNotFound) && errors.Is(masterErr, gorm.ErrRecordNotFound) && errors.Is(adErr, gorm.ErrRecordNotFound) {
		return app.UnauthorizedErrorResponse(e, err)
	}

	var user struct {
		ID     int
		RoleId int
	}

	if client.ID != 0 {
		passwordErr := bcrypt.CompareHashAndPassword([]byte(client.Password), []byte(userCredential.Password))
		if passwordErr != nil {
			return app.UnauthorizedErrorResponse(e, passwordErr)
		}

		user.ID = client.ID
		user.RoleId = client.RoleId
	} else if master.ID != 0 {
		passwordErr := bcrypt.CompareHashAndPassword([]byte(master.Password), []byte(userCredential.Password))

		if passwordErr != nil {
			return app.UnauthorizedErrorResponse(e, passwordErr)
		}

		user.ID = master.ID
		user.RoleId = master.RoleId
	} else {
		passwordErr := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(userCredential.Password))

		if passwordErr != nil {
			return app.UnauthorizedErrorResponse(e, passwordErr)
		}

		user.ID = admin.ID
		user.RoleId = admin.RoleId
	}

	claimsAccessToken := auth.CustomClaims{
		Role: user.RoleId,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   strconv.Itoa(user.ID),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(app.Config.Auth.AccessTokenExp)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Audience:  jwt.ClaimStrings{app.Config.Auth.Iss},
		},
	}

	claimsRefreshToken := auth.CustomClaims{
		Role: user.RoleId,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   strconv.Itoa(user.ID),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(app.Config.Auth.RefreshTokenExp)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Audience:  jwt.ClaimStrings{app.Config.Auth.Iss},
		},
	}

	accessToken, accessTokenErr := app.Authenticator.GenerateToken(claimsAccessToken)
	refreshToken, refreshTokenErr := app.Authenticator.GenerateRefreshToken(claimsRefreshToken)

	if accessTokenErr != nil || refreshTokenErr != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.LoginRes{
		Status:  http.StatusOK,
		Message: "Success",
		Data: domain.Credential{
			Role:         user.RoleId,
			ID:           user.ID,
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
		},
	}

	return e.JSON(http.StatusOK, successRes)
}

func isUnexpectedError(errs ...error) bool {
	var err error

	for _, e := range errs {
		if e != nil && !errors.Is(e, gorm.ErrRecordNotFound) {
			err = e
		}
	}

	return err != nil
}
