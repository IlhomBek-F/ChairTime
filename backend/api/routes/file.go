package routes

import (
	"chairTime/api"
	fileController "chairTime/api/controllers/file"

	"github.com/labstack/echo/v4"
)

func NewFileRoute(app *api.Application, groupRoute, publicRoute echo.Group) {
	publicRoute.GET("/file/:token", app.RouteHandler(fileController.ServeImage))
	groupRoute.POST("/file/upload", app.RouteHandler(fileController.UploadFile))
}
