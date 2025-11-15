import mysql.connector
from mysql.connector import Error
import requests

def get_connection():
    try:
        return mysql.connector.connect(
            host='localhost',
            port = '3308', 
            user='root',
            password='guzman',
            database='estacion_terrena'
        )
    except Error as e:
        print(f"Error al conectar a la base de datos: {e}")  # Para depuración
        return None  # Devuelve None en lugar del objeto de error


conexion = get_connection()
print(conexion)


# def crear_lanzamiento(nombre, ubicacion):
#     conexion = get_connection()
#     if not conexion:
#         print("No se pudo conectar a la base de datos.")
#         return None
    
#     try:
#         cursor = conexion.cursor()
#         cursor.execute(
#             'INSERT INTO lanzamiento (nombre, fecha, hora, ubicacion) VALUES (%s, NOW(), NOW(), %s)',
#             (nombre, ubicacion)
#         )
#         conexion.commit()
#         id_lanzamiento = cursor.lastrowid
#         print(f"Lanzamiento creado con ID: {id_lanzamiento}")
#         return id_lanzamiento
#     except Error as e:
#         print("Error al crear lanzamiento:", e)
#         return None
#     finally:
#         cursor.close()
#         conexion.close()



# def get_ultimo_lanzamiento():
#     conexion = get_connection()
#     if not conexion:
#         print("No se pudo conectar a la base de datos.")
#         return None

#     try:
#         cursor = conexion.cursor(dictionary=True)
#         cursor.execute("SELECT id FROM lanzamientos ORDER BY id DESC LIMIT 1;")
#         resultado = cursor.fetchone()
#         return resultado['id'] if resultado else None
#     except Error as e:
#         print("Error al obtener el último lanzamiento:", e)
#         return None
#     finally:
#         cursor.close()
#         conexion.close()

def agregar_fila(datos, id_lanzamiento):
    try:
        conexion = get_connection()
        cursor = conexion.cursor()
        cursor.execute('INSERT INTO datos_lanzamiento (id_lanzamiento, ax, ay, az, gx, gy, gz, t, p, a, hora, lt, lg, h, e) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s, %s, %s, %s)', 
                               (id_lanzamiento, datos['ax'], datos['ay'], datos['az'],
                                datos['gx'], datos['gy'], datos['gz'],
                                datos['t'], datos['p'], datos['a'],
                                datos['lt'], datos['lg'],
                                datos['h'], datos['e']))
        conexion.commit() 
        return True
    except Error as e:
        print("Error al insertar datos:", e)
        return False
    finally: 
        cursor.close()
        conexion.close() 


