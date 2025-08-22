package controllers

import (
	"chairTime/api"
	_ "chairTime/docs"
	"chairTime/domain"
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Create master godoc
//
//	@Summary		Create master
//	@Description	Create master
//	@Tags			Master
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param			payload	body		domain.CreateMasterPayload	true "Master payload"
//	@Success		201		{object}	domain.CreateMasterRes		"Created new master"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/master/create [post]
func CreateMaster(app *api.Application, e echo.Context) error {
	var masterPayload domain.CreateMasterPayload

	if err := e.Bind(&masterPayload); err != nil {
		return app.BadRequestResponse(e, err)
	}

	master, err := app.Repository.Master.GetMasterByName(masterPayload.Firstname)

	if master.ID != 0 {
		return app.ConflictResponse(e, errors.New("master with this name exists"))
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return app.InternalServerError(e, err)
	}

	createdMaster, err := app.Repository.Master.CreateMaster(masterPayload)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.CreateMasterRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    createdMaster,
	}

	return e.JSON(http.StatusOK, successRes)
}

// Create master unavailable schedule godoc
//
//	@Summary		Create unavailable schedule
//	@Description	Create unavailable schedule
//	@Tags			Master
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param			payload	body		[]domain.CreateMasterUnavailablePayload	true "Master unavailable schedule payload"
//	@Success		201		{object}	domain.SuccessRes		"Created new unavailable schedule"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/master/unavailable [post]
func CreateMasterUnavailableSchedule(app *api.Application, e echo.Context) error {
	var payload []domain.CreateMasterUnavailablePayload

	if err := e.Bind(&payload); err != nil {
		return app.BadRequestResponse(e, err)
	}

	if err := app.Repository.Master.CreateMasterUnavailableSchedule(payload); err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.SuccessRes{
		Status:  http.StatusOK,
		Message: "success",
	}

	return e.JSON(http.StatusOK, successRes)
}
