
const socket = io("http://localhost:3000");
let contador = 0;

// función para crear gráficas 
function crearGrafica(idCanvas, etiquetas, titulo) {
  const ctx = document.getElementById(idCanvas).getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: etiquetas.map(({ label, color }) => ({
        label,
        borderColor: color,
        backgroundColor: 'transparent',
        borderWidth: 2,
        data: []
      }))
    },
    options: {
      responsive: true,
      animation: false,
      plugins: {
        legend: { labels: { color: 'black' } },
        title: { display: true, text: titulo, color: 'black' }
      },
      scales: {
        x: { ticks: { color: '#ccc' } },
        y: { ticks: { color: '#ccc' }, beginAtZero: true }
      }
    }
  });
}



const graficaAceleracion = crearGrafica('graficaAce', [
  { label: 'Ax', color: '#00bcd4' },
  { label: 'Ay', color: '#2196f3' },
  { label: 'Az', color: '#3f51b5' }
], 'Aceleración');


const graficaGiroscopio = crearGrafica('graficaGiro', [
  { label: 'Gx', color: '#ff5722' },
  { label: 'Gy', color: '#e91e63' },
  { label: 'Gz', color: '#9c27b0' }
], 'Giroscopio');


const graficaTemp = crearGrafica('graficaTemp', [
  { label: 'Temperatura (°C)', color: '#fbc02d' }
], 'Temperatura');


const graficaAlt = crearGrafica('graficaAlt', [
  { label: 'Altitud (m)', color: '#4caf50' }
], 'Altitud');


const graficaLat = crearGrafica('graficaLt', [
  { label: 'Latitud', color: '#8bc34a' }
], 'Latitud');


const graficaLng = crearGrafica('graficaLg', [
  { label: 'Longitud', color: '#009688' }
], 'Longitud');


const graficaH = crearGrafica('graficaH', [
  { label: 'Humedad (%)', color: '#607d8b' }
], 'Humedad');



function actualizarGrafica(chart, valores, label) {
  const data = chart.data;
  const etiqueta = String(label);

  data.labels.push(etiqueta);
  if (data.labels.length > 30) data.labels.shift();

  data.datasets.forEach((ds, i) => {
    ds.data.push(valores[i] || 0);
    if (ds.data.length > 30) ds.data.shift();
  });

  chart.update();
}



socket.on('updateData', data => {
   console.log("Dato recibido: ", data);
  if (!data) return;
  contador += 1;
  actualizarGrafica(graficaAceleracion, [data.ax, data.ay, data.az], contador);
  actualizarGrafica(graficaGiroscopio, [data.gx, data.gy, data.gz], contador);
  actualizarGrafica(graficaTemp, [data.t], contador);
  actualizarGrafica(graficaAlt, [data.a], contador);
  actualizarGrafica(graficaLat, [data.lt], contador);
  actualizarGrafica(graficaLng, [data.lg], contador);
  actualizarGrafica(graficaH, [data.h], contador);

  // actuzalizar sensores
    document.getElementById("temperatura").textContent = `TEMPERATURA: ${data.t} °C`;
    document.getElementById("presion").textContent = `PRESIÓN: ${data.p} hPa`;
    document.getElementById("altitud").textContent = `ALTITUD: ${data.a} m`;

  if (data.e !== undefined) {

    document.getElementById("lora-ok").checked = false;
    document.getElementById("lora-error").checked = false;
    document.getElementById("bmp-ok").checked = false;
    document.getElementById("bmp-error").checked = false;
    document.getElementById("sistema-ok").checked = false;
    document.getElementById("altitud-activado").checked = false;
    document.getElementById("descenso-activado").checked = false;
    document.getElementById("aceleracion-activado").checked = false;

    if (data.e === 433) {
      document.getElementById("lora-ok").checked = true;
    }

    if (data.e === 434) {
      document.getElementById("lora-error").checked = true;
    }

    if (data.e === 280) {
      document.getElementById("bmp-ok").checked = true;
    }

    if (data.e === 281) {
      document.getElementById("bmp-error").checked = true;
    }

    if (data.e === 100) {
      document.getElementById("sistema-ok").checked = true;
    }

    if (data.e === 200) {
      document.getElementById("altitud-activado").checked = true;
    }

    if (data.e === 300) {
      document.getElementById("descenso-activado").checked = true;
    }

    if (data.e === 400) {
      document.getElementById("aceleracion-activado").checked = true;
    }
  }
});



socket.on('lanzamientoDesactivado', () => {
  console.log('Lanzamiento desactivado');
  document.getElementById('btnDesactivar').disabled = true;
});

const urlParams = new URLSearchParams(window.location.search);
const idLanzamiento = urlParams.get('id');

// activar grabación (add db )de datos al cargar la página
window.addEventListener('load', () => {
  if (idLanzamiento) {
    fetch('/api/lanzamiento/activar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: parseInt(idLanzamiento) })
    })
    .then(r => r.json())
    .then(d => console.log('Grabación activada:', d))
    .catch(e => console.error('Error activando grabación de datos:', e));
    
    document.getElementById('btnDesactivar').disabled = false;
  }
});

// finalizar gración de datos
document.getElementById('btnDesactivar').addEventListener('click', () => {
  if (!confirm('¿Finalizar grabación de datos?')) return;
  
  fetch('/api/lanzamiento/desactivar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(r => r.json())
  .then(d => {
    console.log('Grabación de datos finalizada:', d);
    alert('Grabación de datos finalizada. Datos guardados.');
  })
  .catch(e => console.error('Error finalizando:', e));
});