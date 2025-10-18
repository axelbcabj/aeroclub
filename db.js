const mysql = require('mysql2/promise');

// Configuración de conexión
const pool = mysql.createPool({
  host: 'localhost',       // o la IP de tu servidor MySQL
  user: 'root',            // tu usuario MySQL
  password: 'Bocha950',            // tu contraseña MySQL
  database: 'aeroclub',    // el nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
