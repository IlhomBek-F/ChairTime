package controllers

import (
	"chairTime/internal/app"
	"chairTime/internal/domain"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get masterStyleTypes offer godoc
//
//	@Summary		Get masterStyleTypes
//	@Description	Get masterStyleTypes
//	@Tags			MasterStyleType
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Success		201		{object}	domain.MasterStyleTypeRes "MasterStyleTypes"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/master-style-types [get]
func GetMasterStyleTypes(app *app.Application, e echo.Context) error {
	var mstStyleTypes []domain.MasterStyleType

	mstStyleTypes, err := app.Repository.MasterStyleType.GetMasterStyleTypes()

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.MasterStyleTypeRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    mstStyleTypes,
	}

	return e.JSON(http.StatusOK, successRes)
}
