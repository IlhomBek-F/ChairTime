package repository

import (
	"chairTime/internal/domain"
	"context"

	"gorm.io/gorm"
)

type masterStyleTypeDB struct {
	db *gorm.DB
}

type masterStyleTypeRepo interface {
	GetMasterStyleTypes(ctx context.Context) ([]domain.MasterStyleType, error)
	GetMasterStyleTypeById(ctx context.Context, id int) (domain.MasterStyleType, error)
}

func NewMasterStyleTypeRepo(db *gorm.DB) masterStyleTypeRepo {
	return masterStyleTypeDB{db: db}
}

func (mst masterStyleTypeDB) GetMasterStyleTypes(ctx context.Context) ([]domain.MasterStyleType, error) {
	var masterStyleTypes []domain.MasterStyleType

	result := mst.db.WithContext(ctx).Find(&masterStyleTypes)

	return masterStyleTypes, result.Error
}

func (mst masterStyleTypeDB) GetMasterStyleTypeById(ctx context.Context, id int) (domain.MasterStyleType, error) {
	var masterStyleType domain.MasterStyleType

	result := mst.db.WithContext(ctx).First(&masterStyleType, id)

	return masterStyleType, result.Error
}
