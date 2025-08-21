package domain

type User struct {
	Base
	Username string `json:"username"`
	Password string `json:"-"`
	Phone    string `json:"phone"`
	RoleId   int    `json:"role_id"`
}

type UserListRes = SuccessResWithMeta[User]
type UserRes = SuccessResWithData[User]
