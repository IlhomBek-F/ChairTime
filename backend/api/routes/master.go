package routes

import (
	"chairTime/api"
	controllers "chairTime/api/controllers/master"

	"github.com/labstack/echo/v4"
)

func MasterRoute(app *api.Application, groupRoute echo.Group) {
	groupRoute.GET("/masters", app.RouteHandler(controllers.GetMasters))
	groupRoute.POST("/master/create", app.RouteHandler(controllers.CreateMaster))
	groupRoute.GET("/master/:master_id/styles-offer", app.RouteHandler(controllers.GetMasterStylesOffer))
	groupRoute.GET("/master/:master_id", app.RouteHandler(controllers.GetMasterById))
}
