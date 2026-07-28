import React from 'react';

export const OrbitLogo = ({ size = 'md', showText = true }) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const logoSizeClass = isSmall ? 'w-8 h-8' : isLarge ? 'w-16 h-16' : 'w-10 h-10';

  return (
    <div className="flex items-center gap-3">
      {/* Clean Static Logo Image */}
      <img 
        src="./logo.png" 
        alt="KYVERA by MRA" 
        className={`object-contain ${logoSizeClass} rounded-xl shadow-xs`}
      />

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-lg text-slate-900 leading-tight">
              KYVERA
            </span>
            <span className="text-[10px] font-extrabold tracking-wider text-cyan-800 uppercase bg-cyan-100 px-2 py-0.5 rounded border border-cyan-200">
              BY MRA
            </span>
          </div>
          <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mt-0.5">
            WORKFORCE & MATERIAL OPERATIONS
          </span>
        </div>
      )}
    </div>
  );
};
