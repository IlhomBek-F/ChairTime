package controllers

import (
	"chairTime/api"
	_ "chairTime/docs"
	"chairTime/domain"
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// sign-up godoc
//
//	@Summary		Create a new account
//	@Description	Create a new account
//	@Tags			authentication
//	@Accept			json
//	@Produce		json
//	@Param			payload	body		domain.LoginPayload	true "User credentials"
//	@Success		201		{object}	domain.SignUpRes "Created new account"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/auth/sign-up [post]
func SignUp(app *api.Application, e echo.Context) error {
	var userPayload domain.LoginPayload

	if err := e.Bind(&userPayload); err != nil {
		return app.BadRequestResponse(e, err)
	}

	user, err := app.Repository.Auth.GetUserByName(userPayload.Username)

	if user.ID != 0 {
		return app.ConflictResponse(e, errors.New("username already exists"))
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return app.InternalServerError(e, err)
	}

	hashUserPassword, err := bcrypt.GenerateFromPassword([]byte(userPayload.Password), bcrypt.DefaultCost)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	createdNewUser, err := app.Repository.Auth.SignUp(userPayload.Username, string(hashUserPassword), userPayload.Phone)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.SignUpRes{
		Status:  http.StatusCreated,
		Message: "Success",
		Data:    createdNewUser,
	}

	return e.JSON(http.StatusCreated, successRes)
}
