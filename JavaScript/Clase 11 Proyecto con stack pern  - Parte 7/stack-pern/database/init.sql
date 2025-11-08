-- 1. Crear la tabla 'usuarios' PRIMERO, ya que 'tareas' depende de ella.
-- He incluido la columna 'gravatar' directamente, para evitar el ALTER TABLE.
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    gravatar VARCHAR(255)
);

-- 2. Crear la tabla 'tareas' DESPUÉS.
-- Incluimos 'usuario_id' directamente en la creación.
-- He quitado el UNIQUE de 'titulo', ya que tu script lo eliminaba después.
CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL, -- Eliminé el 'UNIQUE' según tu lógica posterior
    descripcion TEXT,
    
    -- Definimos la llave foránea aquí mismo
    usuario_id INTEGER,
    CONSTRAINT fk_usuario
        FOREIGN KEY(usuario_id) 
        REFERENCES usuarios(id)
        ON DELETE SET NULL -- (Opcional, pero recomendado: si se borra el usuario, pone el usuario_id de la tarea en NULL)
);