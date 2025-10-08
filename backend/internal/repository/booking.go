package repository

import (
	"chairTime/constant"
	"chairTime/internal/domain"
	"context"
	"time"

	"gorm.io/gorm"
)

type bookingRepo interface {
	CreateBooking(ctx context.Context, bookingPayload domain.CreateBookingPayload) (domain.Booking, error)
	CheckBookingExist(ctx context.Context, userId int, masterStyleTypeId int) (domain.Booking, error)
	GetUserBookings(ctx context.Context, userId int) ([]domain.BookingResponse, error)
	DeleteBooking(ctx context.Context, bookingId int) error
	GetBookingById(ctx context.Context, bookingId int) (domain.Booking, error)
	UpdateBooking(ctx context.Context, updatedPayload domain.Booking) (domain.Booking, error)
	DailyCleanUpBookingScheduler() error
}

type bookingDB struct {
	db *gorm.DB
}

func NewBookingRepo(db *gorm.DB) bookingRepo {
	return bookingDB{db: db}
}

func (br bookingDB) CreateBooking(ctx context.Context, payload domain.CreateBookingPayload) (domain.Booking, error) {
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

func (br bookingDB) CheckBookingExist(ctx context.Context, userId int, masterStyleTYpeId int) (domain.Booking, error) {
	return domain.Booking{}, nil
}

func (br bookingDB) GetUserBookings(ctx context.Context, userId int) ([]domain.BookingResponse, error) {
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

func (br bookingDB) DeleteBooking(ctx context.Context, bookingId int) error {
	return br.db.WithContext(ctx).Delete(domain.Booking{}, bookingId).Error
}

func (br bookingDB) GetBookingById(ctx context.Context, bookingId int) (domain.Booking, error) {
	var booking domain.Booking

	result := br.db.WithContext(ctx).First(&booking, bookingId)

	return booking, result.Error
}

func (br bookingDB) UpdateBooking(ctx context.Context, updatedBookingPayload domain.Booking) (domain.Booking, error) {
	result := br.db.WithContext(ctx).Updates(&updatedBookingPayload)

	return updatedBookingPayload, result.Error
}

func (br bookingDB) DailyCleanUpBookingScheduler() error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	yesterday := time.Now().AddDate(0, 0, -1)
	start := time.Date(yesterday.Year(), yesterday.Month(), yesterday.Day(), 0, 0, 0, 0, yesterday.Location())
	end := start.Add(24 * time.Hour).Format(constant.DATE_FORMAT_LAYOUT)

	result := br.db.WithContext(ctx).
		Where("date >= ? AND date < ?", start.Format(constant.DATE_FORMAT_LAYOUT), end).
		Delete(&domain.Booking{})

	return result.Error
}
