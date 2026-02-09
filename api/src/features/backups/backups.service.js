const { prisma } = require('../../shared/config/prismaClient');
const { NotFoundError } = require('../../shared/utils/CustomError');

exports.getBackupsStatus = async () => {
    // 1. Get all active hosts
    const hosts = await prisma.ma_host.findMany({
        orderBy: { clave: 'asc' }
    });

    if (!hosts || hosts.length === 0) {
        return [];
    }

    const statusList = await Promise.all(hosts.map(async (host) => {
        const lastBackup = await prisma.ma_backups.findFirst({
            where: { cve_host: host.clave },
            orderBy: [
                { date: 'desc' },
                { time: 'desc' }
            ]
        });

        return {
            cve_host: host.clave,
            host_descri: host.descri,
            last_date: lastBackup?.date || null,
            last_time: lastBackup?.time || null,
            size: lastBackup?.size || '0',
            type: lastBackup?.type || 'N/A',
            status: lastBackup?.status || 'N/A',
            path: lastBackup?.path || '',
            class: lastBackup?.class || ''
        };
    }));

    return statusList;
};
