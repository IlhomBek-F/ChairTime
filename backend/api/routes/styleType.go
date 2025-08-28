package routes

import (
	"chairTime/api"
	controllers "chairTime/api/controllers/styleType"
	"chairTime/constant"

	"github.com/labstack/echo/v4"
)

func StyleTypeRoute(app *api.Application, groupRoute echo.Group) {
	groupRoute.GET("/style-types", app.RouteHandler(controllers.GetStyleTypes))
	groupRoute.POST("/style-type/create", app.RouteHandler(controllers.CreateStyleType), app.Authorization([]int{constant.MasterRoleId}))
}
