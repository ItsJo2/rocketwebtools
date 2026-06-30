import React, { useState, useEffect } from 'react';
import { Network, Globe, Eye, Check, Copy, AlertCircle, ShieldCheck, HelpCircle, Heart, Search, Server } from 'lucide-react';

interface SeoSpatialToolsProps {
  activeToolId: string;
  isDark: boolean;
}

export function SeoSpatialTools({ activeToolId, isDark }: SeoSpatialToolsProps) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(id);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  if (activeToolId === 'social-meta-preview') {
    return <SocialMetaPreview isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'redirect-header-inspect') {
    return <RedirectHeaderInspect isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'dns-mx-txt') {
    return <DnsMxTxtLookup isDark={isDark} />;
  }

  return null;
}

// ==========================================
// 1. SOCIAL & META TAGS PREVIEW GENERATOR
// ==========================================
function SocialMetaPreview({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
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

  const [title, setTitle] = useState('Rocket Web Tools - Advanced Engineering Utilities');
  const [description, setDescription] = useState('An elite suite of responsive developer converters, minifiers, encoders, text analyzers, and real-time DNS solvers.');
  const [url, setUrl] = useState('https://supercharged-tools.io');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
  const [previewTab, setPreviewTab] = useState<'google' | 'facebook' | 'twitter' | 'linkedin'>('google');

  const domain = (() => {
    try {
      const parsed = new URL(url);
      return parsed.hostname;
    } catch {
      return 'supercharged-tools.io';
    }
  })();

  const getTagsCode = () => {
    return `<!-- Core SEO Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">

<!-- Twitter (X) -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${imageUrl}">`;
  };

  const badgeClass = isDark
    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6" id="social-meta-preview-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>SEO</span>
          Social & Meta Tags Preview Generator
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Generate fully search-engine optimized metadata. Preview live layouts in Google Search, Facebook, X (Twitter), and LinkedIn shares instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forms values */}
        <div className={`${t.panelBg} p-5 rounded-2xl space-y-4`}>
          <h3 className={`text-xs font-bold font-mono text-cyan-400 tracking-wider uppercase mb-1`}>METADATA VALUES</h3>
          <div>
            <label className={`text-xs font-mono ${t.textMuted} mb-1 block`}>PAGE TITLE (Recommend &lt; 60 chars):</label>
            <input
              type="text"
              className={`w-full p-2.5 ${t.inputBg} rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <span className={`text-[10px] ${t.textFaint} mt-1 block font-mono text-right`}>{title.length} / 60 characters</span>
          </div>

          <div>
            <label className={`text-xs font-mono ${t.textMuted} mb-1 block`}>META DESCRIPTION (Recommend &lt; 155 chars):</label>
            <textarea
              className={`w-full h-20 p-2.5 ${t.textareaBg} rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <span className={`text-[10px] ${t.textFaint} mt-1 block font-mono text-right`}>{description.length} / 155 characters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`text-xs font-mono ${t.textMuted} mb-1 block`}>CANONICAL SITE URL:</label>
              <input
                type="text"
                className={`w-full p-2.5 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div>
              <label className={`text-xs font-mono ${t.textMuted} mb-1 block`}>SOCIAL SHARE IMAGE URL:</label>
              <input
                type="text"
                className={`w-full p-2.5 ${t.inputBg} rounded-lg text-xs focus:outline-none`}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Previews */}
        <div className="space-y-4">
          <div className={`flex border-b ${t.border} text-xs font-mono`}>
            {['google', 'facebook', 'twitter', 'linkedin'].map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setPreviewTab(tab as any)}
                className={`p-2.5 px-4 capitalize border-b-2 cursor-pointer transition-colors ${previewTab === tab ? 'border-cyan-500 text-white font-bold' : `border-transparent ${t.textFaint} hover:${t.heading}`}`}
              >
                {tab === 'twitter' ? 'X (Twitter)' : tab}
              </button>
            ))}
          </div>

          <div className={`p-5 rounded-2xl border ${t.border} ${t.controlBg} min-h-[180px] flex flex-col justify-center select-none`}>
            {previewTab === 'google' && (
              <div className="space-y-1 font-sans">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="bg-white/10 p-1 px-1.5 rounded-full text-[10px] font-bold">G</span>
                  <div className="truncate">
                    <span className={`${t.textMuted} block leading-tight`}>{domain}</span>
                    <span className={`${t.textFaint} block leading-none text-[10px]`}>{url}</span>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-sky-400 hover:underline cursor-pointer leading-tight pt-1">
                  {title}
                </h4>
                <p className={`text-xs ${t.textMuted} leading-relaxed pt-0.5`}>
                  {description}
                </p>
              </div>
            )}

            {previewTab === 'facebook' && (
              <div className="border border-white/10 rounded-lg overflow-hidden bg-[#18191a] font-sans">
                <img src={imageUrl} alt="FB share" className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
                <div className="p-3 bg-[#242526] text-xs space-y-1 text-gray-300 border-t border-white/5">
                  <span className="text-gray-500 uppercase text-[9px] block tracking-wider">{domain}</span>
                  <h4 className="font-bold text-gray-200 text-sm leading-tight line-clamp-1">{title}</h4>
                  <p className="text-gray-400 line-clamp-2 leading-relaxed text-[11px]">{description}</p>
                </div>
              </div>
            )}

            {previewTab === 'twitter' && (
              <div className="border border-white/10 rounded-xl overflow-hidden bg-[#15181a] font-sans">
                <div className="relative">
                  <img src={imageUrl} alt="X cover" className="w-full h-36 object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-2 left-2 bg-black/60 p-1 px-2 text-[10px] text-white rounded font-mono">
                    SUMMARY LARGE IMAGE
                  </div>
                </div>
                <div className="p-3 text-xs space-y-1 bg-[#1c2022] text-gray-300 border-t border-white/5">
                  <span className="text-gray-500 text-[10px] block font-mono">{domain}</span>
                  <h4 className="font-semibold text-gray-200 text-sm leading-tight line-clamp-1">{title}</h4>
                  <p className="text-gray-400 line-clamp-2 text-[11px] leading-relaxed">{description}</p>
                </div>
              </div>
            )}

            {previewTab === 'linkedin' && (
              <div className="border border-white/10 rounded-lg overflow-hidden bg-[#1d2226] font-sans p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-300">
                  <span className="w-6 h-6 rounded-lg bg-cyan-700 flex items-center justify-center font-bold text-white text-[10px]">IN</span>
                  <div>
                    <span className="font-semibold text-gray-100 text-[11px] block">Company Network</span>
                    <span className="text-gray-450 text-[9px] block">Corporate Share Status</span>
                  </div>
                </div>
                <div className="border border-white/5 rounded-lg overflow-hidden bg-[#2d3236]">
                  <img src={imageUrl} alt="LinkedIn cover" className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
                  <div className="p-2 text-xs space-y-1">
                    <h4 className="font-bold text-gray-200 line-clamp-1 text-[11.5px]">{title}</h4>
                    <span className="text-gray-400 text-[10px] block font-mono">{domain}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generated Meta Tags Copyblock */}
      <div className={`border ${t.border} rounded-2xl overflow-hidden ${t.controlBg}`}>
        <div className={`p-4 ${t.controlBg} border-b ${t.border} flex items-center justify-between`}>
          <span className={`text-xs font-mono ${t.textMuted}`}>READY-TO-COPY HEAD SECTIONS HEADER (&lt;head&gt;):</span>
          <button
            onClick={() => onCopy(getTagsCode(), 'seo-tags')}
            className="p-1.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
          >
            {copiedStatus === 'seo-tags' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedStatus === 'seo-tags' ? 'Tags Copied!' : 'Copy Metadata Block'}
          </button>
        </div>
        <pre className={`p-5 font-mono text-xs text-cyan-300 leading-relaxed overflow-auto max-h-60 select-all ${t.outputBg}`}>
          {getTagsCode()}
        </pre>
      </div>
    </div>
  );
}

// ==========================================
// 2. REDIRECT & HEADER INSPECT CODE
// ==========================================
function RedirectHeaderInspect({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
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

  const [targetUrl, setTargetUrl] = useState('https://github.com');
  const [inspectData, setInspectData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    setLoading(true);
    setError(null);
    setInspectData(null);

    fetch('/api/inspect-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Host resolution failed, host not found, or proxy timeout.');
        return res.json();
      })
      .then((data) => {
        setInspectData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Inspection failed.');
        setLoading(false);
      });
  };

  const getSecurityHeaderScore = () => {
    if (!inspectData || !inspectData.headers) return 0;
    const targets = [
      'content-security-policy',
      'strict-transport-security',
      'x-frame-options',
      'x-content-type-options',
      'referrer-policy'
    ];
    let score = 0;
    targets.forEach((key) => {
      if (inspectData.headers[key]) {
        score++;
      }
    });
    return score;
  };

  const badgeClass = isDark
    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6" id="redirect-header-inspect-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>HTTP</span>
          Redirect Hops & Security Headers Proxy Inspector
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Traces redirectional paths (301/302), checks SSL configuration variables, cipher algorithms, and validates security response headers securely.</p>
      </div>

      <form onSubmit={handleInspect} className="flex gap-2">
        <div className="relative flex-1">
          <Network className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-550 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            className={`w-full p-2.5 pl-10 ${t.inputBg} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500`}
            placeholder="Type web host target (e.g., dev.to or https://stripe.com)..."
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="p-2.5 px-6 bg-cyan-600 text-white rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          disabled={loading}
        >
          {loading ? 'Analyzing Hops...' : 'Dissect Host'}
        </button>
      </form>

      {error && (
        <div className="p-4 border border-rose-950 bg-rose-950/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mb-2" />
          <p className={`text-sm ${t.textMuted}`}>Performing server-side handshake proxy trace and analyzing security profiles...</p>
        </div>
      )}

      {inspectData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Left panel: redirect hops */}
          <div className="space-y-4 lg:col-span-1">
            <div className={`p-5 ${t.panelBg} rounded-2xl`}>
              <span className={`text-xxs font-mono ${t.textFaint} block uppercase mb-3`}>Redirection Path Matrix</span>
              <div className="space-y-3">
                {inspectData.hops.map((hop: any, idx: number) => (
                  <div key={`hop-${idx}`} className="flex items-start gap-2 relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-cyan-500">
                    <div className="text-xs font-mono space-y-0.5 max-w-xs break-all">
                      <p className={`${t.textMuted} select-all leading-tight`}>{hop.url}</p>
                      <span className="inline-block p-0.5 px-1 bg-white/5 border border-white/10 text-[9px] rounded text-cyan-405 font-bold">
                        HTTP {hop.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {inspectData.ssl && (
              <div className="p-5 bg-cyan-950/10 border border-cyan-500/10 rounded-2xl space-y-3">
                <span className="text-xxs font-mono text-cyan-400 block uppercase">SSL CERTIFICATE VALIDITY DETAILS</span>
                <div className={`space-y-2 text-xxs font-mono ${t.textMuted}`}>
                  <p><span className={t.textFaint}>Issued to Subject:</span> <br /><span className={t.heading}>{inspectData.ssl.subject?.CN || 'Unknown'}</span></p>
                  <p><span className={t.textFaint}>Certificate Issuer:</span> <br /><span className={t.heading}>{inspectData.ssl.issuer?.O || inspectData.ssl.issuer?.CN || 'Secure Issuer'}</span></p>
                  <p><span className={t.textFaint}>Connected Cipher:</span> <br /><span className="text-cyan-350">{inspectData.ssl.cipher}</span></p>
                  <p><span className={t.textFaint}>Validity Ends:</span> <br /><span className="text-emerald-400">{inspectData.ssl.valid_to}</span></p>
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Response details & headers */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className={`p-3 ${t.panelBg} rounded-xl`}>
                <span className={`text-xxs font-mono ${t.textFaint} block`}>HTTP STATUS CODE</span>
                <span className="text-lg font-mono font-bold text-emerald-400">{inspectData.status} {inspectData.statusText}</span>
              </div>
              <div className={`p-3 ${t.panelBg} rounded-xl`}>
                <span className={`text-xxs font-mono ${t.textFaint} block`}>RESPONSE TIME</span>
                <span className={`text-lg font-mono font-bold ${t.heading}`}>{inspectData.responseTimeMs} ms</span>
              </div>
              <div className="p-3 bg-cyan-950/15 border border-cyan-500/20 rounded-xl">
                <span className="text-xxs font-mono text-cyan-400 block">SECURITY HEADERS INDEX</span>
                <span className="text-lg font-mono font-bold text-cyan-300">{getSecurityHeaderScore()} / 5 configured</span>
              </div>
            </div>

            {/* Headers explorer */}
            <div className={`border ${t.border} rounded-xl overflow-hidden ${t.controlBg}`}>
              <div className={`p-3.5 ${t.controlBg} border-b ${t.border} flex justify-between items-center text-xs font-mono`}>
                <span className={`${t.textFaint} font-bold uppercase`}>Dissected headers ({Object.keys(inspectData.headers).length} fields)</span>
                <button
                  onClick={() => onCopy(JSON.stringify(inspectData.headers, null, 2), 'headers-inspect')}
                  className={`text-xxs ${t.textFaint} hover:${t.heading} cursor-pointer`}
                >
                  Copy JSON Stream
                </button>
              </div>

              <div className={`divide-y ${t.border} text-xxs font-mono max-h-80 overflow-auto`}>
                {Object.entries(inspectData.headers).map(([key, value]: any) => {
                  const isSecurityHeader = [
                    'content-security-policy',
                    'strict-transport-security',
                    'x-frame-options',
                    'x-content-type-options',
                    'referrer-policy',
                    'access-control-allow-origin'
                  ].includes(key.toLowerCase());

                  return (
                    <div key={key} className={`flex p-2.5 transition-colors ${isSecurityHeader ? 'bg-cyan-500/5 hover:bg-cyan-500/10' : 'hover:bg-white/2'}`}>
                      <span className={`w-1/3 break-all select-all font-bold ${isSecurityHeader ? 'text-cyan-450 font-black' : t.textFaint}`}>
                        {key}
                      </span>
                      <span className={`w-2/3 break-all select-all font-medium ${t.textMuted}`}>
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. DNS MX & TXT Lookup Suite
// ==========================================
function DnsMxTxtLookup({ isDark }: { isDark: boolean }) {
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

  const [queryDomain, setQueryDomain] = useState('');
  const [dnsResults, setDnsResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorHeader, setErrorHeader] = useState<string | null>(null);

  const handleQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryDomain.trim()) return;

    setLoading(true);
    setDnsResults(null);
    setErrorHeader(null);

    fetch('/api/dns-lookup', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain: queryDomain.trim() })
    })
      .then(res => {
        if (!res.ok) throw new Error("Resolver timeout or bad domain configuration.");
        return res.json();
      })
      .then(data => {
        setDnsResults(data);
        setLoading(false);
      })
      .catch((err) => {
        setErrorHeader(err.message || 'Domain resolution failure.');
        setLoading(false);
      });
  };

  const badgeClass = isDark
    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6" id="dns-mx-txt-container">
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${t.border}`}>
        <div>
          <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
            <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>DNS</span>
            Mail MX & TXT Verification Solver
          </h2>
          <p className={`text-sm ${t.textMuted}`}>Target custom domain verification streams, extract TXT site validations (SPF, DKIM, Google site checks), and evaluate MX values.</p>
        </div>
      </div>

      <form onSubmit={handleQuery} className="flex gap-2 font-mono">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            className={`w-full p-2.5 pl-10 ${t.inputBg} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-505`}
            placeholder="Validate domain name (e.g., stripe.com or linear.app)..."
            value={queryDomain}
            onChange={(e) => setQueryDomain(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="p-2.5 px-6 bg-cyan-600 text-white rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-colors flex items-center gap-1 cursor-pointer"
          disabled={loading}
        >
          {loading ? 'Resolving...' : 'Query Records'}
        </button>
      </form>

      {errorHeader && (
        <div className="p-4 border border-rose-950 bg-rose-950/20 text-rose-400 text-xs rounded-lg">
          {errorHeader}
        </div>
      )}

      {loading && (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mb-2" />
          <p className={`text-sm ${t.textMuted} font-mono text-xs`}>Asking DNS authority servers for TXT, SPF, DKIM, and MX configurations...</p>
        </div>
      )}

      {dnsResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* TXT and validation parameters */}
          <div className={`p-5 border ${t.border} rounded-2xl ${t.controlBg} space-y-4`}>
            <span className={`text-xs font-black font-mono text-cyan-400 px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded`}>
              TXT Validation Records - Site Verifications
            </span>
            <div className="space-y-2 max-h-96 overflow-auto">
              {dnsResults.records.TXT && dnsResults.records.TXT.length > 0 ? (
                dnsResults.records.TXT.map((txt: string, i: number) => (
                  <div key={`txt-${i}`} className={`p-3 rounded-lg ${t.controlBg} border ${t.border} space-y-1 font-mono text-xxs break-all select-all`}>
                    <p className={`${t.heading} font-bold leading-normal`}>{txt}</p>
                    <span className={`text-[10px] ${t.textFaint} block`}>
                      {txt.includes('v=spf') ? 'SPF Policy Entry' : txt.includes('google-site-verification') ? 'Google Site Verification Key' : 'Standard TXT Record'}
                    </span>
                  </div>
                ))
              ) : (
                <p className={`text-xs ${t.textFaint} italic p-4 text-center`}>No TXT domain configurations resolved.</p>
              )}
            </div>
          </div>

          {/* Mail MX Priority listings */}
          <div className={`p-5 border ${t.border} rounded-2xl ${t.controlBg} space-y-4`}>
            <span className={`text-xs font-black font-mono text-cyan-400 px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded`}>
              MX Mail Server Router priorities
            </span>
            <div className="space-y-2 max-h-96 overflow-auto">
              {dnsResults.records.MX && dnsResults.records.MX.length > 0 ? (
                dnsResults.records.MX.map((mx: string, i: number) => (
                  <div key={`mx-${i}`} className={`p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10 space-y-1 font-mono text-xxs select-all break-all`}>
                    <p className="text-cyan-300 font-bold leading-none">{mx}</p>
                    <span className="text-[10px] text-cyan-500 block">Configured Mail Exchange Router</span>
                  </div>
                ))
              ) : (
                <p className={`text-xs ${t.textFaint} italic p-4 text-center`}>No MX server routing parameters registered.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}