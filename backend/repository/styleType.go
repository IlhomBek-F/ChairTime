package repository

import (
	"chairTime/domain"
	"context"
	"time"

	"gorm.io/gorm"
)

type styleTypeDB struct {
	db *gorm.DB
}

type styleTypeRepo interface {
	GetStyleTypeByName(name string) (domain.StyleType, error)
	CreateStyleType(styleTypePayload domain.CreateStyleTypePayload) (domain.StyleType, error)
	GetStyleTypes() ([]domain.StyleType, error)
}

func NewStyleTypeRepo(db *gorm.DB) styleTypeRepo {
	return styleTypeDB{db: db}
}

func (mr styleTypeDB) GetStyleTypeByName(name string) (domain.StyleType, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var styleType domain.StyleType

	result := mr.db.WithContext(ctx).Where("name = ?", name).First(&styleType)

	return styleType, result.Error
}

func (mr styleTypeDB) GetStyleTypes() ([]domain.StyleType, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var styleTypes []domain.StyleType

	result := mr.db.WithContext(ctx).Find(&styleTypes)

	return styleTypes, result.Error
}

func (mr styleTypeDB) CreateStyleType(styleTypePayload domain.CreateStyleTypePayload) (domain.StyleType, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	styleType := domain.StyleType{Name: styleTypePayload.Name, Duration: styleTypePayload.Duration, Description: styleTypePayload.Description}

	result := mr.db.WithContext(ctx).Create(&styleType)

	return styleType, result.Error
}
