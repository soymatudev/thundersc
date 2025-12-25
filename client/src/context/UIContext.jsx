import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const value = {
    isSidebarOpen,
    setSidebarOpen,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};
