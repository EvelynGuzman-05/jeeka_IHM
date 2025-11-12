
document.addEventListener('DOMContentLoaded', () => {
  const btnAgregar = document.getElementById('btnAgregar');
  const formContenedor = document.getElementById('formLanzamiento');
  const btnCancelar = document.getElementById('cancelarLanzamiento');
  const btnGuardar = document.getElementById('guardarLanzamiento');

  
  function mostrarForm() {
    formContenedor.classList.remove('hidden');
  }

 
  function ocultarForm() {
    formContenedor.classList.add('hidden');
  }

  
  btnAgregar.addEventListener('click', (e) => {
    e.preventDefault();
    mostrarForm();
  });

  
  btnCancelar.addEventListener('click', (e) => {
    e.preventDefault();
    ocultarForm();
  });

  // se utiliza una funcion asincrona(async) para esperar(await) una respuesta/acción 
  // (en este caso esperar la respuesta del servidor) antes de continuar con la ejecución
  btnGuardar.addEventListener('click', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombreLanzamiento').value.trim();
    const fecha = document.getElementById('fechaLanzamiento').value;
    const hora = document.getElementById('horaLanzamiento').value;
    const ubicacion = document.getElementById('ubicacionLanzamiento').value.trim();

    
    if (!nombre || !fecha || !hora || !ubicacion) {
      alert('Por favor complete todos los campos.');
      return;
    }

    try {
      // espera(await) hasta que la petición termine
      const response = await fetch('http://localhost:3000/api/lanzamientos/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, fecha, hora, ubicacion })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Lanzamiento guardado correctamente.');
        ocultarForm();

        document.getElementById('nombreLanzamiento').value = '';
        document.getElementById('fechaLanzamiento').value = '';
        document.getElementById('horaLanzamiento').value = '';
        document.getElementById('ubicacionLanzamiento').value = '';

        window.location.href = `monitoreo.html?id=${data.id}`;
      } else {
        alert('Error al guardar: ' + (data.error || 'Error desconocido.'));
      }
    } catch (err) {
      console.error('Error al conectar con el servidor:', err);
      alert('No se pudo conectar con el servidor.');
    }
  });

  formContenedor.addEventListener('click', (e) => {
    if (e.target === formContenedor) {
      ocultarForm();
    }
  });
});
