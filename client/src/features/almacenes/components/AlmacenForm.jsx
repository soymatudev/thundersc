import React, { useState, useEffect } from 'react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const AlmacenForm = ({ onSave, onCancel, almacenToEdit }) => {
  const [clave, setClave] = useState('');
  const [descri, setNombre] = useState('');
  const [domici, setDireccion] = useState('');
  const [status, setActivo] = useState(true);

  useEffect(() => {
    if (almacenToEdit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNombre(almacenToEdit.descri || '');
      setDireccion(almacenToEdit.direccion || '');
      setActivo(almacenToEdit.status === 1);
    }
  }, [almacenToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const almacenData = {
      descri,
      domici,
      status: status ? true : false,
    };
    if(!almacenToEdit)  almacenData.clave = clave;
    onSave(almacenData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!almacenToEdit && (
        <Input
          id="clave"
          label="Clave del Almacén"
          type="text"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
      )}
      <Input
        id="descri"
        label="Nombre del Almacén"
        type="text"
        value={descri}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <Input
        id="domici"
        label="Dirección"
        type="text"
        value={domici}
        onChange={(e) => setDireccion(e.target.value)}
        required
      />
      <div className="flex items-center">
        <input
          id="status"
          name="status"
          type="checkbox"
          checked={status}
          onChange={(e) => setActivo(e.target.checked)}
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

export default AlmacenForm;
