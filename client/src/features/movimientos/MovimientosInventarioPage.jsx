import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    ArrowRightLeft,
    User,
    Package,
    Wrench,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Info,
    Trash2
} from 'lucide-react';
import { MovimientosService } from './services/movimientosService';
import { deleteEquipo } from '../equipos/services/equipos.service';
import { EmpleadosService } from '../empleados/services/empleadosService';
import { AlmacenesService } from '../almacenes/services/almacenesService';
import Swal from 'sweetalert2';

const MovimientosInventarioPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [equipo, setEquipo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [tipoMovimiento, setTipoMovimiento] = useState('asignacion'); // asignacion, almacen, reparacion
    const [destinos, setDestinos] = useState([]);
    const [selectedDestino, setSelectedDestino] = useState('');

    const searchInputRef = useRef(null);

    useEffect(() => {
        // Autofocus en el buscador
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }

        // Cargar destinos iniciales (empleados por defecto)
        fetchDestinos('asignacion');
    }, []);

    const fetchDestinos = async (type) => {
        try {
            if (type === 'asignacion') {
                const data = await EmpleadosService.getAll({ status: true });
                setDestinos(data);
            } else if (type === 'almacen') {
                const data = await AlmacenesService.getAll();
                setDestinos(data);
            } else {
                setDestinos([]);
            }
        } catch (error) {
            console.error('Error fetching destinos:', error);
        }
    };

    const formatCode = (code) => {
        // ACC260313032 -> ACC-20260313-032
        const firstPart = code.slice(0, 3);
        const secondPart = `20${code.slice(3, 9)}`;
        const tirdPart = code.slice(9);
        return `${firstPart}-${secondPart}-${tirdPart}`;
    }

    const handleSearch = async (e) => {
        let code = searchTerm.trim();
        if (e) e.preventDefault();
        if (!searchTerm.trim()) return;
        if(!code.includes('-')) {
            code = formatCode(searchTerm.trim());
        }

        setLoading(true);
        try {
            const data = await MovimientosService.buscarEquipo(code);
            setEquipo(data);
        } catch (error) {
            setEquipo(null);
            Swal.fire({
                icon: 'error',
                title: 'No encontrado',
                text: `El equipo con código ${searchTerm} no existe en el sistema.`,
                background: '#1f2937',
                color: '#f3f4f6',
                confirmButtonColor: '#4f46e5'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTipoChange = (e) => {
        const type = e.target.value;
        setTipoMovimiento(type);
        setSelectedDestino('');
        fetchDestinos(type);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (tipoMovimiento === 'eliminacion') {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción eliminará el equipo permanentemente. No se puede deshacer.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                background: '#1f2937',
                color: '#f3f4f6'
            });

            if (result.isConfirmed) {
                setSaving(true);
                try {
                    await deleteEquipo(equipo.clave);
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'El equipo ha sido eliminado correctamente.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                        background: '#1f2937',
                        color: '#f3f4f6'
                    });
                    // Resetear
                    setEquipo(null);
                    setSearchTerm('');
                    setSelectedDestino('');
                    setTipoMovimiento('asignacion'); // Reset to default safer option
                    searchInputRef.current.focus();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al eliminar el equipo.',
                        background: '#1f2937',
                        color: '#f3f4f6'
                    });
                } finally {
                    setSaving(false);
                }
            }
            return;
        }

        if (!equipo || (!selectedDestino && tipoMovimiento !== 'reparacion')) return;

        setSaving(true);
        try {
            const movementData = {
                cve_eqsis: equipo.clave,
                new_status: tipoMovimiento === 'asignacion' ? 'U' : (tipoMovimiento === 'reparacion' ? 'R' : 'A')
            };

            if (tipoMovimiento === 'asignacion') {
                const emp = destinos.find(d => d.id === parseInt(selectedDestino));
                movementData.cve_emple = emp.id;
                movementData.cve_depar = emp.cve_depar;
                movementData.cve_alm = '999'; // Almacén genérico o el que tenga el equipo
            } else if (tipoMovimiento === 'almacen') {
                movementData.cve_alm = selectedDestino; // El ID del almacén es String(3)
                movementData.cve_emple = null;
                movementData.cve_depar = null;
            } else if (tipoMovimiento === 'reparacion') {
                movementData.cve_alm = 'REP'; // Almacén de reparaciones
                movementData.cve_emple = null;
                movementData.cve_depar = null;
            }

            await MovimientosService.crearMovimiento(movementData);

            Swal.fire({
                icon: 'success',
                title: 'Movimiento Registrado',
                text: 'El equipo ha sido trasladado correctamente.',
                background: '#1f2937',
                color: '#f3f4f6',
                timer: 2000,
                showConfirmButton: false
            });

            // Resetear
            setEquipo(null);
            setSearchTerm('');
            setSelectedDestino('');
            searchInputRef.current.focus();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al procesar el movimiento.',
                background: '#1f2937',
                color: '#f3f4f6'
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-purple-500/10 rounded-xl">
                            <ArrowRightLeft className="text-purple-400" size={24} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">Movimientos de Inventario</h1>
                    </div>
                    <p className="text-gray-400 text-sm italic ml-11">Traslados rápidos entre empleados y almacenes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Search and Preview Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative group">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Escanea o escribe Código de Inventario (cod_inv)..."
                            className="w-full pl-14 pr-6 py-5 bg-gray-800 border-2 border-gray-700 rounded-3xl text-white text-xl font-mono focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-2xl placeholder:text-gray-600"
                        />
                        <div className="absolute left-5 top-1/2 -translate-y-1/2">
                            {loading ? (
                                <Loader2 className="animate-spin text-purple-400" size={28} />
                            ) : (
                                <Search className="text-gray-500 group-focus-within:text-purple-400 transition-colors" size={28} />
                            )}
                        </div>
                        <button
                            type="submit"
                            className="absolute right-4 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95"
                        >
                            Buscar
                        </button>
                    </form>

                    {/* Equipo Info Card */}
                    {equipo ? (
                        <div className="bg-gray-800/60 backdrop-blur-md rounded-3xl border border-gray-700 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 duration-500">
                            <div className="p-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
                            <div className="p-8">
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="p-6 bg-gray-900/80 rounded-3xl border border-gray-700/50 flex flex-col items-center gap-4 min-w-[200px]">
                                        <Package size={64} className="text-purple-400" />
                                        <div className="text-center">
                                            <span className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Estatus Actual</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${equipo.status === 'A' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                equipo.status === 'U' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {equipo.status === 'A' ? 'DISPONIBLE' : equipo.status === 'U' ? 'EN USO' : 'REPARACIÓN'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-6">
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                            <div>
                                                <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">Código Inv.</span>
                                                <p className="text-2xl font-mono font-black text-white">{equipo.cod_inv}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">Serie</span>
                                                <p className="text-xl font-mono text-gray-200">{equipo.serie}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">Marca / Modelo</span>
                                                <p className="text-xl text-white font-semibold">{equipo.marca} - {equipo.modelo}</p>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-700 flex items-center gap-4">
                                            <div className="p-3 bg-gray-900 rounded-2xl">
                                                <User className="text-indigo-400" size={24} />
                                            </div>
                                            <div>
                                                <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">Responsable Actual</span>
                                                <p className="text-lg text-indigo-300 font-bold">{equipo.ubicacion_actual.empleado}</p>
                                                <p className="text-sm text-gray-400 italic">{equipo.ubicacion_actual.departamento}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[300px] flex flex-col items-center justify-center text-center p-8 bg-gray-800/20 border-2 border-dashed border-gray-700 rounded-3xl opacity-40">
                            <Package size={64} className="mb-4 text-gray-600" />
                            <p className="text-lg font-medium">Escanea un equipo para iniciar el traslado</p>
                        </div>
                    )}
                </div>

                {/* Movement Form Column */}
                <div className="lg:col-span-1">
                    <div className={`bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl transition-all duration-500 ${!equipo ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                        <div className="p-6 border-b border-gray-700 flex items-center gap-3 bg-gray-800/50 rounded-t-3xl">
                            <ArrowRightLeft size={20} className="text-purple-400" />
                            <h2 className="text-lg font-bold text-gray-100">Nueva Ubicación</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <div className="space-y-4">
                                <label className="block text-xs uppercase tracking-widest font-bold text-gray-500">Tipo de Movimiento</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { id: 'asignacion', label: 'Asignar a Empleado', icon: User, color: 'text-blue-400' },
                                        { id: 'almacen', label: 'Mover a Almacén', icon: Package, color: 'text-green-400' },
                                        { id: 'reparacion', label: 'Enviar a Reparación', icon: Wrench, color: 'text-red-400' },
                                        { id: 'eliminacion', label: 'Eliminar Equipo (Error de Entrada)', icon: Trash2, color: 'text-red-500', isDanger: true }
                                    ].map(type => (
                                        <label key={type.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${tipoMovimiento === type.id
                                            ? (type.isDanger ? 'border-red-900/50 bg-red-500/10' : 'border-purple-500 bg-purple-500/10')
                                            : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/30'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="tipo"
                                                value={type.id}
                                                checked={tipoMovimiento === type.id}
                                                onChange={handleTipoChange}
                                                className="hidden"
                                            />
                                            <type.icon className={type.color} size={24} />
                                            <span className={`font-semibold ${type.isDanger ? 'text-red-400' : 'text-gray-200'}`}>{type.label}</span>
                                            {tipoMovimiento === type.id && <CheckCircle2 className={type.isDanger ? "ml-auto text-red-500" : "ml-auto text-purple-500"} size={20} />}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {tipoMovimiento !== 'reparacion' && tipoMovimiento !== 'eliminacion' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-xs uppercase tracking-widest font-bold text-gray-500">
                                        {tipoMovimiento === 'asignacion' ? 'Seleccionar Empleado' : 'Seleccionar Almacén'}
                                    </label>
                                    <select
                                        value={selectedDestino}
                                        onChange={(e) => setSelectedDestino(e.target.value)}
                                        required
                                        className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="">Seleccione destino...</option>
                                        {destinos.map(d => (
                                            <option key={d.id || d.clave} value={d.id || d.clave}>
                                                {d.descri} {d.coloni ? `(${d.coloni})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {tipoMovimiento === 'reparacion' && (
                                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-3 text-red-300 text-sm animate-in fade-in duration-300">
                                    <Info size={20} className="shrink-0" />
                                    <p>El equipo se marcará en estatus **REPARACIÓN** y se enviará internamente al centro de servicio.</p>
                                </div>
                            )}

                            {tipoMovimiento === 'eliminacion' && (
                                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-2xl flex gap-3 text-red-200 text-sm animate-in fade-in duration-300">
                                    <AlertCircle size={20} className="shrink-0 text-red-400" />
                                    <p>El equipo se eliminará permanentemente de la base de datos. Use esta opción solo para corregir errores de captura inicial.</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={saving || !equipo || (!selectedDestino && tipoMovimiento !== 'reparacion' && tipoMovimiento !== 'eliminacion')}
                                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 ${saving || !equipo || (!selectedDestino && tipoMovimiento !== 'reparacion' && tipoMovimiento !== 'eliminacion')
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                                    : tipoMovimiento === 'eliminacion' ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-500/20' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/20'
                                    }`}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="animate-spin" size={22} />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        {tipoMovimiento === 'eliminacion' ? (
                                            <>
                                                <Trash2 size={22} />
                                                Confirmar Eliminación
                                            </>
                                        ) : (
                                            <>
                                                <ArrowRightLeft size={22} />
                                                Confirmar Traslado
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovimientosInventarioPage;
