import React, { useState, useEffect } from 'react';
import { interviewService } from '../services/interviewService';
import { Calendar, Clock, Video, CheckCircle2, User, FileEdit, CalendarClock, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCandidates } from '../context/CandidateContext';
import ScheduleInterviewModal from '../components/candidates/ScheduleInterviewModal';

export default function Interviews() {
  const { candidates, scheduleInterview } = useCandidates();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchInterviews = async () => {
    try {
      const res = await interviewService.getInterviews();
      if (res.success && res.data?.length > 0) {
        setInterviews(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  // Filter candidates with scheduled interviews from candidate context
  const scheduledCandidates = candidates.filter(c => {
    const st = String(c.status || c.stage || '').toLowerCase();
    return st.includes('interview') || Boolean(c.interview?.date || c.interviewDetails?.date);
  });

  const getInterviewerName = (cand) => {
    let name = cand.interview?.interviewerName || cand.interviewDetails?.interviewerName;
    if (!name) {
      try {
        const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const iUser = savedUsers.find(u => (u.role || '').toUpperCase() === 'INTERVIEWER' || (u.email || '').toLowerCase().includes('interviewer'));
        if (iUser) {
          const iName = (iUser.name || `${iUser.firstName || ''} ${iUser.lastName || ''}`).trim();
          const iDept = iUser.department ? ` (${iUser.department})` : '';
          if (iName) name = `${iName}${iDept}`;
        }
      } catch (e) {}
    }
    return name || 'Interviewer I (Engineering)';
  };

  const handleEditScheduleClick = (cand) => {
    setSelectedCandidate(cand);
    setModalOpen(true);
  };

  const handleConfirmSchedule = async (candId, formData) => {
    await scheduleInterview(candId, formData);
    fetchInterviews();
    alert('Interview schedule updated successfully!');
  };

  return (
    <div className="space-y-6 animate-smooth-grow">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interviews Schedule &amp; Evaluation
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage upcoming candidate interviews, update schedules, and submit evaluation feedback.
          </p>
        </div>
      </div>

      {loading && scheduledCandidates.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scheduledCandidates.map((cand) => {
            const intData = cand.interview || cand.interviewDetails || {};
            const roundName = intData.round || intData.title || 'Technical Round 1';
            const dateStr = intData.date || 'Aug 15, 2026';
            const timeStr = intData.time || intData.startTime ? `${intData.time || intData.startTime}${intData.endTime ? ` - ${intData.endTime}` : ''}` : '10:00 AM - 10:45 AM IST';
            const interviewer = getInterviewerName(cand);
            const meetLink = intData.meetingLink || 'https://meet.google.com/xyz-abc-123';

            return (
              <div key={cand._id || cand.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {roundName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                      Interview Scheduled
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900">
                    {cand.fullName || cand.name || 'Candidate'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {cand.role || cand.appliedRole || 'Frontend Developer'}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{timeStr}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Interviewer: {interviewer}</span>
                    </div>
                    {meetLink && (
                      <div className="flex items-center gap-2 text-blue-600 pt-1">
                        <Video className="w-3.5 h-3.5 shrink-0" />
                        <a href={meetLink} target="_blank" rel="noreferrer" className="underline truncate">
                          Join Google Meet
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleEditScheduleClick(cand)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Change interview date, time, round, or interviewer name"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Edit Schedule</span>
                  </button>

                  <Link
                    to={`/candidates/${cand._id || cand.id}`}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>View / Evaluate</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Interview Schedule Modal */}
      {selectedCandidate && (
        <ScheduleInterviewModal
          candidate={selectedCandidate}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedCandidate(null);
          }}
          onConfirm={handleConfirmSchedule}
        />
      )}
    </div>
  );
}
