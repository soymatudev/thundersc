import React, { useState, useEffect, useCallback } from 'react';
import { ViajesService } from '../services/viajesService';
import { Alerts } from '../../../shared/services/Alerts';
import { useNavigate } from 'react-router-dom';
import {
    Plane,
    Search,
    TrendingUp,
    Calendar,
    User,
    DollarSign,
    MapPin,
    ChevronRight,
    Loader2
} from 'lucide-react';

const ViajesPage = ({ onShowDetail }) => {
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleRowClick = (clave) => {
        if (onShowDetail) {
            onShowDetail(clave);
        } else {
            navigate(`/viajes/${clave}`);
        }
    };

    const fetchViajes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ViajesService.getDetallado();
            setViajes(data || []);
        } catch (err) {
            setError('No se pudieron cargar los viajes.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchViajes();
    }, [fetchViajes]);

    const filteredViajes = viajes.filter(viaje =>
        viaje.empleado?.descri?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        viaje.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'abierto':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'revisión':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'cerrado':
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-indigo-500/10 rounded-xl">
                            <Plane className="text-indigo-400" size={24} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">Administración de Viajes</h1>
                    </div>
                    <p className="text-gray-400 text-sm italic ml-11">Control y seguimiento de viáticos y evidencias</p>
                </div>

                <div className="relative w-full md:w-96 group">
                    <input
                        type="text"
                        placeholder="Buscar por empleado o viaje..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-2xl text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-600"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="animate-spin text-indigo-500" size={48} />
                    <p className="text-gray-400 animate-pulse">Cargando registros de viajes...</p>
                </div>
            ) : error ? (
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl text-center">
                    <p className="text-red-400 font-medium">{error}</p>
                    <button
                        onClick={fetchViajes}
                        className="mt-4 text-indigo-400 hover:text-indigo-300 transition-colors font-bold"
                    >
                        Reintentar cargar
                    </button>
                </div>
            ) : (
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-900/50 border-b border-gray-700/50">
                                    <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-gray-500">Empleado / Viaje</th>
                                    <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-gray-500">Fecha Salida</th>
                                    <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-gray-500 text-center">Presupuesto</th>
                                    <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-gray-500 text-center">Gasto Total</th>
                                    <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-gray-500 text-center">Estatus</th>
                                    <th className="px-6 py-4 text-xs uppercase tracking-widest font-bold text-gray-500"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/30">
                                {filteredViajes.length > 0 ? (
                                    filteredViajes.map((viaje) => (
                                        <tr
                                            key={viaje.clave}
                                            onClick={() => handleRowClick(viaje.clave)}
                                            className="group hover:bg-white/5 cursor-pointer transition-all"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                                        <User size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold group-hover:text-indigo-300 transition-colors">{viaje.empleado?.descri || 'Sin nombre'}</p>
                                                        <p className="text-gray-500 text-xs italic">{viaje.titulo}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Calendar size={14} className="text-gray-500" />
                                                    <span className="text-sm font-medium">
                                                        {new Date(viaje.fecha_inicio).toLocaleDateString('es-MX', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-blue-300 font-mono font-bold">
                                                    {formatCurrency(viaje.presupuesto)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-amber-300 font-mono font-bold">
                                                    {formatCurrency(viaje.total_gastado)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black border ${getStatusColor(viaje.status_viaje)}`}>
                                                    {viaje.status_viaje}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end">
                                                    <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all">
                                                        <ChevronRight size={18} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500 italic">
                                            No se encontraron viajes registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Stats Summary */}
            {!loading && !error && filteredViajes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800/40 p-6 rounded-3xl border border-gray-700/50 flex items-center gap-4">
                        <div className="p-4 bg-green-500/10 rounded-2xl">
                            <TrendingUp className="text-green-400" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Gasto Consolidado</p>
                            <p className="text-2xl font-black text-white">
                                {formatCurrency(filteredViajes.reduce((acc, v) => acc + (v.total_gastado || 0), 0))}
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-800/40 p-6 rounded-3xl border border-gray-700/50 flex items-center gap-4">
                        <div className="p-4 bg-blue-500/10 rounded-2xl">
                            <Plane className="text-blue-400" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Total Viajes</p>
                            <p className="text-2xl font-black text-white">{filteredViajes.length}</p>
                        </div>
                    </div>
                    <div className="bg-gray-800/40 p-6 rounded-3xl border border-gray-700/50 flex items-center gap-4">
                        <div className="p-4 bg-amber-500/10 rounded-2xl">
                            <DollarSign className="text-amber-400" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">Presupuesto Asignado</p>
                            <p className="text-2xl font-black text-white">
                                {formatCurrency(filteredViajes.reduce((acc, v) => acc + Number(v.presupuesto || 0), 0))}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViajesPage;
