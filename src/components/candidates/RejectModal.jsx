import React, { useState } from 'react';
import { X, AlertOctagon, UserX } from 'lucide-react';

export default function RejectModal({ candidate, isOpen, onClose, onConfirm }) {
  const [reason, setReason] = useState('');

  if (!isOpen || !candidate) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(candidate.id, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertOctagon className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Reject Candidate?
        </h3>

        <p className="text-sm text-slate-600 mb-4">
          Are you sure you want to mark <span className="font-semibold text-slate-900">{candidate.name}</span> as rejected? This will update their status in the portal.
        </p>

        <form onSubmit={handleSubmit} className="text-left space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rejection Reason (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Skills mismatch, compensation expectation, insufficient experience..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-rose-500 text-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
            >
              <UserX className="w-4 h-4" />
              <span>Reject Candidate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
