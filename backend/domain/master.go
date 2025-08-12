package domain

type Master struct {
	Base
	Firstname string `json:"first_name" validate:"required,min=3,max=20"`
	Lastname  string `json:"last_name" validate:"omitempty,max=50"`
	Phone     string `json:"phone" validate:"omitempty,e164"`
}

type CreateMasterPayload struct {
	Firstname     string `json:"first_name" validate:"required,min=3,max=20"`
	Lastname      string `json:"last_name" validate:"omitempty,max=50"`
	Phone         string `json:"phone" validate:"required,e164"`
	OfferStyleIds []int  `json:"offer_style_ids" validate:"required"`
	Password      string `json:"-" validate:"required,min=6"`
}

type CreateMasterRes = SuccessResWithData[Master]
type MasterListRes = SuccessResWithMeta[Master]
