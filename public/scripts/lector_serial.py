import serial
import time
import requests
from db import crear_lanzamiento, agregar_fila

class LectorSerial:
    #Función para inicializar el lector serial
    def __init__(self, puerto, baudios):
        try:
            self.puerto = serial.Serial(puerto, baudios, timeout=0)
        except serial.SerialException:
            self.puerto = None


    #Función para leer datos del puerto serial
    def leer_dato(self):
        if self.puerto is None:
            return {
                't': None, 'p': None, 'a': None,
                'ax': None, 'ay': None, 'az': None,
                'gx': None, 'gy': None, 'gz': None,
                'e': None, 'lt':None, 'lg':None, 'h':None,
            }
        
        if self.puerto.in_waiting == 0:
            return None

        try:
            linea = self.puerto.readline().decode('utf-8', errors='ignore').strip()
            if linea:
                print(f"Linea leída: {linea}")
        except Exception as e:
            print(e)
            return {
                't': None, 'p': None, 'a': None,
                'ax': None, 'ay': None, 'az': None,
                'gx': None, 'gy': None, 'gz': None,
                'e': None, 'lt':None, 'lg':None, 'h':None,
            }

        
        partes = linea.split(',')
        datos = {
            't': None, 'p': None, 'a': None,
            'ax': None, 'ay': None, 'az': None,
            'gx': None, 'gy': None, 'gz': None, 'e': None,
            'lt':None, 'lg':None, 'h':None,
        }

        for parte in partes:
            try:
                if parte.startswith("t"):
                    datos['t'] = float(parte[1:])
                elif parte.startswith("p"):
                    datos['p'] = float(parte[1:])
                elif parte.startswith("a") and not parte.startswith(("ax", "ay", "az")):
                    datos['a'] = float(parte[1:])
                elif parte.startswith("ax"):
                    datos['ax'] = float(parte[2:])
                elif parte.startswith("ay"):
                    datos['ay'] = float(parte[2:])
                elif parte.startswith("az"):
                    datos['az'] = float(parte[2:])
                elif parte.startswith("gx"):
                    datos['gx'] = float(parte[2:])
                elif parte.startswith("gy"):
                    datos['gy'] = float(parte[2:])
                elif parte.startswith("gz"):
                    datos['gz'] = float(parte[2:])
                elif parte.startswith("e"):
                    datos['e'] = int(parte[1:])
                elif parte.startswith("lt"):
                    datos['lt'] = float(parte[2:])
                elif parte.startswith("lng"):
                    datos['lg'] = float(parte[2:])
                elif parte.startswith("h"):
                    datos['h'] = float(parte[1:])    
            
            except ValueError:
                # Si hay un dato corrupto, lo ignoramos
                continue

        return datos
    

if __name__ == "__main__":
    lector = LectorSerial("COM6", 9600)
    id_lanzamiento_actual = None
    
    print("Leyendo datos del arduino...")
    print("Esperando que se active un lanzamiento...")    

    while True:
        try:
            resp = requests.get('http://localhost:3000/api/lanzamiento/activo', timeout=2)
            data_activo = resp.json()
            id_lanzamiento_actual = data_activo.get('id')
        except Exception as e:
            pass  
        # leer datos 
        datos = lector.leer_dato()
        if datos:
            # enviar al servidor 
            try:
                requests.post('http://localhost:3000/arduino', json=datos, timeout=5)
            except Exception as e:
                print('Error enviando datos al servidor:', e)
                
                if id_lanzamiento_actual:
                    agregar_fila(datos, id_lanzamiento_actual)
                time.sleep(0.3)
    
   


#Linea leída: ax0.01,ay0.04,az-0.99,gx-4.33,gy1.59,gz0.67,t31.05,p1010.63,a1.38
#Linea leída: ax0.01,ay0.03,az-1.00,gx-4.21,gy1.46,gz0.61,t31.06,p1010.67,a1.06
#Linea leída: ax0.01,ay0.03,az-1.00,gx-4.39,gy1.71,gz0.73,t31.07,p1010.68,a0.98
#Linea leída: ax0.01,ay0.04,az-1.01,gx-4.15,gy1.34,gz0.73,t31.05,p1010.64,a1.26
#Linea leída: ax0.01,ay0.03,az-1.00,gx-4.09,gy1.10,gz0.43,t31.05,p1010.66,a1.08
#Linea leída: ax0.01,ay0.03,az-1.00,gx-4.15,gy1.16,gz0.49,t31.04,p1010.66,a1.10
#Linea leída: ax0.01,ay0.04,az-1.00,gx-3.91,gy1.40,gz0.67,t31.04,p1010.62,a1.43
#Linea leída: ax0.00,ay0.03,az-1.00,gx-4.46,gy1.40,gz0.67,t31.05,p1010.62,a1.42