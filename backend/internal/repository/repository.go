package repository

import (
	"chairTime/internal/domain"

	"gorm.io/gorm"
)

type Repository struct {
	Auth interface {
		GetUserByName(username string) (domain.User, error)
		SignUp(username, password, phone string) (domain.User, error)
	}

	Master interface {
		GetMasterByName(name string) (domain.Master, error)
		GetMasters() ([]domain.Master, error)
		CreateMaster(masterPayload domain.CreateMasterPayload) (domain.Master, error)
		GetMasterStylesOffer(masterId int) ([]domain.MasterStyleOffer, error)
		GetMasterById(masterId int) (domain.Master, error)
		GetMasterBooking(masterId int) ([]domain.MasterBooking, error)
		UpdateMaster(updatedMasterPayload domain.Master) (domain.Master, error)
		GetMasterUnavailableSchedules(masterId int) ([]domain.MasterUnavailableSchedule, error)
		CreateMasterUnavailableSchedule(payload []domain.CreateMasterUnavailablePayload, masterId int) error
		UpdateMasterUnavailableSchedule(payload domain.MasterUnavailableSchedule) (domain.MasterUnavailableSchedule, error)
		GetMasterAvailableTimeSlots(masterId int, date string) ([]string, error)
		UpdateMasterWorkingTime(workingTimePayload domain.MasterWorkingTimePayload) error
		DeleteMaster(id int) error
		DeleteMasterUnavailableSchedule(id int) error
	}

	StyleType interface {
		GetStyleTypeByName(name string) (domain.StyleType, error)
		CreateStyleType(styleTypePayload domain.CreateStyleTypePayload) (domain.StyleType, error)
		GetStyleTypes() ([]domain.StyleType, error)
		DeleteStyleType(id int) error
	}

	MasterStyleType interface {
		GetMasterStyleTypes() ([]domain.MasterStyleType, error)
		GetMasterStyleTypeById(id int) (domain.MasterStyleType, error)
	}

	Booking interface {
		CreateBooking(bookingPayload domain.CreateBookingPayload) (domain.Booking, error)
		CheckBookingExist(userId int, masterStyleTypeId int) (domain.Booking, error)
		GetUserBookings(userId int) ([]domain.BookingResponse, error)
		DeleteBooking(bookingId int) error
		GetBookingById(bookingId int) (domain.Booking, error)
		UpdateBooking(updatedPayload domain.Booking) (domain.Booking, error)
	}

	User interface {
		GetUsers() ([]domain.User, error)
		GetUserById(masterId int) (domain.User, error)
		DeleteUser(userId int) error
	}

	Admin interface {
		GetAdminByName(name string) (domain.Admin, error)
		GetAdminById(id int) (domain.Admin, error)
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
