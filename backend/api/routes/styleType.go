package routes

import (
	"chairTime/api"
	controllers "chairTime/api/controllers/styleType"

	"github.com/labstack/echo/v4"
)

func StyleTypeRoute(app *api.Application, groupRoute echo.Group) {
	groupRoute.GET("/style-types", app.RouteHandler(controllers.GetStyleTypes))
	groupRoute.POST("/create-style-type", app.RouteHandler(controllers.CreateStyleType))
}
