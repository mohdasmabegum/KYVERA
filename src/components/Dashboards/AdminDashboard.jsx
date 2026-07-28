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
  ArrowRight,
  ShieldCheck
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

  const isExecutive = ['CEO', 'COORDINATOR', 'TEAM_LEAD', 'HR'].includes(currentUser?.id);

  // Access Control Scoping: Executives see all work updates; Employees see ONLY their own work logs!
  const userWorkLogs = isExecutive 
    ? workAssignments 
    : workAssignments.filter(w => w.assignedEmpId === currentUser?.empId || w.alloterName === currentUser?.name);

  const activeLeavesCount = leaveRequests.filter(l => l.status === 'Approved').length;
  const pendingOrdersCount = materialRequests.filter(m => m.status === 'Pending for Order').length;
  const activeTasksCount = userWorkLogs.filter(w => w.status === 'Accepted' || w.status === 'In Progress').length;
  const completedTasksCount = userWorkLogs.filter(w => w.status === 'Completed').length;

  return (
    <div className="space-y-8 w-full">
      {/* Top Banner with Role-Scoped Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-700 uppercase tracking-widest">
            <Building2 size={18} /> {isExecutive ? 'Executive Work Log Database' : 'Personal Employee Work Logs'}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            {currentUser?.name || 'User Account'}
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-0.5">
            Role: <strong className="text-slate-900">{currentUser?.title}</strong> ({currentUser?.dept || 'Operations'} Department) • ID: {currentUser?.empId}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => exportToExcel(userWorkLogs, `Kyvera_Work_Log_Sheet_${Date.now()}.csv`)}
            className="kyvera-btn-secondary py-3 px-5 text-sm font-extrabold"
          >
            <FileSpreadsheet size={18} className="text-emerald-600" /> Export Work Database CSV
          </button>

          <button
            onClick={() => setActiveTab('work')}
            className="kyvera-btn-primary py-3 px-6 text-sm font-extrabold shadow-md"
          >
            <Plus size={18} /> Work Alloter Request
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold text-cyan-700 uppercase tracking-wider">Active Work Tasks</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{activeTasksCount}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">In Progress Tasks</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
            <ArrowLeftRight size={26} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">Pending Material Orders</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{pendingOrdersCount}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Inventory Reminder To-Do</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Package size={26} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Completed Work ✅</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{completedTasksCount}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Verified Database Records</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <CheckCircle2 size={26} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold text-purple-700 uppercase tracking-wider">Approved Leaves</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{activeLeavesCount}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Active Leave Database</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
            <Calendar size={26} />
          </div>
        </div>
      </div>

      {/* Role Scoped Database Work Log Section */}
      <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck size={22} className="text-cyan-700" />
              {isExecutive ? 'Entire Backend Database Work Updates' : 'Your Personal Work Logs'}
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-1">
              {isExecutive 
                ? 'Executive Access: View work database updates across all departments.'
                : 'Employee Access: View ONLY your received and allotted work data stored in backend database.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('work')}
            className="text-xs font-extrabold text-cyan-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Open Full Work Tracker <ArrowRight size={14} />
          </button>
        </div>

        <div className="space-y-4">
          {userWorkLogs.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-600 text-sm font-extrabold">No work log records found for this account.</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">When work is allotted or received, database log entries will appear here.</p>
            </div>
          ) : (
            userWorkLogs.map(task => (
              <div key={task.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm space-y-2">
                <div className="flex items-center justify-between font-extrabold">
                  <span className="text-slate-900 text-base">{task.projectName}</span>
                  <span className="px-3.5 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-extrabold">
                    {task.status}
                  </span>
                </div>
                <div className="text-slate-700 text-xs font-bold">
                  Work Alloter: <strong className="text-slate-900">{task.alloterName} ({task.fromDept})</strong> → Receiver: <strong className="text-teal-700">{task.assignedEmpName} ({task.toDept})</strong>
                </div>
                <div className="text-slate-600 text-xs font-semibold">
                  MANDATORY Hardware Details: <span className="text-slate-900 font-bold">{task.hardwareDetails}</span> | Doc Details: <span className="text-slate-900 font-bold">{task.docDetails}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-400 font-semibold">Assigned Date: {task.assignedDate}</span>
                  <button
                    onClick={() => onInspectDetail && onInspectDetail(task, 'work')}
                    className="text-xs font-extrabold text-cyan-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Inspect Detailed Database Record <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
