package repository

import (
	"chairTime/constant"
	"chairTime/domain"
	"chairTime/internal/db"
	"context"
	"strconv"
	"strings"
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
	GetMasterBooking(masterId int) ([]domain.MasterBooking, error)
	GetMasterById(masterId int) (domain.Master, error)
	UpdateMaster(updatedMasterPayload domain.Master) (domain.Master, error)
	GetMasterUnavailableSchedules(masterId int) ([]domain.MasterUnavailableSchedule, error)
	CreateMasterUnavailableSchedule(payload domain.CreateMasterUnavailablePayload) error
	UpdateMasterUnavailableSchedule(payload domain.MasterUnavailableSchedule) (domain.MasterUnavailableSchedule, error)
	DeleteMasterUnavailableSchedule(id int) error
	GetMasterAvailableTimeSlots(masterId int, date string) ([]string, error)
}

func NewMasterRepo(db *gorm.DB) masterRepo {
	return masterDB{db: db}
}

func (mr masterDB) GetMasterByName(name string) (domain.Master, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var master domain.Master

	result := mr.db.WithContext(ctx).Where("username = ?", name).First(&master)

	return master, result.Error
}

func (mr masterDB) GetMasters() ([]domain.Master, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var masters []domain.Master

	result := mr.db.WithContext(ctx).Find(&masters)

	if result.Error != nil {
		return nil, result.Error
	}

	for i, master := range masters {
		var offerStyleIds []int
		offerStyleResult := mr.db.WithContext(ctx).
			Model(&domain.MasterStyleType{}).Where("master_id = ?", master.ID).
			Select("id").
			Find(&offerStyleIds)

		if offerStyleResult.Error != nil {
			return nil, offerStyleResult.Error
		}

		masters[i].OfferStyleIds = offerStyleIds
	}

	return masters, result.Error
}

func (mr masterDB) CreateMaster(masterPayload domain.CreateMasterPayload) (domain.Master, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	master := domain.Master{}
	master.RoleId = constant.MasterRoleId
	master.Password = masterPayload.Password
	master.Phone = masterPayload.Phone
	master.Username = masterPayload.Username
	master.OfferStyleIds = masterPayload.OfferStyleIds

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

	result := mr.db.WithContext(ctx).Where("id = ?", masterId).First(&master)

	return master, result.Error
}

func (mr masterDB) UpdateMaster(updatedMasterPayload domain.Master) (domain.Master, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*152)
	defer cancel()

	transactionError := db.WithTransaction(ctx, mr.db, func(tx *gorm.DB) error {
		var currentMasterStylesOffer []domain.MasterStyleType
		var masterStyleOfferMap = make(map[int]domain.MasterStyleType)
		var updatedOfferSet = make(map[int]int)

		result := tx.Model(&domain.MasterStyleType{}).Where("master_id = ?", updatedMasterPayload.ID).Find(&currentMasterStylesOffer)

		if result.Error != nil {
			return result.Error
		}

		// Build lookup maps
		for _, styleOffer := range currentMasterStylesOffer {
			masterStyleOfferMap[styleOffer.ID] = styleOffer
		}

		for _, styleOfferId := range updatedMasterPayload.OfferStyleIds {
			updatedOfferSet[styleOfferId] = 1
		}

		// Track changes
		newAddedOffer := []domain.MasterStyleType{}
		removedOfferIds := []int{}

		// New additions
		for _, id := range updatedMasterPayload.OfferStyleIds {
			if _, ok := masterStyleOfferMap[id]; !ok {
				newAddedOffer = append(newAddedOffer, domain.MasterStyleType{MasterId: updatedMasterPayload.ID, StyleTypeId: id})
			}
		}

		// Removed ones
		for _, styleOffer := range currentMasterStylesOffer {
			if _, ok := updatedOfferSet[styleOffer.ID]; !ok {
				removedOfferIds = append(removedOfferIds, styleOffer.ID)
			}
		}

		//Apply changes
		if len(newAddedOffer) > 0 {
			if err := tx.Create(&newAddedOffer).Error; err != nil {
				return err
			}
		}

		if len(removedOfferIds) > 0 {
			if err := tx.Delete(&domain.MasterStyleType{}, removedOfferIds).Error; err != nil {
				return err
			}
		}

		// Update master itself
		if err := tx.Updates(&updatedMasterPayload).Error; err != nil {
			return err
		}

		return nil
	})

	return updatedMasterPayload, transactionError
}

