package controllers

import (
	"chairTime/api"
	"chairTime/domain"
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Update master godoc
//
//	@Summary		Update master
//	@Description	Update master
//	@Tags			Master
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param			payload	body		domain.Master	true "master payload"
//	@Success		201		{object}	domain.CreateMasterRes		"Update master"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/master/update [put]
func UpdateMaster(app *api.Application, e echo.Context) error {
	var masterPayload domain.Master

	if err := e.Bind(&masterPayload); err != nil {
		return app.BadRequestResponse(e, err)
	}

	_, err := app.Repository.Master.GetMasterById(masterPayload.ID)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.NotFoundResponse(e, errors.New("master not found"))
		} else {
			return app.InternalServerError(e, err)
		}
	}

	updatedMaster, err := app.Repository.Master.UpdateMaster(masterPayload)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.CreateMasterRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    updatedMaster,
	}

	return e.JSON(http.StatusOK, successRes)
}

// Update master unavailable schedule godoc
//
//	@Summary		Update master unavailable schedule
//	@Description	Update master unavailable schedule
//	@Tags			Master
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param			payload	body		domain.MasterUnavailableSchedule	true "master unavailable schedule payload"
//	@Success		201		{object}	domain.UpdatedMasterUnavailableScheduleRes		"Updated master unavailable schedule"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/master/unavailable/update [put]
func UpdateMasterUnavailableSchedule(app *api.Application, e echo.Context) error {
	var payload domain.MasterUnavailableSchedule

	if err := e.Bind(&payload); err != nil {
		return app.BadRequestResponse(e, err)
	}

	updatedMasterUnavailableSchedule, err := app.Repository.Master.UpdateMasterUnavailableSchedule(payload)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.UpdatedMasterUnavailableScheduleRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    updatedMasterUnavailableSchedule,
	}

	return e.JSON(http.StatusOK, successRes)
}
