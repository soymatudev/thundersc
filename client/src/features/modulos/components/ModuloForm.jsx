import React, { useState, useEffect } from 'react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const ModuloForm = ({ onSave, onCancel, moduloToEdit }) => {
    const [clave, setClave] = useState('');
    const [descri, setDescri] = useState('');
    const [ruta, setRuta] = useState('');
    const [menu, setMenu] = useState('');
    const [permissions, setPermissions] = useState([{ descri: '' }]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (moduloToEdit) {
            setClave(moduloToEdit.clave || '');
            setDescri(moduloToEdit.descri || '');
            setRuta(moduloToEdit.ruta || '');
            setMenu(moduloToEdit.menu || '');
            // Cargar los permisos existentes del módulo para edición
            if (moduloToEdit.permiso && moduloToEdit.permiso.length > 0) {
                // El backend devuelve { clave, descri }, el form usa { descri }
                setPermissions(moduloToEdit.permiso.map(p => ({ descri: p.descri })));
            } else {
                // Si no hay permisos, iniciar con uno vacío para poder agregar
                setPermissions([{ descri: '' }]);
            }
        } else {
            setClave('');
            setDescri('');
            setRuta('');
            setMenu('');
            setPermissions([{ descri: '' }]);
        }
    }, [moduloToEdit]);

    const handleAddPermission = () => {
        setPermissions([...permissions, { descri: '' }]);
    };

    const handleRemovePermission = (index) => {
        const newPermissions = [...permissions];
        newPermissions.splice(index, 1);
        setPermissions(newPermissions);
    };

    const handlePermissionChange = (index, value) => {
        const newPermissions = [...permissions];
        newPermissions[index].descri = value;
        setPermissions(newPermissions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Estructura completa enviada desde el form
            const payload = {
                moduloData: {
                    clave: clave ? parseInt(clave, 10) : undefined,
                    descri,
                    ruta,
                    menu
                },
                permisoModuloData: permissions.filter(p => p.descri.trim() !== '')
            };

            // Si estamos editando, tal vez queramos pasar solo lo que cambió, pero
            // por consistencia pasamos el payload. El padre decidirá qué usar.
            // Para edición, el onSave original esperaba {descri, ruta...}. 
            // Adaptaremos ModulosPage para manejar esto.
            await onSave(payload);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                id="modulo-clave"
                label="Clave (ID)"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="Automático si se deja vacío"
                type="number"
                disabled={!!moduloToEdit}
            />

            <Input
                id="modulo-descri"
                label="Descripción"
                value={descri}
                onChange={(e) => setDescri(e.target.value)}
                required
                placeholder="Ej: Departamentos"
            />

            <Input
                id="modulo-ruta"
                label="Ruta (Path)"
                value={ruta}
                onChange={(e) => setRuta(e.target.value)}
                required
                placeholder="Ej: System/Pruebas/Catalogos/Departamentos/Departamentos.jsx"
            />

            <Input
                id="modulo-menu"
                label="Identificador de Menú"
                value={menu}
                onChange={(e) => setMenu(e.target.value)}
                required
                placeholder="Ej: Inicio.Inventarios.Catalogos.Departamentos"
            />

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Permisos del Módulo</label>
                {permissions.map((perm, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            id={`permiso-${index}`}
                            label=""
                            value={perm.descri}
                            onChange={(e) => handlePermissionChange(index, e.target.value)}
                            placeholder="Ej: usrinsert"
                            containerClassName="flex-grow"
                        />
                        {index === permissions.length - 1 ? (
                            <button
                                type="button"
                                onClick={handleAddPermission}
                                className="mt-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors h-[42px] self-start"
                                title="Agregar permiso"
                            >
                                +
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => handleRemovePermission(index)}
                                className="mt-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors h-[42px] self-start"
                                title="Quitar permiso"
                            >
                                -
                            </button>
                        )}
                    </div>
                ))}
                <p className="text-xs text-gray-500">Define los permisos que tendrá este módulo.</p>
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
                <Button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : (moduloToEdit ? 'Actualizar' : 'Crear')}
                </Button>
            </div>
        </form>
    );
};

export default ModuloForm;
