import { useState } from 'react';
import { Copy, Check, RotateCcw, FileText, Sparkles, BookOpen } from 'lucide-react';

interface TextToolsProps {
  activeToolId: string;
  isDark: boolean;
}

export function TextTools({ activeToolId, isDark }: TextToolsProps) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(id);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  if (activeToolId === 'case-converter') {
    return <CaseConverter isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'word-counter') {
    return <WordCounter isDark={isDark} />;
  }
  if (activeToolId === 'markdown-preview') {
    return <MarkdownPreview isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'text-to-slug') {
    return <TextToSlug isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'lorem-ipsum') {
    return <LoremIpsumGenerator isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'remove-line-breaks') {
    return <RemoveLineBreaks isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'random-word') {
    return <RandomWordGenerator isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'privacy-policy') {
    return <PrivacyPolicyGenerator isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'terms-conditions') {
    return <TermsConditionsGenerator isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'disclaimer-gen') {
    return <DisclaimerGenerator isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'text-repeater') {
    return <TextRepeater isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'text-sorter') {
    return <TextSorter isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'comma-separator') {
    return <CommaSeparator isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }

  return null;
}

// 1. CASE CONVERTER
function CaseConverter({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const t = {
    heading: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textFaint: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-white/5' : 'border-gray-200',
    panelBg: isDark ? 'bg-[#18181b]/95 border-white/5' : 'bg-white border-gray-200',
    controlBg: isDark ? 'bg-[#09090b]/80 border-white/5' : 'bg-gray-50 border-gray-200',
    cardBg: isDark ? 'bg-[#09090c] border-white/5' : 'bg-gray-50 border-gray-200',
    inputBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    textareaBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    outputBg: isDark ? 'bg-[#0a0a0c] border-white/5 text-gray-300 placeholder:text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400',
    selectBg: isDark ? 'bg-[#09090b] border-white/5 text-white' : 'bg-white border-gray-300 text-gray-900',
    copyBtn: isDark ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900',
    label: isDark ? 'text-gray-400' : 'text-gray-600',
    labelFaint: isDark ? 'text-gray-500' : 'text-gray-400',
  };

  const [input, setInput] = useState('');

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m) => m.toUpperCase());
  };

  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/\b(\w)/g, (m) => m.toUpperCase());
  };

  const toCamelCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  };

  const toSnakeCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w]+/g, '');
  };

  const handleSetCase = (type: 'upper' | 'lower' | 'sentence' | 'title' | 'camel' | 'snake') => {
    if (!input) return;
    let converted = '';
    switch (type) {
      case 'upper':
        converted = input.toUpperCase();
        break;
      case 'lower':
        converted = input.toLowerCase();
        break;
      case 'sentence':
        converted = toSentenceCase(input);
        break;
      case 'title':
        converted = toTitleCase(input);
        break;
      case 'camel':
        converted = toCamelCase(input);
        break;
      case 'snake':
        converted = toSnakeCase(input);
        break;
    }
    setInput(converted);
  };

  const badgeClass = isDark
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    : 'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="space-y-6" id="case-converter-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>TEXT</span>
          Case Converter
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Transform your paragraphs between lowercase, UPPERCASE, Title Case, Sentence Case, or code naming conventions.</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className={`flex items-center justify-between mb-1.5`}>
            <span className={`text-xs font-mono ${t.textMuted}`}>INPUT PARAGRAPH:</span>
            {input && (
              <button 
                type="button"
                onClick={() => onCopy(input, 'case-val')}
                className={`text-xs hover:text-indigo-400 inline-flex items-center gap-1 ${t.textMuted} cursor-pointer`}
              >
                {copiedStatus === 'case-val' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'case-val' ? 'Copied' : 'Copy Text'}
              </button>
            )}
          </div>
          <textarea
            className={`w-full h-64 p-4 ${t.textareaBg} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
            placeholder="Type or paste your content here and use the quick buttons below to change the text casing..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSetCase('upper')}
            className={`p-2 px-4 ${t.controlBg} ${t.textMuted} hover:bg-white/10 hover:${t.heading} border ${t.border} rounded-lg text-sm font-medium transition-all cursor-pointer`}
          >
            UPPERCASE
          </button>
          <button
            type="button"
            onClick={() => handleSetCase('lower')}
            className={`p-2 px-4 ${t.controlBg} ${t.textMuted} hover:bg-white/10 hover:${t.heading} border ${t.border} rounded-lg text-sm font-medium transition-all cursor-pointer`}
          >
            lowercase
          </button>
          <button
            type="button"
            onClick={() => handleSetCase('sentence')}
            className={`p-2 px-4 ${t.controlBg} ${t.textMuted} hover:bg-white/10 hover:${t.heading} border ${t.border} rounded-lg text-sm font-medium transition-all cursor-pointer`}
          >
            Sentence case
          </button>
          <button
            type="button"
            onClick={() => handleSetCase('title')}
            className={`p-2 px-4 ${t.controlBg} ${t.textMuted} hover:bg-white/10 hover:${t.heading} border ${t.border} rounded-lg text-sm font-medium transition-all cursor-pointer`}
          >
            Title Case
          </button>
          <button
            type="button"
            onClick={() => handleSetCase('camel')}
            className={`p-2 px-4 ${t.controlBg} ${t.textMuted} hover:bg-white/10 hover:${t.heading} border ${t.border} rounded-lg text-sm font-medium transition-all cursor-pointer`}
          >
            camelCase
          </button>
          <button
            type="button"
            onClick={() => handleSetCase('snake')}
            className={`p-2 px-4 ${t.controlBg} ${t.textMuted} hover:bg-white/10 hover:${t.heading} border ${t.border} rounded-lg text-sm font-medium transition-all cursor-pointer`}
          >
            snake_case
          </button>
          <button
            type="button"
            onClick={() => setInput('')}
            className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-all cursor-pointer"
            title="Reset text"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. WORD & CHAR COUNTER
function WordCounter({ isDark }: { isDark: boolean }) {
  const t = {
    heading: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textFaint: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-white/5' : 'border-gray-200',
    panelBg: isDark ? 'bg-[#18181b]/95 border-white/5' : 'bg-white border-gray-200',
    controlBg: isDark ? 'bg-[#09090b]/80 border-white/5' : 'bg-gray-50 border-gray-200',
    cardBg: isDark ? 'bg-[#09090c] border-white/5' : 'bg-gray-50 border-gray-200',
    inputBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    textareaBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    outputBg: isDark ? 'bg-[#0a0a0c] border-white/5 text-gray-300 placeholder:text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400',
    selectBg: isDark ? 'bg-[#09090b] border-white/5 text-white' : 'bg-white border-gray-300 text-gray-900',
    copyBtn: isDark ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900',
    label: isDark ? 'text-gray-400' : 'text-gray-600',
    labelFaint: isDark ? 'text-gray-500' : 'text-gray-400',
  };

  const [text, setText] = useState('');

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text ? text.split('\n').length : 0;
  const spaceCount = (text.match(/\s/g) || []).length;
  const letterCount = text.replace(/[^a-zA-Z]/g, '').length;
  const numCount = text.replace(/[^0-9]/g, '').length;
  
  const readTimeMins = Math.ceil(wordCount / 200);

  const loadExample = () => {
    setText(`Success isn't about being the best. It's about being better than you were yesterday. Web technologies are evolving at an unprecedented pace. Designing clean, minimalist tools allows developers to bypass daily frustrations and execute code with beautiful patterns.\n\n"Simplicity is the soul of modern software." - OmniTool Team`);
  };

  const badgeClass = isDark
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    : 'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="space-y-6" id="word-counter-container">
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${t.border}`}>
        <div>
          <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
            <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>TEXT</span>
            Character & Word Analyzer
          </h2>
          <p className={`text-sm ${t.textMuted}`}>Live statistics, reading duration estimations, and character summaries.</p>
        </div>
        <button 
          type="button"
          onClick={loadExample}
          className={`p-1.5 px-3 ${t.controlBg} hover:bg-white/10 border ${t.border} rounded-lg text-xs font-medium ${t.textMuted} hover:${t.heading} self-start cursor-pointer transition-colors`}
        >
          Load Demo Text
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#1a1c2e] border border-indigo-500/20 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Reading Stats</span>
            </div>
            <div className="text-2xl font-bold text-indigo-200">{readTimeMins} min</div>
            <p className="text-xs text-indigo-300/80 mt-1">Estimated reading time (based on ~200 WPM speed)</p>
          </div>

          <div className={`${t.panelBg} p-4 rounded-xl grid grid-cols-2 gap-4`}>
            <div>
              <span className={`text-xs font-mono ${t.textFaint} uppercase`}>Words</span>
              <div className={`text-2xl font-black ${t.heading}`}>{wordCount}</div>
            </div>
            <div>
              <span className={`text-xs font-mono ${t.textFaint} uppercase`}>Characters</span>
              <div className={`text-2xl font-black ${t.heading}`}>{charCount}</div>
            </div>
            <div>
              <span className={`text-xs font-mono ${t.textFaint} uppercase`}>Lines</span>
              <div className={`text-xl font-bold ${t.textMuted}`}>{lineCount}</div>
            </div>
            <div>
              <span className={`text-xs font-mono ${t.textFaint} uppercase`}>Letters Only</span>
              <div className={`text-xl font-bold ${t.textMuted}`}>{letterCount}</div>
            </div>
            <div>
              <span className={`text-xs font-mono ${t.textFaint} uppercase`}>Numbers</span>
              <div className={`text-xl font-bold ${t.textMuted}`}>{numCount}</div>
            </div>
            <div>
              <span className={`text-xs font-mono ${t.textFaint} uppercase`}>Whitespace</span>
              <div className={`text-xl font-bold ${t.textMuted}`}>{spaceCount}</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <label className={`text-xs font-mono ${t.textMuted} mb-1.5 block`}>TYPE AND WE WILL RECALCULATE DENSITY:</label>
          <textarea
            className={`w-full h-80 p-4 ${t.textareaBg} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
            placeholder="Type your notes here. Statistics will update instantly..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// 3. MARKDOWN TO HTML PREVIEW
function MarkdownPreview({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const t = {
    heading: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textFaint: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-white/5' : 'border-gray-200',
    panelBg: isDark ? 'bg-[#18181b]/95 border-white/5' : 'bg-white border-gray-200',
    controlBg: isDark ? 'bg-[#09090b]/80 border-white/5' : 'bg-gray-50 border-gray-200',
    cardBg: isDark ? 'bg-[#09090c] border-white/5' : 'bg-gray-50 border-gray-200',
    inputBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    textareaBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    outputBg: isDark ? 'bg-[#0a0a0c] border-white/5 text-gray-300 placeholder:text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400',
    selectBg: isDark ? 'bg-[#09090b] border-white/5 text-white' : 'bg-white border-gray-300 text-gray-900',
    copyBtn: isDark ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900',
    label: isDark ? 'text-gray-400' : 'text-gray-600',
    labelFaint: isDark ? 'text-gray-500' : 'text-gray-400',
  };

  const [input, setInput] = useState('');
  
  const compileMarkdownToHtml = (mdStr: string) => {
    let html = mdStr;
    
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/^#### (.*?)$/gm, '<h4 class="text-sm font-bold text-white mt-3 mb-1 font-sans">$1</h4>');
    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-base font-bold text-white mt-4 mb-2 font-sans">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-lg font-bold text-indigo-300 mt-5 mb-2 font-sans border-b border-white/5 pb-1">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-extrabold text-indigo-200 mt-6 mb-3 font-sans border-b border-white/10 pb-2">$1</h1>');

    html = html.replace(/```([\s\S]*?)```/gm, '<pre class="bg-slate-950 text-cyan-400 p-3 rounded-lg my-3 font-mono text-xs overflow-x-auto select-all">$1</pre>');
    
    html = html.replace(/`([^`\n]+)`/g, '<code class="bg-white/5 p-0.5 px-1 rounded font-mono text-xs text-rose-400 font-semibold">$1</code>');

    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    html = html.replace(/\*([^*\n]+)\*/g, '<em class="italic text-gray-300">$1</em>');

    html = html.replace(/^\s*-\s+(.*?)$/gm, '<li class="list-disc list-inside ml-4 text-sm text-gray-300 py-0.5">$1</li>');

    html = html.replace(/^(?!<(h|pre|li|code|strong|em))(.*?)$/gm, (match) => {
      if (match.trim()) {
        return `<p class="text-sm text-gray-300 my-2 leading-relaxed">${match}</p>`;
      }
      return '';
    });

    return html;
  };

  const loadDemo = () => {
    setInput(`# Dynamic Markups
## Visual Features
Here is a list of features included in **OmniTool** compiler:
- High performance rendering
- Completely *local* compiles
- Secure clean conversions

\`\`\`typescript
const logMessage = (msg: string): void => {
  console.log(\`OmniTool: \${msg}\`);
};
\`\`\`

Have fun editing!`);
  };

  const compiledHtml = compileMarkdownToHtml(input);

  const badgeClass = isDark
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    : 'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="space-y-6" id="markdown-preview-container">
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${t.border}`}>
        <div>
          <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
            <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>TEXT</span>
            Markdown Live Editor & Parser
          </h2>
          <p className={`text-sm ${t.textMuted}`}>Live compile rich markdown markup lines into visual nested components.</p>
        </div>
        <button 
          type="button"
          onClick={loadDemo}
          className={`p-1.5 px-3 ${t.controlBg} hover:bg-white/10 border ${t.border} rounded-lg text-xs font-medium ${t.textMuted} hover:${t.heading} cursor-pointer transition-colors`}
        >
          Load Markdown Sample
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className={`text-xs font-mono ${t.textMuted} mb-1.5 block`}>MARKDOWN WRITER:</label>
          <textarea
            className={`w-full h-80 p-4 ${t.textareaBg} rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
            placeholder="Type your markdown formatting here (Headers #, Bullet pts -, **Bold**)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <div className={`flex items-center justify-between mb-1.5`}>
            <span className={`text-xs font-mono ${t.textMuted}`}>RENDERED PREVIEW:</span>
            {input && (
              <button 
                type="button"
                onClick={() => onCopy(compiledHtml, 'html-code')}
                className={`text-xs hover:text-indigo-400 inline-flex items-center gap-1 ${t.textMuted} cursor-pointer`}
              >
                {copiedStatus === 'html-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'html-code' ? 'Copied HTML Code' : 'Copy HTML'}
              </button>
            )}
          </div>
          
          <div className={`flex-1 p-5 border ${t.border} rounded-lg ${t.controlBg} overflow-auto min-h-[320px] max-h-[320px]`}>
            {input ? (
              <div 
                className="prose max-w-none text-gray-200"
                dangerouslySetInnerHTML={{ __html: compiledHtml }}
              />
            ) : (
              <div className={`h-full flex flex-col justify-center items-center text-center ${t.textFaint} text-xs`}>
                <FileText className={`w-8 h-8 mb-2 ${t.textFaint}`} />
                Fill the markdown panel on the left to watch live rendering format on-the-fly.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. TEXT TO SLUG CONVERTER
function TextToSlug({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const t = {
    heading: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textFaint: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-white/5' : 'border-gray-200',
    panelBg: isDark ? 'bg-[#18181b]/95 border-white/5' : 'bg-white border-gray-200',
    controlBg: isDark ? 'bg-[#09090b]/80 border-white/5' : 'bg-gray-50 border-gray-200',
    cardBg: isDark ? 'bg-[#09090c] border-white/5' : 'bg-gray-50 border-gray-200',
    inputBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    textareaBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    outputBg: isDark ? 'bg-[#0a0a0c] border-white/5 text-gray-300 placeholder:text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400',
    selectBg: isDark ? 'bg-[#09090b] border-white/5 text-white' : 'bg-white border-gray-300 text-gray-900',
    copyBtn: isDark ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900',
    label: isDark ? 'text-gray-400' : 'text-gray-600',
    labelFaint: isDark ? 'text-gray-500' : 'text-gray-400',
  };

  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);

  const generateSlug = (text: string) => {
    let result = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim();

    if (lowercase) {
      result = result.toLowerCase();
    }
    
    result = result.replace(/[-\s_]+/g, separator);
    return result;
  };

  const slug = generateSlug(input);

  const badgeClass = isDark
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    : 'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="space-y-6" id="text-to-slug-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>TEXT</span>
          Text to Slug Converter
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Convert standard text sentences into clean, SEO-friendly, web-safe URL slugs instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 space-y-4 ${t.panelBg} p-5 rounded-xl text-sm`}>
          <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2 mb-3`}>Slug Choices</h3>
          
          <div className="space-y-3">
            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Word Separator:</label>
              <select
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                className={`w-full p-2.5 ${t.selectBg} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
              >
                <option value="-">Dash (-)</option>
                <option value="_">Underscore (_)</option>
                <option value="/">Slash (/)</option>
                <option value="">None (Concatenated)</option>
              </select>
            </div>

            <label className={`flex items-center gap-2 cursor-pointer font-medium ${t.textMuted} hover:${t.heading} pt-2`}>
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="rounded border-white/10 text-indigo-650 accent-indigo-605 w-4 h-4 cursor-pointer"
              />
              <span>Force Lowercase</span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className={`text-xs font-mono ${t.textMuted} mb-1.5 block`}>RAW TEXT INPUT:</label>
            <input
              type="text"
              className={`w-full p-3 ${t.inputBg} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
              placeholder="e.g. Rocket Web Tools: standalone utilities 101!"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div>
            <div className={`flex items-center justify-between mb-1.5`}>
              <span className={`text-xs font-mono ${t.textMuted}`}>GENERATED URL SLUG:</span>
              {slug && (
                <button
                  type="button"
                  onClick={() => onCopy(slug, 'slug-val')}
                  className={`text-xs hover:text-indigo-400 inline-flex items-center gap-1 ${t.textMuted} cursor-pointer`}
                >
                  {copiedStatus === 'slug-val' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedStatus === 'slug-val' ? 'Copied Slug' : 'Copy Slug'}
                </button>
              )}
            </div>
            <div className={`w-full p-3.5 ${t.outputBg} rounded-lg font-mono text-base text-purple-300 break-all select-all min-h-[48px]`}>
              {slug || <span className={`${t.textFaint} italic text-sm`}>Your slug will appear here as you type...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. LOREM IPSUM GENERATOR
function LoremIpsumGenerator({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const t = {
    heading: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textFaint: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-white/5' : 'border-gray-200',
    panelBg: isDark ? 'bg-[#18181b]/95 border-white/5' : 'bg-white border-gray-200',
    controlBg: isDark ? 'bg-[#09090b]/80 border-white/5' : 'bg-gray-50 border-gray-200',
    cardBg: isDark ? 'bg-[#09090c] border-white/5' : 'bg-gray-50 border-gray-200',
    inputBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    textareaBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    outputBg: isDark ? 'bg-[#0a0a0c] border-white/5 text-gray-300 placeholder:text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400',
    selectBg: isDark ? 'bg-[#09090b] border-white/5 text-white' : 'bg-white border-gray-300 text-gray-900',
    copyBtn: isDark ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900',
    label: isDark ? 'text-gray-400' : 'text-gray-600',
    labelFaint: isDark ? 'text-gray-500' : 'text-gray-400',
  };

  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generatedText, setGeneratedText] = useState('');

  const wordPool = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 
    'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut', 
    'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 
    'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 
    'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 
    'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 
    'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'faucibus', 
    'porttitor', 'lacus', 'luctus', 'accumsan', 'tortor', 'posuere', 'pretium', 'viverra', 'suspendisse', 
    'potenti', 'habitant', 'morbi', 'tristique', 'senectus', 'netus', 'et', 'malesuada', 'fames', 
    'ac', 'turpis', 'egestas', 'integer', 'aliquet', 'nibh', 'praesent', 'justo', 'interdum', 'vel'
  ];

  const generateSentence = (addPreamble = false) => {
    let wordsCount = Math.floor(Math.random() * 8) + 6;
    let sentenceWords: string[] = [];

    if (addPreamble) {
      sentenceWords = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit'];
      wordsCount = Math.max(0, wordsCount - 8);
    }

    for (let i = 0; i < wordsCount; i++) {
      const idx = Math.floor(Math.random() * wordPool.length);
      let word = wordPool[idx];
      if (sentenceWords.length === 0) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      sentenceWords.push(word);
    }
    return sentenceWords.join(' ') + '.';
  };

  const generateParagraph = (addPreamble = false) => {
    const totalSentences = Math.floor(Math.random() * 4) + 4;
    const sentencesList: string[] = [];
    for (let i = 0; i < totalSentences; i++) {
      sentencesList.push(generateSentence(addPreamble && i === 0));
    }
    return sentencesList.join(' ');
  };

  const handleGenerate = () => {
    let result = '';
    if (type === 'paragraphs') {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph(startWithLorem && i === 0));
      }
      result = paragraphs.join('\n\n');
    } else if (type === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(startWithLorem && i === 0));
      }
      result = sentences.join(' ');
    } else {
      let words: string[] = [];
      if (startWithLorem) {
        words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit'];
      }
      while (words.length < count) {
        const idx = Math.floor(Math.random() * wordPool.length);
        words.push(wordPool[idx]);
      }
      words = words.slice(0, count);
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      result = words.join(' ');
    }
    setGeneratedText(result);
  };

  const badgeClass = isDark
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    : 'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="space-y-6" id="lorem-ipsum-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>TEXT</span>
          Lorem Ipsum Generator
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Generate customizable blocks of standard pseudo-Latin dummy text placeholders for print, layout designs, and mockups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 space-y-4 ${t.panelBg} p-5 rounded-xl text-sm`}>
          <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2 mb-3 font-sans`}>Parameters</h3>
          
          <div className="space-y-4">
            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Unit Count:</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className={`w-full p-2.5 ${t.inputBg} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Generate By:</label>
              <div className={`grid grid-cols-3 gap-1 p-1 ${t.controlBg} border ${t.border} rounded-lg text-xs font-semibold`}>
                <button
                  type="button"
                  onClick={() => setType('paragraphs')}
                  className={`p-1.5 rounded transition-all text-center cursor-pointer ${type === 'paragraphs' ? 'bg-indigo-600 text-white shadow' : `${t.textMuted} hover:${t.heading}`}`}
                >
                  Paragraphs
                </button>
                <button
                  type="button"
                  onClick={() => setType('sentences')}
                  className={`p-1.5 rounded transition-all text-center cursor-pointer ${type === 'sentences' ? 'bg-indigo-600 text-white shadow' : `${t.textMuted} hover:${t.heading}`}`}
                >
                  Sentences
                </button>
                <button
                  type="button"
                  onClick={() => setType('words')}
                  className={`p-1.5 rounded transition-all text-center cursor-pointer ${type === 'words' ? 'bg-indigo-600 text-white shadow' : `${t.textMuted} hover:${t.heading}`}`}
                >
                  Words
                </button>
              </div>
            </div>

            <label className={`flex items-center gap-2 cursor-pointer font-medium ${t.textMuted} hover:${t.heading}`}>
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="rounded border-white/10 text-indigo-650 accent-indigo-600 w-4 h-4 cursor-pointer"
              />
              <span>Start with "Lorem ipsum..."</span>
            </label>

            <button
              type="button"
              onClick={handleGenerate}
              className="w-full p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold tracking-wide transition-all cursor-pointer shadow-md"
            >
              Generate Placeholder
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className={`flex justify-between items-center text-xs font-mono ${t.textMuted}`}>
            <span>COMPILED OUTPUT:</span>
            {generatedText && (
              <button
                type="button"
                onClick={() => onCopy(generatedText, 'lorem-val')}
                className={`text-xs hover:text-indigo-400 inline-flex items-center gap-1 ${t.textMuted} cursor-pointer`}
              >
                {copiedStatus === 'lorem-val' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'lorem-val' ? 'Copied Passages' : 'Copy All'}
              </button>
            )}
          </div>
          
          <textarea
            readOnly
            className={`w-full h-80 p-4 ${t.outputBg} rounded-lg text-sm focus:outline-none placeholder-gray-600 focus:border-white/10 resize-y select-all`}
            value={generatedText}
            placeholder='Click the purple "Generate Placeholder" button to compile mock text paragraphs...'
          />
        </div>
      </div>
    </div>
  );
}

// 6. REMOVE LINE BREAKS
function RemoveLineBreaks({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const t = {
    heading: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textFaint: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-white/5' : 'border-gray-200',
    panelBg: isDark ? 'bg-[#18181b]/95 border-white/5' : 'bg-white border-gray-200',
    controlBg: isDark ? 'bg-[#09090b]/80 border-white/5' : 'bg-gray-50 border-gray-200',
    cardBg: isDark ? 'bg-[#09090c] border-white/5' : 'bg-gray-50 border-gray-200',
    inputBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    textareaBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    outputBg: isDark ? 'bg-[#0a0a0c] border-white/5 text-gray-300 placeholder:text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400',
    selectBg: isDark ? 'bg-[#09090b] border-white/5 text-white' : 'bg-white border-gray-300 text-gray-900',
    copyBtn: isDark ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900',
    label: isDark ? 'text-gray-400' : 'text-gray-600',
    labelFaint: isDark ? 'text-gray-500' : 'text-gray-400',
  };

  const [input, setInput] = useState('');
  const [replacementMode, setReplacementMode] = useState<'space' | 'comma' | 'custom' | 'none'>('space');
  const [customChar, setCustomChar] = useState('');
  const [stripDoubleParagraphs, setStripDoubleParagraphs] = useState(false);

  const cleanText = () => {
    if (!input) return '';
    let result = input;
    
    const rChar = replacementMode === 'space' ? ' ' 
                : replacementMode === 'comma' ? ', ' 
                : replacementMode === 'custom' ? customChar 
                : '';

    if (stripDoubleParagraphs) {
      const paragraphs = result.split(/\n\s*\n/);
      const cleanedParagraphs = paragraphs.map(p => p.replace(/[\r\n]+/g, rChar));
      result = cleanedParagraphs.join('\n\n');
    } else {
      result = result.replace(/[\r\n]+/g, rChar);
    }

    if (replacementMode === 'space') {
      result = result.replace(/ +/g, ' ');
    }

    return result.trim();
  };

  const output = cleanText();

  const badgeClass = isDark
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    : 'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="space-y-6" id="remove-line-breaks-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>TEXT</span>
          Remove Line Breaks
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Clean up text content copied from rigid layout engines like PDF viewers, converting broken lines into cohesive running paragraphs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 space-y-4 ${t.panelBg} p-5 rounded-xl text-sm`}>
          <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2 mb-3 font-sans`}>Formatting Choices</h3>
          
          <div className="space-y-4">
            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1.5`}>Replace Breaks With:</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#f5f5f5]">
                <button
                  type="button"
                  onClick={() => setReplacementMode('space')}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${replacementMode === 'space' ? 'bg-indigo-600 text-white border-indigo-500' : `${t.controlBg} ${t.textMuted} ${t.border} hover:${t.heading}`}`}
                >
                  Space
                </button>
                <button
                  type="button"
                  onClick={() => setReplacementMode('comma')}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${replacementMode === 'comma' ? 'bg-indigo-600 text-white border-indigo-500' : `${t.controlBg} ${t.textMuted} ${t.border} hover:${t.heading}`}`}
                >
                  Comma (,)
                </button>
                <button
                  type="button"
                  onClick={() => setReplacementMode('none')}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${replacementMode === 'none' ? 'bg-indigo-600 text-white border-indigo-500' : `${t.controlBg} ${t.textMuted} ${t.border} hover:${t.heading}`}`}
                >
                  No Separator
                </button>
                <button
                  type="button"
                  onClick={() => setReplacementMode('custom')}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${replacementMode === 'custom' ? 'bg-indigo-600 text-white border-indigo-500' : `${t.controlBg} ${t.textMuted} ${t.border} hover:${t.heading}`}`}
                >
                  Custom Char
                </button>
              </div>
            </div>

            {replacementMode === 'custom' && (
              <div>
                <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Custom Character / String:</label>
                <input
                  type="text"
                  value={customChar}
                  onChange={(e) => setCustomChar(e.target.value)}
                  className={`w-full p-2 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
                  placeholder="e.g. | or - or \t"
                />
              </div>
            )}

            <label className={`flex items-center gap-2 cursor-pointer font-medium ${t.textMuted} hover:${t.heading} pt-2 border-t ${t.border}`}>
              <input
                type="checkbox"
                checked={stripDoubleParagraphs}
                onChange={(e) => setStripDoubleParagraphs(e.target.checked)}
                className="rounded border-white/10 text-indigo-650 accent-indigo-600 w-4 h-4 cursor-pointer"
              />
              <span>Preserve double returns</span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className={`text-xs font-mono ${t.textMuted} mb-1 block`}>SOURCE MULTI-LINE TEXT:</label>
            <textarea
              className={`w-full h-44 p-3 ${t.textareaBg} rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/20`}
              placeholder="Paste text containing broken lines or raw vertical feeds here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div>
            <div className={`flex justify-between items-center text-xs font-mono ${t.textMuted} mb-1`}>
              <span>CLEAN RUNNING PROSE OUTPUT:</span>
              {output && (
                <button
                  type="button"
                  onClick={() => onCopy(output, 'clean-br')}
                  className={`text-xs hover:text-indigo-400 inline-flex items-center gap-1 ${t.textMuted} cursor-pointer`}
                >
                  {copiedStatus === 'clean-br' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedStatus === 'clean-br' ? 'Copied Prose' : 'Copy Output'}
                </button>
              )}
            </div>
            <textarea
              readOnly
              className={`w-full h-44 p-3 ${t.outputBg} rounded-lg text-xs`}
              value={output}
              placeholder="Cleaned prose sequence will generate here dynamically as you write..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. RANDOM WORD GENERATOR
function RandomWordGenerator({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const t = {
    heading: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textFaint: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-white/5' : 'border-gray-200',
    panelBg: isDark ? 'bg-[#18181b]/95 border-white/5' : 'bg-white border-gray-200',
    controlBg: isDark ? 'bg-[#09090b]/80 border-white/5' : 'bg-gray-50 border-gray-200',
    cardBg: isDark ? 'bg-[#09090c] border-white/5' : 'bg-gray-50 border-gray-200',
    inputBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    textareaBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    outputBg: isDark ? 'bg-[#0a0a0c] border-white/5 text-gray-300 placeholder:text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400',
    selectBg: isDark ? 'bg-[#09090b] border-white/5 text-white' : 'bg-white border-gray-300 text-gray-900',
    copyBtn: isDark ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900',
    label: isDark ? 'text-gray-400' : 'text-gray-600',
    labelFaint: isDark ? 'text-gray-500' : 'text-gray-400',
  };

  const [count, setCount] = useState(10);
  const [category, setCategory] = useState<'any' | 'nouns' | 'adjectives' | 'verbs'>('any');
  const [minLength, setMinLength] = useState(3);
  const [maxLength, setMaxLength] = useState(12);
  const [outputWords, setOutputWords] = useState<string[]>([]);
  const [outputSeparator, setOutputSeparator] = useState<'comma' | 'newline' | 'space'>('comma');

  const wordLists = {
    nouns: [
      'apple', 'rocket', 'galaxy', 'computer', 'developer', 'workspace', 'shield', 'compass', 'window', 'keyboard',
      'ocean', 'mountain', 'forest', 'engine', 'coffee', 'concept', 'structure', 'system', 'theory', 'energy',
      'village', 'country', 'planet', 'crystal', 'mirror', 'bridge', 'castle', 'desert', 'shadow', 'candle',
      'journey', 'science', 'history', 'pattern', 'network', 'circuit', 'starlight', 'voyage', 'anchor', 'beacon'
    ],
    adjectives: [
      'brilliant', 'vibrant', 'quantum', 'silent', 'graceful', 'ancient', 'stellar', 'mystic', 'digital', 'agile',
      'robust', 'organic', 'glowing', 'cohesive', 'pristine', 'infinite', 'unusual', 'dynamic', 'classic', 'cosmic',
      'tactical', 'magical', 'subtle', 'covert', 'nimble', 'audacious', 'elegant', 'furious', 'peaceful', 'haunting',
      'hidden', 'zenith', 'spectral', 'luminous', 'brave', 'timeless', 'radiant', 'elastic', 'fluid', 'holographic'
    ],
    verbs: [
      'build', 'compile', 'optimize', 'encrypt', 'explore', 'create', 'launch', 'design', 'connect', 'inspire',
      'transform', 'validate', 'resolve', 'execute', 'develop', 'catalyze', 'navigate', 'discover', 'synthesize', 'generate',
      'observe', 'reflect', 'amplify', 'harness', 'pioneer', 'unlock', 'unify', 'anchor', 'channel', 'accelerate',
      'evolve', 'capture', 'define', 'elevate', 'master', 'sculpt', 'radiate', 'resonate', 'traverse', 'ascend'
    ]
  };

  const generateWordsList = () => {
    let pool: string[] = [];
    if (category === 'any') {
      pool = [...wordLists.nouns, ...wordLists.adjectives, ...wordLists.verbs];
    } else {
      pool = wordLists[category];
    }

    const filteredPool = pool.filter(w => w.length >= minLength && w.length <= maxLength);
    
    if (filteredPool.length === 0) {
      setOutputWords(['No matched words inside specific bounds. Adjust limits.']);
      return;
    }

    const compiled: string[] = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * filteredPool.length);
      compiled.push(filteredPool[idx]);
    }
    setOutputWords(compiled);
  };

  const getJoinedSeparator = () => {
    if (outputWords.length === 0) return '';
    if (outputSeparator === 'comma') return outputWords.join(', ');
    if (outputSeparator === 'newline') return outputWords.join('\n');
    return outputWords.join(' ');
  };

  const resultingText = getJoinedSeparator();

  const badgeClass = isDark
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    : 'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="space-y-6" id="random-word-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>TEXT</span>
          Random Word Generator
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Roll random sets of English vocabulary blocks filtered by Parts of Speech features and character bounds standard limits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 space-y-4 ${t.panelBg} p-5 rounded-xl text-sm`}>
          <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2 mb-2 font-sans`}>Tuning Metrics</h3>
          
          <div className="space-y-3">
            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Words Count:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className={`w-full p-2 ${t.inputBg} rounded-lg text-xs font-semibold focus:outline-none`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Word Category:</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className={`w-full p-2.5 ${t.selectBg} rounded-lg text-xs focus:outline-none`}
              >
                <option value="any">Free mix (Nouns/Verbs/Adj)</option>
                <option value="nouns">Nouns Only</option>
                <option value="adjectives">Adjectives Only</option>
                <option value="verbs">Verbs Only</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Min Length:</label>
                <input
                  type="number"
                  min="2"
                  max={maxLength}
                  value={minLength}
                  onChange={(e) => setMinLength(Math.max(2, parseInt(e.target.value) || 2))}
                  className={`w-full p-2 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
                />
              </div>
              <div>
                <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Max Length:</label>
                <input
                  type="number"
                  min={minLength}
                  max="20"
                  value={maxLength}
                  onChange={(e) => setMaxLength(Math.max(minLength, parseInt(e.target.value) || minLength))}
                  className={`w-full p-2 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
                />
              </div>
            </div>

            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Output Separator:</label>
              <select
                value={outputSeparator}
                onChange={(e: any) => setOutputSeparator(e.target.value)}
                className={`w-full p-2.5 ${t.selectBg} rounded-lg text-xs focus:outline-none`}
              >
                <option value="comma">Separate with commas</option>
                <option value="newline">One per line (newline)</option>
                <option value="space">Space Separator</option>
              </select>
            </div>

            <button
              type="button"
              onClick={generateWordsList}
              className="w-full p-2.5 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold rounded-lg transition-all shadow cursor-pointer mt-2"
            >
              Compile Vocabulary
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className={`flex justify-between items-center text-xs font-mono ${t.textMuted}`}>
            <span>GENERATED WORDS:</span>
            {resultingText && (
              <button
                type="button"
                onClick={() => onCopy(resultingText, 'rand-word')}
                className={`text-xs hover:text-indigo-400 inline-flex items-center gap-1 ${t.textMuted} cursor-pointer`}
              >
                {copiedStatus === 'rand-word' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'rand-word' ? 'Copied Vocabulary' : 'Copy All'}
              </button>
            )}
          </div>

          <textarea
            readOnly
            className={`w-full h-80 p-4 ${t.outputBg} rounded-lg text-sm font-mono focus:outline-none resize-y`}
            value={resultingText}
            placeholder='Click "Compile Vocabulary" on the left panel to trigger random choices...'
          />
        </div>
      </div>
    </div>
  );
}

// 8. PRIVACY POLICY GENERATOR
function PrivacyPolicyGenerator({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const t = {
    heading: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textFaint: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-white/5' : 'border-gray-200',
    panelBg: isDark ? 'bg-[#18181b]/95 border-white/5' : 'bg-white border-gray-200',
    controlBg: isDark ? 'bg-[#09090b]/80 border-white/5' : 'bg-gray-50 border-gray-200',
    cardBg: isDark ? 'bg-[#09090c] border-white/5' : 'bg-gray-50 border-gray-200',
    inputBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    textareaBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    outputBg: isDark ? 'bg-[#0a0a0c] border-white/5 text-gray-300 placeholder:text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400',
    selectBg: isDark ? 'bg-[#09090b] border-white/5 text-white' : 'bg-white border-gray-300 text-gray-900',
    copyBtn: isDark ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900',
    label: isDark ? 'text-gray-400' : 'text-gray-600',
    labelFaint: isDark ? 'text-gray-500' : 'text-gray-400',
  };

  const [formData, setFormData] = useState({
    companyName: '',
    websiteName: '',
    websiteUrl: '',
    contactEmail: '',
    collectEmail: true,
    collectCookies: true,
    useAnalytics: true
  });

  const getLocalDate = () => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const generatePolicy = () => {
    const { companyName, websiteName, websiteUrl, contactEmail, collectEmail, collectCookies, useAnalytics } = formData;
    if (!companyName || !websiteUrl) return '';

    return `# Privacy Policy for ${companyName}

Last updated: ${getLocalDate()}

At ${websiteName || companyName}, accessible from ${websiteUrl}, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ${websiteName || companyName} and how we use it.

If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at ${contactEmail || 'our contact email'}.

## 1. General Data Protection Regulation (GDPR)
We are a Data Controller of your information. Our legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Information we collect and the specific context in which we collect the information:
- ${companyName} needs to perform a contract with you
- You have given ${companyName} permission to do so
- Processing your personal information is in ${companyName} legitimate interests
- ${companyName} needs to comply with the law

We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy.

## 2. Information We Collect
${collectEmail ? `- **Personal Contact Information**: When you register for an account or fill out forms on our website, we may collect your email address, name, or other communication metrics.` : ''}
${collectCookies ? `- **Cookies and Log Files**: Standard browser parameters, reference links, and device metrics used to enhance platform usability.` : ''}

## 3. How We Use Your Information
We use the information we collect in various ways, including to:
- Provide, operate, and maintain our website
- Improve, personalize, and expand our website
- Understand and analyze how you use our website
- Develop new products, services, features, and functionality
${useAnalytics ? `- Analyze platform activity levels via external visitor metrics integrations.` : ''}

## 4. Third-Party Privacy Policies
Our Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party servers for more detailed information. This may include their practices and instructions about how to opt-out of certain options.

## 5. CCPA Privacy Rights (Do Not Sell My Personal Information)
Under the CCPA, among other rights, California consumers have the right to:
- Request that a business disclose the categories and specific pieces of personal data that a business has collected about consumers.
- Request that a business delete any personal data about the consumer that a business has collected.
- Request that a business that sells a consumer's personal data, not sell the consumer's personal data.

## 6. Consent
By using our website, you hereby consent to our Privacy Policy and agree to its terms.`;
  };

  const policyOutput = generatePolicy();

  const badgeClass = isDark
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    : 'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="space-y-6" id="privacy-policy-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>TEXT</span>
          Privacy Policy Generator
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Formulate a professional Privacy Policy layout tailored for General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA) compliance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 space-y-4 ${t.panelBg} p-5 rounded-xl text-sm`}>
          <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2 mb-2 font-sans`}>Company Details</h3>
          
          <div className="space-y-3">
            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Company / Team Name*:</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className={`w-full p-2 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Website Name:</label>
              <input
                type="text"
                placeholder="e.g. Acme Service Hub"
                value={formData.websiteName}
                onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
                className={`w-full p-2 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Website URL*:</label>
              <input
                type="text"
                placeholder="https://acme.com"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className={`w-full p-2 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Contact Email Link:</label>
              <input
                type="text"
                placeholder="support@acme.com"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className={`w-full p-2 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
              />
            </div>

            <div className={`space-y-2 pt-2 border-t ${t.border}`}>
              <label className={`flex items-center gap-2 cursor-pointer font-medium ${t.textMuted} hover:${t.heading}`}>
                <input
                  type="checkbox"
                  checked={formData.collectEmail}
                  onChange={(e) => setFormData({ ...formData, collectEmail: e.target.checked })}
                  className="rounded border-white/10 text-indigo-650 accent-indigo-600 w-4 h-4 cursor-pointer"
                />
                <span>We collect user email addresses</span>
              </label>

              <label className={`flex items-center gap-2 cursor-pointer font-medium ${t.textMuted} hover:${t.heading}`}>
                <input
                  type="checkbox"
                  checked={formData.collectCookies}
                  onChange={(e) => setFormData({ ...formData, collectCookies: e.target.checked })}
                  className="rounded border-white/10 text-indigo-650 accent-indigo-600 w-4 h-4 cursor-pointer"
                />
                <span>We deploy tracking cookies</span>
              </label>

              <label className={`flex items-center gap-2 cursor-pointer font-medium ${t.textMuted} hover:${t.heading}`}>
                <input
                  type="checkbox"
                  checked={formData.useAnalytics}
                  onChange={(e) => setFormData({ ...formData, useAnalytics: e.target.checked })}
                  className="rounded border-white/10 text-indigo-650 accent-indigo-600 w-4 h-4 cursor-pointer"
                />
                <span>We use visitor analytics integrations</span>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className={`flex justify-between items-center text-xs font-mono ${t.textMuted}`}>
            <span>DRAFTED GDPR COMPLIANT MARKDOWN TEXT:</span>
            {policyOutput && (
              <button
                type="button"
                onClick={() => onCopy(policyOutput, 'privacy-val')}
                className={`text-xs hover:text-indigo-400 inline-flex items-center gap-1 ${t.textMuted} cursor-pointer`}
              >
                {copiedStatus === 'privacy-val' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'privacy-val' ? 'Copied Policy' : 'Copy Policy'}
              </button>
            )}
          </div>

          <textarea
            readOnly
            className={`w-full h-96 p-4 ${t.outputBg} rounded-lg text-xs font-mono focus:outline-none resize-y opacity-90`}
            value={policyOutput}
            placeholder="Fill out company parameters and a professional Privacy Policy will compile here instantly..."
          />
        </div>
      </div>
    </div>
  );
}

// 9. TERMS & CONDITIONS GENERATOR
function TermsConditionsGenerator({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const t = {
    heading: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textFaint: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-white/5' : 'border-gray-200',
    panelBg: isDark ? 'bg-[#18181b]/95 border-white/5' : 'bg-white border-gray-200',
    controlBg: isDark ? 'bg-[#09090b]/80 border-white/5' : 'bg-gray-50 border-gray-200',
    cardBg: isDark ? 'bg-[#09090c] border-white/5' : 'bg-gray-50 border-gray-200',
    inputBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    textareaBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    outputBg: isDark ? 'bg-[#0a0a0c] border-white/5 text-gray-300 placeholder:text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400',
    selectBg: isDark ? 'bg-[#09090b] border-white/5 text-white' : 'bg-white border-gray-300 text-gray-900',
    copyBtn: isDark ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900',
    label: isDark ? 'text-gray-400' : 'text-gray-600',
    labelFaint: isDark ? 'text-gray-500' : 'text-gray-400',
  };

  const [formData, setFormData] = useState({
    companyName: '',
    websiteUrl: '',
    country: 'United States',
    stateProvince: ''
  });

  const getLocalDate = () => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const generateTerms = () => {
    const { companyName, websiteUrl, country, stateProvince } = formData;
    if (!companyName || !websiteUrl) return '';

    return `# Terms and Conditions

Last updated: ${getLocalDate()}

Welcome to our platform! These terms and conditions outline the rules and regulations for the use of ${companyName || 'our company'}'s Website, located at ${websiteUrl}.

By accessing this website we assume you accept these terms and conditions. Do not continue to use our services if you do not agree to take all of the terms and conditions stated on this page.

## 1. Intellectual Property Rights
Other than the content you own, under these Terms, ${companyName} and/or its licensors own all the intellectual property rights and materials contained in this Website. All intellectual property rights are reserved. You are granted a limited license only for purposes of viewing the material contained on this Website.

## 2. User Restrictions
You are specifically restricted from all of the following:
- Publishing any Website material in any other media unless written approval is provided.
- Selling, sublicensing, and/or otherwise commercializing any Website material.
- Publicly performing and/or showing any Website material.
- Using this Website in any way that is or may be damaging to this Website.
- Engaging in any data mining, data harvesting, data extracting, or any other similar activity.

## 3. Your Content
In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video, text, images, or other material you choose to display on this Website. By displaying Your Content, you grant ${companyName} a non-exclusive, worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate, and distribute it in any and all media.

## 4. No Warranties
This Website is provided "as is," with all faults, and ${companyName} expresses no representations or warranties, of any kind related to this Website or the materials contained on this Website.

## 5. Limitation of Liability
In no event shall ${companyName}, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract.

## 6. Indemnification
You hereby indemnify to the fullest extent ${companyName} from and against any and/or all liabilities, costs, demands, causes of action, damages, and expenses arising in any way related to your breach of any of the provisions of these Terms.

## 7. Governing Law & Jurisdiction
These Terms will be governed by and interpreted in accordance with the laws of ${stateProvince ? `${stateProvince}, ` : ''}${country}, and you submit to the non-exclusive jurisdiction of the state and federal courts located in ${stateProvince || country} for the resolution of any disputes.`;
  };

  const termsOutput = generateTerms();

  const badgeClass = isDark
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    : 'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="space-y-6" id="terms-conditions-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>TEXT</span>
          Terms & Conditions Generator
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Compile trademark-safe Term of Service policy agreements defining intellectual property rules and legal boundaries offline in-browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 space-y-4 ${t.panelBg} p-5 rounded-xl text-sm`}>
          <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2 mb-2 font-sans`}>Policy Settings</h3>
          
          <div className="space-y-3">
            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Company / App Name*:</label>
              <input
                type="text"
                placeholder="e.g. Rocket Systems"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className={`w-full p-2 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Website URL*:</label>
              <input
                type="text"
                placeholder="https://rocketsystems.io"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className={`w-full p-2 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Governing Country:</label>
              <input
                type="text"
                placeholder="e.g. United States"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className={`w-full p-2 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>State / Province (Jurisdiction):</label>
              <input
                type="text"
                placeholder="e.g. California"
                value={formData.stateProvince}
                onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                className={`w-full p-2 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className={`flex justify-between items-center text-xs font-mono ${t.textMuted}`}>
            <span>DRAFTED TERMS OF SERVICE AGREEMENT:</span>
            {termsOutput && (
              <button
                type="button"
                onClick={() => onCopy(termsOutput, 'terms-val')}
                className={`text-xs hover:text-indigo-400 inline-flex items-center gap-1 ${t.textMuted} cursor-pointer`}
              >
                {copiedStatus === 'terms-val' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'terms-val' ? 'Copied Terms' : 'Copy Terms'}
              </button>
            )}
          </div>

          <textarea
            readOnly
            className={`w-full h-96 p-4 ${t.outputBg} rounded-lg text-xs font-mono focus:outline-none resize-y opacity-90`}
            value={termsOutput}
            placeholder="Provide core policy parameters on the left to watch compliance drafts generate..."
          />
        </div>
      </div>
    </div>
  );
}

// 10. DISCLAIMER GENERATOR
function DisclaimerGenerator({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const t = {
    heading: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textFaint: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-white/5' : 'border-gray-200',
    panelBg: isDark ? 'bg-[#18181b]/95 border-white/5' : 'bg-white border-gray-200',
    controlBg: isDark ? 'bg-[#09090b]/80 border-white/5' : 'bg-gray-50 border-gray-200',
    cardBg: isDark ? 'bg-[#09090c] border-white/5' : 'bg-gray-50 border-gray-200',
    inputBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    textareaBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    outputBg: isDark ? 'bg-[#0a0a0c] border-white/5 text-gray-300 placeholder:text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400',
    selectBg: isDark ? 'bg-[#09090b] border-white/5 text-white' : 'bg-white border-gray-300 text-gray-900',
    copyBtn: isDark ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900',
    label: isDark ? 'text-gray-400' : 'text-gray-600',
    labelFaint: isDark ? 'text-gray-500' : 'text-gray-400',
  };

  const [formData, setFormData] = useState({
    companyName: '',
    websiteUrl: ''
  });

  const getLocalDate = () => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const generateDisclaimer = () => {
    const { companyName, websiteUrl } = formData;
    if (!companyName || !websiteUrl) return '';

    return `# Legal Disclaimer for ${companyName}

Last updated: ${getLocalDate()}

The information provided by ${companyName} on ${websiteUrl} is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.

## 1. Professional Disclaimer
The Site cannot and does not contain legal, financial, or medical advice. Any such information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THIS SITE IS SOLELY AT YOUR OWN RISK.

## 2. External Links Disclaimer
The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not audited, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.

## 3. Errors and Omissions Disclaimer
While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, ${companyName} is not responsible for any errors or omissions, or for the results obtained from the use of this information.

## 4. Fair Use Disclaimer
This site may contain copyrighted material the use of which has not always been specifically authorized by the copyright owner. We are making such material available in our efforts to advance understanding of environmental, political, human rights, economic, democracy, scientific, and social justice issues, etc.

## 5. Views Expressed Disclaimer
The Site may contain views and opinions which are those of the authors and do not necessarily reflect the official policy or position of any other author, agency, organization, employer, or company.

## 6. No Responsibility Disclaimer
The information on the Site is provided with the understanding that the Site is not herein engaged in rendering legal, accounting, tax, or other professional advice and services. As such, it should not be used as a substitute for consultation with professional advisers.`;
  };

  const disclaimerOutput = generateDisclaimer();

  const badgeClass = isDark
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    : 'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="space-y-6" id="disclaimer-gen-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>TEXT</span>
          Disclaimer Generator
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Generate structured liability disclaimers for professional advice limitations, affiliate disclosures, or external linking risks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 space-y-4 ${t.panelBg} p-5 rounded-xl text-sm`}>
          <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2 mb-2 font-sans`}>Disclaimer Metrics</h3>
          
          <div className="space-y-3">
            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Company / App Owner*:</label>
              <input
                type="text"
                placeholder="e.g. Nexus Software"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className={`w-full p-2 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Website URL*:</label>
              <input
                type="text"
                placeholder="https://nexusapp.hub"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className={`w-full p-2 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className={`flex justify-between items-center text-xs font-mono ${t.textMuted}`}>
            <span>DRAFTED LEGAL DISCLAIMER:</span>
            {disclaimerOutput && (
              <button
                type="button"
                onClick={() => onCopy(disclaimerOutput, 'disc-val')}
                className={`text-xs hover:text-indigo-400 inline-flex items-center gap-1 ${t.textMuted} cursor-pointer`}
              >
                {copiedStatus === 'disc-val' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'disc-val' ? 'Copied Disclaimer' : 'Copy Disclaimer'}
              </button>
            )}
          </div>

          <textarea
            readOnly
            className={`w-full h-80 p-4 ${t.outputBg} rounded-lg text-xs font-mono focus:outline-none resize-y opacity-90`}
            value={disclaimerOutput}
            placeholder="Fill in the mandatory fields to automatically design liability exclusions..."
          />
        </div>
      </div>
    </div>
  );
}

// 11. TEXT REPEATER
function TextRepeater({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const t = {
    heading: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textFaint: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-white/5' : 'border-gray-200',
    panelBg: isDark ? 'bg-[#18181b]/95 border-white/5' : 'bg-white border-gray-200',
    controlBg: isDark ? 'bg-[#09090b]/80 border-white/5' : 'bg-gray-50 border-gray-200',
    cardBg: isDark ? 'bg-[#09090c] border-white/5' : 'bg-gray-50 border-gray-200',
    inputBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    textareaBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    outputBg: isDark ? 'bg-[#0a0a0c] border-white/5 text-gray-300 placeholder:text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400',
    selectBg: isDark ? 'bg-[#09090b] border-white/5 text-white' : 'bg-white border-gray-300 text-gray-900',
    copyBtn: isDark ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900',
    label: isDark ? 'text-gray-400' : 'text-gray-600',
    labelFaint: isDark ? 'text-gray-500' : 'text-gray-400',
  };

  const [input, setInput] = useState('');
  const [count, setCount] = useState(10);
  const [separator, setSeparator] = useState('space');
  const [customChar, setCustomChar] = useState('');

  const generateReport = () => {
    if (!input || count <= 0) return '';
    const arr = Array(count).fill(input);
    
    let glue = ' ';
    if (separator === 'newline') glue = '\n';
    else if (separator === 'comma') glue = ', ';
    else if (separator === 'custom') glue = customChar;

    return arr.join(glue);
  };

  const output = generateReport();
  const outputLength = output.length;

  const badgeClass = isDark
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    : 'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="space-y-6" id="text-repeater-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>TEXT</span>
          Text Repeater
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Instantly repeat lines of keywords, phrases, or emojis with personalized layout delimiters for debugging or assets creation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 space-y-4 ${t.panelBg} p-5 rounded-xl text-sm`}>
          <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2 mb-2 font-sans`}>Settings</h3>
          
          <div className="space-y-3">
            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Repeat Count:</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
                className={`w-full p-2 ${t.inputBg} rounded-lg text-xs font-semibold focus:outline-none`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Delimiter Separator:</label>
              <select
                value={separator}
                onChange={(e: any) => setSeparator(e.target.value)}
                className={`w-full p-2.5 ${t.selectBg} rounded-lg text-xs focus:outline-none`}
              >
                <option value="space">Space</option>
                <option value="newline">New Line (vertical)</option>
                <option value="comma">Comma (,)</option>
                <option value="custom">Custom Separator</option>
              </select>
            </div>

            {separator === 'custom' && (
              <div>
                <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Custom Delimiter:</label>
                <input
                  type="text"
                  value={customChar}
                  onChange={(e) => setCustomChar(e.target.value)}
                  className={`w-full p-2 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
                  placeholder="e.g. - or |"
                />
              </div>
            )}

            {outputLength > 0 && (
              <div className={`pt-2 border-t ${t.border} space-y-1 text-xs`}>
                <span className={`${t.textMuted} block font-mono`}>Stream Metrics:</span>
                <p className="font-mono text-indigo-300 font-bold">{outputLength.toLocaleString()} characters</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className={`text-xs font-mono ${t.textMuted} mb-1 block`}>TEXT/EMOJI TO REPEAT:</label>
            <input
              type="text"
              placeholder="e.g. Sparkles ✨"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full p-3 ${t.inputBg} rounded-lg text-sm focus:outline-none`}
            />
          </div>

          <div>
            <div className={`flex justify-between items-center text-xs font-mono ${t.textMuted} mb-1`}>
              <span>REPEATED COMPILATION:</span>
              {output && (
                <button
                  type="button"
                  onClick={() => onCopy(output, 'rep-val')}
                  className={`text-xs hover:text-indigo-400 inline-flex items-center gap-1 ${t.textMuted} cursor-pointer`}
                >
                  {copiedStatus === 'rep-val' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedStatus === 'rep-val' ? 'Copied Repeats' : 'Copy All'}
                </button>
              )}
            </div>
            
            <textarea
              readOnly
              className={`w-full h-56 p-3 ${t.outputBg} rounded-lg text-xs font-mono opacity-95`}
              value={output}
              placeholder="Repeated sequence will output here in real-time..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 12. TEXT SORTER
function TextSorter({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const t = {
    heading: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textFaint: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-white/5' : 'border-gray-200',
    panelBg: isDark ? 'bg-[#18181b]/95 border-white/5' : 'bg-white border-gray-200',
    controlBg: isDark ? 'bg-[#09090b]/80 border-white/5' : 'bg-gray-50 border-gray-200',
    cardBg: isDark ? 'bg-[#09090c] border-white/5' : 'bg-gray-50 border-gray-200',
    inputBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    textareaBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    outputBg: isDark ? 'bg-[#0a0a0c] border-white/5 text-gray-300 placeholder:text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400',
    selectBg: isDark ? 'bg-[#09090b] border-white/5 text-white' : 'bg-white border-gray-300 text-gray-900',
    copyBtn: isDark ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900',
    label: isDark ? 'text-gray-400' : 'text-gray-600',
    labelFaint: isDark ? 'text-gray-500' : 'text-gray-400',
  };

  const [input, setInput] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'length-asc' | 'length-desc' | 'reverse' | 'shuffle'>('asc');
  const [separator, setSeparator] = useState<'newline' | 'comma'>('newline');
  const [ignoreCase, setIgnoreCase] = useState(true);

  const handleSort = () => {
    if (!input) return '';
    
    let items: string[] = [];
    if (separator === 'comma') {
      items = input.split(',').map(x => x.trim());
    } else {
      items = input.split('\n');
    }
    
    items = items.filter(x => x !== '');

    switch (sortOrder) {
      case 'asc':
        items.sort((a, b) => {
          const compA = ignoreCase ? a.toLowerCase() : a;
          const compB = ignoreCase ? b.toLowerCase() : b;
          return compA.localeCompare(compB);
        });
        break;
      case 'desc':
        items.sort((a, b) => {
          const compA = ignoreCase ? a.toLowerCase() : a;
          const compB = ignoreCase ? b.toLowerCase() : b;
          return compB.localeCompare(compA);
        });
        break;
      case 'length-asc':
        items.sort((a, b) => a.length - b.length);
        break;
      case 'length-desc':
        items.sort((a, b) => b.length - a.length);
        break;
      case 'reverse':
        items.reverse();
        break;
      case 'shuffle':
        for (let i = items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [items[i], items[j]] = [items[j], items[i]];
        }
        break;
    }

    if (separator === 'comma') {
      return items.join(', ');
    }
    return items.join('\n');
  };

  const output = handleSort();

  const badgeClass = isDark
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    : 'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="space-y-6" id="text-sorter-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>TEXT</span>
          Text Sorter
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Order, reverse, or randomize tabular list entries vertical vectors or CSV lists inside browser context safely.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 space-y-4 ${t.panelBg} p-5 rounded-xl text-sm`}>
          <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2 mb-2 font-sans`}>Sorting Controls</h3>
          
          <div className="space-y-3">
            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Sorting Order:</label>
              <select
                value={sortOrder}
                onChange={(e: any) => setSortOrder(e.target.value)}
                className={`w-full p-2.5 ${t.selectBg} rounded-lg text-xs focus:outline-none font-semibold`}
              >
                <option value="asc">A to Z (Ascending)</option>
                <option value="desc">Z to A (Descending)</option>
                <option value="length-asc">Word Length (Short to Long)</option>
                <option value="length-desc">Word Length (Long to Short)</option>
                <option value="reverse">Exactly Reverse Order</option>
                <option value="shuffle">Random Shuffle</option>
              </select>
            </div>

            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Entry Separator:</label>
              <select
                value={separator}
                onChange={(e: any) => setSeparator(e.target.value)}
                className={`w-full p-2.5 ${t.selectBg} rounded-lg text-xs focus:outline-none font-semibold`}
              >
                <option value="newline">Lines boundaries (newline)</option>
                <option value="comma">Separate with commas (,)</option>
              </select>
            </div>

            <label className={`flex items-center gap-2 cursor-pointer font-medium ${t.textMuted} hover:${t.heading} pt-2 border-t ${t.border}`}>
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
                className="rounded border-white/10 text-indigo-650 accent-indigo-600 w-4 h-4 cursor-pointer"
              />
              <span>Ignore Case Differences</span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className={`text-xs font-mono ${t.textMuted} mb-1 block`}>SOURCE LIST:</label>
            <textarea
              className={`w-full h-40 p-3 ${t.textareaBg} rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/20`}
              placeholder={separator === 'newline' ? "Banana\nOrange\nApple\nGrape" : "Banana, Orange, Apple, Grape"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div>
            <div className={`flex justify-between items-center text-xs font-mono ${t.textMuted} mb-1`}>
              <span>SORTED VECTOR RESULT:</span>
              {output && (
                <button
                  type="button"
                  onClick={() => onCopy(output, 'sort-val')}
                  className={`text-xs hover:text-indigo-400 inline-flex items-center gap-1 ${t.textMuted} cursor-pointer`}
                >
                  {copiedStatus === 'sort-val' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedStatus === 'sort-val' ? 'Copied Sorted' : 'Copy Result'}
                </button>
              )}
            </div>
            <textarea
              readOnly
              className={`w-full h-40 p-3 ${t.outputBg} rounded-lg text-xs font-mono`}
              value={output}
              placeholder="Sorted items will appear here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 13. COMMA SEPARATOR
function CommaSeparator({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const t = {
    heading: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textFaint: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-white/5' : 'border-gray-200',
    panelBg: isDark ? 'bg-[#18181b]/95 border-white/5' : 'bg-white border-gray-200',
    controlBg: isDark ? 'bg-[#09090b]/80 border-white/5' : 'bg-gray-50 border-gray-200',
    cardBg: isDark ? 'bg-[#09090c] border-white/5' : 'bg-gray-50 border-gray-200',
    inputBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    textareaBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    outputBg: isDark ? 'bg-[#0a0a0c] border-white/5 text-gray-300 placeholder:text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400',
    selectBg: isDark ? 'bg-[#09090b] border-white/5 text-white' : 'bg-white border-gray-300 text-gray-900',
    copyBtn: isDark ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900',
    label: isDark ? 'text-gray-400' : 'text-gray-600',
    labelFaint: isDark ? 'text-gray-500' : 'text-gray-400',
  };

  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<'column-to-comma' | 'comma-to-column'>('column-to-comma');
  const [stripQuotes, setStripQuotes] = useState(false);
  const [trimValues, setTrimValues] = useState(true);

  const handleProcess = () => {
    if (!input) return '';
    
    if (direction === 'column-to-comma') {
      const items = input.split('\n').map(x => {
        let temp = trimValues ? x.trim() : x;
        if (stripQuotes) {
          temp = temp.replace(/^['"]|['"]$/g, '');
        }
        return temp;
      }).filter(v => v !== '');
      return items.join(', ');
    } else {
      let items = input.split(',').map(x => {
        let temp = trimValues ? x.trim() : x;
        if (stripQuotes) {
          temp = temp.replace(/^['"]|['"]$/g, '');
        }
        return temp;
      });
      return items.join('\n');
    }
  };

  const output = handleProcess();

  const badgeClass = isDark
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    : 'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="space-y-6" id="comma-separator-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>TEXT</span>
          Comma Separator
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Interchange vertical single column metrics with horizontal comma-delimited CSV strings instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 space-y-4 ${t.panelBg} p-5 rounded-xl text-sm`}>
          <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2 mb-2 font-sans`}>Settings</h3>
          
          <div className="space-y-3">
            <div>
              <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Conversion Direction:</label>
              <select
                value={direction}
                onChange={(e: any) => setDirection(e.target.value)}
                className={`w-full p-2.5 ${t.selectBg} rounded-lg text-xs focus:outline-none font-semibold`}
              >
                <option value="column-to-comma">Columns (Newlines) to Commas</option>
                <option value="comma-to-column">Commas to Columns (Newlines)</option>
              </select>
            </div>

            <label className={`flex items-center gap-2 cursor-pointer font-medium ${t.textMuted} hover:${t.heading} pt-2 border-t ${t.border}`}>
              <input
                type="checkbox"
                checked={stripQuotes}
                onChange={(e) => setStripQuotes(e.target.checked)}
                className="rounded border-white/10 text-indigo-650 accent-indigo-600 w-4 h-4 cursor-pointer"
              />
              <span>Strip Outer Quotes (' or ")</span>
            </label>

            <label className={`flex items-center gap-2 cursor-pointer font-medium ${t.textMuted} hover:${t.heading}`}>
              <input
                type="checkbox"
                checked={trimValues}
                onChange={(e) => setTrimValues(e.target.checked)}
                className="rounded border-white/10 text-indigo-650 accent-indigo-600 w-4 h-4 cursor-pointer"
              />
              <span>Trim Whitespace Padding</span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className={`text-xs font-mono ${t.textMuted} mb-1 block`}>INPUT STREAM:</label>
            <textarea
              className={`w-full h-40 p-3 ${t.textareaBg} rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/20`}
              placeholder={direction === 'column-to-comma' ? "Item1\nItem2\nItem3" : "Item1, Item2, Item3"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div>
            <div className={`flex justify-between items-center text-xs font-mono ${t.textMuted} mb-1`}>
              <span>CONVERTED STREAM:</span>
              {output && (
                <button
                  type="button"
                  onClick={() => onCopy(output, 'comma-val')}
                  className={`text-xs hover:text-indigo-400 inline-flex items-center gap-1 ${t.textMuted} cursor-pointer`}
                >
                  {copiedStatus === 'comma-val' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedStatus === 'comma-val' ? 'Copied Output' : 'Copy CSV'}
                </button>
              )}
            </div>
            <textarea
              readOnly
              className={`w-full h-40 p-3 ${t.outputBg} rounded-lg text-xs font-mono`}
              value={output}
              placeholder="Resulting values stream..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}