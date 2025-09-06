package controllers

import (
	"chairTime/internal/app"
	"chairTime/internal/domain"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// Delete style type schedule godoc
//
//	@Summary		Delete style type
//	@Description	Delete style type
//	@Tags			StyleType
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param			style_type_id	path		int	true "style_type_id"
//	@Success		201		{object}	domain.SuccessRes "Deleted style type"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/style-type/{style_type_id} [delete]
func DeleteStyleType(app *app.Application, e echo.Context) error {
	style_type_id, err := strconv.Atoi(e.Param("style_type_id"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	err = app.Repository.StyleType.DeleteStyleType(style_type_id)

	if err != nil {
		return app.CheckForeignKeyViolationErr(e, err, "this style type connected with appointments and cannot be deleted")
	}

	successRes := domain.SuccessRes{
		Status:  http.StatusOK,
		Message: "success",
	}

	return e.JSON(http.StatusOK, successRes)
}
