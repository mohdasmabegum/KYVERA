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
  BarChart2
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, currentUser } = useApp();

  const role = currentUser.id; // CEO, HR, COORDINATOR, TEAM_LEAD, EMPLOYEE, INVENTORY

  // Tab Definitions (Added 'HR' to 'work' tab so HR can view Employee Work Track Logs)
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
    <aside className="w-64 glass-panel border-r border-slate-800 p-4 flex flex-col justify-between hidden lg:flex min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Role Scoped Badge */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/60 border border-cyan-500/20">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <ShieldCheck size={13} /> Logged In Persona
          </div>
          <div className="font-extrabold text-sm text-white mt-0.5">{currentUser.title}</div>
          <div className="text-[11px] text-slate-400">{currentUser.dept} Department</div>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
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
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-500 text-center space-y-1">
        <div>KYVERA Framework v2.4</div>
        <a href="https://MRA.KYVERA.com" className="text-cyan-400 font-bold hover:underline block">
          https://MRA.KYVERA.com
        </a>
      </div>
    </aside>
  );
};
