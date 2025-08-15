package domain

type User struct {
	Base
	Username string `json:"username"`
	Password string `json:"-"`
	Phone    string `json:"phone"`
}

type UserListRes = SuccessResWithMeta[User]
type UserRes = SuccessResWithData[User]
