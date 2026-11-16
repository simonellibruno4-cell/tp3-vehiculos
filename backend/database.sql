CREATE DATABASE IF NOT EXISTS tp3_vehiculos;
USE tp3_vehiculos;

-- tabla usuario para autenticación
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  contraseña VARCHAR(255) NOT NULL
);

-- tabla vehiculos
CREATE TABLE IF NOT EXISTS vehiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  patente VARCHAR(20) NOT NULL UNIQUE,
  año INT NOT NULL,
  capacidad_de_carga DECIMAL(10,2) NOT NULL
);

-- tabla conductores
CREATE TABLE IF NOT EXISTS conductores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  numero_de_documento VARCHAR(20) NOT NULL UNIQUE,
  numero_de_licencia VARCHAR(30) NOT NULL UNIQUE,
  fecha_de_alta_de_licencia DATE NOT NULL,
  fecha_de_vencimiento_de_licencia DATE NOT NULL
);

-- tabla viajes vehiculos + conductores
CREATE TABLE IF NOT EXISTS viajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehiculo_id INT NOT NULL,
  conductor_id INT NOT NULL,
  fecha_salida DATETIME NOT NULL,
  fecha_llegada DATETIME NOT NULL,
  origen VARCHAR(100) NOT NULL,
  destino VARCHAR(100) NOT NULL,
  kilometros DECIMAL(10,2) NOT NULL,
  observaciones TEXT,
  FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE,
  FOREIGN KEY (conductor_id) REFERENCES conductores(id) ON DELETE CASCADE
);