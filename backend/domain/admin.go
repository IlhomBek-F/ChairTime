package domain

type Admin struct {
	Base
	Username string `json:"username"`
	Password string `json:"-"`
	Phone    string `json:"phone"`
	RoleId   int    `json:"role_id"`
}
