import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

interface WebMgmtToolsProps {
  activeToolId: string;
  isDark: boolean;
}

// Beautifier and Minifier engines
function beautifyHTML(html: string, indentSize: number): string {
  let result = '';
  let level = 0;
  const tab = ' '.repeat(indentSize);

  const tokens = html.match(/(<[^>]+>|[^<]+)/g) || [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const trimmed = token.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('<!--')) {
      result += '\n' + tab.repeat(level) + trimmed;
    } else if (trimmed.startsWith('</')) {
      level = Math.max(0, level - 1);
      result = result.trimEnd();
      result += '\n' + tab.repeat(level) + trimmed;
    } else if (trimmed.startsWith('<') && trimmed.endsWith('/>')) {
      result += '\n' + tab.repeat(level) + trimmed;
    } else if (trimmed.startsWith('<') && trimmed.startsWith('<!')) {
      result += '\n' + tab.repeat(level) + trimmed;
    } else if (trimmed.startsWith('<')) {
      const tagNameMatch = trimmed.match(/^<([a-zA-Z0-9:-]+)/);
      const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';
      const isVoid = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(tagName);

      const nextToken = tokens[i + 1]?.trim() || '';
      const isInlineClosing = nextToken === `</${tagName}>`;
      const isTextNode = nextToken && !nextToken.startsWith('<');
      const isNextNextClosing = isTextNode && (tokens[i + 2]?.trim() === `</${tagName}>`);

      if (isInlineClosing) {
        result += '\n' + tab.repeat(level) + trimmed + nextToken;
        i++;
      } else if (isNextNextClosing) {
        result += '\n' + tab.repeat(level) + trimmed + tokens[i + 1].trim() + tokens[i + 2].trim();
        i += 2;
      } else {
        result += '\n' + tab.repeat(level) + trimmed;
        if (!isVoid) {
          level++;
        }
      }
    } else {
      result += '\n' + tab.repeat(level) + trimmed;
    }
  }

  return result.trim();
}

function minifyHTML(html: string, options: { removeComments: boolean; collapseWhitespace: boolean }): string {
  let minified = html;
  
  if (options.removeComments) {
    minified = minified.replace(/<!--[\s\S]*?-->/g, '');
  }
  
  if (options.collapseWhitespace) {
    minified = minified.replace(/\s+/g, ' ');
    minified = minified.replace(/>\s+</g, '><');
  }

  return minified.trim();
}

function beautifyCSS(css: string, indentSize: number): string {
  let clean = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};:])\s*/g, '$1')
    .trim();

  let result = '';
  let level = 0;
  const tab = ' '.repeat(indentSize);

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (char === '{') {
      result += ' {\n' + tab.repeat(++level);
    } else if (char === '}') {
      level = Math.max(0, level - 1);
      result = result.trimEnd();
      result += '\n' + tab.repeat(level) + '}\n' + tab.repeat(level);
    } else if (char === ';') {
      if (i < clean.length - 1 && clean[i + 1] !== '}') {
        result += ';\n' + tab.repeat(level);
      } else {
        result += ';';
      }
    } else if (char === ':') {
      result += ': ';
    } else if (char === ',') {
      result += ', ';
    } else {
      result += char;
    }
  }

  return result.replace(/\n\s*\n/g, '\n').trim();
}

function minifyCSS(css: string): string {
  let min = css.replace(/\/\*[\s\S]*?\*\//g, '');
  min = min.replace(/\s+/g, ' ');
  min = min.replace(/\s*([{};:,])\s*/g, '$1');
  min = min.replace(/;}/g, '}');
  return min.trim();
}

const HTML_ENTITIES_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#x60;',
  '/': '&#x2F;'
};

const HTML_DECODE_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x39;': "'",
  '&#x60;': '`',
  '&#x2F;': '/',
  '&apos;': "'"
};

function encodeHTML(text: string, encodeAllNonAscii: boolean): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (HTML_ENTITIES_MAP[char]) {
      result += HTML_ENTITIES_MAP[char];
    } else if (encodeAllNonAscii && char.charCodeAt(0) > 127) {
      result += `&#${char.charCodeAt(0)};`;
    } else {
      result += char;
    }
  }
  return result;
}

