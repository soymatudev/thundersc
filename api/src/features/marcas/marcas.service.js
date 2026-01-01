const { prisma } = require('../../shared/config/prismaClient');

/**
 * Obtiene todas las marcas de la base de datos.
 * @returns {Promise<Array>} Una promesa que se resuelve en un array de marcas.
 */
exports.getAllMarcas = async () => {
    return prisma.ma_marca.findMany();
};

/**
 * Obtiene una marca por su clave (ID).
 * @param {number|string} cve La clave (ID) de la marca.
 * @returns {Promise<Object|null>} Una promesa que se resuelve en el objeto de la marca o null si no se encuentra.
 */
exports.getMarcaByCve = async (cve) => {
    const marcaId = parseInt(cve, 10);
    if (isNaN(marcaId)) {
        throw new Error('La clave (ID) de la marca debe ser un número.');
    }
    return prisma.ma_marca.findUnique({
        where: { clave: marcaId },
    });
};

/**
 * Actualiza una marca existente por su clave (ID).
 * @param {number|string} cve La clave (ID) de la marca a actualizar.
 * @param {Object} updateData Un objeto con los campos a actualizar.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto de la marca actualizada.
 */
exports.updateMarca = async (cve, updateData) => {
    const marcaId = parseInt(cve, 10);
    if (isNaN(marcaId)) {
        throw new Error('La clave (ID) de la marca debe ser un número.');
    }
    return prisma.ma_marca.update({
        where: { clave: marcaId },
        data: updateData,
    });
};

/**
 * Crea una nueva marca.
 * @param {Object} marcaData Un objeto con los datos de la nueva marca.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto de la marca recién creada.
 */
exports.setMarca = async (marcaData) => {
    return prisma.ma_marca.create({
        data: marcaData,
    });
};