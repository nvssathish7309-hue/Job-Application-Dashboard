import React, { useState, useEffect } from 'react';
import { X, UserCheck, Save, Sparkles } from 'lucide-react';
import { useCandidates } from '../../context/CandidateContext';

export default function EditCandidateModal({ candidate, isOpen, onClose }) {
  const { updateCandidate } = useCandidates();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    experience: '',
    experienceYears: 0,
    status: 'New',
    location: '',
    skills: ''
  });

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        role: candidate.role || '',
        experience: candidate.experience || 'Fresher',
        experienceYears: candidate.experienceYears || 0,
        status: candidate.status || 'New',
        location: candidate.location || 'Remote / Hybrid',
        skills: Array.isArray(candidate.skills) ? candidate.skills.join(', ') : candidate.skills || ''
      });
    }
  }, [candidate]);

  if (!isOpen || !candidate) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsArray = typeof formData.skills === 'string'
      ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      : formData.skills;

    updateCandidate(candidate.id, {
      ...formData,
      skills: skillsArray
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">Edit Candidate Profile</h2>
              <p className="text-xs text-slate-500">Update information for {candidate.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Candidate Name */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-900"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Phone */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number (10 digits)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => {
                  let input = e.target.value;
                  let digits = input.replace(/\D/g, '');
                  if (digits.startsWith('91')) {
                    digits = digits.slice(2);
                  }
                  const trimmedDigits = digits.slice(0, 10);
                  const formatted = trimmedDigits ? `+91 ${trimmedDigits}` : '';
                  setFormData(prev => ({ ...prev, phone: formatted }));
                }}
                placeholder="+91 9876543210"
                maxLength={15}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-900"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Applied Role</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Experience */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Experience</label>
              <input
                type="text"
                value={formData.experience}
                onChange={e => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g. Fresher, 3 Years"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-900"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pipeline Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-900 font-medium"
              >
                <option value="New">New</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. Bengaluru, Remote"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-900"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Key Skills (comma-separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={e => setFormData(prev => ({ ...prev, skills: e.target.value }))}
              placeholder="React, JavaScript, Node.js, SQL"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-900"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
