import React, { useState, useEffect } from 'react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const MarcasForm = ({ onSave, onCancel, marcaToEdit }) => {
  const [descri, setDescri] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (marcaToEdit) {
      setDescri(marcaToEdit.descri || '');
      setType(marcaToEdit.type || '');
    }
  }, [marcaToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const marcaData = {
      descri,
      type,
    };
    onSave(marcaData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="descri"
        label="Descripción de la Marca"
        type="text"
        value={descri}
        onChange={(e) => setDescri(e.target.value)}
        required
      />
      <Input
        id="type"
        label="Tipo"
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      />
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

export default MarcasForm;
