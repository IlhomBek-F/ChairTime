package routes

import (
	"chairTime/api"
	mstStyleTypeController "chairTime/api/controllers/masterStyleType"
	"chairTime/constant"

	"github.com/labstack/echo/v4"
)

func NewMasterStyleTypeRoute(app *api.Application, groupRoute echo.Group) {
	groupRoute.GET("/master-style-types", app.RouteHandler(mstStyleTypeController.GetMasterStyleTypes), app.Authorization([]int{constant.AdminRoleId}))
	groupRoute.GET("/master-style-type/:master_style_type_id", app.RouteHandler(mstStyleTypeController.GetMstStyleTypeById), app.Authorization([]int{constant.AdminRoleId}))
}
