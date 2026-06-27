const Product = require('./Product');
const Category = require('./Category');
const User = require('./User');

// Configurar relaciones entre modelos
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

module.exports = {
    Product,
    Category,
    User
};
