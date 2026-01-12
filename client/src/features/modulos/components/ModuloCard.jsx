import React from 'react';
import { Edit, Layers, Trash2 } from 'lucide-react';

const ModuloCard = ({ modulo, onEdit, onDelete }) => {
    const { clave, descri, ruta, menu, permiso } = modulo;

    return (
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1">
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-700 p-2 rounded-lg">
                            <Layers size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-100">{clave} - {descri}</h3>
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-400">
                    <p><span className="font-semibold text-gray-500">Ruta:</span> {ruta}</p>
                    <p><span className="font-semibold text-gray-500">Menú:</span> {menu}</p>
                    {permiso && permiso.length > 0 && (
                        <div className="mt-2 text-xs bg-gray-900 p-2 rounded">
                            <span className="font-semibold block mb-1">Permisos generados:</span>
                            <div className="flex flex-wrap gap-1">
                                {permiso.map(p => (
                                    <span key={p.clave} className="bg-indigo-900/50 text-indigo-300 px-1.5 py-0.5 rounded">
                                        {p.descri}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-700/50 px-5 py-3 flex justify-end gap-2">
                <button
                    onClick={() => onEdit(modulo)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-colors"
                    title="Editar"
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={() => onDelete(clave)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-red-500/50 rounded-full transition-colors"
                    title="Eliminar"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default ModuloCard;
