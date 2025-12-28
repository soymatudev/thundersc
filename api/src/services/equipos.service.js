const prisma = require('../config/prismaClient');

/**
 * Obtiene todos los equipos de la base de datos.
 * @returns {Promise<Array>} Una promesa que se resuelve en un array de equipos.
 */
exports.getAllEquipos = async () => {
    return prisma.ma_eqsis.findMany();
};

/**
 * Obtiene un equipo por su clave (ID).
 * @param {number|string} cve La clave (ID) del equipo.
 * @returns {Promise<Object|null>} Una promesa que se resuelve en el objeto del equipo o null si no se encuentra.
 */
exports.getEquipoByCve = async (cve) => {
    const equipoId = parseInt(cve, 10);
    if (isNaN(equipoId)) {
        throw new Error('La clave (ID) del equipo debe ser un número.');
    }
    return prisma.ma_eqsis.findUnique({
        where: { clave: equipoId },
    });
};

/**
 * Actualiza un equipo existente por su clave (ID).
 * @param {number|string} cve La clave (ID) del equipo a actualizar.
 * @param {Object} updateData Un objeto con los campos a actualizar.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto del equipo actualizado.
 */
exports.updateEquipo = async (cve, updateData) => {
    const equipoId = parseInt(cve, 10);
    if (isNaN(equipoId)) {
        throw new Error('La clave (ID) del equipo debe ser un número.');
    }
    return prisma.ma_eqsis.update({
        where: { clave: equipoId },
        data: updateData,
    });
};

/**
 * Crea un nuevo equipo.
 * @param {Object} equipoData Un objeto con los datos del nuevo equipo.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto del equipo recién creado.
 */
exports.setEquipo = async (equipoData) => {
    return prisma.ma_eqsis.create({
        data: equipoData,
    });
};