package routes

import (
	"chairTime/api"
	masterController "chairTime/api/controllers/master"

	"github.com/labstack/echo/v4"
)

func MasterRoute(app *api.Application, groupRoute echo.Group) {
	groupRoute.GET("/masters", app.RouteHandler(masterController.GetMasters))
	groupRoute.POST("/master/create", app.RouteHandler(masterController.CreateMaster))
	groupRoute.GET("/master/:master_id/styles-offer", app.RouteHandler(masterController.GetMasterStylesOffer))
	groupRoute.GET("/master/:master_id", app.RouteHandler(masterController.GetMasterById))
	groupRoute.PUT("/master/update", app.RouteHandler(masterController.UpdateMaster))
}
