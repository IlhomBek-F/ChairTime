package repository

import (
	"chairTime/internal/domain"
	"context"

	"gorm.io/gorm"
)

type userDB struct {
	db *gorm.DB
}

type userRepo interface {
	GetUsers(ctx context.Context) ([]domain.User, error)
	GetUserById(ctx context.Context, masterId int) (domain.User, error)
	DeleteUser(ctx context.Context, userId int) error
}

func NewUserRepo(db *gorm.DB) userRepo {
	return userDB{db: db}
}

func (ur userDB) GetUsers(ctx context.Context) ([]domain.User, error) {
	var users []domain.User

	result := ur.db.WithContext(ctx).Find(&users)

	return users, result.Error
}

func (ur userDB) GetUserById(ctx context.Context, userId int) (domain.User, error) {
	var user domain.User

	result := ur.db.WithContext(ctx).First(&user, userId)

	return user, result.Error
}

func (ur userDB) DeleteUser(ctx context.Context, userId int) error {
	return ur.db.WithContext(ctx).Delete(&domain.User{}, userId).Error
}
