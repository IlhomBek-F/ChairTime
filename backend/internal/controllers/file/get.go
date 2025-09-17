package controllers

import (
	"chairTime/constant"
	"chairTime/internal/app"

	"github.com/labstack/echo/v4"
)

func ServeImage(app *app.Application, e echo.Context) error {
	token := e.Param("token")

	claims, err := app.Authenticator.ParseToken(token, app.Config.Auth.Secret)

	if err != nil {
		return app.UnauthorizedErrorResponse(e, err)
	}

	return e.File("../../public/" + constant.RoleNames[claims.Role] + "_" + claims.RegisteredClaims.Subject + ".jpg")
}
