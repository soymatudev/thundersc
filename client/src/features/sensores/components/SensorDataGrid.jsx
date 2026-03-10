import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz} from 'ag-grid-community';
import { SensoresService } from '../services/sensoresService';
import { Download, Search, FilterX, Calendar, Users, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

ModuleRegistry.registerModules([AllCommunityModule]);

const SensorDataGrid = ({ sensorsList }) => {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters State
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSensors, setSelectedSensors] = useState([1]);

    const columnDefs = [
        { headerName: 'Fecha/Hora', field: 'fecha_hora', sortable: true, filter: true, flex: 1.5 },
        { headerName: 'Sensor', field: 'sensor_nombre', sortable: true, filter: true, flex: 1.5 },
        {
            headerName: 'Dato Principal',
            field: 'dato_1',
            sortable: true,
            filter: 'agNumberColumnFilter',
            valueFormatter: (params) => {
                // Validamos que existan los datos de la fila
                if (!params.data) return '';
        
                const valor = parseFloat(params.value) || 0;
                const unidad = params.data.cve_unidad; // <--- Cambiado de params.cve_unidad a params.data.cve_unidad
        
                return unidad === 'SIL' 
                    ? `${(valor / 100).toFixed(1)} m` 
                    : `${valor.toFixed(1)} °C`;
            },
            flex: 1
        },
        {
            headerName: 'Humedad (%)',
            field: 'dato_2',
            sortable: true,
            filter: 'agNumberColumnFilter',
            valueFormatter: (params) => params.value ? `${parseFloat(params.value).toFixed(1)}%` : '0.0%',
            flex: 1
        },
        {
            headerName: 'Estatus',
            field: 'fecha_hora',
            flex: 1.5,
            cellRenderer: (params) => {
                const reportDate = dayjs(params.value);
                const isToday = reportDate.isValid() && reportDate.isAfter(dayjs().startOf('day'));

                if (!isToday) {
                    return (
                        <div className="flex items-center h-full">
                            <span className="bg-red-600/90 text-white text-[10px] font-black px-2 py-1 rounded-md border border-red-400 animate-pulse tracking-tighter">
                                SIN SEÑAL (CRÍTICO)
                            </span>
                        </div>
                    );
                }
                return (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider h-full">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        Operativo
                    </div>
                );
            }
        }
    ];


    const fetchReport = useCallback(async () => {
        setLoading(true);
        try {
            const filters = {
                fecha_inicio: `${startDate} 00:00:00`,
                fecha_fin: `${endDate} 23:59:59`,
                cve_equipos: selectedSensors.length > 0 ? selectedSensors : undefined
            };
            const result = await SensoresService.getReporte(filters, { skip: 0, take: 1000 });
            setRowData(result.data);
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, selectedSensors]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const onExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(rowData.map(row => ({
            'Fecha/Hora': row.fecha_hora,
            'Sensor': row.sensor_nombre,
            'Dato Principal': row.dato_1,
            'Humedad (%)': row.dato_2,
            'Dato 3': row.dato_3
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Sensores");
        XLSX.writeFile(workbook, `Reporte_Sensores_${startDate}_${endDate}.xlsx`);
    };

    const toggleSensor = (cve) => {
        setSelectedSensors(prev =>
            prev.includes(cve) ? prev.filter(id => id !== cve) : [...prev, cve]
        );
    };

    const themeQuartzParams = () => {
        return {
            backgroundColor: '#1f2937', 
            headerBackgroundColor: '#374151', 
            cellTextColor: '#f9fafb', 
            headerTextColor: '#f9fafb',
            filterBackgroundColor: '#4b5563',
            textColor: '#f9fafb'
        }
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toolbar / Filters */}
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 flex flex-wrap items-end gap-6 shadow-lg backdrop-blur-md">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-400" /> Rango de Fechas
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                        <span className="text-gray-500">a</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2 flex-grow max-w-md">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Users size={14} className="text-indigo-400" /> Filtrar por Sensores
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1">
                        {sensorsList.map(s => (
                            <button
                                key={s.id}
                                onClick={() => toggleSensor(s.id)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${selectedSensors.includes(s.id)
                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                                    : 'bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500'
                                    }`}
                            >
                                {s.alias}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchReport}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                    >
                        <Search size={18} /> Consultar
                    </button>
                    <button
                        onClick={onExportExcel}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                    >
                        <Download size={18} /> Exportar
                    </button>
                </div>
            </div>

            {/* Grid Container */}
            <div className="bg-gray-800/40 rounded-2xl border border-gray-700/50 p-2 overflow-hidden shadow-2xl relative h-[600px]">
                {loading && (
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <span className="text-gray-300 font-medium tracking-wide">Cargando registros...</span>
                    </div>
                )}

                <div className="ag-theme-quartz-dark w-full h-full">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        pagination={true}
                        paginationPageSize={50}
                        animateRows={true}
                        defaultColDef={{
                            resizable: true,
                            filter: true,
                        }}
                        theme={themeQuartz.withParams(themeQuartzParams())}
                        className='ag-theme-quartz-dark'
                    />
                </div>
            </div>
        </div>
    );
};

export default SensorDataGrid;
