package routes

import (
	"chairTime/api"
	"net/http"
	"time"

	echojwt "github.com/labstack/echo-jwt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
	"golang.org/x/time/rate"
)

func Mount(app *api.Application) http.Handler {
	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.Logger())
	e.Use(configureCORS())
	e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(rate.Limit(10))))
	e.Use(middleware.TimeoutWithConfig(middleware.TimeoutConfig{
		Skipper:      middleware.DefaultSkipper,
		ErrorMessage: "custom timeout error message returns to client",
		Timeout:      2 * time.Second,
	}))

	publicRoute := e.Group("/api")
	protectedRoute := e.Group("/api")

	e.GET("/swagger/*", echoSwagger.WrapHandler)
	protectedRoute.Use(echojwt.JWT([]byte(app.Config.Auth.Secret)))

	AuthRoute(app, *publicRoute)
	MasterRoute(app, *protectedRoute)
	StyleTypeRoute(app, *protectedRoute)
	BookingRoute(app, *protectedRoute)
	UserRoute(app, *protectedRoute)
	NewMasterStyleTypeRoute(app, *protectedRoute)
	return e
}

func Run(app *api.Application, routeHandler http.Handler) error {
	serverConfig := http.Server{
		Addr:         app.Config.Addr,
		Handler:      routeHandler,
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	app.Logger.Infow("server has started", "addr", app.Config.Addr, "env", app.Config.Env)

	err := serverConfig.ListenAndServe()

	if err != nil {
		return err
	}

	return nil
}

func configureCORS() echo.MiddlewareFunc {
	return middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"https://*", "http://*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           30,
	})
}
