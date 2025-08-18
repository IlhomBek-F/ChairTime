package repository

import (
	"chairTime/domain"
	"context"
	"time"

	"gorm.io/gorm"
)

type masterStyleTypeDB struct {
	db *gorm.DB
}

type masterStyleTypeRepo interface {
	GetMasterStyleTypes() ([]domain.MasterStyleType, error)
	GetMasterStyleTypeById(id int) (domain.MasterStyleType, error)
}

func NewMasterStyleTypeRepo(db *gorm.DB) masterStyleTypeRepo {
	return masterStyleTypeDB{db: db}
}

func (mst masterStyleTypeDB) GetMasterStyleTypes() ([]domain.MasterStyleType, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var masterStyleTypes []domain.MasterStyleType

	result := mst.db.WithContext(ctx).Find(&masterStyleTypes)

	return masterStyleTypes, result.Error
}

func (mst masterStyleTypeDB) GetMasterStyleTypeById(id int) (domain.MasterStyleType, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var masterStyleType domain.MasterStyleType

	result := mst.db.WithContext(ctx).First(&masterStyleType, id)

	return masterStyleType, result.Error
}
