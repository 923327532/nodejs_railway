require('dotenv').config();
const { Product, Category, User } = require('./models');
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

// Manejo de errores globales para que no se caiga el proceso
process.on('uncaughtException', (err) => {
    console.error('Error no capturado:', err.message);
});

process.on('unhandledRejection', (err) => {
    console.error('Promesa rechazada:', err.message);
});

async function connectDB() {
    console.log('Intentando conectar a la base de datos...');
    console.log('   Host:', process.env.DB_HOST || process.env.MYSQLHOST || 'no definido');
    console.log('   Port:', process.env.DB_PORT || process.env.MYSQLPORT || 'no definido');
    console.log('   DB:', process.env.DB_NAME || process.env.MYSQLDATABASE || 'no definido');
    console.log('   User:', process.env.DB_USER || process.env.MYSQLUSER || 'no definido');
    console.log('   Pass:', (process.env.DB_PASSWORD || process.env.MYSQLPASSWORD) ? '********' : 'no definido');

    try {
        await sequelize.authenticate();
        console.log('Conexion a la base de datos establecida correctamente.');
        await sequelize.sync({ force: false });
        console.log('Modelos sincronizados con la base de datos.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error.message);
    }
}

// El servidor arranca INMEDIATAMENTE
app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto ' + PORT);
});

// La DB se conecta en segundo plano
connectDB();
