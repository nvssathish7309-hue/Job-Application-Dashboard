import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot, Plus, Mic, ChevronDown, RotateCcw } from 'lucide-react';
import { useCandidates } from '../context/CandidateContext';
import { useAuth } from '../context/AuthContext';

// Gemini-style Markdown Parser component
function RenderFormattedText({ text, isUser }) {
  if (!text) return null;

  if (isUser) {
    return <p className="whitespace-pre-line leading-relaxed text-xs sm:text-sm font-medium">{text}</p>;
  }

  const lines = text.split('\n');

  return (
    <div className="space-y-2 leading-relaxed text-xs sm:text-sm text-slate-100">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header ###
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-extrabold text-xs sm:text-base text-blue-300 mt-3 mb-1">
              {formatInlineBold(trimmed.replace('### ', ''))}
            </h4>
          );
        }

        // Bullet list item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.slice(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="text-cyan-400 font-bold">•</span>
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
              <span className="bg-blue-600 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
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
      return <strong key={i} className="font-extrabold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-blue-200">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export default function AiChatDrawer({ isOpen, onClose }) {
  const { candidates } = useCandidates();
  const { user } = useAuth();

  const userId = user?._id || user?.id || user?.email || 'guest';
  const storageKey = `ai_chat_history_${userId}`;
  const userFirstName = user?.firstName || (user?.name ? user.name.split(' ')[0] : 'Sathish');

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
      emoji = '🌆';
    } else {
      timeGreeting = 'Good Night';
      emoji = '🌙';
    }

    const name = currentUser?.firstName || (currentUser?.name ? currentUser.name.split(' ')[0] : 'Sathish');
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
  const [selectedModel, setSelectedModel] = useState('Flash 2.5');
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
    }, 900);
  };

  // Helper response generator
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

    // Default intelligent response
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      timestamp,
      text: `✨ **AI Insights & Recommendation:**\nI have analyzed your query ("*${query}*"). Here are key actionable recommendations for your recruitment workflow:\n\n1. **Automated Screening:** 8 candidate resumes match your core skill parameters.\n2. **Interview Slot Availability:** Next available slot is tomorrow at 2:00 PM.\n3. **Smart Notification:** Shortlisted candidates will receive automated updates via email.`
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
      
      {/* Dark Glass Overlay */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md pointer-events-auto transition-opacity animate-fade-in"
      />

      {/* Floating Gemini AI Window */}
      <div className="relative w-full max-w-3xl bg-slate-950/95 border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto h-[680px] max-h-[90vh] animate-slide-up-sm z-50 text-slate-100">
        
        {/* Gemini Top Header */}
        <div className="bg-slate-900/90 border-b border-slate-800/80 px-5 py-3.5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm tracking-wide text-white font-sans">Gemini AI Recruiter</h3>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  {selectedModel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearChat}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700 active:scale-95"
              title="Clear Chat History"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close AI Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gemini Central Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-200 scrollbar-thin">
          
          {/* Centered Gemini Welcome Header (Matching user's screenshot!) */}
          <div className="text-center py-6 sm:py-8 border-b border-slate-800/60 mb-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-100 font-sans tracking-tight">
              Hi, {userFirstName}. What's on your mind?
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-medium">
              Ask anything about candidate matching, pipeline metrics, or job description drafting.
            </p>
          </div>

          {/* Chat Stream */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-md mt-1 border border-white/20">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
              )}

              <div className="max-w-[85%] space-y-2">
                <div
                  className={`p-4 rounded-3xl shadow-sm transition-all ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-none'
                  }`}
                >
                  <RenderFormattedText text={msg.text} isUser={msg.sender === 'user'} />

                  {/* Render Candidates Data Cards if present */}
                  {msg.candidatesData && (
                    <div className="mt-3 space-y-2 border-t border-slate-800 pt-3">
                      {msg.candidatesData.map((cand, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3 hover:bg-slate-800 transition-colors">
                          <div>
                            <p className="font-bold text-white text-xs sm:text-sm">{cand.name || cand.firstName + ' ' + cand.lastName}</p>
                            <p className="text-xs text-slate-400 font-medium">{cand.role || cand.position || 'Frontend Developer'}</p>
                          </div>
                          <span className="bg-blue-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-xl shrink-0 shadow-xs">
                            {cand.score || 95}% Match
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className={`block text-[10px] mt-2.5 ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md mt-1 font-extrabold text-xs tracking-tight">
                  {userInitials}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-3xl rounded-tl-none text-slate-400 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-slate-300 font-medium ml-1">Gemini is processing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Gemini Bottom Search Bar Pill (Matching user's screenshot exactly!) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="w-full"
          >
            <div className="relative flex items-center justify-between rounded-full bg-slate-900/90 border border-slate-800 focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/30 px-4 py-2.5 shadow-2xl transition-all">
              
              {/* Left Side: + Icon & Input */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                  title="Add Attachment"
                >
                  <Plus className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Gemini"
                  className="w-full bg-transparent border-0 text-sm text-slate-100 placeholder:text-slate-400 font-sans font-medium focus:outline-none focus:ring-0"
                />
              </div>

              {/* Right Side: Flash Dropdown, Mic, Send */}
              <div className="flex items-center gap-2 shrink-0 pl-2">
                {/* Model Selector Pill */}
                <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 px-3 py-1 rounded-full border border-slate-700/60 cursor-pointer select-none">
                  <span>Flash</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Mic Icon */}
                <button
                  type="button"
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Voice Input"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 active:scale-95 shadow-md"
                  title="Send to Gemini"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </form>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mt-2 px-3">
            <span>Gemini AI may display inaccurate info, so double-check its responses.</span>
            <span>Press Enter to send</span>
          </div>
        </div>

      </div>

    </div>
  );
}
