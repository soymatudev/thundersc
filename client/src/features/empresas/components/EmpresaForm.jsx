import React, { useState, useEffect } from 'react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const EmpresaForm = ({ onSave, onCancel, empresaToEdit }) => {
  const [clave, setClave] = useState('');
  const [nombre, setNombre] = useState('');
  const [status, setStatus] = useState(true);

  useEffect(() => {
    if (empresaToEdit) {
      setClave(empresaToEdit.clave || '');
      setNombre(empresaToEdit.nombre || '');
      setStatus(empresaToEdit.status);
    }
  }, [empresaToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const empresaData = {
      clave,
      nombre,
      status,
    };
    onSave(empresaData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="clave"
        label="Clave de la Empresa"
        type="text"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
        required
        disabled={!!empresaToEdit}
      />
      <Input
        id="nombre"
        label="Nombre de la Empresa"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <div className="flex items-center">
        <input
          id="status"
          name="status"
          type="checkbox"
          checked={status}
          onChange={(e) => setStatus(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
        />
        <label htmlFor="status" className="ml-3 block text-sm font-medium text-gray-300">
          Activa
        </label>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
};

export default EmpresaForm;
