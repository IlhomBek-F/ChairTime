package api

import (
	"chairTime/domain"
	"chairTime/repository"
	"errors"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type Application struct {
	Config        domain.Config
	Authenticator domain.Authenticator
	Logger        *zap.SugaredLogger
	Db            *gorm.DB
	Repository    repository.Repository
}

func (app *Application) RouteHandler(handler func(app *Application, e echo.Context) error) echo.HandlerFunc {
	return func(e echo.Context) error {
		return handler(app, e)
	}
}

func (app *Application) Authorization(roles []int) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(e echo.Context) error {
			userContext := e.Get("user")

			if userContext == nil {
				return app.BadRequestResponse(e, errors.New("error getting user context key"))
			}

			token := userContext.(*jwt.Token).Raw

			claims, err := app.Authenticator.ParseToken(token, app.Config.Auth.Secret)

			if err != nil {
				return app.BadRequestResponse(e, errors.New("error parsing token"))
			}

			for _, role := range roles {
				if claims.Role == role {
					return next(e)
				}
			}

			return app.ForbiddenResponse(e)
		}
	}
}
