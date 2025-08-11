package repository

import (
	"chairTime/domain"
	"context"
	"time"

	"gorm.io/gorm"
)

type authDB struct {
	db *gorm.DB
}

type authRepo interface {
	GetUserByName(username string) (domain.User, error)
	SignUp(username, password, phone string) (domain.User, error)
}

func NewAuthRepo(db *gorm.DB) authRepo {
	return authDB{db: db}
}

func (lr authDB) GetUserByName(username string) (domain.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var user domain.User

	result := lr.db.WithContext(ctx).Where("username = ?", username).First(&user)

	return user, result.Error
}

func (lr authDB) SignUp(username, password, phone string) (domain.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	user := domain.User{Username: username, Password: password, Phone: phone}

	result := lr.db.WithContext(ctx).Create(&user)
	return user, result.Error
}
