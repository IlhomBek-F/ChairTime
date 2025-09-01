package controllers

import (
	_ "chairTime/docs"
	"chairTime/internal/app"
	"chairTime/internal/domain"
	"errors"
	"image"
	_ "image/gif" // register GIF decoder
	"image/jpeg"
	_ "image/png" // register PNG decoder
	"net/http"
	"os"
	"path/filepath"

	_ "golang.org/x/image/webp"

	"github.com/labstack/echo/v4"
)

// Create Upload a file godoc
//
//		@Summary		Upload a file
//		@Description	Upload a file
//		@Tags			File
//		@Accept			multipart/form-data
//		@Security       JWT
//		@Produce		json
//	 @Param profile_image formData file true "File to upload"
//		@Success		201		{object}	domain.SuccessRes
//		@Failure		400		{object}	error
//		@Failure		500		{object}	error
//		@Router			/file/upload [post]
func UploadFile(app *app.Application, e echo.Context) error {
	e.Request().ParseMultipartForm(10 << 20) // max 10mb

	file, err := e.FormFile("profile_image")

	if err != nil {
		return err
	}

	if file.Size > 10<<20 {
		return app.BadRequestResponse(e, errors.New("max file size exceeded"))
	}

	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	img, _, err := image.Decode(src)

	if err != nil {
		return app.BadRequestResponse(e, errors.New("failed decode file"))
	}

	uploadDir := filepath.Join("..", "public")
	os.MkdirAll(uploadDir, os.ModePerm)

	claims, err := app.GetCustomClaims(e)

	if err != nil {
		return app.BadRequestResponse(e, err)
	}

	dst, err := os.Create(filepath.Join(uploadDir, claims.RegisteredClaims.Subject+".jpg"))

	if err != nil {
		return err
	}
	defer dst.Close()

	err = jpeg.Encode(dst, img, &jpeg.Options{Quality: 85})

	if err != nil {
		return app.BadRequestResponse(e, errors.New("failed encode file"))
	}

	return e.JSON(http.StatusOK, domain.SuccessRes{Status: http.StatusOK, Message: "Success"})
}
