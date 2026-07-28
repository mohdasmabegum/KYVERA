import React from 'react';
import { Database, Server, Terminal, Shield } from 'lucide-react';

export const SelfHostModule = () => {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
          <Database size={16} /> Private On-Premise Infrastructure
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">100% Self-Hosted SQL & Private Backend</h1>
        <p className="text-xs text-slate-500 font-medium max-w-2xl">
          All organization data remains strictly inside your own servers. Zero third-party cloud data dependencies.
        </p>

        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
          <div className="text-cyan-400 font-bold">SQLite / PostgreSQL DDL (`backend/schema.sql`)</div>
          <div className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
            CREATE TABLE Employees (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), role VARCHAR(50), department VARCHAR(100), email VARCHAR(100));<br />
            CREATE TABLE LeaveRequests (id VARCHAR(50) PRIMARY KEY, emp_id VARCHAR(50), from_date DATE, to_date DATE, leave_type VARCHAR(10), status VARCHAR(20));<br />
            CREATE TABLE MaterialRequests (id VARCHAR(50) PRIMARY KEY, emp_id VARCHAR(50), material_name VARCHAR(150), quantity VARCHAR(50), status VARCHAR(30));<br />
            CREATE TABLE WorkAssignments (id VARCHAR(50) PRIMARY KEY, from_dept VARCHAR(100), to_dept VARCHAR(100), hardware_details TEXT NOT NULL, doc_details TEXT NOT NULL, status VARCHAR(30));
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
          <div className="text-emerald-400 font-bold">Containerized One-Click Deployment (`docker-compose.yml`)</div>
          <div className="text-white font-extrabold">docker-compose up -d</div>
        </div>
      </div>
    </div>
  );
};
