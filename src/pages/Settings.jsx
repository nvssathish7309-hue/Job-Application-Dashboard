import React, { useState, useEffect } from 'react';
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
  Save
} from 'lucide-react';
import { useCandidates } from '../context/CandidateContext';
import Toast from '../components/common/Toast';

export default function SettingsPage() {
  const { candidates, resetToDefaultData, hrProfile, updateHrProfile, hrInitials } = useCandidates();
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

  // HR Profile local form state
  const [profileForm, setProfileForm] = useState({
    name: hrProfile?.name || '',
    phone: hrProfile?.phone || '',
    email: hrProfile?.email || '',
    title: hrProfile?.title || 'Senior HR Manager'
  });

  // Keep profileForm in sync if context changes
  useEffect(() => {
    if (hrProfile) {
      setProfileForm({
        name: hrProfile.name || '',
        phone: hrProfile.phone || '',
        email: hrProfile.email || '',
        title: hrProfile.title || 'Senior HR Manager'
      });
      setIsProfileEdited(false);
    }
  }, [hrProfile]);

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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateHrProfile(profileForm);
    setIsProfileEdited(false); // Matrix blue format "Saved" button
    
    // Compute new initials for toast
    const parts = (profileForm.name || '').trim().split(/\s+/);
    const newInitials = parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();

    setToast({ 
      type: 'success', 
      message: `HR Profile saved! Header avatar initials set to "${newInitials}".` 
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

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all candidate data back to default demo records?')) {
      resetToDefaultData();
      setToast({ type: 'info', message: 'Candidate database reset to default demo records.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in pb-12">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings & Configurations
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
              <h2 className="font-bold text-slate-900 text-base">HR Recruiter Profile</h2>
              <p className="text-xs text-slate-500">Update your HR name, phone number, and avatar badge</p>
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
                  {profileForm.name || 'HR Recruiter Name'}
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
                  HR Recruiter Name *
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
                    type="text"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={profileForm.phone}
                    onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
