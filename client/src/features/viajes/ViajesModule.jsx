import React, { useState } from 'react';
import ViajesPage from './pages/ViajesPage';
import ViajeDetailPage from './pages/ViajeDetailPage';

const ViajesModule = () => {
    const [view, setView] = useState({ type: 'table', id: null });

    const handleShowDetail = (id) => {
        setView({ type: 'detail', id });
    };

    const handleShowTable = () => {
        setView({ type: 'table', id: null });
    };

    return (
        <div className="h-full">
            {view.type === 'table' ? (
                <ViajesPage onShowDetail={handleShowDetail} />
            ) : (
                <ViajeDetailPage id={view.id} onBack={handleShowTable} />
            )}
        </div>
    );
};

export default ViajesModule;
