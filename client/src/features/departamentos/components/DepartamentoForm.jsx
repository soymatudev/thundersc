import React, { useState, useEffect } from 'react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const DepartamentoForm = ({ onSave, onCancel, departamentoToEdit }) => {
    const [descri, setDescri] = useState('');

    useEffect(() => {
        if (departamentoToEdit) {
            setDescri(departamentoToEdit.descri || '');
        }
    }, [departamentoToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const departamentoData = {
            descri,
        };
        onSave(departamentoData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                id="descri"
                label="Nombre del Departamento"
                type="text"
                value={descri}
                onChange={(e) => setDescri(e.target.value)}
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

export default DepartamentoForm;
