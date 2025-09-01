package routes

import (
	"chairTime/internal/app"
	fileController "chairTime/internal/controllers/file"

	"github.com/labstack/echo/v4"
)

func NewFileRoute(app *app.Application, groupRoute, publicRoute echo.Group) {
	publicRoute.GET("/file/:token", app.RouteHandler(fileController.ServeImage))
	groupRoute.POST("/file/upload", app.RouteHandler(fileController.UploadFile))
}
