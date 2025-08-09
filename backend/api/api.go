package api

import (
	"chairTime/domain"
	"chairTime/repository"

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
