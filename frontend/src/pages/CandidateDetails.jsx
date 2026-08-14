import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap,
  Code2, FileText, Download, ExternalLink, Star, ChevronLeft,
  CalendarClock, Award, UserX, CheckCircle2, Clock, AlertCircle, Trash2, Video
} from 'lucide-react';
import { useCandidates } from '../context/CandidateContext';
import { candidateService } from '../services/candidateService';
import { INITIAL_CANDIDATES } from '../data/mockCandidates';
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
  const [, setTeamUpdateTick] = useState(0);

  useEffect(() => {
    const handleTeamUpdate = () => setTeamUpdateTick(t => t + 1);
    window.addEventListener('teamMembersUpdated', handleTeamUpdate);
    window.addEventListener('userProfileUpdated', handleTeamUpdate);
    return () => {
      window.removeEventListener('teamMembersUpdated', handleTeamUpdate);
      window.removeEventListener('userProfileUpdated', handleTeamUpdate);
    };
  }, []);

  const contextCandidate = getCandidateById(id);
  const [asyncCandidate, setAsyncCandidate] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (contextCandidate) {
      setAsyncCandidate(contextCandidate);
      return;
    }

    let found = null;
    try {
      const saved = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
      const target = String(id || '').toLowerCase();
      found = saved.find(c =>
        String(c._id || '').toLowerCase() === target ||
        String(c.id || '').toLowerCase() === target ||
        String(c.candidateId || '').toLowerCase() === target ||
        String(c.applicationId || '').toLowerCase() === target ||
        ((target === 'undefined' || target === 'null' || target.includes('sathish')) && (c.email?.toLowerCase().includes('sathish') || c.fullName?.toLowerCase().includes('sathish')))
      );
      if (!found && saved.length > 0 && (target === 'undefined' || target === 'null')) {
        found = saved[0];
      }
    } catch (e) {}

    if (!found) {
      found = INITIAL_CANDIDATES.find(c =>
        String(c.id || '').toLowerCase() === String(id || '').toLowerCase() ||
        String(c._id || '').toLowerCase() === String(id || '').toLowerCase()
      );
    }

    if (!found && id && id !== 'undefined') {
      setFetching(true);
      candidateService.getCandidateById(id)
        .then(res => {
          if (res?.success && res?.data) {
            setAsyncCandidate(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setFetching(false));
    } else {
      setAsyncCandidate(found || null);
    }
  }, [id, contextCandidate]);

  const candidate = contextCandidate || asyncCandidate;

  const candidateApplications = useMemo(() => {
    if (!candidate) return [];
    if (candidate.applications && candidate.applications.length > 0) {
      return candidate.applications;
    }
    return [{
      _id: candidate._id || candidate.id,
      applicationId: candidate.applicationId || 'APP-0001',
      jobTitle: candidate.role || 'Position Applied',
      role: candidate.role || 'Position Applied',
      status: candidate.status || 'Applied',
      stage: candidate.stage || candidate.status || 'Applied',
      source: candidate.source || 'Candidate Portal',
      appliedAt: candidate.appliedDate || candidate.createdAt || new Date().toISOString()
    }];
  }, [candidate]);

  const handleDeleteCandidate = () => {
    if (window.confirm(`Are you sure you want to delete ${candidate?.name || candidate?.fullName || 'this candidate'}? All associated notifications will also be deleted.`)) {
      deleteCandidate(candidate?._id || candidate?.id || id);
      navigate('/candidates');
    }
  };

  if (isLoading || fetching) return <DetailsSkeleton />;

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

  const interviewObj = candidate.interview || candidate.interviewDetails || {};
  const candStageStr = String(candidate.stage || candidate.status || '').toLowerCase();
  const isInterviewScheduled =
    candStageStr.includes('interview') ||
    interviewObj.status === 'Scheduled' ||
    Boolean(interviewObj.date || interviewObj.meetingLink);

  const interviewRound = interviewObj.round || interviewObj.title || 'Technical Round 1';
  const interviewDate = interviewObj.date || 'Aug 15, 2026';
  const interviewTime = interviewObj.startTime ? `${interviewObj.startTime}${interviewObj.endTime ? ` - ${interviewObj.endTime}` : ''}` : '10:00 AM - 10:45 AM IST';
  let interviewerName = '';
  try {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const interviewerUser = savedUsers.find(u =>
      (u.role || '').toUpperCase() === 'INTERVIEWER' ||
      (u.email || '').toLowerCase().includes('interviewer')
    );
    if (interviewerUser) {
      const iName = (interviewerUser.name || `${interviewerUser.firstName || ''} ${interviewerUser.lastName || ''}`).trim();
      const iDept = interviewerUser.department ? ` (${interviewerUser.department})` : '';
      if (iName) interviewerName = `${iName}${iDept}`;
    }
  } catch (e) {}

  const candInterviewer = interviewObj.interviewerName || interviewObj.interviewer;
  if (candInterviewer && 
      !candInterviewer.toLowerCase().startsWith('interviewer') && 
      !candInterviewer.toLowerCase().includes('santhosh') && 
      !candInterviewer.toLowerCase().includes('tirumal')) {
    interviewerName = candInterviewer;
  }
  if (!interviewerName) interviewerName = 'Interviewer 1234 (Engineering)';
  const meetingLink = interviewObj.meetingLink || 'https://meet.google.com/xyz-abc-123';
  const feedback = candidate.interviewFeedback || [];
  const candNameClean = (candidate?.name || candidate?.fullName || 'Candidate').replace(/\s+/g, '_');
  const resumeFileName = typeof candidate?.resume === 'object' && candidate?.resume?.fileName
    ? candidate.resume.fileName
    : typeof candidate?.resume === 'string' && candidate.resume.length > 0
    ? candidate.resume
    : `${candNameClean}_Resume.pdf`;

  const resumeFileSize = typeof candidate?.resume === 'object' && candidate?.resume?.fileSize
    ? candidate.resume.fileSize
    : '1.2 MB (PDF Document)';

  const resumeUrl = typeof candidate?.resume === 'object' && candidate?.resume?.url
    ? candidate.resume.url
    : typeof candidate?.resume === 'string' && candidate.resume.startsWith('http')
    ? candidate.resume
    : '#';

  const handleViewResume = () => {
    if (resumeUrl && resumeUrl !== '#') {
      window.open(resumeUrl, '_blank');
    } else {
      const win = window.open('', '_blank');
      if (win) {
        const skillsList = Array.isArray(candidate.skills) ? candidate.skills : ['JavaScript', 'React.js', 'Node.js', 'Express', 'MongoDB'];
        win.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Resume — ${candidate.name || candidate.fullName || 'Candidate'}</title>
              <style>
                body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; background: #f8fafc; color: #0f172a; max-width: 800px; margin: 0 auto; }
                .card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
                h1 { color: #1e293b; margin-bottom: 4px; font-size: 28px; }
                .subtitle { color: #2563eb; font-weight: bold; font-size: 16px; margin-bottom: 20px; }
                .section { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
                .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 12px; }
                .item { font-size: 14px; margin-bottom: 8px; color: #334155; }
                .badge { display: inline-block; background: #eff6ff; color: #2563eb; padding: 4px 10px; border-radius: 9999px; font-weight: bold; font-size: 12px; margin: 3px 2px; }
                .btn-print { margin-bottom: 20px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
              </style>
            </head>
            <body>
              <button class="btn-print" onclick="window.print()">🖨️ Print / Save PDF</button>
              <div class="card">
                <h1>${candidate.name || candidate.fullName || 'Candidate'}</h1>
                <div class="subtitle">${candidate.role || 'Software Engineer'}</div>
                
                <div class="section">
                  <div class="section-title">Contact Information</div>
                  <div class="item">📧 Email: ${candidate.email || 'N/A'}</div>
                  <div class="item">📞 Phone: ${candidate.phone || '+91 9876543210'}</div>
                  <div class="item">📍 Location: ${candidate.location || 'Bangalore, India'}</div>
                </div>

                <div class="section">
                  <div class="section-title">Experience & Background</div>
                  <div class="item">💼 Experience Level: ${candidate.experience || 'Fresh Graduate'}</div>
                  <div class="item">🏢 Previous Company: ${candidate.previousCompany || 'MindMatrix Hiring'}</div>
                  <div class="item">🎯 Role: ${candidate.role || 'Software Engineer'}</div>
                </div>

                <div class="section">
                  <div class="section-title">Education Qualification</div>
                  <div class="item">🎓 Qualification: ${eduText || 'B.Tech Computer Science'}</div>
                  ${eduInstitution ? `<div class="item">🏫 Institution: ${eduInstitution}</div>` : ''}
                </div>

                <div class="section">
                  <div class="section-title">Skills & Technologies</div>
                  <div>
                    ${skillsList.map(s => `<span class="badge">${s}</span>`).join('')}
                  </div>
                </div>
              </div>
            </body>
          </html>
        `);
        win.document.close();
      }
    }
  };

  const handleDownloadResume = () => {
    if (resumeUrl && resumeUrl !== '#') {
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = resumeFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const skillsList = Array.isArray(candidate.skills) ? candidate.skills.join(', ') : 'JavaScript, React.js, Node.js, Express, MongoDB';
      const resumeContent = `==================================================
RESUME: ${candidate.name || candidate.fullName || 'Candidate'}
Position: ${candidate.role || 'Applicant'}
==================================================

CONTACT INFORMATION:
- Email: ${candidate.email || 'N/A'}
- Phone: ${candidate.phone || '+91 9876543210'}
- Location: ${candidate.location || 'Bangalore, India'}

EXPERIENCE & BACKGROUND:
- Experience: ${candidate.experience || 'Fresh Graduate'}
- Company: ${candidate.previousCompany || 'MindMatrix Applicant'}

EDUCATION:
- Qualification: ${eduText || 'B.Tech Computer Science'}

SKILLS & CORE COMPETENCIES:
- ${skillsList}

SUMMARY:
Candidate Application Profile stored on MindMatrix Dashboard.
==================================================`;

      const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${candNameClean}_Resume.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

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
            {(candidate.fullName || candidate.name || 'Candidate').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-xl font-extrabold text-slate-900">{candidate.fullName || candidate.name || 'Candidate'}</h1>
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

          {/* Submitted Job Applications List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Submitted Job Applications ({candidateApplications.length})</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold border border-blue-200">
                Single Candidate Profile
              </span>
            </div>

            <div className="space-y-2.5">
              {candidateApplications.map((app, idx) => (
                <div key={app._id || app.applicationId || idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 transition-all">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {app.jobTitle || app.role || candidate.role}
                      </h3>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        {app.applicationId || `APP-00${idx + 1}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold mt-1">
                      <span>Applied: {app.appliedAt ? (typeof app.appliedAt === 'string' && app.appliedAt.includes('T') ? app.appliedAt.split('T')[0] : app.appliedAt) : 'Recent'}</span>
                      <span>•</span>
                      <span>Source: {app.source || 'Candidate Portal'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge status={app.stage || app.status || 'Applied'} />
                  </div>
                </div>
              ))}
            </div>
          </div>

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
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-blue-500" /> Resume Document
            </h2>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate" title={resumeFileName}>{resumeFileName}</p>
                <p className="text-[11px] text-slate-400 font-medium">{resumeFileSize}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleViewResume}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-extrabold text-xs border border-slate-200 transition-all cursor-pointer shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Resume
              </button>
              <button
                onClick={handleDownloadResume}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>

          {/* Interview Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <CalendarClock className="w-4 h-4 text-amber-500" /> Interview Status
            </h2>
            {isInterviewScheduled ? (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-extrabold text-emerald-600 text-sm">Interview Scheduled</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{interviewDate} • {interviewTime}</span>
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-700">Round:</span> {interviewRound}
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-700">Interviewer:</span> {interviewerName}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 mt-2">
                  {meetingLink && (
                    <a
                      href={meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold rounded-xl border border-emerald-200 text-xs transition-all shadow-2xs cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Google Meet</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}
                  <button
                    onClick={() => setScheduleOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl border border-amber-200 text-xs transition-all cursor-pointer"
                  >
                    <CalendarClock className="w-3.5 h-3.5" />
                    <span>Edit Schedule</span>
                  </button>
                </div>
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
