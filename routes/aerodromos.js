const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/test', (req, res) => {
  console.log('📡 /api/aerodromos/test ejecutado');
  res.json({ mensaje: 'Funciona' });
});

console.log('📦 aerodromos.js cargado');

db.query('SELECT 1')
  .then(() => console.log('✅ Conexión OK desde aerodromos.js'))
  .catch(err => console.error('❌ Error en conexión desde aerodromos.js:', err));

router.get('/', async (req, res) => {
  try {
    console.log('🔍 Ejecutando consulta a aeropuertos...');

    const [rows] = await db.query(`
      SELECT id, local, denominacion, provincia 
      FROM aeropuertos 
      ORDER BY denominacion ASC
    `);

    console.log(`✅ Aeropuertos obtenidos: ${rows.length}`);
    res.json(rows);
  } catch (err) {
  console.error('❌ Error completo al obtener aeropuertos:', err);
  res.status(500).json({ error: 'Error al obtener aeropuertos' });
}
});

module.exports = router;