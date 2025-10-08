package controllers

import (
	"chairTime/internal/app"
	"chairTime/internal/domain"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// Get master available time slots godoc
//
//	@Summary		Get master available time slots
//	@Description	Get master available time slots
//	@Tags			Master
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param			master_id	path		int	true "master_id"
//	@Param			date	path		string	true "date"
//	@Success		201		{object}	domain.SuccessRes "Deleted master unavailable schedule"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/master/{master_id}/{date} [get]
func GetMasterAvailableTimeSlots(app *app.Application, e echo.Context) error {
	master_id, err := strconv.Atoi(e.Param("master_id"))
	date := e.Param("date")

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	timeSlots, err := app.Repository.Master.GetMasterAvailableTimeSlots(e.Request().Context(), master_id, date)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.SuccessResWithData[[]string]{
		Status:  http.StatusOK,
		Message: "success",
		Data:    timeSlots,
	}

	return e.JSON(http.StatusOK, successRes)
}
