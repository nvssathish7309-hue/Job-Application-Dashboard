import React, { useState, useEffect } from 'react';
import { interviewService } from '../services/interviewService';
import { Calendar, Clock, Video, CheckCircle2, User, FileEdit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      const res = await interviewService.getInterviews();
      if (res.success) setInterviews(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Interviews Schedule & Evaluation
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Manage upcoming candidate interviews and submit evaluation feedback.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviews.map((item) => (
            <div key={item._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {item.round}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900">
                  {item.candidateId?.fullName || 'Candidate'}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {item.candidateId?.role || 'Applicant'}
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-600 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                  {item.meetingLink && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Video className="w-3.5 h-3.5" />
                      <a href={item.meetingLink} target="_blank" rel="noreferrer" className="underline truncate">
                        Join Meeting Link
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">
                  Interviewer: {item.interviewerId?.firstName || 'Assigned'}
                </span>

                <Link
                  to={`/interviews/${item._id}/feedback`}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>{item.status === 'Completed' ? 'View Evaluation' : 'Submit Rating'}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
