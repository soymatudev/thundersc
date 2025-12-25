import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import TabContainer from './TabContainer';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../context/UIContext';
import { useTabs } from '../../context/TabsContext';
import { LayoutDashboard } from 'lucide-react';

// Este será el componente principal que se renderiza después del login
const MainLayout = () => {
  const { user } = useAuth();
  const { isSidebarOpen, setSidebarOpen } = useUI();
  const { tabs, activeTab } = useTabs();

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans overflow-hidden">
      
      <Sidebar 
        userProfile={user} // Pasamos el perfil del usuario para generar el menú
      />

      {/* Overlay para móvil cuando el menú está abierto */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <TabContainer />

        <main className="flex-1 overflow-y-auto bg-gray-800 relative">
          {activeTabContent ? (
            activeTabContent
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <LayoutDashboard size={64} className="mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">Bienvenido</h2>
              <p>Selecciona una opción del menú para comenzar.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;


