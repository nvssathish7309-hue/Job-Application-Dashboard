import React from 'react';
import { X, CheckCircle, Award } from 'lucide-react';

export default function ShortlistModal({ candidate, isOpen, onClose, onConfirm }) {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Award className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Shortlist Candidate?
        </h3>

        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to shortlist <span className="font-semibold text-slate-900">{candidate.name}</span> for the <span className="font-semibold text-blue-600">{candidate.role}</span> position?
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
              onConfirm(candidate._id || candidate.id || candidate.candidateId);
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Shortlist Candidate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
