import React from 'react';

/**
 * Concentric Arcs Icon component — Perfectly centered emblem.
 */
export function MindMatrixIcon({ className = "w-8 h-8", ...props }) {
  return (
    <svg
      viewBox="0 0 120 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Outer Arch - Deep Blue */}
      <path
        d="M 12 60 A 48 48 0 0 1 108 60"
        stroke="#1d4ed8"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Middle Arch - Light Blue */}
      <path
        d="M 26 60 A 34 34 0 0 1 94 60"
        stroke="#60a5fa"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Inner Arch - Deep Blue */}
      <path
        d="M 38 60 A 22 22 0 0 1 82 60"
        stroke="#1d4ed8"
        strokeWidth="8.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Full MindMatrix Logo component featuring centered emblem and glowing border animation.
 * Supports 'horizontal', 'vertical', and 'iconOnly'.
 */
export default function MindMatrixLogo({
  layout = 'horizontal',
  showTagline = false,
  className = '',
  isAnimating = false,
  onClick
}) {
  if (layout === 'iconOnly') {
    return (
      <div 
        onClick={onClick}
        className={`btn-moving-light flex items-center justify-center p-2 rounded-2xl bg-blue-50/90 border border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.3)] ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''} ${className}`}
      >
        <MindMatrixIcon className={`w-8 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
      </div>
    );
  }

  if (layout === 'vertical') {
    return (
      <div 
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center ${onClick ? 'cursor-pointer group select-none' : ''} ${className}`}
      >
        <div className={`btn-moving-light w-16 h-16 rounded-2xl bg-blue-50/90 border border-blue-200 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(59,130,246,0.35)] relative z-10 transition-all duration-300 group-hover:shadow-[0_0_35px_rgba(99,102,241,0.65)] group-hover:border-blue-300 group-hover:scale-105 ${isAnimating ? 'scale-110 rotate-6 shadow-[0_0_40px_rgba(168,85,247,0.8)] border-purple-400' : ''}`}>
          <MindMatrixIcon className={`w-10 h-6 transition-transform duration-300 ${isAnimating ? 'scale-115' : ''}`} />
        </div>
        <div className="flex items-baseline text-2xl font-bold tracking-tight group-hover:scale-105 transition-transform duration-300">
          <span style={{ color: '#1d4ed8' }} className="font-extrabold">Mind</span>
          <span style={{ color: '#3b82f6' }} className="font-bold">Matrix</span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
            Recruitment Suite
          </span>
        )}
      </div>
    );
  }

  // Default: Horizontal Layout
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-2.5 ${onClick ? 'cursor-pointer group select-none' : ''} ${className}`}
    >
      <div className={`btn-moving-light flex items-center justify-center p-1.5 rounded-xl bg-blue-50/90 border border-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all ${isAnimating ? 'scale-110' : ''}`}>
        <MindMatrixIcon className="w-8 h-5" />
      </div>
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline text-lg font-bold tracking-tight">
          <span style={{ color: '#1d4ed8' }} className="font-extrabold">Mind</span>
          <span style={{ color: '#3b82f6' }} className="font-bold">Matrix</span>
        </div>
        {showTagline && (
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            Recruitment
          </span>
        )}
      </div>
    </div>
  );
}
