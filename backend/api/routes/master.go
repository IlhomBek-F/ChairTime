package routes

import (
	"chairTime/api"
	masterController "chairTime/api/controllers/master"
	"chairTime/constant"

	"github.com/labstack/echo/v4"
)

func MasterRoute(app *api.Application, groupRoute echo.Group) {
	adminRoleId, userRoleId, masterRoleId := constant.AdminRoleId, constant.UserRoleId, constant.MasterRoleId

	groupRoute.GET("/master/unavailables/:master_id", app.RouteHandler(masterController.GetMasterUnavailableSchedules))
	groupRoute.GET("/masters", app.RouteHandler(masterController.GetMasters), app.Authorization([]int{adminRoleId, userRoleId}))
	groupRoute.GET("/master/:master_id/bookings", app.RouteHandler(masterController.GetMasterBookings), app.Authorization([]int{masterRoleId}))
	groupRoute.GET("/master/:master_id/styles-offer", app.RouteHandler(masterController.GetMasterStylesOffer), app.Authorization([]int{adminRoleId, userRoleId}))
	groupRoute.GET("/master/:master_id", app.RouteHandler(masterController.GetMasterById))
	groupRoute.GET("/master/:master_id/:date", app.RouteHandler(masterController.GetMasterAvailableTimeSlots))
	groupRoute.PUT("/master/update", app.RouteHandler(masterController.UpdateMaster), app.Authorization([]int{adminRoleId}))
	groupRoute.PUT("/master/unavailable/update", app.RouteHandler(masterController.UpdateMasterUnavailableSchedule))
	groupRoute.POST("/master/create", app.RouteHandler(masterController.CreateMaster), app.Authorization([]int{adminRoleId}))
	groupRoute.POST("/master/unavailable", app.RouteHandler(masterController.CreateMasterUnavailableSchedule))
	groupRoute.DELETE("/master/:unavailable_schedule_id", app.RouteHandler(masterController.DeleteMasterUnavailableSchedule))
}
