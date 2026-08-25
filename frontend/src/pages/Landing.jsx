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
  Check,
  Shield
} from 'lucide-react';
import MindMatrixLogo, { MindMatrixIcon } from '../components/MindMatrixLogo';

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recruiter');

  return (
    <div
      style={{
        backgroundImage: `url(/abstract-glass.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
      className="min-h-screen w-full text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-x-hidden bg-black"
    >
      {/* Full Page Vignette Overlay for Crisp Contrast */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-none z-0" />

      {/* Background Ambient Glow Orbs */}
      <div className="fixed top-1/4 -left-20 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 -right-20 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/3 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* ── 1. GLASSMORPHIC NAV BAR ── */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/40 border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <MindMatrixLogo layout="horizontal" showTagline={false} />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 border border-purple-400/30 text-purple-300 uppercase tracking-widest backdrop-blur-md">
              AI Suite
            </span>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
            <a href="#features" className="hover:text-cyan-300 transition-colors">Features</a>
            <a href="#portals" className="hover:text-purple-300 transition-colors">Portals</a>
            <a href="#workflow" className="hover:text-pink-300 transition-colors">Workflow</a>
            <a href="#metrics" className="hover:text-emerald-300 transition-colors">Analytics</a>
            <Link to="/careers" className="hover:text-teal-300 transition-colors flex items-center gap-1.5 text-slate-200">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>Public Careers</span>
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              to="/careers"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all"
            >
              Browse Jobs
            </Link>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 hover:from-teal-400 hover:to-cyan-400 shadow-lg shadow-teal-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>


      {/* ── 2. HERO SECTION ── */}
      <section className="relative z-10 pt-16 lg:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">

        {/* Floating Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 text-purple-300 text-xs font-semibold backdrop-blur-xl shadow-xl shadow-purple-500/10 mb-8 animate-bounce-slow">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Next-Generation Talent Acquisition Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {/* Main Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Hire Top 1% Talent Faster with{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Abstract AI Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-slate-300/90 text-base sm:text-lg lg:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
          MindMatrix bridges recruiter tools and applicant experiences. Intelligent resume matching, structured interview workflows, and enterprise audit security in one glassmorphic hub.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-7 py-4 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 shadow-xl shadow-teal-500/30 hover:shadow-teal-500/40 transition-all flex items-center gap-3 cursor-pointer group active:scale-95"
          >
            <span>Access Team Portal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <Link
            to="/careers"
            className="px-7 py-4 rounded-2xl text-sm font-extrabold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-xl shadow-lg transition-all flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>Browse Careers &amp; Applicants</span>
          </Link>
        </div>

        {/* Key Points */}
        <div className="mt-10 pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Role Isolated Architecture
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            AI Match &amp; Skill Scoring
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            Real-Time Audit Trail
          </span>
        </div>


        {/* ── HERO APP INTERACTIVE SHOWCASE CARD (ABSTRACT GLASS FRAME) ── */}
        <div className="mt-14 relative max-w-5xl mx-auto rounded-3xl border border-white/15 bg-white/5 p-3 sm:p-4 backdrop-blur-2xl shadow-2xl overflow-hidden group">

          {/* Outer Border Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-pink-500/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity pointer-events-none" />

          <div
            style={{
              backgroundImage: `url(/abstract-glass.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center'
            }}
            className="relative z-10 rounded-2xl border border-white/10 overflow-hidden shadow-inner bg-black/60 backdrop-blur-xl"
          >
            {/* Fake Mac Header Bar */}
            <div className="h-10 bg-black/40 border-b border-white/10 px-4 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>mindmatrix.app/recruitment/pipeline</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-slate-300">Live AI Engine</span>
              </div>
            </div>

            {/* Dashboard Mock Content */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">

              {/* Left Kanban Column Preview */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-white">Active Recruitment Pipeline</h3>
                    <p className="text-xs text-slate-300">Lead Full-Stack Architect • 32 Applicants</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 border border-purple-400/40 text-purple-300 backdrop-blur-md">
                    ⚡ Smart Match Active
                  </span>
                </div>

                {/* Pipeline Columns */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2 backdrop-blur-md">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                      <span>Screening</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200">12</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 text-xs font-semibold text-white shadow-sm flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">Alex Rivera</span>
                        <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/20 px-1.5 py-0.5 rounded">98% Match</span>
                      </div>
                      <span className="text-[10px] text-slate-400">React, Node.js, AWS</span>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2 backdrop-blur-md">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                      <span>Interviewing</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200">6</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/50 border border-purple-500/50 text-xs font-semibold text-white shadow-md flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">Sarah Jenkins</span>
                        <span className="text-[10px] text-purple-300 font-extrabold bg-purple-500/30 px-1.5 py-0.5 rounded">Round 2</span>
                      </div>
                      <span className="text-[10px] text-slate-400">System Architecture</span>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2 backdrop-blur-md">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                      <span>Offered</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200">3</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/50 border border-emerald-500/50 text-xs font-semibold text-white shadow-md flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">Michael Chen</span>
                        <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/30 px-1.5 py-0.5 rounded">Accepted</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Senior Architect</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Widget */}
              <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4 backdrop-blur-md">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Talent Metrics</h4>
                  <div className="mt-3 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
                        <span>Time-to-Hire</span>
                        <span className="text-cyan-400">11 Days (⚡ 65% Faster)</span>
                      </div>
                      <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/10">
                        <div className="bg-gradient-to-r from-purple-500 via-cyan-400 to-teal-400 h-full w-[85%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
                        <span>Candidate Fit Precision</span>
                        <span className="text-emerald-400">98.4% Accuracy</span>
                      </div>
                      <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/10">
                        <div className="bg-emerald-400 h-full w-[98%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">Security Vault</span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    SOC2 &amp; Audit Logged
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>


      {/* ── 3. CLIENT MARQUEE / TRUSTED BRANDS ── */}
      <section className="border-y border-white/10 bg-black/40 backdrop-blur-md py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            Trusted by Forward-Thinking HR &amp; Talent Leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-80 grayscale hover:grayscale-0 transition-all">
            <span className="text-lg font-black text-slate-300 tracking-wider">TECHCORP</span>
            <span className="text-lg font-black text-slate-300 tracking-wider">NEXUS.AI</span>
            <span className="text-lg font-black text-slate-300 tracking-wider">INNOVATEX</span>
            <span className="text-lg font-black text-slate-300 tracking-wider">QUANTUM</span>
            <span className="text-lg font-black text-slate-300 tracking-wider">CLOUDPULSE</span>
          </div>
        </div>
      </section>


      {/* ── 4. BENTO GRID FEATURES SECTION (FROSTED GLASS CARDS) ── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-purple-400">
            Enterprise Architecture
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built with Abstract Glass Elegance
          </h3>
          <p className="text-slate-300 text-sm sm:text-base font-medium">
            Designed for Super Admins, HR Managers, Recruiters, Interviewers, and Applicants.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 backdrop-blur-xl transition-all group hover:-translate-y-1 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white mb-2">AI Smart Candidate Matching</h4>
            <p className="text-xs text-slate-300/80 leading-relaxed">
              Evaluate applicant skillsets against requisition requirements with match scores and skill gap indicators.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/50 backdrop-blur-xl transition-all group hover:-translate-y-1 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white mb-2">Structured Interview Pipelines</h4>
            <p className="text-xs text-slate-300/80 leading-relaxed">
              Organize technical and HR interview rounds, record interviewer feedback ratings, and advance applicants.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/50 backdrop-blur-xl transition-all group hover:-translate-y-1 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white mb-2">Strict Role Security Isolation</h4>
            <p className="text-xs text-slate-300/80 leading-relaxed">
              Granular access control enforcing separate portals for Super Admin, HR Manager, Recruiter, Interviewer, and Candidate profiles.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 backdrop-blur-xl transition-all group hover:-translate-y-1 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white mb-2">Real-Time Talent Analytics</h4>
            <p className="text-xs text-slate-300/80 leading-relaxed">
              Comprehensive conversion rate metrics, source performance, hiring velocity, and exportable reports.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-pink-500/50 backdrop-blur-xl transition-all group hover:-translate-y-1 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300 mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white mb-2">Public Applicant Portal</h4>
            <p className="text-xs text-slate-300/80 leading-relaxed">
              Branded public careers page enabling job seekers to search openings, submit applications, and track progress.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-500/50 backdrop-blur-xl transition-all group hover:-translate-y-1 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white mb-2">Audit Log Compliance</h4>
            <p className="text-xs text-slate-300/80 leading-relaxed">
              Every status update, candidate modification, and user creation action is captured with IP and timestamp logs.
            </p>
          </div>

        </div>
      </section>


      {/* ── 5. INTERACTIVE PORTAL SHOWCASE ── */}
      <section id="portals" className="py-20 bg-black/40 border-y border-white/10 relative backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">Two Tailored Portals. One Glass Ecosystem.</h3>
            <p className="text-xs text-slate-300 mt-2 font-medium">Toggle between Recruiter Management and Candidate Applicant portals.</p>
          </div>

          {/* Tab Controls */}
          <div className="flex justify-center mb-10">
            <div className="p-1.5 bg-black/60 border border-white/10 rounded-2xl inline-flex gap-2 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setActiveTab('recruiter')}
                className={`px-6 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'recruiter'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                <Shield className="w-4 h-4" />
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
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto shadow-2xl backdrop-blur-2xl relative">

            {activeTab === 'recruiter' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    For HR Managers &amp; Recruiters
                  </span>
                  <h4 className="text-2xl font-extrabold text-white">Complete Control Over Your Hiring Funnel</h4>
                  <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      Manage candidate pipeline, schedule interviews, and assign roles.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      Filter applicants by skills, match score, and stage.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      Generate audit logs and download hiring analytics reports.
                    </li>
                  </ul>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="px-5 py-3 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-md shadow-teal-500/30 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Sign In to Recruiter Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-black/50 border border-white/10 p-6 rounded-2xl space-y-3 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span>Recruiter Capabilities</span>
                    <span className="text-emerald-400">Strict Isolation</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Pipeline Kanban Drag &amp; Drop</span>
                    <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Enabled</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Interviewer Scorecard Ratings</span>
                    <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Enabled</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-300">System Audit &amp; Security Logs</span>
                    <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Super Admin</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    For Applicants &amp; Job Seekers
                  </span>
                  <h4 className="text-2xl font-extrabold text-white">Find Your Next Dream Role</h4>
                  <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      Explore active open requisitions with salary and skill specs.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      Submit applications and track status updates in real-time.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      Manage candidate profile and uploaded resume docs.
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
                      className="px-5 py-3 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-white/10 bg-white/5"
                    >
                      Candidate Sign In
                    </button>
                  </div>
                </div>

                <div className="bg-black/50 border border-white/10 p-6 rounded-2xl space-y-3 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span>Candidate Portal Features</span>
                    <span className="text-cyan-400">Streamlined</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-300">One-Click Job Application</span>
                    <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Application Tracking</span>
                    <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">Live</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Candidate Profile Vault</span>
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
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 mb-2">Streamlined Process</h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-16">How MindMatrix Operates in 4 Steps</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl relative shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 font-extrabold text-xs flex items-center justify-center mb-4">
              01
            </div>
            <h4 className="text-base font-extrabold text-white mb-1">Create Requisition</h4>
            <p className="text-xs text-slate-300/80">Define target skills, job roles, salary bands, and department details.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl relative shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-extrabold text-xs flex items-center justify-center mb-4">
              02
            </div>
            <h4 className="text-base font-extrabold text-white mb-1">AI Screening</h4>
            <p className="text-xs text-slate-300/80">Applicants apply online and are automatically scored and ranked by skill fit.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl relative shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-extrabold text-xs flex items-center justify-center mb-4">
              03
            </div>
            <h4 className="text-base font-extrabold text-white mb-1">Conduct Interviews</h4>
            <p className="text-xs text-slate-300/80">Schedule technical/HR rounds and log interviewer feedback ratings.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl relative shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-400/30 text-pink-300 font-extrabold text-xs flex items-center justify-center mb-4">
              04
            </div>
            <h4 className="text-base font-extrabold text-white mb-1">Hire &amp; Audit</h4>
            <p className="text-xs text-slate-300/80">Extend offer letters, track acceptance, and audit complete candidate logs.</p>
          </div>
        </div>
      </section>


      {/* ── 7. FOOTER CTA & BRANDING ── */}
      <footer className="border-t border-white/10 bg-black/60 backdrop-blur-xl pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">

          {/* Footer CTA Container */}
          <div
            style={{
              backgroundImage: `url(/abstract-glass.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center'
            }}
            className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl border border-white/15 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-2xl bg-black/60"
          >
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ready to Experience Modern Talent Acquisition?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-medium">
                Streamline candidate pipelines and empower recruiters with MindMatrix.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 hover:from-teal-400 hover:to-cyan-400 shadow-lg shadow-teal-500/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <Link
                  to="/careers"
                  className="px-6 py-3 rounded-xl text-xs font-extrabold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md"
                >
                  Explore Careers Board
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Branding & Links */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-3">
              <MindMatrixLogo layout="horizontal" showTagline={false} />
              <span>© {new Date().getFullYear()} MindMatrix Inc. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-6">
              <a href="#features" className="hover:text-slate-200 transition-colors">Features</a>
              <Link to="/careers" className="hover:text-slate-200 transition-colors">Careers</Link>
              <Link to="/login" className="hover:text-slate-200 transition-colors">Sign In</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
