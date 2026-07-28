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
  Cpu, 
  Check,
  Clock,
  UserCheck,
  Building2,
  AlertTriangle,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WorkTransferModule = () => {
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

  // Filter tasks based on role access:
  // CEO, HR, Coordinator, Team Lead see ALL tasks.
  // Employee sees ONLY tasks where assignedEmpId === currentUser.empId or assignerName === currentUser.name.
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

  // Helper to determine step states: 1=Requested, 2=Accepted, 3=In Progress, 4=Completed
  const getTaskStep = (task) => {
    if (!task) return 1;
    if (task.status === 'Completed') return 4;
    if (task.status === 'In Progress' || task.progress > 0) return 3;
    if (task.status === 'Accepted' || task.hardwareConfirmed) return 2;
    return 1;
  };

  const activeStep = selectedTask ? getTaskStep(selectedTask) : 1;

  return (
    <div className="space-y-6">
      {/* Top Banner with Task Selector & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div>
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Work Transfer & Task Tracking
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-0.5">WORK TRACKER</h1>
          <p className="text-xs text-slate-400">Track the progress of your request</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {visibleTasks.length > 0 && (
            <select
              value={activeTaskIndex}
              onChange={(e) => setActiveTaskIndex(Number(e.target.value))}
              className="kyvera-input py-1.5 text-xs max-w-xs"
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
            className="kyvera-btn-primary text-xs"
          >
            <Plus size={16} /> Create Work Request
          </button>
        </div>
      </div>

      {/* Main Work Tracker Component (Exact Design from Image) */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-8">
        {/* Title Block */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-white uppercase">WORK TRACKER</h2>
          <p className="text-xs text-slate-400 font-medium">Track the progress of your request</p>
        </div>

        {/* 4 Connected Circular Step Nodes with Connecting Bar */}
        <div className="relative max-w-3xl mx-auto py-4">
          <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-1 bg-slate-800 rounded-full z-0" />

          <div 
            className="absolute top-1/2 left-10 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 rounded-full z-0 transition-all duration-500"
            style={{ 
              width: activeStep === 1 ? '0%' : activeStep === 2 ? '33%' : activeStep === 3 ? '66%' : '80%' 
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            {/* Step 1: REQUESTED */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                activeStep >= 1 
                  ? 'bg-blue-950 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.6)]' 
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                <FileText size={24} />
              </div>
              <div className="w-5 h-5 rounded-full bg-blue-500 text-white font-extrabold text-[11px] flex items-center justify-center shadow-md">
                1
              </div>
              <span className="text-xs font-extrabold tracking-wider text-blue-400 uppercase">
                REQUESTED
              </span>
            </div>

            {/* Step 2: ACCEPTED */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                activeStep >= 2 
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.6)]' 
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                <CheckCircle2 size={24} />
              </div>
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white font-extrabold text-[11px] flex items-center justify-center shadow-md">
                2
              </div>
              <span className="text-xs font-extrabold tracking-wider text-emerald-400 uppercase">
                ACCEPTED
              </span>
            </div>

            {/* Step 3: IN PROGRESS */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                activeStep >= 3 
                  ? 'bg-amber-950 border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)]' 
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                <Settings size={24} className={activeStep === 3 ? 'animate-spin' : ''} />
              </div>
              <div className="w-5 h-5 rounded-full bg-amber-500 text-white font-extrabold text-[11px] flex items-center justify-center shadow-md">
                3
              </div>
              <span className="text-xs font-extrabold tracking-wider text-amber-400 uppercase">
                IN PROGRESS
              </span>
            </div>

            {/* Step 4: COMPLETED */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                activeStep >= 4 
                  ? 'bg-purple-950 border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(139,92,246,0.6)]' 
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                <Flag size={24} />
              </div>
              <div className="w-5 h-5 rounded-full bg-purple-500 text-white font-extrabold text-[11px] flex items-center justify-center shadow-md">
                4
              </div>
              <span className="text-xs font-extrabold tracking-wider text-purple-400 uppercase">
                COMPLETED
              </span>
            </div>
          </div>
        </div>

        {/* 4 Cards Array */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border transition-all ${
            activeStep >= 1 ? 'bg-blue-950/20 border-blue-500/40 shadow-lg' : 'bg-slate-900/40 border-slate-800 opacity-60'
          }`}>
            <div className="flex items-center gap-2 text-blue-400 font-extrabold text-xs mb-2">
              <FileText size={16} /> REQUESTED
            </div>
            <div className="h-0.5 bg-blue-500/30 mb-3" />
            <p className="text-xs text-slate-300 min-h-[40px]">
              Your request has been submitted successfully and is awaiting review.
            </p>
            <div className="mt-4 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Calendar size={13} className="text-blue-400" />
              <span>{selectedTask ? selectedTask.assignedDate : '12 May 2025, 10:30 AM'}</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${
            activeStep >= 2 ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg' : 'bg-slate-900/40 border-slate-800 opacity-60'
          }`}>
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs mb-2">
              <CheckCircle2 size={16} /> ACCEPTED
            </div>
            <div className="h-0.5 bg-emerald-500/30 mb-3" />
            <p className="text-xs text-slate-300 min-h-[40px]">
              Your request has been accepted and assigned to the relevant team.
            </p>
            <div className="mt-4 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Calendar size={13} className="text-emerald-400" />
              <span>{activeStep >= 2 ? (selectedTask?.assignedDate || '12 May 2025, 11:15 AM') : '—'}</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${
            activeStep >= 3 ? 'bg-amber-950/20 border-amber-500/40 shadow-lg' : 'bg-slate-900/40 border-slate-800 opacity-60'
          }`}>
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs mb-2">
              <Settings size={16} /> IN PROGRESS
            </div>
            <div className="h-0.5 bg-amber-500/30 mb-3" />
            <p className="text-xs text-slate-300 min-h-[40px]">
              The work is currently in progress. The team is working on it.
            </p>
            <div className="mt-4 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Calendar size={13} className="text-amber-400" />
              <span>{activeStep >= 3 ? `${selectedTask?.progress || 50}% Completed` : '—'}</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${
            activeStep >= 4 ? 'bg-purple-950/20 border-purple-500/40 shadow-lg' : 'bg-slate-900/40 border-slate-800 opacity-60'
          }`}>
            <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs mb-2">
              <Flag size={16} /> COMPLETED
            </div>
            <div className="h-0.5 bg-purple-500/30 mb-3" />
            <p className="text-xs text-slate-300 min-h-[40px]">
              The work has been completed successfully and marked as done.
            </p>
            <div className="mt-4 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Calendar size={13} className="text-purple-400" />
              <span>{activeStep >= 4 ? (selectedTask?.completedDate || 'Completed ✅') : '—'}</span>
            </div>
          </div>
        </div>

        {/* Selected Task Details */}
        {selectedTask && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <div className="font-extrabold text-white">
                Task Details: <span className="text-cyan-400">{selectedTask.projectName}</span>
              </div>
              <div className="text-slate-400">
                From: <span className="text-white font-bold">{selectedTask.fromDept} ({selectedTask.assignerName})</span> → To: <span className="text-emerald-400 font-bold">{selectedTask.toDept} ({selectedTask.assignedEmpName})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-bold text-cyan-400 flex items-center justify-between">
                  <span>Mandatory Hardware Details:</span>
                  {selectedTask.hardwareConfirmed && <span className="text-emerald-400 text-[10px]">Confirmed ✅</span>}
                </div>
                <p className="text-slate-300 mt-1">{selectedTask.hardwareDetails}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-bold text-emerald-400 flex items-center justify-between">
                  <span>Mandatory Documentation SOP:</span>
                  {selectedTask.docConfirmed && <span className="text-emerald-400 text-[10px]">Confirmed ✅</span>}
                </div>
                <p className="text-slate-300 mt-1">{selectedTask.docDetails}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              {selectedTask.status === 'Assigned' && (
                <>
                  <button
                    onClick={() => {
                      updateWorkTaskStatus(selectedTask.id, 'Accepted', { hardwareConfirmed: true, docConfirmed: true, progress: 25 });
                      confetti({ particleCount: 40 });
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 size={14} /> Accept Task (HW + SOP Receipt)
                  </button>
                  <button
                    onClick={() => updateWorkTaskStatus(selectedTask.id, 'Rejected')}
                    className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle size={14} /> Reject Task
                  </button>
                </>
              )}

              {(selectedTask.status === 'Accepted' || selectedTask.status === 'In Progress') && (
                <>
                  <button
                    onClick={() => setActiveTab('material')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <PackagePlus size={14} /> Request Material
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTaskForProgress(selectedTask);
                      setProgressVal(selectedTask.progress || 50);
                    }}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Sliders size={14} /> Update Progress
                  </button>
                  <button
                    onClick={() => {
                      updateWorkTaskStatus(selectedTask.id, 'Completed');
                      confetti({ particleCount: 80, spread: 70 });
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 size={14} /> Mark Completed ✅
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Bottom Summary Updated with Specific Person Names and Dept Names */}
        <div className="p-4 rounded-xl bg-slate-900/95 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <BarChart3 size={16} className="text-cyan-400" />
            <div className="text-xs font-bold text-white uppercase tracking-wider">REQUEST PROGRESS SUMMARY</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs flex-1 max-w-4xl">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-blue-500/30 flex items-center gap-2">
              <User size={14} className="text-blue-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Requested By:</span>
                <span className="font-extrabold text-blue-300">{selectedTask ? selectedTask.assignerName : 'Vikram Seth'}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/30 flex items-center gap-2">
              <UserCheck size={14} className="text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Accepted By:</span>
                <span className="font-extrabold text-emerald-300">{selectedTask ? selectedTask.assignedEmpName : 'Suresh Kumar'}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-500/30 flex items-center gap-2">
              <Building2 size={14} className="text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">In Progress In Dept:</span>
                <span className="font-extrabold text-amber-300">{selectedTask ? selectedTask.toDept : 'Engineering'}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-purple-500/30 flex items-center gap-2">
              <Flag size={14} className="text-purple-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Completed By Dept:</span>
                <span className="font-extrabold text-purple-300">{selectedTask?.status === 'Completed' ? selectedTask.toDept : 'Quality Assurance'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
            <Calendar size={15} className="text-cyan-400" />
            <div>
              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">LAST UPDATED</span>
              <span className="font-bold text-white text-[11px]">
                {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. KYVERA Automation Rig v2"
              value={taskData.projectName}
              onChange={(e) => setTaskData({ ...taskData, projectName: e.target.value })}
              className="kyvera-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Department *</label>
              <select
                value={taskData.toDept}
                onChange={(e) => setTaskData({ ...taskData, toDept: e.target.value })}
                className="kyvera-input"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Employee (Dropdown) *</label>
              <select
                value={taskData.assignedEmpId}
                onChange={(e) => setTaskData({ ...taskData, assignedEmpId: e.target.value })}
                className="kyvera-input"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.dept})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mandatory Hardware Related Info * <span className="text-cyan-400">(Required)</span>
            </label>
            <input
              type="text"
              required
              placeholder="Hardware details, chassis rig, serial no, or power harness..."
              value={taskData.hardwareDetails}
              onChange={(e) => setTaskData({ ...taskData, hardwareDetails: e.target.value })}
              className="kyvera-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mandatory Documentation Info * <span className="text-emerald-400">(Required)</span>
            </label>
            <input
              type="text"
              required
              placeholder="Documentation link, SOP reference, or specification blueprint..."
              value={taskData.docDetails}
              onChange={(e) => setTaskData({ ...taskData, docDetails: e.target.value })}
              className="kyvera-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Requirement Priority *</label>
            <select
              value={taskData.priority}
              onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
              className="kyvera-input"
            >
              <option value="General">General</option>
              <option value="Quick">Quick</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            Work Alloter: <span className="text-white font-bold">{currentUser.name}</span> ({currentUser.dept})
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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

      {/* Progress Slider Modal */}
      {selectedTaskForProgress && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTaskForProgress(null)}
          title="Update Task Progress (Stage 3)"
          icon={Sliders}
        >
          <div className="space-y-4">
            <div className="text-xs text-slate-300">
              Task: <strong className="text-white">{selectedTaskForProgress.projectName}</strong>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Completion Percentage:</span>
                <span className="text-cyan-400 text-base">{progressVal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progressVal}
                onChange={(e) => setProgressVal(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedTaskForProgress(null)}
                className="kyvera-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleProgressSave}
                className="kyvera-btn-primary text-xs"
              >
                Save Progress
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
