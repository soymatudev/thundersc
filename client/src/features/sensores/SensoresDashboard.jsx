import React, { useState, useEffect, useCallback } from 'react';
import { SensoresService } from './services/sensoresService';
import { LayoutGrid, AlertCircle, Loader2, History, CalendarDays, Clock, Table } from 'lucide-react';
import SensorCard from './components/SensorCard';
import TempHistoryChart from './components/TempHistoryChart';
import HumHistoryChart from './components/HumHistoryChart';
import SensorDataGrid from './components/SensorDataGrid';
import SiloHistoryChart from './components/SiloHistoryChart';
import Swal from 'sweetalert2';

const SensoresDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'table'
    const [sensores, setSensores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // History State
    const [historyData, setHistoryData] = useState([]);
    const [historyFilter, setHistoryFilter] = useState('4h'); // 4h, today, yesterday
    const [loadingHistory, setLoadingHistory] = useState(false);

    // History Categories State
    const [historyCategory, setHistoryCategory] = useState('clima'); // 'clima', 'operacion'

    const fetchDashboard = useCallback(async (showLoading = false) => {
        if (showLoading) setLoading(true);
        try {
            const data = await SensoresService.getDashboard();
            setSensores(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching sensor dashboard:', err);
            setError('Error al obtener los datos de los sensores. Verifica tu conexión.');
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    const fetchHistory = useCallback(async () => {
        setLoadingHistory(true);
        try {
            const now = new Date();
            let start = new Date();
            let end = new Date();

            if (historyFilter === '4h') {
                start.setHours(now.getHours() - 4);
            } else if (historyFilter === 'today') {
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
            } else if (historyFilter === 'yesterday') {
                start.setDate(now.getDate() - 1);
                start.setHours(0, 0, 0, 0);
                end.setDate(now.getDate() - 1);
                end.setHours(23, 59, 59, 999);
            }

            const data = await SensoresService.getHistory(start, end);
            setHistoryData(data);
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            setLoadingHistory(false);
        }
    }, [historyFilter]);

    useEffect(() => {
        fetchDashboard(true);
        fetchHistory();

        const interval = setInterval(() => {
            fetchDashboard();
        }, 60000);
        return () => clearInterval(interval);
    }, [fetchDashboard]);

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchHistory();
        }
    }, [fetchHistory, activeTab]);

    const handleManualRefresh = async (sensorName) => {
        try {
            await SensoresService.refreshSensor(sensorName);
            setTimeout(() => fetchDashboard(), 1500);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Sincronización',
                text: 'No se pudo enviar la señal de refresco al sensor.',
                background: '#1f2937',
                color: '#f3f4f6',
                confirmButtonColor: '#4f46e5'
            });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-gray-400 font-medium animate-pulse">Sincronizando dispositivos...</p>
            </div>
        );
    }

    const hasSiloData = historyData.some(d => d.cve_unidad === 'SIL');

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-indigo-500/10 rounded-xl">
                            <LayoutGrid className="text-indigo-400" size={24} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">Monitoreo de Sensores</h1>
                    </div>
                    <p className="text-gray-400 text-sm italic ml-11">Datos actualizados cada 60 segundos</p>
                </div>

                {/* Main Tabs */}
                <div className="flex bg-gray-800/80 p-1 rounded-2xl border border-gray-700/50 shadow-inner">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'dashboard'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        <LayoutGrid size={18} /> Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('table')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'table'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        <Table size={18} /> Tabla de Datos
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 shadow-lg">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* Tab Content */}
            {activeTab === 'dashboard' ? (
                <>
                    {/* Grid de Sensores */}
                    {sensores.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sensores.map(sensor => (
                                    <SensorCard
                                        key={sensor.id}
                                        sensor={sensor}
                                        onRefresh={handleManualRefresh}
                                    />
                                ))}
                            </div>

                            {/* Historical Charts Section */}
                            <div className="mt-12 space-y-6">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-800/20 p-4 rounded-3xl border border-gray-700/30">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-3">
                                            <History className="text-indigo-400" size={24} />
                                            <h2 className="text-2xl font-bold text-white tracking-tight">Historial de Lecturas</h2>
                                        </div>

                                        {/* Category Selection Toggle */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => setHistoryCategory('clima')}
                                                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${historyCategory === 'clima' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-gray-700/50 text-gray-500 hover:text-gray-300'
                                                    }`}
                                            >
                                                Temperatura
                                            </button>
                                            <button
                                                onClick={() => setHistoryCategory('operacion')}
                                                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${historyCategory === 'operacion' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-700/50 text-gray-500 hover:text-gray-300'
                                                    }`}
                                            >
                                                Operación
                                            </button>
                                        </div>
                                    </div>

                                    {/* Filter Controls */}
                                    <div className="flex bg-gray-900/50 rounded-xl p-1 border border-gray-700 shadow-lg">
                                        <button
                                            onClick={() => setHistoryFilter('4h')}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-tighter ${historyFilter === '4h' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            4h
                                        </button>
                                        <button
                                            onClick={() => setHistoryFilter('today')}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-tighter ${historyFilter === 'today' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            Hoy
                                        </button>
                                        <button
                                            onClick={() => setHistoryFilter('yesterday')}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-tighter ${historyFilter === 'yesterday' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            Ayer
                                        </button>
                                    </div>
                                </div>

                                {loadingHistory ? (
                                    <div className="h-[350px] flex items-center justify-center bg-gray-800/30 rounded-2xl border border-gray-700/30 shadow-inner">
                                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="pb-20">
                                        {historyCategory === 'clima' ? (
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <TempHistoryChart data={historyData} />
                                                <HumHistoryChart data={historyData} />
                                            </div>
                                        ) : (
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <SiloHistoryChart data={historyData} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        !error && (
                            <div className="bg-gray-800/20 border border-dashed border-gray-700 rounded-3xl p-20 text-center flex flex-col items-center gap-4">
                                <LayoutGrid className="w-16 h-16 text-gray-700" />
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-gray-400">No se encontraron sensores</h3>
                                    <p className="text-gray-500 text-sm">No tienes permisos de consulta asignados.</p>
                                </div>
                            </div>
                        )
                    )}
                </>
            ) : (
                <SensorDataGrid sensorsList={sensores} />
            )}
        </div>
    );
};

export default SensoresDashboard;
