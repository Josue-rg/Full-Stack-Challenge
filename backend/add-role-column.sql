-- SQL para agregar la columna 'role' a la tabla 'user'
-- Ejecutar esto en la base de datos para agregar el campo role a usuarios existentes

-- Para PostgreSQL (Neon):
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" varchar NOT NULL DEFAULT 'user';

-- Para SQLite:
-- ALTER TABLE user ADD COLUMN role varchar NOT NULL DEFAULT 'user';

-- Nota: Los usuarios existentes tendrán el rol 'user' por defecto
-- Para hacer admin a un usuario específico, ejecutar:
-- UPDATE "user" SET role = 'admin' WHERE username = 'nombre_de_usuario';