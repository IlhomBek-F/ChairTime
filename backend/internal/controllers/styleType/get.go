package controllers

import (
	_ "chairTime/docs"
	"chairTime/internal/app"
	"chairTime/internal/domain"
	"errors"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Get style types godoc
//
//	@Summary		Get style types
//	@Description	Get style types
//	@Tags			StyleType
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param          page  query  int false "page"
//	@Param          page_size  query  int false "page_size"
//	@Success		201		{object}	domain.StyleTypeListRes "StyleType list"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/style-types [get]
func GetStyleTypes(app *app.Application, e echo.Context) error {
	styleTypes, err := app.Repository.StyleType.GetStyleTypes()

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.StyleTypeListRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    styleTypes,
	}

	return e.JSON(http.StatusOK, successRes)
}

// Get style type by id offer godoc
//
//	@Summary		Get style type by id
//	@Description	Get style type by id
//	@Tags			StyleType
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param          style_type_id path int true "style type id"
//	@Success		201		{object}	domain.StyleTypeByIdRes "Master info"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/style-type/{style_type_id} [get]
func GetStyleTypeById(app *app.Application, e echo.Context) error {
	styleTypeId, err := strconv.Atoi(e.Param("style_type_id"))

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	master, err := app.Repository.StyleType.GetStyleTypeById(styleTypeId)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return app.NotFoundResponse(e, errors.New("style type with this id does not exist"))
		} else {
			return app.InternalServerError(e, err)
		}
	}

	succesRes := domain.StyleTypeByIdRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    master,
	}

	return e.JSON(http.StatusOK, succesRes)
}
