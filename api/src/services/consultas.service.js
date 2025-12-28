const prisma = require('../config/prismaClient');
const Logger = require('../utils/Logger'); // Logger se mantiene para los errores por ahora.

/**
 * Genera el reporte de inventario basado en filtros.
 * @param {object} filters - Objeto con los filtros para la consulta.
 */
exports.getInventarioPorEquipo = async (filters) => {
    const { cve_alm, f_ini, f_fin, marca, clasif, empleado, status } = filters;
    
    let query = `
        SELECT b.cod_inv, b.serie, c.clave, c.descri as almac, f.descri as emple, 
            g.descri as marca, e.descri as depar, d.descri as clasif, a.f_movto, 
            CASE WHEN b.status = 'A' THEN 'Activo' ELSE 'Inactivo' END AS status
        FROM ma_eqasis a, ma_eqsis b, ma_almac c, ma_clasif d, ma_depar e, ma_emple f, ma_marca g
        WHERE a.cve_alm = c.clave
            AND a.cve_eqsis = b.clave
            AND a.cve_emple = f.id
            AND a.cve_depar = e.clave
            AND b.cve_marca = g.clave
            AND b.cve_clasif = d.clave
    `;

    const params = [];
    
    if (status) {
        query += (status === '1') ? " AND b.status = 'A'" : " AND b.status <> 'A'";
    }
    if (cve_alm) {
        query += ' AND a.cve_alm = ?';
        params.push(cve_alm);
    }
    if (marca) {
        query += ' AND b.cve_marca = ?';
        params.push(marca);
    }
    if (clasif) {
        query += ' AND b.cve_clasif = ?';
        params.push(clasif);
    }
    if (empleado) {
        query += ' AND a.cve_emple = ?';
        params.push(empleado);
    }
    if (f_ini && f_fin) {
        query += ' AND a.f_movto BETWEEN ? AND ?';
        params.push(f_ini, f_fin);
    }

    query += ' ORDER BY a.f_movto DESC';

    const data = await prisma.$queryRawUnsafe(query, ...params);

    const processedData = data.map(row => ({
        clave: row.clave.trim(),
        almac: row.almac.trim(),
        cod_inv: row.cod_inv.trim(),
        serie: row.serie.trim(),
        marca: row.marca.trim(),
        clasif: row.clasif.trim(),
        depar: row.depar.trim(),
        emple: row.emple.trim(),
        status: row.status.trim(),
        f_movto: new Date(row.f_movto).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }),
    }));

    const columns = [
        { headerName: "Cve Alm", field: "clave", width: 80 },
        { headerName: "Almacen", field: "almac", width: 200 },
        { headerName: "Cod. Inv", field: "cod_inv", width: 150 },
        { headerName: "Serie", field: "serie", width: 120 },
        { headerName: "Marca", field: "marca", width: 120 },
        { headerName: "Clasificación", field: "clasif", width: 120 },
        { headerName: "Departamento", field: "depar", width: 120 },
        { headerName: "Empleado", field: "emple", width: 120 },
        { headerName: "Fecha Movto", field: "f_movto", width: 120 },
        { headerName: "Status", field: "status", width: 80 }
    ];

    return { columns, data: processedData };
};

/**
 * Genera el reporte de ingresos de equipo basado en filtros.
 * @param {object} filters - Objeto con los filtros para la consulta.
 */
exports.getIngresosPorEquipo = async (filters) => {
    const { serie, f_ini, f_fin, marca, clasif, cod_inv, status } = filters;
    
    let query = `
    SELECT a.serie, a.cod_inv, b.descri as marca, c.descri as clasif, a.modelo, a.f_regis, 
        CASE WHEN a.status = 'A' THEN 'Activo' ELSE 'Inactivo' END AS status,
        CASE WHEN (select count(d.clave) from ma_eqasis d where cve_eqsis = a.clave) > 0 
        then (select e.descri from ma_eqasis d, ma_emple e where d.cve_emple = e.id and cve_eqsis = a.clave order by d.f_movto DESC limit 1) 
        else 'SIN ASIGNAR' end as asignado
    FROM ma_eqsis a, ma_marca b, ma_clasif c
    WHERE a.cve_marca = b.clave and a.cve_clasif = c.clave
    `;

    const params = [];

    if (status) {
        query += (status === '1') ? " AND a.status = 'A'" : " AND a.status <> 'A'";
    }
    if (serie) {
        query += ' AND a.serie = ?';
        params.push(serie);
    }
    if (marca) {
        query += ' AND a.cve_marca = ?';
        params.push(marca);
    }
    if (clasif) {
        query += ' AND a.cve_clasif = ?';
        params.push(clasif);
    }
    if (cod_inv) {
        query += ' AND a.cod_inv = ?';
        params.push(cod_inv);
    }
    if (f_ini && f_fin) {
        query += ' AND a.f_regis BETWEEN ? AND ?';
        params.push(f_ini, f_fin);
    }

    query += ' ORDER BY a.f_regis DESC';

    const data = await prisma.$queryRawUnsafe(query, ...params);

    const processedData = data.map(row => ({
        modelo: row.modelo ? row.modelo.trim() : '',
        almac: row.almac ? row.almac.trim() : '',
        cod_inv: row.cod_inv ? row.cod_inv.trim() : '',
        serie: row.serie ? row.serie.trim() : '',
        marca: row.marca ? row.marca.trim() : '',
        clasif: row.clasif ? row.clasif.trim() : '',
        depar: row.depar ? row.depar.trim() : '',
        asignado: row.asignado ? row.asignado.trim() : '',
        status: row.status ? row.status.trim() : '',
        f_regis: new Date(row.f_regis).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }),
    }));

    const columns = [
        { headerName: "Num. Serie", field: "serie", width: 150 },
        { headerName: "Cod. Inv", field: "cod_inv", width: 150 },
        { headerName: "Marca", field: "marca", width: 120 },
        { headerName: "Tipo", field: "clasif", width: 120 },
        { headerName: "Modelo", field: "modelo", width: 120 },
        { headerName: "Fecha Registro", field: "f_regis", width: 120 },
        { headerName: "Status", field: "status", width: 80 },
        { headerName: "Asignado", field: "asignado", width: 150 }
    ];

    return { columns, data: processedData };
};

