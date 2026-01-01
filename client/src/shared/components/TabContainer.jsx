import React from 'react';
import { X } from 'lucide-react';
import { useTabs } from '../context/TabsContext';

const TabContainer = () => {
  const { tabs, activeTab, setActiveTab, closeTab } = useTabs();

  if (tabs.length === 0) {
    return null; // No renderizar nada si no hay pestañas
  }

  return (
    <div className="bg-gray-800 border-b border-gray-700 flex items-center px-2 overflow-x-auto h-10 shrink-0">
      {tabs.map(tab => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            flex items-center gap-2 px-4 py-2 text-xs font-medium cursor-pointer border-r border-gray-700 select-none min-w-[150px] max-w-[200px] justify-between group
            ${activeTab === tab.id
              ? 'bg-gray-700 text-white h-full'
              : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'}
          `}
        >
          <span className="truncate">{tab.label}</span>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evitar que el clic active la pestaña antes de cerrarla
              closeTab(tab.id);
            }}
            className="opacity-50 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 rounded-full p-0.5 transition-all"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TabContainer;
