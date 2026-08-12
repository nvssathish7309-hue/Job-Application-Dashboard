import React from 'react';

/**
 * Standard status badge component required by challenge spec:
 * New: Neutral badge
 * Shortlisted: Blue / Teal positive badge
 * Interview: Amber warning badge
 * Selected: Green success badge
 * Rejected: Red danger badge
 */
export default function Badge({ status, className = "" }) {
  const normalized = (status || '').toLowerCase();

  let styles = "bg-slate-100 text-slate-700 border-slate-200";
  let dotColor = "bg-slate-400";
  let label = status || "New";

  if (normalized.includes("shortlist")) {
    styles = "bg-blue-50 text-blue-700 border-blue-200";
    dotColor = "bg-blue-500";
    label = "Shortlisted";
  } else if (normalized.includes("interview")) {
    styles = "bg-amber-50 text-amber-700 border-amber-200";
    dotColor = "bg-amber-500";
    label = "Interview";
  } else if (normalized.includes("select")) {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
    dotColor = "bg-emerald-500";
    label = "Selected";
  } else if (normalized.includes("reject")) {
    styles = "bg-rose-50 text-rose-700 border-rose-200";
    dotColor = "bg-rose-500";
    label = "Rejected";
  } else if (normalized.includes("new")) {
    styles = "bg-sky-50 text-sky-700 border-sky-200";
    dotColor = "bg-sky-500";
    label = "New";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all ${styles} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
      <span>{label}</span>
    </span>
  );
}
