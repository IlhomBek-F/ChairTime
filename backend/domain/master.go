package domain

type Master struct {
	Base
	Firstname     string `json:"firstname" validate:"required,min=3,max=20"`
	Lastname      string `json:"lastname" validate:"omitempty,max=50"`
	Phone         string `json:"phone" validate:"omitempty,e164"`
	OfferStyleIds []int  `json:"offer_style_ids" validate:"required" gorm:"-"`
	Status        string `json:"status" validate:"required"`
}

type CreateMasterPayload struct {
	Firstname     string `json:"firstname" validate:"required,min=3,max=20"`
	Lastname      string `json:"lastname" validate:"omitempty,max=50"`
	Phone         string `json:"phone" validate:"required,e164"`
	OfferStyleIds []int  `json:"offer_style_ids" validate:"required"`
	Password      string `json:"-" validate:"required,min=6"`
}

type MasterUnavailableSchedule struct {
	Base
	MasterId  int    `json:"master_id" validate:"required"`
	DayOfWeek int    `json:"day_of_week"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
	Date      string `json:"date"`
}

type CreateMasterUnavailablePayload struct {
	MasterId  int    `json:"master_id" validate:"required"`
	DayOfWeek int    `json:"day_of_week"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
	Date      string `json:"date"`
}

type CreateMasterRes = SuccessResWithData[Master]
type MasterListRes = SuccessResWithMeta[Master]
type MasterUnavailableRes = SuccessResWithData[[]MasterUnavailableSchedule]
type UpdatedMasterUnavailableScheduleRes = SuccessResWithData[MasterUnavailableSchedule]