function decodeHTML(html: string): string {
  let decoded = html;
  for (const [key, val] of Object.entries(HTML_DECODE_MAP)) {
    decoded = decoded.replace(new RegExp(key, 'g'), val);
  }
  decoded = decoded.replace(/&#(\d+);/g, (_, numStr) => {
    try {
      return String.fromCharCode(parseInt(numStr, 10));
    } catch {
      return '';
    }
  });
  decoded = decoded.replace(/&#x([a-fA-F0-9]+);/g, (_, hexStr) => {
    try {
      return String.fromCharCode(parseInt(hexStr, 16));
    } catch {
      return '';
    }
  });
  return decoded;
}

const TOOLS_CONFIG: Record<string, {
  title: string;
  description: string;
  placeholder: string;
  demoString: string;
  inputLabel: string;
  outputLabel: string;
  icon: string;
  actionWord: string;
}> = {
  'html-decode': {
    title: 'HTML Decode',
    description: 'Convert safe HTML entities (like &lt; or &amp;) back into regular characters (< and &).',
    placeholder: 'Enter encoded HTML entities (e.g. &lt;h1 class=&quot;title&quot;&gt;Hello&lt;/h1&gt;)',
    demoString: '&lt;div id=&quot;hero&quot;&gt;\n  &lt;h1&gt;Welcome &amp;amp; Enjoy!&lt;/h1&gt;\n  &lt;p&gt;Prices start at &#39;$9.99&#39; &amp;bull; Get yours now&lt;/p&gt;\n&lt;/div&gt;',
    inputLabel: 'Encoded HTML Entities Input',
    outputLabel: 'Decoded Clean HTML Output',
    icon: 'Terminal',
    actionWord: 'Decode HTML Entities'
  },
  'html-encode': {
    title: 'HTML Encode',
    description: 'Convert special symbols and HTML markup characters into equivalent entity references to safely display in code blocks.',
    placeholder: 'Enter standard HTML or plain text (e.g. <div class="main">)',
    demoString: '<article id="main-content" data-load="true">\n  <h2>Top Developer Tips for 2026 & Beyond</h2>\n  <p className="description">Always encode templates & prevent "XSS vulnerability"!</p>\n</article>',
    inputLabel: 'Plain HTML / Text Input',
    outputLabel: 'Encoded Safe HTML Entities Output',
    icon: 'Code',
    actionWord: 'Encode to HTML Entities'
  },
  'url-decode': {
    title: 'URL Decode',
    description: 'Convert percent-encoded URL query patterns back to readable plain strings with space symbols restoration.',
    placeholder: 'Enter percent-encoded URL payload (e.g. https%3A%2F%2Fgoogle.com%3Fq%3Dvite%2Breact)',
    demoString: 'https%3A%2F%2Fapi.studios.dev%3Fclient%3Dgoogle%26title%3DBuilding%2520Beautiful%2520UIs%26token%3Dxyz123%2524%2523',
    inputLabel: 'Percent-Encoded URL / Query',
    outputLabel: 'Decoded Human Readable URL',
    icon: 'Unlink',
    actionWord: 'Decode URL Parameter'
  },
  'url-encode': {
    title: 'URL Encode',
    description: 'Transform special domain query markers and space tokens into safe standard percent-encoded parameters.',
    placeholder: 'Enter standard Web address or query arguments to encode safely',
    demoString: 'https://api.studios.dev/v2/search?query=React & Vite UI kits!&filters={"status":"complete","price":"$10.00"}',
    inputLabel: 'Decoded URL / Query Parameters Input',
    outputLabel: 'Percent-Encoded URL Output',
    icon: 'Link',
    actionWord: 'Encode URL Parameters'
  },
  'html-beautifier': {
    title: 'HTML Beautifier',
    description: 'Re-indent custom tag layouts, separate line alignments, and clean up nested document hierarchies.',
    placeholder: 'Enter messy or minified HTML strings here...',
    demoString: '<div class="card"><header><h3>Web Tools</h3></header><main><p>This tool formats HTML smoothly!</p><img src="thumb.webp"/><input type="text" placeholder="Your email"/></main><footer>&copy; 2026</footer></div>',
    inputLabel: 'Messy / Minified HTML Input',
    outputLabel: 'Beautified Structured HTML',
    icon: 'Sparkles',
    actionWord: 'Format & Re-indent HTML'
  },
  'html-minifier': {
    title: 'HTML Minifier',
    description: 'Compress web pages by shedding comments, empty lines, and excessive whitespaces to accelerate loading speeds.',
    placeholder: 'Enter formatted or messy HTML templates...',
    demoString: '<!-- Hero section wrapper -->\n<section id="hero" class="bg-gray-900 text-white font-sans">\n  <div class="container mx-auto px-6 py-12">\n    <h1 class="text-4xl font-bold tracking-tight text-center">\n      Ultimate Build Master Toolkit\n    </h1>\n    \n    <p class="text-lg text-gray-300 mt-4 text-center max-w-2xl mx-auto">\n      All essential utilities right at your fingertips. All processing happens 100% locally.\n    </p>\n  </div>\n</section>',
    inputLabel: 'Standard HTML Code Input',
    outputLabel: 'Compressed Minified HTML',
    icon: 'Shrink',
    actionWord: 'Compress HTML Source'
  },
  'css-beautifier': {
    title: 'CSS Beautifier',
    description: 'Inject modern spacing, align declaration brackets, and align multiple CSS utility rules.',
    placeholder: 'Enter minified or unformatted CSS rules...',
    demoString: '.btn{display:inline-flex;align-items:center;padding:0.75rem 1.5rem;font-weight:600;border-radius:0.5rem;color:#ffffff;background-color:#0284c7;transition:all 150ms ease-in-out}.btn:hover{background-color:#0369a1}.icon{margin-right:0.5rem;width:1.25rem;height:1.25rem}',
    inputLabel: 'Minified CSS Rules Input',
    outputLabel: 'Beautified Structured CSS Code',
    icon: 'Brush',
    actionWord: 'Beautify CSS Structure'
  },
  'css-minifier': {
    title: 'CSS Minifier',
    description: 'Shrink stylesheet bundles by removing annotations, comments, and redundant spacing coordinates.',
    placeholder: 'Enter heavy or formatted CSS stylesheets...',
    demoString: '/* Target UI Button Component rules styling */\n.interactive-card {\n  display: flex;\n  flex-direction: column;\n  padding: 1.5rem;\n  margin-bottom: 2rem;\n  background-color: rgb(24 24 27);\n  border: 1px solid rgba(255, 255, 255, 0.05);\n  border-radius: 1rem;\n  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);\n}\n\n.interactive-card:hover {\n  border-color: rgba(16, 185, 129, 0.2);\n}',
    inputLabel: 'Uncompressed CSS Stylesheet Input',
    outputLabel: 'Minified Compressed CSS',
    icon: 'Activity',
    actionWord: 'Minify CSS Declarations'
  }
};

