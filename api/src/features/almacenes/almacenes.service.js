const Logger = require('../../shared/utils/Logger');
const QueryHandler = require('../../shared/utils/QueryHandler');
const { prisma } = require('../../shared/config/prismaClient');

exports.getAllAlmacenes = async () => {
    try {
        const almacenes = await prisma.ma_almac.findMany();
        return almacenes;
    } catch (error) {
        Logger.error(`Error fetching almacenes: ${error.message}`);
        throw new Error(`Error fetching almacenes: ${error.message}`);
    }
}

exports.getAlmacenesByCve = async (cve) => {
    try {
        const almacenes = await prisma.ma_almac.findFirst({
            where: { clave: cve }
        });
        return almacenes;
    } catch (error) {
        Logger.error(`Error fetching almacenes by cve: ${error.message}`);
        throw new Error(`Error fetching almacenes by cve: ${error.message}`);
    }
}

exports.updateAlmacen = async (cve, updateData) => {
    try {
        const almacen = await this.getAlmacenesByCve(cve);
        const result = await prisma.ma_almac.update({
            where: { clave: cve, id: almacen.id },
            data: updateData
        });
        return result;
    } catch (error) {
        Logger.error(`Error updating almacen: ${error.message}`);
        if (error.code === 'P2025') {
            throw new Error('Almacen not found');
        }
        throw new Error(`Error updating almacen: ${error.message}`);
    }
}

exports.setAlmacen = async (almacenData) => {
    try {
        const newAlmacen = await prisma.ma_almac.create({
            data: almacenData
        });
        return newAlmacen;
    } catch (error) {
        Logger.error(`Error creating almacen: ${error.message}`);
        throw new Error(`Error creating almacen: ${error.message}`);
    }
}

exports.deleteAlmacen = async (cve) => {
    try {
        const almacen = await this.getAlmacenesByCve(cve);
        const result = await prisma.ma_almac.update({
            where: { clave: cve, id: almacen.id },
            data: { status: false }
        });
        return result;
    } catch (error) {
        Logger.error(`Error deleting almacen: ${error.message}`);
        if (error.code === 'P2025') {
            throw new Error('Almacen not found');
        }
        throw new Error(`Error deleting almacen: ${error.message}`);
    }
}

exports.getAlmacenesPaginados = async (page = 1, pageSize = 20, descri = '') => {
    try {
        const skip = (page - 1) * pageSize;
        const take = parseInt(pageSize, 10);

        const where = descri ? {
            descri: {
                contains: descri,
                mode: 'insensitive',
            },
        } : {};

        const [total, almacenes] = await prisma.$transaction([
            prisma.ma_almac.count({ where }),
            prisma.ma_almac.findMany({
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
            almacenes,
            pagination: {
                total,
                totalPages,
                currentPage: page,
                pageSize: take,
            },
        };
    } catch (error) {
        Logger.error(`Error fetching paginated almacenes: ${error.message}`);
        throw new Error(`Error fetching paginated almacenes: ${error.message}`);
    }
};
