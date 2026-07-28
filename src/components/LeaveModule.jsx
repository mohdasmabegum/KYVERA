import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from './Modal';
import { 
  Calendar, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Phone, 
  User,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LeaveModule = () => {
  const { currentUser, leaveRequests, applyLeave, updateLeaveStatus, exportToExcel } = useApp();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Form State
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    leaveType: 'EL',
    priority: 'General',
    purpose: '',
    contactNumber: currentUser.contactNumber || '+91 98765 00000'
  });

  const isHR = currentUser.id === 'HR' || currentUser.id === 'CEO';

  const calculateDays = (from, to) => {
    if (!from || !to) return 1;
    const start = new Date(from);
    const end = new Date(to);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 1 : diffDays;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const days = calculateDays(formData.fromDate, formData.toDate);
    applyLeave({
      ...formData,
      leaveDays: days
    });
    setIsApplyModalOpen(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  const filteredRequests = leaveRequests.filter(req => {
    if (statusFilter === 'ALL') return true;
    return req.status === statusFilter;
  });

  const getPriorityBadge = (priority) => {
    if (priority === 'Emergency') return 'badge-emergency';
    if (priority === 'Important') return 'badge-important';
    return 'badge-general';
  };

  const getStatusBadge = (status) => {
    if (status === 'Approved') return 'badge-success';
    if (status === 'Rejected') return 'badge-emergency';
    return 'badge-pending';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 uppercase tracking-wider">
            <Calendar size={16} /> Enterprise Leave Portal
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">Leave Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Submit leave requests, monitor department availability, and perform HR approvals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportToExcel(leaveRequests, `Kyvera_Leave_Report_${Date.now()}.csv`)}
            className="kyvera-btn-secondary text-xs"
            title="Export to CSV/Excel"
          >
            <FileSpreadsheet size={15} className="text-emerald-600" /> Export Report
          </button>
          
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="kyvera-btn-primary text-xs"
          >
            <Plus size={16} /> Apply Leave
          </button>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500">Total Applications</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{leaveRequests.length}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">Across all departments</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 border-l-4 border-l-amber-500 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500">Pending Review</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">
            {leaveRequests.filter(l => l.status === 'Pending').length}
          </div>
          <div className="text-[10px] text-amber-800 font-semibold mt-1">Awaiting HR Decision</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 border-l-4 border-l-emerald-500 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500">Approved Leaves</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {leaveRequests.filter(l => l.status === 'Approved').length}
          </div>
          <div className="text-[10px] text-emerald-800 font-semibold mt-1">Granted by HR</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 border-l-4 border-l-rose-500 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500">Rejected</div>
          <div className="text-2xl font-extrabold text-rose-700 mt-1">
            {leaveRequests.filter(l => l.status === 'Rejected').length}
          </div>
          <div className="text-[10px] text-rose-800 font-semibold mt-1">Closed Applications</div>
        </div>
      </div>

      {/* Request Filter & Data List */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-cyan-700" />
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Leave Applications</span>
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-cyan-100 text-cyan-900 border border-cyan-300 font-extrabold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs font-medium">
              No leave records found matching current criteria.
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-300 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Employee & Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-extrabold text-sm text-slate-900">{req.empName}</span>
                      <span className="text-[11px] font-bold text-slate-500">({req.empId})</span>
                      <span className="px-2 py-0.5 rounded bg-white text-[10px] text-slate-700 border border-slate-200 font-semibold">
                        {req.dept}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityBadge(req.priority)}`}>
                        {req.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 text-[10px] font-extrabold">
                        Type: {req.leaveType} ({req.leaveDays} Days)
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">
                      <span className="text-slate-500 font-bold">Purpose:</span> {req.purpose}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-cyan-600" /> {req.fromDate} to {req.toDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={12} className="text-emerald-600" /> {req.contactNumber}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock size={12} /> Applied: {req.appliedDate}
                      </span>
                    </div>
                  </div>

                  {/* Right Status & HR Actions */}
                  <div className="flex flex-col md:items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 w-fit ${getStatusBadge(req.status)}`}>
                      {req.status === 'Approved' && <CheckCircle2 size={14} />}
                      {req.status === 'Rejected' && <XCircle size={14} />}
                      {req.status === 'Pending' && <Clock size={14} className="animate-spin" />}
                      {req.status}
                    </span>

                    {req.approvedBy && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        {req.status} by: <span className="text-slate-900 font-bold">{req.approvedBy}</span>
                      </span>
                    )}

                    {/* HR Approval buttons */}
                    {isHR && req.status === 'Pending' && (
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => {
                            updateLeaveStatus(req.id, 'Approved', currentUser.name);
                            confetti({ particleCount: 40, spread: 50 });
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          <CheckCircle2 size={13} /> Approve
                        </button>
                        <button
                          onClick={() => updateLeaveStatus(req.id, 'Rejected', currentUser.name)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Submit New Leave Request"
        icon={Calendar}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <User size={14} className="text-cyan-700" /> Applicant: {currentUser.name} ({currentUser.empId})
            </div>
            <div className="text-slate-500 font-medium">
              Department: {currentUser.dept}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">From Date *</label>
              <input
                type="date"
                required
                value={formData.fromDate}
                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                className="kyvera-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">To Date *</label>
              <input
                type="date"
                required
                value={formData.toDate}
                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                className="kyvera-input"
              />
            </div>
          </div>

          {formData.fromDate && formData.toDate && (
            <div className="p-2.5 rounded-lg bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-800 flex items-center justify-between">
              <span>Total Duration:</span>
              <span className="text-sm font-extrabold text-cyan-900">
                {calculateDays(formData.fromDate, formData.toDate)} Day(s)
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Leave Type *</label>
              <select
                value={formData.leaveType}
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                className="kyvera-input"
              >
                <option value="EL">EL (Earned Leave)</option>
                <option value="CL">CL (Casual Leave)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority *</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="kyvera-input"
              >
                <option value="General">General</option>
                <option value="Important">Important</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Number *</label>
            <input
              type="text"
              required
              placeholder="+91 98765 43210"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="kyvera-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Purpose of Leave *</label>
            <textarea
              required
              rows={3}
              placeholder="State the reason for leave application..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="kyvera-input resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="kyvera-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="kyvera-btn-primary text-xs"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
