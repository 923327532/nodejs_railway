const fs = require('fs');
let c = fs.readFileSync('my-app/backend/src/server.js', 'utf8');

// Find the try block and replace it
const oldCode = `    try {
        // Autenticar la conexi\u00f3n a la base de datos
        await sequelize.authenticate();
        console.log('\u2705 Conexi\u00f3n a la base de datos establecida correctamente.');

        // Sincronizar los modelos con la base de datos (crea las tablas si no existen)
        await sequelize.sync({ force: false });
        console.log('\u2705 Modelos sincronizados con la base de datos.');

        // Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log(\`\u{1F680} Servidor corriendo en el puerto \${PORT}\`);
        });
    } catch (error) {
        console.error('\\n\u274c No se pudo conectar a la base de datos o iniciar el servidor:');
        console.error(\`   Mensaje: \${error.message}\`);

        if (error.code === 'ECONNREFUSED') {
            console.error('\\n\ud83d\udd0d Diagn\u00f3stico:');
            console.error('   La conexi\u00f3n fue rechazada. Posibles causas:');
            console.error('   1. El host o puerto son incorrectos.');
            console.error('   2. Railway cambi\u00f3 el endpoint de la BD.');
            console.error('   3. El servicio MySQL no est\u00e1 corriendo en Railway.');
            console.error('   ➡ Soluci\u00f3n: Verifica DB_HOST y DB_PORT en Railway (Dashboard > MySQL > Connect).');
        } else if (error.code === 'ENOTFOUND') {
            console.error('\\n\ud83d\udd0d Diagn\u00f3stico:');
            console.error('   No se pudo resolver el hostname.');
            console.error('   ➡ Soluci\u00f3n: Verifica DB_HOST, puede haber cambiado en Railway.');
        } else if (error.message && error.message.includes('Access denied')) {
            console.error('\\n\ud83d\udd0d Diagn\u00f3stico:');
            console.error('   Credenciales incorrectas (Access denied).');
            console.error('   ➡ Soluci\u00f3n: Verifica DB_USER y DB_PASSWORD en Railway.');
        } else if (error.message && error.message.includes('Connection lost')) {
            console.error('\\n\ud83d\udd0d Diagn\u00f3stico:');
            console.error('   El servidor MySQL cerr\u00f3 la conexi\u00f3n durante la autenticaci\u00f3n.');
            console.error('   Posibles causas:');
            console.error('   1. Las credenciales no coinciden (usuario/contrase\u00f1a err\u00f3neos).');
            console.error('   2. SSL no est\u00e1 configurado correctamente para Railway.');
            console.error('   3. El servicio MySQL fue recreado en Railway y tiene nuevas credenciales.');
            console.error('   4. Est\u00e1s usando el host interno de Railway desde local (usa viaduct.proxy.rlwy.net).');
            console.error('\\n   ➡ Soluci\u00f3n recomendada:');
            console.error('      a) Ve a Railway Dashboard > tu proyecto > MySQL.');
            console.error('      b) Copia los valores exactos de la pesta\u00f1a "Connect".');
            console.error('      c) Actualiza tu archivo .env con esos valores.');
            console.error('      d) Si ya los copiaste y sigue fallando, RECREA el servicio MySQL');
            console.error('         (eso genera nuevas credenciales) y actualiza .env.');
        }
    }`;

const newCode = `    try {
        // Autenticar la conexi\u00f3n a la base de datos
        await sequelize.authenticate();
        console.log('\u2705 Conexi\u00f3n a la base de datos establecida correctamente.');

        // Sincronizar los modelos con la base de datos (crea las tablas si no existen)
        await sequelize.sync({ force: false });
        console.log('\u2705 Modelos sincronizados con la base de datos.');
    } catch (error) {
        console.error('\\n\u26a0\ufe0f No se pudo conectar a la base de datos:');
        console.error(\`   Mensaje: \${error.message}\`);
        console.error('   El servidor igual va a iniciar para poder diagnosticar.');
    }

    // El servidor SIEMPRE arranca, incluso si la DB falla
    app.listen(PORT, () => {
        console.log(\`\u{1F680} Servidor corriendo en el puerto \${PORT}\`);
    });`;

if (c.includes(oldCode)) {
    c = c.replace(oldCode, newCode);
    fs.writeFileSync('my-app/backend/src/server.js', c);
    console.log('OK - Reemplazado');
} else {
    console.log('No se encontro el texto exacto');
    // Try to find a partial match
    if (c.includes('await sequelize.authenticate()')) {
        console.log('(pero se encontro authenticate)');
    }
}
