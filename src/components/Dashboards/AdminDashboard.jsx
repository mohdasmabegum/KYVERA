import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../Modal';
import { 
  Users, 
  Calendar, 
  Package, 
  ArrowLeftRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Building2,
  UserCheck,
  Clock,
  Briefcase,
  ChevronRight,
  Search,
  Filter,
  FileSpreadsheet
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    currentUser, 
    employees, 
    departments, 
    leaveRequests, 
    materialRequests, 
    workAssignments, 
    activityLogs,
    exportToExcel
  } = useApp();

  const [selectedDept, setSelectedDept] = useState('Engineering');
  const [selectedEmpId, setSelectedEmpId] = useState('MRA-005');
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '2026-07-01', to: '2026-07-31' });

  const deptEmployees = employees.filter(e => e.dept === selectedDept || selectedDept === 'All');
  const selectedEmp = employees.find(e => e.id === selectedEmpId) || employees[4];

  const empWorkTasks = workAssignments.filter(w => w.assignedEmpId === selectedEmpId || w.assignedEmpName === selectedEmp.name);
  const empLeaves = leaveRequests.filter(l => l.empId === selectedEmpId || l.empName === selectedEmp.name);

  const activeLeavesCount = leaveRequests.filter(l => l.status === 'Approved').length;
  const pendingOrdersCount = materialRequests.filter(m => m.status === 'Pending for Order').length;
  const activeTasksCount = workAssignments.filter(w => w.status === 'Accepted' || w.status === 'In Progress').length;
  const completedWeeklyCount = workAssignments.filter(w => w.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Building2 size={16} /> Enterprise Operations Center • https://MRA.KYVERA.git
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Executive & Workload Analytics</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.title}). Org-wide department metrics & employee drill-down.
          </p>
        </div>

        <button
          onClick={() => exportToExcel(workAssignments, `Kyvera_Work_Log_${Date.now()}.csv`)}
          className="kyvera-btn-secondary text-xs"
        >
          <FileSpreadsheet size={15} className="text-emerald-400" /> Export Work Logs CSV
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-card border border-cyan-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Active Work Requests</div>
            <div className="text-2xl font-extrabold text-white mt-1">{activeTasksCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">In Progress Across Teams</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <ArrowLeftRight size={20} />
          </div>
        </div>

        <div className="p-4 rounded-xl glass-card border border-amber-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pending Orders To-Do</div>
            <div className="text-2xl font-extrabold text-white mt-1">{pendingOrdersCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Action Required by Inventory</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400">
            <Package size={20} />
          </div>
        </div>

        <div className="p-4 rounded-xl glass-card border border-emerald-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Weekly Completed Tasks</div>
            <div className="text-2xl font-extrabold text-white mt-1">{completedWeeklyCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Delivered & Verified ✅</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="p-4 rounded-xl glass-card border border-purple-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Employees On Leave</div>
            <div className="text-2xl font-extrabold text-white mt-1">{activeLeavesCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Active Approved Leaves</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400">
            <Calendar size={20} />
          </div>
        </div>
      </div>

      {/* CEO / Founder Department & Employee Drill-Down Selector */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Users size={18} className="text-cyan-400" /> Department & Employee Performance Drill-Down
            </h2>
            <p className="text-xs text-slate-400">Select department and employee to view complete historical work logs & leave balance.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold">Dept:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="kyvera-input py-1 text-xs"
              >
                <option value="All">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold">Employee Dropdown:</span>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="kyvera-input py-1 text-xs"
              >
                {deptEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.dept} - {emp.role})</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsEmpModalOpen(true)}
              className="kyvera-btn-primary text-xs"
            >
              Open Full Performance Modal <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Selected Employee Snapshot Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Employee</span>
            <div className="font-extrabold text-sm text-white mt-0.5">{selectedEmp.name}</div>
            <div className="text-[11px] text-cyan-400">{selectedEmp.id} • {selectedEmp.dept} ({selectedEmp.role})</div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Current Work Load</span>
            <div className="font-extrabold text-sm text-amber-300 mt-0.5">
              {empWorkTasks.filter(t => t.status === 'Accepted' || t.status === 'In Progress').length} Active Requests
            </div>
            <div className="text-[10px] text-slate-400">Past Completed: {empWorkTasks.filter(t => t.status === 'Completed').length}</div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Leave Balance & Status</span>
            <div className="font-extrabold text-sm text-emerald-300 mt-0.5">
              EL: {selectedEmp.leaveBalance?.EL || 12} | CL: {selectedEmp.leaveBalance?.CL || 8}
            </div>
            <div className="text-[10px] text-slate-400">
              Status: <span className={selectedEmp.onLeave ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{selectedEmp.onLeave ? 'On Leave' : 'At Work'}</span>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => setIsEmpModalOpen(true)}
              className="kyvera-btn-secondary text-xs w-full sm:w-auto"
            >
              Inspect Work Log Range
            </button>
          </div>
        </div>
      </div>

      {/* Project Coordinator Workload Heatmap */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-cyan-400" /> Project Coordinator Workload Analytics (Past Week)
          </span>
          <span className="text-[11px] text-cyan-300 font-bold">Team Workload Load Rating</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {departments.slice(0, 3).map((dept) => {
            const deptTasks = workAssignments.filter(w => w.toDept === dept || w.fromDept === dept);
            const highLoad = deptTasks.length >= 2;
            return (
              <div key={dept} className={`p-4 rounded-xl border text-xs space-y-2 ${
                highLoad ? 'bg-amber-950/20 border-amber-500/40' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-sm">{dept} Dept</span>
                  {highLoad && <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[9px] font-bold">High Workload Alert</span>}
                </div>
                <div className="text-slate-300">Active Requests Assigned: <strong className="text-white">{deptTasks.length}</strong></div>
                <div className="text-slate-400">Completed Past Week: <strong className="text-emerald-400">{deptTasks.filter(t => t.status === 'Completed').length}</strong></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Employee Analytics Modal */}
      {isEmpModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsEmpModalOpen(false)}
          title={`Employee Performance & Work Log: ${selectedEmp.name}`}
          icon={Users}
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div><span className="text-slate-400 block text-[10px]">Employee ID</span><strong className="text-white">{selectedEmp.id}</strong></div>
              <div><span className="text-slate-400 block text-[10px]">Department</span><strong className="text-cyan-400">{selectedEmp.dept}</strong></div>
              <div><span className="text-slate-400 block text-[10px]">Role</span><strong className="text-emerald-400">{selectedEmp.role}</strong></div>
              <div><span className="text-slate-400 block text-[10px]">Email</span><span className="text-slate-200">{selectedEmp.email}</span></div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex-wrap">
              <span className="font-bold text-slate-300">Filter Date Range:</span>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="kyvera-input py-1 text-xs max-w-[140px]"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="kyvera-input py-1 text-xs max-w-[140px]"
              />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Work Requests Log ({empWorkTasks.length})
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {empWorkTasks.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">No work requests found for this employee.</div>
                ) : (
                  empWorkTasks.map(task => (
                    <div key={task.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-white">{task.projectName}</span>
                        <span className="text-cyan-400">{task.status} ({task.progress}%)</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        From: {task.fromDept} ({task.assignerName}) • Assigned: {task.assignedDate}
                      </div>
                      <div className="text-emerald-400 text-[11px] font-semibold">
                        Completion Duration: {task.completionDays ? `${task.completionDays} Days` : 'In Progress'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsEmpModalOpen(false)}
                className="kyvera-btn-primary text-xs"
              >
                Close Profile Modal
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
