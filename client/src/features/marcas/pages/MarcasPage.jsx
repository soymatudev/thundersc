import React, { useState, useEffect, useCallback } from 'react';
import { MarcasService } from '../services/marcasService';
import { Alerts } from '../../../shared/services/Alerts';
import Modal from '../../../shared/components/Modal';
import MarcasForm from '../components/MarcasForm';
import { PlusCircle, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import useDebounce from '../../../shared/hooks/useDebounce';
import Input from '../../../shared/components/Input';

const MarcasPage = () => {
  const [marcas, setMarcas] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingMarca, setEditingMarca] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchMarcas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { marcas: data, total, currentPage: fetchedCurrentPage, totalPages: fetchedTotalPages } = await MarcasService.getPaginated(currentPage, 10, debouncedSearchTerm);
      setMarcas(data || []);
      setPagination({ total, totalPages: fetchedTotalPages, currentPage: fetchedCurrentPage });
    } catch (err) {
      setError('No se pudieron cargar las marcas.');
      setMarcas([]);
      setPagination({ total: 0, totalPages: 1, currentPage: 1 });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchMarcas();
  }, [fetchMarcas]);

  const handleCreate = () => {
    setEditingMarca(null);
    setModalOpen(true);
  };

  const handleEdit = (marca) => {
    setEditingMarca(marca);
    setModalOpen(true);
  };

  const handleDelete = async (clave) => {
    const confirmed = await Alerts.confirmAction(
      '¿Estás seguro?',
      'Esta acción no se puede deshacer.'
    );

    if (confirmed.isConfirmed) {
      try {
        await MarcasService.delete(clave); // Assuming a delete method exists
        Alerts.showSuccess('Eliminada', 'La marca ha sido eliminada correctamente.');
        fetchMarcas();
      } catch (err) {
        console.error('Error al eliminar la marca:', err);
        Alerts.showError('Error', `No se pudo eliminar: ${err.message}`);
      }
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingMarca(null);
  };

  const handleSave = async (marcaData) => {
    try {
      if (editingMarca) {
        await MarcasService.update(editingMarca.clave, marcaData);
        Alerts.showSuccess('Actualizada', 'La marca ha sido actualizada correctamente.');
      } else {
        await MarcasService.create(marcaData);
        Alerts.showSuccess('Creada', 'La marca ha sido creada correctamente.');
      }
      handleCloseModal();
      fetchMarcas();
    } catch (err) {
      console.error('Error al guardar la marca:', err);
      Alerts.showError('Error', `No se pudo guardar: ${err.message}`);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Gestión de Marcas</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Input
            id="search-marca"
            label=""
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-800 border-gray-700"
          />
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md whitespace-nowrap"
          >
            <PlusCircle size={20} />
            <span>Crear Nueva</span>
          </button>
        </div>
      </div>

      {loading && <p className="text-center">Cargando marcas...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full leading-normal bg-gray-800">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Clave
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {marcas.length > 0 ? (
                  marcas.map((marca) => (
                    <tr key={marca.clave}>
                      <td className="px-5 py-5 border-b border-gray-700 text-sm">{marca.clave}</td>
                      <td className="px-5 py-5 border-b border-gray-700 text-sm">{marca.descri}</td>
                      <td className="px-5 py-5 border-b border-gray-700 text-sm">{marca.type}</td>
                      <td className="px-5 py-5 border-b border-gray-700 text-sm">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(marca)} className="text-blue-400 hover:text-blue-300">
                            <Edit size={20} />
                          </button>
                          <button onClick={() => handleDelete(marca.clave)} className="text-red-500 hover:text-red-400">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-400">
                      No se encontraron marcas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mt-8">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2 bg-gray-700 py-2 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
                Anterior
              </button>
              <span className="mx-4">
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === pagination.totalPages}
                className="flex items-center gap-2 bg-gray-700 py-2 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50"
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
        title={editingMarca ? 'Editar Marca' : 'Crear Nueva Marca'}
      >
        <MarcasForm
          onSave={handleSave}
          onCancel={handleCloseModal}
          marcaToEdit={editingMarca}
        />
      </Modal>
    </div>
  );
};

export default MarcasPage;
