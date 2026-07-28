import React, { useState, useCallback } from 'react';
import { useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { AuthPortal } from './components/AuthPortal';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { DetailView } from './components/DetailView';

// Modules
import { AdminDashboard } from './components/Dashboards/AdminDashboard';
import { LeaveModule } from './components/LeaveModule';
import { MaterialModule } from './components/MaterialModule';
import { WorkTransferModule } from './components/WorkTransferModule';
import { ActivityLogsModule } from './components/ActivityLogsModule';

export function App() {
  const { isAuthenticated, activeTab } = useApp();
  const [showSplash, setShowSplash] = useState(true);
  const [activeDetail, setActiveDetail] = useState(null); // { item, type }

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleOpenDetail = (item, type) => {
    setActiveDetail({ item, type });
  };

  const handleCloseDetail = () => {
    setActiveDetail(null);
  };

  // 1. Show clean 2-second Splash Screen on initial app load
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // 2. Redirect to Login / Register Portal if not logged in
  if (!isAuthenticated) {
    return <AuthPortal />;
  }

  // 3. Render Detail View if selected
  const renderTabContent = () => {
    if (activeDetail) {
      return (
        <DetailView 
          item={activeDetail.item} 
          type={activeDetail.type} 
          onBack={handleCloseDetail} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard onInspectDetail={(item, type) => handleOpenDetail(item, type)} />;
      case 'leave':
        return <LeaveModule onInspectDetail={(item) => handleOpenDetail(item, 'leave')} />;
      case 'material':
        return <MaterialModule onInspectDetail={(item) => handleOpenDetail(item, 'material')} />;
      case 'work':
        return <WorkTransferModule onInspectDetail={(item) => handleOpenDetail(item, 'work')} />;
      case 'logs':
        return <ActivityLogsModule />;
      default:
        return <AdminDashboard onInspectDetail={(item, type) => handleOpenDetail(item, type)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col w-full">
      {/* Top Header */}
      <Header />

      {/* Main Full Width Layout Area */}
      <div className="flex-1 flex w-full pb-16 lg:pb-6">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Page Content (Full Screen Width Expansion) */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto w-full">
          {renderTabContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
}

export default App;
