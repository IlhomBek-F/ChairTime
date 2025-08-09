package main

import (
	"chairTime/api"
	"chairTime/api/routes"
	"chairTime/domain"
	"chairTime/internal/auth"
	"chairTime/internal/db"
	"chairTime/internal/env"
	"chairTime/repository"
	"time"

	"go.uber.org/zap"
)

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
			Secret: env.GetString("ACCESS_TOKEN_SECRET", "example"),
			Exp:    time.Duration(env.GetInt("ACCESS_TOKEN_EXPIRY_HOUR", 2)),
			Iss:    "chairtime",
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
		cfg.Auth.Secret,
		cfg.Auth.Iss,
		cfg.Auth.Iss,
	)

	repository := repository.NewRepo(db)

	app := &api.Application{
		Config:        cfg,
		Authenticator: jwtAuthenticator,
		Logger:        logger,
		Db:            db,
		Repository:    repository,
	}

	echoRoute := routes.Mount(app)
	logger.Fatal(routes.Run(app, echoRoute))
}
