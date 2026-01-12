const { prisma } = require('../../shared/config/prismaClient');
const Logger = require('../../shared/utils/Logger');

/**
 * Obtiene todos los empleados de la base de datos.
 * @returns {Promise<Array>} Una promesa que se resuelve en un array de empleados.
 */
exports.getAllEmpleados = async () => {
    return prisma.ma_emple.findMany();
};

exports.getEmpleadosPaginados = async (page = 1, pageSize = 20, descri = '') => {
    try {
        const skip = (page - 1) * pageSize;
        const take = parseInt(pageSize, 10);

        const where = descri ? {
            descri: {
                contains: descri,
                mode: 'insensitive',
            },
        } : {};

        const [total, empleados] = await prisma.$transaction([
            prisma.ma_emple.count({ where }),
            prisma.ma_emple.findMany({
                where,
                skip,
                take,
                orderBy: {
                    descri: 'asc',
                },
            }),
        ]);

        const totalPages = Math.ceil(total / take);

        return {
            empleados,
            pagination: {
                total,
                totalPages,
                currentPage: page,
                pageSize: take,
            },
        };
    } catch (error) {
        Logger.error(`Error fetching paginated empleados: ${error.message}`);
        throw new Error(`Error fetching paginated empleados: ${error.message}`);
    }
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

/**
 * Realiza un borrado lógico de un empleado por su ID.
 * @param {number|string} cve El ID del empleado a "eliminar".
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto del empleado actualizado.
 */
exports.deleteEmpleado = async (cve) => {
    try {
        const empleadoId = parseInt(cve, 10);
        if (isNaN(empleadoId)) {
            throw new Error('El ID del empleado debe ser un número.');
        }

        const empleado = await prisma.ma_emple.findUnique({
            where: { id: empleadoId },
        });

        if (!empleado) {
            throw new Error('Empleado not found');
        }

        const result = await prisma.ma_emple.update({
            where: { id: empleadoId },
            data: { status: false }
        });
        return result;
    } catch (error) {
        Logger.error(`Error deleting empleado: ${error.message}`);
        if (error.code === 'P2025') {
            throw new Error('Empleado not found');
        }
        throw new Error(`Error deleting empleado: ${error.message}`);
    }
}