package routes

import (
	"chairTime/api"
	"chairTime/api/controllers"

	"github.com/labstack/echo/v4"
)

func AuthRoute(app *api.Application, groupRoute echo.Group) {
	signIn := func(e echo.Context) error {
		return controllers.SignIn(app, e)
	}

	signUp := func(e echo.Context) error {
		return controllers.SignUp(app, e)
	}

	groupRoute.POST("/auth/sign-in", signIn)
	groupRoute.POST("/auth/sign-up", signUp)
}
