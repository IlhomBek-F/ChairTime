package routes

import (
	"chairTime/internal/app"
	"chairTime/internal/auth"
	"chairTime/internal/domain"
	"context"
	"fmt"
	"log"
	"net/http"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/go-playground/validator"
	"github.com/golang-jwt/jwt/v4"
	echojwt "github.com/labstack/echo-jwt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
	"golang.org/x/time/rate"
)

func Mount(app *app.Application) http.Handler {
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

	e.Validator = &domain.CustomValidator{Validator: validator.New()}
	publicRoute := e.Group("/api")
	protectedRoute := e.Group("/api")

	protectedRoute.Static("/", "../public")
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	jwtConfig := echojwt.Config{
		SigningKey:    []byte(app.Config.Auth.AccessTokenSecret),
		NewClaimsFunc: func(e echo.Context) jwt.Claims { return new(auth.CustomClaims) },
	}

	protectedRoute.Use(echojwt.WithConfig(jwtConfig), userCheckMiddleWare(app))

	protectedRoute.Use()

	AuthRoute(app, *publicRoute)
	MasterRoute(app, *protectedRoute)
	StyleTypeRoute(app, *protectedRoute)
	BookingRoute(app, *protectedRoute)
	UserRoute(app, *protectedRoute)
	NewMasterStyleTypeRoute(app, *protectedRoute)
	NewFileRoute(app, *protectedRoute, *publicRoute)
	NewAdminRoute(app, *protectedRoute)

	return e
}

func Run(app *app.Application, routeHandler http.Handler) {
	serverConfig := http.Server{
		Addr:         app.Config.Addr,
		Handler:      routeHandler,
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	done := make(chan bool)

	go gracefullyShutDown(&serverConfig, done)

	app.Logger.Infow("server has started", "addr", app.Config.Addr, "env", app.Config.Env)

	err := serverConfig.ListenAndServe()

	if err != nil {
		panic(fmt.Sprintf("http server error: %s", err))
	}

	<-done
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

func gracefullyShutDown(apiServer *http.Server, done chan bool) {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	<-ctx.Done()

	log.Println("shutting down gracefully, press Ctrl+C again to force")
	stop() // Allow Ctrl+C to force shutdown

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := apiServer.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown with error: %v", err)
	}

	log.Println("Server exiting")

	done <- true
}

func userCheckMiddleWare(app *app.Application) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			tokenInterface := c.Get("user")

			if tokenInterface == nil {
				return echo.NewHTTPError(http.StatusUnauthorized, "token missing")
			}

			token, ok := tokenInterface.(*jwt.Token)
			if !ok {
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid token type")
			}

			claims, ok := token.Claims.(*auth.CustomClaims)

			if !ok {
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid claims")
			}

			userId, err := strconv.Atoi(claims.Subject)

			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid user id")
			}

			_, clientErr := app.Repository.User.GetUserById(userId)
			_, masterErr := app.Repository.Master.GetMasterById(userId)
			_, adErr := app.Repository.Admin.GetAdminById(userId)

			if clientErr != nil && masterErr != nil && adErr != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, "user not found")
			}

			return next(c)
		}
	}
}
