package controllers

import (
	"chairTime/internal/app"
	"chairTime/internal/domain"
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Update style type godoc
//
//	@Summary		Update style type
//	@Description	Update style type
//	@Tags			StyleType
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param			payload	body		domain.StyleType	true "style type payload"
//	@Success		201		{object}	domain.CreateStyleTypeRes		"Update style type"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/style-type/update [put]
func UpdateStyleType(app *app.Application, e echo.Context) error {
	var updatedStyleType domain.StyleType

	if err := e.Bind(&updatedStyleType); err != nil {
		return app.BadRequestResponse(e, err)
	}

	_, err := app.Repository.StyleType.GetStyleTypeById(e.Request().Context(), updatedStyleType.ID)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.NotFoundResponse(e, errors.New("style type not found"))
		} else {
			return app.InternalServerError(e, err)
		}
	}

	updatedStyleT, err := app.Repository.StyleType.UpdateStyleType(e.Request().Context(), updatedStyleType)

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.CreateStyleTypeRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    updatedStyleT,
	}

	return e.JSON(http.StatusOK, successRes)
}
