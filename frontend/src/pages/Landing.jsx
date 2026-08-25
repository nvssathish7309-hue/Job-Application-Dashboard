import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Briefcase,
  BarChart3,
  CheckCircle2,
  BrainCircuit,
  Lock,
  Globe,
  Clock,
  Award,
  ChevronRight,
  Star,
  Layers,
  Search,
  FileSpreadsheet,
  TrendingUp,
  UserCheck,
  Play,
  Check
} from 'lucide-react';
import MindMatrixLogo, { MindMatrixIcon } from '../components/MindMatrixLogo';

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recruiter');

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-x-hidden">

      {/* Background Ambient Glow Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -left-32 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* ── 1. GLASSMORPHIC TOP NAVIGATION BAR ── */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <MindMatrixLogo layout="horizontal" showTagline={false} />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/10 border border-purple-500/30 text-purple-300 uppercase tracking-widest">
              AI Enterprise
            </span>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
            <a href="#portals" className="hover:text-cyan-400 transition-colors">Portals</a>
            <a href="#workflow" className="hover:text-blue-400 transition-colors">Workflow</a>
            <a href="#metrics" className="hover:text-emerald-400 transition-colors">Analytics</a>
            <Link to="/careers" className="hover:text-pink-400 transition-colors flex items-center gap-1.5 text-slate-200">
              <Briefcase className="w-3.5 h-3.5 text-purple-400" />
              <span>Public Careers</span>
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              to="/careers"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 transition-all"
            >
              Browse Jobs
            </Link>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/35 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>


      {/* ── 2. HERO SECTION ── */}
      <section className="relative z-10 pt-16 lg:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">

        {/* Top Floating Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-lg shadow-purple-500/10 mb-8 animate-bounce-slow">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Next-Generation Talent Acquisition Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Hire Top 1% Talent Faster with{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            AI Precision &amp; Automation
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-slate-400 text-base sm:text-lg lg:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
          MindMatrix connects recruiters and high-caliber candidates in one unified platform. Automated candidate matching, structured interview pipelines, and real-time hiring analytics.
        </p>

        {/* Hero Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-7 py-4 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center gap-3 cursor-pointer group active:scale-95"
          >
            <span>Access Recruiter Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <Link
            to="/careers"
            className="px-7 py-4 rounded-2xl text-sm font-extrabold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 backdrop-blur-md shadow-lg transition-all flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>Browse Candidates &amp; Openings</span>
          </Link>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-10 pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Zero Setup Required
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            Role Isolation &amp; Audit Security
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            Real-Time Analytics &amp; Reports
          </span>
        </div>


        {/* ── HERO APP INTERACTIVE SHOWCASE CARD ── */}
        <div className="mt-14 relative max-w-5xl mx-auto rounded-3xl border border-slate-800/80 bg-slate-900/60 p-3 sm:p-4 backdrop-blur-2xl shadow-2xl overflow-hidden group">
          {/* Card Border Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-cyan-500/30 to-teal-500/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none" />

          <div className="relative z-10 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
            {/* Fake Mac Window Bar */}
            <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>mindmatrix.app/dashboard/pipeline</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-slate-400">Live</span>
              </div>
            </div>

            {/* Dashboard Mock UI Content */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">

              {/* Left Mock Kanban Pipeline */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-white">Active Recruitment Funnel</h3>
                    <p className="text-xs text-slate-400">Senior Full-Stack Engineer • 24 Applicants</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                    ⚡ AI Match Active
                  </span>
                </div>

                {/* Pipeline Columns Preview */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {/* Column 1 */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                      <span>Screening</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">8</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-white shadow-sm flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">Alex Rivera</span>
                        <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded">98% Fit</span>
                      </div>
                      <span className="text-[10px] text-slate-400">React, Node.js, AWS</span>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                      <span>Interviewing</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">5</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-purple-500/40 text-xs font-semibold text-white shadow-md shadow-purple-500/10 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">Sarah Jenkins</span>
                        <span className="text-[10px] text-purple-300 font-extrabold bg-purple-500/20 px-1.5 py-0.5 rounded">Scheduled</span>
                      </div>
                      <span className="text-[10px] text-slate-400">System Architecture • Today 4PM</span>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                      <span>Offered</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">2</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/40 text-xs font-semibold text-white shadow-md shadow-emerald-500/10 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">Michael Chen</span>
                        <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/20 px-1.5 py-0.5 rounded">Accepted</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Lead Architect • \$160k/yr</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Analytics Summary Widget */}
              <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Talent Metrics</h4>
                  <div className="mt-3 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                        <span>Time-to-Hire Rate</span>
                        <span className="text-cyan-400">12 Days (⚡ 60% Faster)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full w-[82%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                        <span>Candidate Satisfaction</span>
                        <span className="text-emerald-400">4.9 / 5.0 Rating</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[96%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">Security Verified</span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    SOC2 Compliant
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>


      {/* ── 3. CLIENT MARQUEE / TRUSTED BRANDS ── */}
      <section className="border-y border-slate-800/80 bg-slate-950/40 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
            Empowering Modern HR &amp; Talent Leaders Worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
            <span className="text-lg font-black text-slate-300 tracking-wider">TECHCORP</span>
            <span className="text-lg font-black text-slate-300 tracking-wider">NEXUS.AI</span>
            <span className="text-lg font-black text-slate-300 tracking-wider">INNOVATEX</span>
            <span className="text-lg font-black text-slate-300 tracking-wider">QUANTUM</span>
            <span className="text-lg font-black text-slate-300 tracking-wider">CLOUDPULSE</span>
          </div>
        </div>
      </section>


      {/* ── 4. BENTO GRID FEATURES SECTION ── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-purple-400">
            Enterprise Architecture
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need to Hire Better &amp; Faster
          </h3>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            Designed for Super Admins, HR Managers, Recruiters, Interviewers, and Applicants.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Feature 1: AI Smart Matching */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/50 backdrop-blur-xl transition-all group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white mb-2">AI Smart Candidate Matching</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatically evaluate candidate skillsets against job requirements with precise match scores and key skill indicators.
            </p>
          </div>

          {/* Feature 2: Structured Interviewing */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 backdrop-blur-xl transition-all group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white mb-2">Structured Interview Workflows</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Schedule technical and HR interview rounds, record interviewer feedback scores, and advance candidates seamlessly.
            </p>
          </div>

          {/* Feature 3: Strict Role Isolation */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 backdrop-blur-xl transition-all group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white mb-2">Strict Role Security Isolation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Granular access control across Super Admin, HR Manager, Recruiter, Interviewer, and Candidate profile security.
            </p>
          </div>

          {/* Feature 4: Live Reports & Analytics */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 backdrop-blur-xl transition-all group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white mb-2">Real-Time Talent Analytics</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Comprehensive conversion rate metrics, source performance, hiring velocity, and exportable PDF/Excel reports.
            </p>
          </div>

          {/* Feature 5: Public Applicant Portal */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-pink-500/50 backdrop-blur-xl transition-all group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white mb-2">Public Applicant Portal</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Branded careers page allowing candidates to search open positions, submit resumes, and track application status.
            </p>
          </div>

          {/* Feature 6: Audit Compliance */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/50 backdrop-blur-xl transition-all group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white mb-2">Audit Log Compliance</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every action, status change, and user creation is captured with timestamps and IP records for complete enterprise auditing.
            </p>
          </div>

        </div>
      </section>


      {/* ── 5. INTERACTIVE PORTAL SHOWCASE ── */}
      <section id="portals" className="py-20 bg-slate-900/40 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">Two Tailored Portals. One Platform.</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">Switch between Recruiter Management and Candidate Application experiences.</p>
          </div>

          {/* Tab Controls */}
          <div className="flex justify-center mb-10">
            <div className="p-1.5 bg-slate-950 border border-slate-800 rounded-2xl inline-flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('recruiter')}
                className={`px-6 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'recruiter'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                <Users className="w-4 h-4" />
                <span>Recruiter &amp; HR Portal</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('candidate')}
                className={`px-6 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'candidate'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Candidate Applicant Portal</span>
              </button>
            </div>
          </div>

          {/* Tab Panel Content */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto shadow-2xl relative">

            {activeTab === 'recruiter' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    For HR Managers &amp; Recruiters
                  </span>
                  <h4 className="text-2xl font-extrabold text-white">Complete Control Over Your Hiring Funnel</h4>
                  <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-400 shrink-0" />
                      Manage candidates, schedule interviews, and assign roles.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-400 shrink-0" />
                      Filter applicants by skills, match score, and current stage.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-400 shrink-0" />
                      Generate audit logs and download hiring analytics reports.
                    </li>
                  </ul>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="px-5 py-3 rounded-xl text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30 transition-all"
                    >
                      Team Sign In →
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Recruiter Access Features</span>
                    <span className="text-emerald-400">Role Isolated</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Pipeline Drag-and-Drop</span>
                    <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Enabled</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Feedback Scorecards</span>
                    <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Enabled</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Audit &amp; Security Logs</span>
                    <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Super Admin</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    For Applicants &amp; Job Seekers
                  </span>
                  <h4 className="text-2xl font-extrabold text-white">Find Your Next Dream Career Step</h4>
                  <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      Browse active job listings with full salary and skill breakdowns.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      One-click registration and resume application submission.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      Real-time status updates on your candidate portal dashboard.
                    </li>
                  </ul>
                  <div className="pt-4 flex items-center gap-3">
                    <Link
                      to="/careers"
                      className="px-5 py-3 rounded-xl text-xs font-extrabold text-white bg-cyan-500 hover:bg-cyan-400 shadow-md shadow-cyan-500/30 transition-all"
                    >
                      Browse Openings →
                    </Link>
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="px-5 py-3 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900"
                    >
                      Candidate Login
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Candidate Experience</span>
                    <span className="text-cyan-400">Streamlined</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-300">One-Click Apply</span>
                    <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Application Tracking</span>
                    <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">Live</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Profile &amp; Resume Vault</span>
                    <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">Secure</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>


      {/* ── 6. WORKFLOW TIMELINE ── */}
      <section id="workflow" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 mb-2">Simplified Journey</h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-16">How MindMatrix Works in 4 Steps</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-extrabold text-xs flex items-center justify-center mb-4">
              01
            </div>
            <h4 className="text-base font-extrabold text-white mb-1">Create Job Requisition</h4>
            <p className="text-xs text-slate-400">Post open positions with required skills, experience, and department details.</p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-extrabold text-xs flex items-center justify-center mb-4">
              02
            </div>
            <h4 className="text-base font-extrabold text-white mb-1">Automated Screening</h4>
            <p className="text-xs text-slate-400">Candidates apply online and are instantly matched &amp; scored using target metrics.</p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-extrabold text-xs flex items-center justify-center mb-4">
              03
            </div>
            <h4 className="text-base font-extrabold text-white mb-1">Conduct Interviews</h4>
            <p className="text-xs text-slate-400">Schedule technical rounds, log interviewer scorecards, and rate feedback.</p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 font-extrabold text-xs flex items-center justify-center mb-4">
              04
            </div>
            <h4 className="text-base font-extrabold text-white mb-1">Hire &amp; Onboard</h4>
            <p className="text-xs text-slate-400">Extend offers, track acceptance status, and audit full candidate history.</p>
          </div>
        </div>
      </section>


      {/* ── 7. FOOTER CTA ── */}
      <footer className="border-t border-slate-800/80 bg-slate-950 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">

          {/* Main Footer Headline Banner */}
          <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 border border-slate-800 shadow-2xl space-y-6">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Upgrade Your Hiring Infrastructure?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-medium">
              Join leading organizations automating talent pipelines with MindMatrix.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-6 py-3 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link
                to="/careers"
                className="px-6 py-3 rounded-xl text-xs font-extrabold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700"
              >
                Explore Careers Board
              </Link>
            </div>
          </div>

          {/* Bottom Branding & Links */}
          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-3">
              <MindMatrixLogo layout="horizontal" showTagline={false} />
              <span>© {new Date().getFullYear()} MindMatrix Inc. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-6">
              <a href="#features" className="hover:text-slate-300 transition-colors">Features</a>
              <Link to="/careers" className="hover:text-slate-300 transition-colors">Careers</Link>
              <Link to="/login" className="hover:text-slate-300 transition-colors">Sign In</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
