import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../ThemeContext';

interface FaqPageProps {
  onBack: () => void;
  onContactSupport: () => void;
}

interface FaqItem {
  id: string;
  category: 'general' | 'privacy' | 'tools' | 'technical' | 'support';
  question: string;
  answer: React.ReactNode;
}

export function FaqPage({ onBack, onContactSupport }: FaqPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
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
    innerBg: 'bg-[#0a0a0c]/40',
    categoryTabInactive: 'bg-[#141414] text-gray-450 border-white/5 hover:text-gray-200 hover:border-white/10',
    cardAccordion: 'bg-[#141414]/90',
  } : {
    panelBg: 'bg-gray-100',
    border: 'border-gray-200',
    borderStrong: 'border-gray-200',
    text: 'text-gray-700',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-550',
    textMuted: 'text-gray-450',
    badgeBg: 'bg-gray-200',
    innerBg: 'bg-gray-50',
    categoryTabInactive: 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200 hover:text-gray-850',
    cardAccordion: 'bg-white',
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'general', name: 'General' },
    { id: 'privacy', name: 'Privacy & Security' },
    { id: 'tools', name: 'Tools & Features' },
    { id: 'technical', name: 'Technical' },
    { id: 'support', name: 'Support' }
  ];

  const faqs: FaqItem[] = [
    // General
    {
      id: 'gen-1',
      category: 'general',
      question: 'What is Rocket Web Tools?',
      answer: (
        <p>
          Rocket Web Tools is a comprehensive, professional-grade online browser-side utility suite featuring over 150+ web developer, marketer, content administrator, and designer tools. Absolutely all of the core tool utilities require no remote account or registration to operate, offering immediate functional assistance on-demand.
        </p>
      )
    },
    {
      id: 'gen-2',
      category: 'general',
      question: 'Is it free?',
      answer: (
        <p>
          Yes, Rocket Web Tools is and will remain completely free to use. Our infrastructure keeps operational costs clean through static hosting, and our light costs are offset by non-intrusively displayed Google AdSense media banners. We never lock features, compile premium tiers, or throttle performance.
        </p>
      )
    },
    {
      id: 'gen-3',
      category: 'general',
      question: 'Do I need an account?',
      answer: (
        <p>
          No, there is absolutely no system login, user profiling, or credentials database required. All personalization properties—such as starring/bookmarking your favorite utilities—are retained fully offline and stored directly within your local secure browser storage database (<code>localStorage</code>).
        </p>
      )
    },
    {
      id: 'gen-4',
      category: 'general',
      question: 'How many tools?',
      answer: (
        <p>
          There are currently over 150+ independent utility tools partitioned across 10 distinct high-performance categories. These cover everything from regular expression formulation, JSON parsing, UTM marketing validation, and canvas-based cryptographic encoders to text analytics suites.
        </p>
      )
    },
    // Privacy & Security
    {
      id: 'priv-1',
      category: 'privacy',
      question: 'Does it collect my data?',
      answer: (
        <p>
          No. All local tools (marked with the &apos;Local Browser&apos; badge) process your entries, payloads, text strings, and images purely on your device. For generative AI elements (such as regex generators), requests are piped securely over SSL/HTTPS to the official Google Gemini API gateways. No data is stored, cached, or sold.
        </p>
      )
    },
    {
      id: 'priv-2',
      category: 'privacy',
      question: 'Local vs API — which tools are which?',
      answer: (
        <div>
          <p>
            Our toolbox visibly separates local utilities from external cloud API gateways using convenient colored badge tags:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="flex items-center gap-2 p-2.5 px-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Local Browser (100% Client-Side execution, zero uploads)</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 px-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Secure API (Encrypted pipeline to external AI gateways)</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'priv-3',
      category: 'privacy',
      question: 'Are uploaded files stored?',
      answer: (
        <p>
          Never. For tools handling image files, vector SVGs, subtitles, or document payloads (like the Precision Image Cropper or SVG Optimizer), processing is completed using client-side JavaScript APIs (HTML5 Canvas, FileReader, or SVG nodes). Your files remain private and never leave your web browser.
        </p>
      )
    },
    {
      id: 'priv-4',
      category: 'privacy',
      question: 'Cookies/tracking?',
      answer: (
        <p>
          We utilize standard Google AdSense cookies to run optimized marketing campaigns, simple server logs for system diagnostic tracking, and standard browser <code>localStorage</code> to preserve your list of starred tools. We do not integrate data brokers, monitor tracking lists, or monetize private metrics.
        </p>
      )
    },
    // Tools & Features
    {
      id: 'tools-1',
      category: 'tools',
      question: 'Can I use tools offline?',
      answer: (
        <p>
          Yes! Since all utilities tagged with the &apos;Local Browser&apos; badge run entirely client-side, they will operate flawlessly offline without an active internet connection. Merely download or keep the application open. Secure API modules require an active internet gateway.
        </p>
      )
    },
    {
      id: 'tools-2',
      category: 'tools',
      question: 'How to save/bookmark a tool?',
      answer: (
        <p>
          You can easily bookmark any utility tool by clicking the Star icon located on the top-right corner of each tool card, which places it on your dashboard sidebar. Alternatively, you can copy the specific direct address URL (e.g. <code>?tool=id</code>) to your browser favorites to launch it directly.
        </p>
      )
    },
    {
      id: 'tools-3',
      category: 'tools',
      question: 'How do AI tools work?',
      answer: (
        <p>
          The AI smart modules are powered by Google Gemini, processing your structural natural language commands with modern deep-learning engines. We currently offer 6 AI-powered assistants, including: AI SQL Query Formulator, AI Regex Architect, and AI Code Annotator.
        </p>
      )
    },
    {
      id: 'tools-4',
      category: 'tools',
      question: 'Are financial calculators accurate?',
      answer: (
        <div className="space-y-2">
          <p>
            All dynamic calculations, currency evaluations, interest metrics, and conversion numbers are evaluated on a best-effort basis. These outputs are intended purely for general estimates.
          </p>
          <div className="p-3 bg-amber-500/5 border border-amber-500/25 rounded-lg text-amber-400 text-xs font-mono flex items-start gap-2">
            <Icons.AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>We strongly advise verifying any output values with certified authorities before making binding financial decisions.</span>
          </div>
        </div>
      )
    },
    {
      id: 'tools-5',
      category: 'tools',
      question: 'Can I use outputs commercially?',
      answer: (
        <p>
          Yes! All outputs generated by Rocket Web Tools—including cleaned codes, cropped graphics, compressed SVGs, generated passwords, and structured databases—can be utilized commercially and published under unrestricted terms completely free of charge.
        </p>
      )
    },
    // Technical
    {
      id: 'tech-1',
      category: 'technical',
      question: 'Which browsers?',
      answer: (
        <p>
          Rocket Web Tools is engineered for speed and leverages modern web specifications. It is fully supported on Chrome 90+, Firefox 88+, Microsoft Edge 90+, Safari 14+, and Brave. Deprecated browsers like Internet Explorer are not supported.
        </p>
      )
    },
    {
      id: 'tech-2',
      category: 'technical',
      question: 'Is there an API or CLI?',
      answer: (
        <p>
          We do not offer a unified programmatic developer API or secondary terminal command-line tool (CLI) as our primary goal is browser-based interactive design. However, we may expand into lightweight CLI packages in future releases.
        </p>
      )
    },
    {
      id: 'tech-3',
      category: 'technical',
      question: 'Why workers.dev domain?',
      answer: (
        <p>
          Our staging, preview, and testing environments use secure Cloudflare <code>workers.dev</code> URLs to guarantee extremely rapid cold starts and global edge caching latency properties. Our stable production releases operate on the primary <code>rocketwebtools.com</code> custom domain.
        </p>
      )
    },
    // Support
    {
      id: 'supp-1',
      category: 'support',
      question: 'Tool not working?',
      answer: (
        <p>
          Most local anomalies are resolved with a hard page refresh (Ctrl+F5 or Cmd+Shift+R). If problems persist, consider disabling aggressive corporate browser extensions or adblock filtering lists, or test the utility inside an alternate web browser before sending a support log.
        </p>
      )
    },
    {
      id: 'supp-2',
      category: 'support',
      question: 'Can I request a new tool?',
      answer: (
        <p>
          Absolutely! We constantly enrich our categories with innovative submissions. You can submit feature proposals or suggest specific custom calculations via our Contact Form by selecting the designated &quot;Feature Request&quot; dropdown classification.
        </p>
      )
    },
    {
      id: 'supp-3',
      category: 'support',
      question: 'How to report a bug or security issue?',
      answer: (
        <p>
          For general visual bugs, submit details using our automated Contact Form. For serious system vulnerabilities or security-related matters, please practice responsible disclosure of information and notify our core engineering team directly by sending an email to our support line.
        </p>
      )
    }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto" id="faq-page-view">
      {/* Header Breadcrumbs */}
      <div className={`flex items-center justify-between border-b ${t.border} pb-4`}>
        <button
          type="button"
          onClick={onBack}
          className={`flex items-center gap-2 text-xs font-semibold p-2 px-4 ${t.panelBg} border ${t.borderStrong} hover:border-orange-500/40 rounded-full ${t.text} hover:${t.textPrimary} transition-all cursor-pointer`}
        >
          <Icons.ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Toolbox</span>
        </button>
        <span className={`text-[10px] font-mono ${t.textMuted} uppercase tracking-widest ${t.badgeBg} px-2.5 py-1 rounded`}>
          Help Center
        </span>
      </div>

      {/* Page Title Header */}
      <div className="space-y-2">
        <h1 className={`text-3xl font-black ${t.textPrimary} tracking-tight flex items-center gap-2.5 select-none`}>
          <Icons.HelpCircle className="w-8 h-8 text-orange-500" />
          Frequently Asked Questions
        </h1>
        <p className={`text-xs ${t.textMuted} font-mono`}>
          {faqs.length} questions &bull; Updated June 2026
        </p>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenFaqId(null);
              }}
              className={`p-2 px-4 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                isActive
                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-md shadow-orange-500/5'
                  : t.categoryTabInactive
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openFaqId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl transition-all duration-200 border ${t.cardAccordion} overflow-hidden ${
                isOpen
                  ? 'border-orange-500/25 shadow-lg shadow-orange-500/[0.02]'
                  : `${t.border} hover:border-orange-500/25`
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <span className={`text-sm font-bold tracking-tight transition-colors ${isOpen ? 'text-orange-400' : t.textPrimary}`}>
                  {faq.question}
                </span>
                <Icons.ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'transform rotate-180 text-orange-400' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <div className={`px-5 pb-5 text-xs sm:text-sm ${t.text} leading-relaxed font-sans border-t ${t.border} pt-4 ${t.innerBg}`}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Support CTA Footer */}
      <div className={`p-6 ${t.panelBg} border ${t.border} rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left`}>
        <div>
          <h2 className={`text-sm font-bold ${t.textPrimary} tracking-tight`}>Still have a question?</h2>
          <p className={`text-xs ${t.textMuted} mt-1`}>If you didn&apos;t find an answer here, please get in touch with our team.</p>
        </div>
        <button
          onClick={onContactSupport}
          className="flex items-center gap-2 p-2.5 px-5 bg-orange-500 hover:bg-orange-600 border border-orange-500/20 text-white font-semibold rounded-full text-xs transition-colors shadow-lg active:scale-[0.98] cursor-pointer"
        >
          <Icons.Mail className="w-4 h-4" />
          <span>Contact Support</span>
        </button>
      </div>
    </div>
  );
}
