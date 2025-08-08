package routes

import (
	"chairTime/domain"

	"github.com/labstack/echo/v4"
)

func LoginRoute(app *domain.Application, groupRoute echo.Group) {
	groupRoute.POST("/auth/login", controllerApp.Login)
}
