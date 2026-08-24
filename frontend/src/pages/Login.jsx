import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, UserPlus, LogIn, CheckCircle2, ShieldCheck, Zap, Users, Shield, X, Check } from 'lucide-react';
import MindMatrixLogo, { MindMatrixIcon } from '../components/MindMatrixLogo';
import { useAuth } from '../context/AuthContext';


export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, socialLogin, logout } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [activePortalTab, setActivePortalTab] = useState('recruiter'); // 'recruiter' | 'candidate'
  const [switchKey, setSwitchKey] = useState(0);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // SSO Modal State
  const [ssoModalProvider, setSsoModalProvider] = useState(null); // null | 'google' | 'linkedin'
  const [customSsoEmail, setCustomSsoEmail] = useState('');
  const [selectedSsoOption, setSelectedSsoOption] = useState('default'); // 'default' | 'user' | 'custom'

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isExistingAccount, setIsExistingAccount] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handlePortalSwitch = (portal) => {
    setActivePortalTab(portal);
    setSwitchKey(prev => prev + 1);
    setErrorMessage('');
    setSuccessMessage('');
    setIsExistingAccount(false);
    if (portal === 'recruiter') {
      setMode('login'); // Registration is disabled for Team Access
    } else if (portal === 'candidate') {
      setEmail('');
      setPassword('');
    }
  };


  const handleModeSwitch = (targetMode) => {
    if (mode !== targetMode) {
      setMode(targetMode);
      setSwitchKey(prev => prev + 1);
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setPhone('');
      setShowPassword(false);
      setErrorMessage('');
      setSuccessMessage('');
      setIsExistingAccount(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsExistingAccount(false);

    if (mode === 'login') {
      if (!email || !password) {
        setErrorMessage('Please enter both email address and password.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await login(email, password);
        if (res?.success) {
          const userObj = res?.data?.user || res?.user;
          const userRole = userObj?.role;

          // Strict Role Isolation between Team Access and Candidate Portal
          if (activePortalTab === 'recruiter') {
            if (userRole === 'CANDIDATE') {
              if (typeof logout === 'function') logout();
              setErrorMessage('This account is a Candidate profile. Please switch to Candidate Sign-In to log in.');
              setIsLoading(false);
              return;
            }
          } else if (activePortalTab === 'candidate') {
            if (userRole && userRole !== 'CANDIDATE') {
              if (typeof logout === 'function') logout();
              setErrorMessage('This is a Team account. Please switch to Recruiter Portal / Team Access to log in.');
              setIsLoading(false);
              return;
            }
          }

          navigate(from, { replace: true });
        } else {
          setErrorMessage(res?.message || 'Invalid email address or password. Access denied.');
        }
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Invalid email address or password. Access denied.');
      } finally {
        setIsLoading(false);
      }

    } else {
      // Candidate Registration
      if (!firstName || !lastName || !phone || !email || !password) {
        setErrorMessage('Please complete all required fields.');
        return;
      }
      if (phone.length < 10) {
        setErrorMessage('Please enter a valid 10-digit phone number.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await register({ firstName, lastName, email, password, phone });
        if (res?.success) {
          setSuccessMessage('Account created successfully! Redirecting to candidate portal...');
          setTimeout(() => navigate('/dashboard', { replace: true }), 800);
        } else {
          setErrorMessage(res?.message || 'Registration failed.');
        }
      } catch (err) {
        const serverMsg = err.response?.data?.message || err.message || '';
        if (serverMsg.includes('already exists') || err.response?.status === 400 || err.response?.status === 409) {
          setIsExistingAccount(true);
          setErrorMessage(`An account with email "${email}" already exists. Please switch to Sign In to log in.`);
        } else {
          setErrorMessage(serverMsg || 'Registration failed.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDemoLogin = (demoEmail) => {
    setMode('login');
    setActivePortalTab('recruiter');
    setEmail(demoEmail);
    setPassword('');
    setShowPassword(false);
    setErrorMessage('');
    setIsExistingAccount(false);
  };

  const handleOpenSsoModal = (provider) => {
    setSsoModalProvider(provider);
    setSelectedSsoOption('default');
    setCustomSsoEmail('');
  };

  const handleExecuteSsoLogin = (targetEmail, targetName) => {
    let finalEmail = targetEmail;
    let finalName = targetName;

    if (selectedSsoOption === 'custom') {
      if (!customSsoEmail || !customSsoEmail.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }
      finalEmail = customSsoEmail;
      finalName = customSsoEmail.split('@')[0];
    }

    setIsLoading(true);
    const nameParts = (finalName || 'User').split(' ');

    setTimeout(() => {
      socialLogin({
        email: finalEmail,
        firstName: nameParts[0] || 'Social',
        lastName: nameParts.slice(1).join(' ') || 'User',
        role: activePortalTab === 'recruiter' ? 'RECRUITER' : 'CANDIDATE',
        provider: ssoModalProvider,
        avatar: ssoModalProvider === 'google'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120'
      });
      setIsLoading(false);
      setSsoModalProvider(null);
      navigate(from, { replace: true });
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">

      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Split-Screen SaaS Container Frame */}
      <div className="w-full max-w-6xl min-h-[640px] bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 backdrop-blur-xl">

        {/* ── LEFT HERO PANEL (DARK SLATE) ── */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-8 lg:p-12 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-slate-800/80 overflow-hidden">

          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <MindMatrixLogo layout="horizontal" showTagline={false} />
          </div>

          {/* Center Graphic Node Illustration with Revolving 3D Orbit Cards */}
          <div className="my-10 lg:my-6 relative flex items-center justify-center min-h-[280px]">
            {/* Pulsing Outer Network Rings */}
            <div className="w-56 h-56 rounded-full border border-purple-500/20 animate-pulse absolute" />
            <div className="w-72 h-72 rounded-full border border-blue-500/10 absolute" />

            {/* Central MindMatrix Logo Node with Multi-Color Neon Glowing Light Border */}
            <div className="relative z-10 w-24 h-24 rounded-full p-1 flex items-center justify-center animate-bounce-slow shadow-[0_0_35px_rgba(168,85,247,0.8),0_0_70px_rgba(59,130,246,0.5)]">
              {/* Glowing Rotating Multi-Color Gradient Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-sky-400 via-pink-500 to-indigo-500 animate-spin-slow opacity-90 blur-[2px]" />
              <div className="absolute inset-[2px] rounded-full bg-white" />

              {/* Inner Core Shield with MindMatrix Logo */}
              <div className="relative z-10 w-full h-full rounded-full bg-white border border-purple-300/80 flex items-center justify-center p-2.5 shadow-md overflow-hidden group">
                <MindMatrixIcon className="w-10 h-7 transition-transform duration-500 group-hover:scale-110" />
              </div>
            </div>

            {/* 360-Degree Smooth Revolving Orbital Ring Container */}
            <div className="absolute w-[260px] sm:w-[280px] h-[260px] sm:h-[280px] rounded-full border border-purple-500/15 animate-orbit pointer-events-none flex items-center justify-center">
              
              {/* Card 1: Top Position (0deg) */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 pointer-events-auto">
                <div className="animate-orbit-counter">
                  <div className="bg-slate-800/90 border border-purple-500/40 p-2.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2.5 whitespace-nowrap hover:scale-105 transition-transform">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Smart Match</p>
                      <p className="text-xs font-extrabold text-white">98% Fit Score</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Bottom-Right Position (120deg) */}
              <div className="absolute bottom-2 right-[-20px] sm:right-[-28px] pointer-events-auto">
                <div className="animate-orbit-counter">
                  <div className="bg-slate-800/90 border border-blue-500/40 p-2.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2.5 whitespace-nowrap hover:scale-105 transition-transform">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Candidate</p>
                      <p className="text-xs font-extrabold text-white">Shortlisted</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Bottom-Left Position (240deg) */}
              <div className="absolute bottom-2 left-[-20px] sm:left-[-28px] pointer-events-auto">
                <div className="animate-orbit-counter">
                  <div className="bg-slate-800/90 border border-emerald-500/40 p-2.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2.5 whitespace-nowrap hover:scale-105 transition-transform">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Security</p>
                      <p className="text-xs font-extrabold text-white">Verified Profile</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>


          {/* Bottom Headline & Checklist */}
          <div className="relative z-10 text-left space-y-4">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
              MindMatrix: Elevate Your Career. <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Hire Smarter.</span>
            </h1>
            <p className="text-slate-400 text-xs lg:text-sm font-medium">
              Recruiter Hub &amp; Candidate Portal. The unified platform for modern talent acquisition.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Smart Matching
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                Seamless Communication
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                Secure Portal
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT FORM PANEL (SLATE & FROSTED GLASS) ── */}
        <div className="lg:col-span-6 bg-slate-950/60 p-6 sm:p-10 lg:p-12 flex flex-col justify-center relative">

          <div className="w-full max-w-md mx-auto space-y-6">

            {/* Portal Tab Switcher (Recruiter Portal / Candidate Sign-In) */}
            <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl flex items-center shadow-inner relative">
              <button
                type="button"
                onClick={() => handlePortalSwitch('recruiter')}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer relative z-10 flex items-center justify-center gap-2 ${activePortalTab === 'recruiter'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Recruiter Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handlePortalSwitch('candidate')}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer relative z-10 flex items-center justify-center gap-2 ${activePortalTab === 'candidate'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Candidate Sign-In</span>
              </button>
            </div>

            {/* Form Card Container */}
            <div key={switchKey} className="bg-slate-900/80 border border-slate-800/90 p-5 sm:p-7 rounded-3xl shadow-xl backdrop-blur-xl relative">

              {/* Form Title & Secondary Mode Toggle */}
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white">
                    {mode === 'register' ? 'Candidate Registration' : activePortalTab === 'recruiter' ? 'Team Access' : 'Candidate Portal'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {mode === 'register' ? 'Create your applicant profile' : 'Sign in to access your dashboard'}
                  </p>
                </div>

                {activePortalTab === 'candidate' && (
                  <div className="flex bg-slate-800/60 p-1 rounded-xl border border-slate-700/50 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('login')}
                      className={`px-2.5 py-1 font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('register')}
                      className={`px-2.5 py-1 font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      Sign Up
                    </button>
                  </div>
                )}

              </div>

              {/* Status Notifications */}
              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold animate-shake">
                  <div>{errorMessage}</div>
                  {isExistingAccount && (
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('login')}
                      className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 transition-all"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>Switch to Sign In →</span>
                    </button>
                  )}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  {successMessage}
                </div>
              )}

              {/* Main Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Candidate Registration Extra Fields */}
                {mode === 'register' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">First Name *</label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Jane"
                          className="w-full bg-[#EEF5FF] border border-blue-200/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 px-3.5 py-3 rounded-2xl text-slate-900 font-semibold text-xs placeholder-slate-400 outline-none transition-all shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className="w-full bg-[#EEF5FF] border border-blue-200/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 px-3.5 py-3 rounded-2xl text-slate-900 font-semibold text-xs placeholder-slate-400 outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">Phone Number *</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-slate-500 text-xs font-bold pointer-events-none z-10">+91</span>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="9876543210"
                          maxLength={10}
                          className="w-full bg-[#EEF5FF] border border-blue-200/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 pl-12 pr-3.5 py-3 rounded-2xl text-slate-900 font-semibold text-xs placeholder-slate-400 outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Email Field */}
                <div className="w-full">
                  <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <div className="relative w-full flex items-center">
                    <Mail className="w-4 h-4 absolute left-4 text-slate-500 pointer-events-none z-10" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={activePortalTab === 'recruiter' ? 'teamaccess@mindmatrix.com' : 'candidate@example.com'}
                      className="login-input-bar w-full h-12 bg-[#EEF5FF] border border-blue-200/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 pl-11 pr-14 py-3 rounded-2xl text-slate-900 font-semibold text-xs placeholder-slate-400 outline-none transition-all shadow-sm box-border appearance-none"
                    />

                  </div>
                </div>

                {/* Password Field */}
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">Password *</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => alert('Passwords for HR Manager, Recruiter, and Interviewer accounts are assigned by Super Admin. Please contact your Super Admin to obtain or reset your credentials.')}
                        className="text-[11px] text-purple-400 hover:text-purple-300 font-bold transition-colors pr-2"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative w-full flex items-center">
                    <Lock className="w-4 h-4 absolute left-4 text-slate-500 pointer-events-none z-10" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="login-input-bar w-full h-12 bg-[#EEF5FF] border border-blue-200/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 pl-11 pr-14 py-3 rounded-2xl text-slate-900 font-semibold text-xs placeholder-slate-400 outline-none transition-all shadow-sm box-border appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer z-10 flex items-center justify-center p-1 rounded-full hover:bg-blue-100/50"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>





                {/* Primary Submit CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'register' ? 'Register Account' : 'Sign In'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

            </div>


            {/* Quick-Select Team Access Tray (Bottom Card) */}
            {mode === 'login' && activePortalTab === 'recruiter' && (
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-between mb-3 text-[11px]">
                  <span className="font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                    Team Access:
                  </span>
                  <span className="text-[10px] text-slate-500 italic">Click to select email</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin@mindmatrix.com')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${email === 'admin@mindmatrix.com'
                      ? 'bg-purple-950/60 border-purple-500 ring-1 ring-purple-500'
                      : 'bg-slate-950/60 border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/50'
                      }`}
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold text-purple-300 uppercase leading-none">Super Admin</p>
                      <p className="text-[10.5px] font-medium text-slate-300 truncate mt-1">admin@mindmatrix.com</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('hr@mindmatrix.com')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${email === 'hr@mindmatrix.com'
                      ? 'bg-blue-950/60 border-blue-500 ring-1 ring-blue-500'
                      : 'bg-slate-950/60 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50'
                      }`}
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold text-blue-300 uppercase leading-none">HR Manager</p>
                      <p className="text-[10.5px] font-medium text-slate-300 truncate mt-1">hr@mindmatrix.com</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('recruiter@mindmatrix.com')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${email === 'recruiter@mindmatrix.com'
                      ? 'bg-emerald-950/60 border-emerald-500 ring-1 ring-emerald-500'
                      : 'bg-slate-950/60 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50'
                      }`}
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold text-emerald-300 uppercase leading-none">Recruiter</p>
                      <p className="text-[10.5px] font-medium text-slate-300 truncate mt-1">recruiter@mindmatrix.com</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('interviewer@mindmatrix.com')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${email === 'interviewer@mindmatrix.com'
                      ? 'bg-amber-950/60 border-amber-500 ring-1 ring-amber-500'
                      : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50'
                      }`}
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold text-amber-300 uppercase leading-none">Interviewer</p>
                      <p className="text-[10.5px] font-medium text-slate-300 truncate mt-1">interviewer@mindmatrix.com</p>
                    </div>
                  </button>
                </div>
              </div>
            )}


          </div>
        </div>

      </div>

      {/* ── INTERACTIVE GOOGLE / LINKEDIN OAUTH POPUP MODAL ── */}
      {ssoModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 relative">

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSsoModalProvider(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Provider Header Logo & Title */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center mx-auto mb-3 shadow-lg">
                {ssoModalProvider === 'google' ? (
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                )}
              </div>

              <h3 className="text-lg font-extrabold text-white">
                Sign in with {ssoModalProvider === 'google' ? 'Google' : 'LinkedIn'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Choose an account to continue to <span className="text-purple-400 font-bold">MindMatrix Portal</span>
              </p>
            </div>

            {/* Select Account List */}
            <div className="space-y-3 mb-6">

              {/* Option 1: Primary Demo Account */}
              <button
                type="button"
                onClick={() => handleExecuteSsoLogin(
                  ssoModalProvider === 'google' ? 'alex.rivera.google@gmail.com' : 'sarah.jenkins.linkedin@linkedin.com',
                  ssoModalProvider === 'google' ? 'Alex Rivera' : 'Sarah Jenkins'
                )}
                className="w-full p-3 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl flex items-center justify-between transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={ssoModalProvider === 'google'
                      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
                      : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120'}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border border-purple-400/40"
                  />
                  <div>
                    <p className="text-xs font-extrabold text-white group-hover:text-purple-300 transition-colors">
                      {ssoModalProvider === 'google' ? 'Alex Rivera' : 'Sarah Jenkins'}
                    </p>
                    <p className="text-[11px] font-medium text-slate-400">
                      {ssoModalProvider === 'google' ? 'alex.rivera.google@gmail.com' : 'sarah.jenkins.linkedin@linkedin.com'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-purple-400 group-hover:translate-x-0.5 transition-transform">Connect →</span>
              </button>

              {/* Option 2: Sathish Account */}
              <button
                type="button"
                onClick={() => handleExecuteSsoLogin(
                  ssoModalProvider === 'google' ? 'sathish.mindmatrix@gmail.com' : 'sathish.mindmatrix@linkedin.com',
                  'Sathish N'
                )}
                className="w-full p-3 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl flex items-center justify-between transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
                    alt="Sathish"
                    className="w-10 h-10 rounded-full object-cover border border-blue-400/40"
                  />
                  <div>
                    <p className="text-xs font-extrabold text-white group-hover:text-purple-300 transition-colors">Sathish N</p>
                    <p className="text-[11px] font-medium text-slate-400">
                      {ssoModalProvider === 'google' ? 'sathish.mindmatrix@gmail.com' : 'sathish.mindmatrix@linkedin.com'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-purple-400 group-hover:translate-x-0.5 transition-transform">Connect →</span>
              </button>

              {/* Option 3: Custom Email Input */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Or enter another email:</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={customSsoEmail}
                    onChange={(e) => {
                      setCustomSsoEmail(e.target.value);
                      setSelectedSsoOption('custom');
                    }}
                    placeholder="user@example.com"
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-purple-500 px-3 py-2 rounded-xl text-white text-xs placeholder-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleExecuteSsoLogin(customSsoEmail, customSsoEmail.split('@')[0])}
                    disabled={!customSsoEmail || !customSsoEmail.includes('@')}
                    className="py-2 px-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <p className="text-[10.5px] text-center text-slate-500">
              By continuing, MindMatrix receives basic profile permissions (name, email, avatar).
            </p>
          </div>
        </div>
      )}

    </div>
  );
}


