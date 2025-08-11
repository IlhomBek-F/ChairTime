package domain

import (
	"time"
)

type Base struct {
	ID        int       `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type MetaModel struct {
	Page    int   `json:"page"`
	Total   int64 `json:"total"`
	PerPage uint  `json:"per_page"`
}
