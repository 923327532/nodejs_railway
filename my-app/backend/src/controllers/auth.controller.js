const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

// 1. Registro de usuario
exports.register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, email y contraseña son requeridos',
                data: null
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres',
                data: null
            });
        }

        // Verificar si el email ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado',
                data: null
            });
        }

        // Crear usuario (por defecto rol CUSTOMER)
        const user = await User.create({ nombre, email, password });

        // Generar token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente',
            data: {
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            data: null
        });
    }
};

// 2. Inicio de sesión
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos',
                data: null
            });
        }

        // Buscar usuario por email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
                data: null
            });
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
                data: null
            });
        }

        // Generar token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            data: {
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            data: null
        });
    }
};

// 3. Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
                data: null
            });
        }

        res.json({
            success: true,
            message: 'Perfil obtenido correctamente',
            data: user
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
            data: null
        });
    }
};
