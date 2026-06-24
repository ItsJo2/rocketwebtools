import { useState } from 'react';
import { Sparkles, Copy, Check, Terminal, Languages, FileCode, Wand2, RefreshCw } from 'lucide-react';

export function AiTools({ activeToolId }: { activeToolId: string }) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(id);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  if (activeToolId === 'ai-rephrase') {
    return <AiRephrase onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'ai-regex') {
    return <AiRegex onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'ai-code') {
    return <AiCodeAnnotator onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }

  return null;
}

// 1. AI REPHRASE & TRANSLATOR
function AiRephrase({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('professional');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setOutput('');

    fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'rephrase', text: text.trim(), option: style }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('API processing failed or Gemini API Key has not been linked in secrets.');
        return res.json();
      })
      .then((data) => {
        setOutput(data.output);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error occurred generating response.');
        setLoading(false);
      });
  };

  return (
    <div className="space-y-6" id="ai-rephrase-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1 px-2 text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">AI</span>
            AI Style Rephraser & Translator
          </h2>
          <p className="text-sm text-gray-400">Rewrite paragraphs or translate code notes to custom language/stylistic voices.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs font-mono text-gray-400">TARGET VOICE / LANG:</label>
          <select 
            value={style} 
            onChange={(e) => setStyle(e.target.value)}
            className="p-1.5 px-3 border border-white/10 rounded-lg text-xs bg-[#161616] text-white focus:ring-1 focus:ring-amber-500 focus:outline-none font-medium cursor-pointer"
          >
            <option value="professional">Professional English</option>
            <option value="casual English">Casual & Friendly English</option>
            <option value="very concise summary">Concise summary</option>
            <option value="Spanish translation">Spanish (Español)</option>
            <option value="French translation">French (Français)</option>
            <option value="German translation">German (Deutsch)</option>
            <option value="Japanese translation">Japanese (日本語)</option>
            <option value="Chinese translation">Chinese (中文)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Input */}
        <div>
          <label className="text-xs font-mono text-gray-400 mb-1.5 block">INPUT STRING:</label>
          <textarea
            className="w-full h-64 p-4 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-[#161616] text-white placeholder-gray-600 leading-relaxed"
            placeholder="Paste your source contents or messy draft text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !text.trim()}
            className="mt-4 w-full p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'AI is composing text...' : 'Generate New Voice'}
          </button>
        </div>

        {/* Right Output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-gray-400">REPHRASED OUTPUT:</span>
            {output && (
              <button 
                type="button"
                onClick={() => onCopy(output, 'rep-out')}
                className="text-xs hover:text-amber-400 inline-flex items-center gap-1 text-gray-400 cursor-pointer"
              >
                {copiedStatus === 'rep-out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'rep-out' ? 'Copied' : 'Copy Result'}
              </button>
            )}
          </div>
          
          <div className="relative flex-1 min-h-[264px]">
            {error ? (
              <div className="absolute inset-0 p-4 border border-rose-950 bg-rose-950/20 rounded-lg flex flex-col justify-center items-center text-center">
                <p className="text-xs text-rose-400 max-w-sm font-semibold">{error}</p>
                <span className="text-[10px] text-gray-500 mt-2">Please ensure the GEMINI_API_KEY is configured under Settings &gt; Secrets.</span>
              </div>
            ) : output ? (
              <div className="absolute inset-0 p-4 border border-white/10 bg-[#161616] overflow-auto rounded-lg text-sm text-emerald-400 leading-relaxed whitespace-pre-wrap select-all">
                {output}
              </div>
            ) : (
              <div className="absolute inset-0 border border-dashed border-white/10 rounded-lg flex flex-col justify-center items-center text-center bg-white/2 text-gray-500 p-4 text-xs font-medium">
                {loading ? 'Consulting Gemini AI text model...' : 'Press the Golden button to rewrite your content instantly using AI.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. AI REGEX MAKER & EXPLAINER
function AiRegex({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const [input, setInput] = useState('');
  const [option, setOption] = useState<'build' | 'explain'>('build');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setOutput('');

    fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'regex', text: input.trim(), option }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('API failure or missing Gemini AI Secret credentials.');
        return res.json();
      })
      .then((data) => {
        setOutput(data.output);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error formulating regular expression pattern.');
        setLoading(false);
      });
  };

  return (
    <div className="space-y-6" id="ai-regex-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1 px-2 text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">AI</span>
            AI Regex Generator & Explainer
          </h2>
          <p className="text-sm text-gray-400">Build high performance match patterns from natural descriptions, or deconstruct obscure regexes.</p>
        </div>
        <div className="bg-white/5 p-1 rounded-lg flex text-xs font-medium border border-white/10">
          <button 
            type="button"
            className={`p-1.5 px-3 rounded-md transition-all cursor-pointer font-bold ${option === 'build' ? 'bg-amber-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            onClick={() => { setOption('build'); setOutput(''); setInput(''); }}
          >
            Build Regex
          </button>
          <button 
            type="button"
            className={`p-1.5 px-3 rounded-md transition-all cursor-pointer font-bold ${option === 'explain' ? 'bg-amber-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            onClick={() => { setOption('explain'); setOutput(''); setInput(''); }}
          >
            Explain Chain
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="text-xs font-mono text-gray-400 mb-1.5 block">
            {option === 'build' ? 'PATTERN DESCRIPTION:' : 'PASTE PATTERN STRING:'}
          </label>
          <textarea
            className="w-full h-48 p-4 border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-[#161616] text-white placeholder-gray-650"
            placeholder={
              option === 'build' 
                ? 'e.g. A strong password containing at least 1 uppercase letter, 1 number, and 1 non-alphanumeric token.'
                : 'e.g. /^(?=.*[A-Z])(?=.*\\d)(?=.*\\W).{8,}$/gm'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="button"
            className="mt-4 w-full p-2.5 bg-amber-600 font-semibold text-white hover:bg-amber-700 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            disabled={loading || !input.trim()}
            onClick={handleRun}
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {loading ? 'Consulting Gemini...' : (option === 'build' ? 'Construct Regex Pattern' : 'Deconstruct Regex')}
          </button>
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-gray-400">AI COMPILED ANALYSIS:</span>
            {output && (
              <button 
                type="button"
                onClick={() => onCopy(output, 'reg-out')}
                className="text-xs hover:text-amber-400 inline-flex items-center gap-1 text-gray-400 cursor-pointer"
              >
                {copiedStatus === 'reg-out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'reg-out' ? 'Copied' : 'Copy Output'}
              </button>
            )}
          </div>
          <div className="flex-grow relative min-h-[192px]">
            {error ? (
              <div className="absolute inset-0 p-4 border border-rose-950 bg-rose-950/20 rounded-lg flex flex-col justify-center items-center text-center">
                <p className="text-xs text-rose-400 max-w-sm font-semibold">{error}</p>
                <span className="text-[10px] text-gray-500 mt-2">Check details in Secrets panel.</span>
              </div>
            ) : output ? (
              <pre className="absolute inset-0 p-4 border border-white/10 bg-[#161616] overflow-auto rounded-lg text-xs leading-relaxed font-mono text-emerald-400 whitespace-pre-wrap select-all">
                {output}
              </pre>
            ) : (
              <div className="absolute inset-0 border border-dashed border-white/10 rounded-lg flex flex-col justify-center items-center text-center bg-white/2 text-gray-500 p-4 text-xs font-medium">
                {loading ? 'Evaluating character classes...' : 'Compiled regex expressions and step-by-step deconstructions will show up here.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. AI CODE COMMENTS GENERATOR
function AiCodeAnnotator({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnnotator = () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setOutput('');

    fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'code_comments', text: input.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('API request failed. Verify backend or keys.');
        return res.json();
      })
      .then((data) => {
        setOutput(data.output);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error occurred during code annotation.');
        setLoading(false);
      });
  };

  const loadSnippet = () => {
    setInput(`function calculateSum(numbers) {
  let initial = 0;
  for (let i = 0; i < numbers.length; i++) {
    const item = numbers[i];
    if (typeof item === 'number' && !isNaN(item)) {
      initial += item;
    }
  }
  return initial;
}`);
  };

  return (
    <div className="space-y-6" id="ai-code-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1 px-2 text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">AI</span>
            AI Code Comments Injector
          </h2>
          <p className="text-sm text-gray-400">Inject high-quality functional descriptions, typescript annotations, and inline documentation variables.</p>
        </div>
        <button 
          type="button" 
          onClick={loadSnippet}
          className="p-1.5 px-3 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 rounded-lg text-xs font-semibold cursor-pointer text-gray-300 hover:text-white self-start transition-colors"
        >
          Paste Code Sample
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Area */}
        <div>
          <label className="text-xs font-mono text-gray-400 mb-1.5 block">RAW PROGRAM INPUT:</label>
          <textarea
            className="w-full h-80 p-4 border border-white/10 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-[#161616] text-white placeholder-gray-650"
            placeholder="Paste your un-typed or cryptic javascript/python/typescript code block..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="button"
            className="mt-4 w-full p-2.5 bg-amber-600 font-semibold text-white hover:bg-amber-700 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            disabled={loading || !input.trim()}
            onClick={handleAnnotator}
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileCode className="w-4 h-4" />}
            {loading ? 'Analyzing Code Semantics...' : 'Inject Comments & annotations'}
          </button>
        </div>

        {/* Output Pre */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-gray-400">CODE WITH DOCSTRINGS:</span>
            {output && (
              <button 
                type="button"
                onClick={() => onCopy(output, 'code-out')}
                className="text-xs hover:text-amber-400 inline-flex items-center gap-1 text-gray-400 cursor-pointer"
              >
                {copiedStatus === 'code-out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'code-out' ? 'Copied code block' : 'Copy Annotated Block'}
              </button>
            )}
          </div>
          <div className="flex-grow relative min-h-[320px]">
            {error ? (
              <div className="absolute inset-0 p-4 border border-rose-950 bg-rose-950/20 rounded-lg flex flex-col justify-center items-center text-center">
                <p className="text-xs text-rose-400 max-w-sm font-semibold">{error}</p>
                <span className="text-[10px] text-gray-500 mt-1">Please ensure Gemini works in the backend logs.</span>
              </div>
            ) : output ? (
              <pre className="absolute inset-0 p-4 border border-white/10 bg-[#161616] text-emerald-400 overflow-auto rounded-lg text-xs leading-relaxed font-mono whitespace-pre select-all">
                {output}
              </pre>
            ) : (
              <div className="absolute inset-0 border border-dashed border-white/10 rounded-lg flex flex-col justify-center items-center text-center bg-white/2 text-gray-500 p-4 text-xs font-medium">
                {loading ? 'Inserting functional assertions...' : 'Commented program code blocks will show here.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
