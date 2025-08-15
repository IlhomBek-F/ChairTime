package routes

import (
	"chairTime/api"
	bookingController "chairTime/api/controllers/Booking"

	"github.com/labstack/echo/v4"
)

func BookingRoute(app *api.Application, groupRoute echo.Group) {
	groupRoute.POST("/create-booking", app.RouteHandler(bookingController.CreateBooking))
	groupRoute.GET("/bookings/:user_id", app.RouteHandler(bookingController.GetBookings))
	groupRoute.DELETE("/booking/:bookingId", app.RouteHandler(bookingController.DeleteBooking))
}
