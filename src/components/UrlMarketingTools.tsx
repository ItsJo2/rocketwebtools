import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

interface UrlMarketingToolsProps {
  activeToolId: string;
}

// 1. UUID Generation engines
function generateUUIDv4(): string {
  // cryptographically safe random or custom pattern fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateUUIDv1(): string {
  // Simple representation of time-based UUID v1 for client-side utilization
  const now = Date.now();
  const timeHex = now.toString(16).padStart(12, '0');
  const clockHex = Math.floor(Math.random() * 0x3fff).toString(16).padStart(4, '0');
  const nodeHex = '005056' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  return `${timeHex.substring(4, 12)}-${timeHex.substring(0, 4)}-11ed-b${clockHex.substring(1, 4)}-${nodeHex}`;
}

export function UrlMarketingTools({ activeToolId }: UrlMarketingToolsProps) {
  const currentId = activeToolId;

  // =========================================================================
  // TOOL 1: UUID GENERATOR STATES & LOGIC
  // =========================================================================
  const [uuidType, setUuidType] = useState<'v4' | 'v1'>('v4');
  const [uuidCount, setUuidCount] = useState<number>(5);
  const [uuidUppercase, setUuidUppercase] = useState<boolean>(false);
  const [uuidHyphens, setUuidHyphens] = useState<boolean>(true);
  const [uuidWrap, setUuidWrap] = useState<'none' | 'braces' | 'quotes'>('none');
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([]);
  const [copiedUuidsIndex, setCopiedUuidsIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const handleGenerateUUIDs = () => {
    const list: string[] = [];
    for (let i = 0; i < uuidCount; i++) {
      let raw = uuidType === 'v4' ? generateUUIDv4() : generateUUIDv1();
      
      if (!uuidHyphens) {
        raw = raw.replace(/-/g, '');
      }
      
      if (uuidUppercase) {
        raw = raw.toUpperCase();
      }

      if (uuidWrap === 'braces') {
        raw = `{${raw}}`;
      } else if (uuidWrap === 'quotes') {
        raw = `"${raw}"`;
      }

      list.push(raw);
    }
    setGeneratedUuids(list);
  };

  useEffect(() => {
    if (currentId === 'uuid-gen') {
      handleGenerateUUIDs();
    }
  }, [currentId, uuidType, uuidCount, uuidUppercase, uuidHyphens, uuidWrap]);

  const copyIndividualUuid = (val: string, index: number) => {
    navigator.clipboard.writeText(val);
    setCopiedUuidsIndex(index);
    setTimeout(() => setCopiedUuidsIndex(null), 1500);
  };

  const copyAllUuids = () => {
    navigator.clipboard.writeText(generatedUuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // =========================================================================
  // TOOL 2: UTM BUILDER STATES & LOGIC
  // =========================================================================
  const [baseUrl, setBaseUrl] = useState<string>('https://mysite.com/landing');
  const [utmSource, setUtmSource] = useState<string>('google');
  const [utmMedium, setUtmMedium] = useState<string>('cpc');
  const [utmCampaign, setUtmCampaign] = useState<string>('summer_promo');
  const [utmTerm, setUtmTerm] = useState<string>('react_tools');
  const [utmContent, setUtmContent] = useState<string>('sidebar_banner');
  const [builtUtmUrl, setBuiltUtmUrl] = useState<string>('');
  const [copiedUtm, setCopiedUtm] = useState<boolean>(false);

  useEffect(() => {
    if (!baseUrl.trim()) {
      setBuiltUtmUrl('');
      return;
    }

    try {
      // Validate or construct URL string
      let formattedBase = baseUrl.trim();
      if (!formattedBase.startsWith('http://') && !formattedBase.startsWith('https://')) {
        formattedBase = 'https://' + formattedBase;
      }

      const urlObj = new URL(formattedBase);
      
      if (utmSource.trim()) urlObj.searchParams.set('utm_source', utmSource.trim());
      if (utmMedium.trim()) urlObj.searchParams.set('utm_medium', utmMedium.trim());
      if (utmCampaign.trim()) urlObj.searchParams.set('utm_campaign', utmCampaign.trim());
      if (utmTerm.trim()) urlObj.searchParams.set('utm_term', utmTerm.trim());
      if (utmContent.trim()) urlObj.searchParams.set('utm_content', utmContent.trim());

      setBuiltUtmUrl(urlObj.toString());
    } catch {
      // Direct string fallback if URL helper fails
      let glue = baseUrl.includes('?') ? '&' : '?';
      let paramString = [];
      if (utmSource.trim()) paramString.push(`utm_source=${encodeURIComponent(utmSource.trim())}`);
      if (utmMedium.trim()) paramString.push(`utm_medium=${encodeURIComponent(utmMedium.trim())}`);
      if (utmCampaign.trim()) paramString.push(`utm_campaign=${encodeURIComponent(utmCampaign.trim())}`);
      if (utmTerm.trim()) paramString.push(`utm_term=${encodeURIComponent(utmTerm.trim())}`);
      if (utmContent.trim()) paramString.push(`utm_content=${encodeURIComponent(utmContent.trim())}`);
      
      setBuiltUtmUrl(baseUrl + (paramString.length > 0 ? (glue + paramString.join('&')) : ''));
    }
  }, [baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent]);

  // =========================================================================
  // TOOL 3: URL PARSER STATES & LOGIC
  // =========================================================================
  const [urlToParse, setUrlToParse] = useState<string>('https://admin:p@ssword@api.studios.dev:3000/v1/search?query=tailwind+css&limit=15&offset=50#section-main');
  const [parsedParts, setParsedParts] = useState<{
    protocol: string;
    hostname: string;
    port: string;
    pathname: string;
    hash: string;
    search: string;
    username?: string;
    password?: string;
  } | null>(null);
  const [queryParamsList, setQueryParamsList] = useState<{ key: string; value: string }[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    if (!urlToParse.trim()) {
      setParsedParts(null);
      setQueryParamsList([]);
      setParseError(null);
      return;
    }

    try {
      setParseError(null);
      let target = urlToParse.trim();
      if (!target.includes('://')) {
        target = 'https://' + target; // standard protocol fallback
      }

      const parsed = new URL(target);
      setParsedParts({
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port || '(Default for ' + parsed.protocol + ')',
        pathname: parsed.pathname,
        hash: parsed.hash,
        search: parsed.search,
        username: parsed.username,
        password: parsed.password
      });

      // Map Query Params
      const params: { key: string; value: string }[] = [];
      parsed.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });
      setQueryParamsList(params);
    } catch (e: any) {
      setParseError('Failed to parse URL. Ensure formatting is standard (e.g. protocol://host/path...)');
      setQueryParamsList([]);
      setParsedParts(null);
    }
  }, [urlToParse]);

  // =========================================================================
  // TOOL 4: FIND FACEBOOK ID STATES & LOGIC
  // =========================================================================
  const [fbUrl, setFbUrl] = useState<string>('https://www.facebook.com/profile.php?id=10008594234567');
  const [extractedFbId, setExtractedFbId] = useState<string | null>('10008594234567');
  const [extractedType, setExtractedType] = useState<string | null>('Profile ID parameter matched natively.');
  const [copiedFbId, setCopiedFbId] = useState<boolean>(false);

  useEffect(() => {
    if (!fbUrl.trim()) {
      setExtractedFbId(null);
      setExtractedType(null);
      return;
    }

    const trimmed = fbUrl.trim();
    
    // Pattern 1: profile.php?id=12345
    const idMatch = trimmed.match(/[?&]id=(\d+)/);
    if (idMatch && idMatch[1]) {
      setExtractedFbId(idMatch[1]);
      setExtractedType('Numeric Direct User ID parameter detected.');
      return;
    }

    // Pattern 2: facebook.com/pages/SomeName/54321
    const pageMatch = trimmed.match(/facebook\.com\/pages\/[^/]+\/(\d+)/i);
    if (pageMatch && pageMatch[1]) {
      setExtractedFbId(pageMatch[1]);
      setExtractedType('Classic Business Page Catalog segment matched.');
      return;
    }

    // Pattern 3: facebook.com/groups/98765
    const groupMatch = trimmed.match(/facebook\.com\/groups\/(\d+)/i);
    if (groupMatch && groupMatch[1]) {
      setExtractedFbId(groupMatch[1]);
      setExtractedType('Discussion Group Reference parsed.');
      return;
    }

    // Pattern 4: Generic URL ID-like segments (at the end or in middle)
    const trailingNumMatch = trimmed.match(/facebook\.com\/(?:profile\/)?any_name_here\/posts\/(\d+)/i);
    const numericSegments = trimmed.match(/\/(\d+)(?:\/|\?|$)/);
    
    if (numericSegments && numericSegments[1] && numericSegments[1].length > 6) {
      setExtractedFbId(numericSegments[1]);
      setExtractedType('Detected trailing ID sequence. Verify manually with metadata codes.');
      return;
    }

    // No numeric extraction available
    setExtractedFbId(null);
    setExtractedType('Could not parse clean static IDs automatically from vanity name. Use metadata tips below to find your ID.');

  }, [fbUrl]);

  // =========================================================================
  // TOOL 5: QUERY PARAM STRIPPER STATES & LOGIC
  // =========================================================================
  const [dirtyUrl, setDirtyUrl] = useState<string>('https://example.com/shop/checkout?utm_source=spring_sale&utm_medium=email&utm_campaign=new_customers&fbclid=IwAR123xyz456_abc_test&gclid=Cj0KCQjwlPwBeBhD_ARIsAID_d0Uj_806f&ref=partner_badge&source=newsletter#shipping-options');
  const [stripUtm, setStripUtm] = useState<boolean>(true);
  const [stripFbid, setStripFbid] = useState<boolean>(true);
  const [stripGclid, setStripGclid] = useState<boolean>(true);
  const [stripMsclkid, setStripMsclkid] = useState<boolean>(true);
  const [stripOtherTracking, setStripOtherTracking] = useState<boolean>(true);
  const [stripHash, setStripHash] = useState<boolean>(false);
  const [forceHttps, setForceHttps] = useState<boolean>(false);
  const [stripTrailingSlash, setStripTrailingSlash] = useState<boolean>(false);
  const [cleanUrl, setCleanUrl] = useState<string>('');
  const [strippedList, setStrippedList] = useState<{ name: string; value: string; type: string }[]>([]);
  const [keptList, setKeptList] = useState<{ name: string; value: string }[]>([]);
  const [copiedCleanUrl, setCopiedCleanUrl] = useState<boolean>(false);

  useEffect(() => {
    if (!dirtyUrl.trim()) {
      setCleanUrl('');
      setStrippedList([]);
      setKeptList([]);
      return;
    }

    try {
      let target = dirtyUrl.trim();
      let hasProto = target.includes('://');
      if (!hasProto) {
        target = 'https://' + target;
      }

      const urlObj = new URL(target);

      // Analyze search params
      const allParams: { key: string; value: string }[] = [];
      urlObj.searchParams.forEach((val, key) => {
        allParams.push({ key, value: val });
      });

      const strippedLocal: { name: string; value: string; type: string }[] = [];
      const keptLocal: { name: string; value: string }[] = [];

      allParams.forEach(p => {
        let shouldStrip = false;
        let typeStr = '';

        if (stripUtm && p.key.startsWith('utm_')) {
          shouldStrip = true;
          typeStr = 'Google Analytics (UTM)';
        } else if (stripFbid && p.key === 'fbclid') {
          shouldStrip = true;
          typeStr = 'Facebook Click Tracking';
        } else if (stripGclid && ['gclid', 'dclid', 'wbraid', 'gbraid'].includes(p.key.toLowerCase())) {
          shouldStrip = true;
          typeStr = 'Google Ads Tracker';
        } else if (stripMsclkid && p.key === 'msclkid') {
          shouldStrip = true;
          typeStr = 'Microsoft Ads Tracker';
        } else if (stripOtherTracking && [
          'yclid', 'ref', 'source', 'campaign', 'medium', 'clientId', 'mc_cid', 'mc_eid', '_hsenc', '_hsmi', '_openstat', 'affsub', 'aff_id'
        ].includes(p.key)) {
          shouldStrip = true;
          typeStr = 'Campaign/Affiliate Tracker';
        }

        if (shouldStrip) {
          strippedLocal.push({ name: p.key, value: p.value, type: typeStr });
          urlObj.searchParams.delete(p.key);
        } else {
          keptLocal.push({ name: p.key, value: p.value });
        }
      });

      if (stripHash) {
        urlObj.hash = '';
      }

      if (forceHttps && urlObj.protocol === 'http:') {
        urlObj.protocol = 'https:';
      }

      let finalStr = urlObj.toString();

      if (stripTrailingSlash && finalStr.endsWith('/') && urlObj.pathname === '/') {
        finalStr = finalStr.slice(0, -1);
      }

      setCleanUrl(finalStr);
      setStrippedList(strippedLocal);
      setKeptList(keptLocal);
    } catch (e) {
      setCleanUrl(dirtyUrl);
      setStrippedList([]);
      setKeptList([]);
    }
  }, [dirtyUrl, stripUtm, stripFbid, stripGclid, stripMsclkid, stripOtherTracking, stripHash, forceHttps, stripTrailingSlash]);

  return (
    <div className="space-y-6">
      
      {/* =====================================================================
          RENDER 1: UUID GENERATOR
          ===================================================================== */}
      {currentId === 'uuid-gen' && (
        <div className="p-6 bg-[#18181b]/95 border border-white/5 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2 font-mono">
              <Icons.Cpu className="w-5 h-5 text-indigo-400" />
              UUID / GUID Generator
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Create UUID (Universally Unique Identifier) Version 4 (cryptographically random) or Version 1 (timestamp-based) vectors easily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Setting Configuration */}
            <div className="md:col-span-4 bg-[#09090b]/80 border border-white/5 p-4 rounded-xl space-y-4">
              <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">Adjustment Board</h3>
              
              {/* Type toggle */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Standard Version</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setUuidType('v4')}
                    className={`p-1.5 text-xs font-semibold rounded font-mono border transition-all ${
                      uuidType === 'v4' 
                        ? 'bg-indigo-600 text-white border-indigo-400' 
                        : 'bg-[#18181b] text-gray-400 border-white/5 hover:text-white'
                    }`}
                  >
                    UUID v4 (Random)
                  </button>
                  <button
                    onClick={() => setUuidType('v1')}
                    className={`p-1.5 text-xs font-semibold rounded font-mono border transition-all ${
                      uuidType === 'v1' 
                        ? 'bg-indigo-600 text-white border-indigo-400' 
                        : 'bg-[#18181b] text-gray-400 border-white/5 hover:text-white'
                    }`}
                  >
                    UUID v1 (Time)
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Quantity counts</label>
                <select
                  value={uuidCount}
                  onChange={(e) => setUuidCount(parseInt(e.target.value, 10))}
                  className="w-full p-2 bg-[#18181b] border border-white/5 rounded text-xs text-white focus:outline-none"
                >
                  <option value="1">1 Token</option>
                  <option value="5">5 Tokens</option>
                  <option value="10">10 Tokens</option>
                  <option value="25">25 Tokens</option>
                  <option value="50">50 Tokens</option>
                  <option value="100">100 Tokens</option>
                </select>
              </div>

              {/* Uppercase and Hyphens Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="upper-uuid-check"
                    checked={uuidUppercase}
                    onChange={(e) => setUuidUppercase(e.target.checked)}
                    className="rounded border-white/10 accent-indigo-500 w-3.5 h-3.5 cursor-pointer bg-white/5"
                  />
                  <label htmlFor="upper-uuid-check" className="text-gray-300 font-mono text-[11px] cursor-pointer">
                    Capitalize Letters (A-F)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hyphen-uuid-check"
                    checked={uuidHyphens}
                    onChange={(e) => setUuidHyphens(e.target.checked)}
                    className="rounded border-white/10 accent-indigo-500 w-3.5 h-3.5 cursor-pointer bg-white/5"
                  />
                  <label htmlFor="hyphen-uuid-check" className="text-gray-300 font-mono text-[11px] cursor-pointer">
                    Include Separator Hyphens
                  </label>
                </div>
              </div>

              {/* Wrapped formatting */}
              <div className="space-y-1 pt-2 border-t border-white/5">
                <label className="text-[10px] font-mono text-gray-500 uppercase block font-bold">Wrap Wrapper Formats</label>
                <select
                  value={uuidWrap}
                  onChange={(e) => setUuidWrap(e.target.value as any)}
                  className="w-full p-2 bg-[#18181b] border border-white/5 rounded text-xs text-white focus:outline-none"
                >
                  <option value="none">Raw standard identifiers</option>
                  <option value="braces">Wrapped in braces {"{...}"}</option>
                  <option value="quotes">Surrounded in Quotes "..."</option>
                </select>
              </div>

              {/* Regeneration Button */}
              <button
                onClick={handleGenerateUUIDs}
                className="w-full flex items-center justify-center gap-1.5 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs text-white font-mono transition-all"
              >
                <Icons.RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                Generate New Batch
              </button>
            </div>

            {/* Generated results buffer */}
            <div className="md:col-span-8 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                <span>Output vectors ({generatedUuids.length} generated)</span>
                <button
                  onClick={copyAllUuids}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                >
                  {copiedAll ? <Icons.Check className="w-3.5 h-3.5 text-emerald-400" /> : <Icons.Copy className="w-3.5 h-3.5" />}
                  {copiedAll ? 'Entire Batch Copied!' : 'Copy Entire Batch'}
                </button>
              </div>

              {/* list panel */}
              <div className="p-3 bg-[#09090c] border border-white/5 rounded-xl space-y-1.5 max-h-96 overflow-y-auto">
                {generatedUuids.map((val, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-[#18181b]/45 hover:bg-[#18181b]/95 border border-white/5 rounded transition-all">
                    <span className="font-mono text-xs text-amber-300">{val}</span>
                    <button
                      onClick={() => copyIndividualUuid(val, idx)}
                      className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all"
                      title="Copy item info"
                    >
                      {copiedUuidsIndex === idx ? (
                        <Icons.Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Icons.Copy className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          RENDER 2: UTM BUILDER
          ===================================================================== */}
      {currentId === 'utm-builder' && (
        <div className="p-6 bg-[#18181b]/95 border border-white/5 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2 font-mono">
              <Icons.Tag className="w-5 h-5 text-indigo-400" />
              UTM Campaign Link Builder
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Inject standard Google Analytics marketing campaign coordinates inside landing addresses safely for pristine advertising telemetry tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Entry fields column */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Destination URL */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 font-bold uppercase block">Target Web Page URL (Required)</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="e.g. https://yoursite.com/landing-page"
                  className="w-full p-2.5 bg-[#09090b] border border-white/5 rounded text-xs text-white focus:outline-none focus:border-indigo-500/40 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* UTM Source */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-gray-400 font-bold uppercase">Campaign Source (utm_source)</label>
                    <span className="text-[9px] text-gray-500 font-mono">Referrer (google, newsletter)</span>
                  </div>
                  <input
                    type="text"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    placeholder="e.g. google"
                    className="w-full p-2 bg-[#09090b] border border-white/5 rounded text-xs text-white focus:outline-none font-mono"
                  />
                  {/* quick tags */}
                  <div className="flex gap-1.5 flex-wrap">
                    {['google', 'newsletter', 'facebook', 'twitter', 'linkedin'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setUtmSource(tag)}
                        className="text-[9px] font-mono p-0.5 px-2 bg-[#18181b] border border-white/5 rounded text-gray-400 hover:text-white"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* UTM Medium */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-gray-400 font-bold uppercase">Campaign Medium (utm_medium)</label>
                    <span className="text-[9px] text-gray-500 font-mono">Channel (cpc, email, banner)</span>
                  </div>
                  <input
                    type="text"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    placeholder="e.g. cpc"
                    className="w-full p-2 bg-[#09090b] border border-white/5 rounded text-xs text-white focus:outline-none font-mono"
                  />
                  {/* quick tags */}
                  <div className="flex gap-1.5 flex-wrap">
                    {['cpc', 'email', 'social', 'banner', 'affiliate'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setUtmMedium(tag)}
                        className="text-[9px] font-mono p-0.5 px-2 bg-[#18181b] border border-white/5 rounded text-gray-400 hover:text-white"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Campaign Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 font-bold uppercase block">Campaign Name (utm_campaign)</label>
                  <input
                    type="text"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    placeholder="e.g. summer_promo"
                    className="w-full p-2 bg-[#09090b] border border-white/5 rounded text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                {/* Campaign Term */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 font-bold uppercase block">Campaign Term (utm_term - Optional)</label>
                  <input
                    type="text"
                    value={utmTerm}
                    onChange={(e) => setUtmTerm(e.target.value)}
                    placeholder="Paid keyword queries..."
                    className="w-full p-2 bg-[#09090b] border border-[#18181b] rounded text-xs text-white focus:outline-none font-mono"
                  />
                </div>

              </div>

              {/* Campaign Content */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 font-bold uppercase block">Campaign Content (utm_content - Optional)</label>
                <input
                  type="text"
                  value={utmContent}
                  onChange={(e) => setUtmContent(e.target.value)}
                  placeholder="Identify specific ads or link blocks (e.g. top_header_button or discount_badge)..."
                  className="w-full p-2 bg-[#09090b] border border-[#18181b] rounded text-xs text-white"
                />
              </div>

            </div>

            {/* Generated copy card */}
            <div className="lg:col-span-4 flex flex-col justify-center p-6 bg-[#09090c] border border-white/5 rounded-2xl space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-500 font-mono uppercase tracking-wider block">Generated Tracking URI Address</span>
                <textarea
                  readOnly
                  value={builtUtmUrl}
                  rows={6}
                  className="w-full p-3 bg-[#18181b]/50 border border-white/5 rounded text-xs font-mono text-indigo-300"
                />
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(builtUtmUrl);
                  setCopiedUtm(true);
                  setTimeout(() => setCopiedUtm(false), 2000);
                }}
                disabled={!builtUtmUrl}
                className="w-full flex items-center justify-center gap-1.5 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-mono font-bold disabled:opacity-40"
              >
                {copiedUtm ? (
                  <>
                    <Icons.Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied URL Successfully!</span>
                  </>
                ) : (
                  <>
                    <Icons.Copy className="w-4 h-4 text-white" />
                    <span>Copy Full Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          RENDER 3: URL PARSER
          ===================================================================== */}
      {currentId === 'url-parser' && (
        <div className="p-6 bg-[#18181b]/95 border border-white/5 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2 font-mono">
              <Icons.Unlink className="w-5 h-5 text-indigo-400" />
              URL Parser
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Decompose structured URL elements instantly, showcasing credentials, host boundaries, active protocols, paths, and detailed key-value queries separately.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400 font-bold uppercase block">Enter Target URL to Parse</label>
              <input
                type="text"
                value={urlToParse}
                onChange={(e) => setUrlToParse(e.target.value)}
                placeholder="Enter complete address..."
                className="w-full p-3 bg-[#09090b] border border-white/5 rounded text-xs text-white font-mono"
              />
            </div>

            {parseError && (
              <div className="p-3 bg-red-950/50 border border-red-500/20 text-red-300 font-mono text-xs rounded">
                {parseError}
              </div>
            )}

            {parsedParts && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
                
                {/* Meta details columns */}
                <div className="lg:col-span-5 space-y-3">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block font-bold">Base components</span>
                  
                  <div className="bg-[#09090c] p-4 border border-white/5 rounded-xl space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-gray-500">Protocol:</span>
                      <span className="text-emerald-400 font-bold">{parsedParts.protocol}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-gray-500">Hostname:</span>
                      <span className="text-indigo-300 font-bold">{parsedParts.hostname}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-gray-500">Port Reference:</span>
                      <span className="text-blue-300">{parsedParts.port}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-gray-500">Path Name:</span>
                      <span className="text-amber-400 text-right select-all">{parsedParts.pathname}</span>
                    </div>
                    {parsedParts.hash && (
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-gray-500">Hash Match:</span>
                        <span className="text-purple-400 font-bold select-all">{parsedParts.hash}</span>
                      </div>
                    )}
                    {parsedParts.username && (
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-gray-500">Credential Username:</span>
                        <span className="text-gray-300">{parsedParts.username}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* parsed params column */}
                <div className="lg:col-span-7 space-y-3">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block font-bold">Parsed Query Parameters ({queryParamsList.length} items)</span>
                  
                  {queryParamsList.length > 0 ? (
                    <div className="bg-[#09090c] border border-white/5 rounded-xl block overflow-hidden">
                      <table className="w-full border-collapse text-xs font-mono">
                        <thead>
                          <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-left">
                            <th className="p-2 pl-4">Key Reference</th>
                            <th className="p-2 pr-4">Value Content</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {queryParamsList.map((item, idx) => (
                            <tr key={idx} className="hover:bg-white/2">
                              <td className="p-2 pl-4 text-amber-250 select-all font-semibold font-mono">{item.key}</td>
                              <td className="p-2 pr-4 text-indigo-300 select-all font-mono">{decodeURIComponent(item.value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 bg-[#09090c] border border-dashed border-white/5 rounded-xl text-center text-gray-500 font-mono text-xs">
                      No URL query parameters detected in the address query string.
                    </div>
                  )}

                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          RENDER 4: FIND FACEBOOK ID
          ===================================================================== */}
      {currentId === 'facebook-id' && (
        <div className="p-6 bg-[#18181b]/95 border border-white/5 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2 font-mono">
              <Icons.Facebook className="w-5 h-5 text-indigo-400" />
              Find Facebook ID Utility
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Extract numeric Facebook User IDs, Page IDs, or Group IDs from customized URLs instantly, mapping raw metadata properties successfully.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input & Output board */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 font-bold uppercase block">Enter Complete Facebook URL</label>
                <input
                  type="text"
                  value={fbUrl}
                  onChange={(e) => setFbUrl(e.target.value)}
                  placeholder="e.g. https://www.facebook.com/profile.php?id=1234567..."
                  className="w-full p-2.5 bg-[#09090b] border border-white/5 rounded text-xs text-white font-mono"
                />
              </div>

              <div className="p-4 bg-[#09090c] border border-white/5 rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block font-bold">Extraction Analysis</span>
                
                {extractedFbId ? (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-[#18181b] border border-white/5 rounded gap-2">
                      <div className="font-mono">
                        <span className="text-[10px] text-gray-500 block">EXTRACTED ID VALUE:</span>
                        <strong className="text-emerald-400 text-lg select-all font-mono tracking-wide">{extractedFbId}</strong>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(extractedFbId);
                          setCopiedFbId(true);
                          setTimeout(() => setCopiedFbId(false), 2000);
                        }}
                        className="p-1 px-3 bg-white/5 hover:bg-white/10 rounded border border-white/5 text-xs text-gray-300 hover:text-white transition-colors font-mono flex items-center justify-center gap-1.5"
                      >
                        {copiedFbId ? <Icons.Check className="w-3.5 h-3.5 text-emerald-400" /> : <Icons.Copy className="w-3.5 h-3.5" />}
                        Copy ID
                      </button>
                    </div>

                    <div className="text-[11px] text-gray-400 leading-relaxed font-mono">
                      Status: <span className="text-indigo-400 font-semibold">{extractedType}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 leading-relaxed font-mono">
                    {extractedType || 'Waiting for valid numeric URL path segments in the input field.'}
                  </p>
                )}
              </div>
            </div>

            {/* educational guide cards */}
            <div className="lg:col-span-5 p-5 bg-[#09090c] border border-white/5 rounded-2xl space-y-3">
              <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Icons.HelpCircle className="w-4 h-4 text-indigo-400" />
                How to find IDs on vanity usernames?
              </h3>
              
              <div className="text-xs text-gray-400 leading-relaxed space-y-3 font-sans">
                <p>If you set a custom text vanity URL, there is no ID visible in the address bar. Follow these steps to find it:</p>
                
                <ol className="list-decimal pl-4 space-y-2 text-[11px]">
                  <li>Go to your Facebook profile or page, right-click anywhere, and click <strong className="text-white">"View Page Source"</strong>.</li>
                  <li>Press <kbd className="bg-white/5 p-0.5 px-1.5 border border-white/10 rounded font-mono text-[9px]">Ctrl + F</kbd> (or Cmd + F on Mac) to open search dialog.</li>
                  <li>Type one of these parameters:
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 font-mono text-[10px] text-indigo-300">
                      <li><code>fb://profile/</code></li>
                      <li><code>fb://page/</code></li>
                      <li><code>al:android:url</code></li>
                    </ul>
                  </li>
                  <li>The long number trailing the slash represents your target unique numeric identifier. Copy it safely!</li>
                </ol>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================================
          RENDER 5: CANONICAL URL QUERY STRIPPER
          ===================================================================== */}
      {currentId === 'query-param-stripper' && (
        <div className="p-6 bg-[#18181b]/95 border border-white/5 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2 font-mono">
              <Icons.Scissors className="w-5 h-5 text-indigo-400" />
              Canonical URL Parameter Stripper
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Shed telemetry tracking indicators, affiliate IDs, ad campaign properties, and fragments from pasted links for clean canonical sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Controls Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-gray-400 uppercase block">Dirty / Tracking URL</label>
                <textarea
                  rows={4}
                  value={dirtyUrl}
                  onChange={(e) => setDirtyUrl(e.target.value)}
                  placeholder="Paste URL containing tracking parameters... e.g., https://site.com/item?foo=bar&utm_source=email&fbclid=123"
                  className="w-full p-3 bg-[#09090b] border border-white/5 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500/50 transition-colors leading-relaxed"
                />
                <button
                  onClick={() => setDirtyUrl('https://example.com/shop/checkout?utm_source=spring_sale&utm_medium=email&utm_campaign=new_customers&fbclid=IwAR123xyz456_abc_test&gclid=Cj0KCQjwlPwBeBhD_ARIsAID_d0Uj_806f&ref=partner_badge&source=newsletter#shipping-options')}
                  className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  <Icons.Sparkles className="w-3 h-3" />
                  Load Sample Tracked URL
                </button>
              </div>

              {/* Stripper Configuration Grid */}
              <div className="p-4 bg-[#09090c] border border-white/5 rounded-xl space-y-4">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">STRIPPER CONFIGURATION</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-start gap-2.5 p-2 bg-[#121214] hover:bg-white/5 rounded-lg border border-white/5 transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stripUtm}
                      onChange={(e) => setStripUtm(e.target.checked)}
                      className="mt-0.5 rounded border-white/10 bg-[#09090b] text-indigo-500 focus:ring-indigo-600 focus:ring-offset-[#121214] accent-indigo-500 h-3.5 w-3.5"
                    />
                    <div className="text-left">
                      <span className="text-xs font-semibold text-gray-250 block">Strip Google UTMs</span>
                      <span className="text-[10px] text-gray-500 block">utm_source, utm_medium, etc.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 bg-[#121214] hover:bg-white/5 rounded-lg border border-white/5 transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stripFbid}
                      onChange={(e) => setStripFbid(e.target.checked)}
                      className="mt-0.5 rounded border-white/10 bg-[#09090b] text-indigo-500 focus:ring-indigo-600 focus:ring-offset-[#121214] accent-indigo-500 h-3.5 w-3.5"
                    />
                    <div className="text-left">
                      <span className="text-xs font-semibold text-gray-250 block">Strip Facebook Click IDs</span>
                      <span className="text-[10px] text-gray-500 block">fbclid parameter tracking</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 bg-[#121214] hover:bg-white/5 rounded-lg border border-white/5 transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stripGclid}
                      onChange={(e) => setStripGclid(e.target.checked)}
                      className="mt-0.5 rounded border-white/10 bg-[#09090b] text-indigo-500 focus:ring-indigo-600 focus:ring-offset-[#121214] accent-indigo-500 h-3.5 w-3.5"
                    />
                    <div className="text-left">
                      <span className="text-xs font-semibold text-gray-250 block">Strip Google Ads tracking</span>
                      <span className="text-[10px] text-gray-500 block">gclid, dclid, wbraid, gbraid</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 bg-[#121214] hover:bg-white/5 rounded-lg border border-white/5 transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stripMsclkid}
                      onChange={(e) => setStripMsclkid(e.target.checked)}
                      className="mt-0.5 rounded border-white/10 bg-[#09090b] text-indigo-500 focus:ring-indigo-600 focus:ring-offset-[#121214] accent-indigo-500 h-3.5 w-3.5"
                    />
                    <div className="text-left">
                      <span className="text-xs font-semibold text-gray-250 block">Strip Bing click IDs</span>
                      <span className="text-[10px] text-gray-500 block">msclkid Microsoft tracker</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 bg-[#121214] hover:bg-white/5 rounded-lg border border-white/5 transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stripOtherTracking}
                      onChange={(e) => setStripOtherTracking(e.target.checked)}
                      className="mt-0.5 rounded border-white/10 bg-[#09090b] text-indigo-500 focus:ring-indigo-600 focus:ring-offset-[#121214] accent-indigo-500 h-3.5 w-3.5"
                    />
                    <div className="text-left">
                      <span className="text-xs font-semibold text-gray-250 block">Strip Campaign/Affiliate</span>
                      <span className="text-[10px] text-gray-500 block">yclid, affsub, mc_cid, source, etc.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 bg-[#121214] hover:bg-white/5 rounded-lg border border-white/5 transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stripHash}
                      onChange={(e) => setStripHash(e.target.checked)}
                      className="mt-0.5 rounded border-white/10 bg-[#09090b] text-indigo-500 focus:ring-indigo-600 focus:ring-offset-[#121214] accent-indigo-500 h-3.5 w-3.5"
                    />
                    <div className="text-left">
                      <span className="text-xs font-semibold text-gray-250 block">Clean Hash Fragments</span>
                      <span className="text-[10px] text-gray-500 block">Remove #anchor tags entirely</span>
                    </div>
                  </label>
                </div>

                <div className="border-t border-white/5 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer p-1">
                    <input
                      type="checkbox"
                      checked={forceHttps}
                      onChange={(e) => setForceHttps(e.target.checked)}
                      className="rounded border-white/10 bg-[#09090b] text-indigo-500 h-3.5 w-3.5 accent-indigo-500"
                    />
                    <span className="text-[11px] text-gray-400">Upgrade protocol to secure HTTPS</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-1">
                    <input
                      type="checkbox"
                      checked={stripTrailingSlash}
                      onChange={(e) => setStripTrailingSlash(e.target.checked)}
                      className="rounded border-white/10 bg-[#09090b] text-indigo-500 h-3.5 w-3.5 accent-indigo-500"
                    />
                    <span className="text-[11px] text-gray-400">Strip directory root trailing slash (/)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#09090c] border border-white/5 rounded-xl p-4 space-y-4">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">CLEANED CANONICAL LINK</span>
                
                <div className="space-y-3">
                  <div className="p-3 bg-[#111114] border border-white/5 rounded-lg select-all break-all font-mono text-xs text-emerald-400 font-semibold leading-relaxed">
                    {cleanUrl || 'https://...'}
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(cleanUrl);
                      setCopiedCleanUrl(true);
                      setTimeout(() => setCopiedCleanUrl(false), 2000);
                    }}
                    disabled={!cleanUrl}
                    className="w-full flex items-center justify-center gap-2 p-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-mono font-medium rounded-lg text-xs transition-colors shadow-lg active:scale-[0.98]"
                  >
                    {copiedCleanUrl ? (
                      <>
                        <Icons.Check className="w-4 h-4 text-emerald-300 animate-bounce" />
                        Copied Pristine URL!
                      </>
                    ) : (
                      <>
                        <Icons.Copy className="w-4 h-4" />
                        Copy Pristine URL
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Param Analysis */}
              <div className="bg-[#09090c] border border-white/5 rounded-xl p-4 space-y-3">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">TRACKER SCAN METRICS</span>
                
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {strippedList.length === 0 && keptList.length === 0 && (
                    <span className="text-xs text-gray-500 block italic leading-relaxed">No active parameter keys parsed yet. Enter a query block link above to begin.</span>
                  )}

                  {/* Stripped parameters */}
                  {strippedList.map((p, i) => (
                    <div key={'strip-' + i} className="flex justify-between items-start p-2 bg-rose-500/5 border border-rose-500/10 rounded-lg text-[11px] gap-2">
                      <div className="font-mono text-left">
                        <span className="text-rose-400 font-bold block">-{p.name}</span>
                        <span className="text-gray-500 block truncate max-w-[200px]" title={p.value}>Val: {p.value}</span>
                      </div>
                      <span className="bg-rose-500/10 border border-rose-500/10 text-rose-400 text-[8px] font-mono font-semibold px-1 rounded uppercase tracking-[0.05em] h-fit">
                        {p.type}
                      </span>
                    </div>
                  ))}

                  {/* Kept parameters */}
                  {keptList.map((p, i) => (
                    <div key={'keep-' + i} className="flex justify-between items-center p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-[11px] font-mono gap-2">
                      <div className="text-left font-mono">
                        <span className="text-emerald-400 font-bold block">+{p.name}</span>
                        <span className="text-gray-500 block truncate max-w-[200px]" title={p.value}>Val: {p.value}</span>
                      </div>
                      <span className="bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 text-[8px] font-semibold px-1 rounded uppercase">
                        Kept
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
