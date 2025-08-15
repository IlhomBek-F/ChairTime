package routes

import (
	"chairTime/api"
	controllers "chairTime/api/controllers/auth"

	"github.com/labstack/echo/v4"
)

func AuthRoute(app *api.Application, groupRoute echo.Group) {
	groupRoute.POST("/auth/sign-in", app.RouteHandler(controllers.SignIn))
	groupRoute.POST("/auth/sign-up", app.RouteHandler(controllers.SignUp))
}
