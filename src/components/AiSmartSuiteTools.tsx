import React, { useState } from 'react';
import { Sparkles, Copy, Check, FileText, Languages, RefreshCw, AlertCircle } from 'lucide-react';

interface AiSmartSuiteToolsProps {
  activeToolId: string;
}

export function AiSmartSuiteTools({ activeToolId }: AiSmartSuiteToolsProps) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(id);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  if (activeToolId === 'ai-social-caption') {
    return <AiSocialCaption onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'ai-email-drafter') {
    return <AiEmailDrafter onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'ai-code-translator') {
    return <AiCodeTranslator onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }

  return null;
}

// ==========================================
// 1. AI SOCIAL MEDIA CAPTION WRITER
// ==========================================
function AiSocialCaption({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const [prompt, setPrompt] = useState('New modern features including a visual color palette generator and real-time DNS validator tools released this summer!');
  const [platform, setPlatform] = useState('Instagram');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setOutput('');

    fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'social_caption', text: prompt.trim(), option: platform }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('AI Engine failed or Gemini API Key has not been configured in Secrets block.');
        return res.json();
      })
      .then((data) => {
        setOutput(data.output);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error occurred during generation.');
        setLoading(false);
      });
  };

  return (
    <div className="space-y-6" id="ai-social-caption-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1 px-2 text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">AI</span>
            AI Social Media Caption Copywriter
          </h2>
          <p className="text-sm text-gray-400">Generate high-conversion captions, clever hooks, and optimized trending hashtags with Gemini.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs font-mono text-gray-400">PLATFORM STYLE:</label>
          <select 
            value={platform} 
            onChange={(e) => setPlatform(e.target.value)}
            className="p-1.5 px-3 border border-white/10 rounded-lg text-xs bg-[#161616] text-white focus:ring-1 focus:ring-purple-500 focus:outline-none font-medium cursor-pointer"
          >
            <option value="Instagram">Instagram (Energetic & Visual)</option>
            <option value="LinkedIn">LinkedIn (Professional & Informative)</option>
            <option value="Threads / X">Threads / X (Concise & Viral Hook)</option>
            <option value="TikTok">TikTok (Casual & Engaging)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="text-xs font-mono text-gray-400 mb-1.5 block">POST THEME OR ANNOUNCEMENT TOPIC:</label>
          <textarea
            className="w-full h-64 p-4 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-[#161616] text-white placeholder-gray-650 leading-relaxed"
            placeholder="Introduce what you are marketing or announcing in broad terms..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="mt-4 w-full p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'AI Content Writer is composing...' : 'Generate Engagement Copy'}
          </button>
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-gray-400">OPTIMIZED CAPTION RESULTS:</span>
            {output && (
              <button 
                type="button"
                onClick={() => onCopy(output, 'soc-capt')}
                className="text-xs hover:text-purple-400 inline-flex items-center gap-1 text-gray-400 cursor-pointer"
              >
                {copiedStatus === 'soc-capt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'soc-capt' ? 'Copied Post Content' : 'Copy Caption'}
              </button>
            )}
          </div>
          
          <div className="relative flex-1 min-h-[264px]">
            {error ? (
              <div className="absolute inset-0 p-4 border border-rose-950 bg-rose-950/20 rounded-lg flex flex-col justify-center items-center text-center">
                <AlertCircle className="w-6 h-6 text-rose-500 mb-1" />
                <p className="text-xs text-rose-400 max-w-sm font-semibold">{error}</p>
                <span className="text-[10px] text-gray-500 mt-2">Check GEMINI_API_KEY parameters in Settings &gt; Secrets.</span>
              </div>
            ) : output ? (
              <div className="absolute inset-0 p-4 border border-white/10 bg-[#161616] overflow-auto rounded-lg text-sm text-purple-300 leading-relaxed whitespace-pre-wrap select-all font-sans">
                {output}
              </div>
            ) : (
              <div className="absolute inset-0 border border-dashed border-white/10 rounded-lg flex flex-col justify-center items-center text-center bg-white/2 text-gray-500 p-4 text-xs font-medium">
                {loading ? 'Consulting Gemini Text Engine...' : 'Click the Purpled button to draft an exciting social post instantly.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. AI EMAIL DRAFTER
// ==========================================
function AiEmailDrafter({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const [draftNotes, setDraftNotes] = useState('- Apologize to client Sarah for the 1-day delay on vector files delivery.\n- Explain that optimization checks took longer to ensure 100% responsiveness.\n- Attach new links and request follow-up feedback.');
  const [tone, setTone] = useState('Professional');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!draftNotes.trim()) return;
    setLoading(true);
    setError(null);
    setOutput('');

    fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'email_drafter', text: draftNotes.trim(), option: tone }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('AI Email architect failed. Check endpoint parameters or key status.');
        return res.json();
      })
      .then((data) => {
        setOutput(data.output);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error occurred generation email draft.');
        setLoading(false);
      });
  };

  return (
    <div className="space-y-6" id="ai-email-drafter-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1 px-2 text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">AI</span>
            AI Smart Email Drafter Assistant
          </h2>
          <p className="text-sm text-gray-400">Convert messy bullet points and short descriptions into perfectly written professional correspondence.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs font-mono text-gray-400">CORRESPONDENCE STYLE:</label>
          <select 
            value={tone} 
            onChange={(e) => setTone(e.target.value)}
            className="p-1.5 px-3 border border-white/10 rounded-lg text-xs bg-[#161616] text-white focus:ring-1 focus:ring-purple-500 focus:outline-none font-medium cursor-pointer"
          >
            <option value="Professional">Professional (Formal & Polite)</option>
            <option value="Apologetic">Apologetic (Sincere & Solution-facing)</option>
            <option value="Persuasive">Persuasive (Energetic & Click-focused)</option>
            <option value="Friendly">Friendly (Warm & Casual)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="text-xs font-mono text-gray-400 mb-1.5 block">INFORMAL BULLETS / CORE REQUIREMENTS:</label>
          <textarea
            className="w-full h-64 p-4 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-[#161616] text-white placeholder-gray-600 leading-relaxed font-mono"
            placeholder="Type who you are writing to, core facts, and targeted outcome..."
            value={draftNotes}
            onChange={(e) => setDraftNotes(e.target.value)}
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !draftNotes.trim()}
            className="mt-4 w-full p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {loading ? 'AI Drafter is writing draft...' : 'Compose Email Draft'}
          </button>
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-gray-400">COMPLETED EMAIL DRAFT:</span>
            {output && (
              <button 
                type="button"
                onClick={() => onCopy(output, 'email-doc')}
                className="text-xs hover:text-purple-400 inline-flex items-center gap-1 text-gray-400 cursor-pointer"
              >
                {copiedStatus === 'email-doc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'email-doc' ? 'Copied Email Draft' : 'Copy Correspondence'}
              </button>
            )}
          </div>
          
          <div className="relative flex-1 min-h-[264px]">
            {error ? (
              <div className="absolute inset-0 p-4 border border-rose-950 bg-rose-950/20 rounded-lg flex flex-col justify-center items-center text-center">
                <AlertCircle className="w-6 h-6 text-rose-500 mb-1" />
                <p className="text-xs text-rose-400 max-w-sm font-semibold">{error}</p>
              </div>
            ) : output ? (
              <div className="absolute inset-0 p-4 border border-white/10 bg-[#161616] overflow-auto rounded-lg text-sm text-gray-200 leading-relaxed whitespace-pre-wrap select-all font-sans">
                {output}
              </div>
            ) : (
              <div className="absolute inset-0 border border-dashed border-white/10 rounded-lg flex flex-col justify-center items-center text-center bg-white/2 text-gray-500 p-4 text-xs font-medium">
                {loading ? 'Drafting clean proposal with Gemini...' : 'Write notes and press the Golden button to outline formal drafts instantly.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. AI CODE TRANSLATOR
// ==========================================
function AiCodeTranslator({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const [sourceCode, setSourceCode] = useState('def calculate_factorial(n):\n    if n == 0 or n == 1:\n        return 1\n    else:\n        return n * calculate_factorial(n - 1)\n\n# Test the function\nprint(calculate_factorial(5)) # Outputs 120');
  const [targetLang, setTargetLang] = useState('TypeScript');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!sourceCode.trim()) return;
    setLoading(true);
    setError(null);
    setOutput('');

    fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'code_translator', text: sourceCode.trim(), option: targetLang }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Polyglot translation failed inside the Gemini API module.');
        return res.json();
      })
      .then((data) => {
        setOutput(data.output);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error occurred during translation.');
        setLoading(false);
      });
  };

  return (
    <div className="space-y-6" id="ai-code-translator-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1 px-2 text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">AI</span>
            AI Polyglot Code Translator
          </h2>
          <p className="text-sm text-gray-400">Translate software functions or classes cleanly between languages (e.g., Python to TypeScript, C++ to Go) maintaining logic accuracy.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs font-mono text-gray-400">TARGET PROGRAMMING LANG:</label>
          <select 
            value={targetLang} 
            onChange={(e) => setTargetLang(e.target.value)}
            className="p-1.5 px-3 border border-white/10 rounded-lg text-xs bg-[#161616] text-white focus:ring-1 focus:ring-purple-500 focus:outline-none font-medium cursor-pointer"
          >
            <option value="TypeScript">TypeScript (Modern Node/Browser-safe)</option>
            <option value="JavaScript (ES6)">JavaScript (Pure standard ES6)</option>
            <option value="Python 3">Python 3 (Typed & clean PEP-8)</option>
            <option value="Go">Go (Strict channels & structures)</option>
            <option value="Rust">Rust (Static memory constraints)</option>
            <option value="C++">C++ (Pointers & modern bindings)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="text-xs font-mono text-gray-400 mb-1.5 block">SOURCE CODE TO TRANSLATE:</label>
          <textarea
            className="w-full h-64 p-4 border border-white/10 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 bg-[#161616] text-emerald-400 placeholder-gray-600 leading-relaxed font-mono"
            placeholder="Paste your source functions..."
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !sourceCode.trim()}
            className="mt-4 w-full p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
            {loading ? 'AI Code Translation active...' : 'Convert Code Structure'}
          </button>
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-gray-400">TRANSLATED PROGRAM BLOCK:</span>
            {output && (
              <button 
                type="button"
                onClick={() => onCopy(output, 'tran-code')}
                className="text-xs hover:text-purple-400 inline-flex items-center gap-1 text-gray-400 cursor-pointer animate-fade-in"
              >
                {copiedStatus === 'tran-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'tran-code' ? 'Copied Snippet' : 'Copy Code'}
              </button>
            )}
          </div>
          
          <div className="relative flex-1 min-h-[264px]">
            {error ? (
              <div className="absolute inset-0 p-4 border border-rose-950 bg-rose-950/20 rounded-lg flex flex-col justify-center items-center text-center">
                <AlertCircle className="w-6 h-6 text-rose-500 mb-1" />
                <p className="text-xs text-rose-400 max-w-sm font-semibold">{error}</p>
              </div>
            ) : output ? (
              <div className="absolute inset-0 p-4 border border-white/10 bg-[#161616] overflow-auto rounded-lg text-xs text-indigo-300 leading-relaxed select-all font-mono">
                {output}
              </div>
            ) : (
              <div className="absolute inset-0 border border-dashed border-white/10 rounded-lg flex flex-col justify-center items-center text-center bg-white/2 text-gray-500 p-4 text-xs font-medium">
                {loading ? 'Consulting Gemini Polyglot Engine...' : 'Select your target language and click the Purpled button to translate.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
