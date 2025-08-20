package routes

import (
	"chairTime/api"
	masterController "chairTime/api/controllers/master"
	"chairTime/constant"

	"github.com/labstack/echo/v4"
)

func MasterRoute(app *api.Application, groupRoute echo.Group) {
	adminRoleId, masterRoleId, userRoleId := constant.AdminRoleId, constant.MasterRoleId, constant.UserRoleId

	groupRoute.GET("/masters", app.RouteHandler(masterController.GetMasters), app.Authorization([]int{adminRoleId, userRoleId}))
	groupRoute.POST("/master/create", app.RouteHandler(masterController.CreateMaster), app.Authorization([]int{adminRoleId}))
	groupRoute.GET("/master/:master_id/styles-offer", app.RouteHandler(masterController.GetMasterStylesOffer), app.Authorization([]int{adminRoleId, userRoleId}))
	groupRoute.GET("/master/:master_id", app.RouteHandler(masterController.GetMasterById), app.Authorization([]int{adminRoleId, masterRoleId, userRoleId}))
	groupRoute.PUT("/master/update", app.RouteHandler(masterController.UpdateMaster), app.Authorization([]int{adminRoleId}))
}
