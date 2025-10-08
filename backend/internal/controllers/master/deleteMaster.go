package controllers

import (
	"chairTime/internal/app"
	"chairTime/internal/domain"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// Delete master schedule godoc
//
//	@Summary		Delete master
//	@Description	Delete master
//	@Tags			Master
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param			master_id	path		int	true "master_id"
//	@Success		201		{object}	domain.SuccessRes "Deleted master"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/master/{master_id} [delete]
func DeleteMaster(app *app.Application, e echo.Context) error {
	master_id, err := strconv.Atoi(e.Param("master_id"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	err = app.Repository.Master.DeleteMaster(e.Request().Context(), master_id)

	if err != nil {
		return app.CheckForeignKeyViolationErr(e, err, "this master has appointments and cannot be deleted")
	}

	successRes := domain.SuccessRes{
		Status:  http.StatusOK,
		Message: "success",
	}

	return e.JSON(http.StatusOK, successRes)
}
