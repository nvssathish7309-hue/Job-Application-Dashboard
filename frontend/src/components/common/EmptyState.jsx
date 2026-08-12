import React from 'react';
import { SearchX, Plus, FilterX } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ 
  title = "No candidates found", 
  description = "There are no candidates matching your current search or filters.",
  onClearFilters,
  showAddButton = true
}) {
  return (
    <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center my-6 max-w-xl mx-auto shadow-sm">
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
        {description}
      </p>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-2"
          >
            <FilterX className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        )}

        {showAddButton && (
          <Link
            to="/candidates/add"
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Candidate</span>
          </Link>
        )}
      </div>
    </div>
  );
}
