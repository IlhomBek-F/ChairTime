CREATE TABLE IF NOT EXISTS masters(
    ID SERIAL PRIMARY KEY,
    username VARCHAR(55) NOT NULL UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(20),
    start_working_time VARCHAR(5)  DEFAULT '8:00',
    end_working_time VARCHAR(5)  DEFAULT '18:00',
    role_id SMALLINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);