package repository

import (
	"chairTime/internal/domain"
	"context"

	"gorm.io/gorm"
)

type adminDB struct {
	db *gorm.DB
}

type adminRepo interface {
	GetAdminByName(ctx context.Context, name string) (domain.Admin, error)
	GetAdminById(ctx context.Context, id int) (domain.Admin, error)
}

func NewAdminRepo(db *gorm.DB) adminRepo {
	return adminDB{db: db}
}

func (ar adminDB) GetAdminByName(ctx context.Context, name string) (domain.Admin, error) {
	var admin domain.Admin

	result := ar.db.WithContext(ctx).Where("username = ?", name).First(&admin)

	return admin, result.Error
}

func (mr adminDB) GetAdminById(ctx context.Context, id int) (domain.Admin, error) {
	var admin domain.Admin

	result := mr.db.WithContext(ctx).Where("id = ?", id).First(&admin)

	return admin, result.Error
}
