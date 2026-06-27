const { Sequelize } = require('sequelize');
require('dotenv').config();

// ─── Validación de variables de entorno ───────────────────────────────────────
const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missing = requiredVars.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error('❌ Faltan variables de entorno requeridas:', missing.join(', '));
  console.error('   Revisa tu archivo .env o las variables en Railway.');
  process.exit(1);
}

// ─── Parsear puerto como número ───────────────────────────────────────────────
const DB_PORT = parseInt(process.env.DB_PORT, 10);
if (isNaN(DB_PORT)) {
  console.error(`❌ DB_PORT no es un número válido: "${process.env.DB_PORT}"`);
  process.exit(1);
}

// ─── Configuración SSL para Railway ───────────────────────────────────────────
// Railway MySQL proxy requiere SSL. Probamos varios enfoques:
let sslConfig;
try {
  // Intento 1: SSL con objeto (rejectUnauthorized: false)
  sslConfig = {
    ssl: { require: true, rejectUnauthorized: false }
  };
} catch (e) {
  // Intento 2: SSL como string (compatible con algunos proxies)
  sslConfig = {
    ssl: 'Amazon RDS'
  };
}

let dialectOptions = {
  ...sslConfig
};

// Railway MySQL proxy usa SSL nativo - configuraciones compatibles
dialectOptions = {
  ssl: {}
};

// ─── Crear instancia Sequelize ────────────────────────────────────────────────
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
    dialectOptions,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,      // aumentar timeout de adquisición
      idle: 10000
    },
    retry: {
      max: 3               // reintentar conexión hasta 3 veces
    }
  }
);

module.exports = sequelize;