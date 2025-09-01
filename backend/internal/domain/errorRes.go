package domain

type ErrorRes struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}
