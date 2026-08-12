import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, CheckCircle2 } from 'lucide-react';

export default function ScheduleInterviewModal({ candidate, isOpen, onClose, onScheduleSuccess }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [interviewer, setInterviewer] = useState('Priya Nair (Senior Tech Lead)');
  const [roundType, setRoundType] = useState('Technical Screening');
  const [notes, setNotes] = useState('System Design & Algorithms evaluation.');

  if (!isOpen || !candidate) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onScheduleSuccess(candidate.id, {
      id: `fb-sched-${Date.now()}`,
      interviewer: interviewer,
      date: `${date} at ${time}`,
      rating: 5.0,
      stage: roundType,
      comments: `Scheduled ${roundType} interview. Note: ${notes}`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold">Schedule Candidate Interview</h2>
              <p className="text-xs text-amber-100 font-medium">Candidate: {candidate.name}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-800">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Interview Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Time Slot
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Interview Round Type
            </label>
            <select
              value={roundType}
              onChange={(e) => setRoundType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-amber-500"
            >
              <option value="Technical Screening">Technical Screening</option>
              <option value="Coding Assessment">Live Coding Assessment</option>
              <option value="System Design">System Design & Architecture</option>
              <option value="Hiring Manager / HR">Hiring Manager / HR Round</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Interviewer Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Instructions & Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-amber-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Confirm Schedule
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
