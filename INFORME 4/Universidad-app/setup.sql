-- Script simplificado para crear la BD
CREATE DATABASE IF NOT EXISTS universidad_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE universidad_app;

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registro VARCHAR(50) NOT NULL UNIQUE,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Profesores
CREATE TABLE IF NOT EXISTS profesores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  departamento VARCHAR(100)
) ENGINE=InnoDB;

-- Cursos
CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  creditos INT DEFAULT 0,
  profesor_id INT,
  FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Publicaciones
CREATE TABLE IF NOT EXISTS publicaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  curso_id INT NULL,
  profesor_id INT NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE SET NULL,
  FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Comentarios
CREATE TABLE IF NOT EXISTS comentarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  publicacion_id INT NOT NULL,
  usuario_id INT NOT NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Cursos aprobados
CREATE TABLE IF NOT EXISTS cursos_aprobados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  curso_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY usuario_curso_unique (usuario_id, curso_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Datos de ejemplo
INSERT IGNORE INTO profesores (nombres, apellidos, departamento) VALUES
  ('Carlos', 'González', 'Ingeniería de Software'),
  ('María', 'Pérez', 'Sistemas');

INSERT IGNORE INTO cursos (nombre, codigo, creditos, profesor_id) VALUES
  ('Programación I', 'IC-101', 4, 1),
  ('Bases de Datos', 'IC-202', 4, 2),
  ('Matemáticas Avanzadas', 'MAT-401', 4, 1),
  ('Programación en Java', 'CS-301', 4, 2),
  ('Bases de Datos', 'CS-205', 3, 2),
  ('Algoritmos', 'CS-202', 4, 1),
  ('Desarrollo Web', 'CS-401', 4, 2),
  ('Física Cuántica', 'PHYS-301', 3, 1);

-- Usuario de ejemplo (contraseña: admin123)
INSERT IGNORE INTO usuarios (registro, nombres, apellidos, email, password_hash)
VALUES ('20220001', 'Usuario', 'Ejemplo', 'usuario@ejemplo.com', '$2a$10$wJxYPQiFS3mQdWEM1gAVseeKkI80q9SxxsZ2tFj5Y71a37E7XmKc2');