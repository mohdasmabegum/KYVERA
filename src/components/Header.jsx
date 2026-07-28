import React, { useState } from 'react';
import { OrbitLogo } from './OrbitLogo';
import { useApp } from '../context/AppContext';
import { Bell, Search, Database, LogOut, User, Globe, Sparkles, X, ShieldCheck } from 'lucide-react';

export const Header = () => {
  const { currentUser, logout, notificationCount, setNotificationCount, activityLogs, setActiveTab } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200 px-4 py-3 bg-white/90">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-4">
          <OrbitLogo size="sm" showText={true} />
        </div>

        {/* Center Domain Pill */}
        <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200 text-xs">
          <Globe size={13} className="text-cyan-600 animate-pulse" />
          <span className="text-slate-500 font-medium">Enterprise URL:</span>
          <a 
            href="https://mohdasmabegum.github.io/KYVERA/" 
            target="_blank" 
            rel="noreferrer" 
            className="font-extrabold text-cyan-700 hover:underline flex items-center gap-1"
          >
            mohdasmabegum.github.io/KYVERA/
          </a>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Self-Hosted SQL Active
          </span>
        </div>

        {/* Right User Badge & Logout Button */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (showNotifications) setNotificationCount(0);
              }}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all cursor-pointer"
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
                <div className="absolute right-0 mt-2 w-80 z-50 rounded-2xl bg-white p-4 shadow-xl border border-slate-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-cyan-600" /> System Notifications
                    </span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-700">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
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
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center font-extrabold text-white text-xs shadow-sm">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-extrabold text-slate-900">{currentUser.name}</span>
              <span className="text-[10px] text-cyan-700 font-bold">{currentUser.title}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition-all cursor-pointer"
            title="Switch / Log Out Account"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
