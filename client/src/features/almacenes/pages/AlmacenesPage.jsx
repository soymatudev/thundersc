import React, { useState, useEffect, useCallback } from 'react';
import { AlmacenesService } from '../services/almacenesService';
import AlmacenCard from '../components/AlmacenCard';
import Input from '../../../shared/components/Input';
import Modal from '../../../shared/components/Modal';
import AlmacenForm from '../components/AlmacenForm';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import useDebounce from '../../../shared/hooks/useDebounce';

const AlmacenesPage = () => {
  const [almacenes, setAlmacenes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingAlmacen, setEditingAlmacen] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchAlmacenes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AlmacenesService.getPaginated(currentPage, 12, debouncedSearchTerm);
      setAlmacenes(data.almacenes || []);
      setPagination(data.pagination);
    } catch (err) {
      setError('No se pudieron cargar los almacenes.');
      setAlmacenes([]); // Limpiar datos en caso de error
      setPagination(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchAlmacenes();
  }, [fetchAlmacenes]);

  // --- Handlers para el CRUD ---

  const handleCreate = () => {
    setEditingAlmacen(null);
    setModalOpen(true);
  };

  const handleEdit = (almacen) => {
    setEditingAlmacen(almacen);
    setModalOpen(true);
  };

  const handleDelete = async (clave) => {
    await AlmacenesService.delete(clave);
    fetchAlmacenes();
  }

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAlmacen(null);
  };

  const handleSave = async (almacenData) => {
    try {
      if (editingAlmacen) {
        await AlmacenesService.update(editingAlmacen.clave, almacenData);
      } else {
        await AlmacenesService.create(almacenData);
      }
      handleCloseModal();
      fetchAlmacenes();
    } catch (err) {
      console.error('Error al guardar el almacén:', err);
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
        <h1 className="text-2xl font-bold text-gray-100">Gestión de Almacenes</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Input
            id="search-almacen"
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

      {/* Contenido */}
      {loading && <p className="text-center text-gray-400">Cargando almacenes...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {almacenes.length > 0 ? (
              almacenes.map(almacen => (
                <AlmacenCard key={almacen.clave} almacen={almacen} onEdit={handleEdit} onDelete={handleDelete} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400">
                No se encontraron almacenes que coincidan con la búsqueda.
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

      {/* Modal para Crear/Editar */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingAlmacen ? 'Editar Almacén' : 'Crear Nuevo Almacén'}
      >
        <AlmacenForm 
          onSave={handleSave}
          onCancel={handleCloseModal}
          almacenToEdit={editingAlmacen}
        />
      </Modal>
    </div>
  );
};

export default AlmacenesPage;