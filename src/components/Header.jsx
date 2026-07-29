import React, { useState } from 'react';
import { OrbitLogo } from './OrbitLogo';
import { useApp } from '../context/AppContext';
import { Modal } from './Modal';
import { 
  Bell, 
  LogOut, 
  Sparkles, 
  X, 
  Menu, 
  LayoutDashboard, 
  CalendarDays, 
  Package, 
  ArrowLeftRight, 
  FileText 
} from 'lucide-react';

export const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { 
    currentUser, 
    logout, 
    notificationCount, 
    setNotificationCount, 
    activityLogs,
    activeTab,
    setActiveTab 
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const role = currentUser?.id;

  const navbarTabs = [
    { id: 'dashboard', name: 'Executive Overview', icon: LayoutDashboard, roles: ['CEO', 'COORDINATOR', 'TEAM_LEAD'] },
    { id: 'work', name: 'Work Tracking', icon: ArrowLeftRight, roles: ['CEO', 'COORDINATOR', 'TEAM_LEAD', 'HR', 'EMPLOYEE'] },
    { id: 'leave', name: 'Leave Portal', icon: CalendarDays, roles: ['CEO', 'COORDINATOR', 'TEAM_LEAD', 'HR', 'EMPLOYEE'] },
    { id: 'material', name: 'Material & Inventory', icon: Package, roles: ['CEO', 'COORDINATOR', 'INVENTORY'] },
    { id: 'logs', name: 'Audit Trail', icon: FileText, roles: ['CEO', 'COORDINATOR', 'TEAM_LEAD', 'HR'] },
  ];

  const visibleNavbarTabs = navbarTabs.filter(tab => tab.roles.includes(role));

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-6 lg:px-10 py-4 shadow-xs">
      <div className="w-full flex items-center justify-between gap-6">
        {/* Left Branding & Sidebar Toggle */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-all cursor-pointer"
            title="Toggle Sidebar Navigation"
          >
            <Menu size={20} />
          </button>

          <OrbitLogo size="sm" />
        </div>

        {/* Center Pill Navbar Tabs */}
        <div className="hidden xl:flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          {visibleNavbarTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right User Account & Notification */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (showNotifications) setNotificationCount(0);
              }}
              className="relative p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-xs font-extrabold flex items-center justify-center shadow-xs">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-3 w-96 z-50 rounded-3xl bg-white p-5 shadow-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-600" /> System Notifications
                    </span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-700">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {activityLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-400">
                          <span className="text-blue-700 uppercase tracking-wider">{log.type}</span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className="text-slate-900 mt-1.5 font-bold text-xs leading-relaxed">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-3.5 pl-3 border-l border-slate-200">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-extrabold text-white text-sm shadow-xs">
              {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'U'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-extrabold text-slate-900 leading-tight">{currentUser?.name}</span>
              <span className="text-xs text-blue-700 font-bold mt-0.5">{currentUser?.title} ({currentUser?.dept})</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-600 transition-all cursor-pointer"
            title="Log Out Account"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowLogoutModal(false)}
          title="Sign Out Confirmation"
          icon={LogOut}
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-700 font-bold leading-relaxed">
              Are you sure you want to sign out of <strong className="text-slate-900">{currentUser?.name}</strong> ({currentUser?.title})?
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="kyvera-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-extrabold text-xs shadow-md cursor-pointer"
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </Modal>
      )}
    </header>
  );
};
