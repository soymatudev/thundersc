import React from 'react';
import { Edit, Package, Trash2 } from 'lucide-react';

const DepartamentoCard = ({ departamento, onEdit, onDelete }) => {
    const { clave, descri } = departamento;

    const handleEdit = () => {
        onEdit(departamento);
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1">
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-700 p-2 rounded-lg">
                            <Package size={20} className="text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-100">{clave} - {descri}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-gray-700/50 px-5 py-3 flex justify-end gap-2">
                <button onClick={handleEdit} className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-colors" title="Editar">
                    <Edit size={16} />
                </button>
                <button onClick={() => onDelete(clave)} className="p-2 text-gray-400 hover:text-white hover:bg-red-500/50 rounded-full transition-colors" title="Eliminar">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default DepartamentoCard;
