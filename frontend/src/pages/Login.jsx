import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import MindMatrixLogo from '../components/MindMatrixLogo';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [mode, setMode] = useState('login'); // Default: 'login' (Sign In page)
  const [switchKey, setSwitchKey] = useState(0);
  
  // Login & Registration state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isExistingAccount, setIsExistingAccount] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleTabSwitch = (targetMode) => {
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
        setErrorMessage('Please fill in both email and password.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await login(email, password);
        if (res?.success) {
          navigate(from, { replace: true });
        } else {
          setErrorMessage(
            email.toLowerCase() === 'admin@mindmatrix.com'
              ? `Invalid credentials for Super Admin account.`
              : `Invalid email or password. Please check your credentials.`
          );
        }
      } catch (err) {
        setErrorMessage(err.response?.data?.message || err.message || 'Failed to communicate with authentication server.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Registration Mode
      if (!firstName || !lastName || !phone || !email || !password) {
        setErrorMessage('Please complete all required fields (First name, Last name, Phone number, Email, Password).');
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
          setErrorMessage(serverMsg || 'Registration failed. Please check details.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDemoLogin = (demoEmail) => {
    setMode('login');
    setEmail(demoEmail);
    setPassword('');
    setShowPassword(false);
    setErrorMessage('');
    setIsExistingAccount(false);
  };

  const handleSwitchToSignIn = () => {
    setMode('login');
    setSwitchKey(prev => prev + 1);
    setPassword('');
    setShowPassword(false);
    setErrorMessage('');
    setIsExistingAccount(false);
  };

  return (
    <div className="login-bg min-h-screen flex flex-col justify-center py-10 sm:px-6 lg:px-8 overflow-hidden relative">

      {/* ── Animated Background Orbs ── */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
      <div className="orb orb-5" />

      {/* ── Floating Particles ── */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`} />
        ))}
      </div>

      {/* ── Grid Overlay ── */}
      <div className="grid-overlay" />

      {/* ── Bottom Half-Circle Glow Dome ── */}
      <div className="bottom-dome-glow-container">
        <div className="bottom-dome-glow" />
        <div className="bottom-dome-glow-core" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10">
        {/* Brand Title Header — Standard Static Logo */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
          <div className="flex justify-center mb-2">
            <MindMatrixLogo layout="vertical" showTagline={false} />
          </div>
          <p className="text-xs font-black tracking-widest uppercase mt-1.5 bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(147,197,253,0.6)]">
            RECRUITER HUB &amp; CANDIDATE PORTAL
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="login-card py-8 px-6 sm:rounded-3xl sm:px-10 relative">

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-white/10 border border-white/20 p-1 mb-6 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => handleTabSwitch('login')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  mode === 'login' ? 'bg-white/90 text-blue-700 shadow-md shadow-blue-500/20' : 'text-white/70 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch('register')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  mode === 'register' ? 'bg-white/90 text-blue-700 shadow-md shadow-blue-500/20' : 'text-white/70 hover:text-white'
                }`}
              >
                Candidate Sign Up
              </button>
            </div>

            {/* Animated Form Container */}
            <div key={switchKey} className="animate-mode-switch">

            {errorMessage && (
              <div className="mb-5 p-4 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-semibold animate-shake backdrop-blur-sm">
                <div>{errorMessage}</div>
                {isExistingAccount && (
                  <button
                    type="button"
                    onClick={handleSwitchToSignIn}
                    className="mt-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Switch to Sign In for {email} →</span>
                  </button>
                )}
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
                {successMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {/* Registration Fields */}
              {mode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                        First Name *
                      </label>
                      <div className="login-input-wrap relative rounded-xl flex items-center">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/70 pointer-events-none z-10" />
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Jane"
                          className="login-input w-full pl-9 pr-3 py-2 rounded-xl text-white font-medium text-xs placeholder-white/30 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                        Last Name *
                      </label>
                      <div className="login-input-wrap relative rounded-xl flex items-center">
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className="login-input w-full px-3 py-2 rounded-xl text-white font-medium text-xs placeholder-white/30 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <div className="login-input-wrap relative rounded-xl flex items-center">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/70 pointer-events-none z-10" />
                      <span className="absolute left-9 top-1/2 -translate-y-1/2 text-blue-300/80 text-xs font-bold pointer-events-none z-10 select-none">+91</span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPhone(digits);
                        }}
                        placeholder="9876543210"
                        maxLength={10}
                        minLength={10}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit phone number"
                        className="login-input w-full pl-16 pr-3 py-2 rounded-xl text-white font-medium text-xs placeholder-white/30 transition-all"
                      />
                    </div>
                  </div>

                </>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                  Email *
                </label>
                <div className="login-input-wrap relative rounded-xl flex items-center">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/70 pointer-events-none z-10" />
                  <input
                    id="email"
                    name="username"
                    type="email"
                    autoComplete="username email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onInput={(e) => setEmail(e.target.value)}
                    placeholder="candidate@mindmatrix.com"
                    className="login-input w-full pl-10 pr-4 py-2.5 rounded-xl text-white font-medium text-xs placeholder-white/30 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-blue-200 uppercase tracking-wider">
                    Password *
                  </label>
                  {mode === 'login' && (
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Passwords for HR Manager, Recruiter, and Interviewer accounts are assigned by Super Admin and HR Manager only. Please contact your Super Admin or HR Manager to obtain or reset your password.'); }} className="text-xs font-bold text-blue-300 hover:text-sky-200 transition-colors">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="login-input-wrap relative rounded-xl flex items-center">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/70 pointer-events-none z-10" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="off"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onInput={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="login-input w-full pl-10 pr-10 py-2.5 rounded-xl text-white font-medium text-xs placeholder-white/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="no-glow absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300/70 hover:text-white focus:outline-none cursor-pointer z-10 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="login-input-wrap relative rounded-xl mt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-submit-btn w-full py-3 px-4 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{mode === 'register' ? 'Creating Account...' : 'Signing in...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'register' ? 'Register as Candidate' : 'Sign In'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Admin & Team Quick Login Email Selectors */}
            {mode === 'login' && (
              <div className="mt-6 pt-6 border-t border-white/15">
                <div className="text-[11px] font-bold text-blue-300/70 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Admin &amp; Team Quick Select:</span>
                  <span className="text-[9.5px] font-medium text-sky-300/60 lowercase italic tracking-normal">(Password typed manually)</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin@mindmatrix.com')}
                    className={`demo-btn btn-moving-light px-2.5 py-2 rounded-xl font-bold text-left transition-all cursor-pointer overflow-hidden ${
                      email === 'admin@mindmatrix.com' ? 'scale-[1.02] ring-2 ring-purple-400' : ''
                    }`}
                    style={{'--demo-color': '#a855f7'}}
                  >
                    <span className="block text-[10px] font-extrabold uppercase mb-0.5" style={{color: '#c084fc'}}>Super Admin</span>
                    <span className="block text-[10.5px] font-medium text-white/80 truncate tracking-tight">admin@mindmatrix.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('hr@mindmatrix.com')}
                    className={`demo-btn btn-moving-light px-2.5 py-2 rounded-xl font-bold text-left transition-all cursor-pointer overflow-hidden ${
                      email === 'hr@mindmatrix.com' ? 'scale-[1.02] ring-2 ring-blue-400' : ''
                    }`}
                    style={{'--demo-color': '#3b82f6'}}
                  >
                    <span className="block text-[10px] font-extrabold uppercase mb-0.5" style={{color: '#93c5fd'}}>HR Manager</span>
                    <span className="block text-[10.5px] font-medium text-white/80 truncate tracking-tight">hr@mindmatrix.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('recruiter@mindmatrix.com')}
                    className={`demo-btn btn-moving-light px-2.5 py-2 rounded-xl font-bold text-left transition-all cursor-pointer overflow-hidden ${
                      email === 'recruiter@mindmatrix.com' ? 'scale-[1.02] ring-2 ring-emerald-400' : ''
                    }`}
                    style={{'--demo-color': '#10b981'}}
                  >
                    <span className="block text-[10px] font-extrabold uppercase mb-0.5" style={{color: '#6ee7b7'}}>Recruiter</span>
                    <span className="block text-[10.5px] font-medium text-white/80 truncate tracking-tight">recruiter@mindmatrix.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('interviewer@mindmatrix.com')}
                    className={`demo-btn btn-moving-light px-2.5 py-2 rounded-xl font-bold text-left transition-all cursor-pointer overflow-hidden ${
                      email === 'interviewer@mindmatrix.com' ? 'scale-[1.02] ring-2 ring-amber-400' : ''
                    }`}
                    style={{'--demo-color': '#f59e0b'}}
                  >
                    <span className="block text-[10px] font-extrabold uppercase mb-0.5" style={{color: '#fcd34d'}}>Interviewer</span>
                    <span className="block text-[10.5px] font-medium text-white/80 truncate tracking-tight">interviewer@mindmatrix.com</span>
                  </button>
                </div>
              </div>
            )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
