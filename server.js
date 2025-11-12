
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3308,
  password: 'guzman',
  database: 'estacion_terrena'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});


app.use(express.static(path.join(__dirname, 'public')));

// crear servidor HTTP y Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Cliente socket conectado:', socket.id);
  socket.on('disconnect', () => console.log('Cliente desconectado:', socket.id));
});


//los métodos HTTP(post, get) son formas de pedirle algo al servidor
// endpoint(/arduino)(ruta/URL del servidor asociada a una acción específica) 
// endpoint para recibir datos desde el lector(py) y reenviarlos 
app.post('/arduino', (req, res) => {
  const datos = req.body; 
  io.emit('updateData', datos); // reenviar 
  res.json({ status: 'ok' });
});


let lanzamientoActualID = null;

// endpoint para crear un nuevo lanzamiento
app.post('/api/lanzamientos/crear', (req, res) => {
  const { nombre, fecha, hora, ubicacion } = req.body;
  
  if (!nombre || !ubicacion) {
    return res.status(400).json({ error: 'Nombre y ubicación requeridos' });
  }
  //consulta sql
  const sql = 'INSERT INTO lanzamiento (nombre, fecha, hora, ubicacion) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, fecha, hora, ubicacion], (err, result) => {
    if (err) {
      console.error('Error al crear lanzamiento:', err);
      return res.status(500).json({ error: 'Error al crear lanzamiento' });
    }
    console.log('Lanzamiento creado con ID:', result.insertId);
    res.json({ id: result.insertId, message: 'Lanzamiento creado correctamente' });
  });
});

// endpoint para obtener el lanzamiento que está activo
app.get('/api/lanzamiento/activo', (req, res) => {
  res.json({ id: lanzamientoActualID });
});

// endpoint para activar grabación de datos de un lanzamiento
app.post('/api/lanzamiento/activar', (req, res) => {
  const { id } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'ID de lanzamiento requerido' });
  }
  
  lanzamientoActualID = id;
  console.log('Grabación de datos activada para lanzamiento:', id);
  io.emit('lanzamientoActivado', { id: id });
  
  res.json({ status: 'ok', message: 'Grabación de datos iniciada' });
});

// endpoint para desactivar grabación de datos
app.post('/api/lanzamiento/desactivar', (req, res) => {
  console.log('Grabación de datos desactivada');
  lanzamientoActualID = null;
  io.emit('lanzamientoDesactivado');
  
  res.json({ status: 'ok', message: 'Grabación de datos finalizada' });
});



// iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
