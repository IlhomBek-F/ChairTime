package domain

import (
	"time"
)

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
	AccessTokenSecret  string
	RefreshTokenSecret string
	AccessTokenExp     time.Duration
	RefreshTokenExp    time.Duration
	Iss                string
}
