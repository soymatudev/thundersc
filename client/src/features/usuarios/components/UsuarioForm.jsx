import React, { useState, useEffect } from 'react';
import { ModulosService } from '../../modulos/services/modulosService';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const UsuarioForm = ({ onSave, onCancel, usuarioToEdit }) => {
    // User data states
    const [descri, setDescri] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Permissions states
    const [allModules, setAllModules] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState(new Set());
    
    // UI states
    const [loading, setLoading] = useState(false);
    const [loadingModules, setLoadingModules] = useState(true);

    // Fetch all modules and their permissions on component mount
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                setLoadingModules(true);
                const modules = await ModulosService.getAll();
                // Filter out modules that don't have permissions
                setAllModules(modules.filter(m => m.permiso && m.permiso.length > 0));
            } catch (error) {
                console.error("Error fetching modules for permissions:", error);
            } finally {
                setLoadingModules(false);
            }
        };
        fetchPermissions();
    }, []);

    // Populate form if editing a user
    useEffect(() => {
        if (usuarioToEdit) {
            setDescri(usuarioToEdit.descri || '');
            setUsername(usuarioToEdit.username || '');
            setPassword(''); // Password should be empty for editing, only set if changed
            
            // Populate selected permissions from the user's existing permissions
            if (usuarioToEdit.usuario_permiso && usuarioToEdit.usuario_permiso.length > 0) {
                const initialPermissions = new Set(
                    usuarioToEdit.usuario_permiso.map(p => p.cve_permiso)
                );
                setSelectedPermissions(initialPermissions);
            }
        } else {
            // Reset form for creation
            setDescri('');
            setUsername('');
            setPassword('');
            setSelectedPermissions(new Set());
        }
    }, [usuarioToEdit]);

    const handlePermissionChange = (permisoId) => {
        const newSelection = new Set(selectedPermissions);
        if (newSelection.has(permisoId)) {
            newSelection.delete(permisoId);
        } else {
            newSelection.add(permisoId);
        }
        setSelectedPermissions(newSelection);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const userData = {
            descri,
            username,
        };
        // Only include password if it's being set (for new user) or changed (for existing user)
        if (password) {
            userData.hash_password = password;
        }

        const usuarioPermisoData = Array.from(selectedPermissions).map(permisoId => ({
            cve_permiso: permisoId,
            cve_empresa: 'PCZMEX' // Hardcoded as per user's example. This could be dynamic in a real app.
        }));

        const payload = {
            userData,
            usuarioPermisoData
        };

        try {
            await onSave(payload);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    id="usuario-descri"
                    label="Nombre Completo"
                    value={descri}
                    onChange={(e) => setDescri(e.target.value)}
                    required
                    placeholder="Ej: Juan Pérez"
                />
                <Input
                    id="usuario-username"
                    label="Nombre de Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Ej: juan.perez"
                    disabled={!!usuarioToEdit} // Do not allow username change on edit
                />
            </div>
            <Input
                id="usuario-password"
                label={usuarioToEdit ? "Nueva Contraseña (opcional)" : "Contraseña"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!usuarioToEdit} // Required only for new users
                placeholder={usuarioToEdit ? "Dejar vacío para no cambiar" : "Contraseña segura"}
            />

            <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-200 border-b border-gray-700 pb-2">
                    Permisos de Usuario
                </h3>
                {loadingModules ? (
                    <p className="text-gray-400">Cargando permisos...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 max-h-64 overflow-y-auto p-2 bg-gray-900/50 rounded">
                        {allModules.map(module => (
                            <div key={module.clave}>
                                <h4 className="font-semibold text-indigo-400 mb-2">{module.descri}</h4>
                                <div className="space-y-1">
                                    {module.permiso.map(p => (
                                        <label key={p.clave} className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                                                checked={selectedPermissions.has(p.clave)}
                                                onChange={() => handlePermissionChange(p.clave)}
                                            />
                                            {p.descri}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <Button type="submit" disabled={loading || loadingModules}>
                    {loading ? 'Guardando...' : (usuarioToEdit ? 'Actualizar Usuario' : 'Crear Usuario')}
                </Button>
            </div>
        </form>
    );
};

export default UsuarioForm;
