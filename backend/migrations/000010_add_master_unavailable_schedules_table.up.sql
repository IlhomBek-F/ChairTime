CREATE TABLE IF NOT EXISTS master_unavailable_schedules(
    id SERIAL PRIMARY KEY,
    master_id BIGINT,
    date VARCHAR(10),
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    day_of_week SMALLINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "master_unavailable_id_fk" FOREIGN KEY (master_id) REFERENCES masters(id)
);