ALTER TABLE bookings ADD CONSTRAINT "users_id_fk" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE bookings ADD CONSTRAINT "master_style_types_id_fk" FOREIGN KEY (master_style_type_id) REFERENCES master_style_types(id);

ALTER TABLE master_style_types ADD CONSTRAINT "masters_id_fk" FOREIGN KEY (master_id) REFERENCES masters(id) ON DELETE RESTRICT;

ALTER TABLE master_style_types ADD CONSTRAINT "style_types_id_fk" FOREIGN KEY (style_type_id) REFERENCES style_types(id) ON DELETE RESTRICT;