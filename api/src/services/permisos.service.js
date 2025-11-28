const Logger = require('../utils/Logger');
const { prisma } = require('../config/prismaClient');

exports.getAllPermisos = async () => {
    try {
        const permisos = await prisma.permisos.findMany();
        return permisos;
    } catch (error) {
        Logger.error(`Error fetching permisos: ${error.message}`);
        throw new Error('Failed to fetch permisos due to server error');
    }
}

exports.getPermisoByCve = async (cve) => {
    try {
        const permiso = await prisma.permisos.findFirst({
            where: { clave: cve }
        });
        return permiso;
    } catch (error) {
        Logger.error(`Error fetching permiso by cve: ${error.message}`);
        throw new Error('Failed to fetch permiso due to server error');
    }
}

exports.updatePermiso = async (cve, updateData) => {
    try {
        const permiso = await this.getPermisoByCve(cve);
        const result = await prisma.permisos.update({
            where: { id: permiso.id },
            data: updateData
        });
        return result;
    } catch (error) {
        Logger.error(`Error updating permiso: ${error.message}`);
        throw new Error('Failed to update permiso due to server error');
    }
}

exports.setPermiso = async (permisoData) => {
    try {
        const newPermiso = await prisma.permisos.create({
            data: permisoData
        });
        return newPermiso;
    } catch (error) {
        Logger.error(`Error creating permiso: ${error.message}`);
        throw new Error('Failed to create permiso due to server error');
    }
}