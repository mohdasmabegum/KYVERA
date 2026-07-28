import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Calendar, Package, ArrowLeftRight, History, Database } from 'lucide-react';

export const MobileNav = () => {
  const { activeTab, setActiveTab } = useApp();

  const mobileTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'leave', label: 'Leaves', icon: Calendar },
    { id: 'material', label: 'Material', icon: Package },
    { id: 'work', label: 'Tasks', icon: ArrowLeftRight },
    { id: 'logs', label: 'Logs', icon: History },
    { id: 'selfhost', label: 'DB', icon: Database },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800 px-2 py-2">
      <div className="flex items-center justify-around">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
                isActive 
                  ? 'text-cyan-400 font-bold scale-105' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,180,216,0.6)]' : 'text-slate-400'} />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
