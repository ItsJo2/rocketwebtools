import { useState, useEffect } from 'react';
import { Copy, Check, RotateCcw, AlertCircle, Sparkles, Terminal } from 'lucide-react';

export function CodeTools({ activeToolId }: { activeToolId: string }) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(id);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  if (activeToolId === 'json-formatter') {
    return <JsonFormatter onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'base64') {
    return <Base64Tool onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'base64-encode') {
    return <Base64Tool onCopy={handleCopy} copiedStatus={copiedStatus} initialMode="encode" />;
  }
  if (activeToolId === 'base64-decode') {
    return <Base64Tool onCopy={handleCopy} copiedStatus={copiedStatus} initialMode="decode" />;
  }
  if (activeToolId === 'html-url') {
    return <HtmlUrlEncoder onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'hash-gen' || activeToolId === 'md5-gen') {
    return <HashGenerator onCopy={handleCopy} copiedStatus={copiedStatus} activeToolId={activeToolId} />;
  }

  return null;
}

// 1. JSON FORMATTER & VALIDATOR
function JsonFormatter({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState('2');

  const handleFormat = (minify = false) => {
    if (!input.trim()) {
      setError('Please provide some JSON data in the input box.');
      setOutput('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const space = minify ? 0 : parseInt(indent, 10);
      const formatted = JSON.stringify(parsed, null, space === 0 ? undefined : space);
      setOutput(formatted);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Invalid JSON format');
      setOutput('');
    }
  };

  const loadDemo = () => {
    const demo = {
      name: "John Doe",
      age: 28,
      status: "active",
      preferences: {
        theme: "dark",
        notifications: true,
        languages: ["typescript", "rust", "go"]
      },
      skills: [
        { name: "Frontend", level: "Senior" },
        { name: "Backend", level: "Mid" }
      ]
    };
    setInput(JSON.stringify(demo));
    setError(null);
    setOutput('');
  };

  return (
    <div className="space-y-6" id="json-formatter-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="p-1 px-2 text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">DEV</span>
            JSON Formatter & Validator
          </h2>
          <p className="text-sm text-gray-400">Validate, beautify, formatting or minifying messy JSON instantly.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <label className="text-gray-400 font-medium">Spaces:</label>
          <select 
            value={indent} 
            onChange={(e) => setIndent(e.target.value)}
            className="p-1.5 px-3 border border-white/10 rounded text-sm bg-[#161616] text-white focus:outline-none focus:ring-1 focus:ring-indigo-650 cursor-pointer"
          >
            <option value="2">2 Spaces</option>
            <option value="4">4 Spaces</option>
            <option value="8">8 Spaces</option>
          </select>
          <button 
            type="button"
            onClick={loadDemo}
            className="p-1.5 px-3 bg-white/5 text-gray-300 hover:bg-white/10 rounded border border-white/10 transition-colors cursor-pointer text-xs font-semibold"
          >
            Demo JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="flex flex-col">
          <label className="text-xs font-mono text-gray-400 mb-1.5 block">INPUT STRING:</label>
          <textarea
            className="w-full h-80 p-4 border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-650/20 focus:border-indigo-650 bg-[#161616] text-white placeholder-gray-600"
            placeholder="Paste your raw JSON text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="mt-3 flex gap-2">
            <button 
              type="button"
              onClick={() => handleFormat(false)}
              className="flex-grow p-2.5 bg-indigo-650 text-white hover:bg-indigo-850 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
            >
              Beautify JSON
            </button>
            <button 
              type="button"
              onClick={() => handleFormat(true)}
              className="flex-grow p-2.5 bg-[#252525] border border-white/5 text-white hover:bg-[#333333] rounded-lg font-semibold text-sm transition-colors cursor-pointer"
            >
              Minify JSON
            </button>
            <button 
              type="button"
              onClick={() => { setInput(''); setOutput(''); setError(null); }}
              className="p-2.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg border border-white/10 transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Output Column */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-gray-400">FORMATTED OUTPUT:</span>
            {output && (
              <button 
                type="button"
                onClick={() => onCopy(output, 'json-out')}
                className="text-xs hover:text-blue-400 inline-flex items-center gap-1 text-gray-400"
              >
                {copiedStatus === 'json-out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'json-out' ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          
          <div className="relative flex-1 min-h-[320px]">
            {error ? (
              <div className="absolute inset-0 p-4 border border-rose-950 bg-rose-950/20 rounded-lg flex flex-col justify-center items-center text-center">
                <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
                <h4 className="font-semibold text-rose-400 text-sm">JSON Validation Failed</h4>
                <p className="text-xs text-rose-300/85 max-w-sm mt-1 font-mono break-all">{error}</p>
              </div>
            ) : output ? (
              <pre className="absolute inset-0 p-4 border border-white/10 bg-[#161616] overflow-auto rounded-lg text-sm font-mono text-emerald-400 break-all whitespace-pre-wrap">
                {output}
              </pre>
            ) : (
              <div className="absolute inset-0 border border-dashed border-white/10 rounded-lg flex flex-col justify-center items-center text-center bg-white/2 overflow-auto text-gray-500 p-4 text-xs">
                <Terminal className="w-8 h-8 mb-2 text-gray-600" />
                Format some JSON on the left to review parsed attributes here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. BASE64 ENCODER & DECODER
interface Base64Props {
  onCopy: (text: string, id: string) => void;
  copiedStatus: string | null;
  initialMode?: 'encode' | 'decode';
}

function Base64Tool({ onCopy, copiedStatus, initialMode = 'encode' }: Base64Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>(initialMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setInput('');
    setOutput('');
    setError(null);
  }, [initialMode]);

  const handleConvert = () => {
    if (!input.trim()) {
      setError('Please insert some text input to convert.');
      setOutput('');
      return;
    }
    setError(null);
    try {
      if (mode === 'encode') {
        // Handle utf-8 safely in base64
        const utf8Bytes = new TextEncoder().encode(input);
        let binary = '';
        utf8Bytes.forEach((byte) => {
          binary += String.fromCharCode(byte);
        });
        setOutput(btoa(binary));
      } else {
        const binary = atob(input.trim());
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        setOutput(new TextDecoder().decode(bytes));
      }
    } catch (e) {
      setError('Failed to convert. Ensure input is a valid Base64 string for decoding.');
      setOutput('');
    }
  };

  const toggleMode = () => {
    const currentMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(currentMode);
    setInput(output);
    setOutput('');
    setError(null);
  };

  return (
    <div className="space-y-6" id="base64-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="p-1 px-2 text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">DEV</span>
            Base64 Encoder / Decoder
          </h2>
          <p className="text-sm text-gray-400">Encode standard text content to base64, or decode back to humans.</p>
        </div>
        <div className="bg-white/5 p-1 rounded-full flex inline-flex text-xs font-semibold">
          <button 
            type="button"
            className={`p-1.5 px-4 rounded-full transition-all cursor-pointer ${mode === 'encode' ? 'bg-indigo-650 text-white shadow-md' : 'text-gray-450 hover:text-white'}`}
            onClick={() => { setMode('encode'); setOutput(''); setError(null); }}
          >
            Encode
          </button>
          <button 
            type="button"
            className={`p-1.5 px-4 rounded-full transition-all cursor-pointer ${mode === 'decode' ? 'bg-indigo-650 text-white shadow-md' : 'text-gray-450 hover:text-white'}`}
            onClick={() => { setMode('decode'); setOutput(''); setError(null); }}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Input */}
        <div>
          <label className="text-xs font-mono text-gray-400 mb-1.5 block">
            {mode === 'encode' ? 'PLAIN TEXT INPUT' : 'BASE64 INPUT'}
          </label>
          <textarea
            className="w-full h-64 p-4 border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-650/20 focus:border-indigo-650 bg-[#161616] text-white placeholder-gray-650"
            placeholder={mode === 'encode' ? 'Enter normal readable text here...' : 'Enter base64 encoded text (e.g. SGVsbG8gd29ybGQ=)'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="mt-4 flex gap-2">
            <button 
              type="button"
              onClick={handleConvert}
              className="flex-grow p-2.5 bg-indigo-650 text-white hover:bg-indigo-850 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
            >
              {mode === 'encode' ? 'Encode to Base64' : 'Decode Base64'}
            </button>
            <button 
              type="button"
              onClick={toggleMode}
              className="p-2.5 text-xs font-semibold bg-white/5 border border-white/10 text-gray-350 rounded-lg hover:bg-white/10 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
              title="Swap fields"
            >
              Swap Mode
            </button>
            <button 
              type="button"
              onClick={() => { setInput(''); setOutput(''); setError(null); }}
              className="p-2.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg border border-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-gray-400">
              {mode === 'encode' ? 'BASE64 STRING' : 'DECODED PLAIN TEXT'}
            </span>
            {output && (
              <button 
                type="button"
                onClick={() => onCopy(output, 'b64')}
                className="text-xs hover:text-blue-400 inline-flex items-center gap-1 text-gray-455 transition-colors"
              >
                {copiedStatus === 'b64' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'b64' ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          
          <div className="relative flex-1 min-h-[256px]">
            {error ? (
              <div className="absolute inset-0 p-4 border border-rose-950 bg-rose-950/20 rounded-lg flex flex-col justify-center items-center text-center">
                <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
                <p className="text-xs text-rose-300 font-medium">{error}</p>
              </div>
            ) : output ? (
              <pre className="absolute inset-0 p-4 border border-white/10 bg-[#161616] overflow-auto rounded-lg text-sm font-mono text-emerald-400 break-all whitespace-pre-wrap select-all">
                {output}
              </pre>
            ) : (
              <div className="absolute inset-0 border border-dashed border-white/10 rounded-lg flex flex-col justify-center items-center text-center bg-white/2 text-gray-500 p-4 text-xs font-mono">
                Click Convert on the left to see results.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. HTML / URL ENCODER & DECODER
function HtmlUrlEncoder({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState<'url' | 'html'>('url');
  const [action, setAction] = useState<'encode' | 'decode'>('encode');

  const escapeHtml = (text: string) => {
    return text.replace(/[&<>"']/g, (m) => {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        default: return m;
      }
    });
  };

  const unescapeHtml = (text: string) => {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.documentElement.textContent || text;
  };

  const handleProcess = () => {
    if (!input.trim()) return;
    try {
      if (type === 'url') {
        setOutput(action === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input));
      } else {
        setOutput(action === 'encode' ? escapeHtml(input) : unescapeHtml(input));
      }
    } catch {
      setOutput('Conversion error. Check standard encoding components.');
    }
  };

  return (
    <div className="space-y-6" id="html-url-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="p-1 px-2 text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">DEV</span>
            URL & HTML Helper
          </h2>
          <p className="text-sm text-gray-400">Safely encode URLs and HTML tags or decode special characters.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold flex-wrap">
          <div className="bg-white/5 p-1 rounded-full flex">
            <button 
              type="button"
              className={`p-1.5 px-4 text-xs rounded-full transition-all cursor-pointer ${type === 'url' ? 'bg-indigo-650 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              onClick={() => { setType('url'); setOutput(''); }}
            >
              URL
            </button>
            <button 
              type="button"
              className={`p-1.5 px-4 text-xs rounded-full transition-all cursor-pointer ${type === 'html' ? 'bg-indigo-650 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              onClick={() => { setType('html'); setOutput(''); }}
            >
              HTML Entities
            </button>
          </div>
          <div className="bg-white/5 p-1 rounded-full flex">
            <button 
              type="button"
              className={`p-1.5 px-4 text-xs rounded-full transition-all cursor-pointer ${action === 'encode' ? 'bg-indigo-650 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              onClick={() => { setAction('encode'); setOutput(''); }}
            >
              Encode
            </button>
            <button 
              type="button"
              className={`p-1.5 px-4 text-xs rounded-full transition-all cursor-pointer ${action === 'decode' ? 'bg-indigo-650 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              onClick={() => { setAction('decode'); setOutput(''); }}
            >
              Decode
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-mono text-gray-400 mb-1.5 block">INPUT STRING:</label>
          <textarea
            className="w-full h-56 p-4 border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-650/20 focus:border-indigo-650 bg-[#161616] text-white"
            placeholder={
              type === 'url' 
                ? (action === 'encode' ? 'Search value in browser=my search result' : 'Search%20value%20in%20browser%3Dmy%20search%20result')
                : (action === 'encode' ? '<div>Hello World</div>' : '&lt;div&gt;Hello World&lt;/div&gt;')
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="mt-4 flex gap-2">
            <button 
              type="button"
              onClick={handleProcess}
              className="flex-grow p-2.5 bg-indigo-650 text-white hover:bg-indigo-850 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
            >
              Run Code conversion
            </button>
            <button 
              type="button"
              onClick={() => { setInput(''); setOutput(''); }}
              className="p-2.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg border border-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-gray-400">OUTPUT STRING:</span>
            {output && (
              <button 
                type="button"
                onClick={() => onCopy(output, 'entity')}
                className="text-xs hover:text-blue-400 inline-flex items-center gap-1 text-gray-400 transition-colors"
              >
                {copiedStatus === 'entity' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'entity' ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <div className="relative flex-1 min-h-[224px]">
            {output ? (
              <pre className="absolute inset-0 p-4 border border-white/10 bg-[#161616] overflow-auto rounded-lg text-sm font-mono text-emerald-400 break-all whitespace-pre-wrap select-all">
                {output}
              </pre>
            ) : (
              <div className="absolute inset-0 border border-dashed border-white/10 rounded-lg flex flex-col justify-center items-center text-center bg-white/2 text-gray-500 p-4 text-xs font-mono">
                Results will display here after conversion.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Self-contained pure MD5 hashing implementation
function md5(str: string): string {
  const k = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
  ];
  
  const r = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
  ];

  const words: number[] = [];
  const byteLength = str.length;
  for (let i = 0; i < byteLength; i++) {
    words[i >> 2] |= (str.charCodeAt(i) & 0xff) << ((i % 4) * 8);
  }
  words[byteLength >> 2] |= 0x80 << ((byteLength % 4) * 8);
  words[(((byteLength + 8) >> 6) + 1) * 16 - 2] = byteLength * 8;

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;

  const leftrotate = (x: number, c: number) => (x << c) | (x >>> (32 - c));

  for (let i = 0; i < words.length; i += 16) {
    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;

    for (let j = 0; j < 64; j++) {
      let f = 0;
      let g = 0;
      if (j < 16) {
        f = (b & c) | (~b & d);
        g = j;
      } else if (j < 32) {
        f = (d & b) | (~d & c);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = b ^ c ^ d;
        g = (3 * j + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * j) % 16;
      }

      const temp = d;
      d = c;
      c = b;
      b = (b + leftrotate(a + f + k[j] + (words[i + g] || 0), r[j])) | 0;
      a = temp;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
  }

  const toHex = (n: number) => {
    let out = '';
    for (let i = 0; i < 4; i++) {
      out += ((n >> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return out;
  };

  return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3);
}

// 4. SHA & CRYPTO HASH GENERATOR
function HashGenerator({ onCopy, copiedStatus, activeToolId }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null; activeToolId?: string }) {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<{ md5: string; sha1: string; sha256: string; sha512: string } | null>(null);

  const calculateHashes = async () => {
    if (!input) {
      setHashes(null);
      return;
    }
    try {
      // Calculate MD5 directly
      const md5Hex = md5(input);

      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      // SHA-1
      const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
      const sha1Array = Array.from(new Uint8Array(sha1Buffer));
      const sha1Hex = sha1Array.map(b => b.toString(16).padStart(2, '0')).join('');

      // SHA-256
      const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
      const sha256Array = Array.from(new Uint8Array(sha256Buffer));
      const sha256Hex = sha256Array.map(b => b.toString(16).padStart(2, '0')).join('');

      // SHA-512
      const sha512Buffer = await crypto.subtle.digest('SHA-512', data);
      const sha512Array = Array.from(new Uint8Array(sha512Buffer));
      const sha512Hex = sha512Array.map(b => b.toString(16).padStart(2, '0')).join('');

      setHashes({
        md5: md5Hex,
        sha1: sha1Hex,
        sha256: sha256Hex,
        sha512: sha512Hex
      });
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6" id="hash-gen-container">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">DEV</span>
          {activeToolId === 'md5-gen' ? 'MD5 Checksum Generator' : 'Cryptography Hash Generator'}
        </h2>
        <p className="text-sm text-gray-400">
          {activeToolId === 'md5-gen' 
            ? 'Generate standard 128-bit MD5 signature digests directly inside your browser.' 
            : 'Generate secure web cryptographical checksums (MD5, SHA-1, SHA-256, SHA-512) directly in your browser.'}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-mono text-gray-400 mb-1.5 block">INPUT PLAIN STRING:</label>
          <textarea
            className="w-full h-32 p-4 border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-650/20 focus:border-indigo-650 bg-[#161616] text-white placeholder-gray-500"
            placeholder="Type or paste contents to calculate hash instantly..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </div>

        <button 
          type="button"
          onClick={calculateHashes}
          className="w-full p-2.5 bg-indigo-650 text-white hover:bg-indigo-850 rounded-lg font-semibold text-sm transition-colors cursor-pointer flex justify-center items-center gap-1.5 shadow"
        >
          <Sparkles className="w-4 h-4 text-white" />
          Generate Checksums
        </button>

        {hashes && (
          <div className="space-y-4 pt-4 border-t border-white/5">
            {/* MD5 Checksum display */}
            <div className={`p-3 border rounded-lg ${activeToolId === 'md5-gen' ? 'bg-[#1b251d] border-emerald-500/25' : 'bg-[#111111] border-white/5'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-300 font-mono">
                  MD5 Digest: {activeToolId === 'md5-gen' && <span className="ml-1 text-[9px] text-emerald-450 border border-emerald-550/20 bg-emerald-500/10 px-1.5 rounded py-0.2">Featured</span>}
                </span>
                <button 
                  type="button"
                  onClick={() => onCopy(hashes.md5, 'md5')}
                  className="text-xs text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {copiedStatus === 'md5' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs font-mono text-emerald-400 break-all bg-[#161616] p-2.5 rounded border border-white/5 select-all">{hashes.md5}</p>
            </div>

            {/* SHA-1 */}
            <div className="p-3 bg-[#111111] border border-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-300 font-mono">SHA-1:</span>
                <button 
                  type="button"
                  onClick={() => onCopy(hashes.sha1, 'sha1')}
                  className="text-xs text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {copiedStatus === 'sha1' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs font-mono text-emerald-400 break-all bg-[#161616] p-2.5 rounded border border-white/5 select-all">{hashes.sha1}</p>
            </div>

            {/* SHA-256 */}
            <div className="p-3 bg-[#111111] border border-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-350 font-mono">SHA-256:</span>
                <button 
                  type="button"
                  onClick={() => onCopy(hashes.sha256, 'sha256')}
                  className="text-xs text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {copiedStatus === 'sha256' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs font-mono text-emerald-400 break-all bg-[#161616] p-2.5 rounded border border-white/5 select-all">{hashes.sha256}</p>
            </div>

            {/* SHA-512 */}
            <div className="p-3 bg-[#111111] border border-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-350 font-mono">SHA-512:</span>
                <button 
                  type="button"
                  onClick={() => onCopy(hashes.sha512, 'sha512')}
                  className="text-xs text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {copiedStatus === 'sha512' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs font-mono text-emerald-400 break-all bg-[#161616] p-2.5 rounded border border-white/5 select-all">{hashes.sha512}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
