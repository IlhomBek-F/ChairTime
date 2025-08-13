package repository

import (
	"chairTime/domain"

	"gorm.io/gorm"
)

type Repository struct {
	Auth interface {
		GetUserByName(username string) (domain.User, error)
		SignUp(username, password, phone string) (domain.User, error)
	}

	Master interface {
		GetMasterByName(name string) (domain.Master, error)
		GetMasters() ([]domain.Master, error)
		CreateMaster(masterPayload domain.CreateMasterPayload) (domain.Master, error)
		GetMasterStylesOffer(masterId int) ([]domain.MasterStyleOffer, error)
	}

	StyleType interface {
		GetStyleTypeByName(name string) (domain.StyleType, error)
		CreateStyleType(styleTypePayload domain.CreateStyleTypePayload) (domain.StyleType, error)
		GetStyleTypes() ([]domain.StyleType, error)
	}
}

func NewRepo(db *gorm.DB) Repository {
	return Repository{
		Auth:      NewAuthRepo(db),
		Master:    NewMasterRepo(db),
		StyleType: NewStyleTypeRepo(db),
	}
}
