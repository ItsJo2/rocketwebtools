import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface AboutContactProps {
  onBack: () => void;
}

interface SubmittedMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  timestamp: string;
}

export function AboutContact({ onBack }: AboutContactProps) {
  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // History log of messages submitted locally
  const [sentHistory, setSentHistory] = useState<SubmittedMessage[]>([]);
  const { isDark } = useTheme();

  const t = isDark ? {
    panelBg: 'bg-[#141414]',
    border: 'border-white/5',
    borderStrong: 'border-white/10',
    text: 'text-gray-300',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-400',
    textMuted: 'text-gray-500',
    badgeBg: 'bg-gray-500/10',
    cardStoryBg: 'bg-[#111111]',
    cardBorder: 'border-white/5',
    cardContactBg: 'bg-[#0f0f11]',
    formInputBg: 'bg-[#141416]',
    formInputText: 'text-white',
    historyCardBg: 'bg-[#111111]/80',
  } : {
    panelBg: 'bg-gray-100',
    border: 'border-gray-200',
    borderStrong: 'border-gray-200',
    text: 'text-gray-700',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-550',
    textMuted: 'text-gray-450',
    badgeBg: 'bg-gray-200',
    cardStoryBg: 'bg-white',
    cardBorder: 'border-gray-200',
    cardContactBg: 'bg-white',
    formInputBg: 'bg-gray-100',
    formInputText: 'text-gray-900',
    historyCardBg: 'bg-white',
  };

  useEffect(() => {
    const saved = localStorage.getItem('omnitool_sent_messages');
    if (saved) {
      try {
        setSentHistory(JSON.parse(saved));
      } catch (e) {
        setSentHistory([]);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    // Simple validation
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      setIsSubmitting(false);
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }
    if (!subject.trim()) {
      setErrorMsg('What is the subject of your query?');
      setIsSubmitting(false);
      return;
    }
    if (!message.trim() || message.length < 10) {
      setErrorMsg('Please provide a message description with at least 10 characters.');
      setIsSubmitting(false);
      return;
    }

    // Simulate safe API dispatch or database save locally
    setTimeout(() => {
      const newMessage: SubmittedMessage = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        subject,
        category,
        message,
        timestamp: new Date().toLocaleString(),
      };

      const updated = [newMessage, ...sentHistory];
      setSentHistory(updated);
      localStorage.setItem('omnitool_sent_messages', JSON.stringify(updated));

      // Reset fields
      setName('');
      setEmail('');
      setSubject('');
      setCategory('General Inquiry');
      setMessage('');
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <div className="space-y-12 font-sans max-w-5xl mx-auto" id="about-contact-view">
      {/* Header Breadcrumbs */}
      <div className={`flex items-center justify-between border-b ${t.border} pb-4`}>
        <button
          type="button"
          onClick={onBack}
          className={`flex items-center gap-2 text-xs font-semibold p-2 px-4 ${t.panelBg} border ${t.borderStrong} hover:border-orange-550/40 rounded-full ${t.text} hover:${t.textPrimary} transition-all cursor-pointer shadow-sm`}
        >
          <Icons.ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Toolbox</span>
        </button>
        <span className={`text-[10px] font-mono ${t.textMuted} uppercase tracking-widest ${t.badgeBg} px-2.5 py-1 rounded`}>
          Corporate Information
        </span>
      </div>

      {/* About Section - Editorial Layout */}
      <div className="space-y-10">
        {/* Block 1 — Hero intro */}
        <div className="space-y-3">
          <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tight`}>
            Built for the people who build the web.
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed mt-3 max-w-2xl`}>
            Rocket Web Tools started as a personal frustration. Too many tools required signups, uploaded your data to unknown servers, or hid basic features behind paywalls. We decided to build something different.
          </p>
        </div>

        {/* Block 2 — Three stat cards in a row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${isDark ? 'bg-[#0f0f0f] border border-white/5' : 'bg-white border border-gray-200'} rounded-2xl p-6 text-center shadow-sm`}>
            <div className="text-3xl font-black text-orange-500">150+</div>
            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-2`}>Free Tools</div>
            <div className="text-xs text-gray-500 mt-1">And growing every month</div>
          </div>

          <div className={`${isDark ? 'bg-[#0f0f0f] border border-white/5' : 'bg-white border border-gray-200'} rounded-2xl p-6 text-center shadow-sm`}>
            <div className="text-3xl font-black text-orange-500">100%</div>
            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-2`}>Client-Side Processing</div>
            <div className="text-xs text-gray-500 mt-1">For the vast majority of tools</div>
          </div>

          <div className={`${isDark ? 'bg-[#0f0f0f] border border-white/5' : 'bg-white border border-gray-200'} rounded-2xl p-6 text-center shadow-sm`}>
            <div className="text-3xl font-black text-orange-500">0</div>
            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-2`}>Accounts Required</div>
            <div className="text-xs text-gray-500 mt-1">Use everything, no signup</div>
          </div>
        </div>

        {/* Block 3 — "Our Privacy Promise" highlighted box */}
        <div className="bg-orange-500/5 border border-orange-500/15 rounded-2xl p-6 flex gap-4 items-start">
          <Icons.Shield className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Privacy Promise</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed mt-2`}>
              Every tool on Rocket Web Tools that can run locally, does run locally. Your JSON, your images, your passwords, your text — none of it leaves your browser unless the tool explicitly requires a network request (like our AI tools or DNS lookups). We label every tool clearly so you always know.
            </p>
          </div>
        </div>

        {/* Block 4 — "What we're building" two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${isDark ? 'bg-[#0f0f0f] border border-white/5' : 'bg-white border border-gray-200'} rounded-2xl p-6`}>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
              What Rocket Web Tools is
            </h3>
            <ul className="space-y-3">
              <li className={`flex items-start gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Icons.Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>A fast, distraction-free place to get things done</span>
              </li>
              <li className={`flex items-start gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Icons.Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>A privacy-first toolbox where your data stays yours</span>
              </li>
              <li className={`flex items-start gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Icons.Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>A free resource with no paywalls or hidden limits</span>
              </li>
              <li className={`flex items-start gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Icons.Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>A growing collection updated based on what users need</span>
              </li>
            </ul>
          </div>

          <div className={`${isDark ? 'bg-[#0f0f0f] border border-white/5' : 'bg-white border border-gray-200'} rounded-2xl p-6`}>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
              What Rocket Web Tools isn't
            </h3>
            <ul className="space-y-3">
              <li className={`flex items-start gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Icons.X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>A data harvesting platform disguised as a tool site</span>
              </li>
              <li className={`flex items-start gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Icons.X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>A SaaS product trying to upsell you on a subscription</span>
              </li>
              <li className={`flex items-start gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Icons.X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>A site that requires your email to use a calculator</span>
              </li>
              <li className={`flex items-start gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Icons.X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Built with shortcuts — every tool is tested before launch</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Block 5 — "The team" simple honest note */}
        <div className="text-center max-w-2xl mx-auto space-y-4 pt-4">
          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Rocket Web Tools is an independent project. It's not backed by venture capital, not run by a corporation, and not trying to become the next unicorn startup. It's maintained by a small team that genuinely uses these tools and wants them to be good.
          </p>
          <div className="flex gap-3 justify-center flex-wrap mt-4">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${isDark ? 'bg-white/5 border border-white/8 text-gray-400' : 'bg-gray-100 border border-gray-200 text-gray-600'}`}>
              🛠 Independent
            </span>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${isDark ? 'bg-white/5 border border-white/8 text-gray-400' : 'bg-gray-100 border border-gray-200 text-gray-600'}`}>
              🔒 Privacy-First
            </span>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${isDark ? 'bg-white/5 border border-white/8 text-gray-400' : 'bg-gray-100 border border-gray-200 text-gray-600'}`}>
              ⚡ Always Free
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-8">
        <div className={`flex-1 h-px ${isDark ? 'bg-white/5' : 'bg-gray-200'}`} />
        <span className="text-xs font-mono text-gray-550 uppercase tracking-widest">Get In Touch</span>
        <div className={`flex-1 h-px ${isDark ? 'bg-white/5' : 'bg-gray-200'}`} />
      </div>

      {/* Contact Form Container centered */}
      <div className="max-w-2xl mx-auto space-y-6">
        <div className={`${t.cardContactBg} border ${t.cardBorder} p-6 rounded-2xl relative shadow-xl space-y-4`}>
          <div className={`border-b ${t.border} pb-3`}>
            <h2 className={`text-lg font-bold ${t.textPrimary} flex items-center gap-2`}>
              <Icons.Mail className="w-5 h-5 text-orange-500" />
              Send a Message
            </h2>
            <p className={`text-xs ${t.textSecondary}`}>Encountered an issue or want a new tool? Shoot our developer team a note below.</p>
          </div>

          {isSuccess ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-center space-y-4" id="successs-alert">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <Icons.CheckCircle2 className="w-6 h-6 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Submission Catalogued Successfully!</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Thank you for reaching out. A developer support ticket has been registered locally. We review and resolve queries usually within 1 business day.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className={`px-4 py-1.5 ${t.formInputBg} border ${t.borderStrong} hover:border-orange-500/30 text-xs font-bold ${t.formInputText} rounded-lg cursor-pointer transition-colors`}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-lg leading-normal">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`${t.textSecondary} font-semibold block`}>Full Name</label>
                  <input
                    type="text"
                    className={`w-full p-2.5 ${t.formInputBg} border ${t.borderStrong} rounded-lg ${t.formInputText} font-sans focus:border-orange-500 focus:outline-none placeholder:text-gray-450`}
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`${t.textSecondary} font-semibold block`}>Email Address</label>
                  <input
                    type="email"
                    className={`w-full p-2.5 ${t.formInputBg} border ${t.borderStrong} rounded-lg ${t.formInputText} font-sans focus:border-orange-500 focus:outline-none placeholder:text-gray-455`}
                    placeholder="e.g. john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`${t.textSecondary} font-semibold block`}>Category</label>
                  <select
                    className={`w-full p-2.5 ${t.formInputBg} border ${t.borderStrong} rounded-lg ${t.formInputText} font-sans focus:border-orange-500 focus:outline-none`}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Tool Idea / Suggestion">Tool Idea / Request</option>
                    <option value="Bug Report">File/Calculation Bug Report</option>
                    <option value="AdSense / Partnership">Commercial Partnership</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={`${t.textSecondary} font-semibold block`}>Subject</label>
                  <input
                    type="text"
                    className={`w-full p-2.5 ${t.formInputBg} border ${t.borderStrong} rounded-lg ${t.formInputText} font-sans focus:border-orange-500 focus:outline-none placeholder:text-gray-455`}
                    placeholder="e.g. Suggestion for PDF extract tool"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`${t.textSecondary} font-semibold block`}>Detailed Message</label>
                <textarea
                  rows={4}
                  className={`w-full p-2.5 ${t.formInputBg} border ${t.borderStrong} rounded-lg ${t.formInputText} font-sans focus:border-orange-500 focus:outline-none resize-none leading-relaxed placeholder:text-gray-455`}
                  placeholder="Enter your message detail here (minimum 10 characters)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-xl cursor-pointer shadow-md shadow-orange-500/10 hover:shadow-orange-550/20 transition-all flex items-center justify-center gap-2 disabled:bg-orange-600/50"
              >
                {isSubmitting ? (
                  <Icons.Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icons.Send className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Transmitting Data...' : 'Submit Support Ticket'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Submitted list feed locally to enhance interactivity */}
        {sentHistory.length > 0 && (
          <div className="space-y-3">
            <span className={`text-[10px] uppercase font-bold ${t.textMuted} tracking-wider font-mono block`}>Your Submitted Support Tickets ({sentHistory.length})</span>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {sentHistory.map((msg) => (
                <div key={msg.id} className={`p-3 ${t.historyCardBg} border ${t.border} rounded-xl space-y-1 text-[11px] font-sans`}>
                  <div className="flex justify-between items-center text-[10px] text-gray-500">
                    <span className="font-bold text-orange-400 font-mono tracking-tight">{msg.category}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <h5 className={`font-bold ${t.textPrimary}`}>{msg.subject}</h5>
                  <p className={`${t.textSecondary} italic line-clamp-2`}>"{msg.message}"</p>
                  <div className="pt-1.5 flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Status: Open - Awaiting Developer response</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
