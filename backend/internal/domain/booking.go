package domain

type Booking struct {
	Base
	UserId            int    `json:"user_id"`
	MasterStyleTypeId int    `json:"master_style_type_id"`
	Date              string `json:"date"`
	Time              string `json:"time"`
	Description       string `json:"description"`
}

type BookingResponse struct {
	Base
	Master    string `json:"master" gorm:"column:master"`
	StyleType string `json:"style_type"`
	Date      string `json:"date"`
	Time      string `json:"time"`
	Phone     string `json:"phone"`
}

type CreateBookingPayload struct {
	UserId            int    `json:"user_id"`
	MasterStyleTypeId int    `json:"master_style_type_id"`
	Date              string `json:"date"`
	Time              string `json:"time"`
	Description       string `json:"description"`
}

type CreateBookingRes = SuccessResWithData[Booking]
type BookingListRes = SuccessResWithMeta[BookingResponse]
type BookingByIdRes = SuccessResWithData[Booking]
