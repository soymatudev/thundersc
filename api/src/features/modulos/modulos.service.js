const { prisma } = require('../../shared/config/prismaClient');
const { NotFoundError, BadRequestError } = require('../../shared/utils/CustomError');

exports.getModulosPaginados = async (page = 1, pageSize = 20, term = '') => {
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
};

exports.getAllModulos = async () => {
    return prisma.ma_modulo.findMany({
        orderBy: { clave: 'asc' },
        include: { permiso: true }
    });
};

exports.createModulo = async (data) => {
    const { moduloData, permisoModuloData } = data;
    const { clave, descri, ruta, menu } = moduloData;

    return prisma.$transaction(async (tx) => {
        const newModulo = await tx.ma_modulo.create({
            data: { clave, descri, ruta, menu }
        });

        if (permisoModuloData && permisoModuloData.length > 0) {
            const permissionsToCreate = permisoModuloData.map(p => ({
                descri: p.descri,
                cve_modulo: newModulo.clave
            }));
            await tx.permiso.createMany({ data: permissionsToCreate });
        }

        return newModulo;
    });
};

exports.updateModulo = async (id, data) => {
    const moduloId = parseInt(id, 10);
    if (isNaN(moduloId)) {
        throw new BadRequestError('El ID del módulo debe ser un número.');
    }

    const { moduloData, permisoModuloData } = data;
    const { descri, ruta, menu } = moduloData;

    return prisma.$transaction(async (tx) => {
        const moduleExists = await tx.ma_modulo.findUnique({ where: { clave: moduloId } });
        if (!moduleExists) {
            throw new NotFoundError(`No se encontró módulo con la clave ${moduloId}`);
        }

        const updatedModulo = await tx.ma_modulo.update({
            where: { clave: moduloId },
            data: { descri, ruta, menu }
        });

        if (permisoModuloData) {
            const existingPermissions = await tx.permiso.findMany({ where: { cve_modulo: moduloId } });
            const incomingIds = permisoModuloData.filter(p => p.clave).map(p => p.clave);
            const permissionsToDelete = existingPermissions.filter(p => !incomingIds.includes(p.clave));
            const permissionsToCreate = permisoModuloData.filter(p => !p.clave);
            const permissionsToUpdate = permisoModuloData.filter(p => p.clave);

            if (permissionsToDelete.length > 0) {
                await tx.permiso.deleteMany({ where: { clave: { in: permissionsToDelete.map(p => p.clave) } } });
            }
            if (permissionsToCreate.length > 0) {
                await tx.permiso.createMany({ data: permissionsToCreate.map(p => ({ descri: p.descri, cve_modulo: moduloId })) });
            }
            for (const p of permissionsToUpdate) {
                await tx.permiso.update({ where: { clave: p.clave }, data: { descri: p.descri } });
            }
        }
        return updatedModulo;
    });
};

exports.deleteModulo = async (id) => {
    const moduloId = parseInt(id, 10);
    if (isNaN(moduloId)) {
        throw new BadRequestError('El ID del módulo debe ser un número.');
    }

    return prisma.$transaction(async (tx) => {
        const moduleExists = await tx.ma_modulo.findUnique({ where: { clave: moduloId } });
        if (!moduleExists) {
            throw new NotFoundError(`No se encontró módulo con la clave ${moduloId}`);
        }
        
        const permisos = await tx.permiso.findMany({ where: { cve_modulo: moduloId } });
        
        if (permisos.length > 0) {
            await tx.usuario_permiso.deleteMany({
                where: { cve_permiso: { in: permisos.map(p => p.clave) } }
            });
            await tx.permiso.deleteMany({ where: { cve_modulo: moduloId } });
        }

        await tx.ma_modulo.delete({ where: { clave: moduloId } });

        return { success: true };
    });
};