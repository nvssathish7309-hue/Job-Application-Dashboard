import React from 'react';
import { SearchX, RotateCcw, UserPlus } from 'lucide-react';

export default function EmptyState({ onResetFilters, onOpenAddModal }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4 border border-indigo-100">
        <SearchX className="w-8 h-8" />
      </div>
      
      <h3 className="text-lg font-extrabold text-slate-900">
        No Matching Candidates Found
      </h3>
      
      <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed max-w-sm mx-auto">
        We couldn't find any candidate matching your current search query or filter selection. Try resetting filters or adding a new candidate.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Search & Filters</span>
        </button>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Candidate</span>
        </button>
      </div>
    </div>
  );
}
