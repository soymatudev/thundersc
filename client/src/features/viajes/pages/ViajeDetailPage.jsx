import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ViajesService } from '../services/viajesService';
import ViajeStopCard from '../components/ViajeStopCard';
import {
    ArrowLeft,
    User,
    Calendar,
    MapPin,
    DollarSign,
    TrendingDown,
    Info,
    ChevronRight,
    Loader2,
    X,
    Download
} from 'lucide-react';

const ViajeDetailPage = ({ id: propId, onBack }) => {
    const { id: paramsId } = useParams();
    const id = propId || paramsId;
    const navigate = useNavigate();
    const [viaje, setViaje] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/viajes');
        }
    };

    const fetchViaje = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ViajesService.getById(id);
            if (!data) throw new Error('Viaje no encontrado');
            setViaje(data);
        } catch (err) {
            setError('No se pudo cargar el detalle del viaje.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchViaje();
    }, [fetchViaje]);

    const totalGastado = viaje?.paradas?.reduce((acc, p) => acc + Number(p.monto) + Number(p.propina), 0) || 0;
    const saldoRestante = Number(viaje?.presupuesto || 0) - totalGastado;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="animate-spin text-indigo-500" size={64} />
                <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Sincronizando itinerario...</p>
            </div>
        );
    }

    if (error || !viaje) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <div className="bg-gray-800/40 border border-gray-700 p-12 rounded-[40px] text-center space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto text-red-500 border border-red-500/20">
                        <Info size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-white">{error || 'Viaje no encontrado'}</h2>
                    <button
                        onClick={() => navigate('/viajes')}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={18} /> Volver a la lista
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-10 space-y-10 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Back & Breadcrumb */}
            <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
                <div className="p-2 bg-gray-800 rounded-xl group-hover:bg-gray-700 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="font-bold tracking-tight">Regresar a Viajes</span>
            </button>

            {/* Hero Header */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-[40px] p-8 lg:p-12 overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
                    <div className="space-y-6 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest border ${viaje.status_viaje === 'Abierto' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                viaje.status_viaje === 'Revisión' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                    'bg-green-500/10 text-green-400 border-green-500/20'
                                }`}>
                                {viaje.status_viaje}
                            </span>
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold bg-gray-900/50 px-4 py-1.5 rounded-full border border-white/5">
                                <Calendar size={14} />
                                {new Date(viaje.fecha_inicio).toLocaleDateString('es-MX', { dateStyle: 'long' })}
                            </div>
                        </div>

                        <div>
                            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-2 leading-tight">
                                {viaje.titulo}
                            </h1>
                            <div className="flex items-center gap-3 text-indigo-300 font-bold text-lg">
                                <User size={20} />
                                {viaje.empleado?.descri}
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-[400px] grid grid-cols-2 gap-4">
                        <div className="bg-gray-900/80 p-6 rounded-[32px] border border-gray-700/50">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Presupuesto</span>
                            <p className="text-2xl font-black text-white">${Number(viaje.presupuesto).toLocaleString()}</p>
                        </div>
                        <div className={`p-6 rounded-[32px] border ${saldoRestante < 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Restante</span>
                            <p className={`text-2xl font-black ${saldoRestante < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                ${saldoRestante.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-gray-900/80 p-6 rounded-[32px] border border-gray-700/50 col-span-2">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Gasto Total</span>
                                    <p className="text-3xl font-black text-white">${totalGastado.toLocaleString()}</p>
                                </div>
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                    <TrendingDown size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                        Itinerario de Gastos
                        <span className="text-sm font-medium text-gray-500 bg-gray-800 px-3 py-1 rounded-full">{viaje.paradas?.length || 0} Paradas</span>
                    </h2>

                    <div className="relative">
                        {viaje.paradas && viaje.paradas.length > 0 ? (
                            viaje.paradas
                                .sort((a, b) => a.hora_registro.localeCompare(b.hora_registro))
                                .map((stop) => (
                                    <ViajeStopCard
                                        key={stop.clave}
                                        stop={stop}
                                        onImageClick={(url) => setSelectedImage(url)}
                                    />
                                ))
                        ) : (
                            <div className="bg-gray-800/20 border-2 border-dashed border-gray-700 p-12 rounded-[40px] text-center text-gray-500 italic">
                                Aún no se han registrado paradas en este viaje.
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <h2 className="text-2xl font-black text-white mb-2">Notas Rápidas</h2>
                    <div className="space-y-4">
                        {viaje.notas && viaje.notas.length > 0 ? (
                            viaje.notas.map((nota) => (
                                <div key={nota.clave} className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-3xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 -mr-8 -mt-8 rotate-45 transform"></div>
                                    <h4 className="text-amber-400 font-black uppercase text-xs tracking-widest mb-3">{nota.titulo}</h4>
                                    <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                        {typeof nota.contenido === 'string' ? nota.contenido : JSON.stringify(nota.contenido, null, 2)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 border border-gray-700 rounded-3xl text-center text-gray-600 text-sm italic">
                                No hay notas registradas.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Lightbox / Modal de Imagen */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-6" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 right-0 flex gap-4">
                            <button
                                onClick={() => window.open(selectedImage, '_blank')}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                                title="Ver original"
                            >
                                <Download size={24} />
                            </button>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <img
                            src={selectedImage}
                            alt="Evidencia seleccionada"
                            className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                        />
                        <p className="text-gray-400 text-sm font-medium tracking-tight bg-white/5 px-6 py-2 rounded-full border border-white/10">
                            Vista previa de evidencia
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViajeDetailPage;
