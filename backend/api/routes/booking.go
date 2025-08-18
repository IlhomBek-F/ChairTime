package routes

import (
	"chairTime/api"
	bookingController "chairTime/api/controllers/booking"

	"github.com/labstack/echo/v4"
)

func BookingRoute(app *api.Application, groupRoute echo.Group) {
	groupRoute.GET("/booking/:id", app.RouteHandler(bookingController.GetBookingById))
	groupRoute.GET("/bookings/:user_id", app.RouteHandler(bookingController.GetBookings))
	groupRoute.PUT("/booking/update", app.RouteHandler(bookingController.UpdateBooking))
	groupRoute.POST("/booking/create", app.RouteHandler(bookingController.CreateBooking))
	groupRoute.DELETE("/booking/:bookingId", app.RouteHandler(bookingController.DeleteBooking))
}
