package controllers

import (
	"chairTime/api"
	"chairTime/domain"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get users godoc
//
//	@Summary		Get users
//	@Description	Get users
//	@Tags			User
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Success		201		{object}	domain.UserListRes "Users"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/users [get]
func GetUsers(app *api.Application, e echo.Context) error {

	users, err := app.Repository.User.GetUsers()

	if err != nil {
		return app.InternalServerError(e, err)
	}

	succesRes := domain.UserListRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    users,
	}

	return e.JSON(http.StatusOK, succesRes)
}
