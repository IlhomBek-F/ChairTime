package repository

import (
	"chairTime/constant"
	"chairTime/internal/db"
	"chairTime/internal/domain"
	"context"
	"strconv"
	"strings"
	"time"

	"github.com/IlhomBek-F/sliceutils"
	"gorm.io/gorm"
)

type masterDB struct {
	db *gorm.DB
}

type masterRepo interface {
	GetMasterByName(ctx context.Context, name string) (domain.Master, error)
	GetMasters(ctx context.Context) ([]domain.Master, error)
	CreateMaster(ctx context.Context, masterPayload domain.CreateMasterPayload) (domain.Master, error)
	GetMasterStylesOffer(ctx context.Context, masterId int) ([]domain.MasterStyleOffer, error)
	GetMasterBooking(ctx context.Context, masterId int) ([]domain.MasterBooking, error)
	GetMasterById(ctx context.Context, masterId int) (domain.Master, error)
	UpdateMaster(ctx context.Context, updatedMasterPayload domain.Master) (domain.Master, error)
	UpdateMasterWorkingTime(ctx context.Context, workingTimePayload domain.MasterWorkingTimePayload) error
	GetMasterUnavailableSchedules(ctx context.Context, masterId int) ([]domain.MasterUnavailableSchedule, error)
	CreateMasterUnavailableSchedule(ctx context.Context, payload []domain.CreateMasterUnavailablePayload, master_id int) error
	UpdateMasterUnavailableSchedule(ctx context.Context, payload domain.MasterUnavailableSchedule) (domain.MasterUnavailableSchedule, error)
	DeleteMaster(ctx context.Context, id int) error
	DeleteMasterUnavailableSchedule(ctx context.Context, id int) error
	GetMasterAvailableTimeSlots(ctx context.Context, masterId int, date string) ([]string, error)
}

func NewMasterRepo(db *gorm.DB) masterRepo {
	return masterDB{db: db}
}

func (mr masterDB) GetMasterByName(ctx context.Context, name string) (domain.Master, error) {
	var master domain.Master

	result := mr.db.WithContext(ctx).Where("username = ?", name).First(&master)

	return master, result.Error
}

