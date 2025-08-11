CREATE TABLE IF NOT EXISTS master_style_types (
    id SERIAL PRIMARY KEY,
    master_id INT NOT NULL,
    style_type_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (master_id) REFERENCES masters(id) ON DELETE RESTRICT,
    FOREIGN KEY (style_type_id) REFERENCES style_types(id) ON DELETE RESTRICT
);