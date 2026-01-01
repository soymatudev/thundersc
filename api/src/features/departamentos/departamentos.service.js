const Logger = require('../../shared/utils/Logger');
const { prisma } = require('../../shared/config/prismaClient');

/**
 * Obtiene todos los departamentos de la base de datos.
 * @returns {Promise<Array>} Una promesa que se resuelve en un array de departamentos.
 */
exports.getAllDepartamentos = async () => {
    try {
        return await prisma.ma_depar.findMany();
    } catch (error) {
        Logger.error(`Error in getAllDepartamentos: ${error.message}`);
        throw error;
    }
};

/**
 * Obtiene un departamento por su clave (ID).
 * @param {number|string} cve La clave (ID) del departamento.
 * @returns {Promise<Object|null>} Una promesa que se resuelve en el objeto del departamento o null si no se encuentra.
 */
exports.getDepartamentoByCve = async (cve) => {
    try {
        const departamentoId = parseInt(cve, 10);
        if (isNaN(departamentoId)) {
            throw new Error('La clave (ID) del departamento debe ser un número.');
        }
        return await prisma.ma_depar.findUnique({
            where: { clave: departamentoId },
        });
    } catch (error) {
        Logger.error(`Error in getDepartamentoByCve: ${error.message}`);
        throw error;
    }
};

/**
 * Actualiza un departamento existente por su clave (ID).
 * @param {number|string} cve La clave (ID) del departamento a actualizar.
 * @param {Object} updateData Un objeto con los campos a actualizar.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto del departamento actualizado.
 */
exports.updateDepartamento = async (cve, updateData) => {
    try {
        const departamentoId = parseInt(cve, 10);
        if (isNaN(departamentoId)) {
            throw new Error('La clave (ID) del departamento debe ser un número.');
        }
        return await prisma.ma_depar.update({
            where: { clave: departamentoId },
            data: updateData,
        });
    } catch (error) {
        Logger.error(`Error in updateDepartamento: ${error.message}`);
        throw error;
    }
};

/**
 * Crea un nuevo departamento.
 * @param {Object} departamentoData Un objeto con los datos del nuevo departamento.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto del departamento recién creado.
 */
exports.setDepartamento = async (departamentoData) => {
    try {
        const newDepartamento = await prisma.ma_depar.create({
            data: departamentoData,
        });
        Logger.info(`setDepartamento service - success. Result: ${JSON.stringify(newDepartamento)}`);
        return newDepartamento;
    } catch (error) {
        Logger.error(`Error creating departamento in service: ${error.message}`);
        throw new Error(`Error al crear el departamento: ${error.message}`);
    }
};

/**
 * Obtiene departamentos paginados y filtrados.
 * @param {number} page Número de página.
 * @param {number} pageSize Tamaño de la página.
 * @param {string} descri Descripción para filtrar.
 * @returns {Promise<Object>} Objeto con departamentos y metadatos de paginación.
 */
exports.getDepartamentosPaginados = async (page = 1, pageSize = 20, descri = '') => {
    try {
        const skip = (page - 1) * pageSize;
        const take = parseInt(pageSize, 10);

        const where = descri ? {
            descri: {
                contains: descri,
                mode: 'insensitive',
            },
        } : {};

        const [total, departamentos] = await prisma.$transaction([
            prisma.ma_depar.count({ where }),
            prisma.ma_depar.findMany({
                where,
                skip,
                take,
                orderBy: {
                    clave: 'asc', // Ordenar por clave por defecto
                },
            }),
        ]);

        const totalPages = Math.ceil(total / take);

        return {
            departamentos,
            pagination: {
                total,
                totalPages,
                currentPage: parseInt(page, 10),
                pageSize: take,
            },
        };
    } catch (error) {
        Logger.error(`Error in getDepartamentosPaginados: ${error.message}`);
        throw error;
    }
};

/**
 * Elimina un departamento por su clave (ID).
 * @param {number|string} cve La clave (ID) del departamento a eliminar.
 * @returns {Promise<Object>} Una promesa que se resuelve en el objeto del departamento eliminado.
 */
exports.deleteDepartamento = async (cve) => {
    try {
        const departamentoId = parseInt(cve, 10);
        if (isNaN(departamentoId)) {
            throw new Error('La clave (ID) del departamento debe ser un número.');
        }
        const result = await prisma.ma_depar.delete({
            where: { clave: departamentoId },
        });
        Logger.info(`deleteDepartamento service - success. Clave: ${departamentoId}`);
        return result;
    } catch (error) {
        Logger.error(`Error in deleteDepartamento: ${error.message}`);
        if (error.code === 'P2025') {
            throw new Error('Departamento not found');
        }
        throw error;
    }
};