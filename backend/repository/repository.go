package repository

import (
	"chairTime/domain"

	"gorm.io/gorm"
)

type Repository struct {
	Login interface {
		GetUserByName(username string) (domain.User, error)
		Login(username, password string) (domain.LoginRes, error)
	}
}

func NewRepo(db *gorm.DB) Repository {
	return Repository{
		Login: NewLoginRepo(db),
	}
}
