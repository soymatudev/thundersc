const { prisma } = require('../../shared/config/prismaClient');

/**
 * Obtiene todas las marcas de la base de datos.
 * @returns {Promise<Array>} Una promesa que se resuelve en un array de marcas.
 */
/**
 * Obtiene todas las marcas de la base de datos.
 * @returns {Promise<Array>} Una promesa que se resuelve en un array de marcas.
 */
exports.getAllMarcas = async () => {
    return prisma.ma_marca.findMany();
};

/**
 * Obtiene marcas de forma paginada con filtro opcional por descripción.
 * @param {number} pageNum El número de página actual.
 * @param {number} pageSizeNum El tamaño de la página.
 * @param {string} descri Opcional: descripción para filtrar las marcas.
 * @returns {Promise<Object>} Un objeto con las marcas paginadas, total, página actual y total de páginas.
 */
exports.getMarcasPaginadas = async (pageNum, pageSizeNum, descri) => {
    const skip = (pageNum - 1) * pageSizeNum;
    const whereClause = descri ? { descri: { contains: descri, mode: 'insensitive' } } : {};

    const [total, marcas] = await prisma.$transaction([
        prisma.ma_marca.count({ where: whereClause }),
        prisma.ma_marca.findMany({
            skip: skip,
            take: pageSizeNum,
            where: whereClause,
            orderBy: {
                clave: 'asc', // O el campo que desees para ordenar
            },
        }),
    ]);

    const totalPages = Math.ceil(total / pageSizeNum);

    return {
        marcas,
        total,
        currentPage: pageNum,
        totalPages,
    };
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

/**
 * Elimina una marca por su clave (ID).
 * @param {number|string} cve La clave (ID) de la marca a eliminar.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto de la marca eliminada.
 */
exports.deleteMarca = async (cve) => {
    const marcaId = parseInt(cve, 10);
    if (isNaN(marcaId)) {
        throw new Error('La clave (ID) de la marca debe ser un número.');
    }
    return prisma.ma_marca.delete({
        where: { clave: marcaId },
    });
};