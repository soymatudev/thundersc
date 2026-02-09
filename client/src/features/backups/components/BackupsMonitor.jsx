import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { Loader2, RefreshCw, Filter, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import dayjs from 'dayjs';
import { BackupsService } from '../services/backupsService';

ModuleRegistry.registerModules([AllCommunityModule]);

const BackupsMonitor = () => {
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [classFilter, setClassFilter] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await BackupsService.getStatus();
            setRowData(data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Error fetching backups status", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const getStatusColor = (params) => {
        const row = params.data;
        if (!row.last_date) return 'bg-red-500/20 text-red-400 border-red-500/30';

        const lastDate = dayjs(row.last_date);
        const today = dayjs();
        const diffDays = today.diff(lastDate, 'day');
        const isFull = row.type === 'F';
        const isSuccess = true;
        const size = parseFloat(row.size.slice(0,row.size.length-1) || '0');

        if (diffDays > 3 || size < 0.1) {
            return 'bg-red-500/20 text-red-400 border-red-500/30';
        }
        if (!isFull || (diffDays >= 2 && diffDays <= 3)) {
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        }

        if (isFull && isSuccess && diffDays <= 1) {
            return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        }

        return 'bg-red-500/20 text-red-400 border-red-500/30';
    };

    const StatusRenderer = (params) => {
        const colorClass = getStatusColor(params);
        let Icon = ShieldX;
        let text = 'CRÍTICO';

        if (colorClass.includes('emerald')) {
            Icon = ShieldCheck;
            text = 'OPERATIVO';
        } else if (colorClass.includes('yellow')) {
            Icon = ShieldAlert;
            text = 'ADVERTENCIA';
        }

        return (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold w-fit ${colorClass}`}>
                <Icon size={14} />
                <span>{text}</span>
            </div>
        );
    };

    const columnDefs = useMemo(() => [
        { headerName: 'Servidor', field: 'host_descri', headerTooltip: 'Nombre del Servidor', flex: 1.5, minWidth: 150, sortable: true, filter: true },
        {
            headerName: 'Fecha',
            field: 'last_date',
            width: 120,
            sortable: true,
            valueFormatter: (params) => params.value ? dayjs(dayjs(params.value).toString().split(' GMT')[0]).format('DD/MM/YYYY') : '-'
        },
        { headerName: 'Hora', field: 'last_time', width: 100, sortable: true },
        { headerName: 'Tamaño', field: 'size', width: 100 },
        {
            headerName: 'Tipo',
            field: 'type',
            width: 120,
            valueFormatter: (params) => params.value === 'F' ? 'Completo' : (params.value === 'I' ? 'Incremental' : params.value)
        },
        { headerName: 'Ruta', field: 'path', flex: 2, minWidth: 200, tooltipField: 'path' },
        { headerName: 'Clasificación', field: 'class', width: 120, filter: true },
        {
            headerName: 'Estatus',
            field: 'status',
            width: 160,
            cellRenderer: StatusRenderer,
            completed: (params) => getStatusColor(params) // Helper for sorting if needed
        }
    ], []);

    const themeQuartzParams = {
        backgroundColor: '#1f2937',
        headerBackgroundColor: '#374151',
        cellTextColor: '#f9fafb',
        headerTextColor: '#f9fafb',
        filterBackgroundColor: '#4b5563',
        textColor: '#f9fafb'
    };

    // Filter Logic
    const filteredData = useMemo(() => {
        if (!classFilter) return rowData;
        return rowData.filter(row => row.class?.toLowerCase().includes(classFilter.toLowerCase()));
    }, [rowData, classFilter]);

    // Extract unique classes for filter dropdown
    const uniqueClasses = useMemo(() => {
        const classes = new Set(rowData.map(r => r.class).filter(Boolean));
        return Array.from(classes);
    }, [rowData]);

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500 min-h-screen bg-gray-900 text-gray-100">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShieldCheck className="text-emerald-400" />
                        Monitor de Respaldos
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Estado en tiempo real de los respaldos de servidores.
                        {lastUpdated && <span className="text-gray-500 ml-2">Actualizado: {dayjs(lastUpdated).format('HH:mm:ss')}</span>}
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors text-gray-300 hover:text-white"
                    title="Actualizar datos"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Filters */}
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400 font-bold text-sm uppercase tracking-wider">
                    <Filter size={16} /> Filtros:
                </div>
                <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    <option value="">Todas las Clasificaciones</option>
                    {uniqueClasses.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Grid */}
            <div className="bg-gray-800/40 rounded-2xl border border-gray-700/50 p-2 overflow-hidden shadow-2xl relative h-[650px]">
                {loading && (
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                        <span className="text-gray-300 font-medium tracking-wide">Comprobando estado de servidores...</span>
                    </div>
                )}

                <div className="ag-theme-quartz-dark w-full h-full">
                    <AgGridReact
                        rowData={filteredData}
                        columnDefs={columnDefs}
                        pagination={true}
                        paginationPageSize={100}
                        animateRows={true}
                        defaultColDef={{
                            sortable: true,
                            filter: true,
                            resizable: true
                        }}
                        theme={themeQuartz.withParams(themeQuartzParams)}
                        rowHeight={50}
                    />
                </div>
            </div>
        </div>
    );
};

export default BackupsMonitor;
