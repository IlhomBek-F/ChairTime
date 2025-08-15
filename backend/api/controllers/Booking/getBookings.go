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

// Get bookings by id offer godoc
//
//		@Summary		Get bookings
//		@Description	Get bookings
//		@Tags			Booking
//		@Accept			json
//		@Security       JWT
//		@Produce		json
//	    @Param          user_id path int true "user_id"
//		@Success		201		{object}	domain.BookingListRes "Bookings"
//		@Failure		400		{object}	error
//		@Failure		500		{object}	error
//		@Router			/bookings/{user_id} [get]
func GetBookings(app *api.Application, e echo.Context) error {
	userId, err := strconv.Atoi(e.Param("user_id"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	user, err := app.Repository.User.GetUserById(userId)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.NotFoundResponse(e, errors.New("user does not exist"))
		} else {
			return app.InternalServerError(e, err)
		}
	}

	bookings, err := app.Repository.Booking.GetUserBookings(user.ID)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.BookingListRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    bookings,
	}

	return e.JSON(http.StatusOK, successRes)
}
