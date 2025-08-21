package controllers

import (
	"chairTime/api"

	"github.com/labstack/echo/v4"
)

func ServeImage(app *api.Application, e echo.Context) error {
	token := e.Param("token")

	claims, err := app.Authenticator.ParseToken(token, app.Config.Auth.Secret)

	if err != nil {
		return app.UnauthorizedErrorResponse(e, err)
	}

	return e.File("../public/" + claims.RegisteredClaims.Subject + ".jpg")
}
