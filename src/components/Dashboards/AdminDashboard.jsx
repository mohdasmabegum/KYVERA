import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Calendar, 
  Package, 
  ArrowLeftRight, 
  CheckCircle2, 
  Building2,
  FileSpreadsheet,
  Plus,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard = ({ onInspectDetail }) => {
  const { 
    currentUser, 
    registeredAccounts, 
    leaveRequests, 
    materialRequests, 
    workAssignments, 
    exportToExcel,
    setActiveTab
  } = useApp();

  const activeLeavesCount = leaveRequests.filter(l => l.status === 'Approved').length;
  const pendingOrdersCount = materialRequests.filter(m => m.status === 'Pending for Order').length;
  const activeTasksCount = workAssignments.filter(w => w.status === 'Accepted' || w.status === 'In Progress').length;
  const completedTasksCount = workAssignments.filter(w => w.status === 'Completed').length;

  return (
    <div className="space-y-8 w-full">
      {/* Top Banner with Custom Account Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-700 uppercase tracking-widest">
            <Building2 size={18} /> Enterprise Executive Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Welcome back, {currentUser?.name || 'Executive'}
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-0.5">
            Logged in as <strong className="text-slate-900">{currentUser?.title}</strong> ({currentUser?.dept || 'Operations'} Department) • {currentUser?.orgName || 'MRA Systems'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => exportToExcel(workAssignments, `Kyvera_Work_Log_${Date.now()}.csv`)}
            className="kyvera-btn-secondary py-3 px-5 text-sm font-extrabold"
          >
            <FileSpreadsheet size={18} className="text-emerald-600" /> Export Work Report CSV
          </button>

          <button
            onClick={() => setActiveTab('work')}
            className="kyvera-btn-primary py-3 px-6 text-sm font-extrabold shadow-md"
          >
            <Plus size={18} /> New Work Request
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold text-cyan-700 uppercase tracking-wider">Active Work Requests</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{activeTasksCount}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">In Progress Across Teams</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
            <ArrowLeftRight size={26} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">Pending Orders To-Do</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{pendingOrdersCount}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Action Required by Inventory</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Package size={26} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Completed Tasks</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{completedTasksCount}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Verified & Delivered ✅</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <CheckCircle2 size={26} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold text-purple-700 uppercase tracking-wider">Employees On Leave</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{activeLeavesCount}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Active Approved Leaves</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
            <Calendar size={26} />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Work Operations + Registered Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Work Requests List */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <ArrowLeftRight size={20} className="text-cyan-700" /> Active Operations & Work Transfers
            </h3>
            <button
              onClick={() => setActiveTab('work')}
              className="text-xs font-extrabold text-cyan-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              View Work Tracker <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {workAssignments.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-slate-500 text-sm font-extrabold">No active work requests found.</p>
                <p className="text-xs text-slate-400 font-semibold mt-1">Click "New Work Request" to create your first operation task.</p>
              </div>
            ) : (
              workAssignments.map(task => (
                <div key={task.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm space-y-2">
                  <div className="flex items-center justify-between font-extrabold">
                    <span className="text-slate-900 text-base">{task.projectName}</span>
                    <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-extrabold">
                      {task.status} ({task.progress}%)
                    </span>
                  </div>
                  <div className="text-slate-600 text-xs font-bold">
                    From: <strong className="text-slate-900">{task.fromDept} ({task.assignerName})</strong> → To: <strong className="text-teal-700">{task.toDept} ({task.assignedEmpName})</strong>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-400 font-semibold">Assigned: {task.assignedDate}</span>
                    <button
                      onClick={() => onInspectDetail && onInspectDetail(task, 'work')}
                      className="text-xs font-extrabold text-cyan-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Inspect Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Registered Enterprise Accounts */}
        <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Users size={20} className="text-teal-700" /> Organization Accounts ({registeredAccounts.length + 1})
            </h3>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {/* Current Logged In Account */}
            {currentUser && (
              <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-extrabold text-slate-900 text-sm">
                  <span>{currentUser.name} (You)</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-200 text-cyan-900 text-[10px]">Active Session</span>
                </div>
                <div className="text-cyan-800 font-bold">{currentUser.title} • {currentUser.dept}</div>
                <div className="text-slate-500 font-semibold">{currentUser.email}</div>
              </div>
            )}

            {/* Other Registered Accounts */}
            {registeredAccounts.filter(a => a.email !== currentUser?.email).map(account => (
              <div key={account.email} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-extrabold text-slate-900 text-sm">{account.name}</div>
                <div className="text-slate-700 font-bold">{account.title} • {account.dept}</div>
                <div className="text-slate-500 font-semibold">{account.email}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
