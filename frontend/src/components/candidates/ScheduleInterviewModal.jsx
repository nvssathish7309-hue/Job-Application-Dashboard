import React, { useState } from 'react';
import { X, Calendar, Clock, User, Link as LinkIcon, FileText, CheckCircle2 } from 'lucide-react';

export default function ScheduleInterviewModal({ candidate, isOpen, onClose, onConfirm }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    round: 'Technical Round 1',
    interviewer: 'Priya Nair (Senior Tech Lead)',
    meetingLink: 'https://meet.google.com/xyz-abc-def',
    notes: 'Focus on core system design and hands-on coding.'
  });

  if (!isOpen || !candidate) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(candidate._id || candidate.id || candidate.candidateId, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Schedule Interview</h3>
              <p className="text-xs text-slate-500 font-medium">
                For {candidate.name} ({candidate.role})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Interview Date *
              </label>
              <div className="relative">
                <input 
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-3 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Interview Time *
              </label>
              <div className="relative">
                <input 
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full pl-3 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Interview Round *
            </label>
            <select
              value={formData.round}
              onChange={(e) => setFormData({ ...formData, round: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
            >
              <option value="Initial HR Screening">Initial HR Screening</option>
              <option value="Technical Round 1">Technical Round 1</option>
              <option value="System Design Round">System Design Round</option>
              <option value="Engineering Manager Round">Engineering Manager Round</option>
              <option value="Final Culture Fit">Final Culture Fit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Interviewer Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                required
                placeholder="e.g. Priya Nair (Tech Lead)"
                value={formData.interviewer}
                onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Meeting Link
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="url"
                placeholder="https://meet.google.com/..."
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes for Candidate / Interviewer
            </label>
            <textarea
              rows={2}
              placeholder="Add key topics or preparation notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
