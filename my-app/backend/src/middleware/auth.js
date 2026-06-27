const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_jwt_temporal_2024';

// Middleware para verificar token JWT
exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Token de autenticación no proporcionado',
            data: null
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado',
            data: null
        });
    }
};

// Middleware para verificar rol de ADMIN
exports.authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requiere rol de administrador',
        data: null
    });
};

// Middleware para verificar roles específicos
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            return next();
        }
        return res.status(403).json({
            success: false,
            message: `Acceso denegado. Se requiere uno de los roles: ${roles.join(', ')}`,
            data: null
        });
    };
};

module.exports.JWT_SECRET = JWT_SECRET;
