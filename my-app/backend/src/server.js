require('dotenv').config();
const { Product, Category, User } = require('./models');
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
    console.log('⏳ Intentando conectar a la base de datos...');
    console.log(`   Host: ${process.env.DB_HOST || '❌ no definido'}`);
    console.log(`   Port: ${process.env.DB_PORT || '❌ no definido'}`);
    console.log(`   DB:   ${process.env.DB_NAME || '❌ no definido'}`);
    console.log(`   User: ${process.env.DB_USER || '❌ no definido'}`);
    console.log(`   Pass: ${process.env.DB_PASSWORD ? '********' : '❌ no definido'}`);

    try {
        // Autenticar la conexión a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');

        // Sincronizar los modelos con la base de datos (crea las tablas si no existen)
        await sequelize.sync({ force: false });
        console.log('✅ Modelos sincronizados con la base de datos.');

        // Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('\n❌ No se pudo conectar a la base de datos o iniciar el servidor:');
        console.error(`   Mensaje: ${error.message}`);

        if (error.code === 'ECONNREFUSED') {
            console.error('\n🔍 Diagnóstico:');
            console.error('   La conexión fue rechazada. Posibles causas:');
            console.error('   1. El host o puerto son incorrectos.');
            console.error('   2. Railway cambió el endpoint de la BD.');
            console.error('   3. El servicio MySQL no está corriendo en Railway.');
            console.error('   ➡ Solución: Verifica DB_HOST y DB_PORT en Railway (Dashboard > MySQL > Connect).');
        } else if (error.code === 'ENOTFOUND') {
            console.error('\n🔍 Diagnóstico:');
            console.error('   No se pudo resolver el hostname.');
            console.error('   ➡ Solución: Verifica DB_HOST, puede haber cambiado en Railway.');
        } else if (error.message && error.message.includes('Access denied')) {
            console.error('\n🔍 Diagnóstico:');
            console.error('   Credenciales incorrectas (Access denied).');
            console.error('   ➡ Solución: Verifica DB_USER y DB_PASSWORD en Railway.');
        } else if (error.message && error.message.includes('Connection lost')) {
            console.error('\n🔍 Diagnóstico:');
            console.error('   El servidor MySQL cerró la conexión durante la autenticación.');
            console.error('   Posibles causas:');
            console.error('   1. Las credenciales no coinciden (usuario/contraseña erróneos).');
            console.error('   2. SSL no está configurado correctamente para Railway.');
            console.error('   3. El servicio MySQL fue recreado en Railway y tiene nuevas credenciales.');
            console.error('   4. Estás usando el host interno de Railway desde local (usa viaduct.proxy.rlwy.net).');
            console.error('\n   ➡ Solución recomendada:');
            console.error('      a) Ve a Railway Dashboard > tu proyecto > MySQL.');
            console.error('      b) Copia los valores exactos de la pestaña "Connect".');
            console.error('      c) Actualiza tu archivo .env con esos valores.');
            console.error('      d) Si ya los copiaste y sigue fallando, RECREA el servicio MySQL');
            console.error('         (eso genera nuevas credenciales) y actualiza .env.');
        }
    }
}

startServer();