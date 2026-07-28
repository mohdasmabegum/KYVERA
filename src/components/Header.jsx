import React, { useState } from 'react';
import { OrbitLogo } from './OrbitLogo';
import { RoleSwitcher } from './RoleSwitcher';
import { useApp } from '../context/AppContext';
import { Bell, Search, Database, ShieldAlert, Sparkles, X } from 'lucide-react';

export const Header = () => {
  const { currentUser, notificationCount, setNotificationCount, activityLogs, setActiveTab } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-4">
          <OrbitLogo size="sm" showText={true} />
        </div>

        {/* Center Search / Status Pill (Desktop) */}
        <div className="hidden md:flex items-center gap-3 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-400">Enterprise Node:</span>
          <span className="font-semibold text-emerald-400">MRA-HQ-ACTIVE</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">SQL Self-Hosted DB:</span>
          <button 
            onClick={() => setActiveTab('selfhost')} 
            className="text-cyan-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Database size={12} /> Connected
          </button>
        </div>

        {/* Right Section: Role Switcher, Notifications, User Badge */}
        <div className="flex items-center gap-3">
          <RoleSwitcher />

          {/* Notifications Button & Popover */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (showNotifications) setNotificationCount(0);
              }}
              className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell size={16} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-2 w-80 z-50 rounded-xl glass-panel p-3 shadow-2xl border border-cyan-500/30">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles size={14} className="text-cyan-400" /> Recent Notifications
                    </span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                    {activityLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="p-2 rounded-lg bg-slate-900/70 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-cyan-400">{log.type}</span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className="text-slate-200 mt-1 font-medium text-[11px]">{log.details}</p>
                        <span className="text-[9px] text-slate-400 block mt-0.5">By: {log.updatedBy}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      setActiveTab('logs');
                      setShowNotifications(false);
                    }}
                    className="w-full mt-3 py-1.5 text-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-slate-900 rounded-lg border border-slate-800"
                  >
                    View All Audit Logs →
                  </button>
                </div>
              </>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-emerald-600 flex items-center justify-center font-extrabold text-white text-xs shadow-md">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-100">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400">{currentUser.empId} • {currentUser.dept}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
