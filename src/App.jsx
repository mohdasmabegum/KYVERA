import React from 'react';
import { useApp } from './context/AppContext';
import { AuthPortal } from './components/AuthPortal';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

// Modules
import { AdminDashboard } from './components/Dashboards/AdminDashboard';
import { LeaveModule } from './components/LeaveModule';
import { MaterialModule } from './components/MaterialModule';
import { WorkTransferModule } from './components/WorkTransferModule';
import { ActivityLogsModule } from './components/ActivityLogsModule';

export function App() {
  const { isAuthenticated, activeTab } = useApp();

  // If not authenticated, render AuthPortal (Sign In / Register)
  if (!isAuthenticated) {
    return <AuthPortal />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'leave':
        return <LeaveModule />;
      case 'material':
        return <MaterialModule />;
      case 'work':
        return <WorkTransferModule />;
      case 'logs':
        return <ActivityLogsModule />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header */}
      <Header />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 lg:pb-6">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderTabContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
}

export default App;
