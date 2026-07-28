import React from 'react';
import { useApp } from '../context/AppContext';
import { FileText, FileSpreadsheet, ShieldCheck } from 'lucide-react';

export const ActivityLogsModule = () => {
  const { activityLogs, exportToExcel } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 uppercase tracking-wider">
            <ShieldCheck size={16} /> Audit Trail & Compliance Log
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">System Activity Audit Log</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Immutable log of leave applications, material handovers, and work request transfers.
          </p>
        </div>

        <button
          onClick={() => exportToExcel(activityLogs, `Kyvera_Audit_Logs_${Date.now()}.csv`)}
          className="kyvera-btn-secondary text-xs"
        >
          <FileSpreadsheet size={15} className="text-emerald-600" /> Export Audit CSV
        </button>
      </div>

      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-3">
        {activityLogs.map((log) => (
          <div key={log.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between font-extrabold">
              <span className="text-cyan-800 uppercase tracking-wide">{log.type} • {log.action}</span>
              <span className="text-slate-500 font-medium text-[11px]">{log.timestamp}</span>
            </div>
            <p className="text-slate-800 font-semibold text-xs">{log.details}</p>
            <div className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200">
              Updated by: <strong className="text-slate-900">{log.updatedBy}</strong> • Target: {log.empName} ({log.dept})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
