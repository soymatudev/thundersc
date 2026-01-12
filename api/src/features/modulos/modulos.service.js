const Logger = require('../../shared/utils/Logger');
const { prisma } = require('../../shared/config/prismaClient');

/**
 * Obtiene módulos paginados y filtrados.
 */
exports.getModulosPaginados = async (page = 1, pageSize = 20, term = '') => {
    try {
        const skip = (page - 1) * pageSize;
        const take = parseInt(pageSize, 10);

        const where = term ? {
            OR: [
                { descri: { contains: term, mode: 'insensitive' } },
                { menu: { contains: term, mode: 'insensitive' } },
                { ruta: { contains: term, mode: 'insensitive' } }
            ]
        } : {};

        const [total, modulos] = await prisma.$transaction([
            prisma.ma_modulo.count({ where }),
            prisma.ma_modulo.findMany({
                where,
                skip,
                take,
                orderBy: { clave: 'asc' },
                include: { permiso: true }
            }),
        ]);

        const totalPages = Math.ceil(total / take);

        return {
            modulos,
            pagination: {
                total,
                totalPages,
                currentPage: parseInt(page, 10),
                pageSize: take,
            },
        };
    } catch (error) {
        Logger.error(`Error in getModulosPaginados: ${error.message}`);
        throw error;
    }
};

/**
 * Obtiene todos los módulos.
 */
exports.getAllModulos = async () => {
    try {
        return await prisma.ma_modulo.findMany({
            orderBy: { clave: 'asc' },
            include: {
                permiso: true
            }
        });
    } catch (error) {
        Logger.error(`Error in getAllModulos: ${error.message}`);
        throw error;
    }
};

/**
 * Crea un nuevo módulo y sus permisos especificados.
 */
exports.createModulo = async (data) => {
    try {
        const { moduloData, permisoModuloData } = data;
        const { clave, descri, ruta, menu } = moduloData;

        // Transaction: Create Module -> Create Permissions
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Module
            // Nota: Si moduloData.clave viene, Prisma intentará usarlo si la DB lo permite, 
            // pero usualmente es autoincrement. Aquí solo tomamos los campos de datos.
            const newModulo = await tx.ma_modulo.create({
                data: {
                    clave,
                    descri,
                    ruta,
                    menu
                }
            });

            // 2. Create Permissions from provided array
            if (permisoModuloData && permisoModuloData.length > 0) {
                const permissionsToCreate = permisoModuloData.map(p => ({
                    descri: p.descri,
                    cve_modulo: newModulo.clave
                }));

                await tx.permiso.createMany({
                    data: permissionsToCreate
                });
            }

            return newModulo;
        });
        
        Logger.info(`createModulo service - success. Clave: ${result.clave}`);
        return result;

    } catch (error) {
        Logger.error(`Error in createModulo: ${error.message}`);
        throw error;
    }
};

/**
 * Actualiza un módulo y sus permisos.
 */
exports.updateModulo = async (id, data) => {
    try {
        const moduloId = parseInt(id, 10);
        const { moduloData, permisoModuloData } = data;
        const { descri, ruta, menu } = moduloData;

        return await prisma.$transaction(async (tx) => {
            // 1. Update Module
            const updatedModulo = await tx.ma_modulo.update({
                where: { clave: moduloId },
                data: {
                    descri,
                    ruta,
                    menu
                }
            });

            // 2. Sync Permissions if provided
            if (permisoModuloData) {
                // Fetch existing permissions
                const existingPermissions = await tx.permiso.findMany({
                    where: { cve_modulo: moduloId }
                });

                // Identify IDs in the incoming list
                const incomingIds = permisoModuloData
                    .filter(p => p.clave)
                    .map(p => p.clave);

                // Determine deletions: IDs in DB but not in incoming list
                const permissionsToDelete = existingPermissions.filter(p => !incomingIds.includes(p.clave));

                // Determine creations: Items without 'clave'
                const permissionsToCreate = permisoModuloData.filter(p => !p.clave);

                // Determine updates: Items with 'clave'
                const permissionsToUpdate = permisoModuloData.filter(p => p.clave);

                // Execute Deletions
                if (permissionsToDelete.length > 0) {
                    await tx.permiso.deleteMany({
                        where: {
                            clave: { in: permissionsToDelete.map(p => p.clave) }
                        }
                    });
                }

                // Execute Creations
                if (permissionsToCreate.length > 0) {
                    await tx.permiso.createMany({
                        data: permissionsToCreate.map(p => ({
                            descri: p.descri,
                            cve_modulo: moduloId
                        }))
                    });
                }

                // Execute Updates (one by one)
                for (const p of permissionsToUpdate) {
                    await tx.permiso.update({
                        where: { clave: p.clave },
                        data: { descri: p.descri }
                    });
                }
            }

            return updatedModulo;
        });

    } catch (error) {
        Logger.error(`Error in updateModulo: ${error.message}`);
        throw error;
    }
};

/**
 * Elimina un módulo y sus permisos (requiere limpieza manual debido a FK restrictiva si no es cascade en DB)
 * El schema dice: onDelete: Restrict en permiso->ma_modulo.
 * Así que debemos borrar los permisos primero.
 */
exports.deleteModulo = async (id) => {
    try {
        const moduloId = parseInt(id, 10);

        await prisma.$transaction(async (tx) => {
            // 1. Delete associated permissions
            await tx.permiso.deleteMany({
                where: { cve_modulo: moduloId }
            });

            // 2. Delete module
            await tx.ma_modulo.delete({
                where: { clave: moduloId }
            });
        });

        Logger.info(`deleteModulo service - success. Clave: ${moduloId}`);
        return { success: true };
    } catch (error) {
        Logger.error(`Error in deleteModulo: ${error.message}`);
        throw error;
    }
};