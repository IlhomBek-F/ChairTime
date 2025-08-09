package routes

import (
	"chairTime/api"
	"chairTime/api/controllers"

	"github.com/labstack/echo/v4"
)

func AuthRoute(app *api.Application, groupRoute echo.Group) {
	login := func(e echo.Context) error {
		return controllers.Login(app, e)
	}

	signUp := func(e echo.Context) error {
		return controllers.SignUp(app, e)
	}

	groupRoute.POST("/auth/login", login)
	groupRoute.POST("/auth/sign-up", signUp)
}
