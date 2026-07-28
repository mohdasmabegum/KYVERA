import React, { useState } from 'react';
import { useApp, ROLES } from '../context/AppContext';
import { OrbitLogo } from './OrbitLogo';
import { 
  Building2, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AuthPortal = () => {
  const { loginAsUser, registerUser, departments } = useApp();

  const [portalType, setPortalType] = useState('EMPLOYEE');
  const [authMode, setAuthMode] = useState('LOGIN');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('tl@mra.kyvera.com');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [loginRoleKey, setLoginRoleKey] = useState('TEAM_LEAD');

  // Employee Registration state
  const [empRegData, setEmpRegData] = useState({
    name: '',
    empId: `MRA-${Math.floor(100 + Math.random() * 900)}`,
    dept: 'Engineering',
    role: 'TEAM_LEAD',
    email: '',
    password: ''
  });

  // Organization Registration state
  const [orgRegData, setOrgRegData] = useState({
    name: '',
    orgName: 'MRA Enterprise Systems',
    role: 'CEO',
    dept: 'Executive',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handlePortalSwitch = (type) => {
    setPortalType(type);
    setMessage('');
    if (type === 'EMPLOYEE') {
      setLoginRoleKey('TEAM_LEAD');
      setLoginEmail('tl@mra.kyvera.com');
    } else {
      setLoginRoleKey('CEO');
      setLoginEmail('ceo@mra.kyvera.com');
    }
  };

  const handleDemoAccountSelect = (roleKey) => {
    const roleMap = {
      CEO: { email: 'ceo@mra.kyvera.com', portal: 'ORGANIZATION' },
      COORDINATOR: { email: 'coordinator@mra.kyvera.com', portal: 'ORGANIZATION' },
      HR: { email: 'hr@mra.kyvera.com', portal: 'ORGANIZATION' },
      TEAM_LEAD: { email: 'tl@mra.kyvera.com', portal: 'EMPLOYEE' },
      INVENTORY: { email: 'inventory@mra.kyvera.com', portal: 'EMPLOYEE' },
      EMPLOYEE: { email: 'suresh@mra.kyvera.com', portal: 'EMPLOYEE' },
    };

    const target = roleMap[roleKey];
    if (target) {
      setPortalType(target.portal);
      setLoginRoleKey(roleKey);
      setLoginEmail(target.email);
      setAuthMode('LOGIN');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = loginAsUser(loginEmail, loginRoleKey);
    if (!success) {
      setMessage('Account not found. Please register a new account below.');
    }
  };

  const handleEmpRegisterSubmit = (e) => {
    e.preventDefault();
    if (!empRegData.name || !empRegData.email) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const titles = {
      TEAM_LEAD: 'Team Lead / Sub-TL',
      INVENTORY: 'Inventory Manager',
      EMPLOYEE: 'Normal Employee'
    };

    const newUser = registerUser({
      name: empRegData.name,
      empId: empRegData.empId,
      dept: empRegData.dept,
      role: empRegData.role,
      email: empRegData.email,
      title: titles[empRegData.role] || 'Employee Account'
    });

    confetti({ particleCount: 60, spread: 70 });
    setMessage(`Employee registration successful! Welcome ${newUser.name}.`);
  };

  const handleOrgRegisterSubmit = (e) => {
    e.preventDefault();
    if (!orgRegData.name || !orgRegData.email) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const titles = {
      CEO: 'CEO / Founder / Director',
      COORDINATOR: 'Project Coordinator',
      HR: 'HR Manager'
    };

    const newUser = registerUser({
      name: orgRegData.name,
      empId: `MRA-EXEC-${Math.floor(10 + Math.random() * 90)}`,
      dept: orgRegData.role === 'HR' ? 'Human Resources' : 'Executive',
      role: orgRegData.role,
      email: orgRegData.email,
      title: titles[orgRegData.role] || 'Executive Member'
    });

    confetti({ particleCount: 60, spread: 70 });
    setMessage(`Organization registration successful! Logged in as ${newUser.title}.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-lg bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <OrbitLogo size="lg" showText={true} />
        </div>

        {/* Primary Portal Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => handlePortalSwitch('EMPLOYEE')}
            className={`py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              portalType === 'EMPLOYEE'
                ? 'bg-cyan-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <User size={16} /> Employee Portal
          </button>

          <button
            type="button"
            onClick={() => handlePortalSwitch('ORGANIZATION')}
            className={`py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              portalType === 'ORGANIZATION'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <Building2 size={16} /> Organization Portal
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center justify-center border-b border-slate-200 pb-3">
          <div className="flex items-center gap-6 text-xs font-bold">
            <button
              onClick={() => { setAuthMode('LOGIN'); setMessage(''); }}
              className={`pb-1 transition-all cursor-pointer ${
                authMode === 'LOGIN' ? 'text-cyan-700 border-b-2 border-cyan-700 font-extrabold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => { setAuthMode('REGISTER'); setMessage(''); }}
              className={`pb-1 transition-all cursor-pointer ${
                authMode === 'REGISTER' ? 'text-teal-700 border-b-2 border-teal-700 font-extrabold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register New Account
            </button>
          </div>
        </div>

        {/* Feedback Message Alert */}
        {message && (
          <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 font-bold flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-700" />
            <span>{message}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {authMode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Corporate Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="kyvera-input pl-10"
                  placeholder="name@mra.kyvera.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="kyvera-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Target Designation</label>
              <select
                value={loginRoleKey}
                onChange={(e) => setLoginRoleKey(e.target.value)}
                className="kyvera-input font-semibold text-slate-800"
              >
                {portalType === 'EMPLOYEE' ? (
                  <>
                    <option value="TEAM_LEAD">Team Lead / Sub-TL (Arjun Mehta)</option>
                    <option value="INVENTORY">Inventory Manager (Priya Nair)</option>
                    <option value="EMPLOYEE">Normal Employee (Suresh Kumar)</option>
                  </>
                ) : (
                  <>
                    <option value="COORDINATOR">Project Coordinator (Vikram Seth)</option>
                    <option value="CEO">CEO / Founder / Director (Dr. Rajesh Varma)</option>
                    <option value="HR">HR Manager (Ananya Sharma)</option>
                  </>
                )}
              </select>
            </div>

            <button
              type="submit"
              className="w-full kyvera-btn-primary py-3.5 text-sm font-extrabold shadow-md mt-2"
            >
              Sign In to {portalType === 'EMPLOYEE' ? 'Employee Portal' : 'Organization Portal'} <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* EMPLOYEE REGISTER FORM */}
        {authMode === 'REGISTER' && portalType === 'EMPLOYEE' && (
          <form onSubmit={handleEmpRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Full Employee Name *</label>
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
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Employee ID *</label>
                <input
                  type="text"
                  required
                  value={empRegData.empId}
                  onChange={(e) => setEmpRegData({ ...empRegData, empId: e.target.value })}
                  className="kyvera-input"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Department *</label>
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
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Role Type *</label>
                <select
                  value={empRegData.role}
                  onChange={(e) => setEmpRegData({ ...empRegData, role: e.target.value })}
                  className="kyvera-input"
                >
                  <option value="TEAM_LEAD">Team Lead / Sub-TL</option>
                  <option value="INVENTORY">Inventory Manager</option>
                  <option value="EMPLOYEE">Normal Employee</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Corporate Email *</label>
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
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Set Password *</label>
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
              className="w-full kyvera-btn-primary py-3.5 text-sm font-extrabold shadow-md"
            >
              Complete Employee Registration <CheckCircle2 size={18} />
            </button>
          </form>
        )}

        {/* ORGANIZATION REGISTER FORM */}
        {authMode === 'REGISTER' && portalType === 'ORGANIZATION' && (
          <form onSubmit={handleOrgRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Executive Full Name *</label>
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
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={orgRegData.orgName}
                  onChange={(e) => setOrgRegData({ ...orgRegData, orgName: e.target.value })}
                  className="kyvera-input"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Executive Designation *</label>
                <select
                  value={orgRegData.role}
                  onChange={(e) => setOrgRegData({ ...orgRegData, role: e.target.value })}
                  className="kyvera-input"
                >
                  <option value="COORDINATOR">Project Coordinator</option>
                  <option value="CEO">CEO / Founder / Director</option>
                  <option value="HR">HR Manager</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Corporate Email Address *</label>
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
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Set Password *</label>
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
              className="w-full kyvera-btn-primary py-3.5 text-sm font-extrabold shadow-md"
            >
              Complete Organization Registration <CheckCircle2 size={18} />
            </button>
          </form>
        )}

        {/* 1-Click Demo Accounts Selector */}
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-center">
            1-Click Quick Login Select
          </div>
          <div className="grid grid-cols-3 gap-2">
            {portalType === 'EMPLOYEE' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleDemoAccountSelect('TEAM_LEAD')}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-cyan-50 border border-slate-200 text-[11px] text-slate-800 font-extrabold truncate text-center cursor-pointer transition-all hover:border-cyan-400"
                >
                  Team Lead (Arjun)
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoAccountSelect('INVENTORY')}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-cyan-50 border border-slate-200 text-[11px] text-slate-800 font-extrabold truncate text-center cursor-pointer transition-all hover:border-cyan-400"
                >
                  Inventory (Priya)
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoAccountSelect('EMPLOYEE')}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-cyan-50 border border-slate-200 text-[11px] text-slate-800 font-extrabold truncate text-center cursor-pointer transition-all hover:border-cyan-400"
                >
                  Employee (Suresh)
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleDemoAccountSelect('COORDINATOR')}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-teal-50 border border-slate-200 text-[11px] text-slate-800 font-extrabold truncate text-center cursor-pointer transition-all hover:border-teal-400"
                >
                  Coordinator (Vikram)
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoAccountSelect('CEO')}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-teal-50 border border-slate-200 text-[11px] text-slate-800 font-extrabold truncate text-center cursor-pointer transition-all hover:border-teal-400"
                >
                  CEO / Founder (Rajesh)
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoAccountSelect('HR')}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-teal-50 border border-slate-200 text-[11px] text-slate-800 font-extrabold truncate text-center cursor-pointer transition-all hover:border-teal-400"
                >
                  HR Manager (Ananya)
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
