package controllers

import (
	_ "chairTime/docs"
	"chairTime/internal/app"
	"chairTime/internal/domain"
	"context"
	"errors"
	"net/http"

	"github.com/IlhomBek-F/sliceutils"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserInfo struct {
	Id       int
	Password string
	RoleId   int
}

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

	result, err := checkUserExistence(app, e.Request().Context(), userCredential.Username)

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return app.UnauthorizedErrorResponse(e, err)
	} else if err != nil {
		return app.InternalServerError(e, err)
	}

	passwordErr := bcrypt.CompareHashAndPassword([]byte(result.Password), []byte(userCredential.Password))

	if passwordErr != nil {
		return app.UnauthorizedErrorResponse(e, passwordErr)
	}

	claimsAccessToken := app.Authenticator.CreateNewClaims(result.Id, result.RoleId, app.Config.Auth.AccessTokenExp, app.Config.Auth.Iss)
	claimsRefreshToken := app.Authenticator.CreateNewClaims(result.Id, result.RoleId, app.Config.Auth.RefreshTokenExp, app.Config.Auth.Iss)

	accessToken, accessTokenErr := app.Authenticator.GenerateToken(claimsAccessToken)
	refreshToken, refreshTokenErr := app.Authenticator.GenerateRefreshToken(claimsRefreshToken)

	if accessTokenErr != nil || refreshTokenErr != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.LoginRes{
		Status:  http.StatusOK,
		Message: "Success",
		Data: domain.Credential{
			Role:         result.RoleId,
			ID:           result.Id,
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
		},
	}

	return e.JSON(http.StatusOK, successRes)
}

func checkUserExistence(app *app.Application, rCtx context.Context, userName string) (UserInfo, error) {
	user, userErr := app.Repository.Auth.GetUserByName(rCtx, userName)
	master, masterErr := app.Repository.Master.GetMasterByName(rCtx, userName)
	admin, adminErr := app.Repository.Admin.GetAdminByName(rCtx, userName)

	isSomeUnexpectedError := sliceutils.Some([]error{userErr, masterErr, adminErr}, func(err error, _ int) bool {
		return err != nil && !errors.Is(err, gorm.ErrRecordNotFound)
	})

	if isSomeUnexpectedError {
		return UserInfo{}, gorm.ErrInvalidDB
	}

	isUserNotFound := sliceutils.Every([]error{userErr, masterErr, adminErr}, func(err error, _ int) bool {
		return errors.Is(err, gorm.ErrRecordNotFound)
	})

	if isUserNotFound {
		return UserInfo{}, gorm.ErrRecordNotFound
	}

	if user.ID != 0 {
		return UserInfo{Id: user.ID, Password: user.Password, RoleId: user.RoleId}, nil
	}

	if master.ID != 0 {
		return UserInfo{Id: master.ID, Password: master.Password, RoleId: master.RoleId}, nil
	}

	return UserInfo{Id: admin.ID, Password: admin.Password, RoleId: admin.RoleId}, nil
}
