import React, { createContext, useState, useContext } from 'react';

// 1. Crear el contexto
const TabsContext = createContext();

// Hook para consumir el contexto fácilmente
export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs debe ser usado dentro de un TabsProvider');
  }
  return context;
};

// 2. Crear el proveedor del contexto
export const TabsProvider = ({ children }) => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const openTab = (item) => {
    // 'item' debe tener al menos { id, label, component }
    const existingTab = tabs.find(t => t.id === item.id);

    if (!existingTab) {
      setTabs(prevTabs => [...prevTabs, item]);
    }
    
    setActiveTab(item.id);
  };

  const closeTab = (tabId) => {
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);

    // Si se cierra la pestaña activa, activar la anterior o la primera
    if (activeTab === tabId) {
      if (newTabs.length > 0) {
        const newActiveTab = newTabs[tabIndex] || newTabs[tabIndex - 1] || newTabs[0];
        setActiveTab(newActiveTab.id);
      } else {
        setActiveTab(null);
      }
    }
  };

  const value = {
    tabs,
    activeTab,
    openTab,
    closeTab,
    setActiveTab,
  };

  return (
    <TabsContext.Provider value={value}>
      {children}
    </TabsContext.Provider>
  );
};
