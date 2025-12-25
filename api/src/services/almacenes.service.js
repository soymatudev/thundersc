const Logger = require('../utils/Logger');
const QueryHandler = require('../utils/QueryHandler');
const { prisma } = require('../config/prismaClient');

exports.getAllAlmacenes = async () => {
    try {
        const almacenes = prisma.ma_almac.findMany();
        return almacenes;
    } catch (error) {
        Logger.error(`Error fetching almacenes: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getAlmacenesByCve = async (cve) => {
    try {
        const almacenes = prisma.ma_almac.findFirst({
            where: { clave: cve }
        });
        return almacenes;
    } catch (error) {
        Logger.error(`Error fetching almacenes by cve: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateAlmacen = async (cve, updateData) => {
    try {
        const almacen = await this.getAlmacenesByCve(cve);
        const result = prisma.ma_almac.update({
            where: { clave: cve, id: almacen.id },
            data: updateData
        });
        return result;
    } catch (error) {
        Logger.error(`Error updating almacen: ${error.message}`);
        if (error.code === 'P2025') return res.status(404).json({ message: 'Almacen not found' });
        res.status(500).json({ message: 'Internal server error' });
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
        res.status(500).json({ message: 'Internal server error' });
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
        if (error.code === 'P2025') return res.status(404).json({ message: 'Almacen not found' });
        res.status(500).json({ message: 'Internal server error' });
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