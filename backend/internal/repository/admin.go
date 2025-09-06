package repository

import (
	"chairTime/internal/domain"
	"context"
	"time"

	"gorm.io/gorm"
)

type adminDB struct {
	db *gorm.DB
}

type adminRepo interface {
	GetAdminByName(name string) (domain.Admin, error)
	GetAdminById(id int) (domain.Admin, error)
}

func NewAdminRepo(db *gorm.DB) adminRepo {
	return adminDB{db: db}
}

func (ar adminDB) GetAdminByName(name string) (domain.Admin, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var admin domain.Admin

	result := ar.db.WithContext(ctx).Where("username = ?", name).First(&admin)

	return admin, result.Error
}

func (mr adminDB) GetAdminById(id int) (domain.Admin, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var admin domain.Admin

	result := mr.db.WithContext(ctx).Where("id = ?", id).First(&admin)

	return admin, result.Error
}
