package repository

import (
	"chairTime/domain"
	"context"
	"time"

	"gorm.io/gorm"
)

type masterDB struct {
	db *gorm.DB
}

type masterRepo interface {
	GetMasterByName(name string) (domain.Master, error)
	GetMasters() ([]domain.Master, error)
	CreateMaster(masterPayload domain.CreateMasterPayload) (domain.Master, error)
}

func NewMasterRepo(db *gorm.DB) masterRepo {
	return masterDB{db: db}
}

func (mr masterDB) GetMasterByName(name string) (domain.Master, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var master domain.Master

	result := mr.db.WithContext(ctx).Where("first_name = ?", name).First(&master)

	return master, result.Error
}

func (mr masterDB) GetMasters() ([]domain.Master, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var masters []domain.Master

	result := mr.db.WithContext(ctx).Find(&masters)

	return masters, result.Error
}

func (mr masterDB) CreateMaster(masterPayload domain.CreateMasterPayload) (domain.Master, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	master := domain.Master{Firstname: masterPayload.Firstname, Lastname: masterPayload.Lastname, Phone: masterPayload.Phone}

	result := mr.db.WithContext(ctx).Create(&master)

	return master, result.Error
}
