const { prisma } = require('../../shared/config/prismaClient');
const { NotFoundError, BadRequestError } = require('../../shared/utils/CustomError');

/**
 * Obtiene todas las clasificaciones de equipo de la base de datos.
 * @returns {Promise<Array>} Una promesa que se resuelve en un array de clasificaciones.
 */
exports.getAllClasificaciones = async () => {
    return prisma.ma_clasif.findMany(
        {
            orderBy: { descri: 'desc' },
        }
    );
};

/**
 * Obtiene las clasificaciones de forma paginada.
 * @param {number} pageNum 
 * @param {number} pageSizeNum 
 * @param {string} descri 
 * @returns {Promise<Object>}
 */
exports.getClasificacionesPaginadas = async (pageNum, pageSizeNum, descri) => {
    const skip = (pageNum - 1) * pageSizeNum;
    const whereClause = descri ? { descri: { contains: descri, mode: 'insensitive' } } : {};

    const [total, clasificaciones] = await prisma.$transaction([
        prisma.ma_clasif.count({ where: whereClause }),
        prisma.ma_clasif.findMany({
            skip: skip,
            take: pageSizeNum,
            where: whereClause,
            orderBy: { clave: 'asc' },
        }),
    ]);

    const totalPages = Math.ceil(total / pageSizeNum);

    return {
        clasificaciones,
        total,
        currentPage: pageNum,
        totalPages,
    };
};

/**
 * Obtiene una clasificación de equipo por su clave (ID).
 * @param {number|string} cve La clave (ID) de la clasificación.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto de la clasificación.
 */
exports.getClasificacionByCve = async (cve) => {
    const clasificacionId = parseInt(cve);

    if (isNaN(clasificacionId)) {
        throw new BadRequestError('La clave (ID) de la clasificación debe ser un número. ' + `Valor recibido: ${cve}`);
    }
    const clasificacion = await prisma.ma_clasif.findUnique({
        where: { clave: clasificacionId },
    });
    if (!clasificacion) {
        throw new NotFoundError(`No se encontró clasificación con la clave ${clasificacionId}`);
    }
    return clasificacion;
};

/**
 * Actualiza una clasificación de equipo existente por su clave (ID).
 * @param {number|string} cve La clave (ID) de la clasificación a actualizar.
 * @param {Object} updateData Un objeto con los campos a actualizar.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto de la clasificación actualizada.
 */
exports.updateClasificacion = async (cve, updateData) => {
    const clasificacionId = parseInt(cve);
    if (isNaN(clasificacionId)) {
        throw new BadRequestError('La clave (ID) de la clasificación debe ser un número.');
    }
    try {
        const updatedClasificacion = await prisma.ma_clasif.update({
            where: { clave: clasificacionId },
            data: updateData,
        });
        return updatedClasificacion;
    } catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError(`No se encontró clasificación con la clave ${clasificacionId}`);
        }
        throw error;
    }
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

/**
 * Elimina una clasificación de equipo.
 * @param {number|string} cve
 * @returns {Promise<Object>}
 */
exports.deleteClasificacion = async (cve) => {
    const clasificacionId = parseInt(cve);
    if (isNaN(clasificacionId)) {
        throw new BadRequestError('La clave (ID) de la clasificación debe ser un número.');
    }
    try {
        const deletedClasificacion = await prisma.ma_clasif.delete({
            where: { clave: clasificacionId },
        });
        return deletedClasificacion;
    } catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError(`No se encontró clasificación con la clave ${clasificacionId}`);
        }
        throw error;
    }
};