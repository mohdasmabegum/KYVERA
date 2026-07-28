import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  History, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  Calendar, 
  Package, 
  ArrowLeftRight, 
  Clock, 
  User, 
  ShieldCheck 
} from 'lucide-react';

export const ActivityLogsModule = () => {
  const { activityLogs, exportToExcel } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = 
      log.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.updatedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (typeFilter === 'ALL') return matchesSearch;
    return matchesSearch && log.type === typeFilter;
  });

  const getTypeIcon = (type) => {
    if (type === 'LEAVE') return <Calendar size={14} className="text-cyan-400" />;
    if (type === 'MATERIAL') return <Package size={14} className="text-emerald-400" />;
    return <ArrowLeftRight size={14} className="text-blue-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <History size={16} /> Enterprise Audit Repository
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Activity Logs & Compliance</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable audit log of all leave applications, material handovers, and work transfers.
          </p>
        </div>

        <button
          onClick={() => exportToExcel(activityLogs, `Kyvera_Audit_Logs_${Date.now()}.csv`)}
          className="kyvera-btn-secondary text-xs"
        >
          <FileSpreadsheet size={15} className="text-emerald-400" /> Export Audit Log CSV
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs by employee, department, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="kyvera-input pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['ALL', 'LEAVE', 'MATERIAL', 'WORK'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === type
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {type === 'ALL' ? 'All Activity' : `${type} Logs`}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Table / List */}
        <div className="space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No activity logs match your search.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl glass-card border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 mt-0.5">
                    {getTypeIcon(log.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{log.action}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                        {log.type}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px]">
                        Status: {log.status}
                      </span>
                    </div>
                    <p className="text-slate-300 font-medium mt-1">{log.details}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                      <span>Employee: <strong className="text-slate-200">{log.empName}</strong> ({log.dept})</span>
                      <span>•</span>
                      <span>Updated By: <strong className="text-slate-200">{log.updatedBy}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-400 whitespace-nowrap self-end sm:self-center">
                  <span className="flex items-center gap-1">
                    <Clock size={11} className="text-slate-500" /> {log.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
