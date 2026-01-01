const { prisma } = require('../../shared/config/prismaClient');

/**
 * Obtiene todos los departamentos de la base de datos.
 * @returns {Promise<Array>} Una promesa que se resuelve en un array de departamentos.
 */
exports.getAllDepartamentos = async () => {
    return prisma.ma_depar.findMany();
};

/**
 * Obtiene un departamento por su clave (ID).
 * @param {number|string} cve La clave (ID) del departamento.
 * @returns {Promise<Object|null>} Una promesa que se resuelve en el objeto del departamento o null si no se encuentra.
 */
exports.getDepartamentoByCve = async (cve) => {
    const departamentoId = parseInt(cve, 10);
    if (isNaN(departamentoId)) {
        throw new Error('La clave (ID) del departamento debe ser un número.');
    }
    return prisma.ma_depar.findUnique({
        where: { clave: departamentoId },
    });
};

/**
 * Actualiza un departamento existente por su clave (ID).
 * @param {number|string} cve La clave (ID) del departamento a actualizar.
 * @param {Object} updateData Un objeto con los campos a actualizar.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto del departamento actualizado.
 */
exports.updateDepartamento = async (cve, updateData) => {
    const departamentoId = parseInt(cve, 10);
    if (isNaN(departamentoId)) {
        throw new Error('La clave (ID) del departamento debe ser un número.');
    }
    return prisma.ma_depar.update({
        where: { clave: departamentoId },
        data: updateData,
    });
};

/**
 * Crea un nuevo departamento.
 * @param {Object} departamentoData Un objeto con los datos del nuevo departamento.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto del departamento recién creado.
 */
exports.setDepartamento = async (departamentoData) => {
    return prisma.ma_depar.create({
        data: departamentoData,
    });
};