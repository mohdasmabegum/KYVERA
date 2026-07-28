import React from 'react';

export const OrbitLogo = ({ size = 'md', showText = true }) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const logoSizeClass = isSmall ? 'w-10 h-10' : isLarge ? 'w-32 h-32' : 'w-14 h-14';

  return (
    <div className="flex items-center gap-4">
      {/* Clean Static Large Logo Image */}
      <img 
        src="./logo.png" 
        alt="KYVERA by MRA" 
        className={`object-contain ${logoSizeClass} rounded-2xl shadow-sm border border-slate-200 p-1 bg-white`}
      />

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-2xl text-slate-900 leading-tight">
              KYVERA
            </span>
            <span className="text-xs font-extrabold tracking-wider text-cyan-900 uppercase bg-cyan-100 px-2.5 py-1 rounded-lg border border-cyan-300">
              BY MRA
            </span>
          </div>
          <span className="text-xs font-bold tracking-widest text-slate-500 uppercase mt-1">
            WORKFORCE & MATERIAL OPERATIONS
          </span>
        </div>
      )}
    </div>
  );
};
