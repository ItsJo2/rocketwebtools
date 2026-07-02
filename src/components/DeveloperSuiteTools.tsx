import React, { useState } from 'react';
import { GitCompare, KeyRound, Search, Clock, Check, Copy, AlertCircle, Sparkles, Terminal } from 'lucide-react';

interface DeveloperSuiteToolsProps {
  activeToolId: string;
  isDark: boolean;
}

export function DeveloperSuiteTools({ activeToolId, isDark }: DeveloperSuiteToolsProps) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(id);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  if (activeToolId === 'json-diff') {
    return <JsonDiff isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'jwt-debugger') {
    return <JwtDebugger isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'regex-tester') {
    return <RegexTester isDark={isDark} />;
  }
  if (activeToolId === 'cron-generator') {
    return <CronGenerator isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }

  return null;
}

// ==========================================
// 1. JSON DIFF CHECKER
// ==========================================
function JsonDiff({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
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

  const [leftJson, setLeftJson] = useState('{\n  "name": "Rocket Tools",\n  "version": "1.0.0",\n  "features": ["conversion", "formatting", "ai"],\n  "active": true,\n  "limit": 500\n}');
  const [rightJson, setRightJson] = useState('{\n  "name": "Rocket Web Tools",\n  "version": "1.1.0",\n  "features": ["conversion", "formatting", "ai", "sitemap"],\n  "active": true,\n  "refreshRate": 1000\n}');
  const [diffResult, setDiffResult] = useState<{ leftLines: any[]; rightLines: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDiff = () => {
    setError(null);
    setDiffResult(null);

    try {
      const leftObj = JSON.parse(leftJson);
      const rightObj = JSON.parse(rightJson);

      const leftStr = JSON.stringify(leftObj, null, 2);
      const rightStr = JSON.stringify(rightObj, null, 2);

      const leftLinesRaw = leftStr.split('\n');
      const rightLinesRaw = rightStr.split('\n');

      const leftLinesFormatted: any[] = [];
      const rightLinesFormatted: any[] = [];

      const maxLen = Math.max(leftLinesRaw.length, rightLinesRaw.length);

      for (let i = 0; i < maxLen; i++) {
        const lLine = leftLinesRaw[i];
        const rLine = rightLinesRaw[i];

        if (lLine === rLine) {
          leftLinesFormatted.push({ text: lLine, status: 'equal', num: i + 1 });
          rightLinesFormatted.push({ text: rLine, status: 'equal', num: i + 1 });
        } else if (lLine !== undefined && rLine !== undefined) {
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

  const badgeClass = isDark
    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    : 'bg-blue-50 text-blue-600 border-blue-200';

  return (
    <div className="space-y-6" id="json-diff-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>DEV</span>
          JSON Side-by-Side Diff Checker
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Compare two JSON payloads side-by-side. Highlights line level differences, deletions, and additions instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className={`text-xs font-mono ${t.textMuted} mb-1.5 block`}>ORIGINAL JSON (A):</label>
          <textarea
            className={`w-full h-44 p-3 ${t.textareaBg} rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500`}
            value={leftJson}
            onChange={(e) => setLeftJson(e.target.value)}
          />
        </div>
        <div>
          <label className={`text-xs font-mono ${t.textMuted} mb-1.5 block`}>MODIFIED JSON (B):</label>
          <textarea
            className={`w-full h-44 p-3 ${t.textareaBg} rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500`}
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
        <div className={`border ${t.border} rounded-xl overflow-hidden ${t.controlBg}`}>
          <div className={`grid grid-cols-2 ${t.controlBg} border-b ${t.border} text-xs ${t.textFaint} font-mono p-2 px-4 font-bold`}>
            <div>Original Object A</div>
            <div>Modified Object B</div>
          </div>
          <div className={`grid grid-cols-2 divide-x ${t.border} font-mono text-xs overflow-auto max-h-96 ${t.controlBg}`}>
            {/* Left side */}
            <div className={`p-3 space-y-0.5 ${t.controlBg}`}>
              {diffResult.leftLines.map((line, idx) => {
                let bgStyle = isDark ? 'hover:bg-white/2' : 'hover:bg-black/5';
                let txtStyle = t.textMuted;
                if (line.status === 'deleted') {
                  bgStyle = isDark ? 'bg-rose-950/30 text-rose-300 hover:bg-rose-950/40' : 'bg-rose-50 text-rose-750 hover:bg-rose-100';
                } else if (line.status === 'changed') {
                  bgStyle = isDark ? 'bg-amber-950/30 text-amber-200 hover:bg-amber-950/40' : 'bg-amber-50 text-amber-750 hover:bg-amber-100';
                } else if (line.status === 'empty') {
                  bgStyle = isDark ? 'bg-white/1 opacity-20' : 'bg-gray-100/30 opacity-40';
                }

                return (
                  <div key={`left-${idx}`} className={`flex items-start rounded px-2 py-0.5 ${bgStyle}`}>
                    <span className={`w-8 select-none opacity-20 text-[10px] pr-2 text-right ${t.textFaint}`}>{line.num || ''}</span>
                    <span className={`whitespace-pre select-all ${txtStyle}`}>{line.text !== null ? line.text : ' '}</span>
                  </div>
                );
              })}
            </div>

            {/* Right side */}
            <div className={`p-3 space-y-0.5 ${t.controlBg}`}>
              {diffResult.rightLines.map((line, idx) => {
                let bgStyle = isDark ? 'hover:bg-white/2' : 'hover:bg-black/5';
                let txtStyle = t.textMuted;
                if (line.status === 'added') {
                  bgStyle = isDark ? 'bg-emerald-950/30 text-emerald-350 hover:bg-emerald-950/40' : 'bg-emerald-50 text-emerald-750 hover:bg-emerald-100';
                } else if (line.status === 'changed') {
                  bgStyle = isDark ? 'bg-amber-950/30 text-amber-200 hover:bg-amber-950/40' : 'bg-amber-50 text-amber-750 hover:bg-amber-100';
                } else if (line.status === 'empty') {
                  bgStyle = isDark ? 'bg-white/1 opacity-20' : 'bg-gray-100/30 opacity-40';
                }

                return (
                  <div key={`right-${idx}`} className={`flex items-start rounded px-2 py-0.5 ${bgStyle}`}>
                    <span className={`w-8 select-none opacity-20 text-[10px] pr-2 text-right ${t.textFaint}`}>{line.num || ''}</span>
                    <span className={`whitespace-pre select-all ${txtStyle}`}>{line.text !== null ? line.text : ' '}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={`p-2 border-t ${t.border} ${t.controlBg} flex justify-center gap-6 text-[10px] ${t.textFaint} font-mono`}>
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
function JwtDebugger({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
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
      const base64Decode = (str: string) => {
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

  const badgeClass = isDark
    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    : 'bg-blue-50 text-blue-600 border-blue-200';

  return (
    <div className="space-y-6" id="jwt-debugger-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>JWT</span>
          JWT Token Debugger
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Decode JSON Web Tokens instantly to dissect headers, claims information, signatures, and check token lifespan parameters.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className={`text-xs font-mono ${t.textMuted} mb-1.5 block`}>ENCODED JWT TOKEN string:</label>
          <textarea
            className={`w-full h-24 p-3 ${t.textareaBg} rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 leading-normal`}
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
                <span className={`text-xs font-mono font-bold uppercase ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>HEADER: ALGORITHM & TOKEN TYPE</span>
                <button onClick={() => onCopy(header || '', 'jwt-h')} className={`text-xxs ${t.textFaint} hover:${t.heading} cursor-pointer inline-flex items-center gap-1`}>
                  {copiedStatus === 'jwt-h' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
              <pre className={`p-3 border border-violet-900/30 ${t.controlBg} ${isDark ? 'text-violet-300' : 'text-violet-800'} font-mono text-xs rounded-lg overflow-auto leading-relaxed max-h-56`}>
                {header}
              </pre>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className={`text-xs font-mono font-bold uppercase ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>PAYLOAD: DATA CLAIMS</span>
                <button onClick={() => onCopy(payload || '', 'jwt-p')} className={`text-xxs ${t.textFaint} hover:${t.heading} cursor-pointer inline-flex items-center gap-1`}>
                  {copiedStatus === 'jwt-p' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <pre className={`p-3 border border-sky-900/30 ${t.controlBg} ${isDark ? 'text-sky-300' : 'text-sky-800'} font-mono text-xs rounded-lg overflow-auto leading-relaxed max-h-80`}>
                {payload}
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`p-5 border ${t.border} rounded-xl ${t.controlBg} space-y-4`}>
              <h4 className={`text-xs font-bold ${t.textFaint} uppercase tracking-widest font-mono`}>Token Expiration Status</h4>
              {expirationReport ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${expirationReport.valid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className={`text-sm font-bold ${expirationReport.valid ? (isDark ? 'text-emerald-400' : 'text-emerald-650') : (isDark ? 'text-rose-400' : 'text-rose-650')}`}>
                      {expirationReport.valid ? 'VALID CLAIM SESSION' : 'TOKEN CLAIM EXPIRED'}
                    </span>
                  </div>
                  <div className={`space-y-1 text-xs font-mono ${t.textMuted}`}>
                    <p><span className={t.textFaint}>Value:</span> {expirationReport.ageText}</p>
                    <p><span className={t.textFaint}>Calendar check:</span> {expirationReport.date}</p>
                  </div>
                </div>
              ) : (
                <p className={`text-xs ${t.textFaint}`}>No standard `exp` (Expiration) claim registered inside this token's payload.</p>
              )}
            </div>

            <div>
              <span className={`text-xs font-mono font-bold uppercase block mb-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>SIGNATURE VERIFICATION SEGMENT</span>
              <div className={`p-4 border font-mono text-xs rounded-lg break-all ${t.controlBg} ${isDark ? 'border-emerald-950 bg-emerald-950/15 text-emerald-300' : 'border-emerald-200 bg-emerald-50/50 text-emerald-800'}`}>
                HMACSHA256(<br />
                &nbsp;&nbsp;base64UrlEncode(header) + "." +<br />
                &nbsp;&nbsp;base64UrlEncode(payload),<br />
                &nbsp;&nbsp;<span className={`p-1 rounded font-bold ${isDark ? 'text-emerald-400 bg-white/5' : 'text-emerald-700 bg-black/5'}`}>your-256-bit-secret</span><br />
                )<br />
                <span className={t.textFaint}>// Result signature chunk:</span><br />
                <span className={`select-all font-bold ${t.textMuted}`}>{signature}</span>
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
function RegexTester({ isDark }: { isDark: boolean }) {
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

  React.useEffect(() => {
    handleTest();
  }, [pattern, flags, testText]);

  const renderHighlightedText = () => {
    if (errorMsg || !pattern) return <span className="whitespace-pre-wrap">{testText}</span>;

    try {
      const regex = new RegExp(pattern, flags);
      const elements: React.ReactNode[] = [];
      let lastIdx = 0;
      let match;
      let matchIndex = 0;

      const runRegex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');

      while ((match = runRegex.exec(testText)) !== null) {
        if (match.index > lastIdx) {
          elements.push(<span key={`text-${lastIdx}`}>{testText.substring(lastIdx, match.index)}</span>);
        }

        const matchValue = match[0];
        elements.push(
          <mark 
            key={`match-${match.index}-${matchIndex}`} 
            className={`px-0.5 rounded-sm font-semibold select-all ${isDark ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-500' : 'bg-amber-100 text-amber-800 border-b-2 border-amber-600'}`}
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

  const badgeClass = isDark
    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    : 'bg-blue-50 text-blue-600 border-blue-200';

  return (
    <div className="space-y-6" id="regex-tester-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>REGEX</span>
          RegEx Patterns Tester & Highlight Engine
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Assemble regular expressions, toggle modifiers, evaluate them on target paragraphs instantly, and highlight match ranges.</p>
      </div>

      <div className={`${t.panelBg} rounded-xl p-5 space-y-4`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className={`text-xs font-mono ${t.textMuted} mb-1 block`}>REGULAR EXPRESSION (PATTERN):</label>
            <div className="relative">
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.textFaint} text-xs font-mono select-none`}>/</span>
              <input
                type="text"
                className={`w-full p-2 py-2.5 pl-5 ${t.inputBg} rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500`}
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="[a-z]+"
              />
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${t.textFaint} text-xs font-mono select-none`}>/</span>
            </div>
          </div>

          <div>
            <label className={`text-xs font-mono ${t.textMuted} mb-1 block`}>MODIFIERS / FLAGS:</label>
            <select
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className={`w-full p-2 py-2.5 ${t.selectBg} rounded-lg text-xs font-mono focus:outline-none cursor-pointer`}
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
          <label className={`text-xs font-mono ${t.textMuted} mb-1 block`}>TEST STRING CORPUS:</label>
          <textarea
            className={`w-full h-24 p-3 ${t.textareaBg} rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500`}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <span className={`text-xs font-mono ${t.textFaint} block mb-1.5 uppercase font-bold ${t.textMuted}`}>LIVE MATCH HIGH-HIGHLIGHTER</span>
          <div className={`p-4 rounded-xl border ${t.border} ${t.controlBg} h-48 overflow-auto leading-relaxed text-xs break-words whitespace-pre-wrap select-all font-mono ${t.heading}`}>
            {renderHighlightedText()}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-xs font-mono block uppercase font-bold text-blue-400`}>Match Indices Matrix ({matches.length} captured)</span>
          </div>
          <div className={`rounded-xl border ${t.border} ${t.controlBg} h-48 overflow-auto`}>
            {matches.length > 0 ? (
              <table className={`w-full text-left border-collapse text-xxs font-mono ${t.heading}`}>
                <thead>
                  <tr className={`${t.controlBg} border-b ${t.border} ${t.textFaint}`}>
                    <th className="p-2 pl-4">Index</th>
                    <th className="p-2">Content</th>
                    <th className="p-2 text-right pr-4">Range Offset</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${t.border} ${t.textMuted}`}>
                  {matches.map((m, idx) => (
                    <tr key={`match-tbl-${idx}`} className={isDark ? "hover:bg-white/5" : "hover:bg-black/5"}>
                      <td className="p-2 pl-4 font-bold text-blue-400">#{idx + 1}</td>
                      <td className="p-2 select-all font-semibold max-w-xs truncate">{m.text}</td>
                      <td className="p-2 text-right pr-4 ${t.textFaint}">offset {m.index}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={`h-full flex items-center justify-center text-center text-xs ${t.textFaint}`}>
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
function CronGenerator({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
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

  const translateExpression = (m: string, h: string, dom: string, mon: string, dow: string) => {
    const expr = `${m} ${h} ${dom} ${mon} ${dow}`;
    setCronExpression(expr);

    let out = 'Runs ';

    if (m === '*') {
      out += 'every minute';
    } else if (m.startsWith('*/')) {
      const step = m.substring(2);
      out += `every ${step} minutes`;
    } else {
      out += `at minute ${m}`;
    }

    if (h === '*') {
      out += ' of every hour';
    } else if (h.startsWith('*/')) {
      const step = h.substring(2);
      out += ` of every ${step} hours`;
    } else {
      out += ` of hour ${h}:00`;
    }

    if (dom === '*') {
      out += ', every day';
    } else {
      out += `, on day of month ${dom}`;
    }

    if (mon === '*') {
      out += ', of every month';
    } else {
      out += `, of month ${mon}`;
    }

    if (dow === '*') {
      out += ' on all days of the week.';
    } else {
      const weekdayNames: Record<string, string> = {
        '0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday', '5': 'Friday', '6': 'Saturday'
      };
      out += ` specifically on ${weekdayNames[dow] || `weekday #${dow}`}.`;
    }

    setReadableDescription(out);

    const dates: string[] = [];
    const date = new Date();
    date.setSeconds(0, 0);

    for (let i = 0; i < 5; i++) {
      let hopMinutes = 1;
      if (m.startsWith('*/')) {
        hopMinutes = parseInt(m.substring(2), 10) || 1;
      } else if (m !== '*') {
        hopMinutes = 60;
      }
      
      date.setMinutes(date.getMinutes() + (i === 0 ? 0 : hopMinutes));
      dates.push(date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) + ' UTC');
    }
    setUpcomingDates(dates);
  };

  React.useEffect(() => {
    translateExpression(minutes, hours, dayOfMonth, month, dayOfWeek);
  }, [minutes, hours, dayOfMonth, month, dayOfWeek]);

  const badgeClass = isDark
    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    : 'bg-blue-50 text-blue-600 border-blue-200';

  return (
    <div className="space-y-6" id="cron-generator-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>CRON</span>
          Cron Schedule Builder & Translator
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Generate standard 5-part crontab schedule strings from simple inputs, read plain descriptions, and view mock next executions.</p>
      </div>

      <div className={`flex flex-wrap gap-2 text-xxs font-mono ${t.textMuted}`}>
        <span className={`${t.textFaint} self-center`}>Presets:</span>
        {presets.map((p) => (
          <button
            key={p.name}
            onClick={() => handleApplyPreset(p.value)}
            className={`p-1 px-2 border ${t.border} hover:border-blue-500/40 ${t.controlBg} hover:bg-white/5 rounded cursor-pointer ${t.textMuted}`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className={`grid grid-cols-2 md:grid-cols-5 gap-3 ${t.panelBg} p-5 rounded-xl text-xs font-mono`}>
        <div>
          <label className={`${t.textMuted} block mb-1`}>Minutes (0-59):</label>
          <input
            type="text"
            className={`w-full p-2 ${t.inputBg} rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-center text-xs font-bold`}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </div>
        <div>
          <label className={`${t.textMuted} block mb-1`}>Hours (0-23):</label>
          <input
            type="text"
            className={`w-full p-2 ${t.inputBg} rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-center text-xs font-bold`}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </div>
        <div>
          <label className={`${t.textMuted} block mb-1`}>Day of Month (1-31):</label>
          <input
            type="text"
            className={`w-full p-2 ${t.inputBg} rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-center text-xs font-bold`}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
          />
        </div>
        <div>
          <label className={`${t.textMuted} block mb-1`}>Month (1-12):</label>
          <input
            type="text"
            className={`w-full p-2 ${t.inputBg} rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-center text-xs font-bold`}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
        <div>
          <label className={`${t.textMuted} block mb-1`}>Day of Week (0-6):</label>
          <input
            type="text"
            className={`w-full p-2 ${t.inputBg} rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-center text-xs font-bold`}
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <span className={`text-xs font-mono ${t.textFaint} block mb-1 uppercase font-bold ${t.textMuted}`}>GENERATED CRON EXPRESSION</span>
            <div className={`p-4 rounded-xl border border-blue-500/20 ${t.controlBg} flex justify-between items-center`}>
              <span className={`font-mono text-lg text-blue-350 font-bold select-all tracking-widest ${t.heading}`}>{cronExpression}</span>
              <button
                onClick={() => onCopy(cronExpression, 'cron-e')}
                className={`text-xs ${t.textFaint} hover:text-blue-400 inline-flex items-center gap-1 cursor-pointer font-mono`}
              >
                {copiedStatus === 'cron-e' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'cron-e' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <span className={`text-xs font-mono ${t.textFaint} block mb-1 uppercase font-bold ${t.textMuted}`}>HUMAN TRANSLATION DESCRIPTION</span>
            <div className={`p-4 rounded-xl border ${t.border} ${t.controlBg} text-xs font-sans leading-relaxed ${t.heading}`}>
              {readableDescription}
            </div>
          </div>
        </div>

        <div>
          <span className={`text-xs font-mono text-blue-405 block mb-1.5 uppercase font-bold ${t.textMuted}`}>PROJECTED NEXT 5 EXECUTION DATES</span>
          <div className={`rounded-xl border ${t.border} ${t.controlBg} overflow-hidden`}>
            <table className={`w-full text-left border-collapse text-xs font-mono ${t.heading}`}>
              <thead>
                <tr className={`${t.controlBg} border-b ${t.border} ${t.textFaint}`}>
                  <th className="p-3 pl-4">Execution index</th>
                  <th className="p-3 text-right pr-4">Estimated trigger Date</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${t.border} ${t.textMuted}`}>
                {upcomingDates.map((dateStr, idx) => (
                  <tr key={`date-${idx}`} className={isDark ? "hover:bg-white/5" : "hover:bg-black/5"}>
                    <td className="p-3 pl-4 text-blue-400">Trigger {idx + 1}</td>
                    <td className="p-3 text-right pr-4 ${t.textFaint}">{dateStr}</td>
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