export function WebMgmtTools({ activeToolId, isDark }: WebMgmtToolsProps) {
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

  const currentId = TOOLS_CONFIG[activeToolId] ? activeToolId : 'html-decode';
  const config = TOOLS_CONFIG[currentId];

  const [inputVal, setInputVal] = useState<string>('');
  const [outputVal, setOutputVal] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [encodeNonAscii, setEncodeNonAscii] = useState<boolean>(false);
  const [encodeSpacesAsPluses, setEncodeSpacesAsPluses] = useState<boolean>(false);
  const [indentSize, setIndentSize] = useState<number>(2);
  const [stripCommentsOnMinify, setStripCommentsOnMinify] = useState<boolean>(true);
  const [collapseWhitespaceOnMinify, setCollapseWhitespaceOnMinify] = useState<boolean>(true);

  const [inputSize, setInputSize] = useState<number>(0);
  const [outputSize, setOutputSize] = useState<number>(0);
  const [compressionRatio, setCompressionRatio] = useState<string>('0%');

  useEffect(() => {
    setInputVal(config.demoString);
    setErrorMsg(null);
  }, [currentId]);

  useEffect(() => {
    if (!inputVal) {
      setOutputVal('');
      setErrorMsg(null);
      setInputSize(0);
      setOutputSize(0);
      setCompressionRatio('0%');
      return;
    }

    try {
      setErrorMsg(null);
      let calculatedVal = '';

      switch (currentId) {
        case 'html-decode':
          calculatedVal = decodeHTML(inputVal);
          break;
        case 'html-encode':
          calculatedVal = encodeHTML(inputVal, encodeNonAscii);
          break;
        case 'url-decode':
          try {
            calculatedVal = decodeURIComponent(inputVal.replace(/\+/g, ' '));
          } catch {
            calculatedVal = decodeURIComponent(inputVal);
          }
          break;
        case 'url-encode':
          calculatedVal = encodeURIComponent(inputVal);
          if (encodeSpacesAsPluses) {
            calculatedVal = calculatedVal.replace(/%20/g, '+');
          }
          break;
        case 'html-beautifier':
          calculatedVal = beautifyHTML(inputVal, indentSize);
          break;
        case 'html-minifier':
          calculatedVal = minifyHTML(inputVal, {
            removeComments: stripCommentsOnMinify,
            collapseWhitespace: collapseWhitespaceOnMinify
          });
          break;
        case 'css-beautifier':
          calculatedVal = beautifyCSS(inputVal, indentSize);
          break;
        case 'css-minifier':
          calculatedVal = minifyCSS(inputVal);
          break;
        default:
          calculatedVal = inputVal;
      }

      setOutputVal(calculatedVal);

      const inB = new Blob([inputVal]).size;
      const outB = new Blob([calculatedVal]).size;
      setInputSize(inB);
      setOutputSize(outB);

      if (inB > 0) {
        const diff = inB - outB;
        const pct = ((diff / inB) * 100).toFixed(1);
        setCompressionRatio(parseFloat(pct) > 0 ? `${pct}% compressed` : `${Math.abs(parseFloat(pct)).toFixed(1)}% expanded`);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Syntax Error processing current web format.');
      setOutputVal('');
    }
  }, [inputVal, currentId, encodeNonAscii, encodeSpacesAsPluses, indentSize, stripCommentsOnMinify, collapseWhitespaceOnMinify]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadDemo = () => {
    setInputVal(config.demoString);
  };

  const handleClear = () => {
    setInputVal('');
    setOutputVal('');
    setErrorMsg(null);
  };

  const getIcon = () => {
    switch (config.icon) {
      case 'Terminal': return <Icons.Terminal className="w-5 h-5 text-teal-400" />;
      case 'Code': return <Icons.Code className="w-5 h-5 text-teal-400" />;
      case 'Unlink': return <Icons.Unlink className="w-5 h-5 text-teal-400" />;
      case 'Link': return <Icons.Link className="w-5 h-5 text-teal-400" />;
      case 'Sparkles': return <Icons.Sparkles className="w-5 h-5 text-teal-400" />;
      case 'Shrink': return <Icons.Shrink className="w-5 h-5 text-teal-400" />;
      case 'Brush': return <Icons.Brush className="w-5 h-5 text-teal-400" />;
      default: return <Icons.Activity className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div id="web-mgmt-main-card" className={`p-6 ${t.panelBg} rounded-2xl shadow-xl space-y-6`}>
        
        {/* Header Block */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b ${t.border} pb-4`}>
          <div>
            <h2 className={`text-base font-semibold ${t.heading} tracking-tight flex items-center gap-2 font-mono select-none`}>
              {getIcon()}
              {config.title}
            </h2>
            <p className={`text-xs ${t.textMuted} mt-1`}>{config.description}</p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={loadDemo}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 p-1.5 px-3 text-[11px] font-medium ${t.textMuted} hover:${t.heading} ${t.controlBg} hover:bg-white/10 rounded-lg border ${t.border} transition-all font-mono`}
            >
              <Icons.FileCode className="w-3.5 h-3.5 text-teal-400" />
              Demo Payload
            </button>
            <button
              onClick={handleClear}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 p-1.5 px-3 text-[11px] font-medium ${t.textMuted} hover:${t.heading} ${t.controlBg} hover:bg-[#271c1c] rounded-lg border ${t.border} transition-all font-mono`}
            >
              <Icons.Trash2 className="w-3.5 h-3.5 text-rose-400" />
              Clear
            </button>
          </div>
        </div>

        {/* Customized config panel depending on active tool */}
        <div className={`p-4 ${t.controlBg} rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs`}>
          
          {(currentId === 'html-beautifier' || currentId === 'css-beautifier') && (
            <div className="space-y-1">
              <label className={`text-[10px] font-bold ${t.textMuted} font-mono uppercase tracking-wider block`}>Indentation Customization</label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(parseInt(e.target.value, 10))}
                className={`w-full p-2 ${t.selectBg} rounded focus:outline-none focus:border-teal-500/40`}
              >
                <option value="2">2 Spaces</option>
                <option value="4">4 Spaces</option>
                <option value="8">8 Spaces</option>
              </select>
            </div>
          )}

          {currentId === 'html-encode' && (
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="non-ascii-check"
                checked={encodeNonAscii}
                onChange={(e) => setEncodeNonAscii(e.target.checked)}
                className="rounded border-white/10 accent-teal-500 w-3.5 h-3.5 cursor-pointer bg-white/5"
              />
              <label htmlFor="non-ascii-check" className={`${t.textMuted} cursor-pointer font-mono text-[11px]`}>
                Encode all Non-ASCII Characters
              </label>
            </div>
          )}

          {currentId === 'url-encode' && (
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="space-encode-check"
                checked={encodeSpacesAsPluses}
                onChange={(e) => setEncodeSpacesAsPluses(e.target.checked)}
                className="rounded border-white/10 accent-teal-500 w-3.5 h-3.5 cursor-pointer bg-white/5"
              />
              <label htmlFor="space-encode-check" className={`${t.textMuted} cursor-pointer font-mono text-[11px]`}>
                Represent Spaces as Plus signs (<code>+</code>)
              </label>
            </div>
          )}

          {currentId === 'html-minifier' && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="strip-comments-check"
                  checked={stripCommentsOnMinify}
                  onChange={(e) => setStripCommentsOnMinify(e.target.checked)}
                  className="rounded border-white/10 accent-teal-500 w-3.5 h-3.5 cursor-pointer bg-white/5"
                />
                <label htmlFor="strip-comments-check" className={`${t.textMuted} cursor-pointer font-mono text-[11px]`}>
                  Strip Document Comments
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="collapse-ws-check"
                  checked={collapseWhitespaceOnMinify}
                  onChange={(e) => setCollapseWhitespaceOnMinify(e.target.checked)}
                  className="rounded border-white/10 accent-teal-500 w-3.5 h-3.5 cursor-pointer bg-white/5"
                />
                <label htmlFor="collapse-ws-check" className={`${t.textMuted} cursor-pointer font-mono text-[11px]`}>
                  Collapse Whitespaces / Gaps
                </label>
              </div>
            </>
          )}

          <div className="lg:col-span-1 flex flex-col justify-center font-mono text-[10px] ${t.textFaint} space-y-0.5">
            <div>Input Size: <strong className={t.heading}>{inputSize} Bytes</strong></div>
            <div>Output Size: <strong className={t.heading}>{outputSize} Bytes</strong></div>
            {inputSize > 0 && (
              <div className="text-teal-400 font-bold">{compressionRatio}</div>
            )}
          </div>
        </div>

        {/* Input/Output Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input Panel */}
          <div className="space-y-2">
            <div className={`flex justify-between items-center text-[10px] font-mono ${t.textFaint} uppercase tracking-widest`}>
              <span>{config.inputLabel}</span>
              <span>Length: {inputVal.length} Chars</span>
            </div>

            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={config.placeholder}
              rows={9}
              className={`w-full p-4 ${t.textareaBg} rounded-xl text-[12.5px] font-mono focus:outline-none focus:ring-1 focus:ring-teal-500/20 focus:border-teal-500/40 transition-colors`}
            />
          </div>

          {/* Output Panel */}
          <div className="space-y-2">
            <div className={`flex justify-between items-center text-[10px] font-mono ${t.textFaint} uppercase tracking-widest`}>
              <span>{config.outputLabel}</span>
              <span>COMPLETED COMPILATION</span>
            </div>

            <div className="relative">
              <textarea
                readOnly
                value={outputVal}
                placeholder="Transformed web content will reflect here in real-time..."
                rows={9}
                className={`w-full p-4 ${t.outputBg} rounded-xl text-[12.5px] font-mono focus:outline-none placeholder:text-gray-400`}
              />

              {errorMsg && (
                <div className="absolute inset-0 p-4 bg-red-950/90 border border-red-500/20 rounded-xl flex flex-col justify-center items-center text-center">
                  <Icons.AlertCircle className="w-8 h-8 text-red-400 mb-2" />
                  <span className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider">Transformation Failed</span>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-xs">{errorMsg}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              {outputVal && !errorMsg && (
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 text-[10px] font-mono ${t.textMuted} hover:${t.heading} ${t.copyBtn} p-1.5 px-3 rounded border ${t.border} transition-colors`}
                >
                  {copied ? (
                    <>
                      <Icons.Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Output!</span>
                    </>
                  ) : (
                    <>
                      <Icons.Copy className="w-3.5 h-3.5 text-teal-400" />
                      <span>Copy Result</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Explaining matching algorithm rules */}
        <div className={`border-t ${t.border} pt-4 space-y-2`}>
          <div className={`flex items-center gap-1.5 text-[10px] font-mono ${t.textMuted} uppercase tracking-widest`}>
            <Icons.BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span>Under the hood - execution standards</span>
          </div>
          <div className={`p-4 ${t.controlBg} rounded-xl text-xs ${t.textMuted} leading-relaxed font-sans space-y-1.5`}>
            {currentId === 'html-decode' && (
              <p>Uses recursive mapping arrays translating nested entities. Correctly maps classic entities like <code>&amp;lt;</code>, hexadecimal indicators (e.g. <code>&amp;#x3a;</code>), and base-10 indices back into native UTF-8 symbols.</p>
            )}
            {currentId === 'html-encode' && (
              <p>Renders special markup markers harmless by substituting browser active tokens. Prevents template code rendering glitches and mitigates Cross-Site Scripting (XSS) concerns in static displays.</p>
            )}
            {currentId === 'url-decode' && (
              <p>Re-sequences standard percent-encoded packages using Javascript browser specifications. Converts symbol additions like <code>%20</code> or legacy plus marks (<code>+</code>) back to native whitespace characters.</p>
            )}
            {currentId === 'url-encode' && (
              <p>Applies standard RFC-3986 percentage encoding directives to allow Web routers or APIs to parse intricate parameter values, spaces, brackets, or foreign alphabets securely.</p>
            )}
            {currentId === 'html-beautifier' && (
              <p>Decodes and organizes nested elements by tracking open/closing tags of the DOM structures. Preserves valid inline content and prevents collapsing on non-void parameters under standard HTML parsing stack definitions.</p>
            )}
            {currentId === 'html-minifier' && (
              <p>Consolidates page sizes. Stripping HTML statements ensures lighter payload profiles while preserving layout definitions during rendering sequences.</p>
            )}
            {currentId === 'css-beautifier' && (
              <p>Re-indents CSS declarations. Organizes styling brackets and ensures nested selectors format consistently for high maintenance confidence.</p>
            )}
            {currentId === 'css-minifier' && (
              <p>Optimizes CSS stylesheets by removing spacing gaps, removing trailing semicolons, and purging layout explanations, significantly streamlining network performance transfer metrics.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}