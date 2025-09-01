package controllers

import (
	_ "chairTime/docs"
	"chairTime/internal/app"
	"chairTime/internal/domain"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get masters godoc
//
//	@Summary		Get masters
//	@Description	Get masters
//	@Tags			Master
//	@Accept			json
//	@Security       JWT
//	@Produce		json
//	@Param          page  query  int false "page"
//	@Param          page_size  query  int false "page_size"
//	@Success		201		{object}	domain.MasterListRes "Master list"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/masters [get]
func GetMasters(app *app.Application, e echo.Context) error {
	masters, err := app.Repository.Master.GetMasters()

	if err != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.MasterListRes{
		Status:  http.StatusOK,
		Message: "success",
		Data:    masters,
	}

	return e.JSON(http.StatusOK, successRes)
}
