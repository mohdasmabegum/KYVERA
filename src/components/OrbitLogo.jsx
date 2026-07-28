import React from 'react';

export const OrbitLogo = ({ size = 'md', showText = true }) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const logoSizeClass = isSmall ? 'h-10' : isLarge ? 'h-24' : 'h-14';

  return (
    <div className="flex items-center gap-3">
      {/* Official Brand Logo Image */}
      <img 
        src="./logo.png" 
        alt="KYVERA MRA - CONNECT | COORDINATE | COMPLETE" 
        className={`object-contain ${logoSizeClass} max-w-full rounded-xl`}
      />
    </div>
  );
};
