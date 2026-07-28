import React, { useState } from 'react';
import { OrbitLogo } from './OrbitLogo';
import { useApp } from '../context/AppContext';
import { Bell, LogOut, Sparkles, X } from 'lucide-react';

export const Header = () => {
  const { currentUser, logout, notificationCount, setNotificationCount, activityLogs } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-6 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-4">
          <OrbitLogo size="sm" showText={true} />
        </div>

        {/* Right User Badge & Logout Button */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (showNotifications) setNotificationCount(0);
              }}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell size={18} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-2 w-80 z-50 rounded-2xl bg-white p-4 shadow-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-cyan-600" /> System Notifications
                    </span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-700">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {activityLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-cyan-600">{log.type}</span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className="text-slate-700 mt-1 font-medium text-[11px]">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Active User Account Badge */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center font-extrabold text-white text-xs shadow-xs">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-extrabold text-slate-900 leading-tight">{currentUser.name}</span>
              <span className="text-[11px] text-cyan-700 font-bold mt-0.5">{currentUser.title}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition-all cursor-pointer"
            title="Switch / Log Out Account"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
