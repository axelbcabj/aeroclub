// Configuración inicial
const express = require('express');
const cors = require('cors');
const app = express();

// Conexión a MySQL
const db = require('./db'); // Asegurate de tener este archivo configurado
db.query('SELECT 1')
  .then(() => console.log('✅ Conexión a MySQL exitosa'))
  .catch(err => console.error('❌ Error de conexión a MySQL:', err.message));
// Rutas externas
const aerodromosRoutes = require('./routes/aerodromos');

app.use(cors());
app.use(express.json());
// Rutas de aeródromos (desde MySQL)
app.use('/api/aerodromos', aerodromosRoutes);

app.use(express.static('public')); // si usás frontend desde /public

// Base de datos temporal en memoria para socios
let socios = []; // Se borra al reiniciar el servidor

// Ruta para agregar un nuevo socio
app.post('/api/socios', (req, res) => {
  const nuevoSocio = req.body;
  socios.push(nuevoSocio);
  console.log('Socio recibido:', nuevoSocio);
  res.status(201).json({ mensaje: 'Socio guardado correctamente' });
});

// Ruta para obtener la cantidad de socios
app.get('/api/socios/cantidad', (req, res) => {
  res.json({ cantidad: socios.length });
});

// Ruta para obtener socios activos
app.get('/api/socios', (req, res) => {
  const activos = socios.filter(s => s.estado !== 'inactivo');
  res.json(activos);
});

// Ruta para dar de baja un socio por DNI
app.put('/api/socios/:dni/baja', (req, res) => {
  const dni = req.params.dni;
  const socio = socios.find(s => s.dni === dni);
  if (socio) {
    socio.estado = 'inactivo';
    res.json({ mensaje: 'Socio dado de baja' });
  } else {
    res.status(404).json({ mensaje: 'Socio no encontrado' });
  }
});

// Inicio del servidor
app.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
});