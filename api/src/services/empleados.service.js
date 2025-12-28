const prisma = require('../config/prismaClient');

/**
 * Obtiene todos los empleados de la base de datos.
 * @returns {Promise<Array>} Una promesa que se resuelve en un array de empleados.
 */
exports.getAllEmpleados = async () => {
    return prisma.ma_emple.findMany();
};

/**
 * Obtiene un empleado por su ID.
 * La función original recibía 'cve' pero lo usaba como 'id'. Se mantiene la lógica.
 * @param {number|string} cve El ID del empleado.
 * @returns {Promise<Object|null>} Una promesa que se resuelve en el objeto del empleado o null si no se encuentra.
 */
exports.getEmpleadoByCve = async (cve) => {
    const empleadoId = parseInt(cve, 10);
    if (isNaN(empleadoId)) {
        throw new Error('El ID del empleado debe ser un número.');
    }
    return prisma.ma_emple.findUnique({
        where: { id: empleadoId },
    });
};

/**
 * Actualiza un empleado existente por su ID.
 * @param {number|string} cve El ID del empleado a actualizar.
 * @param {Object} updateData Un objeto con los campos a actualizar.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto del empleado actualizado.
 */
exports.updateEmpleado = async (cve, updateData) => {
    const empleadoId = parseInt(cve, 10);
    if (isNaN(empleadoId)) {
        throw new Error('El ID del empleado debe ser un número.');
    }
    return prisma.ma_emple.update({
        where: { id: empleadoId },
        data: updateData,
    });
};

/**
 * Crea un nuevo empleado.
 * @param {Object} empleadoData Un objeto con los datos del nuevo empleado.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto del empleado recién creado.
 */
exports.setEmpleado = async (empleadoData) => {
    return prisma.ma_emple.create({
        data: empleadoData,
    });
};