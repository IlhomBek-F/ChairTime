package controllers

import (
	"chairTime/api"
	_ "chairTime/docs"
	"chairTime/domain"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get style types godoc
//
//	@Summary		Get style types
//	@Description	Get style types
//	@Tags			styleType
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param          page  query  int false "page"
//	@Param          page_size  query  int false "page_size"
//	@Success		201		{object}	domain.StyleTypeListRes "StyleType list"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/style-types [get]
func GetStyleTypes(app *api.Application, e echo.Context) error {
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
