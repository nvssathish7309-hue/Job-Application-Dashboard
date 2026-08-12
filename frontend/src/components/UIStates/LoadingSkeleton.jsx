import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-2xl p-5 space-y-3">
            <div className="h-4 bg-slate-300 rounded w-2/3"></div>
            <div className="h-8 bg-slate-300 rounded w-1/2"></div>
            <div className="h-1 bg-slate-300 rounded-full w-full"></div>
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-16 bg-slate-200 rounded-2xl w-full"></div>

      {/* Table Skeleton */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="h-6 bg-slate-200 rounded w-full"></div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3 w-1/4">
              <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
              <div className="space-y-1 w-full">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-4 bg-slate-200 rounded w-1/6"></div>
            <div className="h-4 bg-slate-200 rounded w-1/6"></div>
            <div className="h-6 bg-slate-200 rounded-full w-1/6"></div>
            <div className="h-8 bg-slate-200 rounded-xl w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
