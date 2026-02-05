import React from 'react';
import { Edit, Trash2, User, Briefcase } from 'lucide-react';

const EmpleadoCard = ({ empleado, onEdit, onDelete }) => {
  const { id, clave, descri, cve_zon, status } = empleado;

  const handleEdit = () => {
    onEdit(empleado);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gray-700 p-2 rounded-lg">
              <User size={20} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-100">{id} - {descri}</h3>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            status ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {status ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <div className="mt-4 text-sm text-gray-400 flex items-center gap-2">
          <Briefcase size={14} />
          <span>Zona: {cve_zon}</span>
        </div>
      </div>
      
      <div className="bg-gray-700/50 px-5 py-3 flex justify-end gap-2">
        <button onClick={handleEdit} className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-colors">
          <Edit size={16} />
        </button>
        <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-white hover:bg-red-500/50 rounded-full transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default EmpleadoCard;
