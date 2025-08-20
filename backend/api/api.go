package api

import (
	"chairTime/domain"
	"chairTime/internal/auth"
	"chairTime/repository"
	"errors"

	"slices"

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
				return app.BadRequestResponse(e, errors.New("missing user context"))
			}

			token := userContext.(*jwt.Token)

			claims, ok := token.Claims.(*auth.CustomClaims)

			if !ok || !token.Valid {
				return app.BadRequestResponse(e, errors.New("invalid token claims"))
			}

			if slices.Contains(roles, claims.Role) {
				return next(e)
			}

			return app.ForbiddenResponse(e)
		}
	}
}
