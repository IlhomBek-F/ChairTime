CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO admins(username, password,phone, role_id)
VALUES('admin', crypt('admin', gen_salt('bf')), '888281211', 3);

INSERT INTO masters(username, password,phone, role_id)
VALUES('masters', crypt('master', gen_salt('bf')), '888281211', 2);