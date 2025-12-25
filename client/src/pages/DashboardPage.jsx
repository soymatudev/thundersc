import React from 'react';
import { UIProvider } from '../context/UIContext';
import { TabsProvider } from '../context/TabsContext';
import MainLayout from '../components/layout/MainLayout';

const DashboardPage = () => {
  return (
    <UIProvider>
      <TabsProvider>
        <MainLayout />
      </TabsProvider>
    </UIProvider>
  );
};

export default DashboardPage;