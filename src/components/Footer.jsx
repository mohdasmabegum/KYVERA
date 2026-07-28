import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-6 px-8 mt-auto shadow-xs">
      <div className="max-w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500">
        <div className="flex items-center gap-2 text-slate-800 font-extrabold">
          <ShieldCheck size={18} className="text-cyan-700" />
          <span>© 2026 KYVERA by MRA. All Rights Reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-slate-600 font-bold flex-wrap justify-center">
          <span>Enterprise Operations & Work Transfer System</span>
          <span>•</span>
          <span>CONNECT | COORDINATE | COMPLETE</span>
        </div>
      </div>
    </footer>
  );
};
