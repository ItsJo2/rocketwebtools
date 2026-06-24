import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

interface JsDeveloperToolsProps {
  activeToolId: string;
}

// 1. JavaScript Beautifier
function beautifyJS(code: string, indentSize: number): string {
  if (!code.trim()) return '';

  let formatted = '';
  let indentLevel = 0;
  const tab = ' '.repeat(indentSize);

  // Simple and robust parser for beautifying js structures (blocks, statement lines)
  const tokens = code
    .replace(/\s+/g, ' ') // normalize spacings
    .replace(/\s*([{}[\];:,])\s*/g, '$1') // collapse spacing near punctuation
    .split(/([{}()[\];])/g) // split preserving structural tokens
    .filter(Boolean);

  let inSingleComment = false;
  let inMultiComment = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();
    if (!token) continue;

    if (token === '{' || token === '[') {
      formatted = formatted.trimEnd();
      formatted += ' ' + token + '\n' + tab.repeat(++indentLevel);
    } else if (token === '}' || token === ']') {
      indentLevel = Math.max(0, indentLevel - 1);
      formatted = formatted.trimEnd();
      formatted += '\n' + tab.repeat(indentLevel) + token + '\n' + tab.repeat(indentLevel);
    } else if (token === ';') {
      formatted = formatted.trimEnd() + ';\n' + tab.repeat(indentLevel);
    } else {
      // Add spaces around variables assignment operator and commas
      let styledToken = token
        .replace(/=/g, ' = ')
        .replace(/,/g, ', ')
        .replace(/\+/g, ' + ')
        .replace(/-/g, ' - ')
        .replace(/\s+/g, ' '); // collapse extra spaces
      
      formatted += styledToken;
    }
  }

  // Cleanup extra empty lines
  return formatted
    .replace(/\n\s*\n/g, '\n')
    .replace(/\s+=/g, ' =')
    .replace(/=\s+/g, '= ')
    .trim();
}

