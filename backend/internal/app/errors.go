package app

import (
	"chairTime/internal/domain"
	"errors"
	"net/http"

	"github.com/jackc/pgx/v5/pgconn"
	"github.com/labstack/echo/v4"
)

func (app *Application) InternalServerError(e echo.Context, err error) error {
	app.Logger.Errorw("internal error", "method", e.Request().Method, "path", e.Request().URL.Path, "error", err.Error())

	return writeJSONError(e, http.StatusInternalServerError, "the server encountered a problem")
}

func (app *Application) ForbiddenResponse(e echo.Context) error {
	app.Logger.Warnw("forbidden", "method", e.Request().Method, "path", e.Request().URL.Path, "error")

	return writeJSONError(e, http.StatusForbidden, "forbidden")
}

func (app *Application) BadRequestResponse(e echo.Context, err error) error {
	app.Logger.Warnf("bad request", "method", e.Request().Method, "path", e.Request().URL.Path, "error", err.Error())

	return writeJSONError(e, http.StatusBadRequest, err.Error())
}

func (app *Application) ConflictResponse(e echo.Context, err error) error {
	app.Logger.Errorf("conflict response", "method", e.Request().Method, "path", e.Request().URL.Path, "error", err.Error())

	return writeJSONError(e, http.StatusConflict, err.Error())
}

func (app *Application) NotFoundResponse(e echo.Context, err error) error {
	app.Logger.Warnf("not found error", "method", e.Request().Method, "path", e.Request().URL.Path, "error", err.Error())

	return writeJSONError(e, http.StatusNotFound, err.Error())
}

func (app *Application) UnauthorizedErrorResponse(e echo.Context, err error) error {
	app.Logger.Warnf("unauthorized error", "method", e.Request().Method, "path", e.Request().URL.Path, "error", err.Error())

	return writeJSONError(e, http.StatusUnauthorized, "unauthorized")
}

func (app *Application) UnauthorizedBasicErrorResponse(e echo.Context, err error) error {
	app.Logger.Warnf("unauthorized basic error", "method", e.Request().Method, "path", e.Request().URL.Path, "error", err.Error())

	e.Response().Header().Set("WWW-Authenticate", `Basic realm="restricted", charset="UTF-8"`)

	return writeJSONError(e, http.StatusUnauthorized, "unauthorized")
}

func (app *Application) RateLimitExceededResponse(e echo.Context, retryAfter string) error {
	app.Logger.Warnw("rate limit exceeded", "method", e.Request().Method, "path", e.Request().URL.Path)

	e.Response().Header().Set("Retry-After", retryAfter)

	return writeJSONError(e, http.StatusTooManyRequests, "rate limit exceeded, retry after: "+retryAfter)
}

func (app *Application) CheckForeignKeyViolationErr(e echo.Context, err error, errorMessage string) error {
	app.Logger.Warnf("foreign key violation", "method", e.Request().Method, "path", e.Request().URL.Path, "error", err.Error())
	var pgErr *pgconn.PgError

	if errors.As(err, &pgErr) {
		if pgErr.Code == "23503" {
			return writeJSONError(e, http.StatusConflict, errorMessage)
		}
	}

	return app.InternalServerError(e, err)
}

func TimeoutExceededError(err error, e echo.Context) error {
	return writeJSONError(e, http.StatusRequestTimeout, "The request took too long - please try again later.")
}

func writeJSONError(e echo.Context, status int, message string) error {
	err := domain.ErrorRes{
		Status:  status,
		Message: message,
	}

	return e.JSON(status, err)
}
