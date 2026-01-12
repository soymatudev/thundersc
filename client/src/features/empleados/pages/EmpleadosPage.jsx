import React, { useState, useEffect, useCallback } from 'react';
import { EmpleadosService } from '../services/empleadosService';
import { Alerts } from '../../../shared/services/Alerts';
import EmpleadoCard from '../components/EmpleadoCard';
import Input from '../../../shared/components/Input';
import Modal from '../../../shared/components/Modal';
import EmpleadoForm from '../components/EmpleadoForm';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import useDebounce from '../../../shared/hooks/useDebounce';

const EmpleadosPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchEmpleados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await EmpleadosService.getPaginated(currentPage, 12, debouncedSearchTerm);
      setEmpleados(data.empleados || []);
      setPagination(data.pagination);
    } catch (err) {
      setError('No se pudieron cargar los empleados.');
      setEmpleados([]);
      setPagination(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  const handleCreate = () => {
    setEditingEmpleado(null);
    setModalOpen(true);
  };

  const handleEdit = (empleado) => {
    setEditingEmpleado(empleado);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await Alerts.confirmAction(
      '¿Estás seguro?',
      'Esta acción no se puede deshacer.'
    );

    if (confirmed.isConfirmed) {
      try {
        await EmpleadosService.delete(id);
        Alerts.showSuccess('Eliminado', 'El empleado ha sido eliminado correctamente.');
        fetchEmpleados();
      } catch (err) {
        console.error('Error al eliminar el empleado:', err);
        Alerts.showError('Error', `No se pudo eliminar: ${err.message}`);
      }
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingEmpleado(null);
  };

  const handleSave = async (empleadoData) => {
    try {
      if (editingEmpleado) {
        await EmpleadosService.update(editingEmpleado.id, empleadoData);
        Alerts.showSuccess('Actualizado', 'El empleado ha sido actualizado correctamente.');
      } else {
        await EmpleadosService.create(empleadoData);
        Alerts.showSuccess('Creado', 'El empleado ha sido creado correctamente.');
      }
      handleCloseModal();
      fetchEmpleados();
    } catch (err) {
      console.error('Error al guardar el empleado:', err);
      Alerts.showError('Error', `No se pudo guardar: ${err.message}`);
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-100">Gestión de Empleados</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Input
            id="search-empleado"
            label=""
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
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

      {loading && <p className="text-center text-gray-400">Cargando empleados...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {empleados.length > 0 ? (
              empleados.map(empleado => (
                <EmpleadoCard key={empleado.id} empleado={empleado} onEdit={handleEdit} onDelete={handleDelete} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400">
                No se encontraron empleados que coincidan con la búsqueda.
              </p>
            )}
          </div>

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
        title={editingEmpleado ? 'Editar Empleado' : 'Crear Nuevo Empleado'}
      >
        <EmpleadoForm
          onSave={handleSave}
          onCancel={handleCloseModal}
          empleadoToEdit={editingEmpleado}
        />
      </Modal>
    </div>
  );
};

export default EmpleadosPage;
