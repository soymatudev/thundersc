const jwt = require('jsonwebtoken');
const prisma = require('../config/prismaClient');
const Logger = require('../utils/Logger');

/**
 * Middleware para verificar el token JWT y autenticar al usuario.
 * Extrae el token de la cookie, lo verifica y adjunta el usuario al objeto `req`.
 */
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies['access_token'];

        if (!token) {
            return res.status(401).json({ message: 'No autorizado: No se proporcionó un token.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // El payload del token contiene 'userCve' según el auth.controller
        const userCve = decoded.userCve;
        if (!userCve) {
            return res.status(401).json({ message: 'No autorizado: El token es inválido (payload incorrecto).' });
        }

        const user = await prisma.usuario.findUnique({
            where: {
                clave: userCve
            },
            // Selecciona solo los campos que quieres exponer, excluyendo la contraseña.
            select: {
                clave: true,
                descri: true,
                username: true
                // Aquí puedes añadir otros campos del usuario que necesites.
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'No autorizado: El usuario del token ya no existe.' });
        }

        // Adjunta el objeto de usuario a la petición para que esté disponible en los siguientes middlewares o rutas.
        req.user = user;
        
        next();
    } catch (error) {
        Logger.error(`Error de autenticación: ${error.message}`);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'No autorizado: El token es inválido o ha expirado.' });
        }
        // Para otros errores, pásalos al manejador de errores global.
        next(error);
    }
};

module.exports = authMiddleware;
