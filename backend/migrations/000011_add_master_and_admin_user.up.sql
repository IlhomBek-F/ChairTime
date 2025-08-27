CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users(username, password,phone, role_id)
VALUES('admin', crypt('admin', gen_salt('bf')), '888281211', 3);

INSERT INTO users(username, password,phone, role_id)
VALUES('master', crypt('master', gen_salt('bf')), '888281211', 2);