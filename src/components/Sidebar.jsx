import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Package, 
  ArrowLeftRight, 
  FileText, 
  ShieldCheck 
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, currentUser } = useApp();

  const role = currentUser.id;

  const allTabs = [
    { id: 'dashboard', name: 'Executive Overview', icon: LayoutDashboard, roles: ['CEO', 'COORDINATOR', 'TEAM_LEAD'] },
    { id: 'work', name: 'Work Tracking System', icon: ArrowLeftRight, roles: ['CEO', 'COORDINATOR', 'TEAM_LEAD', 'HR', 'EMPLOYEE'] },
    { id: 'leave', name: 'Leave Application Portal', icon: CalendarDays, roles: ['CEO', 'COORDINATOR', 'TEAM_LEAD', 'HR', 'EMPLOYEE'] },
    { id: 'material', name: 'Material & Inventory', icon: Package, roles: ['CEO', 'COORDINATOR', 'INVENTORY'] },
    { id: 'logs', name: 'Activity Audit Trail', icon: FileText, roles: ['CEO', 'COORDINATOR', 'TEAM_LEAD', 'HR'] },
  ];

  const visibleTabs = allTabs.filter(tab => tab.roles.includes(role));

  return (
    <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col justify-between hidden lg:flex min-h-[calc(100vh-80px)] shrink-0">
      <div className="space-y-6">
        {/* Role Scoped Badge */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-800 flex items-center gap-2">
            <ShieldCheck size={16} /> Active Persona
          </div>
          <div className="font-extrabold text-base text-slate-900 leading-tight pt-1">{currentUser.title}</div>
          <div className="text-xs text-slate-600 font-bold">{currentUser.dept} Department</div>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-2">
          <div className="px-3 pb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>

          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-extrabold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-700 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500'} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean Footer */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-500 text-center">
        KYVERA by MRA Platform
      </div>
    </aside>
  );
};
