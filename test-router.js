const express = require('express');
const app = express();

const router = express.Router();

router.get('/test', (req, res) => {
  console.log('📡 /api/test ejecutado');
  res.json({ mensaje: 'Funciona desde router directo' });
});

app.use('/api', router);

app.listen(3000, () => {
  console.log('🧪 Servidor de prueba corriendo en http://localhost:3000');
});