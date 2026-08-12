import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap,
  Code2, FileText, Download, ExternalLink, Star, ChevronLeft,
  CalendarClock, Award, UserX, CheckCircle2, Clock, AlertCircle, Trash2
} from 'lucide-react';
import { useCandidates } from '../context/CandidateContext';
import Badge from '../components/common/Badge';
import { DetailsSkeleton } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import Toast from '../components/common/Toast';
import ScheduleInterviewModal from '../components/candidates/ScheduleInterviewModal';
import ShortlistModal from '../components/candidates/ShortlistModal';
import SelectModal from '../components/candidates/SelectModal';
import RejectModal from '../components/candidates/RejectModal';

function StarRating({ rating = 0 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : i < rating ? 'text-amber-400 fill-amber-200' : 'text-slate-300'}`}
        />
      ))}
      <span className="ml-1.5 text-xs font-bold text-slate-700">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidateById, deleteCandidate, scheduleInterview, shortlistCandidate, selectCandidate, rejectCandidate, isLoading } = useCandidates();

  const [toast, setToast] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const handleDeleteCandidate = () => {
    if (window.confirm(`Are you sure you want to delete ${candidate?.name || 'this candidate'}? All associated notifications will also be deleted.`)) {
      deleteCandidate(id);
      navigate('/candidates');
    }
  };

  const candidate = getCandidateById(id);

  if (isLoading) return <DetailsSkeleton />;

  if (!candidate) {
    return (
      <ErrorState
        title="Candidate not found"
        message="This candidate profile doesn't exist or may have been removed."
        onRetry={() => navigate('/candidates')}
      />
    );
  }

  const handleSchedule = (candidateId, data) => {
    scheduleInterview(candidateId, data);
    setToast({ type: 'success', message: `Interview scheduled for ${candidate.name}` });
  };

  const handleShortlist = (candidateId) => {
    shortlistCandidate(candidateId);
    setToast({ type: 'success', message: `${candidate.name} has been shortlisted` });
  };

  const handleSelect = (candidateId) => {
    selectCandidate(candidateId);
    setToast({ type: 'success', message: `${candidate.name} has been marked as Selected!` });
  };

  const handleReject = (candidateId, reason) => {
    rejectCandidate(candidateId, reason);
    setToast({ type: 'info', message: `${candidate.name}'s application has been rejected` });
  };

  const edu = candidate.education;
  const eduText = typeof edu === 'string' ? edu : edu?.degree;
  const eduInstitution = typeof edu === 'object' ? edu?.institution : '';
  const eduYear = typeof edu === 'object' ? edu?.year : '';
  const eduGpa = typeof edu === 'object' ? edu?.gpa : '';

  const interview = candidate.interview || {};
  const feedback = candidate.interviewFeedback || [];

  return (
    <div className="space-y-5 max-w-5xl animate-fade-in">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
        <span>/</span>
        <Link to="/candidates" className="hover:text-blue-600 transition-colors">Candidates</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{candidate.name}</span>
      </nav>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Candidates
      </button>

      {/* Candidate Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">

          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-extrabold text-xl flex items-center justify-center shrink-0">
            {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-xl font-extrabold text-slate-900">{candidate.name}</h1>
              <Badge status={candidate.status} />
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-3">{candidate.role} · {candidate.experience}</p>

            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" />{candidate.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{candidate.phone}</span>
              {candidate.location && (
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{candidate.location}</span>
              )}
              {candidate.appliedDate && (
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" />Applied {candidate.appliedDate}</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => setScheduleOpen(true)}
              disabled={candidate.status === 'Rejected'}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              <CalendarClock className="w-3.5 h-3.5" />
              Schedule Interview
            </button>
            <button
              onClick={() => setShortlistOpen(true)}
              disabled={candidate.status === 'Shortlisted' || candidate.status === 'Rejected' || candidate.status === 'Selected'}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              Shortlist
            </button>
            <button
              onClick={() => setSelectOpen(true)}
              disabled={candidate.status === 'Selected' || candidate.status === 'Rejected'}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Select Candidate
            </button>
            <button
              onClick={() => setRejectOpen(true)}
              disabled={candidate.status === 'Rejected'}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed text-rose-600 border border-rose-200 font-semibold text-xs rounded-xl transition-all"
            >
              <UserX className="w-3.5 h-3.5" />
              Reject
            </button>
            <button
              onClick={handleDeleteCandidate}
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 font-semibold text-xs rounded-xl transition-all cursor-pointer mt-1 sm:mt-0"
              title="Delete candidate profile and remove all associated notifications"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Candidate
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Skills */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Code2 className="w-4 h-4 text-blue-500" /> Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {(candidate.skills || []).map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Projects */}
          {candidate.projects?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-blue-500" /> Projects
              </h2>
              <div className="space-y-4">
                {candidate.projects.map((proj, i) => (
                  <div key={i} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 text-sm">{proj.title}</h3>
                      {proj.link && (
                        <a href={`https://${proj.link}`} target="_blank" rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 shrink-0">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {(proj.techStack || []).map((t, ti) => (
                        <span key={ti} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interview Feedback */}
          {feedback.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-400" /> Interview Feedback
              </h2>
              <div className="space-y-4">
                {feedback.map((fb, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <span className="text-xs font-bold text-slate-800">{fb.stage}</span>
                      <StarRating rating={fb.rating} />
                    </div>
                    <p className="text-xs text-slate-600 mb-2 leading-relaxed">{fb.comments}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold">Interviewer:</span>
                      <span>{fb.interviewer}</span>
                      {fb.date && <span>· {fb.date}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-5">

          {/* Personal Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Personal Information</h2>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-0.5">Full Name</p>
                <p className="text-slate-800 font-semibold">{candidate.name}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-0.5">Email</p>
                <p className="text-slate-800 break-all">{candidate.email}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-0.5">Phone</p>
                <p className="text-slate-800">{candidate.phone}</p>
              </div>
              {candidate.location && (
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-0.5">Location</p>
                  <p className="text-slate-800">{candidate.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-blue-500" /> Education
            </h2>
            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-800">{eduText}</p>
              {eduInstitution && <p className="text-slate-600">{eduInstitution}</p>}
              <div className="flex items-center gap-3 text-slate-500">
                {eduYear && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{eduYear}</span>}
                {eduGpa && <span className="font-semibold text-blue-600">CGPA: {eduGpa}</span>}
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-blue-500" /> Experience
            </h2>
            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-800">{candidate.experience}</p>
              {candidate.previousCompany && <p className="text-slate-600">{candidate.previousCompany}</p>}
              {candidate.previousRole && <p className="text-slate-500 italic">{candidate.previousRole}</p>}
            </div>
          </div>

          {/* Resume */}
          {candidate.resume && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-blue-500" /> Resume
              </h2>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{candidate.resume.fileName}</p>
                  <p className="text-[11px] text-slate-400">{candidate.resume.fileSize}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-semibold text-xs border border-slate-200 transition-all">
                  <ExternalLink className="w-3.5 h-3.5" /> View
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          )}

          {/* Interview Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <CalendarClock className="w-4 h-4 text-amber-500" /> Interview Status
            </h2>
            {interview.status === 'Scheduled' ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-emerald-600">Interview Scheduled</span>
                </div>
                {interview.date && <div className="flex items-center gap-1.5 text-slate-600"><Clock className="w-3 h-3" />{interview.date}</div>}
                {interview.round && <div className="text-slate-600"><span className="font-semibold">Round:</span> {interview.round}</div>}
                {interview.interviewer && <div className="text-slate-600"><span className="font-semibold">Interviewer:</span> {interview.interviewer}</div>}
                {interview.meetingLink && (
                  <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline">
                    <ExternalLink className="w-3 h-3" /> Join Meeting
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                <span>Not Scheduled</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ScheduleInterviewModal candidate={candidate} isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} onConfirm={handleSchedule} />
      <ShortlistModal candidate={candidate} isOpen={shortlistOpen} onClose={() => setShortlistOpen(false)} onConfirm={handleShortlist} />
      <SelectModal candidate={candidate} isOpen={selectOpen} onClose={() => setSelectOpen(false)} onConfirm={handleSelect} />
      <RejectModal candidate={candidate} isOpen={rejectOpen} onClose={() => setRejectOpen(false)} onConfirm={handleReject} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
