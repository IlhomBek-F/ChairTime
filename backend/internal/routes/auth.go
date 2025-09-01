package routes

import (
	"chairTime/internal/app"
	authController "chairTime/internal/controllers/auth"

	"github.com/labstack/echo/v4"
)

func AuthRoute(app *app.Application, groupRoute echo.Group) {
	groupRoute.POST("/auth/sign-in", app.RouteHandler(authController.SignIn))
	groupRoute.POST("/auth/sign-up", app.RouteHandler(authController.SignUp))
}
