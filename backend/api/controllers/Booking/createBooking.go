package controllers

import (
	"chairTime/api"
	"chairTime/domain"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Create booking godoc
//
//	@Summary		Create booking
//	@Description	Create booking
//	@Tags			booking
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param			payload	body		domain.CreateBookingPayload	true "Booking payload"
//	@Success		201		{object}	domain.SuccessRes		"Created new booking"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/create-booking [post]
func CreateBooking(app *api.Application, e echo.Context) error {
	var bookingPayload domain.CreateBookingPayload

	if err := e.Bind(&bookingPayload); err != nil {
		return app.BadRequestResponse(e, err)
	}

	// bookingExist, err := app.Repository.Booking.CheckBookingExist(user.user_id, 2)
	_, err := app.Repository.Booking.CreateBooking(bookingPayload)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.SuccessRes{
		Status:  http.StatusOK,
		Message: "success",
	}

	return e.JSON(http.StatusOK, successRes)
}
