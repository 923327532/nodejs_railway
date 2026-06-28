const { Sequelize } = require('sequelize');
require('dotenv').config();

// Leer variables de entorno
// Soporta DB_* (local) y las variables automaticas de Railway (MYSQL_*)
const DB_HOST = process.env.DB_HOST || process.env.MYSQLHOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10);
const DB_NAME = process.env.DB_NAME || process.env.MYSQLDATABASE || 'railway';
const DB_USER = process.env.DB_USER || process.env.MYSQLUSER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '';

if (isNaN(DB_PORT)) {
  console.error('DB_PORT no es valido: ' + (process.env.DB_PORT || process.env.MYSQLPORT));
  process.exit(1);
}

// Railway proxy externo requiere SSL; conexion interna no
const isInternal = DB_HOST.includes('railway.internal');
const dialectOptions = isInternal ? {} : { ssl: { rejectUnauthorized: false } };

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST, port: DB_PORT, dialect: 'mysql',
  logging: false, dialectOptions,
  pool: { max: 5, min: 0, acquire: 60000, idle: 10000 },
  retry: { max: 3 }
});

module.exports = sequelize;
