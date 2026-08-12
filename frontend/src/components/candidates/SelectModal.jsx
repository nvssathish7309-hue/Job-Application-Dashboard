import React from 'react';
import { CheckCircle2, Check } from 'lucide-react';

export default function SelectModal({ candidate, isOpen, onClose, onConfirm }) {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Select Candidate for Offer?
        </h3>

        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to mark <span className="font-semibold text-slate-900">{candidate.name}</span> as <span className="font-semibold text-emerald-600">Selected</span> for the <span className="font-semibold text-slate-900">{candidate.role}</span> position?
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(candidate.id);
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Select Candidate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
