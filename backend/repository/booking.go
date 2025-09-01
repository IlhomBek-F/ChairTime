package repository

import (
	"chairTime/domain"
	"context"
	"time"

	"gorm.io/gorm"
)

type bookingRepo interface {
	CreateBooking(bookingPayload domain.CreateBookingPayload) (domain.Booking, error)
	CheckBookingExist(userId int, masterStyleTypeId int) (domain.Booking, error)
	GetUserBookings(userId int) ([]domain.BookingResponse, error)
	DeleteBooking(bookingId int) error
	GetBookingById(bookingId int) (domain.Booking, error)
	UpdateBooking(updatedPayload domain.Booking) (domain.Booking, error)
}

type bookingDB struct {
	db *gorm.DB
}

func NewBookingRepo(db *gorm.DB) bookingRepo {
	return bookingDB{db: db}
}

func (br bookingDB) CreateBooking(payload domain.CreateBookingPayload) (domain.Booking, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	booking := domain.Booking{
		UserId:            payload.UserId,
		MasterStyleTypeId: payload.MasterStyleTypeId,
		Date:              payload.Date,
		Time:              payload.Time,
		Description:       payload.Description,
	}

	result := br.db.WithContext(ctx).Create(&booking)

	return booking, result.Error
}

func (br bookingDB) CheckBookingExist(userId int, masterStyleTYpeId int) (domain.Booking, error) {
	return domain.Booking{}, nil
}

func (br bookingDB) GetUserBookings(userId int) ([]domain.BookingResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var bookings []domain.BookingResponse

	result := br.db.WithContext(ctx).Table("bookings AS bk").
		Select("bk.id",
			"bk.created_at",
			"bk.updated_at",
			"ms.username AS master",
			"ms.phone",
			"bk.date",
			"bk.time",
			"st.name AS style_type").
		Joins("JOIN master_style_types AS mst ON mst.id = bk.master_style_type_id").
		Joins("JOIN masters AS ms ON ms.id = mst.master_id").
		Joins("JOIN style_types AS st ON st.id = mst.style_type_id").
		Where("bk.user_id = ?", userId).Find(&bookings)

	return bookings, result.Error
}

func (br bookingDB) DeleteBooking(bookingId int) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	return br.db.WithContext(ctx).Delete(domain.Booking{}, bookingId).Error
}

func (br bookingDB) GetBookingById(bookingId int) (domain.Booking, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var booking domain.Booking

	result := br.db.WithContext(ctx).First(&booking, bookingId)

	return booking, result.Error
}

func (br bookingDB) UpdateBooking(updatedBookingPayload domain.Booking) (domain.Booking, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	result := br.db.WithContext(ctx).Save(&updatedBookingPayload)

	return updatedBookingPayload, result.Error
}
