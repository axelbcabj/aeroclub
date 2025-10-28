window.addEventListener('DOMContentLoaded', function () {
  const nacionalidadSelect = document.getElementById('nacionalidad');
  const provinciaSelect = document.getElementById('provincia');
  const localidadSelect = document.getElementById('localidad');
  const numeroSocioInput = document.getElementById('numeroSocio');
  const form = document.getElementById('formAgregarSocio');

  if (!nacionalidadSelect || !provinciaSelect || !localidadSelect || !numeroSocioInput || !form) {
    console.error('Uno o más elementos del formulario no se encontraron.');
    return;
  }

  // Cargar países
  const paises = ["Argentina", "Brasil", "Chile", "Uruguay", "Paraguay", "Bolivia", "Perú", "España", "Estados Unidos"];
  paises.forEach(pais => {
    const option = document.createElement('option');
    option.value = pais;
    option.textContent = pais;
    nacionalidadSelect.appendChild(option);
  });

  // Cargar provincias y localidades desde JSON externo
  let provincias = {};

  fetch('/data/provincias.json')
    .then(res => {
      if (!res.ok) throw new Error('No se pudo cargar el archivo JSON');
      return res.json();
    })
    .then(data => {
      provincias = data;
      Object.keys(provincias).forEach(prov => {
        const option = document.createElement('option');
        option.value = prov;
        option.textContent = prov;
        provinciaSelect.appendChild(option);
      });

      provinciaSelect.addEventListener('change', () => {
        const seleccionada = provinciaSelect.value;
        const localidades = provincias[seleccionada] || [];

        localidadSelect.innerHTML = '<option value="" disabled selected>Seleccionar localidad</option>';
        localidades.forEach(loc => {
          const option = document.createElement('option');
          option.value = loc;
          option.textContent = loc;
          localidadSelect.appendChild(option);
        });
      });
    })
    .catch(err => console.error('Error al cargar provincias:', err));

  // Número de socio automático desde backend
  function asignarNumeroSocio() {
    fetch('http://localhost:3000/api/socios/cantidad')
      .then(res => res.json())
      .then(data => {
        numeroSocioInput.value = data.cantidad + 1;
      })
      .catch(err => {
        console.error('Error al obtener cantidad de socios:', err);
        numeroSocioInput.value = 1;
      });
  }

  asignarNumeroSocio();

  // Guardar socio en MySQL
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nuevoSocio = {
      nombre: document.getElementById('nombre').value.trim(),
      apellido: document.getElementById('apellido').value.trim(),
      nacionalidad: nacionalidadSelect.value,
      fechaNacimiento: document.getElementById('fechaNacimiento').value,
      dni: document.getElementById('dni').value.trim(),
      numeroSocio: numeroSocioInput.value,
      provincia: provinciaSelect.value,
      localidad: localidadSelect.value,
      domicilio: document.getElementById('domicilio').value.trim(),
      domicilioCobro: document.getElementById('domicilioCobro').value.trim(),
      celular: document.getElementById('celular').value.trim(),
      email: document.getElementById('email').value.trim(),
      fechaAlta: document.getElementById('fechaAlta').value
    };

    fetch('http://localhost:3000/api/socios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoSocio)
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al guardar socio');
      return res.json();
    })
    .then(data => {
      alert(data.mensaje || 'Socio guardado correctamente');
      form.reset();
      asignarNumeroSocio();
    })
    .catch(err => {
      console.error('Error al enviar socio:', err);
      alert('Hubo un error al guardar el socio');
    });
  });
});