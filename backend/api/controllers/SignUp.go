package controllers

import (
	"chairTime/api"
	"chairTime/domain"
	"net/http"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

func SignUp(app *api.Application, e echo.Context) error {
	var userPayload domain.LoginPayload

	if err := e.Bind(&userPayload); err != nil {
		return app.BadRequestResponse(e, err)
	}

	user, err := app.Repository.Auth.GetUserByName(userPayload.Username)

	if user.ID != 0 && err == nil {
		return app.ConflictResponse(e, err)
	}

	if err != nil {
		return app.InternalServerError(e, err)
	}

	hashUserPassword, err := bcrypt.GenerateFromPassword([]byte(userPayload.Password), bcrypt.DefaultCost)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	createdNewUser, err := app.Repository.Auth.SignUp(userPayload.Username, string(hashUserPassword))

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.SuccessResWithData[domain.User]{
		Status:  http.StatusCreated,
		Message: "Success",
		Data:    createdNewUser,
	}

	return e.JSON(http.StatusCreated, successRes)
}