const determineBackupStatus = (backupDate, backupSize) => {
    if (!backupDate || backupSize === '-') {
        return "danger"; 
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(today.getDate() - 2);

    const backupDay = new Date(backupDate);
    backupDay.setHours(0, 0, 0, 0);

    let status = "danger"; 

    if (backupDay.getTime() >= yesterday.getTime()) {
        status = "success"; 
    } else if (backupDay.getTime() === dayBeforeYesterday.getTime()) {
        status = "warning"; 
    }

    if (status === 'success') {
        const sizeMatch = backupSize.match(/^(\d*\.?\d+)\s*([A-Za-z]+)?$/);
        if (sizeMatch) {
            const sizeValue = parseFloat(sizeMatch[1]);
            const sizeUnit = sizeMatch[2];
            if (sizeUnit === 'M' || (sizeUnit === 'G' && sizeValue < 20)) {
                return "warning"; 
            }
        }
    }
    
    return status;
};

exports.generarReporteBackups = async () => {
    const query = `
    SELECT t.clave, t.descri, COALESCE(t.date::text, '-') AS date,
        COALESCE(t.f_movto::text, '-') AS f_movto, COALESCE(t.time, '-') AS time, COALESCE(t.size, '-') AS size,
        COALESCE(t.path, '-') AS path, COALESCE(t.type, '-') AS type, COALESCE(t.status, '-') AS status, COALESCE(t.class, '-') AS class
    FROM (
        SELECT b.clave, b.descri, a.date, a.f_movto, a.time, a.size, a.path, a.type, a.status, a.class,
            ROW_NUMBER() OVER (PARTITION BY b.clave ORDER BY a.date DESC, a.type ASC, a.time DESC) AS rn
        FROM ma_host b
        LEFT JOIN ma_backups a ON a.cve_host = b.clave
            AND CAST(SUBSTRING(a.size FROM '^[0-9]+(\.[0-9]+)?') AS NUMERIC) > 0
        ORDER BY b.clave, a.date DESC
    ) t
    WHERE t.rn <= 1 OR t.date IS NULL
    ORDER BY t.clave, t.date DESC;
    `;

    const data = await prisma.$queryRawUnsafe(query);

    const processedData = data.map(row => {
        const backupStatus = determineBackupStatus(row.date, row.size);
        return {
            clave: row.clave ? row.clave.trim() : '-',
            descri: row.descri ? row.descri.trim() : '-',
            time: row.time ? row.time.trim() : '-',
            size: row.size ? row.size.trim() : '-',
            path: row.path ? row.path.trim() : '-',
            class: row.class ? row.class.trim() : '-',
            status: backupStatus,
            color: backupStatus,
            date: row.date && row.date !== '-' ? new Date(row.date).toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-',
            type: row.type && row.type.trim() === 'F' ? 'Completo' : (row.type && row.type.trim() === 'I' ? 'Incremental' : 'Sin Backup'),
        };
    });

    const columns = [
        { headerName: "Servidor", field: "clave", width: 120 },
        { headerName: "Nombre", field: "descri", width: 120 },
        { headerName: "Fecha", field: "date", width: 120 },
        { headerName: "Hora", field: "time", width: 120 },
        { headerName: "Ruta", field: "path", width: 200 },
        { headerName: "Tamaño", field: "size", width: 120 },
        { headerName: "Tipo", field: "type", width: 120 },
        { headerName: "Status", field: "status", width: 120, cellStyle: { color: 'white' } },
        { headerName: "Clasif", field: "class", width: 120 }
    ];

    return { columns, data: processedData };
};