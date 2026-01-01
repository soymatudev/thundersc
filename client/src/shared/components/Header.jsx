import React, { useState, useEffect, useRef } from 'react';
import { Menu, Activity, User, Settings, LogOut } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { isSidebarOpen, setSidebarOpen } = useUI();
  const { logout, user } = useAuth();
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Efecto para cerrar el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-1 hover:bg-gray-700 rounded text-gray-300 focus:outline-none"
        >
          <Menu size={20} />
        </button>
        <span className="font-bold text-gray-300 hidden sm:block">Thunder</span>
      </div>
      <div className="flex items-center gap-5 text-gray-400">
        {/* <Activity size={18} className="cursor-pointer hover:text-white"/> */}

        {/* Menú de Usuario */}
        <div className="relative" ref={menuRef}>
          <User
            size={18}
            className="cursor-pointer hover:text-white"
            onClick={() => setUserMenuOpen(!isUserMenuOpen)}
          />
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50 border border-gray-600">
              <div className="px-4 py-2 text-xs text-gray-400">
                Sesión iniciada como
                <strong className="block text-sm text-gray-200">{user[0].username}</strong>
              </div>
              <div className="border-t border-gray-600"></div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
              >
                <LogOut size={14} />
                Cerrar Sesión
              </a>
            </div>
          )}
        </div>

        <Settings size={18} className="cursor-pointer hover:text-white" />
      </div>
    </header>
  );
};

export default Header;

