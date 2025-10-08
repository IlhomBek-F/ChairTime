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

// Delete user godoc
//
//	@Summary		Delete user
//	@Description	Delete user
//	@Tags			User
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param			user_id	path		int	true "user_id"
//	@Success		201		{object}	domain.SuccessRes "Deleted user"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/user/{user_id} [delete]
func DeleteUser(app *app.Application, e echo.Context) error {
	user_id, err := strconv.Atoi(e.Param("user_id"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	user, err := app.Repository.User.GetUserById(e.Request().Context(), user_id)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.NotFoundResponse(e, errors.New("user does not exist"))
		} else {
			return app.InternalServerError(e, err)
		}
	}

	err = app.Repository.User.DeleteUser(e.Request().Context(), user.ID)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.SuccessRes{
		Status:  http.StatusOK,
		Message: "success",
	}

	return e.JSON(http.StatusOK, successRes)
}
