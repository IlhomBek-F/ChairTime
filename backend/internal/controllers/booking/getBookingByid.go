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

// Get booking by id offer godoc
//
//		@Summary		Get booking by id
//		@Description	Get booking by id
//		@Tags			Booking
//		@Accept			json
//		@Security       JWT
//		@Produce		json
//	    @Param          id path int true "booking id"
//		@Success		201		{object}	domain.BookingByIdRes "Booking"
//		@Failure		400		{object}	error
//		@Failure		500		{object}	error
//		@Router			/booking/{id} [get]
func GetBookingById(app *app.Application, e echo.Context) error {
	bookingId, err := strconv.Atoi(e.Param("id"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	booking, err := app.Repository.Booking.GetBookingById(e.Request().Context(), bookingId)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.NotFoundResponse(e, errors.New("booking does not exist"))
		} else {
			return app.InternalServerError(e, err)
		}
	}

	successRes := domain.BookingByIdRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    booking,
	}

	return e.JSON(http.StatusOK, successRes)
}
