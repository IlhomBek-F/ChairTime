package constant

const (
	UserRoleId   = 1
	MasterRoleId = 2
	AdminRoleId  = 3
)

var RoleNames = map[int]string{
	MasterRoleId: "master",
	AdminRoleId:  "admin",
	UserRoleId:   "user",
}

const DATE_FORMAT_LAYOUT = "02-01-2006"
