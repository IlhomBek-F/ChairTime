package routes

import (
	"chairTime/api"
	userController "chairTime/api/controllers/user"
	"chairTime/constant"
	_ "image/gif" // register GIF decoder
	_ "image/png" // register PNG decoder

	"github.com/labstack/echo/v4"
	_ "golang.org/x/image/webp"
)

func UserRoute(app *api.Application, groupRoute echo.Group) {
	groupRoute.GET("/users", app.RouteHandler(userController.GetUsers), app.Authorization([]int{constant.AdminRoleId}))
	groupRoute.GET("/user/:user_id", app.RouteHandler(userController.GetUserById))
	groupRoute.DELETE("/user/:user_id", app.RouteHandler(userController.DeleteUser))
}
