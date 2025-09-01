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

// Get master styles offer godoc
//
//	@Summary		Get master styles offer
//	@Description	Get master styles offer
//	@Tags			Master
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param          master_id path int true "master_id"
//	@Param          page  query  int false "page"
//	@Param          page_size  query  int false "page_size"
//	@Success		201		{object}	domain.MasterStyleOfferRes "Master style offer list"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/master/{master_id}/styles-offer [get]
func GetMasterStylesOffer(app *app.Application, e echo.Context) error {
	master_id, err := strconv.Atoi(e.Param("master_id"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	master, err := app.Repository.Master.GetMasterById(master_id)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.NotFoundResponse(e, errors.New("master with this id does not exist"))
		} else {
			return app.InternalServerError(e, err)
		}
	}

	stylesOffer, err := app.Repository.Master.GetMasterStylesOffer(master.ID)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.MasterStyleOfferRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    stylesOffer,
	}

	return e.JSON(http.StatusOK, successRes)
}
