package domain

type User struct {
	Base
	Username string `json:"username" validate:"required,min=3,max=20"`
	Password string `json:"-"`
	Phone    string `json:"phone"`
	RoleId   int    `json:"role_id"`
}

type UserListRes = SuccessResWithMeta[User]
type UserRes = SuccessResWithData[User]
