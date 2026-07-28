import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../Modal';
import { 
  Users, 
  Calendar, 
  Package, 
  ArrowLeftRight, 
  CheckCircle2, 
  TrendingUp,
  Building2,
  ChevronRight,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard = ({ onInspectDetail }) => {
  const { 
    currentUser, 
    employees, 
    departments, 
    leaveRequests, 
    materialRequests, 
    workAssignments, 
    exportToExcel
  } = useApp();

  const [selectedDept, setSelectedDept] = useState('Engineering');
  const [selectedEmpId, setSelectedEmpId] = useState('MRA-005');
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '2026-07-01', to: '2026-07-31' });

  const deptEmployees = employees.filter(e => e.dept === selectedDept || selectedDept === 'All');
  const selectedEmp = employees.find(e => e.id === selectedEmpId) || employees[4];

  const empWorkTasks = workAssignments.filter(w => w.assignedEmpId === selectedEmpId || w.assignedEmpName === selectedEmp.name);

  const activeLeavesCount = leaveRequests.filter(l => l.status === 'Approved').length;
  const pendingOrdersCount = materialRequests.filter(m => m.status === 'Pending for Order').length;
  const activeTasksCount = workAssignments.filter(w => w.status === 'Accepted' || w.status === 'In Progress').length;
  const completedWeeklyCount = workAssignments.filter(w => w.status === 'Completed').length;

  return (
    <div className="space-y-8 w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-700 uppercase tracking-widest">
            <Building2 size={18} /> Enterprise Operations Center
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Executive & Workload Analytics</h1>
          <p className="text-sm text-slate-500 font-semibold mt-0.5">
            Logged in as <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.title}). Org-wide department metrics & employee drill-down.
          </p>
        </div>

        <button
          onClick={() => exportToExcel(workAssignments, `Kyvera_Work_Log_${Date.now()}.csv`)}
          className="kyvera-btn-secondary py-3 px-5 text-sm font-extrabold"
        >
          <FileSpreadsheet size={18} className="text-emerald-600" /> Export Work Logs CSV
        </button>
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
            <div className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Weekly Completed Tasks</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{completedWeeklyCount}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Delivered & Verified ✅</div>
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

      {/* CEO / Founder Department & Employee Drill-Down Selector */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Users size={22} className="text-cyan-700" /> Department & Employee Performance Drill-Down
            </h2>
            <p className="text-sm text-slate-500 font-semibold mt-0.5">Select department and employee to view complete historical work logs & leave balance.</p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-700 font-bold">Dept:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="kyvera-input py-2 text-sm font-extrabold text-slate-800"
              >
                <option value="All">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-700 font-bold">Employee Dropdown:</span>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="kyvera-input py-2 text-sm font-extrabold text-slate-800"
              >
                {deptEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.dept} - {emp.role})</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsEmpModalOpen(true)}
              className="kyvera-btn-primary text-xs font-extrabold shrink-0 py-2.5 px-5"
            >
              Open Performance Modal <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Selected Employee Snapshot Card */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Selected Employee</span>
            <div className="font-extrabold text-base text-slate-900 mt-1">{selectedEmp.name}</div>
            <div className="text-xs text-cyan-800 font-extrabold mt-0.5">{selectedEmp.id} • {selectedEmp.dept} ({selectedEmp.role})</div>
          </div>

          <div>
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Current Work Load</span>
            <div className="font-extrabold text-base text-amber-700 mt-1">
              {empWorkTasks.filter(t => t.status === 'Accepted' || t.status === 'In Progress').length} Active Requests
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Past Completed: {empWorkTasks.filter(t => t.status === 'Completed').length}</div>
          </div>

          <div>
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Leave Balance & Status</span>
            <div className="font-extrabold text-base text-emerald-700 mt-1">
              EL: {selectedEmp.leaveBalance?.EL || 12} | CL: {selectedEmp.leaveBalance?.CL || 8}
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">
              Status: <span className={selectedEmp.onLeave ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>{selectedEmp.onLeave ? 'On Leave' : 'At Work'}</span>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => setIsEmpModalOpen(true)}
              className="kyvera-btn-secondary text-xs font-extrabold w-full sm:w-auto py-2.5 px-4"
            >
              Inspect Work Log Range
            </button>
          </div>
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
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><span className="text-slate-500 block text-xs font-bold uppercase">Employee ID</span><strong className="text-slate-900 text-base">{selectedEmp.id}</strong></div>
              <div><span className="text-slate-500 block text-xs font-bold uppercase">Department</span><strong className="text-cyan-700 text-base">{selectedEmp.dept}</strong></div>
              <div><span className="text-slate-500 block text-xs font-bold uppercase">Role</span><strong className="text-emerald-700 text-base">{selectedEmp.role}</strong></div>
              <div><span className="text-slate-500 block text-xs font-bold uppercase">Email</span><span className="text-slate-800 font-bold">{selectedEmp.email}</span></div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100 border border-slate-200 text-sm flex-wrap">
              <span className="font-extrabold text-slate-800">Filter Date Range:</span>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="kyvera-input py-1.5 text-xs max-w-[150px] font-bold"
              />
              <span className="text-slate-500 font-bold">to</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="kyvera-input py-1.5 text-xs max-w-[150px] font-bold"
              />
            </div>

            <div className="space-y-3">
              <div className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Work Requests Log ({empWorkTasks.length})
              </div>

              <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                {empWorkTasks.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-sm font-bold">No work requests found for this employee.</div>
                ) : (
                  empWorkTasks.map(task => (
                    <div key={task.id} className="p-4 rounded-2xl bg-white border border-slate-200 text-sm space-y-2 shadow-xs">
                      <div className="flex items-center justify-between font-extrabold">
                        <span className="text-slate-900 text-base">{task.projectName}</span>
                        <span className="text-cyan-700 font-extrabold">{task.status} ({task.progress}%)</span>
                      </div>
                      <div className="text-slate-600 text-xs font-bold">
                        From: {task.fromDept} ({task.assignerName}) • Assigned: {task.assignedDate}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-emerald-700 text-xs font-extrabold">
                          Completion Duration: {task.completionDays ? `${task.completionDays} Days` : 'In Progress'}
                        </span>
                        <button
                          onClick={() => {
                            setIsEmpModalOpen(false);
                            onInspectDetail && onInspectDetail(task, 'work');
                          }}
                          className="text-cyan-800 font-extrabold hover:underline flex items-center gap-1 text-xs"
                        >
                          Open Detailed View Page <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => setIsEmpModalOpen(false)}
                className="kyvera-btn-primary text-xs font-extrabold py-2.5 px-5"
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