func (mr masterDB) GetMasters(ctx context.Context) ([]domain.Master, error) {
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

func (mr masterDB) CreateMaster(ctx context.Context, masterPayload domain.CreateMasterPayload) (domain.Master, error) {
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

func (mr masterDB) GetMasterStylesOffer(ctx context.Context, masterId int) ([]domain.MasterStyleOffer, error) {
	var styleOffers []domain.MasterStyleOffer

	result := mr.db.WithContext(ctx).Table("master_style_types AS mst").
		Select("mst.id", "st.name", "mst.style_type_id").
		Joins("JOIN style_types AS st ON mst.style_type_id = st.id").
		Where("mst.master_id = ?", masterId).Scan(&styleOffers)

	return styleOffers, result.Error
}

func (mr masterDB) GetMasterById(ctx context.Context, masterId int) (domain.Master, error) {
	var master domain.Master

	result := mr.db.WithContext(ctx).Where("id = ?", masterId).First(&master)

	masterStyleOffers, err := mr.GetMasterStylesOffer(ctx, masterId)

	if err != nil {
		return domain.Master{}, err
	}

	var offerStyleIds []int

	for _, offer := range masterStyleOffers {
		offerStyleIds = append(offerStyleIds, offer.StyleTypeId)
	}

	master.OfferStyleIds = offerStyleIds

	return master, result.Error
}

func (mr masterDB) UpdateMaster(ctx context.Context, updatedMasterPayload domain.Master) (domain.Master, error) {
	transactionError := db.WithTransaction(ctx, mr.db, func(tx *gorm.DB) error {
		var currentMasterStylesOffer []domain.MasterStyleType

		result := tx.Model(&domain.MasterStyleType{}).Where("master_id = ?", updatedMasterPayload.ID).Find(&currentMasterStylesOffer)

		if result.Error != nil {
			return result.Error
		}

		// Track changes
		newAddedOffer := []domain.MasterStyleType{}
		removedOfferIds := []int{}

		sliceutils.ForEach(updatedMasterPayload.OfferStyleIds, func(id int, _ int, _ []int) {
			_, ok := sliceutils.Find(currentMasterStylesOffer, func(styleOffer domain.MasterStyleType, _ int, _ []domain.MasterStyleType) bool {
				return styleOffer.ID == id
			})

			if !ok {
				newAddedOffer = append(newAddedOffer, domain.MasterStyleType{MasterId: updatedMasterPayload.ID, StyleTypeId: id})
			}
		})

		sliceutils.ForEach(currentMasterStylesOffer, func(styleOffer domain.MasterStyleType, _ int, _ []domain.MasterStyleType) {
			_, ok := sliceutils.Find(updatedMasterPayload.OfferStyleIds, func(id int, _ int, _ []int) bool {
				return styleOffer.ID == id
			})

			if !ok {
				removedOfferIds = append(removedOfferIds, styleOffer.ID)
			}
		})

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

func (mr masterDB) GetMasterBooking(ctx context.Context, masterId int) ([]domain.MasterBooking, error) {
	var bookings []domain.MasterBooking

	result := mr.db.WithContext(ctx).Table("users AS us").
		Select("bk.id", "us.username", "us.phone", "bk.date", "bk.time", "st.name as style_type", "bk.description").
		Joins("JOIN bookings AS bk ON us.id = bk.user_id").
		Joins("JOIN master_style_types AS mst ON mst.id = bk.master_style_type_id").
		Joins("JOIN style_types AS st ON st.id = mst.style_type_id").Where("mst.master_id = ?", masterId).Find(&bookings)

	return bookings, result.Error
}

func (mr masterDB) GetMasterAvailableTimeSlots(ctx context.Context, masterId int, date string) ([]string, error) {
	var bookings []domain.Booking

	result := mr.db.WithContext(ctx).Table("bookings AS bk").
		Select("bk.time", "bk.date").
		Joins("JOIN master_style_types AS mst ON mst.id = bk.master_style_type_id").
		Where("mst.master_id = ? AND bk.date = ?", masterId, date).Find(&bookings)

	if result.Error != nil {
		return []string{}, result.Error
	}

	master, err := mr.GetMasterById(ctx, masterId)

	if err != nil {
		return []string{}, err
	}

	workStart, _ := time.Parse("15:04", master.Start_working_time)
	workEnd, _ := time.Parse("15:04", master.End_working_time)
	slotDuration := 30 * time.Minute
	slots := []string{}

	for t := workStart; t.Before(workEnd); t = t.Add(slotDuration) {
		slots = append(slots, t.Format("15:04"))
	}

	availableBookingTimes := sliceutils.Filter(slots, func(slot string, _ int, _ []string) bool {
		slotStart := parseToMinutes(slot)
		slotEnd := slotStart + int(slotDuration)

		isBooked := false

		for _, booking := range bookings {
			bookingStart := parseToMinutes(booking.Time)
			bookingEnd := bookingStart + 30

			if slotStart < bookingEnd && slotEnd > bookingStart && booking.Time == slot {
				isBooked = true
				break
			}
		}
		return !isBooked
	})

	return availableBookingTimes, nil
}

func (mr masterDB) GetMasterUnavailableSchedules(ctx context.Context, masterId int) ([]domain.MasterUnavailableSchedule, error) {
	var masterUnavailableSchedules []domain.MasterUnavailableSchedule
	result := mr.db.WithContext(ctx).Where("master_id = ?", masterId).Find(&masterUnavailableSchedules)

	return masterUnavailableSchedules, result.Error
}

func (mr masterDB) CreateMasterUnavailableSchedule(ctx context.Context, payload []domain.CreateMasterUnavailablePayload, master_id int) error {
	trxError := db.WithTransaction(ctx, mr.db, func(tx *gorm.DB) error {
		currentMasterSchedules, err := mr.GetMasterUnavailableSchedules(ctx, master_id)

		if err != nil {
			return err
		}

		var removedSchedules []int
		var addNewSchedules []domain.MasterUnavailableSchedule

		sliceutils.ForEach(payload, func(item domain.CreateMasterUnavailablePayload, _ int, _ []domain.CreateMasterUnavailablePayload) {
			_, ok := sliceutils.Find(currentMasterSchedules, func(schedule domain.MasterUnavailableSchedule, _ int, _ []domain.MasterUnavailableSchedule) bool {
				return schedule.Date == item.Date
			})

			if !ok {
				newSchedule := domain.MasterUnavailableSchedule{
					MasterId:  item.MasterId,
					DayOfWeek: item.DayOfWeek,
					Date:      item.Date,
					StartTime: item.StartTime,
					EndTime:   item.EndTime,
				}
				addNewSchedules = append(addNewSchedules, newSchedule)
			}
		})

		sliceutils.ForEach(currentMasterSchedules, func(schedule domain.MasterUnavailableSchedule, _ int, _ []domain.MasterUnavailableSchedule) {
			_, ok := sliceutils.Find(payload, func(item domain.CreateMasterUnavailablePayload, _ int, _ []domain.CreateMasterUnavailablePayload) bool {
				return schedule.Date == item.Date
			})

			if !ok {
				removedSchedules = append(removedSchedules, schedule.ID)
			}
		})

		if len(removedSchedules) > 0 {
			if err := tx.Delete(&domain.MasterUnavailableSchedule{}, removedSchedules).Error; err != nil {
				return err
			}
		}

		if len(addNewSchedules) > 0 {
			if err := tx.Create(&addNewSchedules).Error; err != nil {
				return err
			}
		}

		return nil
	})

	return trxError
}

func (mr masterDB) DeleteMaster(ctx context.Context, id int) error {
	result := mr.db.WithContext(ctx).Delete(domain.Master{}, id)

	return result.Error
}

func (mr masterDB) DeleteMasterUnavailableSchedule(ctx context.Context, id int) error {
	return mr.db.WithContext(ctx).Delete(domain.MasterUnavailableSchedule{}, id).Error
}

func (mr masterDB) UpdateMasterUnavailableSchedule(ctx context.Context, payload domain.MasterUnavailableSchedule) (domain.MasterUnavailableSchedule, error) {
	result := mr.db.WithContext(ctx).Updates(&payload)

	return payload, result.Error
}

func (mr masterDB) UpdateMasterWorkingTime(ctx context.Context, payload domain.MasterWorkingTimePayload) error {
	result := mr.db.WithContext(ctx).Model(&domain.Master{}).Select("start_working_time", "end_working_time").Where("id = ?", payload.ID).Updates(payload)

	return result.Error
}

func parseToMinutes(time string) int {
	parts := strings.Split(time, ":")
	hour, _ := strconv.Atoi(parts[0])
	minute, _ := strconv.Atoi(parts[1])
	return hour*60 + minute
}
