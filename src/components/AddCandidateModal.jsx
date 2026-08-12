import React, { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, User, Mail, Phone, Briefcase, GraduationCap, Award, FileText } from 'lucide-react';

export default function AddCandidateModal({ isOpen, onClose, onAddCandidate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Software Engineer',
    experience: 'Fresher',
    skills: '',
    educationDegree: '',
    educationInstitution: '',
    resumeFile: null,
    resumeFileName: ''
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateField = (field, value) => {
    let error = '';
    if (field === 'name') {
      if (!value.trim()) error = 'Full Name is required';
      else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
    } else if (field === 'email') {
      if (!value.trim()) error = 'Email address is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) error = 'Enter a valid email address (e.g. name@company.com)';
    } else if (field === 'phone') {
      if (!value.trim()) error = 'Phone number is required';
      else if (!/^\+?[0-9\s\-()]{8,15}$/.test(value.trim())) error = 'Enter a valid phone number (e.g. +91 9876543210)';
    } else if (field === 'skills') {
      if (!value.trim()) error = 'Provide at least 1 skill';
    } else if (field === 'educationDegree') {
      if (!value.trim()) error = 'Education degree is required';
    }
    return error;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        resumeFile: file,
        resumeFileName: file.name
      }));
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Touch all required fields
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      skills: validateField('skills', formData.skills),
      educationDegree: validateField('educationDegree', formData.educationDegree)
    };

    setTouched({
      name: true,
      email: true,
      phone: true,
      skills: true,
      educationDegree: true
    });

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(err => err !== '');
    if (hasError) return;

    // Split skills string into array
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);

    const newCandidate = {
      id: `cand-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      experience: formData.experience,
      experienceYears: formData.experience === 'Fresher' ? 0 : parseInt(formData.experience),
      skills: skillsArray.length > 0 ? skillsArray : ['General'],
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      location: 'Bengaluru, India',
      education: {
        degree: formData.educationDegree.trim(),
        institution: formData.educationInstitution.trim() || 'University / Institute',
        year: '2026',
        gpa: 'N/A'
      },
      projects: [],
      resume: {
        fileName: formData.resumeFileName || `${formData.name.replace(/\s+/g, '_')}_CV.pdf`,
        fileSize: formData.resumeFile ? `${(formData.resumeFile.size / 1024 / 1024).toFixed(1)} MB` : '1.2 MB',
        uploadedAt: new Date().toISOString().split('T')[0],
        previewText: `${formData.name} — Candidate for ${formData.role}. Experience: ${formData.experience}. Skills: ${skillsArray.join(', ')}.`
      },
      interviewFeedback: []
    };

    onAddCandidate(newCandidate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Add New Candidate Application
            </h2>
            <p className="text-xs text-slate-500">
              Fill in candidate credentials and upload resume for evaluation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Candidate Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl ${
                    errors.name && touched.name
                      ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {errors.name && touched.name && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="example123@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl ${
                    errors.email && touched.email
                      ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {errors.email && touched.email && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Phone & Target Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl ${
                    errors.phone && touched.phone
                      ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {errors.phone && touched.phone && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Applying For Role <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="AI Engineer">AI Engineer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Experience & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Experience <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-indigo-500 font-medium cursor-pointer"
              >
                <option value="Fresher">Fresher (0 yrs)</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Technical Skills (Comma separated) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Java, SQL, Python, AI, React"
                value={formData.skills}
                onChange={(e) => handleChange('skills', e.target.value)}
                onBlur={() => handleBlur('skills')}
                className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl ${
                  errors.skills && touched.skills
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-200 focus:ring-indigo-500'
                }`}
              />
              {errors.skills && touched.skills && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.skills}
                </p>
              )}
            </div>
          </div>

          {/* Education Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Degree & Major <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. B.Tech in Computer Science"
                  value={formData.educationDegree}
                  onChange={(e) => handleChange('educationDegree', e.target.value)}
                  onBlur={() => handleBlur('educationDegree')}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl ${
                    errors.educationDegree && touched.educationDegree
                      ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {errors.educationDegree && touched.educationDegree && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.educationDegree}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                University / Institution
              </label>
              <input
                type="text"
                placeholder="e.g. IIT Madras"
                value={formData.educationInstitution}
                onChange={(e) => handleChange('educationInstitution', e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Resume Drag & Drop File Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Resume Upload (PDF/DOCX)
            </label>
            
            <div className="relative border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors group cursor-pointer">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                  {formData.resumeFileName ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <Upload className="w-6 h-6" />}
                </div>
                <div>
                  {formData.resumeFileName ? (
                    <div>
                      <p className="text-sm font-bold text-emerald-600">
                        File selected: {formData.resumeFileName}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">Click to replace file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Click to upload resume or drag and drop
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">PDF, DOCX up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all"
            >
              Submit Application
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
