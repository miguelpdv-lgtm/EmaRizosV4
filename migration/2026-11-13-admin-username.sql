-- Cambia el login del panel de correo a nombre de usuario.
-- El usuario existente pasa a ser la parte antes de la @ de su correo (en minúsculas).
ALTER TABLE admin_users CHANGE email username VARCHAR(190) NOT NULL;
UPDATE admin_users SET username = LOWER(REGEXP_REPLACE(SUBSTRING_INDEX(username, '@', 1), '[^A-Za-z0-9._-]', ''));
ALTER TABLE admin_users DROP INDEX uq_email, ADD UNIQUE KEY uq_username (username);
ALTER TABLE admin_users MODIFY username VARCHAR(40) NOT NULL;
