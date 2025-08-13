package repository

import (
	"chairTime/domain"
	"chairTime/internal/db"
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
	GetMasterStylesOffer(masterId int) ([]domain.MasterStyleOffer, error)
	GetMasterById(masterId int) (domain.Master, error)
}

func NewMasterRepo(db *gorm.DB) masterRepo {
	return masterDB{db: db}
}

func (mr masterDB) GetMasterByName(name string) (domain.Master, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var master domain.Master

	result := mr.db.WithContext(ctx).Where("firstname = ?", name).First(&master)

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

	transactionError := db.WithTransaction(ctx, mr.db, func(tx *gorm.DB) error {
		result := tx.Create(&master)

		if result.Error != nil {
			return result.Error
		}

		offerStyles := []domain.MasterStyleType{}

		for _, styleId := range masterPayload.OfferStyleIds {
			offerStyles = append(offerStyles, domain.MasterStyleType{MasterId: master.ID, StyleTypeId: styleId})
		}

		masterStyleTypeResult := tx.Create(&offerStyles)

		if masterStyleTypeResult.Error != nil {
			return masterStyleTypeResult.Error
		}

		return nil
	})

	return master, transactionError
}

func (mr masterDB) GetMasterStylesOffer(masterId int) ([]domain.MasterStyleOffer, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var styleOffers []domain.MasterStyleOffer

	result := mr.db.WithContext(ctx).Table("master_style_types AS mst").
		Select("mst.id", "st.name", "mst.style_type_id").
		Joins("JOIN style_types AS st ON mst.style_type_id = st.id").
		Where("mst.master_id = ?", masterId).Scan(&styleOffers)

	return styleOffers, result.Error
}

func (mr masterDB) GetMasterById(masterId int) (domain.Master, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var master domain.Master

	result := mr.db.WithContext(ctx).First(&master, masterId)

	return master, result.Error
}
