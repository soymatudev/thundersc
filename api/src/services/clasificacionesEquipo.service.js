const prisma = require('../config/prismaClient');

/**
 * Obtiene todas las clasificaciones de equipo de la base de datos.
 * @returns {Promise<Array>} Una promesa que se resuelve en un array de clasificaciones.
 */
exports.getAllClasificaciones = async () => {
    return prisma.ma_clasif.findMany();
};

/**
 * Obtiene una clasificación de equipo por su clave (ID).
 * @param {number|string} cve La clave (ID) de la clasificación.
 * @returns {Promise<Object|null>} Una promesa que se resuelve en el objeto de la clasificación o null si no se encuentra.
 */
exports.getClasificacionByCve = async (cve) => {
    const clasificacionId = parseInt(cve, 10);
    if (isNaN(clasificacionId)) {
        throw new Error('La clave (ID) de la clasificación debe ser un número.');
    }
    return prisma.ma_clasif.findUnique({
        where: { clave: clasificacionId },
    });
};

/**
 * Actualiza una clasificación de equipo existente por su clave (ID).
 * @param {number|string} cve La clave (ID) de la clasificación a actualizar.
 * @param {Object} updateData Un objeto con los campos a actualizar.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto de la clasificación actualizada.
 */
exports.updateClasificacion = async (cve, updateData) => {
    const clasificacionId = parseInt(cve, 10);
    if (isNaN(clasificacionId)) {
        throw new Error('La clave (ID) de la clasificación debe ser un número.');
    }
    return prisma.ma_clasif.update({
        where: { clave: clasificacionId },
        data: updateData,
    });
};

/**
 * Crea una nueva clasificación de equipo.
 * @param {Object} clasificacionData Un objeto con los datos de la nueva clasificación.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto de la clasificación recién creada.
 */
exports.setClasificacion = async (clasificacionData) => {
    return prisma.ma_clasif.create({
        data: clasificacionData,
    });
};