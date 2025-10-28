// Configuración inicial
const express = require('express');
const cors = require('cors');
const app = express();

// Conexión a MySQL
const db = require('./db'); // Asegurate de tener este archivo configurado correctamente

db.query('SELECT 1')
  .then(() => console.log('✅ Conexión a MySQL exitosa'))
  .catch(err => console.error('❌ Error de conexión a MySQL:', err.message));

// Rutas externas
const aerodromosRoutes = require('./routes/aerodromos');

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // si usás frontend desde /public

// Ruta para agregar un nuevo socio en MySQL
app.post('/api/socios', async (req, res) => {
  const nuevoSocio = req.body;

  const query = `
    INSERT INTO socios (
      nombre, apellido, nacionalidad, fechaNacimiento, dni, numeroSocio,
      provincia, localidad, domicilio, domicilioCobro, celular, email, fechaAlta
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    nuevoSocio.nombre,
    nuevoSocio.apellido,
    nuevoSocio.nacionalidad,
    nuevoSocio.fechaNacimiento,
    nuevoSocio.dni,
    nuevoSocio.numeroSocio,
    nuevoSocio.provincia,
    nuevoSocio.localidad,
    nuevoSocio.domicilio,
    nuevoSocio.domicilioCobro,
    nuevoSocio.celular,
    nuevoSocio.email,
    nuevoSocio.fechaAlta
  ];

  try {
    await db.query(query, valores);
    console.log('✅ Socio guardado en MySQL:', nuevoSocio);
    res.status(201).json({ mensaje: 'Socio guardado correctamente' });
  } catch (err) {
    console.error('❌ Error al guardar socio en MySQL:', err.message);
    res.status(500).json({ error: 'Error al guardar socio' });
  }
});

// Ruta para obtener la cantidad real de socios desde MySQL
app.get('/api/socios/cantidad', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS cantidad FROM socios');
    res.json({ cantidad: rows[0].cantidad });
  } catch (err) {
    console.error('❌ Error al contar socios:', err.message);
    res.status(500).json({ error: 'Error al contar socios' });
  }
});

// Ruta para obtener socios activos (opcional, si querés usarla más adelante)
app.get('/api/socios', (req, res) => {
  db.query('SELECT * FROM socios WHERE estado IS NULL OR estado != "inactivo"', (err, result) => {
    if (err) {
      console.error('❌ Error al obtener socios:', err.message);
      return res.status(500).json({ error: 'Error al obtener socios' });
    }
    res.json(result);
  });
});

// Ruta para dar de baja un socio por DNI
app.put('/api/socios/:dni/baja', (req, res) => {
  const dni = req.params.dni;
  db.query('UPDATE socios SET estado = "inactivo" WHERE dni = ?', [dni], (err, result) => {
    if (err) {
      console.error('❌ Error al dar de baja socio:', err.message);
      return res.status(500).json({ error: 'Error al dar de baja socio' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Socio no encontrado' });
    }
    res.json({ mensaje: 'Socio dado de baja' });
  });
});

// Rutas de aeródromos (desde MySQL)
app.use('/api/aerodromos', aerodromosRoutes);

// Inicio del servidor
app.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
});