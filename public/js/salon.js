let calendar;
let socios = [];
let eventoSeleccionado = null;

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'es',
    height: 'auto',
    eventClick: function(info) {
      eventoSeleccionado = info.event;
      document.getElementById('eventoId').value = eventoSeleccionado.id || '';
      document.getElementById('editarTitulo').value = eventoSeleccionado.title;
      document.getElementById('editarFecha').value = eventoSeleccionado.startStr;

      const modal = new bootstrap.Modal(document.getElementById('modalEditarReserva'));
      modal.show();
    }
  });
  calendar.render();
});

function fechaYaReservada(fecha, tipo) {
  return calendar.getEvents().some(e =>
    e.startStr === fecha &&
    e.title.toLowerCase().includes(tipo)
  );
}

// Reserva Salón
document.getElementById('btnSocio').addEventListener('click', async () => {
  document.getElementById('formNoSocio').style.display = 'none';
  document.getElementById('formSocio').style.display = 'block';

  try {
    const res = await fetch('/api/socios');
    socios = await res.json();

    const select = document.getElementById('selectSocio');
    select.innerHTML = '<option value="">-- Elegir --</option>';
    socios.forEach(s => {
      const option = document.createElement('option');
      option.value = s.id;
      option.textContent = `${s.nombre} ${s.apellido}`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar socios:', error);
    alert('No se pudieron cargar los socios.');
  }
});

document.getElementById('btnNoSocio').addEventListener('click', () => {
  document.getElementById('formSocio').style.display = 'none';
  document.getElementById('formNoSocio').style.display = 'block';
});

document.getElementById('selectSocio').addEventListener('change', () => {
  const socio = socios.find(s => s.id == selectSocio.value);
  if (socio) {
    document.getElementById('dniSocio').textContent = socio.dni;
    document.getElementById('telSocio').textContent = socio.celular;
    document.getElementById('fechaAltaSocio').textContent = socio.fecha_alta;
    document.getElementById('datosSocio').style.display = 'block';
  } else {
    document.getElementById('datosSocio').style.display = 'none';
  }
});

document.getElementById('confirmarReserva').addEventListener('click', () => {
  const modal = bootstrap.Modal.getInstance(document.getElementById('reservaSalonModal'));

  if (document.getElementById('formSocio').style.display === 'block') {
    const socioId = document.getElementById('selectSocio').value;
    const fecha = document.getElementById('fechaReservaSocio').value;
    const formaPago = document.getElementById('formaPagoSocio').value;
    const costo = document.getElementById('costoReservaSocio').value;

    if (!socioId || !fecha || !formaPago || !costo) {
      alert('Completá todos los campos');
      return;
    }

    if (fechaYaReservada(fecha, 'salón')) {
      alert('Ya hay una reserva de salón en esa fecha.');
      return;
    }

    const socio = socios.find(s => s.id == socioId);
    calendar.addEvent({
      title: `Salón - ${socio.nombre} ${socio.apellido} - $${costo}`,
      start: fecha,
      allDay: true,
      color: '#0d6efd'
    });

    fetch('/api/cuenta-corriente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        socioId: socio.id,
        fecha: fecha,
        concepto: 'Reserva salón',
        formaPago: formaPago,
        monto: parseFloat(costo)
      })
    });

  } else if (document.getElementById('formNoSocio').style.display === 'block') {
    const nombre = document.getElementById('nombreNoSocio').value;
    const apellido = document.getElementById('apellidoNoSocio').value;
    const fecha = document.getElementById('fechaReservaNoSocio').value;
    const formaPago = document.getElementById('formaPagoNoSocio').value;
    const costo = document.getElementById('costoReservaNoSocio').value;

    if (!nombre || !apellido || !fecha || !formaPago || !costo) {
      alert('Completá todos los campos');
      return;
    }

    if (fechaYaReservada(fecha, 'salón')) {
      alert('Ya hay una reserva de salón en esa fecha.');
      return;
    }

    calendar.addEvent({
      title: `Salón - ${nombre} ${apellido} - $${costo}`,
      start: fecha,
      allDay: true,
      color: '#0d6efd'
    });
  }

  modal.hide();
});

// Reserva Parque
document.getElementById('btnPersona').addEventListener('click', () => {
  document.getElementById('formInstitucion').style.display = 'none';
  document.getElementById('formPersona').style.display = 'block';
});

document.getElementById('btnInstitucion').addEventListener('click', () => {
  document.getElementById('formPersona').style.display = 'none';
  document.getElementById('formInstitucion').style.display = 'block';
});

document.getElementById('confirmarReservaParque').addEventListener('click', () => {
  const modal = bootstrap.Modal.getInstance(document.getElementById('reservaParqueModal'));

  if (document.getElementById('formPersona').style.display === 'block') {
    const nombre = document.getElementById('nombrePersona').value;
    const apellido = document.getElementById('apellidoPersona').value;
    const celular = document.getElementById('celularPersona').value;
    const fecha = document.getElementById('fechaReservaPersona').value;

    if (!nombre || !apellido || !celular || !fecha) {
      alert('Completá todos los campos');
      return;
    }

    if (fechaYaReservada(fecha, 'parque')) {
      alert('Ya hay una reserva de parque en esa fecha.');
      return;
    }

    calendar.addEvent({
      title: `Parque - ${nombre} ${apellido}`,
      start: fecha,
      allDay: true,
      color: '#198754'
    });

  } else if (document.getElementById('formInstitucion').style.display === 'block') {
    const nombre = document.getElementById('nombreInstitucion').value;
    const fecha = document.getElementById('fechaReservaInstitucion').value;

    if (!nombre || !fecha) {
      alert('Completá todos los campos');
      return;
    }

    if (fechaYaReservada(fecha, 'parque')) {
      alert('Ya hay una reserva de parque en esa fecha.');
      return;
    }

    calendar.addEvent({
      title: `Parque - ${nombre}`,
      start: fecha,
      allDay: true,
      color: '#198754'
    });
  }

  modal.hide();
});

// Edición y eliminación
document.getElementById('btnGuardarCambios').addEventListener('click', () => {
  const nuevoTitulo = document.getElementById('editarTitulo').value;
  const nuevaFecha = document.getElementById('editarFecha').value;

  if (!nuevoTitulo || !nuevaFecha) {
    alert('Completá todos los campos');
    return;
  }

  const conflicto = calendar.getEvents().some(e =>
    e !== eventoSeleccionado &&
    e.startStr === nuevaFecha &&
    e.title.toLowerCase().includes(nuevoTitulo.toLowerCase().includes('salón') ? 'salón' : 'parque')
  );

  if (conflicto) {
    alert('Ya hay una reserva en esa fecha para ese espacio.');
    return;
  }

  eventoSeleccionado.setProp('title', nuevoTitulo);
  eventoSeleccionado.setStart(nuevaFecha);

  bootstrap.Modal.getInstance(document.getElementById('modalEditarReserva')).hide();
});

document.getElementById('btnEliminarReserva').addEventListener('click', () => {
  if (confirm('¿Estás seguro de eliminar esta reserva?')) {
    eventoSeleccionado.remove();
    bootstrap.Modal.getInstance(document.getElementById('modalEditarReserva')).hide();
  }
});