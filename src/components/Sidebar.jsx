import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  ArrowLeftRight, 
  History, 
  Database,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, currentUser, leaveRequests, materialRequests, workAssignments } = useApp();

  // Pending counts for badges
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
  const pendingMaterials = materialRequests.filter(m => m.status === 'Pending' || m.status === 'Ordered').length;
  const pendingTasks = workAssignments.filter(w => w.status === 'Assigned' || w.status === 'In Progress').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'leave', label: 'Leave Management', icon: Calendar, badge: pendingLeaves > 0 ? pendingLeaves : null },
    { id: 'material', label: 'Material & Inventory', icon: Package, badge: pendingMaterials > 0 ? pendingMaterials : null },
    { id: 'work', label: 'Work Transfer', icon: ArrowLeftRight, badge: pendingTasks > 0 ? pendingTasks : null },
    { id: 'logs', label: 'Activity Audit Trail', icon: History, badge: null },
    { id: 'selfhost', label: 'SQL DB & Self-Host', icon: Database, badge: 'PRO' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-slate-800 p-4 min-h-[calc(100vh-4rem)]">
      {/* Current Workspace Card */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
          <Building2 size={14} />
          <span>MRA Organization</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          Role Access: <span className="text-white font-medium">{currentUser.title}</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 flex items-center justify-between">
          <span>Dept: {currentUser.dept}</span>
          <span className="text-emerald-400 font-semibold">Active</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="space-y-1.5 flex-1">
        <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Enterprise Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600/30 to-emerald-600/30 text-white border border-cyan-500/40 shadow-lg shadow-cyan-950/50 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.badge === 'PRO'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status Box */}
      <div className="mt-auto pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
            <span className="flex items-center gap-1">
              <Sparkles size={12} className="text-cyan-400" /> KYVERA v1.0 MVP
            </span>
            <span className="text-[9px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">PWA Ready</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Data hosted privately on local SQL database. Zero cloud vendor lock-in.
          </p>
        </div>
      </div>
    </aside>
  );
};
