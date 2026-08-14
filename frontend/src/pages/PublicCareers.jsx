import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { candidateService } from '../services/candidateService';
import { Briefcase, MapPin, Building, CheckCircle, Upload, ChevronLeft } from 'lucide-react';
import MindMatrixLogo from '../components/MindMatrixLogo';

export default function PublicCareers() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [applicantForm, setApplicantForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: 'Fresher',
    education: 'Bachelor Degree',
    skills: 'React, Node.js',
    resume: null
  });

  useEffect(() => {
    const fetchPublicJobs = async () => {
      try {
        const res = await jobService.getPublicJobs();
        if (res.success) setJobs(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicJobs();
  }, []);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applicantForm.resume) {
      alert('Please select and upload your resume (PDF or DOCX format) before submitting your application.');
      return;
    }
    const formData = new FormData();
    formData.append('fullName', applicantForm.fullName);
    formData.append('email', applicantForm.email);
    formData.append('phone', applicantForm.phone);
    formData.append('role', selectedJob ? selectedJob.title : 'Software Engineer');
    formData.append('experience', applicantForm.experience);
    formData.append('education', applicantForm.education);
    formData.append('skills', applicantForm.skills);
    if (applicantForm.resume) {
      formData.append('resume', applicantForm.resume);
    }

    try {
      const res = await candidateService.createCandidate(formData);
      if (res.success) {
        window.dispatchEvent(new CustomEvent('candidateSubmitted', { detail: res.data }));
        setSubmitted(true);
      }
    } catch (err) {
      alert('Application submission failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 select-none">
            <MindMatrixLogo layout="iconOnly" />
            <div className="flex items-center text-lg sm:text-xl font-extrabold tracking-tight">
              <span style={{ color: '#1d4ed8' }}>Mind</span>
              <span style={{ color: '#3b82f6' }}>Matrix</span>
              <span className="ml-2 text-slate-900 font-extrabold">Careers</span>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <span>Back</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto py-8 px-4 space-y-8">
        
        {/* Banner */}
        <div className="bg-blue-600 text-white rounded-3xl p-8 shadow-xl text-center space-y-3">
          <h1 className="text-3xl font-black tracking-tight">Join Our Global Talent Team</h1>
          <p className="text-sm font-medium text-blue-100 max-w-2xl mx-auto">
            Explore open opportunities and submit your resume directly to our recruiting managers.
          </p>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">{job.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-1">
                    <span><Building className="w-3.5 h-3.5 inline mr-1" />{job.department}</span>
                    <span><MapPin className="w-3.5 h-3.5 inline mr-1" />{job.location}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 mt-3">{job.description}</p>
                </div>

                <button
                  onClick={() => { setSelectedJob(job); setSubmitted(false); }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal Apply Form */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5">
              
              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="text-xl font-extrabold text-slate-900">Application Submitted!</h3>
                  <p className="text-xs text-slate-500">Thank you for applying for {selectedJob.title}. Our HR team will review your application.</p>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-extrabold text-lg text-slate-900">Apply for {selectedJob.title}</h3>
                    <button onClick={() => setSelectedJob(null)} className="text-slate-400 font-bold">✕</button>
                  </div>

                  <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sathish N"
                        value={applicantForm.fullName}
                        onChange={(e) => setApplicantForm({ ...applicantForm, fullName: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        style={{ color: '#0f172a' }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="sathish@example.com"
                          value={applicantForm.email}
                          onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          style={{ color: '#0f172a' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-slate-900 mb-1">
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9876543210"
                          value={applicantForm.phone}
                          onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          style={{ color: '#0f172a' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 mb-1">
                        Upload Resume (PDF, DOCX) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="file"
                        required
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setApplicantForm({ ...applicantForm, resume: e.target.files[0] })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                        style={{ color: '#0f172a' }}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedJob(null)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl border border-slate-300 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                      >
                        Submit Application
                      </button>
                    </div>
                  </form>
                </>
              )}

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
