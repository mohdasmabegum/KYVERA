import React, { useState } from 'react';
import { OrbitLogo } from './OrbitLogo';
import { useApp } from '../context/AppContext';
import { Bell, LogOut, Sparkles, X } from 'lucide-react';

export const Header = () => {
  const { currentUser, logout, notificationCount, setNotificationCount, activityLogs } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-8 py-4 shadow-xs">
      <div className="w-full flex items-center justify-between gap-6">
        {/* Left Branding */}
        <div className="flex items-center gap-4">
          <OrbitLogo size="md" showText={true} />
        </div>

        {/* Right User Badge & Logout Button */}
        <div className="flex items-center gap-5">
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
                      <Sparkles size={16} className="text-cyan-600" /> System Notifications
                    </span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-700">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {activityLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-400">
                          <span className="text-cyan-700 uppercase tracking-wider">{log.type}</span>
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

          {/* Active User Account Badge */}
          <div className="flex items-center gap-3.5 pl-4 border-l border-slate-200">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-700 flex items-center justify-center font-extrabold text-white text-sm shadow-xs">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-extrabold text-slate-900 leading-tight">{currentUser.name}</span>
              <span className="text-xs text-cyan-800 font-extrabold mt-0.5">{currentUser.title} ({currentUser.dept})</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-600 transition-all cursor-pointer"
            title="Switch / Log Out Account"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
