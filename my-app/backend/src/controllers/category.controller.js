const Category = require('../models/Category');
const Product = require('../models/Product');

// 1. Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: [{
                model: Product,
                as: 'products',
                attributes: ['id']
            }]
        });
        res.json({
            success: true,
            message: 'Categorías obtenidas correctamente',
            data: categories
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorías',
            data: null
        });
    }
};

// 2. Obtener una categoría por ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [{
                model: Product,
                as: 'products'
            }]
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada',
                data: null
            });
        }

        res.json({
            success: true,
            message: 'Categoría obtenida correctamente',
            data: category
        });
    } catch (error) {
        console.error('Error al obtener categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener categoría',
            data: null
        });
    }
};

// 3. Crear una categoría
exports.createCategory = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la categoría es requerido',
                data: null
            });
        }

        const category = await Category.create({ nombre, descripcion });

        res.status(201).json({
            success: true,
            message: 'Categoría creada correctamente',
            data: category
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear categoría',
            data: null
        });
    }
};

// 4. Actualizar una categoría
exports.updateCategory = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada',
                data: null
            });
        }

        await category.update({ nombre, descripcion });

        res.json({
            success: true,
            message: 'Categoría actualizada correctamente',
            data: category
        });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar categoría',
            data: null
        });
    }
};

// 5. Eliminar una categoría
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada',
                data: null
            });
        }

        await category.destroy();

        res.json({
            success: true,
            message: 'Categoría eliminada correctamente',
            data: null
        });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar categoría',
            data: null
        });
    }
};

// 6. Obtener productos por categoría
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product.findAll({
            where: { categoryId },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'nombre']
            }]
        });

        res.json({
            success: true,
            message: 'Productos por categoría obtenidos correctamente',
            data: products
        });
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos por categoría',
            data: null
        });
    }
};
