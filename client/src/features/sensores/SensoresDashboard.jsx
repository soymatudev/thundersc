import React, { useState, useEffect, useCallback } from 'react';
import { SensoresService } from './services/sensoresService';
import { LayoutGrid, AlertCircle, Loader2 } from 'lucide-react';
import SensorCard from './components/SensorCard';
import Swal from 'sweetalert2';

const SensoresDashboard = () => {
    const [sensores, setSensores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Inicial y Polling cada 60s
    useEffect(() => {
        fetchDashboard(true);
        const interval = setInterval(() => {
            fetchDashboard();
        }, 60000);
        return () => clearInterval(interval);
    }, [fetchDashboard]);

    const handleManualRefresh = async (sensorName) => {
        try {
            await SensoresService.refreshSensor(sensorName);
            // Opcional: Re-fetch dashboard after a small delay to catch the update
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

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-indigo-500/10 rounded-xl">
                            <LayoutGrid className="text-indigo-400" size={24} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">Monitoreo de Sensores</h1>
                    </div>
                    <p className="text-gray-400 text-sm italic ml-11">Datos actualizados cada 60 segundos</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* Grid de Sensores */}
            {sensores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sensores.map(sensor => (
                        <SensorCard
                            key={sensor.id}
                            sensor={sensor}
                            onRefresh={handleManualRefresh}
                        />
                    ))}
                </div>
            ) : (
                !error && (
                    <div className="bg-gray-800/20 border border-dashed border-gray-700 rounded-3xl p-20 text-center flex flex-col items-center gap-4">
                        <LayoutGrid className="w-16 h-16 text-gray-700" />
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-gray-400">No se encontraron sensores</h3>
                            <p className="text-gray-500 text-sm">No tienes permisos de consulta asignados para ningún sensor activo.</p>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default SensoresDashboard;
