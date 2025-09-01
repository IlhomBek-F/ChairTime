package controllers

import (
	"chairTime/internal/app"
	"chairTime/internal/domain"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// Delete master unavailable schedule godoc
//
//	@Summary		Delete master unavailable schedule
//	@Description	Delete master unavailable schedule
//	@Tags			Master
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param			unavailable_schedule_id	path		int	true "unavailable_schedule_id"
//	@Success		201		{object}	domain.SuccessRes "Deleted master unavailable schedule"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/master/{unavailable_schedule_id} [delete]
func DeleteMasterUnavailableSchedule(app *app.Application, e echo.Context) error {
	unavailable_schedule_id, err := strconv.Atoi(e.Param("unavailable_schedule_id"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	err = app.Repository.Master.DeleteMasterUnavailableSchedule(unavailable_schedule_id)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.SuccessRes{
		Status:  http.StatusOK,
		Message: "success",
	}

	return e.JSON(http.StatusOK, successRes)
}