func (mr masterDB) GetMasterBooking(masterId int) ([]domain.MasterBooking, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var bookings []domain.MasterBooking

	result := mr.db.WithContext(ctx).Table("users AS us").
		Select("bk.id", "us.username", "us.phone", "bk.date", "bk.time", "st.name as style_type", "bk.description").
		Joins("JOIN bookings AS bk ON us.id = bk.user_id").
		Joins("JOIN master_style_types AS mst ON mst.id = bk.master_style_type_id").
		Joins("JOIN style_types AS st ON st.id = mst.style_type_id").Where("mst.master_id = ?", masterId).Find(&bookings)

	return bookings, result.Error
}

func (mr masterDB) GetMasterAvailableTimeSlots(masterId int, date string) ([]string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var bookings []domain.Booking

	result := mr.db.WithContext(ctx).Table("bookings AS bk").
		Select("bk.time", "bk.date").
		Joins("JOIN master_style_types AS mst ON mst.id = bk.master_style_type_id").
		Where("mst.master_id = ? AND bk.date = ?", masterId, date).Find(&bookings)

	if result.Error != nil {
		return []string{}, result.Error
	}

	master, err := mr.GetMasterById(masterId)

	if err != nil {
		return []string{}, err
	}

	workStart, _ := time.Parse("15:04", master.Start_working_time)
	workEnd, _ := time.Parse("15:04", master.End_working_time)
	slotDuration := 30 * time.Minute
	slots := []string{}

	availableBookingTimes := []string{}

	for t := workStart; t.Before(workEnd); t = t.Add(slotDuration) {
		slots = append(slots, t.Format("15:04"))
	}

	for _, slot := range slots {
		slotStart := parseToMinutes(slot)
		slotEnd := slotStart + int(slotDuration)

		isBooked := false

		for _, booking := range bookings {
			bookingStart := parseToMinutes(booking.Time)
			bookingEnd := bookingStart + 30

			if slotStart < bookingEnd && slotEnd > bookingStart {
				isBooked = true
				break
			}
		}

		if !isBooked {
			availableBookingTimes = append(availableBookingTimes, slot)
		}
	}

	return availableBookingTimes, nil
}

func (mr masterDB) GetMasterUnavailableSchedules(masterId int) ([]domain.MasterUnavailableSchedule, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var masterUnavailableSchedules []domain.MasterUnavailableSchedule
	result := mr.db.WithContext(ctx).Where("master_id = ?", masterId).Find(&masterUnavailableSchedules)

	return masterUnavailableSchedules, result.Error
}

func (mr masterDB) CreateMasterUnavailableSchedule(payload domain.CreateMasterUnavailablePayload) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var schedule = domain.MasterUnavailableSchedule{
		MasterId:  payload.MasterId,
		DayOfWeek: payload.DayOfWeek,
		Date:      payload.Date,
		StartTime: payload.StartTime,
		EndTime:   payload.EndTime,
	}

	result := mr.db.WithContext(ctx).Create(&schedule)

	return result.Error
}

func (mr masterDB) DeleteMasterUnavailableSchedule(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return mr.db.WithContext(ctx).Delete(domain.MasterUnavailableSchedule{}, id).Error
}

func (mr masterDB) UpdateMasterUnavailableSchedule(payload domain.MasterUnavailableSchedule) (domain.MasterUnavailableSchedule, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()
	result := mr.db.WithContext(ctx).Updates(&payload)

	return payload, result.Error
}

func parseToMinutes(time string) int {
	parts := strings.Split(time, ":")
	hour, _ := strconv.Atoi(parts[0])
	minute, _ := strconv.Atoi(parts[1])
	return hour*60 + minute
}
