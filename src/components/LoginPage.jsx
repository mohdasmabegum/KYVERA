import React, { useState } from 'react';
import { useApp, ROLES } from '../context/AppContext';
import { OrbitLogo } from './OrbitLogo';
import { Shield, Lock, Mail, UserCheck, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { loginAsRole } = useApp();
  const [selectedRoleKey, setSelectedRoleKey] = useState('CEO');
  const [emailInput, setEmailInput] = useState('ceo@mra.kyvera.com');
  const [passwordInput, setPasswordInput] = useState('••••••••');

  const defaultEmails = {
    CEO: 'ceo@mra.kyvera.com',
    COORDINATOR: 'coordinator@mra.kyvera.com',
    TEAM_LEAD: 'tl@mra.kyvera.com',
    HR: 'hr@mra.kyvera.com',
    INVENTORY: 'inventory@mra.kyvera.com',
    EMPLOYEE: 'employee@mra.kyvera.com',
  };

  const handleRoleSelect = (key) => {
    setSelectedRoleKey(key);
    setEmailInput(defaultEmails[key]);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginAsRole(selectedRoleKey);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-kyvera-dark">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-6">
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <OrbitLogo size="lg" showText={true} />
          <p className="text-xs text-slate-400 mt-2">
            Enterprise Single Sign-On Portal • <span className="text-cyan-400 font-bold">https://MRA.KYVERA.com</span>
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Select User Account Type
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {Object.keys(ROLES).map((key) => {
              const role = ROLES[key];
              const isSelected = selectedRoleKey === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleRoleSelect(key)}
                  className={`p-2.5 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950 to-emerald-950 border-cyan-400 text-white font-bold shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{role.title}</div>
                  <div className="text-[10px] text-slate-400 font-normal truncate">{role.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="kyvera-input pl-9"
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
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="kyvera-input pl-9"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-0.5">
            <div>Signing in as: <strong className="text-white">{ROLES[selectedRoleKey].title}</strong></div>
            <div>Account Limits: <span className="text-cyan-400 font-medium">Page tabs automatically locked to role permissions.</span></div>
          </div>

          <button
            type="submit"
            className="w-full kyvera-btn-primary py-3 text-sm font-bold shadow-lg"
          >
            Sign In to Enterprise Portal <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-500">
          Secured by MRA Enterprise Security Engine • Self-Hosted Privacy Guaranteed
        </div>
      </div>
    </div>
  );
};
