document.addEventListener('DOMContentLoaded', () => {
  const tipoVuelo = document.getElementById('tipoVuelo');
  const instructorGroup = document.getElementById('instructorGroup');
  const costoInstruccionGroup = document.getElementById('costoInstruccionGroup');
  const horaInicio = document.getElementById('horaInicio');
  const horaFin = document.getElementById('horaFin');
  const tiempoVuelo = document.getElementById('tiempoVuelo');
  const tacometroInicio = document.getElementById('tacometroInicio');
  const tacometroFin = document.getElementById('tacometroFin');
  const horasTacometro = document.getElementById('horasTacometro');
  const cobranza = document.getElementById('cobranza');
  const costoVuelo = document.getElementById('costoVuelo');
  const costoInstruccion = document.getElementById('costoInstruccion');
  const desde = document.getElementById('desde');
  const hasta = document.getElementById('hasta');

  // Crear datalist para autocompletado
  const listaAerodromos = document.createElement('datalist');
  listaAerodromos.id = 'listaAerodromos';
  document.body.appendChild(listaAerodromos);
  desde.setAttribute('list', 'listaAerodromos');
  hasta.setAttribute('list', 'listaAerodromos');

  // Poblar aeródromos en datalist
  fetch('/api/aerodromos')
    .then(res => res.json())
    .then(data => {
      data.forEach(a => {
        const label = a.oaci ? `${a.denominacion} (${a.oaci})` : a.denominacion;
        const option = document.createElement('option');
        option.value = label;
        listaAerodromos.appendChild(option);
      });
    })
    .catch(err => {
      console.error('Error al cargar aeródromos:', err);
    });

  // Mostrar instructor y costo instrucción si corresponde
  tipoVuelo.addEventListener('change', () => {
    const tipo = tipoVuelo.value;
    const mostrar = tipo === 'Instrucción' || tipo === 'Readaptación';
    instructorGroup.style.display = mostrar ? 'block' : 'none';
    costoInstruccionGroup.style.display = mostrar ? 'block' : 'none';
  });

  // Calcular tiempo de vuelo
  function calcularTiempoVuelo() {
    const inicio = horaInicio.value;
    const fin = horaFin.value;
    if (inicio && fin) {
      const t1 = new Date(`1970-01-01T${inicio}:00`);
      const t2 = new Date(`1970-01-01T${fin}:00`);
      const diff = (t2 - t1) / 3600000;
      tiempoVuelo.value = diff > 0 ? diff.toFixed(2) : 0;
    }
  }

  horaInicio.addEventListener('change', calcularTiempoVuelo);
  horaFin.addEventListener('change', calcularTiempoVuelo);

  // Calcular horas por tacómetro
  tacometroFin.addEventListener('input', () => {
    const inicio = parseFloat(tacometroInicio.value);
    const fin = parseFloat(tacometroFin.value);
    if (!isNaN(inicio) && !isNaN(fin)) {
      const resultado = fin - inicio;
      horasTacometro.value = resultado > 0 ? resultado.toFixed(2) : 0;
    }
  });

  // Calcular costo de vuelo
  cobranza.addEventListener('change', () => {
    const metodo = cobranza.value;
    const hora = parseFloat(tiempoVuelo.value);
    const tac = parseFloat(horasTacometro.value);
    const costoHora = 8000;
    const costoTac = 7500;
    const tipo = tipoVuelo.value;
    const costoInstruc = parseFloat(costoInstruccion.value) || 0;

    let base = 0;
    if (metodo === 'Hora') {
      base = !isNaN(hora) ? hora * costoHora : 0;
    } else if (metodo === 'Tacometro') {
      base = !isNaN(tac) ? tac * costoTac : 0;
    }

    costoVuelo.value = (tipo === 'Instrucción' || tipo === 'Readaptación')
      ? (base + costoInstruc).toFixed(2)
      : base.toFixed(2);
  });

  // Enviar datos al backend
  document.getElementById('formActividadVuelo').addEventListener('submit', async (e) => {
    e.preventDefault();

    const actividad = {
      pilotoId: document.getElementById('piloto').value,
      tipoVuelo: tipoVuelo.value,
      instructorId: document.getElementById('instructor').value || null,
      fecha: document.getElementById('fecha').value,
      horaInicio: horaInicio.value,
      horaFin: horaFin.value,
      tiempoVuelo: parseFloat(tiempoVuelo.value),
      tacometroInicio: parseFloat(tacometroInicio.value),
      tacometroFin: parseFloat(tacometroFin.value),
      horasTacometro: parseFloat(horasTacometro.value),
      desde: desde.value,
      hasta: hasta.value,
      aterrizajes: parseInt(document.getElementById('aterrizajes').value),
      combustible: parseFloat(document.getElementById('combustible').value),
      aceite: parseFloat(document.getElementById('aceite').value),
      cobranza: cobranza.value,
      costoVuelo: parseFloat(costoVuelo.value),
      costoInstruccion: parseFloat(costoInstruccion.value) || 0
    };

    try {
      const res = await fetch('/api/actividades-vuelo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actividad)
      });

      const data = await res.json();
      alert('✅ Actividad registrada correctamente');
      e.target.reset();
      instructorGroup.style.display = 'none';
      costoInstruccionGroup.style.display = 'none';
    } catch (err) {
      alert('❌ Error al registrar actividad');
      console.error(err);
    }
  });
});