import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-slate-200 rounded-md w-28" />
        <div className="w-10 h-10 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-8 bg-slate-300 rounded-md w-20 mb-3" />
      <div className="h-3 bg-slate-200 rounded-md w-36" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs animate-pulse space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <div className="h-5 bg-slate-200 rounded-md w-44" />
        <div className="h-8 bg-slate-200 rounded-xl w-32" />
      </div>
      <div className="h-48 bg-slate-100 rounded-xl w-full flex items-center justify-center">
        <div className="h-6 bg-slate-200 rounded-md w-48" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
          <div>
            <div className="h-4 bg-slate-300 rounded-md w-28 mb-1" />
            <div className="h-3 bg-slate-200 rounded-md w-36" />
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded-md w-32" />
      </td>
      <td className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded-md w-16" />
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-1.5">
          <div className="h-5 bg-slate-200 rounded-md w-12" />
          <div className="h-5 bg-slate-200 rounded-md w-12" />
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="h-6 bg-slate-200 rounded-full w-24" />
      </td>
      <td className="py-4 px-4 text-right">
        <div className="h-8 bg-slate-200 rounded-xl w-16 ml-auto" />
      </td>
    </tr>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse p-4">
      <div className="h-6 bg-slate-200 rounded-md w-48 mb-4" />
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-slate-300" />
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-slate-300 rounded-md w-48" />
            <div className="h-4 bg-slate-200 rounded-md w-36" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-44 bg-white border border-slate-200 rounded-2xl p-5" />
        <div className="h-44 bg-white border border-slate-200 rounded-2xl p-5" />
      </div>
    </div>
  );
}
