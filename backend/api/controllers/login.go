package controllers

import (
	"chairTime/domain"
	"chairTime/repository"

	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type ControllerApp struct {
	Config        domain.Config
	Authenticator domain.Authenticator
	Logger        *zap.SugaredLogger
	Db            *gorm.DB
	Repo          repository.Repository
}

func (app *ControllerApp) Login(e echo.Context) error {
	return nil
}
