import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { ArrowLeft, Save, Briefcase } from 'lucide-react';

export default function CreateJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    description: '',
    requirements: '',
    skills: '',
    experience: '3+ years',
    employmentType: 'Full-time',
    location: 'Bangalore, India',
    workMode: 'Hybrid',
    openings: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description) {
      setError('Job title and description are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await jobService.createJob(formData);
      if (res.success) {
        navigate('/jobs');
      } else {
        setError(res.message || 'Failed to create job.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/jobs')}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Job Requisition
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Post a new job opening to start receiving applicant resumes.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Job Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Senior Full-Stack Engineer"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
            >
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Data Science">Data Science</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Openings Count
            </label>
            <input
              type="number"
              min="1"
              value={formData.openings}
              onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Required Skills (comma separated)
          </label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="React, Node.js, MongoDB, TypeScript"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Job Description *
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the job responsibilities and team role..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Publishing...' : 'Publish Job'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
