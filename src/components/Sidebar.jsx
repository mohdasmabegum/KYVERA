import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Package, 
  ArrowLeftRight, 
  FileText, 
  Database, 
  Building2, 
  Users, 
  ShieldCheck,
  Globe
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
    { id: 'selfhost', name: 'Self-Hosted Database', icon: Database, roles: ['CEO', 'COORDINATOR'] },
  ];

  const visibleTabs = allTabs.filter(tab => tab.roles.includes(role));

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between hidden lg:flex min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Role Scoped Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-cyan-50 border border-slate-200">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-700 flex items-center gap-1.5">
            <ShieldCheck size={13} /> Active Persona
          </div>
          <div className="font-extrabold text-sm text-slate-900 mt-0.5">{currentUser.title}</div>
          <div className="text-[11px] text-slate-500 font-medium">{currentUser.dept} Department</div>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>

          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-white' : 'text-slate-500'} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 text-center space-y-1">
        <div className="font-extrabold text-slate-700">KYVERA by MRA Enterprise</div>
        <a 
          href="https://mohdasmabegum.github.io/KYVERA/" 
          target="_blank" 
          rel="noreferrer" 
          className="text-cyan-700 font-bold hover:underline block truncate"
        >
          mohdasmabegum.github.io/KYVERA/
        </a>
      </div>
    </aside>
  );
};
