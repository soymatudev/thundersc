import React, { useState, useEffect, useCallback } from 'react';
import { UsuariosService } from '../services/usuariosService';
import { Alerts } from '../../../shared/services/Alerts';
import UsuarioCard from '../components/UsuarioCard';
import UsuarioForm from '../components/UsuarioForm';
import Input from '../../../shared/components/Input';
import Modal from '../../../shared/components/Modal';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import useDebounce from '../../../shared/hooks/useDebounce';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // As noted in the service, this endpoint might not exist yet.
      const data = await UsuariosService.getPaginated(currentPage, 12, debouncedSearchTerm);
      setUsuarios(data.usuarios || []);
      setPagination(data.pagination);
    } catch (err) {
      setError('No se pudieron cargar los usuarios. Es posible que el servicio no esté disponible en el backend.');
      setUsuarios([]);
      setPagination(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleCreate = () => {
    setEditingUsuario(null);
    setModalOpen(true);
  };

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario);
    setModalOpen(true);
  };

  const handleDelete = async (clave) => {
    const confirmed = await Alerts.confirmAction('¿Estás seguro?', 'Esta acción no se puede deshacer.');
    if (confirmed.isConfirmed) {
      try {
        // As noted in the service, this endpoint might not exist yet.
        await UsuariosService.delete(clave);
        Alerts.showSuccess('Eliminado', 'El usuario ha sido eliminado correctamente.');
        fetchUsuarios();
      } catch (err) {
        console.error('Error al eliminar el usuario:', err);
        Alerts.showError('Error', `No se pudo eliminar: ${err.message}. Es posible que el servicio no esté disponible.`);
      }
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUsuario(null);
  };

  const handleSave = async (payload) => {
    try {
      if (editingUsuario) {
        await UsuariosService.update(editingUsuario.clave, payload);
        Alerts.showSuccess('Actualizado', 'El usuario ha sido actualizado correctamente.');
      } else {
        await UsuariosService.create(payload);
        Alerts.showSuccess('Creado', 'El usuario ha sido creado correctamente.');
      }
      handleCloseModal();
      fetchUsuarios();
    } catch (err) {
      console.error('Error al guardar el usuario:', err);
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
        <h1 className="text-2xl font-bold text-gray-100">Gestión de Usuarios</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Input
            id="search-usuario"
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
            <span>Crear Usuario</span>
          </button>
        </div>
      </div>

      {loading && <p className="text-center text-gray-400">Cargando usuarios...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {usuarios.length > 0 ? (
              usuarios.map(usuario => (
                <UsuarioCard key={usuario.clave} usuario={usuario} onEdit={handleEdit} onDelete={handleDelete} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400">
                No se encontraron usuarios.
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
        title={editingUsuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      >
        <UsuarioForm
          onSave={handleSave}
          onCancel={handleCloseModal}
          usuarioToEdit={editingUsuario}
        />
      </Modal>
    </div>
  );
};

export default UsuariosPage;
