package repository

import (
	"chairTime/domain"

	"gorm.io/gorm"
)

type loginRepoDb struct {
	db *gorm.DB
}

type loginRepo interface {
	GetUserByName(username string) (domain.User, error)
	SignUp(username, password string) (domain.User, error)
}

func NewLoginRepo(db *gorm.DB) loginRepo {
	return loginRepoDb{db: db}
}

func (lr loginRepoDb) GetUserByName(username string) (domain.User, error) {
	return domain.User{}, nil
}

func (lr loginRepoDb) SignUp(username, password string) (domain.User, error) {
	return domain.User{}, nil
}
