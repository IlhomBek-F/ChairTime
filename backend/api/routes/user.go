package routes

import (
	"chairTime/api"
	userController "chairTime/api/controllers/user"
	"chairTime/constant"

	"github.com/labstack/echo/v4"
)

func UserRoute(app *api.Application, groupRoute echo.Group) {
	groupRoute.GET("/users", app.RouteHandler(userController.GetUsers), app.Authorization([]int{constant.AdminRoleId}))
	groupRoute.GET("/user/:user_id", app.RouteHandler(userController.GetUserById), app.Authorization([]int{constant.AdminRoleId}))
	groupRoute.DELETE("/user/:user_id", app.RouteHandler(userController.DeleteUser), app.Authorization([]int{constant.AdminRoleId}))
}
