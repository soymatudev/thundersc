import React from 'react';
import { Home, Box, Settings, Database, LayoutDashboard } from 'lucide-react';
import { useUI } from '../context/UIContext';
import MenuItem from './MenuItem';

const Sidebar = ({ userProfile }) => {
  const { isSidebarOpen } = useUI();
  const userData = userProfile[0];
  const MENU_ITEMS = buildMenuTree(userProfile);

  return (
    <aside
      className={`
        bg-gray-800 shadow-lg z-40 flex flex-col transition-all duration-300
        ${isSidebarOpen ? 'w-64' : 'w-0'}
        fixed md:relative h-full
      `}
    >
      <div className="p-0 border-b border-gray-700 flex items-center gap-3 h-14">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl truncate">
          {userData?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="font-bold text-lg text-gray-200 truncate">{userData?.clave}-{userData?.descri || 'Usuario'}</span>
      </div>

      <div className="overflow-y-auto flex-1 py-4">
        {MENU_ITEMS.map(item => (
          <MenuItem
            key={item.id}
            item={item}
          />
        ))}
      </div>

      <div className="p-0 text-xs text-gray-500 border-t border-gray-700 text-center h-10 truncate">
        v1.0.0
      </div>
    </aside>
  );
};

const buildMenuTree = (menuData) => {
  const menuTree = [];

  const iconMap = {
    'inicio': Home,
    'inventarios': Box,
    'utilerias': Settings,
    'reportes': Database,
    'dashboard': LayoutDashboard,
    'default': Box,
  };

  menuData.forEach(row => {
    const pathParts = row.menu.split('.');
    let currentLevel = menuTree;

    pathParts.forEach((part, index) => {

      const partId = part.toLowerCase().trim();
      const isLastPart = index === pathParts.length - 1;

      let existingItem = currentLevel.find(item => item.id === partId);

      if (!existingItem) {
        existingItem = {
          id: partId,
          label: part.charAt(0).toUpperCase() + part.slice(1),
          icon: iconMap[partId] || iconMap['default'],
          children: []
        };

        if (!isLastPart) {
          existingItem.children = [];
        }

        currentLevel.push(existingItem);
      }

      if (isLastPart) {
        existingItem.route = row.ruta;
        existingItem.modulo = row.modulo;
        existingItem.cve_modulo = row.cve_modulo;
      }

      if (!isLastPart) {
        currentLevel = existingItem.children;
      }

    });
  });

  return menuTree;
}

export default Sidebar;
