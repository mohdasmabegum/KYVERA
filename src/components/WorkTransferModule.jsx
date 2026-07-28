import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from './Modal';
import { 
  FileText, 
  CheckCircle2, 
  Settings, 
  Flag, 
  BarChart3, 
  Calendar, 
  Plus, 
  XCircle, 
  PackagePlus, 
  Sliders, 
  UserCheck,
  Building2,
  User,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WorkTransferModule = ({ onInspectDetail }) => {
  const { 
    currentUser, 
    workAssignments, 
    employees, 
    departments, 
    assignWorkTask, 
    updateWorkTaskStatus,
    setActiveTab 
  } = useApp();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTaskForProgress, setSelectedTaskForProgress] = useState(null);
  const [progressVal, setProgressVal] = useState(50);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);

  // Form State
  const [taskData, setTaskData] = useState({
    toDept: 'Engineering',
    assignedEmpId: 'MRA-005',
    projectName: '',
    hardwareDetails: '',
    docDetails: '',
    priority: 'Emergency'
  });

  const isExecutive = ['CEO', 'HR', 'COORDINATOR', 'TEAM_LEAD'].includes(currentUser.id);
  const visibleTasks = isExecutive 
    ? workAssignments 
    : workAssignments.filter(t => t.assignedEmpId === currentUser.empId || t.assignerName === currentUser.name);

  const selectedTask = visibleTasks[activeTaskIndex] || visibleTasks[0] || null;

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!taskData.hardwareDetails || !taskData.docDetails) {
      alert('Both Hardware Details and Documentation Details are MANDATORY for work transfer.');
      return;
    }

    const assignedEmp = employees.find(emp => emp.id === taskData.assignedEmpId) || employees[4];

    assignWorkTask({
      toDept: taskData.toDept,
      assignedEmpId: assignedEmp.id,
      assignedEmpName: assignedEmp.name,
      projectName: taskData.projectName,
      hardwareDetails: taskData.hardwareDetails,
      docDetails: taskData.docDetails,
      priority: taskData.priority
    });

    setIsAssignModalOpen(false);
    setTaskData({
      toDept: 'Engineering',
      assignedEmpId: 'MRA-005',
      projectName: '',
      hardwareDetails: '',
      docDetails: '',
      priority: 'Emergency'
    });
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleProgressSave = () => {
    if (selectedTaskForProgress) {
      const isDone = progressVal === 100;
      updateWorkTaskStatus(
        selectedTaskForProgress.id, 
        isDone ? 'Completed' : 'In Progress', 
        { progress: progressVal }
      );
      if (isDone) confetti({ particleCount: 80, spread: 70 });
      setSelectedTaskForProgress(null);
    }
  };

  const getTaskStep = (task) => {
    if (!task) return 1;
    if (task.status === 'Completed') return 4;
    if (task.status === 'In Progress' || task.progress > 0) return 3;
    if (task.status === 'Accepted' || task.hardwareConfirmed) return 2;
    return 1;
  };

  const activeStep = selectedTask ? getTaskStep(selectedTask) : 1;

  return (
    <div className="space-y-8 w-full">
      {/* Top Banner with Task Selector & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="text-xs font-extrabold text-cyan-700 uppercase tracking-widest">
            Work Transfer & Task Tracking
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">WORK TRACKER</h1>
          <p className="text-sm text-slate-500 font-semibold mt-0.5">Track the progress of work requests level-by-level</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {visibleTasks.length > 0 && (
            <select
              value={activeTaskIndex}
              onChange={(e) => setActiveTaskIndex(Number(e.target.value))}
              className="kyvera-input py-2.5 text-sm font-extrabold text-slate-800"
            >
              {visibleTasks.map((t, idx) => (
                <option key={t.id} value={idx}>
                  {t.projectName} ({t.status})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="kyvera-btn-primary py-3 px-6 text-sm font-extrabold shadow-md"
          >
            <Plus size={18} /> Create Work Request
          </button>
        </div>
      </div>

      {/* Main Work Tracker Stepper Component */}
      <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm space-y-8">
        {/* Title Block */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">WORK TRACKER LEVEL-BY-LEVEL</h2>
          <p className="text-sm text-slate-500 font-bold">Track the progress of your request</p>
        </div>

        {/* 4 Connected Circular Step Nodes with Connecting Bar */}
        <div className="relative max-w-4xl mx-auto py-6">
          <div className="absolute top-1/2 left-12 right-12 -translate-y-1/2 h-2 bg-slate-200 rounded-full z-0" />

          <div 
            className="absolute top-1/2 left-12 -translate-y-1/2 h-2 bg-gradient-to-r from-blue-600 via-emerald-600 to-amber-500 rounded-full z-0 transition-all duration-500"
            style={{ 
              width: activeStep === 1 ? '0%' : activeStep === 2 ? '33%' : activeStep === 3 ? '66%' : '85%' 
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            {/* Step 1: REQUESTED */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                activeStep >= 1 
                  ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-md' 
                  : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}>
                <FileText size={28} />
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow">
                1
              </div>
              <span className="text-xs font-extrabold tracking-wider text-blue-700 uppercase">
                REQUESTED
              </span>
            </div>

            {/* Step 2: ACCEPTED */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                activeStep >= 2 
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-600 shadow-md' 
                  : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}>
                <CheckCircle2 size={28} />
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow">
                2
              </div>
              <span className="text-xs font-extrabold tracking-wider text-emerald-700 uppercase">
                ACCEPTED
              </span>
            </div>

            {/* Step 3: IN PROGRESS */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                activeStep >= 3 
                  ? 'bg-amber-50 border-amber-500 text-amber-600 shadow-md' 
                  : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}>
                <Settings size={28} />
              </div>
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center shadow">
                3
              </div>
              <span className="text-xs font-extrabold tracking-wider text-amber-700 uppercase">
                IN PROGRESS
              </span>
            </div>

            {/* Step 4: COMPLETED */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                activeStep >= 4 
                  ? 'bg-purple-50 border-purple-600 text-purple-600 shadow-md' 
                  : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}>
                <Flag size={28} />
              </div>
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow">
                4
              </div>
              <span className="text-xs font-extrabold tracking-wider text-purple-700 uppercase">
                COMPLETED
              </span>
            </div>
          </div>
        </div>

        {/* 4 Cards Array */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-6 rounded-2xl border transition-all ${
            activeStep >= 1 ? 'bg-blue-50/80 border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center gap-2 text-blue-700 font-extrabold text-sm mb-2">
              <FileText size={18} /> REQUESTED
            </div>
            <div className="h-0.5 bg-blue-200 mb-3" />
            <p className="text-sm text-slate-800 font-bold min-h-[48px] leading-relaxed">
              Your request has been submitted successfully and is awaiting review.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600 font-extrabold">
              <Calendar size={14} className="text-blue-600" />
              <span>{selectedTask ? selectedTask.assignedDate : '12 May 2025, 10:30 AM'}</span>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border transition-all ${
            activeStep >= 2 ? 'bg-emerald-50/80 border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm mb-2">
              <CheckCircle2 size={18} /> ACCEPTED
            </div>
            <div className="h-0.5 bg-emerald-200 mb-3" />
            <p className="text-sm text-slate-800 font-bold min-h-[48px] leading-relaxed">
              Your request has been accepted and assigned to the relevant team.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600 font-extrabold">
              <Calendar size={14} className="text-emerald-600" />
              <span>{activeStep >= 2 ? (selectedTask?.assignedDate || '12 May 2025, 11:15 AM') : '—'}</span>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border transition-all ${
            activeStep >= 3 ? 'bg-amber-50/80 border-amber-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center gap-2 text-amber-700 font-extrabold text-sm mb-2">
              <Settings size={18} /> IN PROGRESS
            </div>
            <div className="h-0.5 bg-amber-200 mb-3" />
            <p className="text-sm text-slate-800 font-bold min-h-[48px] leading-relaxed">
              The work is currently in progress. The team is actively executing.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600 font-extrabold">
              <Calendar size={14} className="text-amber-600" />
              <span>{activeStep >= 3 ? `${selectedTask?.progress || 50}% Completed` : '—'}</span>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border transition-all ${
            activeStep >= 4 ? 'bg-purple-50/80 border-purple-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center gap-2 text-purple-700 font-extrabold text-sm mb-2">
              <Flag size={18} /> COMPLETED
            </div>
            <div className="h-0.5 bg-purple-200 mb-3" />
            <p className="text-sm text-slate-800 font-bold min-h-[48px] leading-relaxed">
              The work has been completed successfully and marked as done.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600 font-extrabold">
              <Calendar size={14} className="text-purple-600" />
              <span>{activeStep >= 4 ? (selectedTask?.completedDate || 'Completed ✅') : '—'}</span>
            </div>
          </div>
        </div>

        {/* Selected Task Details */}
        {selectedTask && (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm border-b border-slate-200 pb-4 gap-3">
              <div className="font-extrabold text-slate-900 text-base">
                Task Name: <span className="text-cyan-700">{selectedTask.projectName}</span>
              </div>
              <div className="text-slate-700 font-bold">
                From: <span className="text-slate-900 font-extrabold">{selectedTask.fromDept} ({selectedTask.assignerName})</span> → To: <span className="text-teal-700 font-extrabold">{selectedTask.toDept} ({selectedTask.assignedEmpName})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <div className="font-extrabold text-cyan-800 flex items-center justify-between">
                  <span>Mandatory Hardware Details:</span>
                  {selectedTask.hardwareConfirmed && <span className="text-emerald-600 text-xs font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">Confirmed ✅</span>}
                </div>
                <p className="text-slate-800 font-semibold">{selectedTask.hardwareDetails}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <div className="font-extrabold text-emerald-800 flex items-center justify-between">
                  <span>Mandatory Documentation SOP:</span>
                  {selectedTask.docConfirmed && <span className="text-emerald-600 text-xs font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">Confirmed ✅</span>}
                </div>
                <p className="text-slate-800 font-semibold">{selectedTask.docDetails}</p>
              </div>
            </div>

            {/* Action Buttons & Inspect Full Page Button */}
            <div className="flex items-center justify-between pt-2 flex-wrap gap-4">
              <button
                onClick={() => onInspectDetail && onInspectDetail(selectedTask, 'work')}
                className="kyvera-btn-secondary text-xs font-extrabold shadow-xs flex items-center gap-2 cursor-pointer"
              >
                Inspect Detailed Full-Page View <ArrowRight size={16} />
              </button>

              <div className="flex items-center gap-3 flex-wrap">
                {selectedTask.status === 'Assigned' && (
                  <>
                    <button
                      onClick={() => {
                        updateWorkTaskStatus(selectedTask.id, 'Accepted', { hardwareConfirmed: true, docConfirmed: true, progress: 25 });
                        confetti({ particleCount: 40 });
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 size={16} /> Accept Task
                    </button>
                    <button
                      onClick={() => updateWorkTaskStatus(selectedTask.id, 'Rejected')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <XCircle size={16} /> Reject Task
                    </button>
                  </>
                )}

                {(selectedTask.status === 'Accepted' || selectedTask.status === 'In Progress') && (
                  <>
                    <button
                      onClick={() => setActiveTab('material')}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-cyan-800 rounded-xl border border-slate-300 font-extrabold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <PackagePlus size={16} /> Request Material
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTaskForProgress(selectedTask);
                        setProgressVal(selectedTask.progress || 50);
                      }}
                      className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Sliders size={16} /> Update Progress
                    </button>
                    <button
                      onClick={() => {
                        updateWorkTaskStatus(selectedTask.id, 'Completed');
                        confetti({ particleCount: 80, spread: 70 });
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 size={16} /> Mark Completed ✅
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Summary Updated with Specific Person Names and Dept Names */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-3">
            <BarChart3 size={20} className="text-cyan-700" />
            <div className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">REQUEST PROGRESS SUMMARY</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs flex-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-blue-200 flex items-center gap-3">
              <User size={18} className="text-blue-600" />
              <div>
                <span className="text-[11px] text-slate-500 block font-extrabold">Requested By:</span>
                <span className="font-extrabold text-blue-900 text-sm">{selectedTask ? selectedTask.assignerName : 'Vikram Seth'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-emerald-200 flex items-center gap-3">
              <UserCheck size={18} className="text-emerald-600" />
              <div>
                <span className="text-[11px] text-slate-500 block font-extrabold">Accepted By:</span>
                <span className="font-extrabold text-emerald-900 text-sm">{selectedTask ? selectedTask.assignedEmpName : 'Suresh Kumar'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-amber-200 flex items-center gap-3">
              <Building2 size={18} className="text-amber-600" />
              <div>
                <span className="text-[11px] text-slate-500 block font-extrabold">In Progress In Dept:</span>
                <span className="font-extrabold text-amber-900 text-sm">{selectedTask ? selectedTask.toDept : 'Engineering'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-purple-200 flex items-center gap-3">
              <Flag size={18} className="text-purple-600" />
              <div>
                <span className="text-[11px] text-slate-500 block font-extrabold">Completed By Dept:</span>
                <span className="font-extrabold text-purple-900 text-sm">{selectedTask?.status === 'Completed' ? selectedTask.toDept : 'Quality Assurance'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign New Task Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Create Work Request"
        icon={FileText}
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. KYVERA Automation Rig v2"
              value={taskData.projectName}
              onChange={(e) => setTaskData({ ...taskData, projectName: e.target.value })}
              className="kyvera-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Target Department *</label>
              <select
                value={taskData.toDept}
                onChange={(e) => setTaskData({ ...taskData, toDept: e.target.value })}
                className="kyvera-input font-bold"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Select Employee *</label>
              <select
                value={taskData.assignedEmpId}
                onChange={(e) => setTaskData({ ...taskData, assignedEmpId: e.target.value })}
                className="kyvera-input font-bold"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.dept})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              Mandatory Hardware Related Info * <span className="text-cyan-700 font-extrabold">(Required)</span>
            </label>
            <input
              type="text"
              required
              placeholder="Hardware details, chassis rig, serial no..."
              value={taskData.hardwareDetails}
              onChange={(e) => setTaskData({ ...taskData, hardwareDetails: e.target.value })}
              className="kyvera-input"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              Mandatory Documentation Info * <span className="text-teal-700 font-extrabold">(Required)</span>
            </label>
            <input
              type="text"
              required
              placeholder="Documentation link, SOP reference, blueprint..."
              value={taskData.docDetails}
              onChange={(e) => setTaskData({ ...taskData, docDetails: e.target.value })}
              className="kyvera-input"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Requirement Priority *</label>
            <select
              value={taskData.priority}
              onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
              className="kyvera-input font-bold"
            >
              <option value="General">General</option>
              <option value="Quick">Quick</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-bold">
            Work Alloter: <span className="text-slate-900 font-extrabold">{currentUser.name}</span> ({currentUser.dept})
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="kyvera-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="kyvera-btn-primary text-xs"
            >
              Create Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
