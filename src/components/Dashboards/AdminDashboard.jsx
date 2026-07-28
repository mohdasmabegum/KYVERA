import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Calendar, 
  Package, 
  ArrowLeftRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Search, 
  Building2,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    currentUser, 
    employees, 
    leaveRequests, 
    materialRequests, 
    workAssignments, 
    inventory, 
    activityLogs,
    setActiveTab 
  } = useApp();

  const [empSearch, setEmpSearch] = useState('');

  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending');
  const pendingMaterials = materialRequests.filter(m => m.status === 'Pending' || m.status === 'Ordered');
  const activeTasks = workAssignments.filter(w => w.status !== 'Completed' && w.status !== 'Rejected');
  const lowStockItems = inventory.filter(i => i.qty <= i.minQty);

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(empSearch.toLowerCase()) ||
    e.id.toLowerCase().includes(empSearch.toLowerCase()) ||
    e.dept.toLowerCase().includes(empSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Sparkles size={16} /> Executive Command Center
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Welcome back, {currentUser.name}</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Role: <span className="text-cyan-300 font-semibold">{currentUser.title}</span> • Department: <span className="text-emerald-300 font-semibold">{currentUser.dept}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('leave')}
            className="kyvera-btn-primary text-xs"
          >
            Review {pendingLeaves.length} Pending Leaves
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-card border-l-4 border-l-cyan-500 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Workforce</span>
            <Users size={16} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{employees.length}</div>
          <div className="text-[10px] text-cyan-400 font-medium">Across {new Set(employees.map(e=>e.dept)).size} Departments</div>
        </div>

        <div className="p-4 rounded-xl glass-card border-l-4 border-l-amber-500 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Pending Leaves</span>
            <Calendar size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{pendingLeaves.length}</div>
          <div className="text-[10px] text-slate-400">Needs HR Authorization</div>
        </div>

        <div className="p-4 rounded-xl glass-card border-l-4 border-l-emerald-500 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Active Work Transfers</span>
            <ArrowLeftRight size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{activeTasks.length}</div>
          <div className="text-[10px] text-slate-400">Strict HW + Doc Handshake</div>
        </div>

        <div className="p-4 rounded-xl glass-card border-l-4 border-l-rose-500 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Inventory Alert</span>
            <Package size={16} className="text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400">{lowStockItems.length}</div>
          <div className="text-[10px] text-rose-400/80 font-medium">Low / Out of Stock Items</div>
        </div>
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Work Transfer Operations (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Work Pipeline */}
          <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ArrowLeftRight size={16} className="text-cyan-400" /> Organization Task Pipeline
              </span>
              <button 
                onClick={() => setActiveTab('work')}
                className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {activeTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{task.projectName}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                      {task.status} ({task.progress}%)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    From <strong className="text-slate-200">{task.fromDept}</strong> to <strong className="text-slate-200">{task.toDept}</strong> ({task.assignedEmpName})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Directory Search */}
          <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users size={16} className="text-emerald-400" /> Employee Directory Search
              </span>
              <div className="relative max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Employee ID or Name..."
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                  className="kyvera-input pl-8 py-1 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              {filteredEmployees.map((emp) => (
                <div key={emp.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{emp.name}</div>
                    <div className="text-[10px] text-slate-400">{emp.id} • {emp.dept}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px] font-semibold">
                    {emp.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pending Approvals & Logs (1/3) */}
        <div className="space-y-6">
          {/* Pending Leaves Queue */}
          <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar size={16} className="text-amber-400" /> Urgent Leave Approvals
              </span>
            </div>

            <div className="space-y-3">
              {pendingLeaves.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">No pending leaves.</div>
              ) : (
                pendingLeaves.slice(0, 3).map((leave) => (
                  <div key={leave.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{leave.empName}</span>
                      <span className="text-rose-400 font-extrabold">{leave.priority}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {leave.leaveType} • {leave.leaveDays} Days ({leave.fromDate} to {leave.toDate})
                    </div>
                    <button 
                      onClick={() => setActiveTab('leave')}
                      className="w-full mt-2 py-1 bg-cyan-600/80 hover:bg-cyan-600 text-white rounded text-[11px] font-bold"
                    >
                      Review Application →
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Audit Preview */}
          <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Recent Activity</span>
            </div>

            <div className="space-y-2">
              {activityLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="text-[11px] p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="font-bold text-cyan-400">{log.action}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5 font-medium">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
