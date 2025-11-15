import serial 
puerto = serial.Serial('COM7', 9600, timeout=1) 
while True: 
    if puerto.in_waiting > 0: 
        linea = puerto.readline().decode('utf-8').strip() 
        print(f"Linea leída: {linea}")
        