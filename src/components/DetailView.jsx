import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Package, 
  FileText, 
  Phone, 
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DetailView = ({ item, type, onBack }) => {
  const { currentUser, updateWorkTaskStatus, updateLeaveStatus, updateMaterialStatus, exportToExcel } = useApp();

  if (!item) return null;

  const isHR = currentUser.id === 'HR' || currentUser.id === 'CEO';
  const isInventoryMgr = currentUser.id === 'INVENTORY' || currentUser.id === 'CEO' || currentUser.id === 'COORDINATOR';

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="kyvera-btn-secondary text-sm font-bold shadow-xs hover:bg-slate-100 flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer"
        >
          <ArrowLeft size={18} /> Back to Overview
        </button>

        <button
          onClick={() => exportToExcel([item], `${type}_Detail_${item.id}.csv`)}
          className="kyvera-btn-secondary text-sm font-bold flex items-center gap-2 px-5 py-2.5 rounded-xl"
        >
          <FileSpreadsheet size={18} className="text-emerald-600" /> Export Details CSV
        </button>
      </div>

      {/* Main Detailed Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
        {/* Header Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-extrabold text-cyan-700 uppercase tracking-widest block mb-1">
              Detailed Inspection • {type.toUpperCase()} RECORD
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {item.projectName || item.materialName || `${item.empName}'s Leave Application`}
            </h1>
            <p className="text-sm text-slate-500 font-semibold mt-1">Record ID: {item.id}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-extrabold shadow-xs ${
              item.status === 'Completed' || item.status === 'Approved' || item.status === 'Handed Over'
                ? 'badge-success'
                : item.status === 'Pending' || item.status === 'Pending for Order' || item.status === 'Assigned'
                ? 'badge-pending'
                : 'badge-general'
            }`}>
              {item.status}
            </span>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Requested / Allotted By</span>
            <div className="text-base font-extrabold text-slate-900">{item.assignerName || item.empName || item.appliedBy}</div>
            <div className="text-xs text-slate-600 font-semibold">{item.fromDept || item.dept} Department</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Assigned / Receiver</span>
            <div className="text-base font-extrabold text-slate-900">{item.assignedEmpName || item.empName || item.acceptedBy || '—'}</div>
            <div className="text-xs text-slate-600 font-semibold">{item.toDept || item.dept} Department</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Date & Timestamp</span>
            <div className="text-base font-extrabold text-slate-900">{item.assignedDate || item.requestDate || item.appliedDate || 'Today'}</div>
            <div className="text-xs text-slate-600 font-semibold">Priority: {item.priority || 'General'}</div>
          </div>
        </div>

        {/* Work Specific Info */}
        {type === 'work' && (
          <div className="space-y-6 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <FileText size={20} className="text-cyan-700" /> Mandatory Information SOP & Verification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-extrabold text-slate-900 text-sm">
                  <span>Hardware Information Details</span>
                  {item.hardwareConfirmed && <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-2.5 py-1 rounded-full">Confirmed ✅</span>}
                </div>
                <p className="text-sm text-slate-700 font-semibold leading-relaxed">{item.hardwareDetails}</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-extrabold text-slate-900 text-sm">
                  <span>Documentation SOP & Spec Blueprint</span>
                  {item.docConfirmed && <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-2.5 py-1 rounded-full">Confirmed ✅</span>}
                </div>
                <p className="text-sm text-slate-700 font-semibold leading-relaxed">{item.docDetails}</p>
              </div>
            </div>

            {/* Action Panel */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
              {item.status === 'Assigned' && (
                <button
                  onClick={() => {
                    updateWorkTaskStatus(item.id, 'Accepted', { hardwareConfirmed: true, docConfirmed: true, progress: 25 });
                    confetti({ particleCount: 60 });
                    onBack();
                  }}
                  className="kyvera-btn-primary py-3 px-6 text-sm font-extrabold shadow-md cursor-pointer"
                >
                  <CheckCircle2 size={18} /> Accept Work Request & Verify SOP
                </button>
              )}

              {(item.status === 'Accepted' || item.status === 'In Progress') && (
                <button
                  onClick={() => {
                    updateWorkTaskStatus(item.id, 'Completed');
                    confetti({ particleCount: 80, spread: 70 });
                    onBack();
                  }}
                  className="kyvera-btn-primary py-3 px-6 text-sm font-extrabold shadow-md cursor-pointer"
                >
                  <CheckCircle2 size={18} /> Mark Task Fully Completed ✅
                </button>
              )}
            </div>
          </div>
        )}

        {/* Leave Specific Info */}
        {type === 'leave' && (
          <div className="space-y-6 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar size={20} className="text-cyan-700" /> Leave Application Details
            </h3>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-500">Leave Purpose:</span>
                <span className="font-extrabold text-slate-900">{item.purpose}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-500">Emergency Contact Number:</span>
                <span className="font-extrabold text-slate-900">{item.contactNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-500">Duration:</span>
                <span className="font-extrabold text-cyan-800">{item.leaveDays} Day(s) ({item.fromDate} to {item.toDate})</span>
              </div>
            </div>

            {isHR && item.status === 'Pending' && (
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    updateLeaveStatus(item.id, 'Approved', currentUser.name);
                    confetti({ particleCount: 50 });
                    onBack();
                  }}
                  className="kyvera-btn-primary py-3 px-6 text-sm font-extrabold shadow-md cursor-pointer"
                >
                  <CheckCircle2 size={18} /> Approve Leave Request
                </button>
              </div>
            )}
          </div>
        )}

        {/* Material Specific Info */}
        {type === 'material' && (
          <div className="space-y-6 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Package size={20} className="text-cyan-700" /> Requisition Details
            </h3>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-500">Material Name:</span>
                <span className="font-extrabold text-slate-900">{item.materialName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-500">Quantity Required:</span>
                <span className="font-extrabold text-slate-900">{item.quantity}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-500">Target Project:</span>
                <span className="font-extrabold text-cyan-800">{item.projectName}</span>
              </div>
            </div>

            {isInventoryMgr && item.status === 'Pending' && (
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    updateMaterialStatus(item.id, 'Handed Over', currentUser.name, { availability: 'Available' });
                    confetti({ particleCount: 50 });
                    onBack();
                  }}
                  className="kyvera-btn-primary py-3 px-6 text-sm font-extrabold shadow-md cursor-pointer"
                >
                  <CheckCircle2 size={18} /> Hand Over Stock Item
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
