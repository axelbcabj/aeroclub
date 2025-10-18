const express = require('express');
const router = express.Router();
const db = require('../db');

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
    console.error('❌ Error al obtener aeropuertos:', err.message);
    res.status(500).json({ error: 'Error al obtener aeropuertos' });
  }
});

module.exports = router;