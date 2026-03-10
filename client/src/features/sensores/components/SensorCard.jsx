import React, { useState, useEffect } from 'react';
import { Droplets, RefreshCw, Clock, Wifi, WifiOff, Database, Weight } from 'lucide-react';
import Thermometer from './Thermometer';

/**
 * Función helper para calcular el tiempo transcurrido.
 */
const getTimeAgo = (date) => {
    if (!date) return 'Sin datos';
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

    if (diffInSeconds < 60) return `Hace ${diffInSeconds} seg`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `Hace ${diffInHours} h`;
};

const SensorCard = ({ sensor, onRefresh }) => {
    const [timeAgo, setTimeAgo] = useState(getTimeAgo(sensor.last_check));
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Actualizar el "hace x min" cada 10 segundos
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeAgo(getTimeAgo(sensor.last_check));
        }, 10000);
        return () => clearInterval(timer);
    }, [sensor.last_check]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh(sensor.nombre);
        setTimeout(() => setIsRefreshing(false), 2000); // UI feedback
    };

    // Card Body logic: check if reading is from today
    const isToday = (date) => {
        if (!date) return false;
        const d = new Date(date);
        const today = new Date();
        return d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    };

    const isRecordOld = !isToday(sensor.last_check);

    return (
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5 shadow-xl hover:border-indigo-500/30 transition-all duration-300 group">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${sensor.is_online ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                    <h3 className="font-bold text-lg text-gray-100 tracking-tight">{sensor.alias}</h3>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className={`p-2 rounded-lg bg-gray-700/50 hover:bg-indigo-500/20 text-gray-400 hover:text-indigo-400 transition-all ${isRefreshing ? 'animate-spin cursor-not-allowed' : ''}`}
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Card Body */}
            <div className="flex items-center justify-around py-2 min-h-[180px]">
                {sensor.cve_unidad === 'TEM' ? (
                    <>
                        <Thermometer
                            value={isRecordOld ? 0 : (sensor.lectura?.temperatura || 0)}
                            min={sensor.adc_3} // Min
                            max={sensor.adc_1} // Max
                        />

                        <div className="flex flex-col items-center gap-1">
                            <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20 mb-2">
                                <Droplets className="text-indigo-400" size={32} />
                            </div>
                            <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Humedad</span>
                            <span className="text-2xl font-bold text-gray-100 font-mono">
                                {isRecordOld ? '0.0' : (sensor.lectura?.humedad?.toFixed(1) || '0.0')}%
                            </span>
                        </div>
                    </>
                ) : sensor.cve_unidad === 'SIL' ? (
                    <>
                        <div className="flex flex-col items-center w-full">
                            {/* Contenedor del Silo */}
                            <div className="relative w-28 h-44 bg-gray-800/80 border-2 border-gray-600/50 shadow-inner mb-3"
                                style={{
                                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)',
                                    WebkitClipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)'
                                }}>
                                
                                {/* Líquido/Contenido del Silo */}
                                <div
                                    className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all duration-1000 ease-in-out"
                                    style={{ 
                                        height: `${isRecordOld ? 0 : (sensor.lectura?.nivel_porcentual || 0)}%`,
                                        // El líquido debe seguir la misma forma del contenedor
                                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)', 
                                    }}
                                />

                                {/* Brillo de cristal (Efecto industrial) */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                                
                                {/* Icono central */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                    <Database size={32} className="text-white mb-8" />
                                </div>
                            </div>

                            {/* Lectura porcentual */}
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-black text-emerald-400 font-mono tracking-tighter">
                                    {isRecordOld ? '0.0' : (sensor.lectura?.nivel_porcentual?.toFixed(1) || '0.0')}%
                                </span>
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Nivel de Silo</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20 mb-2">
                                <Weight className="text-indigo-400" size={32} />
                            </div>
                            <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Toneladas</span>
                            <span className="text-2xl font-bold text-gray-100 font-mono">
                                {isRecordOld ? '0.0' : (sensor.lectura?.nivel_toneles?.toFixed(2) || '0.0')}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="text-gray-500 italic text-sm">Dispositivo no configurado</div>
                )}
            </div>


            {/* Card Footer */}
            <div className="mt-6 pt-4 border-t border-gray-700/50 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{timeAgo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    {sensor.is_online ? <Wifi size={14} className="text-green-500/70" /> : <WifiOff size={14} className="text-red-500/70" />}
                    <span className="uppercase tracking-wider">{sensor.is_online ? 'Conectado' : 'Sin Señal'}</span>
                </div>
            </div>
        </div>
    );
};

export default SensorCard;
