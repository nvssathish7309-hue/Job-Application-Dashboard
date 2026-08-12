import React from 'react';

/**
 * Concentric Arcs Icon component — Clean centered emblem.
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
 * Full MindMatrix Logo component featuring the arc emblem and clean typography.
 * Supports 'horizontal', 'vertical', and 'iconOnly'.
 */
export default function MindMatrixLogo({
  layout = 'horizontal',
  showTagline = false,
  className = ''
}) {
  if (layout === 'iconOnly') {
    return (
      <div className={`flex items-center justify-center p-2 rounded-2xl bg-blue-50/90 border border-blue-100/80 ${className}`}>
        <MindMatrixIcon className="w-8 h-5" />
      </div>
    );
  }

  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`}>
        <div className="w-14 h-14 rounded-2xl bg-blue-50/90 border border-blue-100 flex items-center justify-center mb-2 shadow-2xs">
          <MindMatrixIcon className="w-9 h-6" />
        </div>
        <div className="flex items-baseline text-2xl font-bold tracking-tight">
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
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex items-center justify-center p-1.5 rounded-xl bg-blue-50/90 border border-blue-100 shadow-2xs">
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
