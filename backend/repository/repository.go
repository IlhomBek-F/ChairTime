package repository

import (
	"chairTime/domain"

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
		UpdateMaster(updatedMasterPayload domain.Master) (domain.Master, error)
	}

	StyleType interface {
		GetStyleTypeByName(name string) (domain.StyleType, error)
		CreateStyleType(styleTypePayload domain.CreateStyleTypePayload) (domain.StyleType, error)
		GetStyleTypes() ([]domain.StyleType, error)
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
}

func NewRepo(db *gorm.DB) Repository {
	return Repository{
		Auth:            NewAuthRepo(db),
		Master:          NewMasterRepo(db),
		StyleType:       NewStyleTypeRepo(db),
		Booking:         NewBookingRepo(db),
		User:            NewUserRepo(db),
		MasterStyleType: NewMasterStyleTypeRepo(db),
	}
}
