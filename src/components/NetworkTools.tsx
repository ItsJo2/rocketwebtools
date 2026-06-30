import React, { useState, useEffect } from 'react';
import { NetworkResponse, DnsResponse } from '../types';
import { Globe, Terminal, ShieldAlert, Wifi, Search, AlertCircle, Copy, Check, MapPin, Compass, Server } from 'lucide-react';

interface NetworkToolsProps {
  activeToolId: string;
  isDark: boolean;
}

export function NetworkTools({ activeToolId, isDark }: NetworkToolsProps) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(id);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  if (activeToolId === 'my-ip' || activeToolId === 'what-is-my-ip') {
    return <VisitorAnalyzer isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'ip-lookup') {
    return <IpLookup isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'dns-lookup') {
    return <DnsLookup isDark={isDark} />;
  }

  return null;
}

// 1. IP & VISITORS HEADERS ANALYZER
function VisitorAnalyzer({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
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

  const [info, setInfo] = useState<NetworkResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/visitor-info')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to reach server backend api details.');
        return res.json();
      })
      .then((data: NetworkResponse) => {
        setInfo(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Server context offline. Check console logs.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-2" />
        <p className={`text-sm ${t.textMuted}`}>Querying request headers and remote routing channels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border border-rose-950 bg-rose-950/20 rounded-xl flex items-center gap-3">
        <ShieldAlert className="w-8 h-8 text-rose-500 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-rose-400">Backend Query Timeout</h4>
          <p className="text-xs text-rose-350 mt-0.5">{error}. Ensure the Express server dev script is properly mounted.</p>
        </div>
      </div>
    );
  }

  const badgeClass = isDark
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : 'bg-emerald-50 text-emerald-600 border-emerald-200';

  return (
    <div className="space-y-6" id="visitor-analyzer-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>NETWORK</span>
          My IP & Request Headers Analyzer
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Examine standard values sent by your browser. No cookies or server logs are persisted.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core details */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-[#132a22]/40 border border-emerald-500/20 p-5 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Wifi className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider">detected address</span>
            </div>
            <div className="text-2xl font-black text-emerald-200 font-mono break-all">{info?.ip}</div>
            <p className="text-xs text-emerald-400/80 mt-1">Direct remote source IP address resolved by the request parser.</p>
          </div>

          <div className={`${t.panelBg} p-5 rounded-xl`}>
            <h4 className={`text-xs font-bold ${t.textFaint} uppercase font-mono mb-2`}>detected agent</h4>
            <p className={`text-xs ${t.textMuted} leading-relaxed break-all font-mono ${t.controlBg} p-3 rounded border ${t.border}`}>
              {info?.userAgent}
            </p>
          </div>
        </div>

        {/* Full request headers */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-mono ${t.textMuted}`}>REQUEST HEADERS MAP ({Object.keys(info?.headers || {}).length} variables):</span>
            <button 
              type="button"
              onClick={() => onCopy(JSON.stringify(info?.headers, null, 2), 'h-map')}
              className={`text-xs hover:text-indigo-400 inline-flex items-center gap-1 ${t.textMuted} cursor-pointer`}
            >
              {copiedStatus === 'h-map' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedStatus === 'h-map' ? 'Copied Full Map' : 'Copy Headers Map'}
            </button>
          </div>
          <div className={`border ${t.border} rounded-xl overflow-hidden ${t.controlBg}`}>
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className={`${t.controlBg} border-b ${t.border} ${t.textFaint}`}>
                  <th className="p-3 font-semibold uppercase">Header Name</th>
                  <th className="p-3 font-semibold uppercase">Header Value</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${t.border} ${t.textMuted}`}>
                {info && Object.entries(info.headers).map(([k, v]) => (
                  <tr key={k} className="hover:bg-white/5">
                    <td className="p-3 font-medium text-indigo-400 break-all select-all">{k}</td>
                    <td className="p-3 break-all select-all font-mono">{v}</td>
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

// 2. AUTHENTIC DNS record LOOKUP
function DnsLookup({ isDark }: { isDark: boolean }) {
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

  const [domain, setDomain] = useState('');
  const [dnsData, setDnsData] = useState<DnsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError(null);
    setDnsData(null);

    fetch('/api/dns-lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: domain.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Lookup error or connection timeout on target resolver.');
        return res.json();
      })
      .then((data: DnsResponse) => {
        setDnsData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'DNS request failed.');
        setLoading(false);
      });
  };

  const loadDemoDomain = (dem: string) => {
    setDomain(dem);
  };

  const badgeClass = isDark
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : 'bg-emerald-50 text-emerald-600 border-emerald-200';

  return (
    <div className="space-y-6" id="dns-lookup-container">
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${t.border}`}>
        <div>
          <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
            <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>NETWORK</span>
            DNS Lookup Tool
          </h2>
          <p className={`text-sm ${t.textMuted}`}>Query and resolve standard DNS records (A, AAAA, MX, TXT, NS, CNAME) globally.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={t.textFaint}>Quick tests:</span>
          <button 
            type="button" 
            onClick={() => loadDemoDomain('google.com')}
            className={`p-1 px-2 rounded border ${t.border} ${t.controlBg} hover:bg-white/10 cursor-pointer ${t.textMuted} font-medium transition-colors`}
          >
            google.com
          </button>
          <button 
            type="button" 
            onClick={() => loadDemoDomain('github.com')}
            className={`p-1 px-2 rounded border ${t.border} ${t.controlBg} hover:bg-white/10 cursor-pointer ${t.textMuted} font-medium transition-colors`}
          >
            github.com
          </button>
        </div>
      </div>

      <form onSubmit={handleLookup} className="flex gap-2">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            className={`w-full p-2.5 pl-10 ${t.inputBg} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
            placeholder="Type domain name (e.g. vercel.com or stripe.com)..."
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="p-2.5 px-5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          disabled={loading}
        >
          <Search className="w-4 h-4" />
          {loading ? 'Querying...' : 'Resolve Records'}
        </button>
      </form>

      {error && (
        <div className="p-4 border border-rose-950 bg-rose-950/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {dnsData && (
        <div className="space-y-4">
          <div className={`flex items-center gap-1.5 text-xs ${t.textMuted}`}>
            <span>RESOLVED TARGET:</span>
            <span className={`font-mono font-bold ${t.controlBg} border ${t.border} ${t.heading} p-0.5 px-1.5 rounded`}>{dnsData.domain}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(dnsData.records).map(([type, rawRecords]) => {
              const records = (rawRecords || []) as string[];
              return (
                <div key={type} className={`border ${t.border} rounded-xl ${t.controlBg} p-4 flex flex-col justify-between`}>
                  <div>
                    <div className={`flex items-center justify-between pb-2 border-b ${t.border} mb-3`}>
                      <span className="text-xs font-black font-mono text-indigo-400 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded">
                        {type} Record
                      </span>
                      <span className={`text-xxs uppercase tracking-wider ${t.textFaint} font-mono`}>
                        {records.length} resolved
                      </span>
                    </div>
                    {records.length > 0 ? (
                      <ul className="space-y-1.5 font-mono text-xs">
                        {records.map((r, idx) => (
                          <li key={idx} className={`${t.controlBg} p-1.5 px-2.5 rounded border ${t.border} break-all select-all ${t.textMuted} hover:${t.heading}`}>
                            {r}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-xs ${t.textFaint} italic py-2`}>No records declared or found for this configuration.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface IpGeoInfo {
  query: string;
  status: string;
  country?: string;
  countryCode?: string;
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
  org?: string;
  as?: string;
  message?: string;
}

function IpLookup({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
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

  const [targetIp, setTargetIp] = useState('');
  const [geoData, setGeoData] = useState<IpGeoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGeoIp = (ip: string) => {
    if (!ip.trim()) return;
    setLoading(true);
    setError(null);
    setGeoData(null);

    fetch('/api/ip-lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip: ip.trim() })
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Server rejected geo-IP request address.');
        }
        return res.json();
      })
      .then((data: IpGeoInfo) => {
        if (data.status === 'fail') {
          throw new Error(data.message || 'Lookup query failed. Confirm it is a valid public IP.');
        }
        setGeoData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to resolve coordinates. Recheck your connection.');
        setLoading(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetIp.trim()) return;
    fetchGeoIp(targetIp);
  };

  // Populate own IP on mount
  useEffect(() => {
    fetch('/api/visitor-info')
      .then((res) => res.json())
      .then((data) => {
        if (data.ip) {
          setTargetIp(data.ip);
          fetchGeoIp(data.ip);
        }
      })
      .catch(() => {});
  }, []);

  const badgeClass = isDark
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : 'bg-emerald-50 text-emerald-600 border-emerald-200';

  return (
    <div className="space-y-6" id="ip-lookup-container">
      <div className={`pb-4 border-b ${t.border} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
        <div>
          <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
            <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>NETWORK</span>
            IP Address Lookup
          </h2>
          <p className={`text-sm ${t.textMuted}`}>Resolve precision geographical metadata, coordinates, and ISP data for any IPv4 or IPv6 address.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            className={`w-full p-2.5 pl-11 ${t.inputBg} rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-550 font-mono`}
            placeholder="Type IPv4 or IPv6 address (e.g. 8.8.8.8)..."
            value={targetIp}
            onChange={(e) => setTargetIp(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="p-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow whitespace-nowrap"
          disabled={loading}
        >
          <Search className="w-4 h-4" />
          {loading ? 'Resolving...' : 'Locate IP'}
        </button>
      </form>

      {error && (
        <div className="p-4 border border-rose-950 bg-rose-950/20 text-red-400 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <Compass className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
          <p className={`text-sm ${t.textMuted}`}>Retrieving coordinates and router nodes for target address...</p>
        </div>
      )}

      {geoData && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Info Panels */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Country and City Banner */}
            <div className={`p-5 ${t.panelBg} rounded-2xl flex items-center justify-between`}>
              <div>
                <span className={`text-[10px] font-mono uppercase font-bold text-indigo-400 tracking-wider`}>Geographic Boundary</span>
                <h3 className={`text-xl font-bold ${t.heading} mt-1`}>
                  {geoData.city ? `${geoData.city}, ` : ''}{geoData.regionName ? `${geoData.regionName}, ` : ''}{geoData.country}
                </h3>
                <div className={`flex items-center gap-2 text-xs ${t.textMuted} mt-1`}>
                  <span className={`${t.controlBg} p-1 px-2 border ${t.border} font-mono text-[10px] rounded uppercase ${t.textFaint}`}>
                    ZIP: {geoData.zip || 'N/A'}
                  </span>
                  <span className={`${t.controlBg} p-1 px-2 border ${t.border} font-mono text-[10px] rounded uppercase ${t.textFaint}`}>
                    TimeZone: {geoData.timezone || 'N/A'}
                  </span>
                </div>
              </div>
              {geoData.countryCode && (
                <div 
                  className={`w-14 h-10 ${t.controlBg} border ${t.border} rounded-lg flex items-center justify-center font-bold text-base font-mono text-indigo-300`}
                  title={`ISO Country Code: ${geoData.countryCode}`}
                >
                  {geoData.countryCode}
                </div>
              )}
            </div>

            {/* ISP and Node Infrastructure */}
            <div className={`p-5 ${t.panelBg} rounded-2xl space-y-3.5 font-mono text-xs`}>
              <h4 className={`text-[10px] font-bold ${t.textFaint} uppercase tracking-widest flex items-center gap-1.5 border-b ${t.border} pb-2`}>
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                Connectivity & Routing Details
              </h4>

              <div className="flex justify-between items-center py-1">
                <span className={t.textFaint}>ISP / Vendor:</span>
                <span className={`${t.heading} select-all font-bold text-right max-w-[200px] break-all`}>{geoData.isp || 'Unavailable'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t ${t.border}">
                <span className={t.textFaint}>Organization:</span>
                <span className={`${t.heading} select-all text-right max-w-[200px] break-all`}>{geoData.org || 'Unknown'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t ${t.border} font-bold text-indigo-400">
                <span className={t.textFaint}>ASN:</span>
                <span className="select-all text-right max-w-[200px] break-all">{geoData.as || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t ${t.border}">
                <span className={t.textFaint}>IP Queries:</span>
                <button
                  type="button"
                  onClick={() => onCopy(geoData.query, 'ip-cpy')}
                  className={`hover:text-blue-400 font-medium select-all hover:scale-101 transition-transform cursor-pointer ${t.textMuted}`}
                >
                  {copiedStatus === 'ip-cpy' ? 'Copied IP' : geoData.query}
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Map */}
          <div className={`lg:col-span-6 ${t.panelBg} p-4 rounded-2xl flex flex-col`}>
            <div className={`flex justify-between items-center text-xs font-mono mb-3 uppercase tracking-wider ${t.textFaint} font-bold`}>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-rose-500 animate-bounce" />
                Active Coordinates Mapper
              </span>
              <span className="text-[10px] bg-red-950/20 text-red-400 border border-red-500/10 px-2 py-0.5 rounded">
                LAT {geoData.lat?.toFixed(4)}, LON {geoData.lon?.toFixed(4)}
              </span>
            </div>

            {/* Embed OpenStreetMap Iframe to view the coordinates with a dynamic pinpoint marker */}
            {geoData.lat !== undefined && geoData.lon !== undefined ? (
              <div className="flex-grow min-h-[220px] bg-black rounded-lg overflow-hidden border border-white/5 relative">
                <iframe
                  title="IP Location Coordinates OSM Viewport"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${geoData.lon - 0.04}%2C${geoData.lat - 0.04}%2C${geoData.lon + 0.04}%2C${geoData.lat + 0.04}&layer=mapnik&marker=${geoData.lat}%2C${geoData.lon}`}
                  className="absolute inset-0 w-full h-full grayscale opacity-85 contrast-110 hover:grayscale-20 hover:opacity-100 transition-all duration-350"
                />
              </div>
            ) : (
              <div className={`flex-grow min-h-[220px] ${t.controlBg} border ${t.border} rounded-lg flex items-center justify-center font-mono text-center text-xs ${t.textFaint}`}>
                Coordinates unavailable. Map preview suppressed.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}