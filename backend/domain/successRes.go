package domain

type SuccessResWithMeta[T any] struct {
	Status  int       `json:"status"`
	Message string    `json:"message"`
	Data    T         `json:"data,omitzero"`
	Meta    MetaModel `json:"meta,omitzero"`
}

type SuccessResWithData[T any] struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
	Data    T      `json:"data,omitzero"`
}

type SuccessRes struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}
