import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  User,
  Phone,
  Mail,
  Briefcase,
  Bell, 
  Shield, 
  Database, 
  Check, 
  RefreshCw, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Save,
  GraduationCap,
  Upload,
  X,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCandidates } from '../context/CandidateContext';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/common/Toast';

const ROLES = [
  'Software Engineer', 'AI Engineer', 'Frontend Developer',
  'Backend Developer', 'Full Stack Developer', 'UI/UX Designer',
  'DevOps Engineer', 'Data Engineer', 'Product Manager', 'QA Engineer'
];

const EXPERIENCE_LEVELS = [
  'Fresher', '1 Year', '2 Years', '3 Years', '4 Years', '5 Years', '6–8 Years', '8+ Years'
];

export default function SettingsPage() {
  const { candidates, resetToDefaultData } = useCandidates();
  const { user, updateCurrentUser } = useAuth();
  const [toast, setToast] = useState(null);

  // Expanded sections state — default ALL OPEN
  const [expanded, setExpanded] = useState({
    profile: true,
    notifications: true,
    security: true,
    data: true
  });

  // Track if forms have unsaved edits
  const [isProfileEdited, setIsProfileEdited] = useState(false);
  const [isNotificationsEdited, setIsNotificationsEdited] = useState(false);
  const [isSecurityEdited, setIsSecurityEdited] = useState(false);
  const [hrPhoneError, setHrPhoneError] = useState('');

  // Helper to load profile data from logged in user / localStorage per user key
  const loadProfileData = () => {
    let saved = null;
    const userKey = `userProfile_${user?.id || user?.email || 'default'}`;
    try {
      const stored = localStorage.getItem(userKey);
      if (stored) saved = JSON.parse(stored);
    } catch (e) {}

    const userName = (user?.firstName && user?.lastName)
      ? `${user.firstName} ${user.lastName}`
      : (user?.name || (user?.email ? user.email.split('@')[0] : 'Sathish N'));

    const userTitle = user?.department || (
      user?.role === 'SUPER_ADMIN' ? 'Super Admin' :
      user?.role === 'HR_MANAGER' ? 'HR Manager' :
      user?.role === 'RECRUITER' ? 'Recruiter' :
      user?.role === 'INTERVIEWER' ? 'Interviewer' : 'Staff Member'
    );

    return {
      name: saved?.name || userName,
      phone: saved?.phone || user?.phone || '+91 9876543210',
      email: user?.email || saved?.email || 'admin@mindmatrix.com',
      title: saved?.title || userTitle
    };
  };

  // Helper to load candidate profile data
  const loadCandidateData = () => {
    let saved = null;
    try {
      const stored = localStorage.getItem('candidateProfile');
      if (stored) saved = JSON.parse(stored);
    } catch (e) {}

    const defaultName = (user?.firstName && user?.lastName)
      ? `${user.firstName} ${user.lastName}`
      : (user?.name || '');

    return {
      name: saved?.name || defaultName || 'Sathish N',
      email: saved?.email || user?.email || 'nvssathish7309@gmail.com',
      phone: saved?.phone || user?.phone || '+91 6380887476',
      role: saved?.role || 'Frontend Developer',
      experience: saved?.experience || '3 Years',
      skills: saved?.skills || ['React.js', 'JavaScript', 'Tailwind CSS', 'Node.js'],
      education: saved?.education || 'B.Tech Computer Science, IIT Delhi (2026)',
      resumeFileName: saved?.resumeFileName || 'Sathish_Resume_2026.pdf',
      resume: null
    };
  };

  const isCandidate = user?.role === 'CANDIDATE';
  const fileInputRef = useRef(null);

  // HR Profile local form state
  const [profileForm, setProfileForm] = useState(loadProfileData);

  // Candidate Profile local form state
  const [candidateForm, setCandidateForm] = useState(loadCandidateData);
  const [candidateSkillInput, setCandidateSkillInput] = useState('');
  const [isCandidateDragOver, setIsCandidateDragOver] = useState(false);
  const [isCandidateProfileEdited, setIsCandidateProfileEdited] = useState(false);

  // Auto-sync profile when user or custom event changes
  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfileForm(loadProfileData());
      setCandidateForm(loadCandidateData());
      setIsProfileEdited(false);
      setIsCandidateProfileEdited(false);
    };

    handleProfileUpdate();
    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('userProfileUpdated', handleProfileUpdate);
  }, [user]);

  const handleCandidateInputChange = (field, value) => {
    setCandidateForm(prev => ({ ...prev, [field]: value }));
    setIsCandidateProfileEdited(true);
  };

  const handleCandidatePhoneChange = (e) => {
    let input = e.target.value;
    let digits = input.replace(/\D/g, '');
    if (digits.startsWith('91')) {
      digits = digits.slice(2);
    }
    const trimmedDigits = digits.slice(0, 10);
    const formatted = trimmedDigits ? `+91 ${trimmedDigits}` : '';
    handleCandidateInputChange('phone', formatted);
  };

  const handleAddCandidateSkill = () => {
    const s = candidateSkillInput.trim();
    if (s && !candidateForm.skills.includes(s)) {
      handleCandidateInputChange('skills', [...candidateForm.skills, s]);
    }
    setCandidateSkillInput('');
  };

  const handleRemoveCandidateSkill = (skill) => {
    handleCandidateInputChange('skills', candidateForm.skills.filter(s => s !== skill));
  };

  const handleCandidateSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAddCandidateSkill(); }
  };

  const handleCandidateFile = (file) => {
    if (!file) return;
    handleCandidateInputChange('resumeFileName', file.name);
    handleCandidateInputChange('resume', file);
  };

  const handleSaveCandidateProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('candidateProfile', JSON.stringify(candidateForm));
    
    // Split name into firstName & lastName to update AuthContext if available
    const nameParts = (candidateForm.name || '').trim().split(/\s+/);
    const fName = nameParts[0] || '';
    const lName = nameParts.slice(1).join(' ') || '';
    if (updateCurrentUser) {
      updateCurrentUser({
        firstName: fName,
        lastName: lName,
        phone: candidateForm.phone
      });
    }

    window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: candidateForm }));
    setIsCandidateProfileEdited(false);
    setToast({ type: 'success', message: 'Candidate Profile & Application details updated successfully!' });
  };

  const hrInitials = useMemo(() => {
    const parts = (profileForm.name || '').trim().split(/\s+/);
    if (!parts || !parts[0]) return 'HR';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [profileForm.name]);

  // Notifications form state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    newCandidateAlert: true,
    interviewReminders: true,
    weeklyReport: false
  });

  // Security form state
  const [security, setSecurity] = useState({
    enforce2FA: true,
    sessionTimeout: '30',
    role: 'Recruiter Admin',
    publicApplications: true
  });

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleProfileInputChange = (field, value) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
    setIsProfileEdited(true); // Blue Save HR Profile button
  };

  const handleHrPhoneChange = (e) => {
    let input = e.target.value;
    let digits = input.replace(/\D/g, '');
    if (digits.startsWith('91')) {
      digits = digits.slice(2);
    }
    const trimmedDigits = digits.slice(0, 10);
    const formatted = trimmedDigits ? `+91 ${trimmedDigits}` : '';
    handleProfileInputChange('phone', formatted);
    if (hrPhoneError) setHrPhoneError('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    let digits = (profileForm.phone || '').replace(/\D/g, '');
    if (digits.startsWith('91')) {
      digits = digits.slice(2);
    }

    if (!profileForm.phone || digits.length !== 10) {
      setHrPhoneError('Phone number must be exactly 10 digits.');
      return;
    }

    setHrPhoneError('');
    const userKey = `userProfile_${user?.id || user?.email || 'default'}`;
    localStorage.setItem(userKey, JSON.stringify(profileForm));
    
    // Split name into firstName & lastName to update AuthContext if available
    const nameParts = (profileForm.name || '').trim().split(/\s+/);
    const fName = nameParts[0] || '';
    const lName = nameParts.slice(1).join(' ') || '';
    if (updateCurrentUser) {
      updateCurrentUser({
        firstName: fName,
        lastName: lName,
        name: profileForm.name,
        phone: profileForm.phone,
        department: profileForm.title
      });
    }

    // Also update matching record in localStorage users array
    try {
      const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = savedUsers.findIndex(u => (u.email || '').toLowerCase() === (user?.email || '').toLowerCase());
      if (userIndex !== -1) {
        savedUsers[userIndex] = {
          ...savedUsers[userIndex],
          name: profileForm.name,
          firstName: fName,
          lastName: lName,
          phone: profileForm.phone,
          department: profileForm.title
        };
        localStorage.setItem('users', JSON.stringify(savedUsers));
      }
    } catch (err) {}

    window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: profileForm }));
    setIsProfileEdited(false);
    
    // Compute new initials for toast
    const parts = (profileForm.name || '').trim().split(/\s+/);
    const newInitials = parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();

    setToast({ 
      type: 'success', 
      message: `Profile updated for ${profileForm.name}! Avatar badge displays "${newInitials}".` 
    });
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    setIsNotificationsEdited(false); // Matrix blue format "Saved" button
    setToast({ type: 'success', message: 'Notification preferences saved successfully!' });
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    setIsSecurityEdited(false); // Matrix blue format "Saved" button
    setToast({ type: 'success', message: 'Security preferences saved successfully!' });
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Role', 'Email', 'Status', 'Applied Date'];
    const rows = candidates.map(c => [c.id, `"${c.name}"`, `"${c.role}"`, c.email, c.status, c.appliedDate || 'N/A']);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MindMatrix_Candidates_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast({ type: 'success', message: `Exported ${candidates.length} candidates to CSV!` });
  };

  const handleResetData = async () => {
    if (window.confirm('Are you sure you want to reset all candidate data and metrics back to default demo records?')) {
      if (typeof resetToDefaultData === 'function') {
        await resetToDefaultData();
      }
      setToast({ type: 'info', message: 'Candidate database & metrics successfully reset to default demo state!' });
    }
  };

  if (isCandidate) {
    return (
      <div className="space-y-6 max-w-4xl animate-fade-in pb-12">
        
        {/* Candidate Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <User className="w-7 h-7 text-blue-600" />
            <span>Candidate Profile &amp; Application Details</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Personal information taken automatically from login details. Edit your details, application role, education, and resume anytime.
          </p>
        </div>

        <form onSubmit={handleSaveCandidateProfile} className="space-y-5">
          
          {/* Section 1: Personal Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-extrabold">1</div>
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Candidate Name"
                    value={candidateForm.name}
                    onChange={e => handleCandidateInputChange('name', e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl transition-all text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="example123@gmail.com"
                    value={candidateForm.email}
                    onChange={e => handleCandidateInputChange('email', e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl transition-all text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={candidateForm.phone}
                    onChange={handleCandidatePhoneChange}
                    maxLength={15}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl transition-all text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Must be exactly 10 digits</p>
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
                    value={candidateForm.role}
                    onChange={e => handleCandidateInputChange('role', e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl transition-all text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                  >
                    <option value="">Select a role...</option>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Experience Level <span className="text-rose-500">*</span>
                </label>
                <select
                  value={candidateForm.experience}
                  onChange={e => handleCandidateInputChange('experience', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl transition-all text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Select experience...</option>
                  {EXPERIENCE_LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Skills <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 p-3 min-h-[52px] rounded-xl border border-slate-200 bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white">
                  {candidateForm.skills.map((skill, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold">
                      {skill}
                      <button type="button" onClick={() => handleRemoveCandidateSkill(skill)} className="text-blue-500 hover:text-rose-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder={candidateForm.skills.length === 0 ? 'Type a skill and press Enter...' : 'Add more...'}
                    value={candidateSkillInput}
                    onChange={e => setCandidateSkillInput(e.target.value)}
                    onKeyDown={handleCandidateSkillKeyDown}
                    onBlur={handleAddCandidateSkill}
                    className="flex-1 min-w-[140px] bg-transparent outline-none text-sm text-slate-900 placeholder-slate-400"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Press Enter or comma to add skills</p>
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
                  type="text"
                  placeholder="e.g. B.Tech Computer Science, IIT Delhi (2026)"
                  value={candidateForm.education}
                  onChange={e => handleCandidateInputChange('education', e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl transition-all text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Resume Upload */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-extrabold">4</div>
              Resume Upload <span className="text-rose-500">*</span>
            </h2>

            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              onChange={e => handleCandidateFile(e.target.files[0])}
              className="hidden"
            />

            {candidateForm.resumeFileName ? (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{candidateForm.resumeFileName}</p>
                  <p className="text-xs text-blue-600 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resume file active
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { handleCandidateInputChange('resumeFileName', ''); handleCandidateInputChange('resume', null); }}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setIsCandidateDragOver(true); }}
                onDragLeave={() => setIsCandidateDragOver(false)}
                onDrop={e => { e.preventDefault(); setIsCandidateDragOver(false); handleCandidateFile(e.dataTransfer.files[0]); }}
                onClick={() => fileInputRef.current?.click()}
                className={`btn-moving-light rounded-2xl p-10 text-center cursor-pointer transition-all relative ${
                  isCandidateDragOver ? 'bg-blue-50/80 shadow-md' : 'bg-white hover:bg-slate-50/80'
                }`}
              >
                <div className="relative z-[2]">
                  <Upload className={`w-8 h-8 mx-auto mb-3 ${isCandidateDragOver ? 'text-blue-500' : 'text-blue-600'}`} />
                  <p className="text-sm font-bold text-slate-700 mb-1">Upload Resume <span className="text-rose-500">*</span></p>
                  <p className="text-xs text-slate-500">Drag &amp; drop or <span className="text-blue-600 font-semibold">browse files</span></p>
                  <p className="text-[11px] text-slate-400 mt-1">PDF, DOC, DOCX — Max 5MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Form Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!isCandidateProfileEdited}
              className={`px-6 py-3 font-bold text-xs rounded-xl transition-all flex items-center gap-2 ${
                isCandidateProfileEdited
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 active:scale-[0.98] cursor-pointer'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs cursor-default'
              }`}
            >
              {isCandidateProfileEdited ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Candidate Profile</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                  <span>Saved</span>
                </>
              )}
            </button>
          </div>
        </form>

        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in pb-12">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings &amp; Configurations
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Manage your HR recruiter profile, notification preferences, security policies, and data storage.
        </p>
      </div>

      {/* ── SECTION 0: HR RECRUITER PROFILE ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('profile')}
          className="w-full p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                {user?.role === 'SUPER_ADMIN' ? 'Super Admin Profile' : user?.role === 'INTERVIEWER' ? 'Interviewer Profile' : user?.role === 'HR_MANAGER' ? 'HR Manager Profile' : 'User Profile'}
              </h2>
              <p className="text-xs text-slate-500">Update your account name, phone number, and avatar badge</p>
            </div>
          </div>
          <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            {expanded.profile ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {expanded.profile && (
          <form onSubmit={handleSaveProfile} className="px-5 pb-6 pt-2 border-t border-slate-100 space-y-4 animate-fade-in">
            
            {/* Avatar Preview Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-50/40 border border-blue-100 flex items-center gap-4">
              <div className="btn-moving-light rounded-full w-14 h-14 bg-gradient-to-tr from-blue-600 to-blue-400 text-white font-extrabold text-lg flex items-center justify-center shadow-md shrink-0">
                {hrInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {profileForm.name || 'User Profile Name'}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  {profileForm.title} · {profileForm.phone || 'Phone not set'}
                </p>
                <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                  Header avatar badge displays: "{hrInitials}"
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {user?.role === 'SUPER_ADMIN' ? 'Super Admin Name *' : user?.role === 'INTERVIEWER' ? 'Interviewer Name *' : user?.role === 'HR_MANAGER' ? 'HR Manager Name *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Ankita Kumar"
                    value={profileForm.name}
                    onChange={(e) => handleProfileInputChange('name', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number (Ph. No) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="tel"
                    required
                    placeholder="e.g. +91 9876543210"
                    value={profileForm.phone}
                    onChange={handleHrPhoneChange}
                    maxLength={15}
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border rounded-xl text-slate-800 font-medium focus:ring-2 ${
                      hrPhoneError ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 focus:ring-blue-500'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Must be exactly 10 digits</p>
                {hrPhoneError && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block"></span>
                    {hrPhoneError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email"
                    placeholder="hr.manager@mindmatrix.com"
                    value={profileForm.email}
                    onChange={(e) => handleProfileInputChange('email', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Designation / Role Title
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="e.g. Senior Talent Acquisition Manager"
                    value={profileForm.title}
                    onChange={(e) => handleProfileInputChange('title', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!isProfileEdited}
                className={`px-5 py-2.5 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 ${
                  isProfileEdited
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-[0.98] cursor-pointer'
                    : 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs cursor-default'
                }`}
              >
                {isProfileEdited ? (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save HR Profile</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Saved</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── SECTION 1: NOTIFICATIONS ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('notifications')}
          className="w-full p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Notifications</h2>
              <p className="text-xs text-slate-500">Email and in-app alert preferences</p>
            </div>
          </div>
          <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            {expanded.notifications ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {expanded.notifications && (
          <form onSubmit={handleSaveNotifications} className="px-5 pb-6 pt-2 border-t border-slate-100 space-y-4 animate-fade-in">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-900">Email Notifications</p>
                  <p className="text-[11px] text-slate-500">Receive email alerts for candidate updates & interview confirmations</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.emailAlerts}
                  onChange={(e) => {
                    setNotifications({ ...notifications, emailAlerts: e.target.checked });
                    setIsNotificationsEdited(true);
                  }}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-900">New Candidate Applications</p>
                  <p className="text-[11px] text-slate-500">Instant alert when a candidate applies or is submitted</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.newCandidateAlert}
                  onChange={(e) => {
                    setNotifications({ ...notifications, newCandidateAlert: e.target.checked });
                    setIsNotificationsEdited(true);
                  }}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-900">Interview Reminders</p>
                  <p className="text-[11px] text-slate-500">Send reminder 30 minutes before a scheduled technical assessment</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.interviewReminders}
                  onChange={(e) => {
                    setNotifications({ ...notifications, interviewReminders: e.target.checked });
                    setIsNotificationsEdited(true);
                  }}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-900">Weekly Recruitment Digest</p>
                  <p className="text-[11px] text-slate-500">Receive a weekly summary report of pipeline metrics</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.weeklyReport}
                  onChange={(e) => {
                    setNotifications({ ...notifications, weeklyReport: e.target.checked });
                    setIsNotificationsEdited(true);
                  }}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!isNotificationsEdited}
                className={`px-5 py-2.5 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 ${
                  isNotificationsEdited
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-[0.98] cursor-pointer'
                    : 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs cursor-default'
                }`}
              >
                {isNotificationsEdited ? (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Notification Settings</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Saved</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── SECTION 2: SECURITY & ACCESS ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('security')}
          className="w-full p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Security & Access</h2>
              <p className="text-xs text-slate-500">Role-based access, authentication and permissions</p>
            </div>
          </div>
          <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            {expanded.security ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {expanded.security && (
          <form onSubmit={handleSaveSecurity} className="px-5 pb-6 pt-2 border-t border-slate-100 space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Active User Role
                </label>
                <select
                  value={security.role}
                  onChange={(e) => {
                    setSecurity({ ...security, role: e.target.value });
                    setIsSecurityEdited(true);
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                >
                  <option value="Recruiter Admin">Recruiter Admin (Full Access)</option>
                  <option value="Hiring Manager">Hiring Manager (Review & Interview)</option>
                  <option value="Interviewer">Interviewer (View & Feedback Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Session Auto-Timeout
                </label>
                <select
                  value={security.sessionTimeout}
                  onChange={(e) => {
                    setSecurity({ ...security, sessionTimeout: e.target.value });
                    setIsSecurityEdited(true);
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                >
                  <option value="15">15 Minutes of Inactivity</option>
                  <option value="30">30 Minutes of Inactivity</option>
                  <option value="60">1 Hour of Inactivity</option>
                  <option value="never">Never (Persistent Session)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-900">Enforce Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-slate-500">Require authenticator code on recruiter sign-in</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={security.enforce2FA}
                  onChange={(e) => {
                    setSecurity({ ...security, enforce2FA: e.target.checked });
                    setIsSecurityEdited(true);
                  }}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-900">Allow Public Candidate Submissions</p>
                  <p className="text-[11px] text-slate-500">Enable external candidates to submit applications via public careers link</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={security.publicApplications}
                  onChange={(e) => {
                    setSecurity({ ...security, publicApplications: e.target.checked });
                    setIsSecurityEdited(true);
                  }}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!isSecurityEdited}
                className={`px-5 py-2.5 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 ${
                  isSecurityEdited
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-[0.98] cursor-pointer'
                    : 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs cursor-default'
                }`}
              >
                {isSecurityEdited ? (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Security Preferences</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                    <span>Saved</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── SECTION 3: DATA MANAGEMENT ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('data')}
          className="w-full p-5 flex items-center justify-between bg-white hover:bg-slate-50/50 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Data Management</h2>
              <p className="text-xs text-slate-500">Export, backup and data retention controls</p>
            </div>
          </div>
          <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            {expanded.data ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {expanded.data && (
          <div className="px-5 pb-6 pt-2 border-t border-slate-100 space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* CSV Export */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Export Candidate Records</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Download entire candidate database as a CSV spreadsheet for offline analysis.</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export ({candidates.length} Candidates)</span>
                </button>
              </div>

              {/* Data Reset */}
              <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-rose-900">Reset Demo Database</h3>
                  <p className="text-[11px] text-rose-600 mt-0.5">Restore all candidates and pipeline metrics to default mock data state.</p>
                </div>
                <button
                  onClick={handleResetData}
                  className="w-full py-2 px-3 bg-white hover:bg-rose-100 text-rose-600 border border-rose-200 font-semibold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Database to Default</span>
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
