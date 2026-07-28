import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

// Dashboards
import { AdminDashboard } from './components/Dashboards/AdminDashboard';
import { EmployeeDashboard } from './components/Dashboards/EmployeeDashboard';
import { InventoryDashboard } from './components/Dashboards/InventoryDashboard';

// Modules
import { LeaveModule } from './components/LeaveModule';
import { MaterialModule } from './components/MaterialModule';
import { WorkTransferModule } from './components/WorkTransferModule';
import { ActivityLogsModule } from './components/ActivityLogsModule';
import { SelfHostModule } from './components/SelfHostModule';

const MainContent = () => {
  const { activeTab, currentRoleKey } = useApp();

  const renderDashboard = () => {
    if (currentRoleKey === 'EMPLOYEE') {
      return <EmployeeDashboard />;
    }
    if (currentRoleKey === 'INVENTORY') {
      return <InventoryDashboard />;
    }
    return <AdminDashboard />;
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'leave':
        return <LeaveModule />;
      case 'material':
        return <MaterialModule />;
      case 'work':
        return <WorkTransferModule />;
      case 'logs':
        return <ActivityLogsModule />;
      case 'selfhost':
        return <SelfHostModule />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-kyvera-dark text-slate-100 pb-20 md:pb-8">
      <Header />
      <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 py-6 gap-6">
        <Sidebar />
        <main className="flex-1 w-full min-w-0">
          {renderActiveModule()}
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
