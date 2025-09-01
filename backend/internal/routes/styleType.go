package routes

import (
	"chairTime/constant"
	"chairTime/internal/app"
	controllers "chairTime/internal/controllers/styleType"

	"github.com/labstack/echo/v4"
)

func StyleTypeRoute(app *app.Application, groupRoute echo.Group) {
	groupRoute.GET("/style-types", app.RouteHandler(controllers.GetStyleTypes))
	groupRoute.POST("/style-type/create", app.RouteHandler(controllers.CreateStyleType), app.Authorization([]int{constant.MasterRoleId}))
}
