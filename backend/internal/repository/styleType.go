package repository

import (
	"chairTime/internal/domain"
	"context"

	"gorm.io/gorm"
)

type styleTypeDB struct {
	db *gorm.DB
}

type styleTypeRepo interface {
	GetStyleTypeByName(ctx context.Context, name string) (domain.StyleType, error)
	CreateStyleType(ctx context.Context, styleTypePayload domain.CreateStyleTypePayload) (domain.StyleType, error)
	GetStyleTypes(ctx context.Context) ([]domain.StyleType, error)
	DeleteStyleType(ctx context.Context, id int) error
	GetStyleTypeById(ctx context.Context, id int) (domain.StyleType, error)
	UpdateStyleType(ctx context.Context, updatedStyleType domain.StyleType) (domain.StyleType, error)
}

func NewStyleTypeRepo(db *gorm.DB) styleTypeRepo {
	return styleTypeDB{db: db}
}

func (mr styleTypeDB) GetStyleTypeByName(ctx context.Context, name string) (domain.StyleType, error) {
	var styleType domain.StyleType

	result := mr.db.WithContext(ctx).Where("name = ?", name).First(&styleType)

	return styleType, result.Error
}

func (mr styleTypeDB) GetStyleTypes(ctx context.Context) ([]domain.StyleType, error) {
	var styleTypes []domain.StyleType

	result := mr.db.WithContext(ctx).Find(&styleTypes)

	return styleTypes, result.Error
}

func (mr styleTypeDB) CreateStyleType(ctx context.Context, styleTypePayload domain.CreateStyleTypePayload) (domain.StyleType, error) {
	styleType := domain.StyleType{Name: styleTypePayload.Name, Duration: styleTypePayload.Duration, Description: styleTypePayload.Description}

	result := mr.db.WithContext(ctx).Create(&styleType)

	return styleType, result.Error
}

func (mr styleTypeDB) DeleteStyleType(ctx context.Context, id int) error {
	result := mr.db.WithContext(ctx).Delete(domain.StyleType{}, id)

	return result.Error
}

func (mr styleTypeDB) GetStyleTypeById(ctx context.Context, id int) (domain.StyleType, error) {
	var styleType domain.StyleType

	result := mr.db.WithContext(ctx).First(&styleType, id)
	return styleType, result.Error
}

func (mr styleTypeDB) UpdateStyleType(ctx context.Context, styleType domain.StyleType) (domain.StyleType, error) {
	result := mr.db.WithContext(ctx).Updates(&styleType)
	return styleType, result.Error
}
