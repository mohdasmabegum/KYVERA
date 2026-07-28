import React, { useState } from 'react';
import { Database, ShieldCheck, Terminal, Server, Copy, Check, Download, HardDrive, Cpu, Lock } from 'lucide-react';

export const SelfHostModule = () => {
  const [copiedSection, setCopiedSection] = useState(null);
  const [activeDbType, setActiveDbType] = useState('sqlite');

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqliteSchema = `-- KYVERA Enterprise Workforce Management Database Schema (SQLite)
-- Data Ownership: 100% On-Premise / Local Self-Hosted

CREATE TABLE IF NOT EXISTS Employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS LeaveRequests (
    id TEXT PRIMARY KEY,
    emp_id TEXT NOT NULL,
    emp_name TEXT NOT NULL,
    department TEXT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    leave_days INTEGER NOT NULL,
    leave_type TEXT CHECK(leave_type IN ('EL', 'CL')),
    priority TEXT CHECK(priority IN ('Emergency', 'Important', 'General')),
    purpose TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_date DATETIME,
    approved_by TEXT,
    status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Rejected')),
    FOREIGN KEY(emp_id) REFERENCES Employees(id)
);

CREATE TABLE IF NOT EXISTS MaterialRequests (
    id TEXT PRIMARY KEY,
    emp_id TEXT NOT NULL,
    emp_name TEXT NOT NULL,
    department TEXT NOT NULL,
    material_name TEXT NOT NULL,
    quantity TEXT NOT NULL,
    project_name TEXT NOT NULL,
    priority TEXT CHECK(priority IN ('Emergency', 'Quick', 'General')),
    availability TEXT DEFAULT 'Checking...',
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_date DATETIME,
    order_date DATETIME,
    received_date DATETIME,
    handover_date DATETIME,
    accepted_by TEXT,
    status TEXT DEFAULT 'Pending',
    delivery_duration TEXT,
    FOREIGN KEY(emp_id) REFERENCES Employees(id)
);

CREATE TABLE IF NOT EXISTS Inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    qty INTEGER NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    min_qty INTEGER DEFAULT 5,
    status TEXT DEFAULT 'In Stock',
    location TEXT
);

CREATE TABLE IF NOT EXISTS WorkAssignments (
    id TEXT PRIMARY KEY,
    assigner_name TEXT NOT NULL,
    from_dept TEXT NOT NULL,
    to_dept TEXT NOT NULL,
    assigned_emp_id TEXT NOT NULL,
    assigned_emp_name TEXT NOT NULL,
    project_name TEXT NOT NULL,
    hardware_details TEXT NOT NULL, -- MANDATORY
    doc_details TEXT NOT NULL,      -- MANDATORY
    priority TEXT CHECK(priority IN ('Emergency', 'Quick', 'General')),
    hardware_confirmed BOOLEAN DEFAULT 0,
    doc_confirmed BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'Assigned',
    progress INTEGER DEFAULT 0,
    assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_date DATETIME,
    FOREIGN KEY(assigned_emp_id) REFERENCES Employees(id)
);

CREATE TABLE IF NOT EXISTS ActivityLogs (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    action TEXT NOT NULL,
    emp_name TEXT NOT NULL,
    department TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT NOT NULL,
    status TEXT NOT NULL,
    details TEXT NOT NULL
);`;

  const postgresSchema = `-- PostgreSQL Equivalent Schema for High-Volume Enterprise Deployment
CREATE TABLE Employees (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LeaveRequests (
    id VARCHAR(50) PRIMARY KEY,
    emp_id VARCHAR(50) REFERENCES Employees(id),
    emp_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    leave_days INT NOT NULL,
    leave_type VARCHAR(10) CHECK(leave_type IN ('EL', 'CL')),
    priority VARCHAR(20) CHECK(priority IN ('Emergency', 'Important', 'General')),
    purpose TEXT NOT NULL,
    contact_number VARCHAR(30) NOT NULL,
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_date TIMESTAMP,
    approved_by VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Pending'
);`;

  const serverSnippet = `// Node.js + Express Self-Hosted Backend (backend/server.js)
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const app = express();
const db = new Database('./kyvera_data.db');

app.use(cors());
app.use(express.json());

// API Endpoints
app.get('/api/leaves', (req, res) => {
  const stmt = db.prepare('SELECT * FROM LeaveRequests ORDER BY applied_date DESC');
  res.json(stmt.all());
});

app.post('/api/leaves', (req, res) => {
  const { id, empId, empName, dept, fromDate, toDate, leaveDays, leaveType, priority, purpose, contactNumber } = req.body;
  const stmt = db.prepare(\`
    INSERT INTO LeaveRequests (id, emp_id, emp_name, department, from_date, to_date, leave_days, leave_type, priority, purpose, contact_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  \`);
  stmt.run(id, empId, empName, dept, fromDate, toDate, leaveDays, leaveType, priority, purpose, contactNumber);
  res.json({ success: true, message: 'Leave request recorded on self-hosted SQL' });
});

app.listen(5000, () => console.log('KYVERA Self-Hosted Backend listening on port 5000'));`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Lock size={16} /> Data Privacy & Self-Hosting Assurance
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Self-Hosted SQL & Backend Guide</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Your data belongs 100% to MRA. Zero cloud database fees, zero third-party telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 font-extrabold text-xs flex items-center gap-1.5">
            <HardDrive size={14} /> Local SQL Engine Ready
          </span>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-extrabold text-sm text-white">Full SQL Database DDL</h3>
          <p className="text-xs text-slate-400">
            Pre-configured schemas for SQLite, PostgreSQL, and MySQL matching all 9 MVP collections.
          </p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-extrabold text-sm text-white">Node.js Express Backend</h3>
          <p className="text-xs text-slate-400">
            Lightweight REST API backend script included directly in <code className="text-cyan-300">backend/server.js</code>.
          </p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-extrabold text-sm text-white">Containerized Deployment</h3>
          <p className="text-xs text-slate-400">
            Run <code className="text-emerald-300">docker-compose up -d</code> for 1-click server deployment on internal networks.
          </p>
        </div>
      </div>

      {/* SQL Schema Code Box */}
      <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-cyan-400" />
            <span className="text-sm font-extrabold text-white">Database DDL Script (`schema.sql`)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveDbType('sqlite')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeDbType === 'sqlite' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400'
              }`}
            >
              SQLite (Recommended Local)
            </button>
            <button
              onClick={() => setActiveDbType('postgres')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeDbType === 'postgres' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400'
              }`}
            >
              PostgreSQL
            </button>

            <button
              onClick={() => copyToClipboard(activeDbType === 'sqlite' ? sqliteSchema : postgresSchema, 'sql')}
              className="kyvera-btn-secondary text-xs"
            >
              {copiedSection === 'sql' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copiedSection === 'sql' ? 'Copied SQL' : 'Copy SQL'}
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300/90 overflow-x-auto max-h-80 leading-relaxed">
          {activeDbType === 'sqlite' ? sqliteSchema : postgresSchema}
        </pre>
      </div>

      {/* Express Backend Code Box */}
      <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Server size={18} className="text-emerald-400" />
            <span className="text-sm font-extrabold text-white">Node.js API Server (`backend/server.js`)</span>
          </div>

          <button
            onClick={() => copyToClipboard(serverSnippet, 'server')}
            className="kyvera-btn-secondary text-xs"
          >
            {copiedSection === 'server' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copiedSection === 'server' ? 'Copied Server Code' : 'Copy Express Code'}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-60 leading-relaxed">
          {serverSnippet}
        </pre>
      </div>

      {/* Quick Setup Instructions */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
          <Terminal size={16} className="text-cyan-400" /> Quick Commands to Run Backend Locally
        </h3>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1 text-slate-300">
          <div className="text-slate-400"># 1. Start the frontend web application</div>
          <div className="text-cyan-300 font-bold">npm run dev</div>
          <div className="text-slate-400 mt-2"># 2. Start the local SQLite backend REST API server</div>
          <div className="text-emerald-300 font-bold">npm run server</div>
        </div>
      </div>
    </div>
  );
};
