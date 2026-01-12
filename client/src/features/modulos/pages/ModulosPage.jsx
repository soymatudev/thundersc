import React, { useState, useEffect, useCallback } from 'react';
import { ModulosService } from '../services/modulosService';
import { Alerts } from '../../../shared/services/Alerts';
import ModuloCard from '../components/ModuloCard';
import ModuloForm from '../components/ModuloForm';
import Input from '../../../shared/components/Input';
import Modal from '../../../shared/components/Modal';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import useDebounce from '../../../shared/hooks/useDebounce';

const ModulosPage = () => {
    const [modulos, setModulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [isModalOpen, setModalOpen] = useState(false);
    const [editingModulo, setEditingModulo] = useState(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchModulos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ModulosService.getPaginated(currentPage, 12, debouncedSearchTerm);
            setModulos(data.modulos || []);
            setPagination(data.pagination);
        } catch (err) {
            setError('No se pudieron cargar los modulos.');
            setModulos([]); // Limpiar datos en caso de error
            setPagination(null);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearchTerm]);

    useEffect(() => {
        fetchModulos();
    }, [fetchModulos]);

    const handleNextPage = () => {
        if (pagination && currentPage < pagination.totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // ... create, edit, delete handlers remain similar ...

    const handleCreate = () => {
        setEditingModulo(null);
        setModalOpen(true);
    };

    const handleEdit = (modulo) => {
        setEditingModulo(modulo);
        setModalOpen(true);
    };

    const handleDelete = async (clave) => {
        const confirmed = await Alerts.confirmAction(
            '¿Estás seguro?',
            'Se eliminará el módulo y todos sus permisos asociados. Esta acción no se puede deshacer.'
        );

        if (confirmed.isConfirmed) {
            try {
                await ModulosService.delete(clave);
                Alerts.showSuccess('Eliminado', 'El módulo ha sido eliminado correctamente.');
                // Recargar pagina actual
                fetchModulos();
            } catch (err) {
                console.error('Error al eliminar el módulo:', err);
                Alerts.showError('Error', `No se pudo eliminar: ${err.message}`);
            }
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingModulo(null);
    };

    const handleSave = async (payload) => {
        try {
            if (editingModulo) {
                await ModulosService.update(editingModulo.clave, payload);
                Alerts.showSuccess('Actualizado', 'El módulo y sus permisos han sido actualizados correctamente.');
            } else {
                await ModulosService.create(payload);
                Alerts.showSuccess('Creado', 'El módulo y sus permisos han sido creados correctamente.');
            }
            handleCloseModal();
            fetchModulos();
        } catch (err) {
            console.error('Error al guardar el módulo:', err);
            Alerts.showError('Error', `No se pudo guardar: ${err.message}`);
        }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-100">Gestión de Módulos del Sistema</h1>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Input
                        id="search-modulo"
                        label=""
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reiniciar a página 1 al buscar
                        }}
                    />
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md whitespace-nowrap"
                    >
                        <PlusCircle size={20} />
                        <span>Crear Nuevo</span>
                    </button>
                </div>
            </div>

            {loading && <p className="text-center text-gray-400">Cargando módulos...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {modulos.length > 0 ? (
                            modulos.map(mod => (
                                <ModuloCard
                                    key={mod.clave}
                                    modulo={mod}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-400">
                                No se encontraron módulos.
                            </p>
                        )}
                    </div>

                    {/* Controles de Paginación */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center mt-8">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={20} />
                                Anterior
                            </button>
                            <span className="mx-4 text-gray-300">
                                Página {pagination.currentPage} de {pagination.totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === pagination.totalPages}
                                className="flex items-center gap-2 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Siguiente
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingModulo ? 'Editar Módulo' : 'Crear Nuevo Módulo'}
            >
                <ModuloForm
                    onSave={handleSave}
                    onCancel={handleCloseModal}
                    moduloToEdit={editingModulo}
                />
            </Modal>
        </div>
    );
};

export default ModulosPage;