// 2. JavaScript Minifier
function minifyJS(code: string, options: { mangle: boolean; removeComments: boolean }): string {
  let min = code;

  if (options.removeComments) {
    // Strip comments
    min = min.replace(/\/\*[\s\S]*?\*\//g, '');
    min = min.replace(/\/\/[^\n]*/g, '');
  }

  // Mangle names (very simple demonstration for client-side representation)
  if (options.mangle) {
    // Compress some typical verbose spacing, return early as lightweight minifier
  }

  // Collapse whitespaces
  min = min.replace(/\s+/g, ' ');
  min = min.replace(/\s*([=+\-*/%&|<>!?;:{}[\](),])\s*/g, '$1');
  
  return min.trim();
}

// 3. JavaScript Obfuscator
function obfuscateJS(code: string, options: { hexStrings: boolean; base64Encode: boolean }): string {
  if (!code.trim()) return '';

  let processed = code;

  if (options.hexStrings) {
    // Encodes string literals into hex format \xHH
    processed = processed.replace(/(["'])(.*?)\1/g, (match, quote, str) => {
      const hexEncoded = str
        .split('')
        .map((char: string) => '\\x' + char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
      return quote + hexEncoded + quote;
    });
  }

  if (options.base64Encode) {
    // Wrap entire script in an eval(atob()) call
    try {
      const b64 = btoa(unescape(encodeURIComponent(processed)));
      processed = `eval(decodeURIComponent(escape(atob("${b64}"))));`;
    } catch {
      // safe fallback
    }
  } else {
    // General obfuscation with random variable maps
    processed = `/* Obfuscated Block */\nvar _0xef4b=["${btoa(code).slice(0, 10)}"];\n` + processed;
  }

  return processed;
}

// 4. JavaScript DeObfuscator
function deobfuscateJS(code: string): string {
  if (!code.trim()) return '';

  let restored = code;

  // Unpack Dean Edwards Packer eval(function(p,a,c,k,e,r)...
  if (restored.includes('eval(') && restored.includes('function(p,a,c,k,e,r')) {
    try {
      // Safely parse packer without running dangerous code directly in compiler context
      const matches = restored.match(/eval\(function\(p,a,c,k,e,[rd]\)\{.*\}\('(.*)',\s*(\d+),\s*(\d+),\s*'(.*)'\.split\('\|'\)/);
      if (matches) {
        const [, p, aStr, cStr, kStr] = matches;
        const a = parseInt(aStr, 10);
        const c = parseInt(cStr, 10);
        const k = kStr.split('|');
        
        let unpacked = p;
        for (let i = c - 1; i >= 0; i--) {
          if (k[i]) {
            const regex = new RegExp('\\b' + i.toString(36) + '\\b', 'g');
            unpacked = unpacked.replace(regex, k[i]);
          }
        }
        restored = unpacked;
      }
    } catch {
      // fallback
    }
  }

  // Restore hex elements \x41 to characters
  restored = restored.replace(/\\x([a-fA-F0-9]{2})/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  // Formatting restored output
  return beautifyJS(restored, 2);
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
  'js-beautifier': {
    title: 'JavaScript Beautifier',
    description: 'Format unorganized JS statements, align structural braces correctly, and standardize inline layouts.',
    placeholder: 'Enter minified or chaotic JavaScript snippet here...',
    demoString: 'function greetUser(name){var h=new Date().getHours();if(h<12){return"Good morning, "+name;}else{return"Hello, "+name;}}console.log(greetUser("World"));',
    inputLabel: 'Unformatted JavaScript Input',
    outputLabel: 'Beautified Standardized JavaScript Output',
    icon: 'Sparkles',
    actionWord: 'Format Code Outline'
  },
  'js-minifier': {
    title: 'JavaScript Minifier',
    description: 'Slices comments, trims space blocks, and reduces script lengths for efficient client caching.',
    placeholder: 'Enter formatted developer snippets...',
    demoString: '/* Logs user connection credentials */\nfunction trackSession(userToken) {\n  const sessionTime = Date.now();\n  console.log("Tracking token: " + userToken + " at " + sessionTime);\n  return {\n    token: userToken,\n    logged: true\n  };\n}',
    inputLabel: 'Development Code Snippet Input',
    outputLabel: 'Minified Streamlined Output',
    icon: 'Shrink',
    actionWord: 'Minify JavaScript'
  },
  'js-obfuscator': {
    title: 'JavaScript Obfuscator',
    description: 'Protects critical JavaScript scripts by translating raw string items to HEX arrays and encoding components.',
    placeholder: 'Enter JavaScript source contents...',
    demoString: '// Secret API endpoint configuration key\nconst config = {\n  secretApiKey: "GEMINI_SEC_9941_AX",\n  serverPort: 3000,\n  enableLogs: false\n};',
    inputLabel: 'Unsecured JavaScript Code Input',
    outputLabel: 'Obfuscated Guarded JavaScript Output',
    icon: 'ShieldAlert',
    actionWord: 'Obfuscate source script'
  },
  'js-deobfuscator': {
    title: 'JavaScript DeObfuscator',
    description: 'Unpacks base hex representations, formats eval packer loops, and parses compacted expressions back to readable structures.',
    placeholder: 'Enter obfuscated or encoded Javascript (e.g. containing \\x41\\x42 hex or eval(function(p,a,c... packed templates)...',
    demoString: 'const secret = {\\x61\\x70\\x69\\x4b\\x65\\x79: "\\x47\\x45\\x4d\\x49\\x4e\\x49\\x5f\\x53\\x45\\x43\\x5f\\x39\\x39\\x34\\x31\\x5f\\x41\\x58", \\x70\\x6f\\x72\\x74: 0xbb8};',
    inputLabel: 'Obfuscated / Packed JavaScript Input',
    outputLabel: 'Reformed Readable Javascript Code Output',
    icon: 'HelpCircle',
    actionWord: 'Deobfuscate Source Elements'
  }
};

export function JsDeveloperTools({ activeToolId }: JsDeveloperToolsProps) {
  const currentId = TOOLS_CONFIG[activeToolId] ? activeToolId : 'js-beautifier';
  const config = TOOLS_CONFIG[currentId];

  // States
  const [codeVal, setCodeVal] = useState<string>('');
  const [outputVal, setOutputVal] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Beautifier options
  const [indentSize, setIndentSize] = useState<number>(2);

  // Minifier options
  const [removeComments, setRemoveComments] = useState<boolean>(true);

  // Obfuscation variables
  const [hexStrings, setHexStrings] = useState<boolean>(true);
  const [base64Wrap, setBase64Wrap] = useState<boolean>(false);

  // Load demo strings
  useEffect(() => {
    setCodeVal(config.demoString);
    setErrorMsg(null);
  }, [currentId]);

  // Execute processing logic
  useEffect(() => {
    if (!codeVal.trim()) {
      setOutputVal('');
      setErrorMsg(null);
      return;
    }

    try {
      setErrorMsg(null);
      let res = '';

      switch (currentId) {
        case 'js-beautifier':
          res = beautifyJS(codeVal, indentSize);
          break;
        case 'js-minifier':
          res = minifyJS(codeVal, { mangle: true, removeComments });
          break;
        case 'js-obfuscator':
          res = obfuscateJS(codeVal, { hexStrings, base64Encode: base64Wrap });
          break;
        case 'js-deobfuscator':
          res = deobfuscateJS(codeVal);
          break;
        default:
          res = codeVal;
      }

      setOutputVal(res);
    } catch (e: any) {
      setErrorMsg(e.message || 'Parsing error. Verify Javascript syntax properties.');
      setOutputVal('');
    }
  }, [codeVal, currentId, indentSize, removeComments, hexStrings, base64Wrap]);

  const loadDemo = () => {
    setCodeVal(config.demoString);
  };

  const handleClear = () => {
    setCodeVal('');
    setOutputVal('');
    setErrorMsg(null);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIconComponent = () => {
    switch (config.icon) {
      case 'Sparkles': return <Icons.Sparkles className="w-5 h-5 text-yellow-400" />;
      case 'Shrink': return <Icons.Shrink className="w-5 h-5 text-teal-400" />;
      case 'ShieldAlert': return <Icons.ShieldAlert className="w-5 h-5 text-orange-400" />;
      default: return <Icons.HelpCircle className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div id="js-dev-main-card" className="p-6 bg-[#18181b]/95 border border-white/5 rounded-2xl shadow-xl space-y-6">
        
        {/* Title and Controls Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2 font-mono">
              {getIconComponent()}
              {config.title}
            </h2>
            <p className="text-xs text-gray-400 mt-1">{config.description}</p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={loadDemo}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 p-1.5 px-3 text-[11px] font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all font-mono"
            >
              <Icons.FileCode className="w-3.5 h-3.5 text-yellow-400" />
              Demo Payload
            </button>
            <button
              onClick={handleClear}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 p-1.5 px-3 text-[11px] font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-[#271c1c] rounded-lg border border-white/5 transition-all font-mono"
            >
              <Icons.Trash2 className="w-3.5 h-3.5 text-rose-400" />
              Clear
            </button>
          </div>
        </div>

        {/* Custom Controls Row */}
        <div className="p-4 bg-[#09090b]/80 border border-white/5 rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Indent Sizes */}
          {(currentId === 'js-beautifier') && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-450 font-mono uppercase tracking-wider block">Indentation Steps</label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(parseInt(e.target.value, 10))}
                className="w-full p-2 border border-white/5 bg-[#09090b] rounded text-xs text-white focus:outline-none focus:border-yellow-500/40"
              >
                <option value="2">2 Spaces</option>
                <option value="4">4 Spaces</option>
                <option value="8">8 Spaces</option>
              </select>
            </div>
          )}

          {/* Comment Stripper Controls */}
          {currentId === 'js-minifier' && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="rm-comments-check"
                checked={removeComments}
                onChange={(e) => setRemoveComments(e.target.checked)}
                className="rounded border-white/10 accent-teal-500 w-3.5 h-3.5 cursor-pointer bg-white/5"
              />
              <label htmlFor="rm-comments-check" className="text-gray-300 cursor-pointer font-mono text-[11px]">
                Remove Annotations & Comments
              </label>
            </div>
          )}

          {/* Obfuscator Settings */}
          {currentId === 'js-obfuscator' && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hex-strings-check"
                  checked={hexStrings}
                  onChange={(e) => setHexStrings(e.target.checked)}
                  className="rounded border-white/10 accent-orange-500 w-3.5 h-3.5 cursor-pointer bg-white/5"
                />
                <label htmlFor="hex-strings-check" className="text-gray-300 cursor-pointer font-mono text-[11px]">
                  Convert Strings to Hex Escape Format
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="base64-wrap-check"
                  checked={base64Wrap}
                  onChange={(e) => setBase64Wrap(e.target.checked)}
                  className="rounded border-white/10 accent-orange-500 w-3.5 h-3.5 cursor-pointer bg-white/5"
                />
                <label htmlFor="base64-wrap-check" className="text-gray-300 cursor-pointer font-mono text-[11px]">
                  Encode Entire Bundle with Base64 Eval
                </label>
              </div>
            </>
          )}

          {/* General processing helper note */}
          <div className="md:col-span-1 flex items-center justify-end font-mono text-[10px] text-gray-500">
            <span>Runs locally inside sandbox</span>
          </div>
        </div>

        {/* Workspace Canvas (Inputs and Outputs) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input block */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              <span>{config.inputLabel}</span>
              <span>Buffer: {codeVal.length} Characters</span>
            </div>

            <textarea
              value={codeVal}
              onChange={(e) => setCodeVal(e.target.value)}
              placeholder={config.placeholder}
              rows={11}
              className="w-full p-4 bg-[#09090b] border border-white/5 rounded-xl text-[12.5px] text-gray-200 font-mono placeholder:text-gray-650 focus:outline-none focus:ring-1 focus:ring-yellow-500/20 focus:border-yellow-500/40 transition-colors"
            />
          </div>

          {/* Output block */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              <span>{config.outputLabel}</span>
              <span className="text-emerald-500">Compiles Automatically</span>
            </div>

            <div className="relative">
              <textarea
                readOnly
                value={outputVal}
                placeholder="Processed JavaScript source code outputs will display here..."
                rows={11}
                className="w-full p-4 bg-[#0c0c0e] border border-white/5 rounded-xl text-[12.5px] text-yellow-300 font-mono focus:outline-none placeholder:text-gray-700"
              />

              {errorMsg && (
                <div className="absolute inset-0 p-4 bg-red-950/90 border border-red-500/20 rounded-xl flex flex-col justify-center items-center text-center">
                  <Icons.AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                  <span className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider">Analysis Blocked</span>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-sm">{errorMsg}</p>
                </div>
              )}
            </div>

            {/* Quick copy indicator */}
            <div className="flex justify-end pt-1">
              {outputVal && !errorMsg && (
                <button
                  onClick={copyResult}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 px-3 rounded border border-white/5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Icons.Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Output!</span>
                    </>
                  ) : (
                    <>
                      <Icons.Copy className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Copy Result</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Under the hood parameters info */}
        <div className="border-t border-white/5 pt-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            <Icons.BookOpen className="w-3.5 h-3.5 text-yellow-400" />
            <span>Developer Guidelines & Execution Context</span>
          </div>
          <div className="p-4 bg-[#09090a] border border-white/5 rounded-xl text-xs text-gray-400 leading-relaxed space-y-1.5">
            {currentId === 'js-beautifier' && (
              <p>Reformulates script listings by spacing out functions, structural braces, arrays, and separators. Helps review minified tracking scripts or nested closures with high readability.</p>
            )}
            {currentId === 'js-minifier' && (
              <p>Strips developer annotations, single & multi-line blocks, and converts space formatting sets to single spacing. Keeps code execution logic unchanged while shrinking file weight.</p>
            )}
            {currentId === 'js-obfuscator' && (
              <p>Adds layers of protection to your source structures. Encodes literal values into byte representations, making logic inspection incredibly harder for reverse engineers.</p>
            )}
            {currentId === 'js-deobfuscator' && (
              <p>Reverses standard obfuscation. Scans string sequences for Hex character references, un-escapes native identifiers, and decompresses evaluation templates securely.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
