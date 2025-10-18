
window.onload = function () {
  // Inicializar login
  const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
  const contenidoPrivado = document.getElementById('contenidoPrivado');

  const usuariosValidos = {
    "secretaria": "secre2025",
    "juan": "1234",
    "maria": "abcd"
  };

  if (!localStorage.getItem('usuarioLogueado')) {
    loginModal.show();
  } else {
    contenidoPrivado.style.display = 'block';
  }

  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value.trim();
    const contraseña = document.getElementById('contraseña').value.trim();
    const errorDiv = document.getElementById('loginError');

    if (usuariosValidos[usuario] === contraseña) {
      localStorage.setItem('usuarioLogueado', usuario);
      loginModal.hide();
      contenidoPrivado.style.display = 'block';
      setTimeout(() => {
        if (calendar) calendar.render();
      }, 100);
    } else {
      errorDiv.classList.remove('d-none');
    }
  });

  // Inicializar calendario
  const calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'es',
    height: 'auto',
    eventClick: function(info) {
      const evento = info.event;
      const props = evento.extendedProps;

      document.getElementById('detalleTitulo').textContent = evento.title;
      document.getElementById('detalleFecha').textContent = evento.start.toLocaleString();
      document.getElementById('detallePiloto').textContent = props.piloto || '—';
      document.getElementById('detalleInstructor').textContent = props.instructor || '—';
      document.getElementById('detalleObservaciones').textContent = props.observaciones || '—';

      const modal = new bootstrap.Modal(document.getElementById('modalDetalle'));
      modal.show();
    }
  });

  if (localStorage.getItem('usuarioLogueado')) {
    setTimeout(() => calendar.render(), 100);
  }

  // Pilotos dinámicos
  let pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];

  function cargarOpcionesPilotos() {
    const instructorSelects = document.querySelectorAll('select.instructor');
    const pilotoSelects = document.querySelectorAll('select.piloto');

    instructorSelects.forEach(select => {
      select.innerHTML = '<option value="" disabled selected>Seleccionar instructor</option>';
      pilotos.filter(p => p.rol === "Instructor").forEach(p => {
        select.innerHTML += `<option value="${p.nombre}">${p.nombre}</option>`;
      });
    });

    pilotoSelects.forEach(select => {
      select.innerHTML = '<option value="" disabled selected>Seleccionar piloto</option>';
      pilotos.forEach(p => {
        select.innerHTML += `<option value="${p.nombre}">${p.nombre}</option>`;
      });
    });
  }

  document.getElementById('formANX').addEventListener('shown.bs.modal', cargarOpcionesPilotos);
  document.getElementById('formLXZ').addEventListener('shown.bs.modal', cargarOpcionesPilotos);

  // Reservas ANX
  document.getElementById('reservaANX').addEventListener('submit', function (e) {
    e.preventDefault();
    const tipoVuelo = this.querySelector('select').value;
    const instructor = this.querySelector('select.instructor').value;
    const piloto = this.querySelector('select.piloto').value;
    const fechaDesde = this.querySelector('input[type="date"]').value;
    const horaDesde = this.querySelector('input[type="time"]').value;
    const observaciones = this.querySelector('textarea').value;

    calendar.addEvent({
      title: `LV-ANX - ${tipoVuelo}`,
      start: `${fechaDesde}T${horaDesde}`,
      extendedProps: { piloto, instructor, observaciones }
    });

    bootstrap.Modal.getInstance(document.getElementById('formANX')).hide();
    this.reset();
  });

  // Reservas LXZ
  document.getElementById('reservaLXZ').addEventListener('submit', function (e) {
    e.preventDefault();
    const tipoVuelo = this.querySelector('select').value;
    const instructor = this.querySelector('select.instructor').value;
    const piloto = this.querySelector('select.piloto').value;
    const fechaDesde = this.querySelector('input[type="date"]').value;
    const horaDesde = this.querySelector('input[type="time"]').value;
    const observaciones = this.querySelector('textarea').value;

    calendar.addEvent({
      title: `LV-LXZ - ${tipoVuelo}`,
      start: `${fechaDesde}T${horaDesde}`,
      extendedProps: { piloto, instructor, observaciones }
    });

    bootstrap.Modal.getInstance(document.getElementById('formLXZ')).hide();
    this.reset();
  });
};