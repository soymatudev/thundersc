import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { Loader2, Search, FilterX, Download, Calendar, Monitor, Layers, Hash, Printer, AlertCircle } from 'lucide-react';
import { formatZPL, sendToZebra, shortenCode } from '../../../shared/utils/zebraPrint';


import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { MarcasService } from '../../marcas/services/marcasService';
import { DepartamentosService } from '../../departamentos/services/departamentosService';
import { ClasificacionesService } from '../../clasificaciones/services/clasificacionesService';
import { getReporteEquipos } from '../services/equipos.service';

ModuleRegistry.registerModules([AllCommunityModule]);

const ReporteGeneralEquipos = () => {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPrinting, setIsPrinting] = useState(false);

    // Catalog States
    const [marcas, setMarcas] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [modelos, setModelos] = useState([]); // Assuming models might come from a service or be distinct values later

    // Filter State
    const [filters, setFilters] = useState({
        search: '',
        cve_marca: '',
        modelo: '',
        cve_depar: '',
        fecha_inicio: '',
        fecha_fin: ''
    });

    // Load Catalogs
    useEffect(() => {
        const loadCatalogs = async () => {
            try {
                const [marcasData, deptData] = await Promise.all([
                    MarcasService.getAll(),
                    DepartamentosService.getAll()
                ]);
                setMarcas(marcasData);
                setDepartamentos(deptData);
            } catch (error) {
                console.error("Error loading catalogs", error);
            }
        };
        loadCatalogs();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            cve_marca: '',
            modelo: '',
            cve_depar: '',
            fecha_inicio: '',
            fecha_fin: ''
        });
        setRowData([]);
    };

    const fetchReport = async () => {
        setLoading(true);
        try {
            // Filter out empty values to send clean payload
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== '')
            );

            const response = await getReporteEquipos(activeFilters);
            setRowData(response || []);
        } catch (error) {
            console.error("Error fetching report", error);
        } finally {
            setLoading(false);
        }
    };

    const onExportExcel = useCallback(() => {
        if (rowData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(rowData.map(row => ({
            'ID': row.clave ?? row.id,
            'Alias': row.alias || row.cod_inv,
            'Serie': row.serie,
            'Marca': row.marca_descri || row.marca,
            'Modelo': row.modelo,
            'Zona/Depto': row.depar_descri || row.departamento,
            'Estatus': row.status === 'A' ? 'Activo' : 'Inactivo',
            'Fecha Registro': row.f_regis ? dayjs(row.f_regis).format('DD/MM/YYYY') : ''
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Equipos");
        XLSX.writeFile(workbook, `Reporte_Equipos_${dayjs().format('YYYYMMDD_HHmm')}.xlsx`);
    }, [rowData]);

    const onPrintAll = async () => {
        if (rowData.length === 0) return;
        setError(null);
        setIsPrinting(true);

        try {
            for (const row of rowData) {
                const fullCode = row.cod_inv || row.serie;
                if (fullCode) {
                    const labelCode = shortenCode(fullCode);
                    await sendToZebra(formatZPL(labelCode), (msg) => setError(msg));
                }
            }

        } catch (err) {
            console.error("Batch print stopped", err);
        } finally {
            setIsPrinting(false);
        }
    };


    // AG Grid Column Definitions
    const columnDefs = [
        { headerName: 'ID', field: 'clave', width: 80, sortable: true, filter: true }, // Or field: 'id' depending on backend
        { headerName: 'Alias / Código', field: 'cod_inv', headerTooltip: 'Alias o Código de Inventario', flex: 1, minWidth: 120, filter: true },
        { headerName: 'Serie', field: 'serie', flex: 1, minWidth: 120, filter: true },
        { headerName: 'Marca', field: 'marca_descri', flex: 1, minWidth: 120, filter: true },
        { headerName: 'Modelo', field: 'modelo', flex: 1, minWidth: 120, filter: true },
        { headerName: 'Departamento', field: 'depar_descri', flex: 1.2, minWidth: 150, filter: true },
        {
            headerName: 'Estatus',
            field: 'status',
            width: 100,
            cellRenderer: (params) => {
                const status = params.value;
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${status === 'A' || status === 'Activo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                        {status === 'A' ? 'ACTIVO' : 'BAJA'}
                    </span>
                );
            }
        },
        {
            headerName: 'Fecha Registro',
            field: 'f_regis',
            width: 120,
            valueFormatter: (params) => params.value ? dayjs(params.value).format('DD/MM/YYYY') : ''
        }
    ];

    const themeQuartzParams = {
        backgroundColor: '#1f2937',
        headerBackgroundColor: '#374151',
        cellTextColor: '#f9fafb',
        headerTextColor: '#f9fafb',
        filterBackgroundColor: '#4b5563',
        textColor: '#f9fafb'
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500 min-h-screen bg-gray-900 text-gray-100">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Monitor className="text-indigo-400" />
                        Reporte General de Equipos
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Consulta y exportación de inventario con filtros avanzados.</p>
                </div>
            </div>

            {/* Error Notifications */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* Filters Dashboard */}

            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 shadow-lg backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Search Input */}
                    <div className="lg:col-span-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Search size={14} className="text-indigo-400" /> Búsqueda General
                        </label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Nombre, serie o alias..."
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-500"
                        />
                    </div>

                    {/* Catalog Filters */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Layers size={14} className="text-indigo-400" /> Marca
                        </label>
                        <select
                            name="cve_marca"
                            value={filters.cve_marca}
                            onChange={handleFilterChange}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                        >
                            <option value="">Todas las Marcas</option>
                            {marcas.map(m => (
                                <option key={m.clave} value={m.clave}>{m.descri}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Hash size={14} className="text-indigo-400" /> Departamento
                        </label>
                        <select
                            name="cve_depar"
                            value={filters.cve_depar}
                            onChange={handleFilterChange}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                        >
                            <option value="">Todos los Deptos</option>
                            {departamentos.map(d => (
                                <option key={d.clave} value={d.clave}>{d.descri}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date Range */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Calendar size={14} className="text-indigo-400" /> Rango de Fechas
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                name="fecha_inicio"
                                value={filters.fecha_inicio}
                                onChange={handleFilterChange}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-2 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                            <input
                                type="date"
                                name="fecha_fin"
                                value={filters.fecha_fin}
                                onChange={handleFilterChange}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-2 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-end gap-3 mt-6 pt-4 border-t border-gray-700/50">
                    <button
                        onClick={clearFilters}
                        className="text-gray-400 hover:text-white px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        <FilterX size={16} /> Limpiar
                    </button>
                    <button
                        onClick={fetchReport}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                        Generar Reporte
                    </button>
                    <button
                        onClick={onPrintAll}
                        disabled={rowData.length === 0 || isPrinting}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPrinting ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}
                        Imprimir Etiquetas
                    </button>
                    <button
                        onClick={onExportExcel}
                        disabled={rowData.length === 0}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={18} />
                        Exportar Excel
                    </button>
                </div>

            </div>

            {/* Grid Section */}
            <div className="bg-gray-800/40 rounded-2xl border border-gray-700/50 p-2 overflow-hidden shadow-2xl relative h-[600px]">
                {loading && (
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <span className="text-gray-300 font-medium tracking-wide">Procesando consulta...</span>
                    </div>
                )}

                <div className="ag-theme-quartz-dark w-full h-full">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        pagination={true}
                        paginationPageSize={100}
                        animateRows={true}
                        defaultColDef={{
                            sortable: true,
                            filter: true,
                            resizable: true,
                            floatingFilter: true
                        }}
                        theme={themeQuartz.withParams(themeQuartzParams)}
                        overlayNoRowsTemplate='<span class="text-gray-400">No hay datos para mostrar. Ajusta los filtros y genera el reporte.</span>'
                    />
                </div>
            </div>
        </div>
    );
};

export default ReporteGeneralEquipos;
