import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
  const [authMode, setAuthMode] = useState('REGISTER');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

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
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const res = loginAsUser(loginEmail, loginPassword);
    if (!res.success) {
      setMessage(res.message);
    }
  };

  const handleEmpRegisterSubmit = (e) => {
    e.preventDefault();
    if (!empRegData.name || !empRegData.email) {
      setMessage('Please fill in all required fields.');
      return;
    }

    registerUser({
      name: empRegData.name,
      empId: empRegData.empId,
      dept: empRegData.dept,
      role: empRegData.role,
      email: empRegData.email
    });

    confetti({ particleCount: 60, spread: 70 });
  };

  const handleOrgRegisterSubmit = (e) => {
    e.preventDefault();
    if (!orgRegData.name || !orgRegData.email) {
      setMessage('Please fill in all required fields.');
      return;
    }

    registerUser({
      name: orgRegData.name,
      empId: `MRA-EXEC-${Math.floor(10 + Math.random() * 90)}`,
      dept: orgRegData.role === 'HR' ? 'Human Resources' : 'Executive',
      role: orgRegData.role,
      email: orgRegData.email,
      orgName: orgRegData.orgName
    });

    confetti({ particleCount: 60, spread: 70 });
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
              onClick={() => { setAuthMode('REGISTER'); setMessage(''); }}
              className={`pb-1 transition-all cursor-pointer ${
                authMode === 'REGISTER' ? 'text-cyan-700 border-b-2 border-cyan-700 font-extrabold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => { setAuthMode('LOGIN'); setMessage(''); }}
              className={`pb-1 transition-all cursor-pointer ${
                authMode === 'LOGIN' ? 'text-teal-700 border-b-2 border-teal-700 font-extrabold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In Existing Account
            </button>
          </div>
        </div>

        {/* Alert Message */}
        {message && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold flex items-center gap-2">
            <Sparkles size={16} className="text-amber-700" />
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
                  placeholder="name@company.com"
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
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full kyvera-btn-primary py-3.5 text-sm font-extrabold shadow-md mt-2"
            >
              Sign In to Platform <ArrowRight size={18} />
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
                placeholder="e.g. Alex Johnson"
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
                  className="kyvera-input font-bold"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Designation Role *</label>
                <select
                  value={empRegData.role}
                  onChange={(e) => setEmpRegData({ ...empRegData, role: e.target.value })}
                  className="kyvera-input font-bold"
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
                  placeholder="alex@company.com"
                  value={empRegData.email}
                  onChange={(e) => setEmpRegData({ ...empRegData, email: e.target.value })}
                  className="kyvera-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Password *</label>
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
                placeholder="e.g. Sarah Connor"
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
                  className="kyvera-input font-bold"
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
                placeholder="exec@company.com"
                value={orgRegData.email}
                onChange={(e) => setOrgRegData({ ...orgRegData, email: e.target.value })}
                className="kyvera-input"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Password *</label>
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
      </div>
    </div>
  );
};
