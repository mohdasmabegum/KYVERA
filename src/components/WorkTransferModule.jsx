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
  Check
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

  const isCreator = currentUser.id === 'TEAM_LEAD' || currentUser.id === 'COORDINATOR' || currentUser.id === 'CEO';

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

  const getStatusBadge = (status) => {
    if (status === 'Completed') return 'badge-success';
    if (status === 'In Progress' || status === 'Accepted') return 'badge-general';
    if (status === 'Rejected') return 'badge-emergency';
    return 'badge-pending';
  };

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
            Transfer tasks across departments with mandatory hardware & documentation verification.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="kyvera-btn-primary text-xs"
          >
            <Plus size={16} /> Transfer Work Task
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} className="text-cyan-400" /> Active Department Tasks ({workAssignments.length})
          </span>
          <span className="text-[11px] text-slate-400">Strict HW + SOP Handshake Mandate</span>
        </div>

        <div className="space-y-4">
          {workAssignments.map((task) => {
            const isAssignedToMe = task.assignedEmpId === currentUser.empId || currentUser.id === 'EMPLOYEE';
            return (
              <div key={task.id} className="p-4 rounded-xl glass-card border border-slate-800 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-extrabold text-base text-white">{task.projectName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(task.status)}`}>
                        {task.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                      <span>
                        From: <strong className="text-cyan-300">{task.fromDept} ({task.assignerName})</strong>
                      </span>
                      <span>→</span>
                      <span>
                        To: <strong className="text-emerald-300">{task.toDept} ({task.assignedEmpName})</strong>
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar & Status */}
                  <div className="w-full md:w-48 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                      <span>Progress</span>
                      <span className="text-cyan-400 font-extrabold">{task.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hardware & Documentation Check Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
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

                {/* Workflow Actions for Receiver */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="text-[11px] text-slate-400">
                    Assigned Date: {task.assignedDate} {task.completedDate && `• Completed: ${task.completedDate}`}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Accept Task requirement: Confirm receipt of both HW & Documentation */}
                    {task.status === 'Assigned' && (
                      <>
                        <button
                          onClick={() => {
                            updateWorkTaskStatus(task.id, 'Accepted', { hardwareConfirmed: true, docConfirmed: true, progress: 15 });
                            confetti({ particleCount: 40 });
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={14} /> Confirm HW + Doc & Accept Task
                        </button>
                        <button
                          onClick={() => updateWorkTaskStatus(task.id, 'Rejected')}
                          className="px-3 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg font-bold flex items-center gap-1.5"
                        >
                          <XCircle size={14} /> Reject Task
                        </button>
                      </>
                    )}

                    {(task.status === 'Accepted' || task.status === 'In Progress') && (
                      <>
                        <button
                          onClick={() => setActiveTab('material')}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 font-medium flex items-center gap-1.5"
                        >
                          <PackagePlus size={14} /> Request Extra Material
                        </button>

                        <button
                          onClick={() => {
                            setSelectedTaskForProgress(task);
                            setProgressVal(task.progress || 50);
                          }}
                          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold flex items-center gap-1.5"
                        >
                          <Sliders size={14} /> Update Progress
                        </button>

                        <button
                          onClick={() => {
                            updateWorkTaskStatus(task.id, 'Completed');
                            confetti({ particleCount: 80, spread: 70 });
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={14} /> Mark Completed
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
        title="Transfer Work Request to Department"
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
              Transfer Work Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Progress Slider Modal */}
      {selectedTaskForProgress && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTaskForProgress(null)}
          title="Update Task Progress"
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
