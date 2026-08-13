import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Mail, Phone, Briefcase, GraduationCap, Code2,
  Upload, X, CheckCircle2, ChevronLeft, Plus, AlertCircle, FileText
} from 'lucide-react';
import { useCandidates } from '../context/CandidateContext';
import { useAuth } from '../context/AuthContext';
import { validateCandidateForm } from '../utils/validation';
import Toast from '../components/common/Toast';

const ROLES = [
  'Software Engineer', 'AI Engineer', 'Frontend Developer',
  'Backend Developer', 'Full Stack Developer', 'UI/UX Designer',
  'DevOps Engineer', 'Data Engineer', 'Product Manager', 'QA Engineer'
];

const EXPERIENCE_LEVELS = [
  'Fresher', '1 Year', '2 Years', '3 Years', '4 Years', '5 Years', '6–8 Years', '8+ Years'
];

function FieldError({ error }) {
  if (!error) return null;
  return (
    <p className="flex items-center gap-1 text-[11px] text-rose-600 mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {error}
    </p>
  );
}

export default function AddCandidate() {
  const navigate = useNavigate();
  const { addCandidate } = useCandidates();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', role: '', experience: '',
    skills: [], education: '', resumeFileName: '', resume: null
  });

  // Auto pre-fill personal info from login details for candidates/users
  useEffect(() => {
    if (user) {
      const defaultName = (user.firstName && user.lastName)
        ? `${user.firstName} ${user.lastName}`
        : (user.name || '');
      setFormData(prev => ({
        ...prev,
        name: prev.name || defaultName,
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);
  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const set = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !formData.skills.includes(s)) {
      set('skills', [...formData.skills, s]);
      if (errors.skills) setErrors(prev => { const e = { ...prev }; delete e.skills; return e; });
    }
    setSkillInput('');
  };

  const handlePhoneChange = (e) => {
    let input = e.target.value;
    let digits = input.replace(/\D/g, '');
    if (digits.startsWith('91')) {
      digits = digits.slice(2);
    }
    const trimmedDigits = digits.slice(0, 10);
    const formatted = trimmedDigits ? `+91 ${trimmedDigits}` : '';
    set('phone', formatted);
  };

  const removeSkill = (skill) => set('skills', formData.skills.filter(s => s !== skill));

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(); }
  };

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(file.type) && !['pdf', 'doc', 'docx'].includes(ext)) {
      setErrors(prev => ({ ...prev, resume: 'Only PDF, DOC, and DOCX files are allowed.' }));
      return;
    }
    set('resumeFileName', file.name);
    set('resume', file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateCandidateForm(formData);
    if (!isValid) { setErrors(validationErrors); return; }

    setIsSubmitting(true);
    // Simulate a small async delay (for loading UX)
    await new Promise(r => setTimeout(r, 600));

    const newCandidate = addCandidate({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      experience: formData.experience,
      experienceYears: parseInt(formData.experience) || 0,
      skills: formData.skills,
      education: formData.education.trim(),
      resumeFileName: formData.resumeFileName
    });

    setIsSubmitting(false);
    setToast({ type: 'success', message: `${formData.name} has been added to the candidate pool!` });

    setTimeout(() => navigate(`/candidates/${newCandidate.id}`), 1200);
  };

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl transition-all text-slate-900 placeholder-slate-400 focus:outline-none ${errors[field]
      ? 'border-rose-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500'
      : 'border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-300'
    }`;

  return (
    <div className="max-w-3xl animate-fade-in">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
        <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
        <span>/</span>
        <Link to="/candidates" className="hover:text-blue-600 transition-colors">Candidates</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Add Candidate</span>
      </nav>

      <button
        onClick={() => navigate(-1)}
        className="no-glow inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors mb-5"
      >
        <ChevronLeft className="w-4 h-4 text-slate-500" /> Back
      </button>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add New Candidate</h1>
        <p className="text-sm text-slate-500 mt-1">Fill in the candidate's information to add them to your recruitment pipeline.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* Section 1: Personal Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-extrabold">1</div>
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text" placeholder="e.g. Candidate Name"
                  value={formData.name} onChange={e => set('name', e.target.value)}
                  className={`${inputClass('name')} pl-9`}
                />
              </div>
              <FieldError error={errors.name} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email" placeholder="example123@gmail.com"
                  value={formData.email} onChange={e => set('email', e.target.value)}
                  className={`${inputClass('email')} pl-9`}
                />
              </div>
              <FieldError error={errors.email} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  maxLength={15}
                  className={`${inputClass('phone')} pl-9`}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Must be exactly 10 digits</p>
              <FieldError error={errors.phone} />
            </div>
          </div>
        </div>

        {/* Section 2: Application Details */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-extrabold">2</div>
            Application Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Role / Position <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                <select
                  value={formData.role} onChange={e => set('role', e.target.value)}
                  className={`${inputClass('role')} pl-9 appearance-none`}
                >
                  <option value="">Select a role...</option>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <FieldError error={errors.role} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Experience Level <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.experience} onChange={e => set('experience', e.target.value)}
                className={`${inputClass('experience')} appearance-none`}
              >
                <option value="">Select experience...</option>
                {EXPERIENCE_LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
              <FieldError error={errors.experience} />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Skills <span className="text-rose-500">*</span>
              </label>
              <div className={`flex flex-wrap gap-2 p-3 min-h-[52px] rounded-xl border transition-all ${errors.skills
                ? 'border-rose-400 focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-rose-500'
                : 'border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-300 focus-within:bg-white'
                } bg-slate-50`}>
                {formData.skills.map((skill, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="text-blue-500 hover:text-rose-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={formData.skills.length === 0 ? 'Type a skill and press Enter...' : 'Add more...'}
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  onBlur={addSkill}
                  className="flex-1 min-w-[140px] bg-transparent outline-none text-sm text-slate-900 placeholder-slate-400"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Press Enter or comma to add skills</p>
              <FieldError error={errors.skills} />
            </div>
          </div>
        </div>

        {/* Section 3: Education */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-extrabold">3</div>
            Education
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Highest Qualification <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text" placeholder="e.g. B.Tech Computer Science, IIT Delhi (2026)"
                value={formData.education} onChange={e => set('education', e.target.value)}
                className={`${inputClass('education')} pl-9`}
              />
            </div>
            <FieldError error={errors.education} />
          </div>
        </div>

        {/* Section 4: Resume Upload */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-extrabold">4</div>
            Resume Upload <span className="text-rose-500">*</span>
          </h2>

          <input
            type="file" ref={fileInputRef} accept=".pdf,.doc,.docx"
            onChange={e => handleFile(e.target.files[0])} className="hidden"
          />

          {formData.resumeFileName ? (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/50">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{formData.resumeFileName}</p>
                <p className="text-xs text-blue-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> File selected and ready
                </p>
              </div>
              <button
                type="button"
                onClick={() => { set('resumeFileName', ''); set('resume', null); }}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`btn-moving-light rounded-2xl p-10 text-center cursor-pointer transition-all relative ${isDragOver
                ? 'bg-blue-50/80 shadow-md'
                : errors.resume
                  ? 'border border-rose-300'
                  : 'bg-white hover:bg-slate-50/80'
                }`}
            >
              <div className="relative z-[2]">
                <Upload className={`w-8 h-8 mx-auto mb-3 ${isDragOver ? 'text-blue-500' : 'text-blue-600'}`} />
                <p className="text-sm font-bold text-slate-700 mb-1">Upload Resume <span className="text-rose-500">*</span></p>
                <p className="text-xs text-slate-500">Drag & drop or <span className="text-blue-600 font-semibold">browse files</span></p>
                <p className="text-[11px] text-slate-400 mt-1">PDF, DOC, DOCX — Max 5MB</p>
              </div>
            </div>
          )}
          <FieldError error={errors.resume} />
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 justify-end pb-6">
          <button
            type="button"
            onClick={() => navigate('/candidates')}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Adding Candidate...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Candidate
              </>
            )}
          </button>
        </div>
      </form>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
