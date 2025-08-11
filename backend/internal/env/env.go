package env

import (
	"fmt"
	"os"
	"strconv"
)

func GetString(key, fallback string) string {
	val, ok := os.LookupEnv(key)

	if !ok {
		return fallback
	}

	return val
}

func GetInt(key string, fallback int) int {
	val, ok := os.LookupEnv(key)

	if !ok {
		return fallback
	}

	valAsInt, err := strconv.Atoi(val)

	if err != nil {
		return fallback
	}

	return valAsInt
}

func GetBool(key string, fallback bool) bool {
	val, ok := os.LookupEnv(key)

	if !ok {
		return fallback
	}

	valAsBool, err := strconv.ParseBool(val)

	if err != nil {
		return fallback
	}

	return valAsBool
}

func GetDbAddr() string {
	host := GetString("DB_HOST", "localhost")
	DbPort := GetString("DB_PORT", "5432")
	database := GetString("DB_DATABASE", "postgres")
	password := GetString("DB_PASSWORD", "1234")
	username := GetString("DB_USERNAME", "postgres")
	schema := GetString("DB_SCHEMA", "public")

	address := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable search_path=%s",
		host, username, password, database, DbPort, schema)

	return address
}
