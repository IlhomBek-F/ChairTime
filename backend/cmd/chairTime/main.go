package main

import (
	_ "chairTime/docs"
	"chairTime/internal/app"
	"chairTime/internal/auth"
	"chairTime/internal/db"
	"chairTime/internal/domain"
	"chairTime/internal/env"
	"chairTime/internal/repository"
	"chairTime/internal/routes"
	"time"

	"go.uber.org/zap"
)

// Swagger
//
//	@title                       ChairTime API
//	@version                     1.0
//	@description                 A comprehensive API for managing hair style booking system.
//	@license.url                 http://www.apache.org/licenses/LICENSE-2.0.html
//	@host                        localhost:8080
//	@BasePath                    /api/
//	@schemes                     http https
//	@securityDefinitions.apiKey  JWT
//	@in                          header
//	@name                        Authorization
//	@description                 JWT security accessToken. Please add it in the format "Bearer {AccessToken}" to authorize your requests.
func main() {
	cfg := domain.Config{
		Addr: env.GetString("ADDR", ":8080"),
		Db: domain.DbConfig{
			Addr:         env.GetDbAddr(),
			MaxOpenConns: env.GetInt("DB_MAX_OPEN_CONNS", 30),
			MaxIdleConns: env.GetInt("DB_MAX_IDLE_CONNS", 30),
			MaxIdleTime:  env.GetString("DB_MAX_IDLE_TIME", "15m"),
		},
		Env: env.GetString("ENV", "development"),
		Auth: domain.AuthConfig{
			AccessTokenSecret:  env.GetString("ACCESS_TOKEN_SECRET", "example"),
			RefreshTokenSecret: env.GetString("REFRESH_TOKEN_SECRET", "example"),
			AccessTokenExp:     time.Duration(env.GetInt("ACCESS_TOKEN_EXPIRY_HOUR", 15)) * time.Minute,
			RefreshTokenExp:    time.Duration(env.GetInt("REFRESH_TOKEN_EXP_HOUR", 1)) * time.Hour,
			Iss:                "chairtime",
		},
	}

	// Logger
	logger := zap.Must(zap.NewProduction()).Sugar()
	defer logger.Sync()

	// Main Database
	db, err := db.New(
		cfg.Db.Addr,
		cfg.Db.MaxOpenConns,
		cfg.Db.MaxIdleConns,
		cfg.Db.MaxIdleTime,
	)

	if err != nil {
		logger.Fatal(err)
	}

	logger.Info("Database connection established")

	// Authentcator
	jwtAuthenticator := auth.NewJwtAuthenticator(
		cfg.Auth.AccessTokenSecret,
		cfg.Auth.RefreshTokenSecret,
		cfg.Auth.Iss,
		cfg.Auth.Iss,
	)

	repository := repository.NewRepo(db)

	app := &app.Application{
		Config:        cfg,
		Authenticator: jwtAuthenticator,
		Logger:        logger,
		Db:            db,
		Repository:    repository,
	}

	routes.Run(app, routes.Mount(app))
}
