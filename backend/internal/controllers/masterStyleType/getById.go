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

// Get masterStyleType by id offer godoc
//
//	@Summary		Get masterStyleType by id
//	@Description	Get masterStyleType by id
//	@Tags			MasterStyleType
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param          master_style_type_id path int true "master_style_type_id"
//	@Success		201		{object}	domain.MasterStyleTypeByIdRes "MasterStyleType info"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/master-style-type/{master_style_type_id} [get]
func GetMstStyleTypeById(app *app.Application, e echo.Context) error {
	mstStyleTypeId, err := strconv.Atoi(e.Param("master_style_type_id"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	mstStyleType, err := app.Repository.MasterStyleType.GetMasterStyleTypeById(e.Request().Context(), mstStyleTypeId)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.NotFoundResponse(e, errors.New("master style type with this id does not exist"))
		} else {
			return app.InternalServerError(e, err)
		}
	}

	succesRes := domain.MasterStyleTypeByIdRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    mstStyleType,
	}

	return e.JSON(http.StatusOK, succesRes)
}
