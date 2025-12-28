const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error.errors) {
            // Error de validación de Zod
            return res.status(400).json({
                message: 'La validación de los datos de entrada ha fallado.',
                errors: error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message,
                })),
            });
        }
        // Para otros tipos de errores, pásalos al manejador de errores global.
        next(error);
    }
};

module.exports = validate;
