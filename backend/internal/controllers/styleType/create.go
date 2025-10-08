package controllers

import (
	_ "chairTime/docs"
	"chairTime/internal/app"
	"chairTime/internal/domain"
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Create new style type godoc
//
//	@Summary		Create new style type
//	@Description	Create new style type
//	@Tags			StyleType
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param			payload	body		domain.CreateStyleTypePayload	true "Create styleType payload"
//	@Success		201		{object}	domain.CreateStyleTypeRes		"Created new styleType"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/style-type/create [post]
func CreateStyleType(app *app.Application, e echo.Context) error {
	var styleTypePayload domain.CreateStyleTypePayload

	if err := e.Bind(&styleTypePayload); err != nil {
		return app.BadRequestResponse(e, err)
	}

	styleType, err := app.Repository.StyleType.GetStyleTypeByName(e.Request().Context(), styleTypePayload.Name)

	if styleType.ID != 0 {
		return app.ConflictResponse(e, errors.New("style with this name exists"))
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return app.InternalServerError(e, err)
	}

	createdStyleType, err := app.Repository.StyleType.CreateStyleType(e.Request().Context(), styleTypePayload)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.CreateStyleTypeRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    createdStyleType,
	}

	return e.JSON(http.StatusOK, successRes)
}
