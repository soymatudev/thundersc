import React from 'react';
import { Edit, Trash2, User as UserIcon } from 'lucide-react';

const UsuarioCard = ({ usuario, onEdit, onDelete }) => {
    const { clave, descri, username, usuario_permiso } = usuario;

    return (
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1">
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-700 p-2 rounded-lg">
                            <UserIcon size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-100">{descri}</h3>
                            <p className="text-sm text-gray-400">{clave} @{username}</p>
                        </div>
                    </div>
                </div>

                {usuario_permiso && usuario_permiso.length > 0 && (
                    <div className="mt-4 space-y-2 text-sm text-gray-400">
                        <p className="font-semibold text-gray-500">
                            {usuario_permiso.length} {usuario_permiso.length === 1 ? 'permiso asignado' : 'permisos asignados'}
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-gray-700/50 px-5 py-3 flex justify-end gap-2">
                <button
                    onClick={() => onEdit(usuario)}
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

export default UsuarioCard;
