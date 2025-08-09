package repository

import (
	"chairTime/domain"

	"gorm.io/gorm"
)

type loginRepo struct {
	db *gorm.DB
}

func NewLoginRepo(db *gorm.DB) domain.LoginRepo {
	return loginRepo{db: db}
}

func (lr loginRepo) GetUserByName(username string) (domain.User, error) {
	return domain.User{}, nil
}

func (lr loginRepo) Login(username, password string) (domain.LoginRes, error) {
	return domain.LoginRes{}, nil
}
