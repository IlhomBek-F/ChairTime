package controllers

import (
	"chairTime/api"
	"chairTime/domain"
	"errors"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Get master by id offer godoc
//
//	@Summary		Get master by id
//	@Description	Get master by id
//	@Tags			Master
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param          master_id path int true "master_id"
//	@Success		201		{object}	domain.MasterRes "Master info"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/master/{master_id} [get]
func GetMasterById(app *api.Application, e echo.Context) error {
	masterId, err := strconv.Atoi(e.Param("master_id"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	master, err := app.Repository.Master.GetMasterById(masterId)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.NotFoundResponse(e, errors.New("master with this id does not exist"))
		} else {
			return app.InternalServerError(e, err)
		}
	}

	succesRes := domain.MasterRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    master,
	}

	return e.JSON(http.StatusOK, succesRes)
}
