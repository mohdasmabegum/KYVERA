import React from 'react';

export const OrbitLogo = ({ size = 'md', variant = 'full' }) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  if (variant === 'icon') {
    const iconSizeClass = isSmall ? 'w-10 h-10' : isLarge ? 'w-24 h-24' : 'w-14 h-14';
    return (
      <img 
        src="./app-icon.png" 
        alt="KYVERA MRA App Icon" 
        className={`object-contain ${iconSizeClass} rounded-2xl shadow-sm`}
      />
    );
  }

  const logoSizeClass = isSmall ? 'h-10' : isLarge ? 'h-28' : 'h-14';

  return (
    <div className="flex items-center gap-3">
      {/* Full Logo Banner */}
      <img 
        src="./logo.png" 
        alt="KYVERA MRA - CONNECT | COORDINATE | COMPLETE" 
        className={`object-contain ${logoSizeClass} max-w-full rounded-xl`}
      />
    </div>
  );
};
