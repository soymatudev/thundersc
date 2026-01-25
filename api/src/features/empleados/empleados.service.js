const { prisma } = require('../../shared/config/prismaClient');
const { NotFoundError, BadRequestError } = require('../../shared/utils/CustomError');

exports.getAllEmpleados = async (filters = {}) => {
    const where = {};
    if (filters.depar) {
        where.ma_depar = {
            descri: { contains: filters.depar, mode: 'insensitive' }
        };
    }
    // where.status = true; // Assuming you may want to filter active ones by default
    return prisma.ma_emple.findMany({
        where,
        include: { ma_depar: true },
        orderBy: { descri: 'asc' }
    });
};

exports.getEmpleadosPaginados = async (page = 1, pageSize = 20, descri = '') => {
    const skip = (page - 1) * pageSize;
    const take = parseInt(pageSize, 10);
    const where = descri ? { descri: { contains: descri, mode: 'insensitive' } } : {};

    const [total, empleados] = await prisma.$transaction([
        prisma.ma_emple.count({ where }),
        prisma.ma_emple.findMany({
            where,
            skip,
            take,
            orderBy: { descri: 'asc' },
            include: { ma_depar: true }
        }),
    ]);

    const totalPages = Math.ceil(total / take);

    return {
        empleados,
        pagination: {
            total,
            totalPages,
            currentPage: parseInt(page, 10),
            pageSize: take,
        },
    };
};

exports.getEmpleadoByCve = async (cve) => {
    const empleadoId = parseInt(cve, 10);
    if (isNaN(empleadoId)) {
        throw new BadRequestError('El ID del empleado debe ser un número.');
    }
    const empleado = await prisma.ma_emple.findUnique({
        where: { id: empleadoId },
        include: { ma_depar: true }
    });
    if (!empleado) {
        throw new NotFoundError(`No se encontró empleado con el ID ${empleadoId}`);
    }
    return empleado;
};

exports.updateEmpleado = async (cve, updateData) => {
    const empleadoId = parseInt(cve, 10);
    if (isNaN(empleadoId)) {
        throw new BadRequestError('El ID del empleado debe ser un número.');
    }
    try {
        const updatedEmpleado = await prisma.ma_emple.update({
            where: { id: empleadoId },
            data: updateData,
        });
        return updatedEmpleado;
    } catch (error) {
        if (error.code === 'P2025') { // Prisma's 'Record to update not found'
            throw new NotFoundError(`No se encontró empleado con el ID ${empleadoId}`);
        }
        throw error;
    }
};

exports.setEmpleado = async (empleadoData) => {
    return prisma.ma_emple.create({
        data: empleadoData,
    });
};

exports.deleteEmpleado = async (cve) => {
    const empleadoId = parseInt(cve, 10);
    if (isNaN(empleadoId)) {
        throw new BadRequestError('El ID del empleado debe ser un número.');
    }
    try {
        const result = await prisma.ma_emple.update({
            where: { id: empleadoId },
            data: { status: false } // Borrado lógico
        });
        return result;
    } catch (error) {
        if (error.code === 'P2025') { // Prisma's 'Record to update not found'
            throw new NotFoundError(`No se encontró empleado con el ID ${empleadoId} para desactivar`);
        }
        throw error;
    }
};