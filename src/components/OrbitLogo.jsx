import React from 'react';
import { Users, ClipboardCheck, PackageCheck, CalendarCheck, Handshake } from 'lucide-react';

export const OrbitLogo = ({ size = 'md', showText = true }) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const logoSizeClass = isSmall ? 'w-8 h-8' : isLarge ? 'w-24 h-24' : 'w-12 h-12';
  const iconSize = isSmall ? 14 : isLarge ? 22 : 16;
  const containerSize = isSmall ? 'w-10 h-10' : isLarge ? 'w-32 h-32' : 'w-16 h-16';

  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex items-center justify-center ${containerSize}`}>
        {/* Outer Orbiting Animated Ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-orbit flex items-center justify-center">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-400">
            <Users size={iconSize - 4} />
          </div>
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-950 border border-emerald-400 flex items-center justify-center text-emerald-400">
            <ClipboardCheck size={iconSize - 4} />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-teal-950 border border-teal-400 flex items-center justify-center text-teal-400">
            <PackageCheck size={iconSize - 4} />
          </div>
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-950 border border-blue-400 flex items-center justify-center text-blue-400">
            <CalendarCheck size={iconSize - 4} />
          </div>
        </div>

        {/* Glow behind image */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-cyan-500/20 via-emerald-500/20 to-blue-600/20 blur-md animate-pulse-glow" />

        {/* Actual Image Logo */}
        <img 
          src="/logo.png" 
          alt="KYVERA by MRA" 
          className={`relative z-10 object-contain ${logoSizeClass} rounded-full`}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-xl text-white">
              KYVERA
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
              BY MRA
            </span>
          </div>
          <span className="text-[9px] font-medium tracking-widest text-emerald-400 uppercase">
            CONNECT • COORDINATE • COMPLETE
          </span>
        </div>
      )}
    </div>
  );
};
