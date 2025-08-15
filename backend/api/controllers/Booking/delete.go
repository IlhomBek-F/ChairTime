package controllers

import (
	"chairTime/api"
	"chairTime/domain"
	"errors"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Delete booking godoc
//
//	@Summary		Delete booking
//	@Description	Delete booking
//	@Tags			Booking
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param			bookingId	path		int	true "bookingId"
//	@Success		201		{object}	domain.SuccessRes "Deleted booking"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/booking/{bookingId} [delete]
func DeleteBooking(app *api.Application, e echo.Context) error {
	bookingId, err := strconv.Atoi(e.Param("bookingId"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	booking, err := app.Repository.Booking.GetBookingById(bookingId)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.NotFoundResponse(e, errors.New("booking does not exist"))
		} else {
			return app.InternalServerError(e, err)
		}
	}

	err = app.Repository.Booking.DeleteBooking(booking.ID)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.SuccessRes{
		Status:  http.StatusOK,
		Message: "success",
	}

	return e.JSON(http.StatusOK, successRes)
}
