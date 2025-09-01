package routes

import (
	"chairTime/internal/app"
	mstStyleTypeController "chairTime/internal/controllers/masterStyleType"

	"github.com/labstack/echo/v4"
)

func NewMasterStyleTypeRoute(app *app.Application, groupRoute echo.Group) {
	groupRoute.GET("/master-style-types", app.RouteHandler(mstStyleTypeController.GetMasterStyleTypes))
	groupRoute.GET("/master-style-type/:master_style_type_id", app.RouteHandler(mstStyleTypeController.GetMstStyleTypeById))
}
