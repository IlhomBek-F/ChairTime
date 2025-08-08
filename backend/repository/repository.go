package repository

import (
	"chairTime/domain"

	"gorm.io/gorm"
)

type Repository struct {
	LoginRepo interface {
		GetUserByName(username string) (any, error)
		Login(username, password string) (domain.LoginRes, error)
	}
}

func NewRepo(db *gorm.DB) Repository {
	return Repository{
		LoginRepo: NewLoginRepo(db),
	}
}
