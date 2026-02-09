import React, { useState, useEffect, useMemo } from 'react';
import { MarcasService } from '../../marcas/services/marcasService';
import { ClasificacionesService } from '../../clasificaciones/services/clasificacionesService';
import { EmpleadosService } from '../../empleados/services/empleadosService';
import { DepartamentosService } from '../../departamentos/services/departamentosService';
import { getEquipoBySerie, createMassiveEquipos, getFolio } from '../services/equipos.service';
import { Save, AlertCircle, CheckCircle2, ListFilter, Hash, UserCheck } from 'lucide-react';
import Input from '../../../shared/components/Input';
import { useAuth } from '../../../shared/hooks/useAuth';

const EntradaMasivaEquipos = () => {
    const { user } = useAuth();
    const [header, setHeader] = useState({
        cve_marca: '',
        cve_clasif: '',
        modelo: '',
        cve_recep: '',
        cve_depar: '8' // Sistemas por defecto
    });
    const [entries, setEntries] = useState([{ serie: '', cantidad: 1, status: 'new' }]);
    const [marcas, setMarcas] = useState([]);
    const [clasificaciones, setClasificaciones] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [baseFolio, setBaseFolio] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchMarcas = async () => {
            try {
                const response = await MarcasService.getAll();
                setMarcas(response);
            } catch (error) {
                setError('Error al cargar las marcas');
            }
        };

        const fetchClasificaciones = async () => {
            try {
                const response = await ClasificacionesService.getAll();
                setClasificaciones(response);
            } catch (error) {
                setError('Error al cargar las clasificaciones');
            }
        };

        const fetchEmpleadosSistemas = async () => {
            try {
                // Filtrar por departamento de sistemas para el selector de recepción
                const response = await EmpleadosService.getAll({ depar: 'SISTEMAS', status: true });
                setEmpleados(response);
            } catch (error) {
                setError('Error al cargar los empleados de sistemas');
            }
        };

        const fetchDepartamentos = async () => {
            try {
                const response = await DepartamentosService.getAll();
                setDepartamentos(response);
            } catch (error) {
                setError('Error al cargar los departamentos');
            }
        };

        fetchMarcas();
        fetchClasificaciones();
        fetchEmpleadosSistemas();
        fetchDepartamentos();
    }, []);

    // Efecto para obtener el folio base actual al cambiar la clasificación
    useEffect(() => {
        if (header.cve_clasif) {
            const fetchFolio = async () => {
                try {
                    const response = await getFolio(header.cve_clasif);
                    setBaseFolio(response.ultimo_folio || 0);
                } catch (error) {
                    console.error('Error fetching folio:', error);
                    setBaseFolio(0);
                }
            };
            fetchFolio();
        } else {
            setBaseFolio(0);
        }
    }, [header.cve_clasif]);

    const handleHeaderChange = (e) => {
        setHeader({
            ...header,
            [e.target.name]: e.target.value
        });
    };

    const handleEntryChange = (index, field, value) => {
        const newEntries = [...entries];
        newEntries[index][field] = value;
        newEntries[index].status = 'new';
        setEntries(newEntries);
    };

    const handleEntryValidation = async (index) => {
        const entry = entries[index];
        if (!entry.serie) return;

        try {
            await getEquipoBySerie(entry.serie);
            const newEntries = [...entries];
            newEntries[index].status = 'exists';
            setEntries(newEntries);
        } catch (error) {
            const newEntries = [...entries];
            newEntries[index].status = 'valid';
            setEntries(newEntries);
            if (index === entries.length - 1) {
                setEntries([...entries, { serie: '', cantidad: 1, status: 'new' }]);
            }
        }
    };

    const loadSummary = useMemo(() => {
        const clasifObj = clasificaciones.find(c => c.clave.toString() === header.cve_clasif);
        const prefix = clasifObj?.descri?.trim().substring(0, 3).toUpperCase() || 'EQU';
        const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

        const previewList = [];
        let virtualFolio = baseFolio;
        entries.forEach(entry => {
            if (entry.serie.trim() !== '') {
                const cantidad = parseInt(entry.cantidad) || 1;
                for (let i = 0; i < cantidad; i++) {
                    virtualFolio++;
                    const folioPad = virtualFolio.toString().padStart(3, '0');
                    previewList.push(`${prefix}-${todayStr}-${folioPad}`);
                }
            }
        });
        return previewList;
    }, [header, entries, clasificaciones, baseFolio]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validación flexible: al menos una serie con cantidad >= 1
        const validEntries = entries.filter(s => s.serie.trim() !== '' && (parseInt(s.cantidad) || 0) >= 1);

        if (validEntries.length === 0) {
            setError('Ingresa al menos una serie con cantidad válida.');
            return;
        }

        const data = {
            ...header,
            entries: validEntries.map(s => ({ serie: s.serie, cantidad: parseInt(s.cantidad) })),
            cve_usu: user?.clave,
            cve_recep: header.cve_recep,
            cve_depar: header.cve_depar
        };

        try {
            await createMassiveEquipos(data);
            setSuccess('Equipos guardados exitosamente. Los folios han sido reservados.');

            // Limpieza Total
            setHeader({ cve_marca: '', cve_clasif: '', modelo: '', cve_recep: '', cve_depar: '8' });
            setEntries([{ serie: '', cantidad: 1, status: 'new' }]);
            setBaseFolio(0); // El efecto de cve_clasif se encargará de refrescar si el usuario vuelve a elegir

        } catch (error) {
            setError('Error al guardar los equipos. Verifica la conexión con el servidor.');
        }
    };

    const inputStyles = "appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out text-white";

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-100">Gestión de Entrada Masiva de Equipos</h1>
                    <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-medium">Operador:</span>
                        <span className="text-sm text-indigo-400 font-bold">{user?.descri || 'SESIÓN ACTIVA'}</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                        <CheckCircle2 size={20} />
                        <span>{success}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Header Row */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700/50">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Marca</label>
                                    <select
                                        name="cve_marca"
                                        value={header.cve_marca}
                                        onChange={handleHeaderChange}
                                        className={inputStyles}
                                        required
                                    >
                                        <option value="">Seleccione una marca</option>
                                        {marcas.map(marca => (
                                            <option key={marca.clave} value={marca.clave}>{marca.descri}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Clasificación</label>
                                    <select
                                        name="cve_clasif"
                                        value={header.cve_clasif}
                                        onChange={handleHeaderChange}
                                        className={inputStyles}
                                        required
                                    >
                                        <option value="">Seleccione una clasificación</option>
                                        {clasificaciones.map(clasif => (
                                            <option key={clasif.clave} value={clasif.clave}>{clasif.descri}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                                        <UserCheck size={14} className="text-indigo-400" />
                                        Receptor
                                    </label>
                                    <select
                                        name="cve_recep"
                                        value={header.cve_recep}
                                        onChange={handleHeaderChange}
                                        className={inputStyles}
                                        required
                                    >
                                        <option value="">¿Quién recibe?</option>
                                        {empleados.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.descri}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Área/Departamento</label>
                                    <select
                                        name="cve_depar"
                                        value={header.cve_depar}
                                        onChange={handleHeaderChange}
                                        className={inputStyles}
                                        required
                                    >
                                        <option value="">Seleccione área</option>
                                        {departamentos.map(dep => (
                                            <option key={dep.clave} value={dep.clave}>{dep.descri}</option>
                                        ))}
                                    </select>
                                </div>
                                <Input
                                    id="modelo"
                                    name="modelo"
                                    label="Modelo"
                                    type="text"
                                    value={header.modelo}
                                    onChange={handleHeaderChange}
                                    required
                                    placeholder="Ingrese el modelo..."
                                />
                            </div>

                            {/* Entries Table Container */}
                            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700/50">
                                <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-100 italic">Captura de Ítems</h2>
                                    <span className="text-xs text-gray-400 bg-gray-900/50 px-2 py-1 rounded">Series únicas o por lote</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full leading-normal">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 border-b border-gray-700 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    Serie / Identificador
                                                </th>
                                                <th className="px-6 py-3 border-b border-gray-700 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">
                                                    Cantidad
                                                </th>
                                                <th className="px-6 py-3 border-b border-gray-700 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    Estatus
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entries.map((entry, index) => (
                                                <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                                                    <td className="px-6 py-4 border-b border-gray-700">
                                                        <input
                                                            type="text"
                                                            value={entry.serie}
                                                            onChange={(e) => handleEntryChange(index, 'serie', e.target.value)}
                                                            onBlur={() => handleEntryValidation(index)}
                                                            className={`w-full px-3 py-2 bg-gray-900/50 border rounded-lg focus:outline-none transition-all duration-200 ${entry.status === 'exists'
                                                                ? 'border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30'
                                                                : 'border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50'
                                                                } text-white`}
                                                            placeholder="Escanear o escribir..."
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 border-b border-gray-700">
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={entry.cantidad}
                                                                onChange={(e) => handleEntryChange(index, 'cantidad', e.target.value)}
                                                                className="w-full pl-8 pr-2 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
                                                            />
                                                            <Hash size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 border-b border-gray-700">
                                                        {entry.status === 'new' && (
                                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                                                                Esperando...
                                                            </span>
                                                        )}
                                                        {entry.status === 'valid' && (
                                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                                                Serie Nueva
                                                            </span>
                                                        )}
                                                        {entry.status === 'exists' && (
                                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                                Serie Registrada
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loadSummary.length === 0 || !header.cve_recep}
                                    className={`flex items-center gap-2 py-2.5 px-8 rounded-lg transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 active:transform active:scale-95 ${loadSummary.length === 0 || !header.cve_recep
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/20'
                                        }`}
                                >
                                    <Save size={20} />
                                    <span className="font-semibold text-lg">Guardar Recepción</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 flex flex-col h-full max-h-[calc(100vh-12rem)] sticky top-6">
                            <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex items-center gap-3">
                                <ListFilter size={20} className="text-indigo-400" />
                                <h2 className="text-lg font-bold text-gray-100">Resumen de Carga</h2>
                            </div>

                            <div className="p-4 bg-indigo-500/5 border-b border-gray-700">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Total a generar:</span>
                                    <span className="text-indigo-400 font-bold text-lg">{loadSummary.length} registros</span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {loadSummary.length > 0 ? (
                                    loadSummary.map((id, idx) => (
                                        <div key={idx} className="bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-700/30 text-xs font-mono text-gray-300 flex items-center gap-2">
                                            <span className="text-gray-600 w-4 text-right">{idx + 1}.</span>
                                            {id}
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                                        <ListFilter size={48} className="mb-4 text-gray-600" />
                                        <p className="text-sm">Ingresa series y marcas para ver la previsualización de inventario.</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center">Patrón: SIGLAS-YYYYMMDD-CONSECUTIVO</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntradaMasivaEquipos;
