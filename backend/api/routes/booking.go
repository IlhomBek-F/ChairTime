package routes

import (
	"chairTime/api"
	bookingController "chairTime/api/controllers/booking"
	"chairTime/constant"

	"github.com/labstack/echo/v4"
)

func BookingRoute(app *api.Application, groupRoute echo.Group) {
	groupRoute.GET("/booking/:id", app.RouteHandler(bookingController.GetBookingById), app.Authorization([]int{constant.UserRoleId}))
	groupRoute.GET("/bookings/:user_id", app.RouteHandler(bookingController.GetBookings), app.Authorization([]int{constant.UserRoleId}))
	groupRoute.PUT("/booking/update", app.RouteHandler(bookingController.UpdateBooking), app.Authorization([]int{constant.UserRoleId}))
	groupRoute.POST("/booking/create", app.RouteHandler(bookingController.CreateBooking), app.Authorization([]int{constant.UserRoleId}))
	groupRoute.DELETE("/booking/:bookingId", app.RouteHandler(bookingController.DeleteBooking), app.Authorization([]int{constant.UserRoleId}))
}
