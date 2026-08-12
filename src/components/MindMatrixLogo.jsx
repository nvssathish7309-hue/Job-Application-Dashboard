import React from 'react';

/**
 * Concentric Arcs Icon component — Blue palette brand version.
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
        d="M 8 64 A 52 52 0 0 1 112 64"
        stroke="#1d4ed8"
        strokeWidth="11"
        strokeLinecap="butt"
      />
      {/* Middle Arch - Light Blue */}
      <path
        d="M 23 64 A 37 37 0 0 1 97 64"
        stroke="#60a5fa"
        strokeWidth="4.5"
        strokeLinecap="butt"
      />
      {/* Inner Arch - Deep Blue */}
      <path
        d="M 36 64 A 24 24 0 0 1 84 64"
        stroke="#1d4ed8"
        strokeWidth="9.5"
        strokeLinecap="butt"
      />
    </svg>
  );
}

/**
 * Full MindMatrix Logo component featuring the arc emblem and stylized typography.
 * Supports 'horizontal' (navbar friendly), 'vertical' (stacked), and 'iconOnly'.
 */
export default function MindMatrixLogo({
  layout = 'horizontal',
  showTagline = false,
  className = ''
}) {
  if (layout === 'iconOnly') {
    return <MindMatrixIcon className={className || "w-9 h-9"} />;
  }

  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <MindMatrixIcon className="w-24 h-14 mb-1" />
        <div className="flex items-baseline text-2xl font-bold tracking-tight">
          <span style={{ color: '#1d4ed8' }} className="font-extrabold">Mind</span>
          <span style={{ color: '#60a5fa' }} className="font-bold">Matrix</span>
        </div>
        {showTagline && (
          <span className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">
            RECRUITMENT PLATFORM
          </span>
        )}
      </div>
    );
  }

  // Default: Horizontal Layout (Navbars)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="btn-moving-light relative flex items-center justify-center p-1.5 rounded-xl bg-blue-50 border border-blue-100 shadow-sm">
        <MindMatrixIcon className="w-9 h-6" />
      </div>
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline text-xl font-bold tracking-tight">
          <span style={{ color: '#1d4ed8' }} className="font-extrabold">Mind</span>
          <span style={{ color: '#3b82f6' }} className="font-bold">Matrix</span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">
            Enterprise Recruitment
          </span>
        )}
      </div>
    </div>
  );
}
