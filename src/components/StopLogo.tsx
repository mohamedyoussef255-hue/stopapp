import React from 'react';
import { useUIConfig } from '../context/UIConfigContext';

interface StopLogoProps {
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  className?: string;
}

export const StopLogo: React.FC<StopLogoProps> = ({
  size = 'md',
  interactive = true,
  className = ''
}) => {
  const { handleLogoClick, logoClicksRemaining } = useUIConfig();

  const dimensions = {
    sm: 'w-8 h-8 text-[9px]',
    md: 'w-10 h-10 text-[11px]',
    lg: 'w-14 h-14 text-[16px]'
  }[size];

  return (
    <div
      onClick={interactive ? handleLogoClick : undefined}
      title={interactive ? (logoClicksRemaining < 5 ? `${logoClicksRemaining} clicks remaining for CMS` : 'STOP - Click 5 times for CMS') : 'STOP'}
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 select-none shadow-sm transition-transform active:scale-95 ${
        interactive ? 'cursor-pointer hover:opacity-95' : ''
      } ${dimensions} ${className}`}
      style={{
        background: '#e11d48', // vibrant red base
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Red Octagonal/Circular disc */}
        <circle cx="50" cy="50" r="48" fill="#DC2626" />
        {/* Outer White ring */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="#FFFFFF" strokeWidth="3" />
        {/* Inner subtle gap */}
        <circle cx="50" cy="50" r="43" fill="#DC2626" />
        {/* STOP Bold Typography */}
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="26"
          letterSpacing="0.5"
        >
          STOP
        </text>
      </svg>
      {/* Easter Egg hint dot when clicks start */}
      {interactive && logoClicksRemaining < 5 && logoClicksRemaining > 0 && (
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-slate-900 shadow">
          {logoClicksRemaining}
        </span>
      )}
    </div>
  );
};
