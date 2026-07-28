import React, { useState, useCallback } from 'react';
import { useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
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
import { SelfHostModule } from './components/SelfHostModule';

export function App() {
  const { isAuthenticated, activeTab } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Render 3-second Splash Screen on initial load
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

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
      case 'selfhost':
        return <SelfHostModule />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-kyvera-dark text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 lg:pb-6">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderTabContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
}

export default App;
