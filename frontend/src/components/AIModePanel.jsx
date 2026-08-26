import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Sparkles, X, MessageSquare, Search, BarChart3, Send, Bot, User, 
  CheckCircle2, Clock, Users, ArrowRight, Lightbulb, Filter, Award, 
  TrendingUp, Briefcase, Zap, CheckCircle, XCircle, Trash2
} from 'lucide-react';

// Safe candidate field accessors matching Hirely candidate data shape
export const getCandidateName = (c) => c?.name || c?.fullName || 'Unnamed Candidate';
export const getCandidateId = (c) => c?.id || c?._id || c?.candidateId || Math.random().toString();
export const getCandidateRole = (c) => c?.role || c?.jobTitle || 'Role Not Specified';
export const getCandidateStatus = (c) => c?.status || c?.stage || 'Applied';
export const getCandidateExperience = (c) => c?.experience || 'N/A';
export const getCandidateEmail = (c) => c?.email || 'N/A';
export const getCandidateSkills = (c) => {
  if (Array.isArray(c?.skills)) return c.skills;
  if (typeof c?.skills === 'string') return c.skills.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};
export const getCandidateDaysAgo = (c) => {
  if (typeof c?.appliedDaysAgo === 'number') return c.appliedDaysAgo;
  if (c?.createdAt || c?.appliedAt) {
    const diff = Math.floor((Date.now() - new Date(c.createdAt || c.appliedAt).getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  }
  return 1;
};

// Status styling helper matching Hirely design system
export function getStatusBadgeStyle(status) {
  const norm = String(status || '').toLowerCase();
  if (norm.includes('shortlist')) {
    return { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' };
  }
  if (norm.includes('interview')) {
    return { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500 animate-pulse' };
  }
  if (norm.includes('select') || norm.includes('hired')) {
    return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
  }
  if (norm.includes('reject')) {
    return { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
  }
  return { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
}

// AI Engine: Smart Answer Generator for Chat
export function mockAskAI(query, candidates = [], user = null) {
  if (!query || !query.trim()) return "Please ask a question about your candidate pipeline.";
  
  const q = query.toLowerCase().trim();

  const userName = (() => {
    if (!user) return 'Recruiter';
    const full = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    if (full) return full;
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0];
    return 'Recruiter';
  })();

  // User Greeting Query (HII / HLO / HELLO / HEY / etc.)
  const isGreeting = /^(h[ii]+|hlo+|hello+|hey+|hola|good\s*(morning|afternoon|evening)|greetings|hi\s*there)/i.test(q);
  if (isGreeting || q === 'hi' || q === 'hii' || q === 'hlo' || q === 'hello' || q === 'hey') {
    const shortlistedCount = candidates.filter(c => getCandidateStatus(c).toLowerCase().includes('shortlist')).length;
    const interviewCount = candidates.filter(c => getCandidateStatus(c).toLowerCase().includes('interview')).length;

    return `Welcome, **${userName}**! 👋\n\nHow can I help you manage your candidate pipeline today?\n\n` +
      `You currently have **${candidates.length}** candidates in your pipeline (${shortlistedCount} shortlisted, ${interviewCount} in interview rounds).\n\n` +
      `Feel free to click any suggestion below or ask me about skills, candidate stages, or pipeline insights!`;
  }

  // Summary / Count query
  if (q.includes('summary') || q.includes('overview') || q.includes('how many') || q.includes('total') || q.includes('count')) {
    const total = candidates.length;
    const shortlisted = candidates.filter(c => getCandidateStatus(c).toLowerCase().includes('shortlist')).length;
    const interview = candidates.filter(c => getCandidateStatus(c).toLowerCase().includes('interview')).length;
    const selected = candidates.filter(c => getCandidateStatus(c).toLowerCase().includes('select')).length;
    const rejected = candidates.filter(c => getCandidateStatus(c).toLowerCase().includes('reject')).length;
    const applied = total - (shortlisted + interview + selected + rejected);

    return `Here is your candidate pipeline summary, **${userName}**:\n\n` +
      `• **Total Candidates**: ${total}\n` +
      `• **Shortlisted**: ${shortlisted}\n` +
      `• **Interview Scheduled**: ${interview}\n` +
      `• **Selected / Hired**: ${selected}\n` +
      `• **Rejected**: ${rejected}\n` +
      `• **Pending / Applied**: ${applied > 0 ? applied : 0}\n\n` +
      `You have ${interview} candidates currently in active interview stages.`;
  }

  // Skill query
  const skillKeywords = ['react', 'node', 'javascript', 'python', 'java', 'typescript', 'aws', 'docker', 'sql', 'mongodb', 'agile', 'figma', 'design'];
  const foundSkill = skillKeywords.find(sk => q.includes(sk));
  if (foundSkill || q.includes('skill') || q.includes('knows') || q.includes('experience in')) {
    const targetSkill = foundSkill || 'technical';
    const matches = candidates.filter(c => {
      const skills = getCandidateSkills(c).map(s => s.toLowerCase());
      return skills.some(s => s.includes(targetSkill));
    });

    if (matches.length === 0) {
      return `No candidates found matching the skill "${targetSkill}". Try searching for popular skills like React, Python, Java, or Node.js.`;
    }

    const list = matches.slice(0, 4).map(c => 
      `• **${getCandidateName(c)}** - ${getCandidateRole(c)} (${getCandidateStatus(c)}, Skills: ${getCandidateSkills(c).slice(0, 3).join(', ')})`
    ).join('\n');

    return `Found **${matches.length}** candidate(s) skilled in **${targetSkill.toUpperCase()}**:\n\n${list}` +
      (matches.length > 4 ? `\n\n...and ${matches.length - 4} more.` : '');
  }

  // Status specific query
  if (q.includes('shortlisted')) {
    const shortlisted = candidates.filter(c => getCandidateStatus(c).toLowerCase().includes('shortlist'));
    if (shortlisted.length === 0) return "There are currently no shortlisted candidates.";
    const names = shortlisted.map(c => `• **${getCandidateName(c)}** (${getCandidateRole(c)})`).join('\n');
    return `There are **${shortlisted.length}** shortlisted candidate(s):\n\n${names}`;
  }

  if (q.includes('interview')) {
    const interview = candidates.filter(c => getCandidateStatus(c).toLowerCase().includes('interview'));
    if (interview.length === 0) return "No interviews are currently scheduled.";
    const names = interview.map(c => `• **${getCandidateName(c)}** (${getCandidateRole(c)})`).join('\n');
    return `There are **${interview.length}** candidate(s) in the interview stage:\n\n${names}`;
  }

  if (q.includes('selected') || q.includes('hired')) {
    const selected = candidates.filter(c => getCandidateStatus(c).toLowerCase().includes('select'));
    if (selected.length === 0) return "No candidates have been selected yet.";
    const names = selected.map(c => `• **${getCandidateName(c)}** (${getCandidateRole(c)})`).join('\n');
    return `There are **${selected.length}** selected candidate(s):\n\n${names}`;
  }

  // Recommendation query
  if (q.includes('top') || q.includes('best') || q.includes('recommend') || q.includes('star')) {
    const top = candidates.filter(c => {
      const st = getCandidateStatus(c).toLowerCase();
      return st.includes('shortlist') || st.includes('interview') || st.includes('select');
    }).slice(0, 3);

    if (top.length === 0) return "Add candidates to the pipeline to receive top AI recommendations.";

    const items = top.map(c => 
      `• **${getCandidateName(c)}** - ${getCandidateRole(c)} (${getCandidateStatus(c)})\n  *Key Skills*: ${getCandidateSkills(c).slice(0, 3).join(', ')}`
    ).join('\n\n');

    return `Here are top recommended candidates in your pipeline:\n\n${items}`;
  }

  // Fallback response with candidate contextual awareness
  const candidateNames = candidates.slice(0, 3).map(c => getCandidateName(c)).join(', ');
  return `I analyzed your ${candidates.length} active candidates. You can ask me specific questions like:\n` +
    `• "Who has React experience?"\n` +
    `• "Show pipeline summary"\n` +
    `• "Who is currently in interview round?"\n` +
    `• "Recommend top candidates"\n\n` +
    (candidateNames ? `Active candidates include: ${candidateNames}.` : '');
}

// AI Engine: Natural Language Candidate Search
export function mockSearchAI(searchQuery, candidates = []) {
  if (!searchQuery || !searchQuery.trim()) return candidates;

  const terms = searchQuery.toLowerCase().trim().split(/\s+/);

  return candidates.filter(c => {
    const name = getCandidateName(c).toLowerCase();
    const role = getCandidateRole(c).toLowerCase();
    const status = getCandidateStatus(c).toLowerCase();
    const exp = getCandidateExperience(c).toLowerCase();
    const email = getCandidateEmail(c).toLowerCase();
    const skills = getCandidateSkills(c).map(s => s.toLowerCase()).join(' ');

    const combinedText = `${name} ${role} ${status} ${exp} ${email} ${skills}`;

    // Match if all terms appear in candidate profile
    return terms.every(term => combinedText.includes(term));
  });
}

// AI Engine: Pipeline Insights Generator
export function buildInsights(candidates = []) {
  const total = candidates.length;
  const shortlisted = candidates.filter(c => getCandidateStatus(c).toLowerCase().includes('shortlist')).length;
  const interview = candidates.filter(c => getCandidateStatus(c).toLowerCase().includes('interview')).length;
  const selected = candidates.filter(c => getCandidateStatus(c).toLowerCase().includes('select')).length;
  const rejected = candidates.filter(c => getCandidateStatus(c).toLowerCase().includes('reject')).length;
  const applied = Math.max(0, total - (shortlisted + interview + selected + rejected));

  // Compute top skills across all candidates
  const skillCounts = {};
  candidates.forEach(c => {
    const skills = getCandidateSkills(c);
    skills.forEach(s => {
      const clean = s.trim();
      if (clean) skillCounts[clean] = (skillCounts[clean] || 0) + 1;
    });
  });

  const sortedSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const conversionRate = total > 0 ? Math.round((selected / total) * 100) : 0;
  const activeRate = total > 0 ? Math.round(((shortlisted + interview) / total) * 100) : 0;

  return {
    total,
    shortlisted,
    interview,
    selected,
    rejected,
    applied,
    conversionRate,
    activeRate,
    topSkills: sortedSkills,
    suggestions: [
      {
        title: 'Interview Velocity',
        desc: interview > 0 
          ? `${interview} candidate(s) pending interview feedback. Schedule reviews promptly to avoid candidate drop-off.`
          : 'No active interviews scheduled. Consider moving shortlisted candidates to interview stage.',
        type: interview > 0 ? 'warning' : 'info'
      },
      {
        title: 'Skill Distribution',
        desc: sortedSkills.length > 0 
          ? `Top required skill in pool is "${sortedSkills[0][0]}" (${sortedSkills[0][1]} candidates).`
          : 'Add skills to candidates to enable deeper skill matrix insights.',
        type: 'success'
      },
      {
        title: 'Pipeline Health',
        desc: `${activeRate}% of candidate pool is active in Shortlist/Interview stages. Healthy pipeline movement!`,
        type: 'primary'
      }
    ]
  };
}

export default function AIModePanel({ open, onClose, candidates = [], user = null }) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'search' | 'insights'

  const userName = useMemo(() => {
    if (!user) return 'Recruiter';
    const full = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    if (full) return full;
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0];
    return 'Recruiter';
  }, [user]);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Initialize/Update Welcome Message with Personalized User Greeting
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: `Welcome, **${userName}**! 👋 I am your **Hirely AI Assistant**.\n\nType **"HII"** or ask any question about your candidate pipeline to get started!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [open, userName, messages.length]);

  // Dynamic Suggested Prompts according to user role and conversation state
  const suggestedPrompts = useMemo(() => {
    const hasUserMessaged = messages.some(m => m.sender === 'user');
    
    if (!hasUserMessaged) {
      return [
        "HII 👋",
        "Pipeline summary",
        "Recommend top candidates",
        "Who knows React?"
      ];
    }

    const role = user?.role || 'RECRUITER';
    if (role === 'SUPER_ADMIN' || role === 'HR_MANAGER') {
      return [
        "Pipeline summary",
        "Who is in Interview round?",
        "Recommend top candidates",
        "Show selected candidates"
      ];
    }
    if (role === 'INTERVIEWER') {
      return [
        "Who is in Interview round?",
        "Who knows Python?",
        "Shortlisted candidates",
        "Pipeline summary"
      ];
    }
    return [
      "Pipeline summary",
      "Who knows React?",
      "Shortlisted candidates",
      "Recommend top candidates"
    ];
  }, [user, messages]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const searchResults = useMemo(() => mockSearchAI(searchQuery, candidates), [searchQuery, candidates]);

  // Insights State
  const insightsData = useMemo(() => buildInsights(candidates), [candidates]);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, activeTab]);

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || chatInput).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReplyText = mockAskAI(text, candidates, user);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 500);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'ai',
        text: `Welcome, **${userName}**! 👋 I am your **Hirely AI Assistant**.\n\nType **"HII"** or ask any question about your candidate pipeline to get started!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end transition-opacity duration-300">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-Over Drawer */}
      <div className="relative w-full max-w-lg md:max-w-xl bg-white shadow-2xl flex flex-col h-full z-50 animate-slide-left border-l border-slate-200">
        
        {/* Header with AI Gradient Accent */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Sparkles className="w-4 h-4 text-fuchsia-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight text-white">AI Mode</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 pt-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'chat'
                  ? 'border-blue-600 text-blue-600 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'search'
                  ? 'border-purple-600 text-purple-600 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Smart Search</span>
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'insights'
                  ? 'border-fuchsia-600 text-fuchsia-600 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Insights</span>
            </button>
          </div>

          {/* Clear Chat Button (when in Chat tab) */}
          {activeTab === 'chat' && (
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-2.5 py-1 mb-1 rounded-lg text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Clear Chat History"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Panel Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50/50 space-y-4">
          
          {/* TAB 1: CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full space-y-4">
              
              {/* Message List */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs text-xs font-extrabold ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gradient-to-tr from-blue-600 via-purple-600 to-fuchsia-600 text-white'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div className={`max-w-[82%] rounded-2xl p-3.5 text-xs font-medium leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs space-y-1'
                    }`}>
                      <div className="whitespace-pre-line">
                        {msg.text.split(/(\*\*.*?\*\*)/g).map((chunk, i) => {
                          if (chunk.startsWith('**') && chunk.endsWith('**')) {
                            return <strong key={i} className={msg.sender === 'user' ? 'font-bold text-white' : 'font-bold text-slate-950'}>{chunk.slice(2, -2)}</strong>;
                          }
                          return chunk;
                        })}
                      </div>
                      <span className={`block text-[10px] mt-1 text-right font-normal ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Bot className="w-4 h-4 animate-bounce" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3 text-xs text-slate-500 flex items-center gap-1.5 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                      <span>AI is thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Quick Prompts Suggestions */}
              <div className="space-y-1.5 pt-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">Suggested Prompts</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt.replace(' 👋', ''))}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                    >
                      ✨ {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Field */}
              <div className="pt-2">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI about candidate pipeline, skills, or status..."
                    className="flex-1 text-xs px-3 py-1.5 bg-transparent border-none text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-fuchsia-600 hover:opacity-95 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 2: SMART SEARCH */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              
              {/* Search Bar Input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search naturally (e.g., 'React developer shortlisted', 'Fresher')..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 shadow-2xs transition-all"
                />
              </div>

              {/* Quick Search Badges */}
              <div className="flex flex-wrap gap-1.5">
                {['React', 'Node.js', 'Shortlisted', 'Interview', 'Selected', 'Fresher'].map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(tag)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      searchQuery.toLowerCase() === tag.toLowerCase()
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-700'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-2 py-1 text-xs font-bold text-rose-600 hover:underline cursor-pointer ml-auto"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* Results Count Header */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1 pt-1">
                <span>Matching Candidates ({searchResults.length})</span>
                <span className="text-[11px] font-medium text-slate-400">Natural AI Filtering</span>
              </div>

              {/* Candidates Search Cards List */}
              <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                {searchResults.length > 0 ? (
                  searchResults.map(c => {
                    const badge = getStatusBadgeStyle(getCandidateStatus(c));
                    const initials = getCandidateName(c)
                      .split(/\s+/)
                      .map(n => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase() || 'CAN';

                    return (
                      <div 
                        key={getCandidateId(c)} 
                        className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-purple-200 transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
                              {initials}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{getCandidateName(c)}</h4>
                              <p className="text-xs text-slate-500 font-semibold">{getCandidateRole(c)}</p>
                            </div>
                          </div>

                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${badge.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            {getCandidateStatus(c)}
                          </span>
                        </div>

                        {/* Experience & Days Ago */}
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-100">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-purple-500" />
                            {getCandidateExperience(c)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Applied {getCandidateDaysAgo(c)}d ago
                          </span>
                        </div>

                        {/* Skills Tag Pills */}
                        <div className="flex flex-wrap gap-1">
                          {getCandidateSkills(c).slice(0, 4).map((skill, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-100"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl space-y-2">
                    <Search className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">No candidates match your natural search.</p>
                    <p className="text-[11px] text-slate-400">Try keywords like 'React', 'Shortlisted', or clear search filters.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: INSIGHTS */}
          {activeTab === 'insights' && (
            <div className="space-y-4">
              
              {/* Total Candidates Overview Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-300 animate-bounce" />
                    <h4 className="font-extrabold text-sm text-white">Pipeline Summary</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 backdrop-blur-md text-white border border-white/30">
                    Live Data
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                    <span className="block text-lg font-black text-white">{insightsData.total}</span>
                    <span className="text-[10px] font-bold text-blue-100 uppercase">Total Pool</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                    <span className="block text-lg font-black text-emerald-300">{insightsData.selected}</span>
                    <span className="text-[10px] font-bold text-blue-100 uppercase">Selected</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                    <span className="block text-lg font-black text-amber-300">{insightsData.interview}</span>
                    <span className="text-[10px] font-bold text-blue-100 uppercase">Interview</span>
                  </div>
                </div>
              </div>

              {/* Status Distribution Progress Breakdown */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center justify-between">
                  <span>Candidate Stage Breakdown</span>
                  <span className="text-purple-600 font-bold text-[11px]">{insightsData.activeRate}% Active</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Shortlisted</span>
                      <span className="text-blue-700">{insightsData.shortlisted} candidates</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${insightsData.total > 0 ? (insightsData.shortlisted / insightsData.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Interview Scheduled</span>
                      <span className="text-amber-700">{insightsData.interview} candidates</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${insightsData.total > 0 ? (insightsData.interview / insightsData.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Selected</span>
                      <span className="text-emerald-700">{insightsData.selected} candidates</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${insightsData.total > 0 ? (insightsData.selected / insightsData.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Rejected</span>
                      <span className="text-rose-700">{insightsData.rejected} candidates</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-rose-400 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${insightsData.total > 0 ? (insightsData.rejected / insightsData.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Skills Matrix Card */}
              {insightsData.topSkills.length > 0 && (
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2.5">
                  <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Top In-Demand Skills</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {insightsData.topSkills.map(([skillName, count], idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200/80 rounded-xl text-xs font-extrabold text-purple-800"
                      >
                        <span>{skillName}</span>
                        <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Auto-generated Action Items */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 px-1">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>AI Recruiter Recommendations</span>
                </h4>

                {insightsData.suggestions.map((sug, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1"
                  >
                    <h5 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {sug.title}
                    </h5>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {sug.desc}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
