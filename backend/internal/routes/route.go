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

	protectedRoute.Use(echojwt.WithConfig(echojwt.Config{
		SigningKey: []byte(app.Config.Auth.Secret),
		NewClaimsFunc: func(e echo.Context) jwt.Claims {
			return new(auth.CustomClaims)
		},
	}))

	AuthRoute(app, *publicRoute)
	MasterRoute(app, *protectedRoute)
	StyleTypeRoute(app, *protectedRoute)
	BookingRoute(app, *protectedRoute)
	UserRoute(app, *protectedRoute)
	NewMasterStyleTypeRoute(app, *protectedRoute)
	NewFileRoute(app, *protectedRoute, *publicRoute)

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
