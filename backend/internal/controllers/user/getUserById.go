package controllers

import (
	"chairTime/internal/app"
	"chairTime/internal/domain"
	"errors"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Get user by id offer godoc
//
//	@Summary		Get user by id
//	@Description	Get user by id
//	@Tags			User
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param          user_id path int true "user_id"
//	@Success		201		{object}	domain.UserRes "User info"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/user/{user_id} [get]
func GetUserById(app *app.Application, e echo.Context) error {
	user_id, err := strconv.Atoi(e.Param("user_id"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	user, err := app.Repository.User.GetUserById(user_id)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.NotFoundResponse(e, errors.New("user with this id does not exist"))
		} else {
			return app.InternalServerError(e, err)
		}
	}

	succesRes := domain.UserRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    user,
	}

	return e.JSON(http.StatusOK, succesRes)
}
