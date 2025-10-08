package repository

import (
	"chairTime/constant"
	"chairTime/internal/domain"
	"context"

	"gorm.io/gorm"
)

type authDB struct {
	db *gorm.DB
}

type authRepo interface {
	GetUserByName(ctx context.Context, username string) (domain.User, error)
	SignUp(ctx context.Context, username, password, phone string) (domain.User, error)
}

func NewAuthRepo(db *gorm.DB) authRepo {
	return authDB{db: db}
}

func (lr authDB) GetUserByName(ctx context.Context, username string) (domain.User, error) {
	var user domain.User
	result := lr.db.WithContext(ctx).Where("username = ?", username).First(&user)

	return user, result.Error
}

func (lr authDB) SignUp(ctx context.Context, username, password, phone string) (domain.User, error) {
	user := domain.User{Username: username, Password: password, Phone: phone, RoleId: constant.UserRoleId}

	result := lr.db.WithContext(ctx).Create(&user)
	return user, result.Error
}
