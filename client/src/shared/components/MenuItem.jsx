import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Construction } from 'lucide-react';
import { useTabs } from '../context/TabsContext';

// Importa las páginas de los módulos aquí
import AlmacenesPage from '../../features/almacenes/pages/AlmacenesPage';
import DepartamentosPage from '../../features/departamentos/pages/DepartamentosPage';
import ModulosPage from '../../features/modulos/pages/ModulosPage';
import UsuariosPage from '../../features/usuarios/pages/UsuariosPage';
import EmpleadosPage from '../../features/empleados/pages/EmpleadosPage';
import EmpresasPage from '../../features/empresas/pages/EmpresasPage';
import MarcasPage from '../../features/marcas/pages/MarcasPage';
import EquiposPage from '../../features/equipos/pages/EquiposPage';
import EntradaMasivaEquiposPage from '../../features/equipos/pages/EntradaMasivaEquiposPage';
import SensoresDashboard from '../../features/sensores/SensoresDashboard';
import MovimientosInventarioPage from '../../features/movimientos/MovimientosInventarioPage';
import ViajesModule from '../../features/viajes/ViajesModule';
import ReporteGeneralEquipos from '../../features/equipos/components/ReporteGeneralEquipos';

// 1. Mapa de componentes
// Asocia el 'id' del item del menú con el componente de la página que debe renderizar.
const componentMap = {
  almacenes: <AlmacenesPage />,
  departamentos: <DepartamentosPage />,
  modulos: <ModulosPage />,
  usuarios: <UsuariosPage />,
  empleados: <EmpleadosPage />,
  empresas: <EmpresasPage />,
  marcas: <MarcasPage />,
  equipos: <EntradaMasivaEquiposPage />,
  movimiento_equipos: <EquiposPage />,
  sensores: <SensoresDashboard />,
  movimientos: <MovimientosInventarioPage />,
  viajes: <ViajesModule />,
  reporte_equipos: <ReporteGeneralEquipos />,
  // Agrega aquí otras páginas a medida que las vayas creando
  // marcas: <MarcasPage />,
  // equipos: <EquiposPage />,
};

// Componente genérico para vistas no implementadas
const NotImplemented = ({ label }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-500">
    <Construction size={64} className="mb-4 opacity-50" />
    <h2 className="text-2xl font-bold mb-2">En Construcción</h2>
    <p>La vista para <span className="font-semibold text-gray-400">{label}</span> aún no ha sido implementada.</p>
  </div>
);


const MenuItem = ({ item, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { openTab, activeTab } = useTabs();
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      // 2. Busca el componente en el mapa
      const componentToRender = componentMap[item.id] || <NotImplemented label={item.label} />;

      // 3. Llama a openTab con el componente correcto
      openTab({
        id: item.id,
        label: item.label,
        component: componentToRender,
      });
    }
  };

  const isActive = !hasChildren && activeTab === item.id;

  return (
    <div className="select-none text-gray-300">
      <div
        className={`
          flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors text-sm
          ${isActive
            ? 'bg-gray-700 text-white border-r-4 border-indigo-500'
            : 'hover:bg-gray-700/50'
          }
        `}
        style={{ paddingLeft: `${depth * 1.25 + 1}rem` }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3">
          {item.icon && <item.icon size={16} />}
          <span>{item.label}</span>
        </div>
        {hasChildren && (
          isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="overflow-hidden transition-all duration-300 bg-gray-800/50">
          {item.children.map(child => (
            <MenuItem
              key={child.id}
              item={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;