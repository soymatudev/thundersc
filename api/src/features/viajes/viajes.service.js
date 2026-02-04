const { prisma } = require('../../shared/config/prismaClient');
const { NotFoundError } = require('../../shared/utils/CustomError');

exports.getAllViajes = async () => {
    const viajes = await prisma.tr_viajes.findMany({
        where: { activo: true },
    });
    return viajes;
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

exports.getViajeById = async (id) => {
    const viaje = await prisma.tr_viajes.findUnique({
        where: { id: parseInt(id, 10) },
    });
    if (!viaje || !viaje.activo) {
        throw new NotFoundError(`No se encontró viaje con el ID ${id}`);
    }
    return viaje;
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
    const { uuid_movil, cve_emple, paradas, notas, ...datosViaje } = viajeData;

    return await prisma.$transaction(async (tx) => {
        // 1. Buscamos si ya existe para decidir si hacemos Update o Create
        const viajeExistente = await tx.tr_viajes.findUnique({
            where: { uuid_movil: uuid_movil }
        });

        if (viajeExistente) {
            // Lógica de Actualización (limpiamos paradas/notas antiguas para evitar basura)
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

// Funciones auxiliares para no repetir código
const mapearParadas = (paradas) => paradas.map(p => ({
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
}));

const mapearNotas = (notas) => notas.map(n => ({
    titulo: n.titulo,
    contenido: n.contenido,
    tipo_nota: n.tipo_nota
}));