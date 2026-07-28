import React, { useState } from 'react';
import { OrbitLogo } from './OrbitLogo';
import { useApp } from '../context/AppContext';
import { Bell, Search, Database, LogOut, User, Globe, Sparkles, X } from 'lucide-react';

export const Header = () => {
  const { currentUser, logout, notificationCount, setNotificationCount, activityLogs, setActiveTab } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-4">
          <OrbitLogo size="sm" showText={true} />
        </div>

        {/* Center Domain Pill */}
        <div className="hidden md:flex items-center gap-3 bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-cyan-500/30 text-xs">
          <Globe size={13} className="text-cyan-400 animate-pulse" />
          <span className="text-slate-400">Enterprise Node:</span>
          <a href="https://MRA.KYVERA.git" className="font-extrabold text-cyan-300 hover:underline">
            https://MRA.KYVERA.git
          </a>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Self-Hosted SQL Connected
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
                      <Sparkles size={14} className="text-cyan-400" /> System Notifications
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
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Active User Account Badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-emerald-600 flex items-center justify-center font-extrabold text-white text-xs shadow-md">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-100">{currentUser.name}</span>
              <span className="text-[10px] text-cyan-400 font-semibold">{currentUser.title}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-800 text-slate-300 hover:text-rose-300 transition-all cursor-pointer"
            title="Switch / Log Out Account"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
