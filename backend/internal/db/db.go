package db

import (
	"context"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func New(addr string, maxOpenConns, maxIdleConns int, maxIdleTime string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(addr), &gorm.Config{})

	if err != nil {
		return nil, err
	}

	sqlDb, _ := db.DB()

	sqlDb.SetMaxOpenConns(maxOpenConns)
	sqlDb.SetMaxIdleConns(maxIdleConns)

	duration, err := time.ParseDuration(maxIdleTime)

	if err != nil {
		return nil, err
	}

	sqlDb.SetConnMaxIdleTime(duration)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err = sqlDb.PingContext(ctx); err != nil {
		return nil, err
	}

	return db, nil
}
