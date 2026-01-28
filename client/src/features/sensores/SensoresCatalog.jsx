import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { SensoresService } from './services/sensoresService';
import {
    Plus, Edit2, Trash2, X, Save,
    Settings, Database, Thermometer, MapPin,
    Fingerprint, Cpu, Info, Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';

ModuleRegistry.registerModules([AllCommunityModule]);

const SensoresCatalog = () => {
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // Catalogs
    const [unidades, setUnidades] = useState([]);
    const [zonas, setZonas] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sensores, catalogUnidades, catalogZonas] = await Promise.all([
                SensoresService.getAll(),
                SensoresService.getUnidades(),
                SensoresService.getZonas()
            ]);
            setRowData(sensores);
            setUnidades(catalogUnidades);
            setZonas(catalogZonas);
        } catch (error) {
            console.error('Error fetching catalog data:', error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la información del catálogo.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columnDefs = [
        { headerName: 'Clave', field: 'clave', width: 100, sortable: true, filter: true },
        { headerName: 'Alias', field: 'alias', flex: 1.5, sortable: true, filter: true },
        { headerName: 'Nombre Real', field: 'nombre', flex: 1.5, sortable: true, filter: true },
        { headerName: 'Serie', field: 'serie', flex: 1, sortable: true, filter: true },
        { headerName: 'Puerto Socket', field: 'socket_port', flex: 1 },
        {
            headerName: 'Unidad',
            field: 'unidad_desc',
            flex: 1,
            cellRenderer: (params) => (
                <div className="flex items-center gap-2">
                    {params.data.cve_unidad === 'TEM' ? <Thermometer size={14} className="text-blue-400" /> : <Database size={14} className="text-emerald-400" />}
                    <span>{params.value}</span>
                </div>
            )
        },
        {
            headerName: 'Acciones',
            field: 'clave',
            width: 150,
            cellRenderer: (params) => (
                <div className="flex items-center gap-2 h-full">
                    <button
                        onClick={() => handleEdit(params.data)}
                        className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(params.data.clave)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    const gridTheme = themeQuartz.withParams({
        backgroundColor: '#1f2937',
        headerBackgroundColor: '#374151',
        cellTextColor: '#f9fafb',
        headerTextColor: '#f9fafb',
        filterBackgroundColor: '#4b5563',
        textColor: '#f9fafb'
    });

    const handleOpenModal = (sensor = null) => {
        if (sensor) {
            setIsEditing(true);
            setFormData(sensor);
        } else {
            setIsEditing(false);
            setFormData({
                cve_unidad: 'TEM',
                cve_zona: zonas[0]?.clave || 1,
                socket_port: '',
                adc_1: 0,
                adc_3: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await SensoresService.update(formData.clave, formData);
                Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Sensor actualizado correctamente.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
            } else {
                await SensoresService.create(formData);
                Swal.fire({ icon: 'success', title: 'Creado', text: 'Sensor creado correctamente.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
            }
            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error('Error saving sensor:', error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar la información del sensor.' });
        }
    };

    const handleEdit = (data) => handleOpenModal(data);

    const handleDelete = async (clave) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#374151',
            confirmButtonText: 'Sí, eliminar',
            background: '#1f2937',
            color: '#f9fafb'
        });

        if (result.isConfirmed) {
            try {
                await SensoresService.delete(clave);
                fetchData();
                Swal.fire({ icon: 'success', title: 'Eliminado', text: 'El sensor ha sido eliminado.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el sensor.' });
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <Settings className="text-indigo-400" /> Catálogo de Sensores
                    </h2>
                    <p className="text-gray-500 text-sm">Gestión de dispositivos y parámetros de calibración</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                >
                    <Plus size={20} /> Nuevo Sensor
                </button>
            </div>

            <div className="bg-gray-800/40 rounded-3xl border border-gray-700/50 p-2 overflow-hidden shadow-2xl relative h-[650px]">
                {loading && (
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <span className="text-gray-300 font-medium tracking-wide">Cargando catálogo...</span>
                    </div>
                )}
                <div className="ag-theme-quartz-dark w-full h-full">
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        pagination={true}
                        paginationPageSize={15}
                        theme={gridTheme}
                        defaultColDef={{ resizable: true, filter: true }}
                    />
                </div>
            </div>

            {/* Modal de CRUD */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-800 border border-gray-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                {isEditing ? <Edit2 className="text-indigo-400" /> : <Plus className="text-indigo-400" />}
                                {isEditing ? 'Editar Sensor' : 'Registrar Nuevo Sensor'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Informacion Basica */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Fingerprint size={14} /> Alias del Dispositivo
                                        </label>
                                        <input
                                            name="alias" required value={formData.alias || ''} onChange={handleInputChange}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                                            placeholder="Ej: Silo 01 GDL"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Info size={14} /> Nombre Real (ID Hardware)
                                        </label>
                                        <input
                                            name="nombre" required value={formData.nombre || ''} onChange={handleInputChange}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                                            placeholder="Ej: PRO_TEM_01"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Cpu size={14} /> Serie / Firmware
                                        </label>
                                        <input
                                            name="serie" required maxLength={6} value={formData.serie || ''} onChange={handleInputChange}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                                            placeholder="S_0001"
                                        />
                                    </div>
                                </div>

                                {/* Configuración Tecnica */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <MapPin size={14} /> Ubicación / Zona
                                        </label>
                                        <select
                                            name="cve_zona" value={formData.cve_zona || ''} onChange={handleInputChange}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        >
                                            {zonas.map(z => <option key={z.clave} value={z.clave}>{z.nombre}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Settings size={14} /> Tipo de Unidad
                                        </label>
                                        <select
                                            name="cve_unidad" value={formData.cve_unidad || ''} onChange={handleInputChange}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        >
                                            {unidades.map(u => <option key={u.clave} value={u.clave}>{u.descri}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Info size={14} /> Puerto de Socket
                                        </label>
                                        <input
                                            name="socket_port" value={formData.socket_port || ''} onChange={handleInputChange}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                                            placeholder="1085"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Umbrales de Alerta */}
                            <div className="mt-8 p-6 bg-gray-900/30 rounded-3xl border border-gray-700/50 space-y-6">
                                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-gray-700 pb-2">Umbrales de Calibración</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Límite Superior</label>
                                        <input type="number" step="0.01" name="adc_1" value={formData.adc_1 || 0} onChange={handleInputChange}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Límite Inferior</label>
                                        <input type="number" step="0.01" name="adc_3" value={formData.adc_3 || 0} onChange={handleInputChange}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ajuste Offset Low</label>
                                        <input name="adc_2" value={formData.adc_2 || ''} onChange={handleInputChange}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ajuste Offset High</label>
                                        <input name="adc_4" value={formData.adc_4 || ''} onChange={handleInputChange}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Dimensiones para Silo */}
                            {formData.cve_unidad === 'SIL' && (
                                <div className="mt-6 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20 space-y-6">
                                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest border-b border-emerald-500/20 pb-2 flex items-center gap-2">
                                        <Database size={16} /> Parámetros de Capacidad (Silos)
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ancho (m)</label>
                                            <input type="number" step="0.01" name="ancho" value={formData.ancho || 0} onChange={handleInputChange}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Largo (m)</label>
                                            <input type="number" step="0.01" name="largo" value={formData.largo || 0} onChange={handleInputChange}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Alto (m)</label>
                                            <input type="number" step="0.01" name="alto" value={formData.alto || 0} onChange={handleInputChange}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Densidad</label>
                                            <input type="number" step="0.01" name="densidad" value={formData.densidad || 0} onChange={handleInputChange}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Materia Prim.</label>
                                            <input name="materia" value={formData.materia || ''} onChange={handleInputChange}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
                                                placeholder="Ej: Maíz" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-10 flex items-center justify-end gap-4">
                                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
                                    Cancelar
                                </button>
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95">
                                    <Save size={20} /> {isEditing ? 'Guardar Cambios' : 'Registrar Sensor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SensoresCatalog;
