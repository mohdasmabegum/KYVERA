import React, { useEffect, useState, useRef } from 'react';
import { OrbitLogo } from './OrbitLogo';
import { Sparkles, Shield } from 'lucide-react';

export const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    // 3-second progress animation (3000ms)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 3.33;
      });
    }, 100);

    const timer = setTimeout(() => {
      if (onFinishRef.current) {
        onFinishRef.current();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []); // Run ONCE on mount!

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070E17] text-white p-6 selection:bg-cyan-500 overflow-hidden">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm w-full">
        {/* Animated Brand Logo */}
        <div className="relative p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,180,216,0.3)] backdrop-blur-xl">
          <OrbitLogo size="lg" showText={false} />
        </div>

        {/* Brand Name & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            KYVERA <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-bold">BY MRA</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
            Enterprise Workforce & Material Operations
          </p>
        </div>

        {/* 3-Second Loading Bar */}
        <div className="w-full space-y-2 pt-4">
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 transition-all duration-100 ease-out shadow-[0_0_10px_rgba(0,180,216,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-cyan-400 font-bold">
              <Sparkles size={12} className="animate-spin" /> Initializing Core Engine...
            </span>
            <span className="font-bold text-white">{Math.min(100, Math.round(progress))}%</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 text-[10px] text-slate-500 flex items-center gap-1.5">
          <Shield size={12} className="text-emerald-400" />
          <span>MRA Enterprise Security • On-Premise Storage</span>
        </div>
      </div>
    </div>
  );
};
