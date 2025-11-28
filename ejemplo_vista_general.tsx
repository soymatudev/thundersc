import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ChevronDown, 
  ChevronRight, 
  X, 
  Menu, 
  Settings, 
  Database, 
  Box, 
  BarChart2, 
  Thermometer, 
  Activity,
  User,
  LayoutDashboard
} from 'lucide-react';

// --- DATA: Estructura del Menú (Simulando la imagen) ---
const MENU_ITEMS = [
  {
    id: 'inicio',
    label: 'Inicio',
    icon: Home,
  },
  {
    id: 'inventarios',
    label: 'Inventarios',
    icon: Box,
    children: [
      {
        id: 'catalogos',
        label: 'Catalogos',
        children: [
          { id: 'marcas', label: 'Marcas' },
          { id: 'almacenes', label: 'Almacenes' },
          { id: 'equipos', label: 'Equipos' },
          { id: 'empleados', label: 'Empleados' },
          { id: 'departamentos', label: 'Departamentos' },
          { id: 'tipos_equipos', label: 'Tipo de Equipos' },
        ]
      },
      {
        id: 'consultas',
        label: 'Consultas',
        children: [
          { id: 'ingreso_equipo', label: 'Ingreso x Equipo' },
          { id: 'inventario_equipos', label: 'Inventario x Equipos' },
        ]
      },
      {
        id: 'movimientos',
        label: 'Movimientos',
        children: [
          { id: 'mov_equipo', label: 'Movimiento de Equipo' },
        ]
      }
    ]
  },
  {
    id: 'utilerias',
    label: 'Utilerias',
    icon: Settings,
    children: [
      { id: 'ventas_scorpion', label: 'Ventas Scorpion' },
    ]
  },
  {
    id: 'reportes',
    label: 'Reportes',
    icon: Database,
    children: [
      { id: 'backups_db', label: 'Backups DB' },
    ]
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      {
        id: 'sensores',
        label: 'Sensores',
        children: [
          { id: 'sensores_temp', label: 'Sensores Temp.' }, // Esta es la pantalla principal de la imagen
        ]
      }
    ]
  }
];

// --- COMPONENTES UI SIMULADOS (Gráficas y Termómetros) ---

const TermometroWidget = ({ label, temp, color = "#06b6d4" }) => {
  // Cálculo simple para la altura del líquido
  const percentage = Math.min(Math.max((temp + 20) / 60 * 100, 0), 100); // Rango ficticio -20 a 40

  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative h-64 w-16 bg-gray-800 rounded-full border-4 border-gray-700 flex flex-col justify-end items-center shadow-lg">
        {/* Marcas de graduación */}
        <div className="absolute inset-0 flex flex-col justify-between py-6 px-1 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-full border-t border-gray-600 h-0 opacity-50"></div>
          ))}
        </div>
        
        {/* Líquido */}
        <div 
          className="w-full rounded-b-full transition-all duration-1000 ease-in-out relative"
          style={{ height: `${percentage}%`, backgroundColor: color }}
        >
             {/* Burbuja base */}
             <div 
              className="absolute -bottom-4 -left-1 w-[calc(100%+8px)] h-14 rounded-full border-4 border-gray-700 z-10"
              style={{ backgroundColor: color }}
            />
        </div>
        
        {/* Etiqueta flotante de valor */}
        <div className="absolute top-1/2 left-10 bg-gray-700 text-white px-2 py-1 rounded text-sm font-bold shadow-md z-20 whitespace-nowrap">
          {temp}°C
        </div>
      </div>
      <div className="mt-6 font-semibold text-gray-700 flex items-center gap-2">
        {label} 
        <Activity size={14} className="animate-pulse text-gray-500"/>
      </div>
    </div>
  );
};

const LineChartMock = ({ title, color, dataPoints }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full">
      <h3 className="text-gray-600 mb-4 text-center">{title}</h3>
      <div className="h-48 w-full flex items-end gap-1 relative border-b border-l border-gray-200 pl-2 pb-2">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((val) => (
          <div key={val} className="absolute w-full border-t border-gray-100 text-xs text-gray-400" style={{ bottom: `${val}%` }}>
            <span className="absolute -left-8 -top-2">{val}%</span>
          </div>
        ))}
        
        {/* SVG Line */}
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none px-2 pb-2">
           <polyline 
             fill="none" 
             stroke={color} 
             strokeWidth="2" 
             points={dataPoints.map((p, i) => `${(i / (dataPoints.length - 1)) * 100}% ${100 - p}%`).join(', ')} 
           />
           {dataPoints.map((p, i) => (
             <circle 
               key={i} 
               cx={`${(i / (dataPoints.length - 1)) * 100}%`} 
               cy={`${100 - p}%`} 
               r="3" 
               fill={color} 
             />
           ))}
        </svg>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>21/11 04:00 min</span>
        <span>21/11 07:00 min</span>
        <span>21/11 10:00 min</span>
        <span>21/11 13:00 min</span>
      </div>
    </div>
  );
};

// --- COMPONENTES ESTRUCTURALES ---

