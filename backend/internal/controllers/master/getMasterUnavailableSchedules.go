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

// Get master unavailable schedules godoc
//
//	@Summary		Get master unavailable schedules
//	@Description	Get master unavailable schedules
//	@Tags			Master
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param          master_id  path  int true "master_id"
//	@Success		201		{object}	domain.MasterUnavailableRes "Master list"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/master/unavailables/{master_id} [get]
func GetMasterUnavailableSchedules(app *app.Application, e echo.Context) error {
	masterId, err := strconv.Atoi(e.Param("master_id"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	master, err := app.Repository.Master.GetMasterById(masterId)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.NotFoundResponse(e, errors.New("master not found"))
		} else {
			return app.InternalServerError(e, err)
		}
	}

	masterUnavailableSchedules, err := app.Repository.Master.GetMasterUnavailableSchedules(master.ID)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.MasterUnavailableRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    masterUnavailableSchedules,
	}

	return e.JSON(http.StatusOK, successRes)
}
