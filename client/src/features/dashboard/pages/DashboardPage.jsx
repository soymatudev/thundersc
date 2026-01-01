import React from 'react';
import { UIProvider } from '../../../shared/context/UIContext';
import { TabsProvider } from '../../../shared/context/TabsContext';
import MainLayout from '../../../shared/components/MainLayout';

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