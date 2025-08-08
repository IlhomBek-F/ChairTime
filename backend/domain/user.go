package domain

type User struct {
	Base
	Username string `json:"username"`
	Password string `json:"-"`
}
