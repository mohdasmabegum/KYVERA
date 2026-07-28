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
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-6 selection:bg-cyan-500 overflow-hidden">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm w-full">
        {/* Animated Brand Logo */}
        <div className="relative p-6 rounded-3xl bg-white border border-slate-200 shadow-xl backdrop-blur-xl">
          <OrbitLogo size="lg" showText={false} />
        </div>

        {/* Brand Name & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-2">
            KYVERA <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 font-extrabold">BY MRA</span>
          </h1>
          <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">
            Enterprise Workforce & Material Operations
          </p>
        </div>

        {/* 3-Second Loading Bar */}
        <div className="w-full space-y-2 pt-4">
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 transition-all duration-100 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1 text-cyan-700 font-extrabold">
              <Sparkles size={12} className="animate-spin" /> Initializing Core Engine...
            </span>
            <span className="font-extrabold text-slate-900">{Math.min(100, Math.round(progress))}%</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
          <Shield size={12} className="text-teal-600" />
          <span>MRA Enterprise Security • On-Premise Storage</span>
        </div>
      </div>
    </div>
  );
};
