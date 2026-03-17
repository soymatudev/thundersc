import React, { useState, useEffect } from 'react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const ClasificacionesForm = ({ onSave, onCancel, clasificacionToEdit }) => {
    const [descri, setDescri] = useState('');
    const [type, setType] = useState('');

    useEffect(() => {
        if (clasificacionToEdit) {
            setDescri(clasificacionToEdit.descri || '');
            setType(clasificacionToEdit.type || '');
        }
    }, [clasificacionToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const clasificacionData = {
            descri,
            type,
        };
        onSave(clasificacionData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                id="descri"
                label="Descripción de la Clasificación"
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

export default ClasificacionesForm;
