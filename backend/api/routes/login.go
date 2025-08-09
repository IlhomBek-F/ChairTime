package routes

import (
	"chairTime/api"
	"chairTime/api/controllers"

	"github.com/labstack/echo/v4"
)

func LoginRoute(app *api.Application, groupRoute echo.Group) {
	groupRoute.POST("/auth/login", func(e echo.Context) error {
		return controllers.Login(app, e)
	})
}
