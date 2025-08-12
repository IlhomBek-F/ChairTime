package api

import (
	"chairTime/domain"
	"chairTime/repository"

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
