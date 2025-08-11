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
}

func NewRepo(db *gorm.DB) Repository {
	return Repository{
		Auth: NewAuthRepo(db),
	}
}
