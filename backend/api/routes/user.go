package routes

import (
	"chairTime/api"
	userController "chairTime/api/controllers/user"

	"github.com/labstack/echo/v4"
)

func UserRoute(app *api.Application, groupRoute echo.Group) {
	groupRoute.GET("/users", app.RouteHandler(userController.GetUsers))
	groupRoute.GET("/user/:user_id", app.RouteHandler(userController.GetUserById))
	groupRoute.DELETE("/user/:user_id", app.RouteHandler(userController.DeleteUser))
}
