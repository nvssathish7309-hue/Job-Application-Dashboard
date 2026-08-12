import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { Plus, Briefcase, MapPin, Users, Building, CheckCircle, PauseCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Jobs() {
  const { hasRole } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchJobs = async () => {
    try {
      const res = await jobService.getJobs({ status: statusFilter });
      if (res.success) setJobs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const handleStatusToggle = async (jobId, currentStatus) => {
    const nextStatus = currentStatus === 'Open' ? 'Paused' : 'Open';
    try {
      await jobService.updateJobStatus(jobId, nextStatus);
      fetchJobs();
    } catch (err) {
      alert('Failed to update job status');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Job Requisitions
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage open job listings, specifications, and recruiter assignments.
          </p>
        </div>

        {hasRole(['SUPER_ADMIN', 'HR_MANAGER']) && (
          <Link
            to="/jobs/create"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Job</span>
          </Link>
        )}
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <span className="text-xs font-bold text-slate-500 ml-2">Status:</span>
        {['All', 'Open', 'Paused', 'Closed'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === st
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {job.jobId}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1">{job.title}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    job.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {job.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 font-semibold">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location} ({job.workMode})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.openings} Openings</span>
                  </div>
                </div>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-1 mt-4">
                  {(job.skills || []).slice(0, 4).map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {hasRole(['SUPER_ADMIN', 'HR_MANAGER']) ? (
                  <button
                    onClick={() => handleStatusToggle(job._id, job.status)}
                    className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1"
                  >
                    {job.status === 'Open' ? <PauseCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    <span>{job.status === 'Open' ? 'Pause' : 'Activate'}</span>
                  </button>
                ) : <span />}

                <span className="text-[11px] text-slate-400 font-medium">
                  Created {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
