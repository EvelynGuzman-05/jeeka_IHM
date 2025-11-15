CREATE DATABASE estacion_terrena;
USE estacion_terrena;

CREATE TABLE lanzamiento (
  id_lanzamiento INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50),
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  ubicacion VARCHAR(100),
  PRIMARY KEY (id_lanzamiento)
);

CREATE TABLE datos_lanzamiento (
  id INT NOT NULL AUTO_INCREMENT,
  id_lanzamiento INT,
  ax DOUBLE,
  ay DOUBLE,
  az DOUBLE,
  gx DOUBLE,
  gy DOUBLE,
  gz DOUBLE,
  t DOUBLE,
  p DOUBLE,
  a DOUBLE,
  hora TIME,
  lt DOUBLE(14,10),
  lg DOUBLE(14,10),
  h DOUBLE,
  e INT,
  PRIMARY KEY (id),
  FOREIGN KEY (id_lanzamiento) REFERENCES lanzamiento(id_lanzamiento) ON DELETE CASCADE
);

SELECT 
  ax, ay, az,
  gx, gy, gz,
  t, p, a,
  hora,
  lt, lg,
  h, e
FROM datos_lanzamiento
WHERE id_lanzamiento = 26;