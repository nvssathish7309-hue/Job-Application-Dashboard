import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, UserPlus } from 'lucide-react';
import MindMatrixLogo from '../components/MindMatrixLogo';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
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
  const [successMessage, setSuccessMessage] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'login') {
      if (!email || !password) {
        setErrorMessage('Please fill in both email and password.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await login(email, password);
        if (res.success) {
          navigate(from, { replace: true });
        } else {
          setErrorMessage(res.message || 'Invalid credentials');
        }
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Failed to communicate with authentication server.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Registration Mode
      if (!firstName || !lastName || !email || !password) {
        setErrorMessage('Please complete all required fields (First name, Last name, Email, Password).');
        return;
      }

      setIsLoading(true);
      try {
        const res = await register({ firstName, lastName, email, password, phone });
        if (res.success) {
          setSuccessMessage('Account created successfully! Redirecting...');
          setTimeout(() => navigate('/dashboard', { replace: true }), 800);
        } else {
          setErrorMessage(res.message || 'Registration failed.');
        }
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Registration failed. Please check details.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setMode('login');
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      
      {/* Brand Title Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="flex justify-center mb-2">
          <MindMatrixLogo layout="vertical" showTagline={false} />
        </div>
        <p className="text-xs font-black tracking-widest uppercase mt-1.5 bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
          RECRUITER HUB & CANDIDATE PORTAL
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="btn-moving-light bg-white py-8 px-6 shadow-[0_0_35px_rgba(59,130,246,0.25)] border border-blue-200/80 sm:rounded-3xl sm:px-10 relative z-10">
          
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                mode === 'login' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                mode === 'register' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Candidate Sign Up
            </button>
          </div>

          {errorMessage && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-shake">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              {successMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Registration Fields */}
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      First Name *
                    </label>
                    <div className="relative rounded-xl flex items-center">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative rounded-xl flex items-center">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                {mode === 'register' ? 'Email Address *' : 'Work Email Address'}
              </label>
              <div className="relative rounded-xl flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Password *
                </label>
                {mode === 'login' && (
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('For demo, use Password123!'); }} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative rounded-xl flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="no-glow absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer z-10"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
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
          </form>

          {/* Quick Demo Accounts */}
          {mode === 'login' && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                <span>One-Click Demo Accounts:</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin@company.com', 'Password123!')}
                  className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-purple-900 font-bold text-left transition-colors"
                >
                  <span className="block text-[10px] text-purple-600 font-extrabold uppercase">Super Admin</span>
                  admin@company.com
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('hr@company.com', 'Password123!')}
                  className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-900 font-bold text-left transition-colors"
                >
                  <span className="block text-[10px] text-blue-600 font-extrabold uppercase">HR Manager</span>
                  hr@company.com
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('recruiter@company.com', 'Password123!')}
                  className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-900 font-bold text-left transition-colors"
                >
                  <span className="block text-[10px] text-emerald-600 font-extrabold uppercase">Recruiter</span>
                  recruiter@company.com
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('interviewer@company.com', 'Password123!')}
                  className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-900 font-bold text-left transition-colors"
                >
                  <span className="block text-[10px] text-amber-600 font-extrabold uppercase">Interviewer</span>
                  interviewer@company.com
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('candidate@company.com', 'Password123!')}
                  className="col-span-2 p-2.5 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-sky-900 font-bold text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="block text-[10px] text-sky-600 font-extrabold uppercase">Applicant / Candidate</span>
                    candidate@company.com
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-sky-200 text-sky-800 font-bold rounded-lg">Apply & Track</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
