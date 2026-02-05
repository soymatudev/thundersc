const { prisma } = require('../../shared/config/prismaClient');
const { NotFoundError } = require('../../shared/utils/CustomError');
const dayjs = require('dayjs');

exports.getAllViajes = async () => {
    const viajes = await prisma.tr_viajes.findMany({
        where: { activo: true },
    });
    return viajes;
}

exports.getViajesAdmin = async () => {
    const viajes = await prisma.tr_viajes.findMany({
        include: {
            empleado: { select: { descri: true } },
            paradas: { select: { monto: true, propina: true } }
        },
        orderBy: { sync_at: 'desc' }
    });

    const reporte = viajes.map(v => ({
        ...v,
        total_gastado: v.paradas.reduce((acc, p) => acc + Number(p.monto) + Number(p.propina), 0)
    }));
    return reporte;
}

exports.getViajesPaginadas = async (page = 1, pageSize = 10, destino = '') => {
    const skip = (page - 1) * pageSize;
    const take = parseInt(pageSize, 10);

    const where = {
        activo: true,
    };

    if (destino) {
        where.destino = {
            contains: destino,
            mode: 'insensitive',
        };
    }

    const [total, viajes] = await prisma.$transaction([
        prisma.tr_viajes.count({ where }),
        prisma.tr_viajes.findMany({
            where,
            skip,
            take,
            orderBy: {
                fechaSalida: 'asc',
            },
        }),
    ]);

    const totalPages = Math.ceil(total / take);

    return {
        viajes,
        pagination: {
            total,
            totalPages,
            currentPage: parseInt(page, 10),
            pageSize: take,
        },
    };
}

exports.getViajeById = async (idOrUuid) => {
    const idNum = parseInt(idOrUuid, 10);
    const isNumber = !isNaN(idNum) && /^\d+$/.test(idOrUuid);

    return await prisma.tr_viajes.findFirst({
        where: isNumber 
            ? { clave: idNum } 
            : { uuid_movil: idOrUuid },
        include: {
            empleado: { select: { descri: true } },
            paradas: {
                include: { 
                    evidencias: true,
                    categoria: true
                }
            },
            notas: true
        }
    });
};

exports.downloadViaje = async (uuid) => {
    return await prisma.tr_viajes.findUnique({
        where: { uuid_movil: uuid },
        include: { paradas: { include: { evidencias: true } }, notas: true }
    });
}

exports.getViajeByEmpleado = async (empleadoId) => {
    const viajes = await prisma.tr_viajes.findMany({
        where: {
            cve_emple: parseInt(empleadoId, 10),
            activo: true,
        },
    });
    if (!viajes || viajes.length === 0) {
        throw new NotFoundError(`No se encontraron viajes para el empleado con ID ${empleadoId}`);
    }
    return viajes;
}

exports.updateViaje = async (id, updateData) => {
    const { paradas, notas, ...datosViaje } = updateData;
    const viajeId = parseInt(id, 10);

    try {
        return await prisma.$transaction(async (tx) => {
            // 1. Actualizamos los datos básicos del viaje
            const viajeActualizado = await tx.tr_viajes.update({
                where: { clave: viajeId },
                data: {
                    ...datosViaje,
                    // Si vienen paradas o notas, refrescamos las relaciones
                    // OPCIÓN RECOMENDADA: Limpiar y recrear para evitar duplicados o desorden
                    ...(paradas && {
                        paradas: {
                            deleteMany: {}, // Borramos paradas anteriores
                            create: paradas.map(p => ({
                                cve_catvj: p.cve_catvj,
                                lugar: p.lugar,
                                hora_registro: p.hora_registro,
                                monto: p.monto,
                                propina: p.propina || 0,
                                facturable: p.facturable,
                                descripcion: p.descripcion,
                                lat: p.lat,
                                lng: p.lng,
                                evidencias: {
                                    create: p.evidencias?.map(e => ({
                                        tipo_archivo: e.tipo_archivo,
                                        url_archivo: e.url_archivo,
                                        fuente: e.fuente
                                    })) || []
                                }
                            }))
                        }
                    }),
                    ...(notas && {
                        notas: {
                            deleteMany: {}, // Borramos notas anteriores
                            create: notas.map(n => ({
                                titulo: n.titulo,
                                contenido: n.contenido,
                                tipo_nota: n.tipo_nota
                            }))
                        }
                    })
                },
                include: {
                    paradas: { include: { evidencias: true } },
                    notas: true
                }
            });

            return viajeActualizado;
        });
    } catch (error) {
        console.error("Error en updateViaje:", error);
        throw new NotFoundError(`Error al actualizar: No se encontró viaje con clave ${id} o datos inválidos`);
    }
}

exports.setViaje = async (viajeData) => {
    const { uuid_movil, cve_emple, paradas, notas, fecha_inicio, ...datosViaje } = viajeData;

    const fechaDate = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS');
    return await prisma.$transaction(async (tx) => {
        // 1. Buscamos si ya existe para decidir si hacemos Update o Create
        const viajeExistente = await tx.tr_viajes.findUnique({
            where: { uuid_movil: uuid_movil }
        });

        if (viajeExistente) {
            // Lógica de Actualización (limpiamos paradas/notas antiguas para evitar basura)
            await tx.tr_evidencia.deleteMany({ where: { cve_viaje: viajeExistente.clave } });
            await tx.tr_paradas_gastos.deleteMany({ where: { cve_viaje: viajeExistente.clave } });
            await tx.tr_notas_viaje.deleteMany({ where: { cve_viaje: viajeExistente.clave } });

            return await tx.tr_viajes.update({
                where: { clave: viajeExistente.clave },
                data: {
                    ...datosViaje,
                    sync_at: new Date(),
                    paradas: { create: mapearParadas(paradas) },
                    notas: { create: mapearNotas(notas) }
                },
                include: { paradas: { include: { evidencias: true } }, notas: true }
            });
        } else {
            // Lógica de Creación nueva
            return await tx.tr_viajes.create({
                data: {
                    ...datosViaje,
                    uuid_movil,
                    fecha_inicio: fechaDate,
                    cve_emple: parseInt(cve_emple),
                    paradas: { create: mapearParadas(paradas) },
                    notas: { create: mapearNotas(notas) }
                },
                include: { paradas: { include: { evidencias: true } }, notas: true }
            });
        }
    });
};

exports.getAllCategorias = async () => {
    return await prisma.ma_catvj.findMany({
        orderBy: { nombre: 'asc' }
    });
};

exports.closeViaje = async (id) => {
    return await prisma.tr_viajes.update({
        where: { clave: parseInt(id, 10) },
        data: { status_viaje: 'Revisión' } // O 'Cerrado'
    });
};

const mapearParadas = (paradas) => {
    if (!paradas || !Array.isArray(paradas)) return [];
    
    return paradas.map(p => ({
        cve_catvj: p.cve_catvj,
        lugar: p.lugar,
        hora_registro: p.hora_registro,
        monto: p.monto,
        propina: p.propina || 0,
        facturable: p.facturable,
        descripcion: p.descripcion,
        lat: p.lat,
        lng: p.lng,
        evidencias: {
            create: p.evidencias?.filter(e => e.url_archivo).map(e => ({
                tipo_archivo: e.tipo_archivo || 'image/jpeg',
                url_archivo: e.url_archivo,
                fuente: e.fuente || 'App'
            })) || []
        }
    }));
};

const mapearNotas = (notas) => {
    if (!notas || !Array.isArray(notas)) return [];
    
    return notas.map(n => ({
        titulo: n.titulo,
        contenido: n.contenido,
        tipo_nota: n.tipo_nota
    }));
};