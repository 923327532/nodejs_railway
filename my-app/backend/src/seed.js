require('dotenv').config();
const sequelize = require('./config/database');
const { Product, Category, User } = require('./models');

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conectado a la base de datos');

        // Sincronizar modelos (crear tablas si no existen)
        await sequelize.sync({ force: false });
        console.log('✅ Tablas sincronizadas');

        // ─── CATEGORÍAS ───────────────────────────────────────────────
        const categoriesData = [
            { nombre: 'Laptops', descripcion: 'Computadoras portátiles' },
            { nombre: 'Periféricos', descripcion: 'Mouse, teclados y accesorios' },
            { nombre: 'Monitores', descripcion: 'Pantallas y monitores' },
            { nombre: 'Audífonos', descripcion: 'Audífonos y cascos' },
        ];

        const categories = [];
        for (const cat of categoriesData) {
            const [categoria] = await Category.findOrCreate({
                where: { nombre: cat.nombre },
                defaults: cat
            });
            categories.push(categoria);
            console.log(`   📁 Categoría: ${categoria.nombre}`);
        }

        // ─── PRODUCTOS ─────────────────────────────────────────────────
        const productsData = [
            {
                nombre: 'Laptop Lenovo IdeaPad 3',
                precio: 1599.90,
                descripcion: 'Laptop básica para estudio y oficina',
                imageUrl: 'https://via.placeholder.com/300x200?text=Lenovo+IdeaPad+3',
                categoryId: categories[0]?.id || null
            },
            {
                nombre: 'Mouse Logitech M280',
                precio: 59.90,
                descripcion: 'Mouse inalámbrico ergonómico',
                imageUrl: 'https://via.placeholder.com/300x200?text=Mouse+Logitech+M280',
                categoryId: categories[1]?.id || null
            },
            {
                nombre: 'Monitor Samsung 27"',
                precio: 799.00,
                descripcion: 'Monitor Full HD de 27 pulgadas',
                imageUrl: 'https://via.placeholder.com/300x200?text=Monitor+Samsung+27',
                categoryId: categories[2]?.id || null
            },
            {
                nombre: 'Teclado Redragon Kumara K552',
                precio: 189.50,
                descripcion: 'Teclado mecánico con iluminación LED',
                imageUrl: 'https://via.placeholder.com/300x200?text=Teclado+Redragon',
                categoryId: categories[1]?.id || null
            },
            {
                nombre: 'Audífonos Sony WH-CH510',
                precio: 249.00,
                descripcion: 'Audífonos inalámbricos con buena autonomía',
                imageUrl: 'https://via.placeholder.com/300x200?text=Sony+WH-CH510',
                categoryId: categories[3]?.id || null
            }
        ];

        for (const prod of productsData) {
            const [producto] = await Product.findOrCreate({
                where: { nombre: prod.nombre },
                defaults: prod
            });
            console.log(`   📦 Producto: ${producto.nombre} - $${producto.precio}`);
        }

        // ─── USUARIO ADMIN POR DEFECTO ────────────────────────────────
        const [admin] = await User.findOrCreate({
            where: { email: 'admin@tienda.com' },
            defaults: {
                nombre: 'Admin',
                email: 'admin@tienda.com',
                password: 'admin123',
                role: 'ADMIN'
            }
        });
        console.log(`   👤 Admin: ${admin.email} (contraseña: admin123)`);

        console.log('\n🎯 Seed completado exitosamente!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error en seed:', error.message);
        process.exit(1);
    }
}

seed();
