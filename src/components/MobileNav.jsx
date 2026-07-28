import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Package, 
  ArrowLeftRight, 
  FileText
} from 'lucide-react';

export const MobileNav = () => {
  const { activeTab, setActiveTab, currentUser } = useApp();
  const role = currentUser.id;

  const allTabs = [
    { id: 'dashboard', name: 'Overview', icon: LayoutDashboard, roles: ['CEO', 'COORDINATOR', 'TEAM_LEAD'] },
    { id: 'work', name: 'Work', icon: ArrowLeftRight, roles: ['CEO', 'COORDINATOR', 'TEAM_LEAD', 'HR', 'EMPLOYEE'] },
    { id: 'leave', name: 'Leaves', icon: CalendarDays, roles: ['CEO', 'COORDINATOR', 'TEAM_LEAD', 'HR', 'EMPLOYEE'] },
    { id: 'material', name: 'Materials', icon: Package, roles: ['CEO', 'COORDINATOR', 'INVENTORY'] },
    { id: 'logs', name: 'Logs', icon: FileText, roles: ['CEO', 'COORDINATOR', 'TEAM_LEAD', 'HR'] },
  ];

  const visibleTabs = allTabs.filter(tab => tab.roles.includes(role));

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg">
      {visibleTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
              isActive ? 'text-cyan-700 font-extrabold scale-105' : 'text-slate-500 hover:text-slate-900 font-semibold'
            }`}
          >
            <Icon size={18} className={isActive ? 'text-cyan-700' : 'text-slate-500'} />
            <span className="text-[10px] mt-0.5">{tab.name}</span>
          </button>
        );
      })}
    </nav>
  );
};
