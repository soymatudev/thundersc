import React, { useState, useEffect } from 'react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const EmpleadoForm = ({ onSave, onCancel, empleadoToEdit }) => {
  const [clave, setClave] = useState('');
  const [descri, setDescri] = useState('');
  const [cve_zon, setCveZon] = useState('');
  const [status, setStatus] = useState(true);

  useEffect(() => {
    if (empleadoToEdit) {
      setClave(empleadoToEdit.clave || '');
      setDescri(empleadoToEdit.descri || '');
      setCveZon(empleadoToEdit.cve_zon || '');
      setStatus(empleadoToEdit.status);
    }
  }, [empleadoToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const empleadoData = {
      clave,
      descri,
      cve_zon,
      status,
    };
    onSave(empleadoData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="clave"
        label="Clave del Empleado"
        type="text"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
        required
        disabled={!!empleadoToEdit}
      />
      <Input
        id="descri"
        label="Nombre del Empleado"
        type="text"
        value={descri}
        onChange={(e) => setDescri(e.target.value)}
        required
      />
      <Input
        id="cve_zon"
        label="Zona"
        type="text"
        value={cve_zon}
        onChange={(e) => setCveZon(e.target.value)}
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
          Activo
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

export default EmpleadoForm;
