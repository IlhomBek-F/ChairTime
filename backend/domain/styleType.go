package domain

type StyleType struct {
	Base
	Name        string `json:"name" validation:"required,min=3,max=20"`
	Duration    int    `json:"duration" validation:"required"`
	Description string `json:"description" validate:"omitempty,max=50"`
}

type CreateStyleTypePayload struct {
	Name        string `json:"name" validation:"required,min=3,max=20"`
	Duration    int    `json:"duration" validation:"required"`
	Description string `json:"description" validate:"omitempty,max=50"`
}

type CreateStyleTypeRes = SuccessResWithData[StyleType]
type StyleTypeListRes = SuccessResWithMeta[StyleType]
