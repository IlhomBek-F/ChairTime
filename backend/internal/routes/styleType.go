package routes

import (
	"chairTime/constant"
	"chairTime/internal/app"
	styleTypeController "chairTime/internal/controllers/styleType"

	"github.com/labstack/echo/v4"
)

func StyleTypeRoute(app *app.Application, groupRoute echo.Group) {
	groupRoute.GET("/style-types", app.RouteHandler(styleTypeController.GetStyleTypes))
	groupRoute.POST("/style-type/create", app.RouteHandler(styleTypeController.CreateStyleType), app.Authorization([]int{constant.MasterRoleId}))
	groupRoute.DELETE("/style-type/:style_type_id", app.RouteHandler(styleTypeController.DeleteStyleType), app.Authorization([]int{constant.AdminRoleId}))
}
