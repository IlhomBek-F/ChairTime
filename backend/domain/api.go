package domain

import "time"

type Application struct {
	Config Config
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
