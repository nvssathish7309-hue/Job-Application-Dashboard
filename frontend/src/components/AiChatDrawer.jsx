import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot, User, RefreshCw, ChevronDown, CheckCircle2, Award, Briefcase, Calendar, TrendingUp, Zap, Sparkle, RotateCcw } from 'lucide-react';
import { useCandidates } from '../context/CandidateContext';
import { useAuth } from '../context/AuthContext';

// Gemini-style Markdown Parser component
function RenderFormattedText({ text, isUser }) {
  if (!text) return null;

  if (isUser) {
    return <p className="whitespace-pre-line leading-relaxed text-xs font-medium">{text}</p>;
  }

  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-xs text-slate-900 dark:text-blue-50">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header ###
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-extrabold text-xs sm:text-sm text-blue-900 dark:text-blue-200 mt-2 mb-1">
              {formatInlineBold(trimmed.replace('### ', ''))}
            </h4>
          );
        }

        // Bullet list item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.slice(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              <span>{formatInlineBold(content)}</span>
            </div>
          );
        }

        // Numbered list item
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          const num = numberedMatch[1];
          const content = numberedMatch[2];
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-1">
              <span className="bg-blue-600 text-white dark:bg-blue-500 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                {num}
              </span>
              <span>{formatInlineBold(content)}</span>
            </div>
          );
        }

        // Normal paragraph
        return (
          <p key={idx}>
            {formatInlineBold(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function formatInlineBold(text) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-slate-800 dark:text-blue-200">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export default function AiChatDrawer({ isOpen, onClose }) {
  const { candidates } = useCandidates();
  const { user } = useAuth();

  const userId = user?._id || user?.id || user?.email || 'guest';
  const storageKey = `ai_chat_history_${userId}`;

  const userInitials = (() => {
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.name || user?.email || 'User';
    const parts = fullName.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  })();

  const getTimeBasedGreeting = (currentUser) => {
    const hour = new Date().getHours();
    let timeGreeting = 'Hello';
    let emoji = '✨';

    if (hour >= 4 && hour < 12) {
      timeGreeting = 'Good Morning';
      emoji = '☀️';
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = 'Good Afternoon';
      emoji = '🌤️';
    } else if (hour >= 17 && hour < 22) {
      timeGreeting = 'Good Evening';
      emoji = '<ctrl42>';
    } else {
      timeGreeting = 'Good Night';
      emoji = '🌙';
    }

    const name = currentUser?.firstName || (currentUser?.name ? currentUser.name.split(' ')[0] : 'there');
    return `${emoji} **${timeGreeting}, ${name}!**\n\nI'm **MindMatrix AI Assistant**. How can I help optimize your recruitment workflow today?`;
  };

  const getInitialWelcomeMessage = (currentUser) => ({
    id: 'welcome-1',
    sender: 'ai',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: getTimeBasedGreeting(currentUser)
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [getInitialWelcomeMessage(user)];
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages && messages.length > 0) {
      try {
        sessionStorage.setItem && sessionStorage.setItem(storageKey, JSON.stringify(messages));
      } catch (e) {}
    }
  }, [messages, storageKey]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (e) {}
    setMessages([getInitialWelcomeMessage(user)]);
  }, [userId, user]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleClearChat = () => {
    const freshWelcome = [getInitialWelcomeMessage(user)];
    setMessages(freshWelcome);
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(freshWelcome));
    } catch (e) {}
  };

  if (!isOpen) return null;

  const handleSendMessage = (textToSend) => {
    const queryText = textToSend || inputValue;
    if (!queryText.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: queryText
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateAiResponse(queryText, candidates);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const generateAiResponse = (query, candidatesList = []) => {
    const q = query.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (q.includes('candidate') || q.includes('find') || q.includes('top') || q.includes('react') || q.includes('frontend')) {
      const topCandidates = candidatesList.slice(0, 3);
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp,
        text: `🎯 **AI Candidate Match Results:**\nFound **${candidatesList.length || 5} candidates** matching your criteria. Here are the top recommendations:`,
        candidatesData: topCandidates.length > 0 ? topCandidates : [
          { name: 'Aarav Sharma', role: 'Senior Frontend Developer', score: 98, skills: ['React', 'TypeScript', 'Tailwind'] },
          { name: 'Priya Patel', role: 'Full Stack Engineer', score: 94, skills: ['React', 'Node.js', 'MongoDB'] },
          { name: 'Rohan Mehta', role: 'UI/UX Developer', score: 91, skills: ['React', 'Figma', 'Redux'] }
        ]
      };
    }

    if (q.includes('pipeline') || q.includes('metric') || q.includes('summary') || q.includes('stat') || q.includes('hiring')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp,
        text: `📊 **Recruitment Pipeline Intelligence Overview:**\n\n- 🚀 **Total Candidates:** ${candidatesList.length || 24}\n- ⚡ **Shortlisted Candidates:** ${Math.ceil((candidatesList.length || 24) * 0.45)}\n- 📅 **Interviews Scheduled:** 8\n- 🏆 **Offers Issued:** 3\n\n*Overall Pipeline Efficiency:* **92.4%** (Optimal time-to-hire: 14 days)`
      };
    }

    if (q.includes('job') || q.includes('description') || q.includes('draft') || q.includes('react dev')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp,
        text: `📝 **Generated Job Description Preview:**\n\n### **Senior React Frontend Developer**\n**Department:** Engineering | **Location:** Hybrid\n\n**Key Responsibilities:**\n- Architect performant & accessible React components using state-of-the-art design systems.\n- Collaborate with product design & backend API teams to deliver seamless web apps.\n- Maintain high unit & integration test coverage (Jest / React Testing Library).\n\n**Requirements:**\n- 3+ years modern JavaScript (ES6+), React.js, and TypeScript.\n- Experience with Tailwind CSS & state management (Redux / Context).\n\n*(You can edit and publish this directly in Create Job page!)*`
      };
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      timestamp,
      text: `✨ **AI Insights & Recommendation:**\nI have analyzed your query ("*${query}*"). Here are key actionable recommendations for your recruitment workflow:\n\n1. **Automated Screening:** 8 candidate resumes match your core skill parameters.\n2. **Interview Slot Availability:** Next available slot is tomorrow at 2:00 PM.\n3. **Smart Notification:** Shortlisted candidates will receive automated updates via email.`
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-2 sm:p-4 pointer-events-none">
      
      {/* Background Overlay */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs pointer-events-auto transition-opacity animate-fade-in"
      />

      {/* Floating AI Chat Window */}
      <div className="relative w-full max-w-lg bg-white border border-purple-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto h-[620px] max-h-[85vh] animate-slide-up-sm z-50">
        
        {/* Glow Top Accent Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 text-white p-4 flex items-center justify-between shadow-md relative overflow-hidden shrink-0">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm tracking-wide text-white">MindMatrix AI Recruiter</h3>
                <span className="bg-emerald-400/20 text-emerald-300 text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-purple-100 font-medium">Smart Match, Automated JD & Candidate Insights</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleClearChat}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all text-[11px] font-extrabold flex items-center gap-1 cursor-pointer border border-white/10 active:scale-95"
              title="Clear Chat History"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title="Close AI Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Message Stream - Clean Light Mode */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-purple-50/40 via-white to-blue-50/40 text-slate-800 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md mt-0.5 border border-white/20">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
              )}

              <div className="max-w-[85%] space-y-2">
                <div
                  className={`p-3.5 rounded-2xl shadow-xs transition-all ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none shadow-sm'
                      : 'bg-blue-50/95 border border-blue-200/90 text-slate-900 rounded-tl-none shadow-sm'
                  }`}
                >
                  <RenderFormattedText text={msg.text} isUser={msg.sender === 'user'} />

                  {/* Render Candidates Data Cards if present */}
                  {msg.candidatesData && (
                    <div className="mt-3 space-y-2 border-t border-blue-200/80 pt-2.5">
                      {msg.candidatesData.map((cand, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white border border-blue-200 flex items-center justify-between gap-2 hover:bg-blue-100/50 transition-colors">
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{cand.name || cand.firstName + ' ' + cand.lastName}</p>
                            <p className="text-[10.5px] text-blue-700 font-medium">{cand.role || cand.position || 'Frontend Developer'}</p>
                          </div>
                          <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-lg shrink-0 shadow-xs">
                            {cand.score || 95}% Match
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className={`block text-[9.5px] mt-2 ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-blue-600/80'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 font-extrabold text-xs tracking-tight">
                  {userInitials}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none text-slate-400 flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[10.5px] text-slate-500 font-medium ml-1">AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar - Clean Light Mode */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 relative"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask AI anything (e.g. Recommend candidates, draft JD...)"
              className="flex-1 pl-4 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/80 focus:bg-white transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-2 px-1">
            <span>⚡ Powered by MindMatrix AI Engine</span>
            <span>Press Enter to send</span>
          </div>
        </div>

      </div>

    </div>
  );
}