// 1. Item del Menú Recursivo
const MenuItem = ({ item, depth = 0, onSelect, activeTabId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  
  // Auto-expandir si un hijo está activo (opcional, pero mejora UX)
  // Aquí lo mantenemos simple con control manual

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onSelect(item);
    }
  };

  return (
    <div className="select-none">
      <div 
        className={`
          flex items-center justify-between px-4 py-2 cursor-pointer transition-colors text-sm
          ${activeTabId === item.id ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500' : 'text-gray-600 hover:bg-gray-100'}
        `}
        style={{ paddingLeft: `${depth * 1.5 + 1}rem` }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2">
          {item.icon && <item.icon size={16} />}
          <span>{item.label}</span>
        </div>
        {hasChildren && (
          isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        )}
      </div>
      
      {hasChildren && isOpen && (
        <div className="overflow-hidden transition-all duration-300">
          {item.children.map(child => (
            <MenuItem 
              key={child.id} 
              item={child} 
              depth={depth + 1} 
              onSelect={onSelect} 
              activeTabId={activeTabId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 2. Contenido de las Pantallas
const ScreenContent = ({ tabId }) => {
  // Simulamos diferentes contenidos según el ID
  if (tabId === 'sensores_temp') {
    return (
      <div className="p-6 bg-slate-50 min-h-full">
        {/* Cabecera Azul Falsa */}
        <div className="bg-blue-900 text-white p-2 rounded-t mb-0 text-sm font-semibold">
          Sensores
        </div>
        
        <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-b mb-6">
          {/* Fila de Termómetros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center mb-10">
            <TermometroWidget label="TEM ABMTY" temp={16} color="#0891b2" />
            <TermometroWidget label="site Salto DB" temp={20} color="#0891b2" />
            <TermometroWidget label="Camara Teoloyucan" temp={0} color="#0891b2" />
          </div>

          {/* Fila de Gráficas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChartMock 
              title="Registro de Temperaturas" 
              color="#f59e0b" // Orange
              dataPoints={[45, 48, 42, 45, 38, 52, 48, 45, 55, 48, 46, 47, 48, 48, 46, 55, 52, 53, 55, 54, 55, 53, 54, 55, 55]}
            />
            <LineChartMock 
              title="Registro de Humedad" 
              color="#3b82f6" // Blue
              dataPoints={[50, 45, 49, 42, 52, 45, 51, 48, 50, 52, 48, 46, 48, 40, 55, 42, 48, 49, 49, 52, 50, 49, 55, 47, 48]}
            />
          </div>
        </div>
      </div>
    );
  }

  // Pantalla por defecto genérica
  return (
    <div className="p-10 text-center text-gray-400 flex flex-col items-center justify-center h-full">
      <Database size={64} className="mb-4 opacity-20" />
      <h2 className="text-xl font-bold mb-2">Pantalla: {tabId}</h2>
      <p>Contenido generado dinámicamente para la pestaña seleccionada.</p>
    </div>
  );
};

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('sensores_temp');
  const [tabs, setTabs] = useState([
    { id: 'sensores_temp', label: 'Sensores Temp. (PCZMEX)' },
    { id: 'empleados', label: 'Empleados (PCZMEX)' },
    { id: 'almacenes', label: 'Almacenes (PCZMEX)' }
  ]);

  // Manejar selección del menú
  const handleMenuSelect = (item) => {
    // 1. Verificar si ya existe el tab
    const existingTab = tabs.find(t => t.id === item.id);
    
    if (!existingTab) {
      // Agregar nuevo tab
      setTabs([...tabs, { id: item.id, label: `${item.label} (PCZMEX)` }]);
    }
    
    // 2. Activar tab
    setActiveTab(item.id);

    // En movil, cerrar sidebar al seleccionar
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Cerrar Tab
  const closeTab = (e, tabId) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);

    // Si cerramos el activo, mover al anterior
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    } else if (newTabs.length === 0) {
      setActiveTab(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          bg-white shadow-xl z-20 flex flex-col transition-all duration-300
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:-translate-x-0 opacity-0 md:opacity-100'}
          fixed md:relative h-full
        `}
      >
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="font-bold text-xl text-gray-800">1 - paimon</span>
        </div>

        <div className="overflow-y-auto flex-1 py-4 scrollbar-thin scrollbar-thumb-gray-200">
          {MENU_ITEMS.map(item => (
            <MenuItem 
              key={item.id} 
              item={item} 
              onSelect={handleMenuSelect} 
              activeTabId={activeTab}
            />
          ))}
        </div>
        
        <div className="p-4 text-xs text-gray-400 border-t text-center">
          v1.0.4 - Dashboard
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        
        {/* Header Superior */}
        <header className="h-12 bg-white border-b flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-gray-100 rounded text-gray-600 focus:outline-none"
            >
              <Menu size={20} />
            </button>
            <span className="font-bold text-gray-700 hidden sm:block">PCZMEX</span>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <Activity size={18} />
            <User size={18} />
            <Settings size={18} />
          </div>
        </header>

        {/* Barra de Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 flex items-center px-2 overflow-x-auto h-10 shrink-0 scrollbar-hide">
          {tabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 text-xs font-medium cursor-pointer border-r border-gray-200 select-none min-w-[150px] max-w-[200px] justify-between group
                ${activeTab === tab.id 
                  ? 'bg-white text-blue-600 border-t-2 border-t-blue-500 h-full shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}
              `}
            >
              <span className="truncate">{tab.label}</span>
              <button 
                onClick={(e) => closeTab(e, tab.id)}
                className="opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 rounded-full p-0.5 transition-all"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Área de Visualización (Viewport) */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          {tabs.length > 0 ? (
            <ScreenContent tabId={activeTab} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p>No hay pestañas abiertas</p>
              <p className="text-sm mt-2">Selecciona una opción del menú lateral</p>
            </div>
          )}
        </main>

      </div>

      {/* Overlay para móvil cuando el menú está abierto */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}