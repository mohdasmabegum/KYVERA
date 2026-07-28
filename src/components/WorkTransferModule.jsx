import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from './Modal';
import { 
  ArrowLeftRight, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  PackagePlus, 
  Sliders, 
  FileText, 
  Cpu, 
  AlertTriangle,
  Clock,
  UserCheck,
  Building2,
  Sparkles,
  Check,
  ChevronRight,
  Layers
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

  // Task Form State
  const [taskData, setTaskData] = useState({
    toDept: 'Engineering',
    assignedEmpId: 'MRA-005',
    projectName: '',
    hardwareDetails: '',
    docDetails: '',
    priority: 'Emergency'
  });

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
      if (isDone) confetti({ particleCount: 70, spread: 70 });
      setSelectedTaskForProgress(null);
    }
  };

  const getPriorityBadge = (priority) => {
    if (priority === 'Emergency') return 'badge-emergency';
    if (priority === 'Quick') return 'badge-important';
    return 'badge-general';
  };

  // Helper to compute stage step index (0 to 4)
  const getStageStep = (status, materialRequested) => {
    if (status === 'Completed') return 4;
    if (status === 'Material Requested' || materialRequested) return 3;
    if (status === 'In Progress') return 2;
    if (status === 'Accepted') return 1;
    return 0; // Assigned / Requested
  };

  const STAGES = [
    { level: 1, name: '1. Request', desc: 'Work Placed' },
    { level: 2, name: '2. Accept', desc: 'HW + Doc Confirmed' },
    { level: 3, name: '3. In Progress', desc: 'Under Active Work' },
    { level: 4, name: '4. Issue / Material', desc: 'Parts & Issues' },
    { level: 5, name: '5. Completed', desc: 'Verified & Delivered' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <ArrowLeftRight size={16} /> Inter-Department Task Exchange
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Work Transfer & Task Tracking</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Level-by-Level progress tracking pipeline (Request → Accept → In Progress → Issue → Completed).
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="kyvera-btn-primary text-xs"
          >
            <Plus size={16} /> Place Work Request
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} className="text-cyan-400" /> Active Level-by-Level Work Trackers ({workAssignments.length})
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold">Live Stage Pipeline Active</span>
        </div>

        <div className="space-y-6">
          {workAssignments.map((task) => {
            const currentStep = getStageStep(task.status, task.materialRequested);
            return (
              <div key={task.id} className="p-5 rounded-xl glass-card border border-slate-800 space-y-4">
                {/* Header info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-extrabold text-base text-white">{task.projectName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityBadge(task.priority)}`}>
                        {task.priority} Priority
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                        Level {currentStep + 1} of 5: {STAGES[currentStep].name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                      <span>From: <strong className="text-cyan-300">{task.fromDept} ({task.assignerName})</strong></span>
                      <span>→</span>
                      <span>To: <strong className="text-emerald-300">{task.toDept} ({task.assignedEmpName})</strong></span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-cyan-400">{task.progress}% Overall Completion</div>
                    <div className="text-[10px] text-slate-400">Assigned: {task.assignedDate}</div>
                  </div>
                </div>

                {/* Level-by-Level Visual Pipeline Stepper */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                    <Layers size={13} className="text-cyan-400" /> Sequential Stage Track
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {STAGES.map((stage, idx) => {
                      const isCompleted = idx < currentStep || task.status === 'Completed';
                      const isCurrent = idx === currentStep && task.status !== 'Completed';

                      return (
                        <div 
                          key={stage.level} 
                          className={`p-2 rounded-lg text-center border transition-all ${
                            isCompleted 
                              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-950' 
                              : isCurrent 
                                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/40 shadow-md shadow-cyan-950 scale-105' 
                                : 'bg-slate-900/60 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1 text-[10px] font-bold">
                            {isCompleted ? (
                              <Check size={11} className="text-emerald-400" />
                            ) : isCurrent ? (
                              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            ) : (
                              <span>L{stage.level}</span>
                            )}
                            <span className="truncate">{stage.name.split('. ')[1]}</span>
                          </div>
                          <div className="text-[8px] truncate mt-0.5 opacity-80">{stage.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Hardware & Documentation Check Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg border text-xs space-y-1 ${
                    task.hardwareConfirmed 
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200' 
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}>
                    <div className="flex items-center justify-between font-bold text-white">
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <Cpu size={14} /> Mandatory Hardware:
                      </span>
                      {task.hardwareConfirmed && <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1"><Check size={12} /> Received</span>}
                    </div>
                    <p className="text-[11px] text-slate-300">{task.hardwareDetails}</p>
                  </div>

                  <div className={`p-3 rounded-lg border text-xs space-y-1 ${
                    task.docConfirmed 
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200' 
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}>
                    <div className="flex items-center justify-between font-bold text-white">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <FileText size={14} /> Mandatory Documentation:
                      </span>
                      {task.docConfirmed && <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1"><Check size={12} /> Received</span>}
                    </div>
                    <p className="text-[11px] text-slate-300">{task.docDetails}</p>
                  </div>
                </div>

                {/* Workflow Controls */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="text-[11px] text-slate-400">
                    Status: <span className="text-white font-bold">{task.status}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {task.status === 'Assigned' && (
                      <>
                        <button
                          onClick={() => {
                            updateWorkTaskStatus(task.id, 'Accepted', { hardwareConfirmed: true, docConfirmed: true, progress: 20 });
                            confetti({ particleCount: 40 });
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 size={14} /> Accept Level 2 (HW + SOP)
                        </button>
                        <button
                          onClick={() => updateWorkTaskStatus(task.id, 'Rejected')}
                          className="px-3 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <XCircle size={14} /> Reject Task
                        </button>
                      </>
                    )}

                    {(task.status === 'Accepted' || task.status === 'In Progress' || task.status === 'Material Requested') && (
                      <>
                        <button
                          onClick={() => {
                            updateWorkTaskStatus(task.id, 'Material Requested', { materialRequested: true });
                            setActiveTab('material');
                          }}
                          className="px-3 py-1 bg-amber-600/90 hover:bg-amber-500 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <PackagePlus size={14} /> Level 4: Report Issue / Material
                        </button>

                        <button
                          onClick={() => {
                            setSelectedTaskForProgress(task);
                            setProgressVal(task.progress || 50);
                          }}
                          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sliders size={14} /> Level 3: Update Progress
                        </button>

                        <button
                          onClick={() => {
                            updateWorkTaskStatus(task.id, 'Completed');
                            confetti({ particleCount: 80, spread: 70 });
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 size={14} /> Level 5: Mark Completed
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assign New Task Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Place New Work Transfer Request"
        icon={ArrowLeftRight}
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. KYVERA Gateway Assembly & Testing"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assign to Employee *</label>
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
              Mandatory Hardware Details * <span className="text-cyan-400">(Required)</span>
            </label>
            <input
              type="text"
              required
              placeholder="Specify hardware serial no, chassis rig, or harness details..."
              value={taskData.hardwareDetails}
              onChange={(e) => setTaskData({ ...taskData, hardwareDetails: e.target.value })}
              className="kyvera-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mandatory Documentation Details * <span className="text-emerald-400">(Required)</span>
            </label>
            <input
              type="text"
              required
              placeholder="Specify SOP link, blueprint version, or specification document..."
              value={taskData.docDetails}
              onChange={(e) => setTaskData({ ...taskData, docDetails: e.target.value })}
              className="kyvera-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Task Priority *</label>
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
            Work Transfer Sender: <span className="text-white font-bold">{currentUser.name}</span> ({currentUser.dept})
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
              Place Work Request
            </button>
          </div>
        </form>
      </Modal>

      {/* Progress Slider Modal */}
      {selectedTaskForProgress && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTaskForProgress(null)}
          title="Update Task Progress (Level 3)"
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
