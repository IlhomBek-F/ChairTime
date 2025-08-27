package controllers

import (
	"chairTime/api"
	_ "chairTime/docs"
	"chairTime/domain"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// Get master bookings godoc
//
//	@Summary		Get bookings
//	@Description	Get bookings
//	@Tags			Master
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param          master_id  path  int true "master_id"
//	@Success		201		{object}	domain.MasterBookingRes "Master bookings"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/master/{master_id}/bookings [get]
func GetMasterBookings(app *api.Application, e echo.Context) error {
	masterId, err := strconv.Atoi(e.Param("master_id"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	masters, err := app.Repository.Master.GetMasterBooking(masterId)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.MasterBookingRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    masters,
	}

	return e.JSON(http.StatusOK, successRes)
}
