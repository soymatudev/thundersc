import React from 'react';
import {
    MapPin,
    Clock,
    CreditCard,
    Receipt,
    MessageSquare,
    ExternalLink,
    Map as MapIcon,
    Image as ImageIcon,
    FileText
} from 'lucide-react';

const ViajeStopCard = ({ stop, onImageClick }) => {
    const isImage = (url) => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(url);
    const isPdf = (url) => /\.pdf$/i.test(url);

    return (
        <div className="relative pl-8 pb-12 last:pb-0 group">
            {/* Timeline connector */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-700 group-last:bg-transparent"></div>

            {/* Timeline dot */}
            <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-gray-900 z-10"></div>

            <div className="bg-gray-800/60 rounded-3xl border border-gray-700/50 p-6 shadow-xl hover:border-indigo-500/30 transition-all">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-4">
                        {/* Header Area */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                                {stop.categoria?.nombre || 'Gasto'}
                            </span>
                            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium bg-gray-900/50 px-3 py-1 rounded-full">
                                <Clock size={12} />
                                {stop.hora_registro} hrs
                            </div>
                            {stop.facturable && (
                                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                                    <Receipt size={10} /> Facturable
                                </span>
                            )}
                        </div>

                        {/* Content Area */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <MapPin size={20} className="text-gray-500" />
                                {stop.lugar}
                            </h3>
                            {stop.descripcion && (
                                <div className="flex gap-2 p-3 bg-gray-900/50 rounded-2xl text-gray-400 text-sm italic">
                                    <MessageSquare size={16} className="shrink-0 mt-0.5 text-gray-600" />
                                    <p>{stop.descripcion}</p>
                                </div>
                            )}
                        </div>

                        {/* Evidences */}
                        {stop.evidencias && stop.evidencias.length > 0 && (
                            <div className="pt-4 space-y-3">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <ImageIcon size={14} /> Evidencias ({stop.evidencias.length})
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {stop.evidencias.map((ev, idx) => (
                                        <div
                                            key={ev.clave || idx}
                                            className="group/img relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-700 cursor-pointer hover:border-indigo-500 transition-all"
                                            onClick={() => isImage(ev.url_archivo) ? onImageClick(ev.url_archivo) : window.open(ev.url_archivo, '_blank')}
                                        >
                                            {isImage(ev.url_archivo) ? (
                                                <div className="w-full h-full bg-gray-900 border border-gray-700/50 flex items-center justify-center relative">
                                                    <img
                                                        src={ev.url_archivo}
                                                        alt={`Evidencia ${idx + 1}`}
                                                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500 z-10"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="hidden absolute inset-0 flex-col items-center justify-center text-gray-600 gap-1 bg-gray-900">
                                                        <ImageIcon size={24} className="opacity-50" />
                                                        <span className="text-[10px] uppercase font-black">Error</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-500 gap-1 border border-gray-700/50">
                                                    {isPdf(ev.url_archivo) ? <FileText size={24} className="text-red-400" /> : <ExternalLink size={24} />}
                                                    <span className="text-[10px] uppercase font-black tracking-tighter">Ver Doc</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                <ExternalLink size={16} className="text-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Money & Map Area */}
                    <div className="md:w-64 space-y-4">
                        <div className="bg-gray-900/80 rounded-3xl p-5 border border-gray-700/50 text-center">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Monto del Gasto</span>
                            <div className="text-3xl font-black text-white flex items-center justify-center gap-1">
                                <span className="text-gray-600 text-xl font-bold">$</span>
                                {(Number(stop.monto) + Number(stop.propina)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </div>
                            {Number(stop.propina) > 0 && (
                                <p className="text-[10px] text-gray-500 mt-1">Incluye ${Number(stop.propina)} de propina</p>
                            )}
                        </div>

                        {stop.lat && stop.lng && (
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group/map relative h-32 rounded-3xl overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all"
                            >
                                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                                    <MapIcon size={32} className="text-gray-700 group-hover/map:scale-110 transition-transform" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                                    <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white font-bold text-xs">
                                        <MapPin size={12} className="text-indigo-400" />
                                        Abrir Mapa
                                    </div>
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViajeStopCard;
