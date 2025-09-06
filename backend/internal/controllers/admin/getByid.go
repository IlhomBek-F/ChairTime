package controllers

import (
	"chairTime/internal/app"
	"chairTime/internal/domain"
	"errors"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Get admin by id offer godoc
//
//	@Summary		Get admin by id
//	@Description	Get admin by id
//	@Tags			Admin
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param          admin_id path int true "admin_id"
//	@Success		201		{object}	domain.AdminRes "Admin info"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/admin/{admin_id} [get]
func GetAdminId(app *app.Application, e echo.Context) error {
	adminId, err := strconv.Atoi(e.Param("admin_id"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	admin, err := app.Repository.Admin.GetAdminById(adminId)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.NotFoundResponse(e, errors.New("admin with this id does not exist"))
		} else {
			return app.InternalServerError(e, err)
		}
	}

	succesRes := domain.AdminRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    admin,
	}

	return e.JSON(http.StatusOK, succesRes)
}
