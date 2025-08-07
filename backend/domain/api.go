package domain

import (
	"time"

	"go.uber.org/zap"
)

type Application struct {
	Config        Config
	Authenticator Authenticator
	Logger        *zap.SugaredLogger
}

type Config struct {
	Addr string
	Db   DbConfig
	Env  string
	Auth AuthConfig
}

type DbConfig struct {
	Addr         string
	MaxOpenConns int
	MaxIdleConns int
	MaxIdleTime  string
}

type AuthConfig struct {
	Secret string
	Exp    time.Duration
	Iss    string
}
