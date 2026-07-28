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
  UserCheck,
  Building2,
  User,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WorkTransferModule = ({ onInspectDetail }) => {
  const { 
    currentUser, 
    registeredAccounts,
    workAssignments, 
    departments, 
    assignWorkTask, 
    updateWorkTaskStatus,
    setActiveTab,
    completionNotification,
    setCompletionNotification
  } = useApp();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);

  // Exact Work Alloter Form Fields requested by user:
  // 1. Name of employee, 2. From dept, 3. To dept, 4. Choose employee from drop-down, 5. Type project name, 6. Hardware & doc related info MANDATORY, 7. Requirement (Emergency/quick/general)
  const [taskData, setTaskData] = useState({
    alloterName: currentUser?.name || '',
    fromDept: currentUser?.dept || 'Operations',
    toDept: 'Engineering',
    assignedEmpId: '',
    assignedEmpName: '',
    projectName: '',
    hardwareDetails: '',
    docDetails: '',
    priority: 'Emergency'
  });

  const isExecutive = ['CEO', 'COORDINATOR', 'TEAM_LEAD', 'HR'].includes(currentUser?.id);

  // Access Control: Executives see all work updates; Employee sees ONLY their received/assigned work data!
  const visibleTasks = isExecutive 
    ? workAssignments 
    : workAssignments.filter(t => t.assignedEmpId === currentUser?.empId || t.alloterName === currentUser?.name);

  const selectedTask = visibleTasks[activeTaskIndex] || visibleTasks[0] || null;

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!taskData.hardwareDetails || !taskData.docDetails) {
      alert('Hardware and Documentation related info is MANDATORY before creating request.');
      return;
    }

    const assignedAcc = registeredAccounts.find(acc => acc.empId === taskData.assignedEmpId) || {
      empId: taskData.assignedEmpId || 'MRA-999',
      name: taskData.assignedEmpName || 'Target Employee'
    };

    assignWorkTask({
      alloterName: currentUser?.name || 'Alloter',
      fromDept: currentUser?.dept || 'Operations',
      toDept: taskData.toDept,
      assignedEmpId: assignedAcc.empId,
      assignedEmpName: assignedAcc.name || taskData.assignedEmpName,
      projectName: taskData.projectName,
      hardwareDetails: taskData.hardwareDetails,
      docDetails: taskData.docDetails,
      priority: taskData.priority
    });

    setIsAssignModalOpen(false);
    confetti({ particleCount: 50, spread: 60 });
  };

  const getTaskStep = (task) => {
    if (!task) return 1;
    if (task.status === 'Completed') return 4;
    if (task.status === 'In Progress') return 3;
    if (task.status === 'Accepted' || task.hardwareConfirmed) return 2;
    return 1;
  };

  const activeStep = selectedTask ? getTaskStep(selectedTask) : 1;

  return (
    <div className="space-y-8 w-full">
      {/* Pop notification when requested work has been completed */}
      {completionNotification && (
        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-300 shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles size={24} className="text-emerald-600 animate-bounce" />
            <div>
              <div className="text-base font-extrabold text-emerald-900">Requested Work Has Been Completed! 🎉</div>
              <div className="text-xs text-emerald-700 font-bold">
                Task "<strong className="text-slate-900">{completionNotification.taskName}</strong>" was completed by <strong className="text-slate-900">{completionNotification.completedBy}</strong> ({completionNotification.toDept}).
              </div>
            </div>
          </div>
          <button
            onClick={() => setCompletionNotification(null)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-extrabold cursor-pointer"
          >
            Dismiss Notification
          </button>
        </div>
      )}

      {/* Top Banner with Task Selector & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="text-xs font-extrabold text-cyan-700 uppercase tracking-widest">
            Transfer Track of Work
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">WORK TRANSFER & TRACKING LOGS</h1>
          <p className="text-sm text-slate-500 font-semibold mt-0.5">
            {isExecutive ? 'Organization-wide Work Updates Database' : 'Your Personal Work Logs & Assigned Tasks Portal'}
          </p>
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
            <Plus size={18} /> Work Alloter: Create Request
          </button>
        </div>
      </div>

      {/* Main Work Tracker Stepper Component */}
      <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm space-y-8">
        {/* Title Block */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">WORK TRACKER LEVEL-BY-LEVEL</h2>
          <p className="text-sm text-slate-500 font-bold">Track request progression from creation to completion</p>
        </div>

        {/* 4 Connected Circular Step Nodes */}
        <div className="relative max-w-4xl mx-auto py-6">
          <div className="absolute top-1/2 left-12 right-12 -translate-y-1/2 h-2 bg-slate-200 rounded-full z-0" />
          <div 
            className="absolute top-1/2 left-12 -translate-y-1/2 h-2 bg-gradient-to-r from-blue-600 via-emerald-600 to-purple-600 rounded-full z-0 transition-all duration-500"
            style={{ 
              width: activeStep === 1 ? '0%' : activeStep === 2 ? '33%' : activeStep === 3 ? '66%' : '85%' 
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                activeStep >= 1 ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-md' : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}>
                <FileText size={28} />
              </div>
              <span className="text-xs font-extrabold tracking-wider text-blue-700 uppercase">1. ALLOTTED</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                activeStep >= 2 ? 'bg-emerald-50 border-emerald-600 text-emerald-600 shadow-md' : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}>
                <CheckCircle2 size={28} />
              </div>
              <span className="text-xs font-extrabold tracking-wider text-emerald-700 uppercase">2. ACCEPTED (HW & DOC)</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                activeStep >= 3 ? 'bg-amber-50 border-amber-500 text-amber-600 shadow-md' : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}>
                <Settings size={28} />
              </div>
              <span className="text-xs font-extrabold tracking-wider text-amber-700 uppercase">3. IN PROGRESS</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                activeStep >= 4 ? 'bg-purple-50 border-purple-600 text-purple-600 shadow-md' : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}>
                <Flag size={28} />
              </div>
              <span className="text-xs font-extrabold tracking-wider text-purple-700 uppercase">4. COMPLETE ✅</span>
            </div>
          </div>
        </div>

        {/* Receiver Employee Actions & Selected Task Card */}
        {selectedTask ? (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm border-b border-slate-200 pb-4 gap-3">
              <div className="font-extrabold text-slate-900 text-base">
                Project Name: <span className="text-cyan-700">{selectedTask.projectName}</span>
              </div>
              <div className="text-slate-700 font-bold">
                Work Alloter: <span className="text-slate-900 font-extrabold">{selectedTask.alloterName} ({selectedTask.fromDept})</span> → Receiver: <span className="text-teal-700 font-extrabold">{selectedTask.assignedEmpName} ({selectedTask.toDept})</span>
              </div>
            </div>

            {/* MANDATORY Hardware & Doc info display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <div className="font-extrabold text-cyan-800 flex items-center justify-between">
                  <span>MANDATORY Hardware Info:</span>
                  {selectedTask.hardwareConfirmed && <span className="text-emerald-600 text-xs font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">Received ✅</span>}
                </div>
                <p className="text-slate-800 font-semibold">{selectedTask.hardwareDetails}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <div className="font-extrabold text-emerald-800 flex items-center justify-between">
                  <span>MANDATORY Documentation SOP:</span>
                  {selectedTask.docConfirmed && <span className="text-emerald-600 text-xs font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">Received ✅</span>}
                </div>
                <p className="text-slate-800 font-semibold">{selectedTask.docDetails}</p>
              </div>
            </div>

            {/* Receiver Employee Decision Rules:
                - Accepts request ONLY if hardware and doc received.
                - Rejects if working another emergency work.
                - Requests material required if needed.
                - Updates to Complete ✅ */}
            <div className="flex items-center justify-between pt-2 flex-wrap gap-4 border-t border-slate-200">
              <button
                onClick={() => onInspectDetail && onInspectDetail(selectedTask, 'work')}
                className="kyvera-btn-secondary text-xs font-extrabold shadow-xs flex items-center gap-2 cursor-pointer"
              >
                Inspect Detailed Database Log <ArrowRight size={16} />
              </button>

              <div className="flex items-center gap-3 flex-wrap">
                {selectedTask.status === 'Assigned' && (
                  <>
                    <button
                      onClick={() => {
                        updateWorkTaskStatus(selectedTask.id, 'Accepted');
                        confetti({ particleCount: 40 });
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                      title="Only accepts if hardware and doc received"
                    >
                      <CheckCircle2 size={16} /> Accept (HW & Doc Received)
                    </button>
                    <button
                      onClick={() => updateWorkTaskStatus(selectedTask.id, 'Rejected')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                      title="Rejects if working another emergency work"
                    >
                      <XCircle size={16} /> Reject (Working Emergency Work)
                    </button>
                  </>
                )}

                {(selectedTask.status === 'Accepted' || selectedTask.status === 'In Progress') && (
                  <>
                    <button
                      onClick={() => setActiveTab('material')}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-cyan-800 rounded-xl border border-slate-300 font-extrabold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <PackagePlus size={16} /> Request Material Required
                    </button>
                    <button
                      onClick={() => {
                        updateWorkTaskStatus(selectedTask.id, 'Completed');
                        confetti({ particleCount: 80, spread: 70 });
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 size={16} /> Update to Complete ✅
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-600 text-sm font-extrabold">No work assignments found in database logs.</p>
            <p className="text-xs text-slate-400 font-semibold mt-1">Use "Work Alloter: Create Request" to add your first work request.</p>
          </div>
        )}
      </div>

      {/* Work Alloter Modal with Exact Requested Fields */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Work Alloter: Create Request"
        icon={FileText}
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">1. Name of Employee (Alloter) *</label>
              <input
                type="text"
                required
                value={taskData.alloterName}
                onChange={(e) => setTaskData({ ...taskData, alloterName: e.target.value })}
                className="kyvera-input font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">2. From Dept *</label>
              <select
                value={taskData.fromDept}
                onChange={(e) => setTaskData({ ...taskData, fromDept: e.target.value })}
                className="kyvera-input font-bold"
              >
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">3. To Dept *</label>
              <select
                value={taskData.toDept}
                onChange={(e) => setTaskData({ ...taskData, toDept: e.target.value })}
                className="kyvera-input font-bold"
              >
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">4. Choose Employee from Drop-Down *</label>
              <select
                value={taskData.assignedEmpId}
                onChange={(e) => {
                  const acc = registeredAccounts.find(a => a.empId === e.target.value);
                  setTaskData({ 
                    ...taskData, 
                    assignedEmpId: e.target.value,
                    assignedEmpName: acc ? acc.name : ''
                  });
                }}
                className="kyvera-input font-bold"
              >
                <option value="">Select Employee...</option>
                {registeredAccounts.map(acc => (
                  <option key={acc.empId} value={acc.empId}>{acc.name} ({acc.empId} - {acc.dept})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">5. Type Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. KYVERA Automation System Rev-3"
              value={taskData.projectName}
              onChange={(e) => setTaskData({ ...taskData, projectName: e.target.value })}
              className="kyvera-input font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              6. Hardware Info * <span className="text-cyan-700 font-extrabold">(MANDATORY)</span>
            </label>
            <input
              type="text"
              required
              placeholder="Hardware details, chassis rig, serial no..."
              value={taskData.hardwareDetails}
              onChange={(e) => setTaskData({ ...taskData, hardwareDetails: e.target.value })}
              className="kyvera-input font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              6. Doc Info * <span className="text-teal-700 font-extrabold">(MANDATORY)</span>
            </label>
            <input
              type="text"
              required
              placeholder="Documentation link, SOP blueprint, specification..."
              value={taskData.docDetails}
              onChange={(e) => setTaskData({ ...taskData, docDetails: e.target.value })}
              className="kyvera-input font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">7. Requirement *</label>
            <select
              value={taskData.priority}
              onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
              className="kyvera-input font-bold"
            >
              <option value="Emergency">Emergency</option>
              <option value="Quick">Quick</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button type="button" onClick={() => setIsAssignModalOpen(false)} className="kyvera-btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="kyvera-btn-primary text-xs">
              Creates Request to Database Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
