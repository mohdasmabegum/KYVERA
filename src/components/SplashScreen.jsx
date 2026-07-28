import React, { useEffect, useState, useRef } from 'react';
import { OrbitLogo } from './OrbitLogo';

export const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    // 2-second progress loader (2000ms)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    const timer = setTimeout(() => {
      if (onFinishRef.current) {
        onFinishRef.current();
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-6 selection:bg-cyan-500 overflow-hidden">
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm w-full">
        {/* Dark App Icon Emblem */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xl">
          <OrbitLogo size="lg" variant="icon" />
        </div>

        {/* Brand Title */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-2">
            KYVERA <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 font-extrabold">MRA</span>
          </h1>
          <p className="text-xs text-slate-500 font-extrabold tracking-widest uppercase">
            CONNECT • COORDINATE • COMPLETE
          </p>
        </div>

        {/* 2-Second Loading Bar */}
        <div className="w-full space-y-2 pt-2">
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono font-bold">
            <span className="text-cyan-800">Initializing Platform...</span>
            <span className="text-slate-900">{Math.min(100, Math.round(progress))}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
