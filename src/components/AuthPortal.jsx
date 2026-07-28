import React, { useState } from 'react';
import { useApp, ROLES } from '../context/AppContext';
import { OrbitLogo } from './OrbitLogo';
import { 
  Building2, 
  UserCheck, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Briefcase, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AuthPortal = () => {
  const { loginAsUser, registerUser, departments } = useApp();

  // Portal Type: 'EMPLOYEE' or 'ORGANIZATION'
  const [portalType, setPortalType] = useState('EMPLOYEE');
  // Auth Mode: 'LOGIN' or 'REGISTER'
  const [authMode, setAuthMode] = useState('LOGIN');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('suresh@mra.kyvera.com');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [loginRoleKey, setLoginRoleKey] = useState('EMPLOYEE');

  // Employee Registration Form State
  const [empRegData, setEmpRegData] = useState({
    name: '',
    empId: `MRA-${Math.floor(100 + Math.random() * 900)}`,
    dept: 'Engineering',
    role: 'EMPLOYEE',
    email: '',
    password: ''
  });

  // Organization Registration Form State
  const [orgRegData, setOrgRegData] = useState({
    name: '',
    orgName: 'MRA Enterprise Systems',
    role: 'CEO',
    dept: 'Executive',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  // Handle Portal Switcher
  const handlePortalSwitch = (type) => {
    setPortalType(type);
    setMessage('');
    if (type === 'EMPLOYEE') {
      setLoginRoleKey('EMPLOYEE');
      setLoginEmail('suresh@mra.kyvera.com');
    } else {
      setLoginRoleKey('CEO');
      setLoginEmail('ceo@mra.kyvera.com');
    }
  };

  // Quick Demo Account Select
  const handleDemoAccountSelect = (roleKey) => {
    const roleMap = {
      CEO: { email: 'ceo@mra.kyvera.com', portal: 'ORGANIZATION' },
      COORDINATOR: { email: 'coordinator@mra.kyvera.com', portal: 'ORGANIZATION' },
      HR: { email: 'hr@mra.kyvera.com', portal: 'ORGANIZATION' },
      INVENTORY: { email: 'inventory@mra.kyvera.com', portal: 'ORGANIZATION' },
      TEAM_LEAD: { email: 'tl@mra.kyvera.com', portal: 'EMPLOYEE' },
      EMPLOYEE: { email: 'suresh@mra.kyvera.com', portal: 'EMPLOYEE' },
    };

    const target = roleMap[roleKey];
    setPortalType(target.portal);
    setLoginRoleKey(roleKey);
    setLoginEmail(target.email);
    setAuthMode('LOGIN');
  };

  // Handle Login Submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = loginAsUser(loginEmail, loginRoleKey);
    if (!success) {
      setMessage('Account not found. Please register a new account below.');
    }
  };

  // Handle Employee Registration Submission
  const handleEmpRegisterSubmit = (e) => {
    e.preventDefault();
    if (!empRegData.name || !empRegData.email) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const newUser = registerUser({
      name: empRegData.name,
      empId: empRegData.empId,
      dept: empRegData.dept,
      role: empRegData.role,
      email: empRegData.email,
      title: empRegData.role === 'TEAM_LEAD' ? 'Team Lead / Sub-TL' : 'Normal Employee'
    });

    confetti({ particleCount: 60, spread: 70 });
    setMessage(`Employee registration successful! Welcome ${newUser.name}.`);
  };

  // Handle Organization Registration Submission
  const handleOrgRegisterSubmit = (e) => {
    e.preventDefault();
    if (!orgRegData.name || !orgRegData.email) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const titles = {
      CEO: 'CEO / Founder / Director',
      COORDINATOR: 'Project Coordinator',
      HR: 'HR Manager',
      INVENTORY: 'Inventory Manager'
    };

    const newUser = registerUser({
      name: orgRegData.name,
      empId: `MRA-EXEC-${Math.floor(10 + Math.random() * 90)}`,
      dept: orgRegData.role === 'HR' ? 'Human Resources' : orgRegData.role === 'INVENTORY' ? 'Supply Chain' : 'Executive',
      role: orgRegData.role,
      email: orgRegData.email,
      title: titles[orgRegData.role] || 'Organization Executive'
    });

    confetti({ particleCount: 60, spread: 70 });
    setMessage(`Organization registration successful! Logged in as ${newUser.title}.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-kyvera-dark selection:bg-cyan-500">
      <div className="w-full max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-6">
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <OrbitLogo size="lg" showText={true} />
          <p className="text-xs text-slate-400">
            Enterprise Portal • <span className="text-cyan-400 font-bold">https://MRA.KYVERA.com</span>
          </p>
        </div>

        {/* Primary Portal Switcher (Employee vs Organization) */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => handlePortalSwitch('EMPLOYEE')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              portalType === 'EMPLOYEE'
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User size={15} /> Employee Portal
          </button>

          <button
            type="button"
            onClick={() => handlePortalSwitch('ORGANIZATION')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              portalType === 'ORGANIZATION'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 size={15} /> Organization Portal
          </button>
        </div>

        {/* Sub-Tabs (Sign In vs Register) */}
        <div className="flex items-center justify-center border-b border-slate-800 pb-2">
          <div className="flex items-center gap-4 text-xs font-bold">
            <button
              onClick={() => { setAuthMode('LOGIN'); setMessage(''); }}
              className={`pb-1 transition-all cursor-pointer ${
                authMode === 'LOGIN' ? 'text-cyan-400 border-b-2 border-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In to Account
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => { setAuthMode('REGISTER'); setMessage(''); }}
              className={`pb-1 transition-all cursor-pointer ${
                authMode === 'REGISTER' ? 'text-emerald-400 border-b-2 border-emerald-400 font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register New {portalType === 'EMPLOYEE' ? 'Employee' : 'Organization Account'}
            </button>
          </div>
        </div>

        {/* Feedback Message Alert */}
        {message && (
          <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-xs text-cyan-200 flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" />
            <span>{message}</span>
          </div>
        )}

        {/* ==================== LOGIN FORM ==================== */}
        {authMode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="kyvera-input pl-9"
                  placeholder="name@mra.kyvera.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="kyvera-input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Account Role</label>
              <select
                value={loginRoleKey}
                onChange={(e) => setLoginRoleKey(e.target.value)}
                className="kyvera-input"
              >
                {portalType === 'EMPLOYEE' ? (
                  <>
                    <option value="EMPLOYEE">Normal Employee (Suresh Kumar)</option>
                    <option value="TEAM_LEAD">Team Lead / Sub-TL (Arjun Mehta)</option>
                  </>
                ) : (
                  <>
                    <option value="CEO">CEO / Founder / Director (Dr. Rajesh Varma)</option>
                    <option value="COORDINATOR">Project Coordinator (Vikram Seth)</option>
                    <option value="HR">HR Manager (Ananya Sharma)</option>
                    <option value="INVENTORY">Inventory Manager (Priya Nair)</option>
                  </>
                )}
              </select>
            </div>

            <button
              type="submit"
              className="w-full kyvera-btn-primary py-3 text-sm font-bold shadow-lg mt-2"
            >
              Sign In to {portalType === 'EMPLOYEE' ? 'Employee Portal' : 'Organization Portal'} <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* ==================== EMPLOYEE REGISTER FORM ==================== */}
        {authMode === 'REGISTER' && portalType === 'EMPLOYEE' && (
          <form onSubmit={handleEmpRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Employee Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Patel"
                value={empRegData.name}
                onChange={(e) => setEmpRegData({ ...empRegData, name: e.target.value })}
                className="kyvera-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Employee ID *</label>
                <input
                  type="text"
                  required
                  value={empRegData.empId}
                  onChange={(e) => setEmpRegData({ ...empRegData, empId: e.target.value })}
                  className="kyvera-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department *</label>
                <select
                  value={empRegData.dept}
                  onChange={(e) => setEmpRegData({ ...empRegData, dept: e.target.value })}
                  className="kyvera-input"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role Type *</label>
                <select
                  value={empRegData.role}
                  onChange={(e) => setEmpRegData({ ...empRegData, role: e.target.value })}
                  className="kyvera-input"
                >
                  <option value="EMPLOYEE">Normal Employee</option>
                  <option value="TEAM_LEAD">Team Lead / Sub-TL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@mra.kyvera.com"
                  value={empRegData.email}
                  onChange={(e) => setEmpRegData({ ...empRegData, email: e.target.value })}
                  className="kyvera-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Set Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={empRegData.password}
                onChange={(e) => setEmpRegData({ ...empRegData, password: e.target.value })}
                className="kyvera-input"
              />
            </div>

            <button
              type="submit"
              className="w-full kyvera-btn-primary py-3 text-sm font-bold shadow-lg"
            >
              Complete Employee Registration <CheckCircle2 size={16} />
            </button>
          </form>
        )}

        {/* ==================== ORGANIZATION REGISTER FORM ==================== */}
        {authMode === 'REGISTER' && portalType === 'ORGANIZATION' && (
          <form onSubmit={handleOrgRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Executive Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Priya Varma"
                value={orgRegData.name}
                onChange={(e) => setOrgRegData({ ...orgRegData, name: e.target.value })}
                className="kyvera-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={orgRegData.orgName}
                  onChange={(e) => setOrgRegData({ ...orgRegData, orgName: e.target.value })}
                  className="kyvera-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Executive Designation *</label>
                <select
                  value={orgRegData.role}
                  onChange={(e) => setOrgRegData({ ...orgRegData, role: e.target.value })}
                  className="kyvera-input"
                >
                  <option value="CEO">CEO / Founder / Director</option>
                  <option value="COORDINATOR">Project Coordinator</option>
                  <option value="HR">HR Manager</option>
                  <option value="INVENTORY">Inventory Manager</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email Address *</label>
              <input
                type="email"
                required
                placeholder="exec@mra.kyvera.com"
                value={orgRegData.email}
                onChange={(e) => setOrgRegData({ ...orgRegData, email: e.target.value })}
                className="kyvera-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Set Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={orgRegData.password}
                onChange={(e) => setOrgRegData({ ...orgRegData, password: e.target.value })}
                className="kyvera-input"
              />
            </div>

            <button
              type="submit"
              className="w-full kyvera-btn-primary py-3 text-sm font-bold shadow-lg"
            >
              Complete Organization Registration <CheckCircle2 size={16} />
            </button>
          </form>
        )}

        {/* 1-Click Demo Accounts Selector */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
            1-Click Demo Account Quick Select
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.keys(ROLES).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleDemoAccountSelect(key)}
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 font-semibold truncate text-center cursor-pointer"
              >
                {ROLES[key].title.split(' ')[0]} ({key})
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-500">
          MRA Enterprise Security • Dedicated Role Scoping Active
        </div>
      </div>
    </div>
  );
};
