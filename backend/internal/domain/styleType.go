package domain

type StyleType struct {
	Base
	Name        string `json:"name" validation:"required,min=3,max=20"`
	Duration    int    `json:"duration" validation:"required"`
	Description string `json:"description" validate:"omitempty,max=50"`
}

type MasterStyleType struct {
	Base
	MasterId    int `json:"master_id"`
	StyleTypeId int `json:"style_type_id"`
}

type MasterStyleOffer struct {
	ID          int    `json:"id"`
	StyleTypeId int    `json:"style_type_id"`
	Name        string `json:"name"`
}

type CreateStyleTypePayload struct {
	Name        string `json:"name" validation:"required,min=3,max=20"`
	Duration    int    `json:"duration" validation:"required"`
	Description string `json:"description" validate:"omitempty,max=50"`
}

type CreateStyleTypeRes = SuccessResWithData[StyleType]
type StyleTypeListRes = SuccessResWithMeta[StyleType]
type MasterStyleOfferRes = SuccessResWithData[[]MasterStyleOffer]
type MasterStyleTypeRes = SuccessResWithData[[]MasterStyleType]
type MasterStyleTypeByIdRes = SuccessResWithData[MasterStyleType]
type StyleTypeByIdRes = SuccessResWithData[StyleType]
