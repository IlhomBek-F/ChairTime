package controllers

import (
	"chairTime/internal/app"
	"chairTime/internal/domain"
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Update booking godoc
//
//	@Summary		Update booking
//	@Description	Update booking
//	@Tags			Booking
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param			payload	body		domain.Booking	true "Booking payload"
//	@Success		201		{object}	domain.CreateBookingRes		"Update booking"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/booking/update [put]
func UpdateBooking(app *app.Application, e echo.Context) error {
	var bookingPayload domain.Booking

	if err := e.Bind(&bookingPayload); err != nil {
		return app.BadRequestResponse(e, err)
	}

	_, err := app.Repository.Booking.GetBookingById(e.Request().Context(), bookingPayload.ID)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.NotFoundResponse(e, errors.New("booking not found"))
		} else {
			return app.InternalServerError(e, err)
		}
	}

	updatedBooking, err := app.Repository.Booking.UpdateBooking(e.Request().Context(), bookingPayload)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.CreateBookingRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    updatedBooking,
	}

	return e.JSON(http.StatusOK, successRes)
}
