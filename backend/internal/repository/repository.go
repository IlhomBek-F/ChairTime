package repository

import (
	"chairTime/internal/domain"
	"context"

	"gorm.io/gorm"
)

type Repository struct {
	Auth interface {
		GetUserByName(ctx context.Context, username string) (domain.User, error)
		SignUp(ctx context.Context, username, password, phone string) (domain.User, error)
	}

	Master interface {
		GetMasterByName(ctx context.Context, name string) (domain.Master, error)
		GetMasters(ctx context.Context) ([]domain.Master, error)
		CreateMaster(ctx context.Context, masterPayload domain.CreateMasterPayload) (domain.Master, error)
		GetMasterStylesOffer(ctx context.Context, masterId int) ([]domain.MasterStyleOffer, error)
		GetMasterById(ctx context.Context, masterId int) (domain.Master, error)
		GetMasterBooking(ctx context.Context, masterId int) ([]domain.MasterBooking, error)
		UpdateMaster(ctx context.Context, updatedMasterPayload domain.Master) (domain.Master, error)
		GetMasterUnavailableSchedules(ctx context.Context, masterId int) ([]domain.MasterUnavailableSchedule, error)
		CreateMasterUnavailableSchedule(ctx context.Context, payload []domain.CreateMasterUnavailablePayload, masterId int) error
		UpdateMasterUnavailableSchedule(ctx context.Context, payload domain.MasterUnavailableSchedule) (domain.MasterUnavailableSchedule, error)
		GetMasterAvailableTimeSlots(ctx context.Context, masterId int, date string) ([]string, error)
		UpdateMasterWorkingTime(ctx context.Context, workingTimePayload domain.MasterWorkingTimePayload) error
		DeleteMaster(ctx context.Context, id int) error
		DeleteMasterUnavailableSchedule(ctx context.Context, id int) error
	}

	StyleType interface {
		GetStyleTypeByName(ctx context.Context, name string) (domain.StyleType, error)
		CreateStyleType(ctx context.Context, styleTypePayload domain.CreateStyleTypePayload) (domain.StyleType, error)
		GetStyleTypes(ctx context.Context) ([]domain.StyleType, error)
		DeleteStyleType(ctx context.Context, id int) error
		GetStyleTypeById(ctx context.Context, id int) (domain.StyleType, error)
		UpdateStyleType(ctx context.Context, updatedStyleType domain.StyleType) (domain.StyleType, error)
	}

	MasterStyleType interface {
		GetMasterStyleTypes(ctx context.Context) ([]domain.MasterStyleType, error)
		GetMasterStyleTypeById(ctx context.Context, id int) (domain.MasterStyleType, error)
	}

	Booking interface {
		CreateBooking(ctx context.Context, bookingPayload domain.CreateBookingPayload) (domain.Booking, error)
		CheckBookingExist(ctx context.Context, userId int, masterStyleTypeId int) (domain.Booking, error)
		GetUserBookings(ctx context.Context, userId int) ([]domain.BookingResponse, error)
		DeleteBooking(ctx context.Context, bookingId int) error
		GetBookingById(ctx context.Context, bookingId int) (domain.Booking, error)
		UpdateBooking(ctx context.Context, updatedPayload domain.Booking) (domain.Booking, error)
		DailyCleanUpBookingScheduler() error
	}

	User interface {
		GetUsers(ctx context.Context) ([]domain.User, error)
		GetUserById(ctx context.Context, masterId int) (domain.User, error)
		DeleteUser(ctx context.Context, userId int) error
	}

	Admin interface {
		GetAdminByName(ctx context.Context, name string) (domain.Admin, error)
		GetAdminById(ctx context.Context, id int) (domain.Admin, error)
	}
}

func NewRepo(db *gorm.DB) Repository {
	return Repository{
		Admin:           NewAdminRepo(db),
		Master:          NewMasterRepo(db),
		User:            NewUserRepo(db),
		Auth:            NewAuthRepo(db),
		StyleType:       NewStyleTypeRepo(db),
		Booking:         NewBookingRepo(db),
		MasterStyleType: NewMasterStyleTypeRepo(db),
	}
}
