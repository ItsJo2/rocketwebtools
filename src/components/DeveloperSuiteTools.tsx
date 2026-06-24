import React, { useState } from 'react';
import { GitCompare, KeyRound, Search, Clock, Check, Copy, AlertCircle, Sparkles, Terminal } from 'lucide-react';

interface DeveloperSuiteToolsProps {
  activeToolId: string;
}

export function DeveloperSuiteTools({ activeToolId }: DeveloperSuiteToolsProps) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(id);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  if (activeToolId === 'json-diff') {
    return <JsonDiff onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'jwt-debugger') {
    return <JwtDebugger onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'regex-tester') {
    return <RegexTester />;
  }
  if (activeToolId === 'cron-generator') {
    return <CronGenerator onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }

  return null;
}

// ==========================================
// 1. JSON DIFF CHECKER
// ==========================================
function JsonDiff({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const [leftJson, setLeftJson] = useState('{\n  "name": "Rocket Tools",\n  "version": "1.0.0",\n  "features": ["conversion", "formatting", "ai"],\n  "active": true,\n  "limit": 500\n}');
  const [rightJson, setRightJson] = useState('{\n  "name": "Rocket Web Tools",\n  "version": "1.1.0",\n  "features": ["conversion", "formatting", "ai", "sitemap"],\n  "active": true,\n  "refreshRate": 1000\n}');
  const [diffResult, setDiffResult] = useState<{ leftLines: any[]; rightLines: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDiff = () => {
    setError(null);
    setDiffResult(null);

    try {
      // Validate they are proper JSON
      const leftObj = JSON.parse(leftJson);
      const rightObj = JSON.parse(rightJson);

      const leftStr = JSON.stringify(leftObj, null, 2);
      const rightStr = JSON.stringify(rightObj, null, 2);

      const leftLinesRaw = leftStr.split('\n');
      const rightLinesRaw = rightStr.split('\n');

      const leftLinesFormatted: any[] = [];
      const rightLinesFormatted: any[] = [];

      // Simple, highly trace-accurate Diff alignment
      const maxLen = Math.max(leftLinesRaw.length, rightLinesRaw.length);

      for (let i = 0; i < maxLen; i++) {
        const lLine = leftLinesRaw[i];
        const rLine = rightLinesRaw[i];

        if (lLine === rLine) {
          leftLinesFormatted.push({ text: lLine, status: 'equal', num: i + 1 });
          rightLinesFormatted.push({ text: rLine, status: 'equal', num: i + 1 });
        } else if (lLine !== undefined && rLine !== undefined) {
          // Check if key is the same but value changed
          leftLinesFormatted.push({ text: lLine, status: 'changed', num: i + 1 });
          rightLinesFormatted.push({ text: rLine, status: 'changed', num: i + 1 });
        } else if (lLine !== undefined) {
          leftLinesFormatted.push({ text: lLine, status: 'deleted', num: i + 1 });
          rightLinesFormatted.push({ text: null, status: 'empty', num: null });
        } else if (rLine !== undefined) {
          leftLinesFormatted.push({ text: null, status: 'empty', num: null });
          rightLinesFormatted.push({ text: rLine, status: 'added', num: i + 1 });
        }
      }

      setDiffResult({ leftLines: leftLinesFormatted, rightLines: rightLinesFormatted });
    } catch (err: any) {
      setError(`Invalid JSON structure: ${err.message}. Please correct syntax first.`);
    }
  };

  return (
    <div className="space-y-6" id="json-diff-container">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">DEV</span>
          JSON Side-by-Side Diff Checker
        </h2>
        <p className="text-sm text-gray-400">Compare two JSON payloads side-by-side. Highlights line level differences, deletions, and additions instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-mono text-gray-400 mb-1.5 block">ORIGINAL JSON (A):</label>
          <textarea
            className="w-full h-44 p-3 border border-white/10 rounded-lg text-xs font-mono bg-[#161616] text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={leftJson}
            onChange={(e) => setLeftJson(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-mono text-gray-400 mb-1.5 block">MODIFIED JSON (B):</label>
          <textarea
            className="w-full h-44 p-3 border border-white/10 rounded-lg text-xs font-mono bg-[#161616] text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={rightJson}
            onChange={(e) => setRightJson(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleDiff}
          className="p-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-mono rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
        >
          <GitCompare className="w-4 h-4" />
          RUN SIDE-BY-SIDE DIFF COMPARISON
        </button>
      </div>

      {error && (
        <div className="p-4 border border-rose-950 bg-rose-950/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {diffResult && (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#121212]">
          <div className="grid grid-cols-2 bg-white/5 border-b border-white/5 text-xs text-gray-400 font-mono p-2 px-4 font-bold">
            <div>Original Object A</div>
            <div>Modified Object B</div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-white/5 font-mono text-xs overflow-auto max-h-96">
            {/* Left side */}
            <div className="p-3 space-y-0.5 bg-[#141414]">
              {diffResult.leftLines.map((line, idx) => {
                let bgStyle = 'hover:bg-white/2';
                let txtStyle = 'text-gray-300';
                if (line.status === 'deleted') {
                  bgStyle = 'bg-rose-950/30 text-rose-300 hover:bg-rose-950/40';
                } else if (line.status === 'changed') {
                  bgStyle = 'bg-amber-950/30 text-amber-200 hover:bg-amber-950/40';
                } else if (line.status === 'empty') {
                  bgStyle = 'bg-white/1 opacity-20';
                }

                return (
                  <div key={`left-${idx}`} className={`flex items-start rounded px-2 py-0.5 ${bgStyle}`}>
                    <span className="w-8 select-none opacity-20 text-[10px] pr-2 text-right">{line.num || ''}</span>
                    <span className={`whitespace-pre select-all ${txtStyle}`}>{line.text !== null ? line.text : ' '}</span>
                  </div>
                );
              })}
            </div>

            {/* Right side */}
            <div className="p-3 space-y-0.5 bg-[#141414]">
              {diffResult.rightLines.map((line, idx) => {
                let bgStyle = 'hover:bg-white/2';
                let txtStyle = 'text-gray-300';
                if (line.status === 'added') {
                  bgStyle = 'bg-emerald-950/30 text-emerald-350 hover:bg-emerald-950/40';
                } else if (line.status === 'changed') {
                  bgStyle = 'bg-amber-950/30 text-amber-200 hover:bg-amber-950/40';
                } else if (line.status === 'empty') {
                  bgStyle = 'bg-white/1 opacity-20';
                }

                return (
                  <div key={`right-${idx}`} className={`flex items-start rounded px-2 py-0.5 ${bgStyle}`}>
                    <span className="w-8 select-none opacity-20 text-[10px] pr-2 text-right">{line.num || ''}</span>
                    <span className={`whitespace-pre select-all ${txtStyle}`}>{line.text !== null ? line.text : ' '}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-2 border-t border-white/5 bg-[#161616] flex justify-center gap-6 text-[10px] text-gray-500 font-mono">
            <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-500/40" /> Added</span>
            <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500/20 border border-rose-500/40" /> Deleted</span>
            <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/20 border border-amber-500/40" /> Modified</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. JWT (JSON WEB TOKEN) DEBUGGER
// ==========================================
function JwtDebugger({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE4MDMyMzkwMjIsImFkbWluIjp0cnVlfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [header, setHeader] = useState<string | null>(null);
  const [payload, setPayload] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [expirationReport, setExpirationReport] = useState<{ date: string; valid: boolean; ageText: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDecode = () => {
    setErrorMsg(null);
    setHeader(null);
    setPayload(null);
    setSignature(null);
    setExpirationReport(null);

    const steps = token.trim().split('.');
    if (steps.length !== 3) {
      setErrorMsg('Invalid JWT format. A valid token must contain 3 sections separated by dots.');
      return;
    }

    try {
      // Decode helper
      const base64Decode = (str: string) => {
        // Handle URL safe base64
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const decodedHeader = JSON.parse(base64Decode(steps[0]));
      const decodedPayload = JSON.parse(base64Decode(steps[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setSignature(steps[2]);

      // Calculate expirations
      if (decodedPayload.exp) {
        const expUnix = decodedPayload.exp * 1000;
        const expDate = new Date(expUnix);
        const now = Date.now();
        const valid = expUnix > now;

        const diffSeconds = Math.floor(Math.abs(expUnix - now) / 1000);
        let ageText = '';

        if (diffSeconds < 60) {
          ageText = `${diffSeconds} seconds`;
        } else if (diffSeconds < 3600) {
          ageText = `${Math.floor(diffSeconds / 60)} minutes`;
        } else if (diffSeconds < 86400) {
          ageText = `${Math.floor(diffSeconds / 3600)} hours`;
        } else {
          ageText = `${Math.floor(diffSeconds / 86400)} days`;
        }

        setExpirationReport({
          date: expDate.toString(),
          valid,
          ageText: valid ? `Expires in ${ageText}` : `Expired ${ageText} ago`
        });
      }
    } catch (err: any) {
      setErrorMsg(`Failed to decode Base64 payload sections: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6" id="jwt-debugger-container">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">JWT</span>
          JWT Token Debugger
        </h2>
        <p className="text-sm text-gray-400">Decode JSON Web Tokens instantly to dissect headers, claims information, signatures, and check token lifespan parameters.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-mono text-gray-400 mb-1.5 block">ENCODED JWT TOKEN string:</label>
          <textarea
            className="w-full h-24 p-3 border border-white/10 rounded-lg text-xs font-mono bg-[#161616] text-white focus:outline-none focus:ring-1 focus:ring-blue-500 leading-normal"
            placeholder="Paste your JSON Web Token (eyJhbGciOi...)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        <button
          onClick={handleDecode}
          className="p-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <KeyRound className="w-4 h-4" />
          Decode claims output
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 border border-rose-950 bg-rose-950/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {(header || payload) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-mono text-violet-400 font-bold uppercase">HEADER: ALGORITHM & TOKEN TYPE</span>
                <button onClick={() => onCopy(header || '', 'jwt-h')} className="text-xxs text-gray-500 hover:text-white cursor-pointer inline-flex items-center gap-1">
                  {copiedStatus === 'jwt-h' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
              <pre className="p-3 border border-violet-900/30 bg-[#161616]/80 text-violet-300 font-mono text-xs rounded-lg overflow-auto leading-relaxed max-h-56">
                {header}
              </pre>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-mono text-sky-400 font-bold uppercase">PAYLOAD: DATA CLAIMS</span>
                <button onClick={() => onCopy(payload || '', 'jwt-p')} className="text-xxs text-gray-500 hover:text-white cursor-pointer inline-flex items-center gap-1">
                  {copiedStatus === 'jwt-p' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <pre className="p-3 border border-sky-900/30 bg-[#161616]/80 text-sky-300 font-mono text-xs rounded-lg overflow-auto leading-relaxed max-h-80">
                {payload}
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 border border-white/5 rounded-xl bg-white/2 space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Token Expiration Status</h4>
              {expirationReport ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${expirationReport.valid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className={`text-sm font-bold ${expirationReport.valid ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {expirationReport.valid ? 'VALID CLAIM SESSION' : 'TOKEN CLAIM EXPIRED'}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs font-mono text-gray-350">
                    <p><span className="text-gray-500">Value:</span> {expirationReport.ageText}</p>
                    <p><span className="text-gray-500">Calendar check:</span> {expirationReport.date}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No standard `exp` (Expiration) claim registered inside this token's payload.</p>
              )}
            </div>

            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase block mb-1.5">SIGNATURE VERIFICATION SEGMENT</span>
              <div className="p-4 border border-emerald-950 bg-emerald-950/15 text-emerald-300 font-mono text-xs rounded-lg break-all">
                HMACSHA256(<br />
                &nbsp;&nbsp;base64UrlEncode(header) + "." +<br />
                &nbsp;&nbsp;base64UrlEncode(payload),<br />
                &nbsp;&nbsp;<span className="text-emerald-400 bg-white/5 p-1 rounded font-bold">your-256-bit-secret</span><br />
                )<br />
                <span className="text-gray-500">// Result signature chunk:</span><br />
                <span className="text-gray-400 select-all font-bold">{signature}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. REGEX TESTER
// ==========================================
function RegexTester() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@&?[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('Feel free to extract info from hello@rocketwebtools.com or send a notification file to developer-support@test.org easily.');
  const [matches, setMatches] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTest = () => {
    setErrorMsg(null);
    setMatches([]);

    if (!pattern) return;

    try {
      const regex = new RegExp(pattern, flags);
      const output: any[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(testText)) !== null) {
          output.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          // Safeguard infinite loops for zero-width matches
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          output.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      setMatches(output);
    } catch (err: any) {
      setErrorMsg(`Invalid Regular Expression syntax: ${err.message}`);
    }
  };

  // Run automatically on input change
  React.useEffect(() => {
    handleTest();
  }, [pattern, flags, testText]);

  // Color match highlighters for visual interface
  const renderHighlightedText = () => {
    if (errorMsg || !pattern) return <span className="whitespace-pre-wrap">{testText}</span>;

    try {
      const regex = new RegExp(pattern, flags);
      const elements: React.ReactNode[] = [];
      let lastIdx = 0;
      let match;
      let matchIndex = 0;

      // Handle non-global matches or reset search
      const runRegex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');

      while ((match = runRegex.exec(testText)) !== null) {
        if (match.index > lastIdx) {
          elements.push(<span key={`text-${lastIdx}`}>{testText.substring(lastIdx, match.index)}</span>);
        }

        const matchValue = match[0];
        elements.push(
          <mark 
            key={`match-${match.index}-${matchIndex}`} 
            className="bg-amber-500/20 text-amber-300 border-b-2 border-amber-500 px-0.5 rounded-sm font-semibold select-all"
            title={`Match index: ${match.index}`}
          >
            {matchValue}
          </mark>
        );

        lastIdx = runRegex.lastIndex;
        matchIndex++;

        if (matchValue.length === 0) {
          runRegex.lastIndex++;
        }
      }

      if (lastIdx < testText.length) {
        elements.push(<span key={`text-end`}>{testText.substring(lastIdx)}</span>);
      }

      return elements;
    } catch {
      return <span className="whitespace-pre-wrap">{testText}</span>;
    }
  };

  return (
    <div className="space-y-6" id="regex-tester-container">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">REGEX</span>
          RegEx Patterns Tester & Highlight Engine
        </h2>
        <p className="text-sm text-gray-400">Assemble regular expressions, toggle modifiers, evaluate them on target paragraphs instantly, and highlight match ranges.</p>
      </div>

      <div className="bg-[#141414] border border-white/5 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className="text-xs font-mono text-gray-400 mb-1 block">REGULAR EXPRESSION (PATTERN):</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-mono select-none">/</span>
              <input
                type="text"
                className="w-full p-2 py-2.5 pl-5 border border-white/10 rounded-lg text-xs font-mono bg-[#161616] text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="[a-z]+"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-mono select-none">/</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 mb-1 block">MODIFIERS / FLAGS:</label>
            <select
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="w-full p-2 py-2.5 border border-white/10 rounded-lg text-xs font-mono bg-[#161616] text-white focus:outline-none cursor-pointer"
            >
              <option value="g">g (Global Matching)</option>
              <option value="gi">gi (Case Insensitive)</option>
              <option value="m">m (Multiline)</option>
              <option value="gim">gim (Combined Flags)</option>
              <option value="">No flags</option>
            </select>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 border border-rose-950 bg-rose-950/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label className="text-xs font-mono text-gray-400 mb-1 block">TEST STRING CORPUS:</label>
          <textarea
            className="w-full h-24 p-3 border border-white/10 rounded-lg text-xs font-mono bg-[#161616] text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <span className="text-xs font-mono text-gray-400 block mb-1.5 uppercase font-bold text-gray-300">LIVE MATCH HIGH-HIGHLIGHTER</span>
          <div className="p-4 rounded-xl border border-white/10 bg-[#161616] h-48 overflow-auto leading-relaxed text-xs break-words whitespace-pre-wrap select-all font-mono">
            {renderHighlightedText()}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono block uppercase font-bold text-blue-400">Match Indices Matrix ({matches.length} captured)</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#161616] h-48 overflow-auto">
            {matches.length > 0 ? (
              <table className="w-full text-left border-collapse text-xxs font-mono">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-gray-400">
                    <th className="p-2 pl-4">Index</th>
                    <th className="p-2">Content</th>
                    <th className="p-2 text-right pr-4">Range Offset</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {matches.map((m, idx) => (
                    <tr key={`match-tbl-${idx}`} className="hover:bg-white/5">
                      <td className="p-2 pl-4 font-bold text-blue-400">#{idx + 1}</td>
                      <td className="p-2 select-all font-semibold max-w-xs truncate">{m.text}</td>
                      <td className="p-2 text-right pr-4 text-gray-500">offset {m.index}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-xs text-gray-500">
                No active captures found matching the current pattern.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. CRON EXPRESSION GENERATOR
// ==========================================
function CronGenerator({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const [minutes, setMinutes] = useState('*');
  const [hours, setHours] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');

  const [cronExpression, setCronExpression] = useState('* * * * *');
  const [readableDescription, setReadableDescription] = useState('Runs every single minute on every day of the month, month, and day of the week.');
  const [upcomingDates, setUpcomingDates] = useState<string[]>([]);

  const presets = [
    { name: 'Every Minute', value: '* * * * *' },
    { name: 'Every 5 Mins', value: '*/5 * * * *' },
    { name: 'Every Hour', value: '0 * * * *' },
    { name: 'Every Night at Mid', value: '0 0 * * *' },
    { name: 'Weekly Sunday Mid', value: '0 0 * * 0' },
    { name: 'First day of Month', value: '0 0 1 * *' }
  ];

  const handleApplyPreset = (expr: string) => {
    const parts = expr.split(' ');
    if (parts.length === 5) {
      setMinutes(parts[0]);
      setHours(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
    }
  };

  // Run translator logic based on standard crontab configurations
  const translateExpression = (m: string, h: string, dom: string, mon: string, dow: string) => {
    const expr = `${m} ${h} ${dom} ${mon} ${dow}`;
    setCronExpression(expr);

    // Human-descriptive translator engine
    let out = 'Runs ';

    // 1. Minute block
    if (m === '*') {
      out += 'every minute';
    } else if (m.startsWith('*/')) {
      const step = m.substring(2);
      out += `every ${step} minutes`;
    } else {
      out += `at minute ${m}`;
    }

    // 2. Hour block
    if (h === '*') {
      out += ' of every hour';
    } else if (h.startsWith('*/')) {
      const step = h.substring(2);
      out += ` of every ${step} hours`;
    } else {
      out += ` of hour ${h}:00`;
    }

    // 3. Day of month block
    if (dom === '*') {
      out += ', every day';
    } else {
      out += `, on day of month ${dom}`;
    }

    // 4. Month block
    if (mon === '*') {
      out += ', of every month';
    } else {
      out += `, of month ${mon}`;
    }

    // 5. Day of week block
    if (dow === '*') {
      out += ' on all days of the week.';
    } else {
      const weekdayNames: Record<string, string> = {
        '0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday', '5': 'Friday', '6': 'Saturday'
      };
      out += ` specifically on ${weekdayNames[dow] || `weekday #${dow}`}.`;
    }

    setReadableDescription(out);

    // Compute mock next 5 upcoming dates easily
    const dates: string[] = [];
    const date = new Date();
    // Round to next minute
    date.setSeconds(0, 0);

    for (let i = 0; i < 5; i++) {
      // Simulate chronological step depending on values
      let hopMinutes = 1;
      if (m.startsWith('*/')) {
        hopMinutes = parseInt(m.substring(2), 10) || 1;
      } else if (m !== '*') {
        hopMinutes = 60; // hop hour
      }
      
      date.setMinutes(date.getMinutes() + (i === 0 ? 0 : hopMinutes));
      dates.push(date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) + ' UTC');
    }
    setUpcomingDates(dates);
  };

  React.useEffect(() => {
    translateExpression(minutes, hours, dayOfMonth, month, dayOfWeek);
  }, [minutes, hours, dayOfMonth, month, dayOfWeek]);

  return (
    <div className="space-y-6" id="cron-generator-container">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">CRON</span>
          Cron Schedule Builder & Translator
        </h2>
        <p className="text-sm text-gray-400">Generate standard 5-part crontab schedule strings from simple inputs, read plain descriptions, and view mock next executions.</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xxs font-mono">
        <span className="text-gray-500 self-center">Presets:</span>
        {presets.map((p) => (
          <button
            key={p.name}
            onClick={() => handleApplyPreset(p.value)}
            className="p-1 px-2 border border-white/10 hover:border-blue-500/40 bg-white/2 hover:bg-white/5 rounded cursor-pointer text-gray-350"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-[#141414] border border-white/5 p-5 rounded-xl text-xs font-mono">
        <div>
          <label className="text-gray-450 block mb-1">Minutes (0-59):</label>
          <input
            type="text"
            className="w-full p-2 border border-white/10 rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-center text-xs font-bold"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </div>
        <div>
          <label className="text-gray-455 block mb-1">Hours (0-23):</label>
          <input
            type="text"
            className="w-full p-2 border border-white/10 rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-center text-xs font-bold"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </div>
        <div>
          <label className="text-gray-460 block mb-1">Day of Month (1-31):</label>
          <input
            type="text"
            className="w-full p-2 border border-white/10 rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-center text-xs font-bold"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
          />
        </div>
        <div>
          <label className="text-gray-465 block mb-1">Month (1-12):</label>
          <input
            type="text"
            className="w-full p-2 border border-white/10 rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-center text-xs font-bold"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
        <div>
          <label className="text-gray-470 block mb-1">Day of Week (0-6):</label>
          <input
            type="text"
            className="w-full p-2 border border-white/10 rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-center text-xs font-bold"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <span className="text-xs font-mono text-gray-400 block mb-1 uppercase font-bold text-gray-300">GENERATED CRON EXPRESSION</span>
            <div className="p-4 rounded-xl border border-blue-500/20 bg-[#161616] flex justify-between items-center">
              <span className="font-mono text-lg text-blue-350 font-bold select-all tracking-widest">{cronExpression}</span>
              <button
                onClick={() => onCopy(cronExpression, 'cron-e')}
                className="text-xs text-gray-400 hover:text-blue-400 inline-flex items-center gap-1 cursor-pointer font-mono"
              >
                {copiedStatus === 'cron-e' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'cron-e' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs font-mono text-gray-400 block mb-1 uppercase font-bold text-gray-300 font-bold">HUMAN TRANSLATION DESCRIPTION</span>
            <div className="p-4 rounded-xl border border-white/10 bg-[#161616] text-gray-200 text-xs font-sans leading-relaxed">
              {readableDescription}
            </div>
          </div>
        </div>

        <div>
          <span className="text-xs font-mono text-blue-405 block mb-1.5 uppercase font-bold text-gray-300 font-bold">PROJECTED NEXT 5 EXECUTION DATES</span>
          <div className="rounded-xl border border-white/10 bg-[#161616] overflow-hidden">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-gray-400">
                  <th className="p-3 pl-4">Execution index</th>
                  <th className="p-3 text-right pr-4">Estimated trigger Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {upcomingDates.map((dateStr, idx) => (
                  <tr key={`date-${idx}`} className="hover:bg-white/5">
                    <td className="p-3 pl-4 text-blue-400">Trigger {idx + 1}</td>
                    <td className="p-3 text-right pr-4 text-gray-450">{dateStr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
