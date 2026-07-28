import React, { useState } from 'react';
import { useApp, ROLES } from '../context/AppContext';
import { ShieldCheck, UserCheck, ChevronDown, Check } from 'lucide-react';

export const RoleSwitcher = () => {
  const { currentRoleKey, switchRole, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-all shadow-sm cursor-pointer"
        title="Switch Role for MVP Testing"
      >
        <ShieldCheck size={14} className="text-cyan-400 animate-pulse" />
        <span className="hidden sm:inline text-slate-400">Role:</span>
        <span className="text-cyan-300 font-bold">{currentUser.title}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 z-50 rounded-xl glass-panel p-2 shadow-2xl border border-cyan-500/30 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-slate-700/50 mb-1 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <UserCheck size={12} className="text-cyan-400" /> Switch Active Persona
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">MVP Demo</span>
            </div>

            <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
              {Object.keys(ROLES).map((key) => {
                const role = ROLES[key];
                const isActive = currentRoleKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      switchRole(key);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-950/90 to-emerald-950/80 text-white font-bold border border-cyan-500/40 shadow-inner' 
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{role.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{role.name} • {role.dept}</div>
                    </div>
                    {isActive && <Check size={14} className="text-cyan-400" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-700/50 px-2 text-[10px] text-slate-400 text-center">
              Controls operational permissions and dashboard layouts
            </div>
          </div>
        </>
      )}
    </div>
  );
};
