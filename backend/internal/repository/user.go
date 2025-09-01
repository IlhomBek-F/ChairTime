package repository

import (
	"chairTime/internal/domain"
	"context"
	"time"

	"gorm.io/gorm"
)

type userDB struct {
	db *gorm.DB
}

type userRepo interface {
	GetUsers() ([]domain.User, error)
	GetUserById(masterId int) (domain.User, error)
	DeleteUser(userId int) error
}

func NewUserRepo(db *gorm.DB) userRepo {
	return userDB{db: db}
}

func (ur userDB) GetUsers() ([]domain.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var users []domain.User

	result := ur.db.WithContext(ctx).Find(&users)

	return users, result.Error
}

func (ur userDB) GetUserById(userId int) (domain.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var user domain.User

	result := ur.db.WithContext(ctx).First(&user, userId)

	return user, result.Error
}

func (ur userDB) DeleteUser(userId int) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return ur.db.WithContext(ctx).Delete(&domain.User{}, userId).Error
}
