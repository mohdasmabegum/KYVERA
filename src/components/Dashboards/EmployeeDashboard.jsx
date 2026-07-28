import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Calendar, 
  Package, 
  ArrowLeftRight, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Bell, 
  Building2,
  Phone,
  Mail,
  ShieldAlert
} from 'lucide-react';

export const EmployeeDashboard = () => {
  const { 
    currentUser, 
    leaveRequests, 
    materialRequests, 
    workAssignments, 
    activityLogs,
    setActiveTab 
  } = useApp();

  // Employee specific data filtering
  const myLeaves = leaveRequests.filter(l => l.empId === currentUser.empId);
  const myMaterials = materialRequests.filter(m => m.empId === currentUser.empId);
  const myTasks = workAssignments.filter(w => w.assignedEmpId === currentUser.empId);

  const completedTasks = myTasks.filter(t => t.status === 'Completed');
  const pendingTasks = myTasks.filter(t => t.status !== 'Completed' && t.status !== 'Rejected');

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center font-extrabold text-2xl text-white shadow-xl">
            {currentUser.name.split(' ').map(n=>n[0]).join('')}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">{currentUser.name}</h1>
            <div className="text-xs text-cyan-300 font-semibold mt-0.5">
              Employee ID: {currentUser.empId} • Dept: {currentUser.dept}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
              <span className="flex items-center gap-1"><Mail size={12} /> {currentUser.email || 'employee@mra.com'}</span>
              <span className="flex items-center gap-1"><Building2 size={12} /> Role: {currentUser.title}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button 
            onClick={() => setActiveTab('leave')}
            className="kyvera-btn-primary text-xs"
          >
            <Plus size={15} /> Apply Leave
          </button>
          <button 
            onClick={() => setActiveTab('material')}
            className="kyvera-btn-secondary text-xs"
          >
            <Plus size={15} /> Request Material
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-card border-l-4 border-l-cyan-500 space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Assigned Work Tasks</div>
          <div className="text-2xl font-extrabold text-white">{myTasks.length}</div>
          <div className="text-[10px] text-cyan-400">Total assigned to me</div>
        </div>

        <div className="p-4 rounded-xl glass-card border-l-4 border-l-emerald-500 space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Completed Tasks</div>
          <div className="text-2xl font-extrabold text-emerald-400">{completedTasks.length}</div>
          <div className="text-[10px] text-emerald-400/80 font-medium">Successfully fulfilled</div>
        </div>

        <div className="p-4 rounded-xl glass-card border-l-4 border-l-amber-500 space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Pending / In-Progress</div>
          <div className="text-2xl font-extrabold text-amber-400">{pendingTasks.length}</div>
          <div className="text-[10px] text-amber-400/80 font-medium">Requires action</div>
        </div>

        <div className="p-4 rounded-xl glass-card border-l-4 border-l-blue-500 space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Material Requisitions</div>
          <div className="text-2xl font-extrabold text-cyan-300">{myMaterials.length}</div>
          <div className="text-[10px] text-slate-400">Hardware & Parts Requests</div>
        </div>
      </div>

      {/* Grid Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Assigned Tasks */}
        <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ArrowLeftRight size={16} className="text-cyan-400" /> My Assigned Tasks
            </span>
            <button onClick={() => setActiveTab('work')} className="text-xs font-bold text-cyan-400 hover:underline">
              Open Board →
            </button>
          </div>

          <div className="space-y-3">
            {myTasks.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">No tasks currently assigned.</div>
            ) : (
              myTasks.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{t.projectName}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                      {t.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Mandatory HW: <span className="text-slate-200">{t.hardwareDetails}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Leaves & Material Status */}
        <div className="space-y-6">
          <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar size={16} className="text-emerald-400" /> My Recent Leave Applications
              </span>
              <button onClick={() => setActiveTab('leave')} className="text-xs font-bold text-cyan-400 hover:underline">
                Leave Portal →
              </button>
            </div>

            <div className="space-y-2">
              {myLeaves.length === 0 ? (
                <div className="text-center py-4 text-slate-400 text-xs">No leave applications found.</div>
              ) : (
                myLeaves.map((l) => (
                  <div key={l.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{l.leaveType} Leave ({l.leaveDays} Days)</div>
                      <div className="text-[10px] text-slate-400">{l.fromDate} to {l.toDate}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 text-[10px] font-bold">
                      {l.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
