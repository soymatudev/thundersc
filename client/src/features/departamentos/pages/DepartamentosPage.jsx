import React, { useState, useEffect, useCallback } from 'react';
import { DepartamentosService } from '../services/departamentosService';
import { Alerts } from '../../../shared/services/Alerts';
import DepartamentoCard from '../components/DepartamentoCard';
import Input from '../../../shared/components/Input';
import Modal from '../../../shared/components/Modal';
import DepartamentoForm from '../components/DepartamentoForm';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import useDebounce from '../../../shared/hooks/useDebounce';

const DepartamentosPage = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setModalOpen] = useState(false);
    const [editingDepartamento, setEditingDepartamento] = useState(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const fetchDepartamentos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Usamos el nuevo servicio paginado
            // Asumimos pageSize de 12 para que cuadre bien en grid
            const data = await DepartamentosService.getPaginated(currentPage, 12, debouncedSearchTerm);

            setDepartamentos(data.departamentos || []);
            setPagination(data.pagination);

        } catch (err) {
            // Si es 404 es que no hay resultados, no es necesariamente un error grave
            // Pero el servicio puede lanzar error si falla la conexión
            setError('No se pudieron cargar los departamentos.');
            setDepartamentos([]);
            setPagination(null);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearchTerm]);

    useEffect(() => {
        fetchDepartamentos();
    }, [fetchDepartamentos]);

    // --- Handlers para el CRUD ---

    const handleCreate = () => {
        setEditingDepartamento(null);
        setModalOpen(true);
    };

    const handleEdit = (departamento) => {
        setEditingDepartamento(departamento);
        setModalOpen(true);
    };

    const handleDelete = async (clave) => {
        const confirmed = await Alerts.confirmAction(
            '¿Estás seguro?',
            'Esta acción no se puede deshacer.'
        );

        if (confirmed.isConfirmed) {
            try {
                await DepartamentosService.delete(clave);
                Alerts.showSuccess('Eliminado', 'El departamento ha sido eliminado correctamente.');
                fetchDepartamentos();
            } catch (err) {
                console.error('Error al eliminar el departamento:', err);
                Alerts.showError('Error', `No se pudo eliminar: ${err.message}`);
            }
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingDepartamento(null);
    };

    const handleSave = async (departamentoData) => {
        try {
            if (editingDepartamento) {
                await DepartamentosService.update(editingDepartamento.clave, departamentoData);
                Alerts.showSuccess('Actualizado', 'El departamento ha sido actualizado correctamente.');
            } else {
                await DepartamentosService.create(departamentoData);
                Alerts.showSuccess('Creado', 'El departamento ha sido creado correctamente.');
            }
            handleCloseModal();
            fetchDepartamentos();
        } catch (err) {
            console.error('Error al guardar el departamento:', err);
            Alerts.showError('Error', `No se pudo guardar: ${err.message}`);
        }
    };

    // --- Handlers para Paginación ---
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

    return (
        <div className="p-6">
            {/* Header del Módulo */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-100">Gestión de Departamentos</h1>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Input
                        id="search-departamento"
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

            {/* Contenido */}
            {loading && <p className="text-center text-gray-400">Cargando departamentos...</p>}
            {error && departamentos.length === 0 && <p className="text-center text-red-500">{error}</p>}

            {!loading && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {departamentos.length > 0 ? (
                            departamentos.map(dep => (
                                <DepartamentoCard
                                    key={dep.clave}
                                    departamento={dep}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            !error && (
                                <p className="col-span-full text-center text-gray-400">
                                    No se encontraron departamentos.
                                </p>
                            )
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

            {/* Modal para Crear/Editar */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingDepartamento ? 'Editar Departamento' : 'Crear Nuevo Departamento'}
            >
                <DepartamentoForm
                    onSave={handleSave}
                    onCancel={handleCloseModal}
                    departamentoToEdit={editingDepartamento}
                />
            </Modal>
        </div>
    );
};

export default DepartamentosPage;
