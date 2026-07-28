import React, { useState } from 'react';
import { useApp, ROLES } from '../context/AppContext';
import { OrbitLogo } from './OrbitLogo';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { loginAsUser } = useApp();
  const [selectedRoleKey, setSelectedRoleKey] = useState('CEO');
  const [emailInput, setEmailInput] = useState('ceo@mra.kyvera.com');
  const [passwordInput, setPasswordInput] = useState('••••••••');

  const defaultEmails = {
    CEO: 'ceo@mra.kyvera.com',
    COORDINATOR: 'coordinator@mra.kyvera.com',
    TEAM_LEAD: 'tl@mra.kyvera.com',
    HR: 'hr@mra.kyvera.com',
    INVENTORY: 'inventory@mra.kyvera.com',
    EMPLOYEE: 'suresh@mra.kyvera.com',
  };

  const handleRoleSelect = (key) => {
    setSelectedRoleKey(key);
    setEmailInput(defaultEmails[key]);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginAsUser(emailInput, selectedRoleKey);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <OrbitLogo size="lg" showText={true} />
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Select User Designation
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
                  className={`p-3 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-700 border-cyan-800 text-white font-extrabold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold">{role.title}</div>
                  <div className="text-[10px] text-slate-400 font-medium truncate">{role.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Corporate Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="kyvera-input pl-10"
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
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="kyvera-input pl-10"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full kyvera-btn-primary py-3.5 text-sm font-extrabold shadow-md"
          >
            Sign In to Platform <ArrowRight size={18} />
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-500 font-medium">
          Secured by MRA Enterprise Security Engine
        </div>
      </div>
    </div>
  );
};
