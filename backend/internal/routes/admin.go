package routes

import (
	"chairTime/constant"
	"chairTime/internal/app"
	adminController "chairTime/internal/controllers/admin"

	"github.com/labstack/echo/v4"
)

func NewAdminRoute(app *app.Application, groupRoute echo.Group) {
	groupRoute.GET("/admin/:admin_id", app.RouteHandler(adminController.GetAdminId), app.Authorization([]int{constant.AdminRoleId}))
}
