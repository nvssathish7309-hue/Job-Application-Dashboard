import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  FolderGit2, 
  FileText, 
  Download, 
  MessageSquarePlus, 
  Star, 
  UserCheck, 
  UserX, 
  Clock, 
  Award,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { getStatusBadge } from './CandidateTable';

export default function CandidateDetailModal({ 
  candidate, 
  onClose, 
  onUpdateStatus, 
  onOpenScheduleModal,
  onAddFeedback 
}) {
  const [newFeedbackText, setNewFeedbackText] = useState('');
  const [rating, setRating] = useState(5);
  const [interviewerName, setInterviewerName] = useState('Recruiter (Me)');

  if (!candidate) return null;

  const badge = getStatusBadge(candidate.status);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!newFeedbackText.trim()) return;

    onAddFeedback(candidate.id, {
      id: `fb-${Date.now()}`,
      interviewer: interviewerName,
      date: new Date().toISOString().split('T')[0],
      rating: parseFloat(rating),
      stage: candidate.status,
      comments: newFeedbackText.trim()
    });

    setNewFeedbackText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-50/80 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
              {candidate.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {candidate.name}
                </h2>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                  <span>{candidate.status}</span>
                </span>
              </div>
              <p className="text-sm font-semibold text-indigo-600 mt-0.5">
                {candidate.role} • {candidate.experience} Experience
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Quick Action Stage Buttons */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Update Candidate Stage
              </span>
              <span className="text-xs font-medium text-slate-600">
                Current status: <strong className="text-slate-900">{candidate.status}</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Schedule Interview button */}
              <button
                onClick={() => onOpenScheduleModal(candidate)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Interview</span>
              </button>

              {/* Shortlist button */}
              <button
                onClick={() => onUpdateStatus(candidate.id, 'Shortlisted')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Shortlist</span>
              </button>

              {/* Select button */}
              <button
                onClick={() => onUpdateStatus(candidate.id, 'Selected')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Select Candidate</span>
              </button>

              {/* Reject button */}
              <button
                onClick={() => onUpdateStatus(candidate.id, 'Rejected')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Contact Info & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Contact Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contact Information
              </h3>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="font-semibold">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="font-semibold">{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Applied Date: {candidate.appliedDate}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Technical Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Education & Projects Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Education */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <GraduationCap className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Education</h3>
              </div>
              {candidate.education ? (
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {candidate.education.degree}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {candidate.education.institution} ({candidate.education.year})
                  </p>
                  <p className="text-xs text-slate-600 font-semibold mt-1">
                    GPA / Score: {candidate.education.gpa}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No education history recorded.</p>
              )}
            </div>

            {/* Projects */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <FolderGit2 className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Featured Projects</h3>
              </div>
              {candidate.projects && candidate.projects.length > 0 ? (
                <div className="space-y-2">
                  {candidate.projects.map((proj, idx) => (
                    <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{proj.title}</span>
                        {proj.link && (
                          <span className="text-[10px] text-indigo-500 font-medium flex items-center gap-0.5">
                            {proj.link} <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500">{proj.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No portfolio projects attached.</p>
              )}
            </div>

          </div>

          {/* Resume Preview & Download Section */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600">
                <FileText className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Candidate Resume</h3>
              </div>

              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(candidate.resume?.previewText || '')}`}
                download={candidate.resume?.fileName || "Resume.txt"}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {candidate.resume?.fileName}</span>
              </a>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-600 font-mono">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 pb-2 border-b border-slate-100 font-sans">
                <span>FILE PREVIEW • {candidate.resume?.fileName}</span>
                <span>Size: {candidate.resume?.fileSize}</span>
              </div>
              <p>{candidate.resume?.previewText}</p>
            </div>
          </div>

          {/* Interview Feedback & Ratings Section */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Interview Feedback & Evaluation History ({candidate.interviewFeedback?.length || 0})
              </h3>
            </div>

            {/* Existing Feedback List */}
            {candidate.interviewFeedback && candidate.interviewFeedback.length > 0 ? (
              <div className="space-y-3">
                {candidate.interviewFeedback.map((fb) => (
                  <div key={fb.id} className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{fb.interviewer}</span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-semibold text-[10px]">
                          {fb.stage}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{fb.rating} / 5</span>
                      </div>
                    </div>
                    <p className="text-slate-600 italic">"{fb.comments}"</p>
                    <span className="text-[10px] text-slate-400 block text-right">{fb.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 bg-white/50 rounded-xl border border-dashed border-slate-200">
                No interview feedback submitted yet. Use the form below to add evaluator notes.
              </div>
            )}

            {/* Add Recruiter Feedback Form */}
            <form onSubmit={handleSubmitFeedback} className="pt-2 space-y-3 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-700 block">
                Add Recruiter Feedback / Interview Notes
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Evaluator Name (e.g. Lead Engineer)"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-indigo-500"
                />
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Rating:</span>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-indigo-500 font-bold text-amber-500"
                  >
                    <option value="5">5.0 ⭐ Outstanding</option>
                    <option value="4.5">4.5 ⭐ Strong Hire</option>
                    <option value="4.0">4.0 ⭐ Good Match</option>
                    <option value="3.0">3.0 ⭐ Average / Mixed</option>
                    <option value="2.0">2.0 ⭐ Below Bar</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={2}
                placeholder="Write detailed interview feedback, technical assessment notes, or soft skills impression..."
                value={newFeedbackText}
                onChange={(e) => setNewFeedbackText(e.target.value)}
                className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:ring-indigo-500 text-slate-800"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newFeedbackText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>Save Feedback Note</span>
                </button>
              </div>
            </form>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Candidate ID: {candidate.id}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}
