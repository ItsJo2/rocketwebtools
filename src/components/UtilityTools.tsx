import React, { useState } from 'react';
import { Shield, Key, RefreshCw, Calendar, Sparkles, Scale, Info, Check, Copy, Image as ImageIcon, UploadCloud, Trash2, ArrowRight, Download, CheckCircle, HelpCircle, FileImage, FileText, Code, RotateCw } from 'lucide-react';

interface UtilityToolsProps {
  activeToolId: string;
  isDark: boolean;
}

export function UtilityTools({ activeToolId, isDark }: UtilityToolsProps) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(id);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  if (activeToolId === 'pass-gen') {
    return <PasswordGenerator isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'password-entropy') {
    return <PasswordEntropyCalculator isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'unit-conv') {
    return <UnitConverter isDark={isDark} />;
  }
  if (activeToolId === 'age-calc') {
    return <AgeCalculator isDark={isDark} />;
  }
  if (activeToolId === 'png-to-jpg') {
    return <PngToJpgConverter isDark={isDark} />;
  }
  if (activeToolId === 'ico-to-png') {
    return <IcoToPngConverter isDark={isDark} />;
  }
  if (activeToolId === 'ico-converter') {
    return <IcoConverter isDark={isDark} />;
  }
  if (activeToolId === 'image-to-base64') {
    return <ImageToBase64 isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'base64-to-image') {
    return <Base64ToImage isDark={isDark} />;
  }
  if (activeToolId === 'flip-image') {
    return <FlipImage isDark={isDark} />;
  }

  return null;
}

// 1. HIGH SECURITY PASSWORD GENERATOR
function PasswordGenerator({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
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

  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeDuplicates, setExcludeDuplicates] = useState(false);
  const [password, setPassword] = useState('');

  const generatePassword = () => {
    let charset = '';
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-';

    if (!charset) {
      setPassword('Check some character options!');
      return;
    }

    let generated = '';
    const tempCharset = charset.split('');

    for (let i = 0; i < length; i++) {
      if (excludeDuplicates && tempCharset.length === 0) break;
      const idx = Math.floor(Math.random() * tempCharset.length);
      generated += tempCharset[idx];
      if (excludeDuplicates) {
        tempCharset.splice(idx, 1);
      }
    }
    setPassword(generated);
  };

  const getStrengthRating = () => {
    if (!password) return { text: 'Empty', color: 'bg-gray-200 text-gray-500', width: 'w-0' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score += 2;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score += 2;

    if (score < 4) return { text: 'Very Weak ⚠️', color: 'bg-rose-500 text-white', width: 'w-1/4' };
    if (score < 6) return { text: 'Fair ⚡', color: 'bg-amber-500 text-white', width: 'w-2/4' };
    if (score < 8) return { text: 'Strong Check 🛡️', color: 'bg-emerald-500 text-white', width: 'w-3/4' };
    return { text: 'Military Grade 🔥', color: 'bg-indigo-600 text-white', width: 'w-full' };
  };

  const strength = getStrengthRating();

  const badgeClass = isDark
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6" id="password-generator-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>UTILITY</span>
          Flexible Password Generator
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Generate randomized, high entropy password sequences directly in browser context.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 space-y-4 font-sans text-sm ${t.textMuted} ${t.panelBg} p-5 rounded-xl`}>
          <div>
            <div className={`flex justify-between items-center mb-1 font-semibold ${t.heading}`}>
              <span>Length:</span>
              <span className="font-mono text-indigo-400">{length} characters</span>
            </div>
            <input 
              type="range" 
              min="6" 
              max="64" 
              value={length} 
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 text-indigo-600 h-1.5 bg-[#252525] border border-white/5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2.5 pt-2">
            <label className={`flex items-center gap-2 cursor-pointer font-medium ${t.textMuted} hover:${t.heading}`}>
              <input type="checkbox" checked={includeUpper} onChange={(e) => setIncludeUpper(e.target.checked)} className="rounded border-white/10 text-indigo-650 accent-indigo-650 w-4 h-4 cursor-pointer" />
              <span>Uppercase (A-Z)</span>
            </label>
            <label className={`flex items-center gap-2 cursor-pointer font-medium ${t.textMuted} hover:${t.heading}`}>
              <input type="checkbox" checked={includeLower} onChange={(e) => setIncludeLower(e.target.checked)} className="rounded border-white/10 text-indigo-650 accent-indigo-650 w-4 h-4 cursor-pointer" />
              <span>Lowercase (a-z)</span>
            </label>
            <label className={`flex items-center gap-2 cursor-pointer font-medium ${t.textMuted} hover:${t.heading}`}>
              <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="rounded border-white/10 text-indigo-650 accent-indigo-650 w-4 h-4 cursor-pointer" />
              <span>Numbers (0-9)</span>
            </label>
            <label className={`flex items-center gap-2 cursor-pointer font-medium ${t.textMuted} hover:${t.heading}`}>
              <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="rounded border-white/10 text-indigo-650 accent-indigo-650 w-4 h-4 cursor-pointer" />
              <span>Symbols (!@#$%)</span>
            </label>
            <label className={`flex items-center gap-2 cursor-pointer font-medium text-amber-400 hover:text-amber-300 pt-2 border-t ${t.border}`}>
              <input type="checkbox" checked={excludeDuplicates} onChange={(e) => setExcludeDuplicates(e.target.checked)} className="rounded border-white/10 text-indigo-650 accent-indigo-655 w-4 h-4 cursor-pointer" />
              <span>Unique keys only</span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                readOnly
                className={`w-full p-3 pl-11 pr-12 ${t.inputBg} rounded-xl text-lg font-mono font-semibold tracking-wide select-all placeholder-gray-600`}
                placeholder="Click the purple button to trigger..."
                value={password}
              />
              {password && (
                <button
                  type="button"
                  onClick={() => onCopy(password, 'pwd')}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${t.textFaint} hover:text-indigo-400 cursor-pointer`}
                  title="Copy password"
                >
                  {copiedStatus === 'pwd' ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={generatePassword}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all cursor-pointer flex items-center gap-1 font-semibold text-sm whitespace-nowrap shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate</span>
            </button>
          </div>

          {password && (
            <div className={`p-4 border ${t.border} rounded-xl space-y-3 ${t.controlBg}`}>
              <div className="flex justify-between items-center text-xs">
                <span className={`font-mono ${t.textMuted}`}>ENTROPY STRENGTH LEVEL:</span>
                <span className={`p-1 px-3.5 text-xs font-black rounded-full ${strength.color}`}>
                  {strength.text}
                </span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-[#252525]" : "bg-gray-200"}`}>
                <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`} />
              </div>
              <div className={`flex items-start gap-1.5 text-xxs ${t.textFaint} pt-1`}>
                <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Computed browser-side inside standard local Math.random cycles. Completely client private.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. UNIT CONVERTER
function UnitConverter({ isDark }: { isDark: boolean }) {
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

  const [category, setCategory] = useState<'length' | 'temp' | 'data'>('length');
  const [val, setVal] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [result, setResult] = useState<number | null>(null);

  const units = {
    length: [
      { name: 'Meters (m)', code: 'm', factor: 1 },
      { name: 'Feet (ft)', code: 'ft', factor: 3.28084 },
      { name: 'Inches (in)', code: 'in', factor: 39.3701 },
      { name: 'Kilometers (km)', code: 'km', factor: 0.001 },
      { name: 'Miles (mi)', code: 'mi', factor: 0.000621371 }
    ],
    data: [
      { name: 'Bytes (B)', code: 'B', factor: 1 },
      { name: 'Kilobytes (KB)', code: 'KB', factor: 0.001 },
      { name: 'Megabytes (MB)', code: 'MB', factor: 0.000001 },
      { name: 'Gigabytes (GB)', code: 'GB', factor: 0.000000001 },
      { name: 'Terabytes (TB)', code: 'TB', factor: 0.000000000001 }
    ]
  };

  const handleConvert = () => {
    if (category === 'temp') {
      let celsius = val;
      if (fromUnit === 'f') celsius = (val - 32) * (5/9);
      if (fromUnit === 'k') celsius = val - 273.15;

      let rVal = celsius;
      if (toUnit === 'f') rVal = celsius * (9/5) + 32;
      if (toUnit === 'k') rVal = celsius + 273.15;

      setResult(parseFloat(rVal.toFixed(4)));
    } else {
      const unitsList = category === 'length' ? units.length : units.data;
      const fromObj = unitsList.find(u => u.code === fromUnit);
      const toObj = unitsList.find(u => u.code === toUnit);

      if (fromObj && toObj) {
        const baseVal = val / fromObj.factor;
        const converted = baseVal * toObj.factor;
        setResult(parseFloat(converted.toFixed(6)));
      }
    }
  };

  const handleSetCategory = (cat: 'length' | 'temp' | 'data') => {
    setCategory(cat);
    setResult(null);
    if (cat === 'length') {
      setFromUnit('m');
      setToUnit('ft');
    } else if (cat === 'temp') {
      setFromUnit('c');
      setToUnit('f');
    } else {
      setFromUnit('B');
      setToUnit('MB');
    }
  };

  const badgeClass = isDark
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6" id="unit-converter-container">
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${t.border}`}>
        <div>
          <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
            <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>UTILITY</span>
            Multi-Unit Converter
          </h2>
          <p className={`text-sm ${t.textMuted}`}>Convert quantities cleanly between computer sizes, physical lengths, or temperatures.</p>
        </div>
        <div className={`${t.controlBg} p-1 rounded-lg flex inline-flex text-xs font-semibold border ${t.border}`}>
          <button type="button" className={`p-1.5 px-3 rounded cursor-pointer transition-all ${category === 'length' ? 'bg-indigo-600 text-white shadow' : `${t.textMuted} hover:${t.heading}`}`} onClick={() => handleSetCategory('length')}>Length</button>
          <button type="button" className={`p-1.5 px-3 rounded cursor-pointer transition-all ${category === 'temp' ? 'bg-indigo-600 text-white shadow' : `${t.textMuted} hover:${t.heading}`}`} onClick={() => handleSetCategory('temp')}>Temp</button>
          <button type="button" className={`p-1.5 px-3 rounded cursor-pointer transition-all ${category === 'data' ? 'bg-indigo-600 text-white shadow' : `${t.textMuted} hover:${t.heading}`}`} onClick={() => handleSetCategory('data')}>Data Size</button>
        </div>
      </div>

      <div className={`p-5 border ${t.border} rounded-xl ${t.controlBg} space-y-4`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>Quantity/Value:</label>
            <input 
              type="number" 
              className={`w-full p-2.5 ${t.inputBg} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
              value={val}
              onChange={(e) => {
                setVal(parseFloat(e.target.value) || 0);
              }}
            />
          </div>

          <div>
            <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>From Unit:</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className={`w-full p-2.5 ${t.selectBg} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
            >
              {category === 'length' && units.length.map(u => <option key={u.code} value={u.code}>{u.name}</option>)}
              {category === 'data' && units.data.map(u => <option key={u.code} value={u.code}>{u.name}</option>)}
              {category === 'temp' && (
                <>
                  <option value="c">Celsius (°C)</option>
                  <option value="f">Fahrenheit (°F)</option>
                  <option value="k">Kelvin (K)</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className={`text-xs font-semibold ${t.textMuted} block mb-1`}>To Unit:</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className={`w-full p-2.5 ${t.selectBg} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
            >
              {category === 'length' && units.length.map(u => <option key={u.code} value={u.code}>{u.name}</option>)}
              {category === 'data' && units.data.map(u => <option key={u.code} value={u.code}>{u.name}</option>)}
              {category === 'temp' && (
                <>
                  <option value="c">Celsius (°C)</option>
                  <option value="f">Fahrenheit (°F)</option>
                  <option value="k">Kelvin (K)</option>
                </>
              )}
            </select>
          </div>
        </div>

        <button 
          type="button" 
          onClick={handleConvert}
          className="w-full p-2.5 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors rounded-lg cursor-pointer shadow"
        >
          Convert Unit Values
        </button>

        {result !== null && (
          <div className="mt-4 p-4 border border-indigo-500/20 bg-[#1a1c2e] rounded-xl text-center">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-mono">CONVERSION RESULT:</div>
            <div className="text-2xl font-black text-indigo-200 mt-1 font-mono">
              {val} {fromUnit} = {result} {toUnit}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 3. AGE & LEAP YEAR COUNTDOWN
function AgeCalculator({ isDark }: { isDark: boolean }) {
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

  const [birthdate, setBirthdate] = useState('');
  const [stats, setStats] = useState<{
    years: number;
    months: number;
    days: number;
    hours: number;
    totalDays: number;
    zodiac: string;
    nextBirthday: number;
  } | null>(null);

  const getZodiac = (day: number, month: number) => {
    const zodiacs = [
      { name: "Capricorn (Goat)", start: "12-22", end: "01-19" },
      { name: "Aquarius (Water Bearer)", start: "01-20", end: "02-18" },
      { name: "Pisces (Fish)", start: "02-19", end: "03-20" },
      { name: "Aries (Ram)", start: "03-21", end: "04-19" },
      { name: "Taurus (Bull)", start: "04-20", end: "05-20" },
      { name: "Gemini (Twins)", start: "05-21", end: "06-20" },
      { name: "Cancer (Crab)", start: "06-21", end: "07-22" },
      { name: "Leo (Lion)", start: "07-23", end: "08-22" },
      { name: "Virgo (Virgin)", start: "08-23", end: "09-22" },
      { name: "Libra (Scales)", start: "09-23", end: "10-22" },
      { name: "Scorpio (Scorpion)", start: "10-23", end: "11-21" },
      { name: "Sagittarius (Archer)", start: "11-22", end: "12-21" }
    ];
    const dateFormatted = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const matched = zodiacs.find(z => {
      if (z.start <= z.end) {
        return dateFormatted >= z.start && dateFormatted <= z.end;
      }
      return dateFormatted >= z.start || dateFormatted <= z.end;
    });
    return matched ? matched.name : "Capricorn";
  };

  const handleCalculate = () => {
    if (!birthdate) return;
    const birth = new Date(birthdate);
    const today = new Date();

    if (birth > today) {
      alert('Selected birthdate is in the future!');
      return;
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diffTime / (1000 * 60 * 60));

    const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const nextBdayDiff = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setStats({
      years,
      months,
      days,
      hours,
      totalDays,
      zodiac: getZodiac(birth.getDate(), birth.getMonth() + 1),
      nextBirthday: nextBdayDiff === 365 ? 0 : nextBdayDiff
    });
  };

  const badgeClass = isDark
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6" id="age-calculator-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>UTILITY</span>
          Personal Birthdate & Zodiac Compiler
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Examine details of your life metrics, total hours lived, leap dates, and Zodiac charts.</p>
      </div>

      <div className={`p-5 border ${t.border} rounded-xl ${t.controlBg} max-w-xl mx-auto space-y-4`}>
        <div>
          <label className={`text-xs font-semibold ${t.textMuted} block mb-1.5`}>Pick Birthdate:</label>
          <input
            type="date"
            className={`w-full p-3 ${t.inputBg} rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          disabled={!birthdate}
          className="w-full p-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
        >
          Parse Date Metrics
        </button>

        {stats && (
          <div className="pt-4 border-t ${t.border} space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className={`p-3 ${t.controlBg} border ${t.border} rounded-lg`}>
                <span className={`text-xs font-bold ${t.textFaint} font-mono`}>EXACT AGE:</span>
                <p className={`text-sm font-bold ${t.heading} mt-1`}>{stats.years} Yrs, {stats.months} Mhs, {stats.days} Days</p>
              </div>

              <div className={`p-3 ${t.controlBg} border ${t.border} rounded-lg`}>
                <span className={`text-xs font-bold ${t.textFaint} font-mono`}>ZODIAC SYMBOL:</span>
                <p className="text-sm font-bold text-indigo-300 mt-1">{stats.zodiac}</p>
              </div>

              <div className={`p-3 ${t.controlBg} border ${t.border} rounded-lg`}>
                <span className={`text-xs font-bold ${t.textFaint} font-mono`}>TOTAL DAYS LIVED:</span>
                <p className={`text-base font-extrabold ${t.heading} mt-1 font-mono`}>{stats.totalDays.toLocaleString()}</p>
              </div>

              <div className={`p-3 ${t.controlBg} border ${t.border} rounded-lg`}>
                <span className={`text-xs font-bold ${t.textFaint} font-mono`}>COUNTDOWN TO BDAY:</span>
                <p className="text-base font-extrabold text-rose-455 mt-1 font-mono text-rose-400">
                  {stats.nextBirthday === 0 ? "Today! 🎂" : `${stats.nextBirthday} Days`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 4. PNG TO JPG IMAGE CONVERTER
function PngToJpgConverter({ isDark }: { isDark: boolean }) {
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [quality, setQuality] = useState(0.85);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file!');
      return;
    }
    setSelectedFile(file);
    setConvertedUrl(null);
    setConvertedSize(null);
    
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);

    const img = new window.Image();
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
    setOriginalImageUrl(null);
    setDimensions(null);
    setConvertedUrl(null);
    setConvertedSize(null);
  };

  const convertToJpg = () => {
    if (!originalImageUrl || !dimensions) return;
    setIsConverting(true);

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setConvertedUrl(url);
              setConvertedSize(blob.size);
            }
            setIsConverting(false);
          },
          'image/jpeg',
          quality
        );
      } else {
        setIsConverting(false);
      }
    };
    img.src = originalImageUrl;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  const savedPercent = selectedFile && convertedSize 
    ? Math.round(((selectedFile.size - convertedSize) / selectedFile.size) * 100)
    : 0;

  const badgeClass = isDark
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6" id="png-to-jpg-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>UTILITY</span>
          PNG to JPG Image Converter
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Convert client-side high resolution PNG images to compact JPEGs offline with transparency color fillings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {!selectedFile ? (
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] transition-all relative ${
                dragActive ? 'border-indigo-500 bg-[#132230]/40 text-indigo-200' : `${t.border} ${t.controlBg} hover:border-indigo-550/50`
              }`}
            >
              <UploadCloud className={`w-10 h-10 ${t.textFaint} mb-2`} />
              <p className={`text-sm font-semibold ${t.textMuted}`}>Drag & drop your PNG image here</p>
              <p className={`text-xs ${t.textFaint} mt-1 mb-4`}>Or click to select from your device</p>
              <label className="p-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs cursor-pointer transition-all shadow-sm">
                Browse Files
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            </div>
          ) : (
            <div className={`${t.controlBg} border ${t.border} rounded-xl p-4 space-y-3 relative overflow-hidden`}>
              <button 
                onClick={clearFile}
                className="absolute top-3 right-3 text-gray-400 hover:text-rose-455 p-1 rounded-full hover:bg-rose-500/10 cursor-pointer transition-all"
                title="Remove image"
              >
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-rose-400" />
              </button>
              
              <div className="flex items-center gap-3">
                {originalImageUrl && (
                  <img src={originalImageUrl} alt="source thumbnail" className={`w-16 h-16 rounded object-cover border border-white/10 ${isDark ? "bg-[#141414]" : "bg-gray-100"}`} />
                )}
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-bold ${t.heading} truncate`}>{selectedFile.name}</p>
                  <p className={`text-[11px] ${t.textFaint} font-mono mt-0.5`}>Size: {formatSize(selectedFile.size)}</p>
                  {dimensions && (
                    <p className={`text-[11px] ${t.textFaint} font-mono`}>Dimensions: {dimensions.width} x {dimensions.height} px</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedFile && (
            <div className={`${t.panelBg} rounded-xl p-4 space-y-4 text-sm ${t.textMuted}`}>
              <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2`}>Conversion Settings</h3>
              
              <div className="space-y-1.5">
                <div className={`flex justify-between font-medium ${t.textMuted}`}>
                  <span>Compression Quality:</span>
                  <span className="font-mono text-indigo-400 text-xs font-bold">{Math.round(quality * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.0" 
                  step="0.05"
                  value={quality} 
                  onChange={(e) => {
                    setQuality(parseFloat(e.target.value));
                    setConvertedUrl(null);
                  }}
                  className="w-full accent-indigo-650 h-1.5 bg-[#252525] border border-white/5 rounded-lg appearance-none cursor-pointer"
                />
                <span className={`text-[10px] ${t.textFaint} block`}>Lower quality produces smaller file sizes, higher quality preserves details.</span>
              </div>

              <div className="space-y-1.5">
                <span className={`font-medium ${t.textMuted} block`}>Transparency Fill Color:</span>
                <div className="grid grid-cols-4 gap-2">
                  <button 
                    type="button" 
                    onClick={() => { setBgColor('#ffffff'); setConvertedUrl(null); }} 
                    className={`p-1.5 flex flex-col items-center justify-center border rounded-lg text-[10px] font-bold ${bgColor === '#ffffff' ? 'border-indigo-500 bg-[#161616] ring-2 ring-indigo-500/20' : `${t.border} ${t.controlBg} ${t.textFaint}`}`}
                  >
                    <span className="w-4 h-4 bg-white border border-white/10 rounded-full mb-1"></span>
                    <span>White</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setBgColor('#000000'); setConvertedUrl(null); }} 
                    className={`p-1.5 flex flex-col items-center justify-center border rounded-lg text-[10px] font-bold ${bgColor === '#000000' ? 'border-indigo-500 bg-[#161616] ring-2 ring-indigo-500/20' : `${t.border} ${t.controlBg} ${t.textFaint}`}`}
                  >
                    <span className="w-4 h-4 bg-black rounded-full mb-1 border border-black/50"></span>
                    <span>Black</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setBgColor('#f3f4f6'); setConvertedUrl(null); }} 
                    className={`p-1.5 flex flex-col items-center justify-center border rounded-lg text-[10px] font-bold ${bgColor === '#f3f4f6' ? 'border-indigo-500 bg-[#161616] ring-2 ring-indigo-500/20' : `${t.border} ${t.controlBg} ${t.textFaint}`}`}
                  >
                    <span className="w-4 h-4 bg-gray-100 rounded-full mb-1 border border-white/10"></span>
                    <span>Gray</span>
                  </button>
                  <div className={`relative p-1 border ${t.border} rounded-lg ${t.controlBg} flex flex-col items-center justify-center`}>
                    <input 
                      type="color" 
                      value={bgColor} 
                      onChange={(e) => { setBgColor(e.target.value); setConvertedUrl(null); }} 
                      className="w-5 h-5 cursor-pointer rounded border border-white/10 outline-none p-0 bg-transparent" 
                    />
                    <span className={`text-[10px] font-mono mt-1 ${t.textMuted} select-all`}>{bgColor.toUpperCase()}</span>
                  </div>
                </div>
                <span className={`text-[10px] ${t.textFaint} block`}>PNG transparency will be filled with this solid color.</span>
              </div>

              <button
                type="button"
                onClick={convertToJpg}
                disabled={isConverting}
                className="w-full mt-2 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all cursor-pointer shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 pointer-events-none" />
                    <span>Convert to JPG</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {!selectedFile ? (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[350px]`}>
              <ImageIcon className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Select or drop a PNG image to trigger conversions.</p>
              <p className={`text-xs ${t.textFaint} max-w-xs mt-1`}>Files are entirely handled locally on your browser. Absolutely zero image data gets transferred to any host or server.</p>
            </div>
          ) : (
            <div className={`border ${t.border} rounded-xl p-5 ${t.controlBg} h-full space-y-6`}>
              <div className="grid grid-cols-2 gap-4 border-b ${t.border} pb-4">
                <div>
                  <span className={`text-xs font-bold ${t.textFaint} font-mono block`}>SOURCE PNG:</span>
                  <p className={`text-sm font-bold ${t.heading} mt-1`}>PNG Image Format</p>
                  <p className={`text-xs font-mono ${t.textFaint} mt-0.5`}>{formatSize(selectedFile.size)}</p>
                </div>

                <div className={`border-l pl-4 ${isDark ? "border-white/5" : "border-gray-200"}`}>
                  <span className={`text-xs font-bold text-indigo-400 font-mono block`}>RESULTING JPG:</span>
                  <p className={`text-sm font-bold text-indigo-200 mt-1`}>
                    {convertedUrl ? 'Convert Success!' : 'Ready to Convert'}
                  </p>
                  {convertedSize ? (
                    <p className={`text-xs font-mono text-indigo-400 mt-0.5`}>
                      {formatSize(convertedSize)} &nbsp;
                      {savedPercent > 0 ? (
                        <span className="text-emerald-450 font-bold text-emerald-400">({savedPercent}% saved size)</span>
                      ) : (
                        <span className={`${t.textFaint} font-bold`}>(increased size)</span>
                      )}
                    </p>
                  ) : (
                    <p className={`text-xs font-mono ${t.textFaint} mt-0.5`}>Pending conversion click...</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <span className={`text-[10px] font-mono font-bold ${t.textFaint} block uppercase`}>Original PNG Visual:</span>
                  <div className={`aspect-video rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 relative checkerboard-grid ${isDark ? "bg-[#141414]" : "bg-gray-100"}`}>
                    {originalImageUrl && (
                      <img src={originalImageUrl} alt="Original input visual" className="max-w-full max-h-full object-contain" />
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className={`text-[10px] font-mono font-bold text-indigo-400 block uppercase`}>Resulting JPG Visual:</span>
                  <div className={`aspect-video rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 relative ${isDark ? "bg-[#141414]" : "bg-gray-100"}`}>
                    {convertedUrl ? (
                      <img src={convertedUrl} alt="Converted JPG visual" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className={`text-center text-xs ${t.textFaint} bg-[#141414] w-full h-full flex flex-col items-center justify-center px-4`}>
                        <RefreshCw className={`w-6 h-6 mb-1 ${t.textFaint}`} />
                        <span>Click "Convert to JPG" on the left dashboard to render the output file.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {convertedUrl && (
                <div className="pt-4 border-t ${t.border} flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Your conversion is completed! Size was optimized by {savedPercent}%.</span>
                  </div>
                  
                  <a 
                    href={convertedUrl}
                    download={selectedFile.name.replace(/\.[^/.]+$/, "") + ".jpg"}
                    className="p-2.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-white hover:text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JPG Image</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 5. ICO TO PNG CONVERTER
function IcoToPngConverter({ isDark }: { isDark: boolean }) {
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('original');

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
      setSelectedFile(file);
      setConvertedUrl(null);
      
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);

      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
      };
      img.src = url;
    }
  };

  const handleConvert = () => {
    if (!selectedFile || !originalUrl) return;
    setIsConverting(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let targetWidth = img.naturalWidth || img.width || 256;
      let targetHeight = img.naturalHeight || img.height || 256;

      if (selectedSize !== 'original') {
        const sizeInt = parseInt(selectedSize, 10);
        targetWidth = sizeInt;
        targetHeight = sizeInt;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        canvas.toBlob((blob) => {
          if (blob) {
            if (convertedUrl) URL.revokeObjectURL(convertedUrl);
            setConvertedUrl(URL.createObjectURL(blob));
          }
          setIsConverting(false);
        }, 'image/png');
      } else {
        setIsConverting(false);
      }
    };
    img.src = originalUrl;
  };

  const badgeClass = isDark
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6" id="ico-to-png-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>IMAGE</span>
          ICO to PNG Converter
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Extract high-resolution, transparent PNG images from Windows `.ico` icons entirely within your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} hover:border-indigo-500/30 transition-all relative`}>
            <input 
              type="file" 
              accept=".ico" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
            />
            <UploadCloud className={`w-10 h-10 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Choose or drop an ICO file</p>
            <p className={`text-[10px] ${t.textFaint} mt-1 font-mono`}>Accepts .ico files</p>
          </div>

          {selectedFile && (
            <div className={`${t.panelBg} rounded-xl p-4 text-sm space-y-4 ${t.textMuted}`}>
              <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2`}>ICO Specifications</h3>
              <div className="space-y-1.5 font-sans">
                <p className={`text-xs truncate`}><span className={t.textFaint}>Filename:</span> {selectedFile.name}</p>
                <p className={`text-xs`}><span className={t.textFaint}>File Size:</span> {formatSize(selectedFile.size)}</p>
                {dimensions && (
                  <p className={`text-xs`}><span className={t.textFaint}>Detected dimensions:</span> {dimensions.width} x {dimensions.height} px</p>
                )}
              </div>

              <div className="space-y-1.5 font-sans">
                <label className={`text-xs font-semibold ${t.textMuted} block`}>Output Resize Option:</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className={`w-full p-2 ${t.selectBg} rounded-lg text-xs focus:outline-none`}
                >
                  <option value="original">Original Size (Embedded Resolution)</option>
                  <option value="256">256 x 256 px (HQ Icon)</option>
                  <option value="128">128 x 128 px</option>
                  <option value="64">64 x 64 px</option>
                  <option value="48">48 x 48 px</option>
                  <option value="32">32 x 32 px (Favicon)</option>
                  <option value="16">16 x 16 px (Small Favicon)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Extract PNG</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {!selectedFile ? (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[300px]`}>
              <FileImage className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Select an `.ico` image file to extract transparent PNG visual frames.</p>
            </div>
          ) : (
            <div className={`border ${t.border} rounded-xl p-5 ${t.controlBg} h-full space-y-6`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className={`text-xs font-bold ${t.textFaint} font-mono block uppercase`}>Source ICO Preview:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-4 relative checkerboard-grid mt-2 max-h-[280px] ${isDark ? "bg-[#141414]" : "bg-gray-100"}`}>
                    {originalUrl && (
                      <img src={originalUrl} alt="Source ICO visual" className="max-w-full max-h-full object-contain" />
                    )}
                  </div>
                </div>

                <div>
                  <span className={`text-xs font-bold text-indigo-400 font-mono block uppercase`}>Extracted PNG Visual:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-4 relative checkerboard-grid mt-2 max-h-[280px] ${isDark ? "bg-[#141414]" : "bg-gray-100"}`}>
                    {convertedUrl ? (
                      <img src={convertedUrl} alt="Extracted PNG visual" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className={`text-center text-xs ${t.textFaint} bg-[#141414] w-full h-full flex flex-col items-center justify-center px-4`}>
                        <RefreshCw className={`w-6 h-6 mb-1 ${t.textFaint}`} />
                        <span>Click "Extract PNG" to compute output.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {convertedUrl && (
                <div className="pt-4 border-t ${t.border} flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>PNG format extraction complete! Alpha channels preserved correctly.</span>
                  </div>
                  
                  <a 
                    href={convertedUrl}
                    download={selectedFile.name.replace(/\.[^/.]+$/, "") + "_extracted.png"}
                    className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 6. ICO CONVERTER
function IcoConverter({ isDark }: { isDark: boolean }) {
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

  const [mode, setMode] = useState<'to-ico' | 'to-png'>('to-ico');

  const [selectedFileImg, setSelectedFileImg] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [sizes, setSizes] = useState<{ [key: number]: boolean }>({
    16: true,
    32: true,
    48: true,
    64: false,
    128: false,
    256: false
  });
  const [icoBlob, setIcoBlob] = useState<Blob | null>(null);
  const [icoUrl, setIcoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedFileIco, setSelectedFileIco] = useState<File | null>(null);
  const [icoPreviewUrl, setIcoPreviewUrl] = useState<string | null>(null);
  const [pngExtractedUrl, setPngExtractedUrl] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizesArr = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizesArr[i];
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileImg(file);
      setIcoBlob(null);
      if (icoUrl) URL.revokeObjectURL(icoUrl);
      setIcoUrl(null);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIcoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileIco(file);
      if (icoPreviewUrl) URL.revokeObjectURL(icoPreviewUrl);
      if (pngExtractedUrl) URL.revokeObjectURL(pngExtractedUrl);
      setPngExtractedUrl(null);
      setIcoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const toggleSize = (size: number) => {
    setSizes({ ...sizes, [size]: !sizes[size] });
  };

  const handleConvertToIco = async () => {
    if (!imageSrc) return;
    
    const activeSizes = Object.keys(sizes)
      .map(Number)
      .filter(size => sizes[size]);

    if (activeSizes.length === 0) {
      alert("Please check at least one target resolution (e.g. 32x32)!");
      return;
    }

    setIsGenerating(true);

    const img = new Image();
    img.onload = async () => {
      try {
        const canvases: HTMLCanvasElement[] = [];
        
        for (const size of activeSizes) {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
            canvases.push(canvas);
          }
        }

        const compiledBlob = await generateMultiSizeIco(canvases);
        setIcoBlob(compiledBlob);
        
        if (icoUrl) URL.revokeObjectURL(icoUrl);
        setIcoUrl(URL.createObjectURL(compiledBlob));
      } catch (err) {
        console.error("Error generating ICO", err);
      } finally {
        setIsGenerating(false);
      }
    };
    img.src = imageSrc;
  };

  const handleExtractIco = () => {
    if (!selectedFileIco || !icoPreviewUrl) return;
    setExtracting(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const targetWidth = img.naturalWidth || img.width || 256;
      const targetHeight = img.naturalHeight || img.height || 256;

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            if (pngExtractedUrl) URL.revokeObjectURL(pngExtractedUrl);
            setPngExtractedUrl(URL.createObjectURL(blob));
          }
          setExtracting(false);
        }, 'image/png');
      } else {
        setExtracting(false);
      }
    };
    img.src = icoPreviewUrl;
  };

  const generateMultiSizeIco = async (canvasList: HTMLCanvasElement[]): Promise<Blob> => {
    const pngBuffers: ArrayBuffer[] = [];
    const sizesMeta: { w: number; h: number }[] = [];
    
    for (const canvas of canvasList) {
      const pngBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (pngBlob) {
        const buffer = await pngBlob.arrayBuffer();
        pngBuffers.push(buffer);
        sizesMeta.push({ w: canvas.width, h: canvas.height });
      }
    }

    const imageCount = pngBuffers.length;
    const headerSize = 6;
    const directorySize = 16 * imageCount;
    const totalHeaderSize = headerSize + directorySize;
    
    const headerBuffer = new ArrayBuffer(totalHeaderSize);
    const view = new DataView(headerBuffer);
    
    view.setUint16(0, 0, true);
    view.setUint16(2, 1, true);
    view.setUint16(4, imageCount, true);
    
    let currentOffset = totalHeaderSize;
    for (let i = 0; i < imageCount; i++) {
      const w = sizesMeta[i].w;
      const h = sizesMeta[i].h;
      const len = pngBuffers[i].byteLength;
      const dirOffset = headerSize + i * 16;
      
      view.setUint8(dirOffset, w >= 256 ? 0 : w);
      view.setUint8(dirOffset + 1, h >= 256 ? 0 : h);
      view.setUint8(dirOffset + 2, 0);
      view.setUint8(dirOffset + 3, 0);
      view.setUint16(dirOffset + 4, 1, true);
      view.setUint16(dirOffset + 6, 32, true);
      view.setUint32(dirOffset + 8, len, true);
      view.setUint32(dirOffset + 12, currentOffset, true);
      
      currentOffset += len;
    }
    
    return new Blob([headerBuffer, ...pngBuffers], { type: 'image/x-icon' });
  };

  const badgeClass = isDark
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6" id="ico-converter-container">
      <div className={`pb-4 border-b ${t.border} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div>
          <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
            <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>IMAGE</span>
            Universal ICO Converter
          </h2>
          <p className={`text-sm ${t.textMuted}`}>Compile smart multi-resolution `.ico` icon packs client-side, or convert `.ico` files back to flat images.</p>
        </div>
        
        <div className={`${t.controlBg} p-1 rounded-lg flex inline-flex text-xs font-bold border ${t.border} self-start`}>
          <button 
            type="button" 
            className={`p-1.5 px-3 rounded cursor-pointer transition-all ${mode === 'to-ico' ? 'bg-indigo-600 text-white shadow' : `${t.textMuted} hover:${t.heading}`}`} 
            onClick={() => setMode('to-ico')}
          >
            Image to ICO Favicon
          </button>
          <button 
            type="button" 
            className={`p-1.5 px-3 rounded cursor-pointer transition-all ${mode === 'to-png' ? 'bg-indigo-600 text-white shadow' : `${t.textMuted} hover:${t.heading}`}`} 
            onClick={() => setMode('to-png')}
          >
            ICO Unpacker
          </button>
        </div>
      </div>

      {mode === 'to-ico' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} hover:border-indigo-500/30 transition-all relative`}>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                onChange={handleImgChange} 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" 
              />
              <UploadCloud className={`w-10 h-10 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
              <p className={`text-xs font-bold ${t.textMuted}`}>Choose PNG/JPG/WebP input</p>
              <p className={`text-[10px] ${t.textFaint} mt-0.5`}>Will be packed into ICO bundle</p>
            </div>

            {selectedFileImg && (
              <div className={`${t.panelBg} rounded-xl p-4 text-sm space-y-4 ${t.textMuted}`}>
                <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2`}>ICO Compilation Pack</h3>
                
                <div className="space-y-2">
                  <span className={`text-xs font-semibold ${t.textMuted} block mb-1 font-sans`}>Select dimensions to embed:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[16, 32, 48, 64, 128, 256].map((sz) => (
                      <label key={sz} className={`flex items-center gap-2 ${t.controlBg} p-2 rounded border ${t.border} cursor-pointer hover:border-white/10 select-none`}>
                        <input 
                          type="checkbox" 
                          checked={sizes[sz] || false} 
                          onChange={() => toggleSize(sz)} 
                          className="accent-indigo-600 text-indigo-600 cursor-pointer w-4 h-4 rounded" 
                        />
                        <span>{sz} x {sz}</span>
                      </label>
                    ))}
                  </div>
                  <span className={`text-[10px] ${t.textFaint} block font-sans`}>Typical standard browser favicons call for a composite of 16x16, 32x32, and 48x48. Check them.</span>
                </div>

                <button
                  type="button"
                  onClick={handleConvertToIco}
                  disabled={isGenerating}
                  className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 font-sans"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Packing Bundle...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Pack & Compile ICO</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {!selectedFileImg ? (
              <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[300px]`}>
                <ImageIcon className={`w-12 h-12 mb-2 ${t.textFaint}`} />
                <p className={`text-sm ${t.textMuted}`}>Provide a transparent PNG or high quality picture to compile custom favicons.</p>
              </div>
            ) : (
              <div className={`border ${t.border} rounded-xl p-5 ${t.controlBg} h-full space-y-6`}>
                <div>
                  <span className={`text-xs font-bold ${t.textFaint} font-mono block uppercase`}>Source Image Target:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-4 relative checkerboard-grid mt-2 max-h-[250px] ${isDark ? "bg-[#141414]" : "bg-gray-100"}`}>
                    {imageSrc && (
                      <img src={imageSrc} alt="Source upload preview" className="max-w-full max-h-full object-contain" />
                    )}
                  </div>
                </div>

                {icoUrl && (
                  <div className="pt-4 border-t ${t.border} flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20 font-sans">
                    <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>ICO compilation is ready! Encompasses {Object.keys(sizes).filter(k=>sizes[Number(k)]).length} resolution formats. Size: {icoBlob ? formatSize(icoBlob.size) : 'Calculated'}</span>
                    </div>
                    
                    <a 
                      href={icoUrl}
                      download={selectedFileImg.name.replace(/\.[^/.]+$/, "") + ".ico"}
                      className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Favicon .ico</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} hover:border-indigo-500/30 transition-all relative`}>
              <input 
                type="file" 
                accept=".ico" 
                onChange={handleIcoChange} 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" 
              />
              <UploadCloud className={`w-10 h-10 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
              <p className={`text-xs font-bold ${t.textMuted}`}>Choose ICO to unpack</p>
              <p className={`text-[10px] ${t.textFaint} mt-0.5`}>Upload .ico image</p>
            </div>

            {selectedFileIco && (
              <div className={`${t.panelBg} rounded-xl p-4 text-sm space-y-4 ${t.textMuted} font-sans`}>
                <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2`}>ICO Unpacker options</h3>
                <div className="font-mono text-xs space-y-1">
                  <p className="truncate"><span className={t.textFaint}>Filename:</span> {selectedFileIco.name}</p>
                  <p><span className={t.textFaint}>Weight:</span> {formatSize(selectedFileIco.size)}</p>
                </div>

                <button
                  type="button"
                  onClick={handleExtractIco}
                  disabled={extracting}
                  className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {extracting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Extracting PNG...</span>
                    </>
                  ) : (
                    <>
                      <FileImage className="w-3.5 h-3.5" />
                      <span>Extract as Transparent PNG</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 col-span-1">
            {!selectedFileIco ? (
              <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[300px]`}>
                <FileImage className={`w-12 h-12 mb-2 ${t.textFaint}`} />
                <p className={`text-sm ${t.textMuted}`}>Provide `.ico` resource to unpack into raw PNG frame elements.</p>
              </div>
            ) : (
              <div className={`border ${t.border} rounded-xl p-5 ${t.controlBg} h-full space-y-6`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className={`text-xs font-bold ${t.textFaint} font-mono block uppercase`}>Source ICO Layout:</span>
                    <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-4 relative checkerboard-grid mt-2 max-h-[220px] ${isDark ? "bg-[#141414]" : "bg-gray-100"}`}>
                      {icoPreviewUrl && (
                        <img src={icoPreviewUrl} alt="ICO Source layout" className="max-w-full max-h-full object-contain" />
                      )}
                    </div>
                  </div>

                  <div>
                    <span className={`text-xs font-bold text-indigo-400 font-mono block uppercase`}>Extracted Output View:</span>
                    <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-4 relative checkerboard-grid mt-2 max-h-[220px] ${isDark ? "bg-[#141414]" : "bg-gray-100"}`}>
                      {pngExtractedUrl ? (
                        <img src={pngExtractedUrl} alt="Extracted clean PNG" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className={`text-center text-xs ${t.textFaint} bg-[#141414] w-full h-full flex flex-col items-center justify-center px-4`}>
                          <RefreshCw className={`w-6 h-6 mb-1 ${t.textFaint}`} />
                          <span>Awaiting frame extraction...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {pngExtractedUrl && (
                  <div className="pt-4 border-t ${t.border} flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20 font-sans">
                    <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Extracted PNG frame with transparency has been finalized client-side.</span>
                    </div>
                    
                    <a 
                      href={pngExtractedUrl}
                      download={selectedFileIco.name.replace(/\.[^/.]+$/, "") + ".png"}
                      className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Extracted PNG</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 7. IMAGE TO BASE64 CONVERTER
function ImageToBase64({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'datauri' | 'raw' | 'html' | 'css' | 'markdown'>('datauri');

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileType(file.type || 'image/png');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBase64String(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getOutputText = () => {
    if (!base64String) return '';
    const raw = base64String.split(',')[1] || '';
    switch (activeTab) {
      case 'raw':
        return raw;
      case 'html':
        return `<img src="${base64String}" alt="${selectedFile?.name || 'Base64 image asset'}" />`;
      case 'css':
        return `background-image: url("${base64String}");`;
      case 'markdown':
        return `![${selectedFile?.name || 'Base64 image text'}](${base64String})`;
      case 'datauri':
      default:
        return base64String;
    }
  };

  const outputString = getOutputText();

  const badgeClass = isDark
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6" id="image-to-base64-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>CONVERTER</span>
          Image to Base64 Code
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Convert your image assets into secure, layout-safe Base64 String or CSS data-uri schemas offline in-browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4 font-sans">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} hover:border-indigo-500/30 transition-all relative`}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" 
            />
            <UploadCloud className={`w-10 h-10 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Select any image file</p>
            <p className={`text-[10px] ${t.textFaint} mt-0.5`}>Supports JPG, PNG, SVG, GIF, WebP</p>
          </div>

          {selectedFile && (
            <div className={`${t.panelBg} rounded-xl p-4 text-sm space-y-3.5 ${t.textMuted}`}>
              <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2`}>Image Statistics</h3>
              <div className="space-y-2 text-xs font-mono">
                <p className="truncate"><span className={`${t.textFaint} font-sans`}>Filename:</span> {selectedFile.name}</p>
                <p><span className={`${t.textFaint} font-sans`}>Mimetype:</span> {fileType}</p>
                <p><span className={`${t.textFaint} font-sans`}>Original weight:</span> {formatSize(selectedFile.size)}</p>
                <p><span className={`${t.textFaint} font-sans`}>Unicode length:</span> {base64String.length.toLocaleString()} chars</p>
              </div>
              
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-305 text-[11px] rounded-lg font-sans">
                ⚠️ Embedding large Base64 pictures will swell your HTML or stylesheet load payload weight by ~33%. Use carefully for icons.
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {!selectedFile ? (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[300px]`}>
              <Code className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Supply any image asset to translate into text URI representations.</p>
            </div>
          ) : (
            <div className={`border ${t.border} rounded-xl p-4 ${t.controlBg} h-full space-y-4`}>
              <div className="flex flex-wrap gap-1.5 border-b ${t.border} pb-2">
                {[
                  { id: 'datauri', label: 'Data URI Schema' },
                  { id: 'raw', label: 'Raw Base64 Code' },
                  { id: 'html', label: 'HTML img tag' },
                  { id: 'css', label: 'CSS background' },
                  { id: 'markdown', label: 'Markdown syntax' }
                ].map((tb) => (
                  <button
                    key={tb.id}
                    title="Switch formats"
                    onClick={() => setActiveTab(tb.id as any)}
                    className={`p-1.5 px-3.5 rounded text-xs font-bold cursor-pointer transition-all ${activeTab === tb.id ? 'bg-indigo-600 text-white shadow' : `${t.textMuted} hover:${t.heading} hover:bg-white/5`}`}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div className={`flex justify-between items-center text-xs font-mono ${t.textMuted}`}>
                  <span>OUTFLOW STRUCTURAL TEXT:</span>
                  {outputString && (
                    <button
                      type="button"
                      onClick={() => onCopy(outputString, 'b64')}
                      className={`text-xs hover:text-indigo-400 inline-flex items-center gap-1 ${t.textMuted} cursor-pointer`}
                    >
                      {copiedStatus === 'b64' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedStatus === 'b64' ? 'Copied code!' : 'Copy format code'}
                    </button>
                  )}
                </div>

                <textarea
                  readOnly
                  className={`w-full h-64 p-3.5 ${t.outputBg} rounded-lg text-[11px] font-mono focus:outline-none focus:border-white/10 resize-none break-all select-all opacity-95`}
                  value={outputString}
                  placeholder="Base64 sequences will compose here..."
                />
              </div>

              {base64String && (
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono ${t.textFaint} font-bold uppercase`}>Dynamic image preview from data-uri:</span>
                  <div className={`h-16 flex items-center gap-2 p-2 ${t.controlBg} rounded-lg border ${t.border} w-fit`}>
                    <img src={base64String} alt="Decoded asset inline preview" className={`h-full rounded object-contain max-w-[120px] border border-white/10 ${isDark ? "bg-[#1a1a1a]" : "bg-gray-100"}`} referrerPolicy="no-referrer" />
                    <span className={`text-xxs ${t.textFaint} font-mono italic`}>Compiled visual confirmation</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 8. BASE64 TO IMAGE CONVERTER
function Base64ToImage({ isDark }: { isDark: boolean }) {
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

  const [inputText, setInputText] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);

  const handleDecode = () => {
    setError(null);
    setDimensions(null);
    if (!inputText.trim()) {
      setImageSrc(null);
      return;
    }

    let cleaned = inputText.trim();
    
    if (cleaned.startsWith('data:image/')) {
      const match = cleaned.match(/^data:(image\/[^;]+);base64,/);
      if (match) {
        setMimeType(match[1]);
        setImageSrc(cleaned);
        
        const img = new Image();
        img.onload = () => {
          setDimensions({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
        };
        img.src = cleaned;
        return;
      }
    }

    cleaned = cleaned.replace(/\s/g, '');
    
    try {
      window.atob(cleaned);
      
      let guessedMime = 'image/png';
      if (cleaned.startsWith('iVBORw0KGgo')) guessedMime = 'image/png';
      else if (cleaned.startsWith('/9j/')) guessedMime = 'image/jpeg';
      else if (cleaned.startsWith('R0lGOD')) guessedMime = 'image/gif';
      else if (cleaned.startsWith('UklGR')) guessedMime = 'image/webp';
      else if (cleaned.startsWith('PHN2Zy')) guessedMime = 'image/svg+xml';

      setMimeType(guessedMime);
      const builtUrl = `data:${guessedMime};base64,${cleaned}`;
      setImageSrc(builtUrl);

      const img = new Image();
      img.onload = () => {
        setDimensions({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
      };
      img.src = builtUrl;
    } catch (e) {
      setError("Decoding failed. The string provided is not a valid Base64 character stream.");
      setImageSrc(null);
    }
  };

  const getFileExtension = () => {
    if (mimeType.includes('png')) return 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpg';
    if (mimeType.includes('gif')) return 'gif';
    if (mimeType.includes('webp')) return 'webp';
    if (mimeType.includes('svg')) return 'svg';
    return 'png';
  };

  const badgeClass = isDark
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6" id="base64-to-image-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>DECODER</span>
          Base64 to Image Decoder
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Decode Base64 Data URI strings or raw binary character streams back into high-fidelity downloadable graphics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className={`${t.panelBg} rounded-xl p-5 text-sm space-y-4 ${t.textMuted} font-sans`}>
            <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2`}>Decoder parameters</h3>
            
            <div className="space-y-1">
              <span className={`text-xs font-semibold ${t.textMuted} block`}>Identified Mimetype:</span>
              <div className={`p-2.5 ${t.controlBg} border ${t.border} rounded-lg text-xs font-mono font-bold text-indigo-400`}>
                {mimeType}
              </div>
            </div>

            {dimensions && (
              <div className="space-y-1 font-sans">
                <span className={`text-xs font-semibold ${t.textMuted} block`}>Resolution dimensions:</span>
                <div className={`p-2.5 ${t.controlBg} border ${t.border} rounded-lg text-xs font-mono font-bold ${t.heading}`}>
                  {dimensions.w} x {dimensions.h} pixels
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleDecode}
              className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md font-sans"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Decode & Paint Image</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-1.5 font-sans">
            <span className={`text-xs font-mono ${t.textMuted} block font-bold`}>PASTE STRING HERE (Supports raw strings or complete Data URIs):</span>
            <textarea
              className={`w-full h-44 p-3 ${t.textareaBg} rounded-lg text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-indigo-505`}
              placeholder="e.g. data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-sans rounded-lg">
              {error}
            </div>
          )}

          {imageSrc && (
            <div className={`border ${t.border} rounded-xl p-5 ${t.controlBg} space-y-4`}>
              <span className={`text-xs font-bold text-indigo-400 font-mono block uppercase`}>Rendered graphic canvas:</span>
              <div className={`aspect-video rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-3 relative checkerboard-grid max-h-[300px] ${isDark ? "bg-[#141414]" : "bg-gray-100"}`}>
                <img src={imageSrc} alt="Decoded visualization" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
              </div>

              <div className="pt-4 border-t ${t.border} flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20 font-sans animate-fade">
                <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Success! Painted Base64 code array cleanly to graphic viewport.</span>
                </div>
                
                <a 
                  href={imageSrc}
                  download={`decoded_base64_asset.${getFileExtension()}`}
                  className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Decoded Image</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 9. IMAGE FLIP & ROTATION TOOL
function FlipImage({ isDark }: { isDark: boolean }) {
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [transformedUrl, setTransformedUrl] = useState<string | null>(null);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [rotation, setRotation] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (transformedUrl) URL.revokeObjectURL(transformedUrl);
      setSelectedFile(file);
      setFlipH(false);
      setFlipV(false);
      setRotation(0);
      setTransformedUrl(null);
      
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
    }
  };

  const handleReset = () => {
    setFlipH(false);
    setFlipV(false);
    setRotation(0);
  };

  const applyTransformations = () => {
    if (!originalUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      const is90or270 = (rotation % 180) === 90;
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      const targetWidth = is90or270 ? height : width;
      const targetHeight = is90or270 ? width : height;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      const scaleX = flipH ? -1 : 1;
      const scaleY = flipV ? -1 : 1;
      ctx.scale(scaleX, scaleY);
      ctx.drawImage(img, -width / 2, -height / 2, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          if (transformedUrl) URL.revokeObjectURL(transformedUrl);
          setTransformedUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, selectedFile?.type || 'image/png');
    };
    img.src = originalUrl;
  };

  React.useEffect(() => {
    if (originalUrl) {
      applyTransformations();
    }
  }, [flipH, flipV, rotation, originalUrl]);

  const badgeClass = isDark
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6" id="flip-image-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>IMAGE</span>
          Flip & Rotate Image
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Instantly mirror, pivot, spin, or completely rotate image assets in real-time right inside your browser client.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="lg:col-span-1 space-y-4">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} hover:border-indigo-500/30 transition-all relative`}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" 
            />
            <UploadCloud className={`w-10 h-10 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Upload any image target</p>
            <p className={`text-[10px] ${t.textFaint} mt-0.5`}>JPG, PNG, WEBP, etc.</p>
          </div>

          {selectedFile && (
            <div className={`${t.panelBg} rounded-xl p-5 text-sm space-y-4 ${t.textMuted} font-sans`}>
              <h3 className={`font-bold ${t.heading} border-b ${t.border} pb-2`}>Transformation Controls</h3>
              
              <div className="space-y-2">
                <span className={`text-xs font-semibold ${t.textMuted} block`}>Mirror Flips:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setFlipH(!flipH)}
                    className={`p-2 rounded-lg font-bold border transition-all cursor-pointer ${flipH ? 'bg-indigo-600 border-indigo-500 text-white' : `${t.border} ${t.controlBg} ${t.textFaint} hover:${t.heading}`}`}
                  >
                    Flip Horizontal ↔️
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlipV(!flipV)}
                    className={`p-2 rounded-lg font-bold border transition-all cursor-pointer ${flipV ? 'bg-indigo-600 border-indigo-500 text-white' : `${t.border} ${t.controlBg} ${t.textFaint} hover:${t.heading}`}`}
                  >
                    Flip Vertical ↕️
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className={`text-xs font-semibold ${t.textMuted} block`}>Preset Rotations:</span>
                <div className={`grid grid-cols-4 gap-1 px-1 p-1 ${t.controlBg} border ${t.border} rounded-lg text-[10px] font-semibold text-center`}>
                  {[0, 90, 180, 270].map((angle) => {
                    return (
                      <button
                        key={angle}
                        type="button"
                        onClick={() => setRotation(angle)}
                        className={`p-1 pl-1.5 pr-1.5 rounded transition-all cursor-pointer ${rotation === angle ? 'bg-indigo-600 text-white shadow' : `${t.textFaint} hover:${t.heading}`}`}
                      >
                        {angle}°
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className={`flex justify-between text-xs font-semibold ${t.textMuted}`}>
                  <span>Rotation degree:</span>
                  <span className="font-mono text-indigo-400 font-bold">{rotation}°</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="360"
                  step="90"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-[#252525] accent-indigo-600 text-indigo-605 border border-white/5 rounded-lg appearance-none cursor-pointer"
                />
                <span className={`text-[10px] ${t.textFaint} block`}>Pivots perfectly around canvas coordinates at 90-degree step layouts.</span>
              </div>

              <div className={`flex gap-2 text-xs font-sans pt-2 border-t ${t.border}`}>
                <button
                  type="button"
                  onClick={handleReset}
                  className={`w-full p-2 ${t.controlBg} ${t.textFaint} border ${t.border} hover:${t.heading} rounded-lg transition-all font-bold cursor-pointer`}
                >
                  Clear Transforms
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {!selectedFile ? (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[300px]`}>
              <RotateCw className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Supply any picture to mirror reflect or spin its directions.</p>
            </div>
          ) : (
            <div className={`border ${t.border} rounded-xl p-5 ${t.controlBg} h-full space-y-6`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className={`text-xs font-bold ${t.textFaint} font-mono block uppercase font-sans`}>Original orientation:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-4 relative checkerboard-grid mt-2 max-h-[250px] ${isDark ? "bg-[#141414]" : "bg-gray-100"}`}>
                    {originalUrl && (
                      <img src={originalUrl} alt="Source unchanged" className="max-w-full max-h-full object-contain" />
                    )}
                  </div>
                </div>

                <div>
                  <span className={`text-xs font-bold text-indigo-400 font-mono block uppercase font-sans`}>Transformed outcome:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-4 relative checkerboard-grid mt-2 max-h-[250px] ${isDark ? "bg-[#141414]" : "bg-gray-100"}`}>
                    {isProcessing ? (
                      <div className={`text-center text-xs ${t.textFaint}`}>
                        <RefreshCw className="w-6 h-6 mb-1 text-gray-650 animate-spin mx-auto" />
                        <span>Rendering live transforms...</span>
                      </div>
                    ) : transformedUrl ? (
                      <img src={transformedUrl} alt="Visual transformed outcome" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className={`text-center text-xs ${t.textFaint}`}>Awaiting processing triggers...</div>
                    )}
                  </div>
                </div>
              </div>

              {transformedUrl && (
                <div className="pt-4 border-t ${t.border} flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Real-time canvas-processed changes are baked locally inside target container.</span>
                  </div>
                  
                  <a 
                    href={transformedUrl}
                    download={`transformed_${selectedFile.name}`}
                    className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow font-sans"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Transformed Image</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// PASSWORD ENTROPY & KEYSPACE CALCULATOR COMPONENT
// =========================================================================
export function PasswordEntropyCalculator({
  isDark,
  onCopy,
  copiedStatus
}: {
  isDark: boolean;
  onCopy: (text: string, id: string) => void;
  copiedStatus: string | null;
}) {
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

  const [password, setPassword] = useState('CorrectHorseBatteryStaple');
  const [showPassword, setShowPassword] = useState(false);

  const len = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':",./<>?`~|\\ ]/.test(password);
  const nonStandardRegex = /[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':",./<>?`~|\\ ]/g;
  const hasNonStandard = nonStandardRegex.test(password);

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasDigit) poolSize += 10;
  if (hasSymbol) poolSize += 33;
  if (hasNonStandard) poolSize += 15;

  const entropy = len > 0 && poolSize > 0 ? len * (Math.log(poolSize) / Math.log(2)) : 0;

  let grade = { label: 'Empty State', color: 'text-gray-500', barBg: 'bg-white/10', percentage: 0 };
  if (entropy > 0) {
    if (entropy < 28) {
      grade = { label: 'Tragically Weak (Critical Vulnerability)', color: 'text-rose-500', barBg: 'bg-rose-500', percentage: 20 };
    } else if (entropy < 45) {
      grade = { label: 'Low Security (Vulnerable to GPU arrays)', color: 'text-amber-500', barBg: 'bg-amber-500', percentage: 40 };
    } else if (entropy < 65) {
      grade = { label: 'Medium Security (Reasonable User Strength)', color: 'text-yellow-400', barBg: 'bg-yellow-400', percentage: 65 };
    } else if (entropy < 90) {
      grade = { label: 'Strong Security (Meets Compliance Standards)', color: 'text-emerald-400', barBg: 'bg-emerald-400', percentage: 85 };
    } else {
      grade = { label: 'Cryptographic / Government-Grade (Perfect)', color: 'text-sky-400', barBg: 'bg-sky-400', percentage: 100 };
    }
  }

  const formatCrackTime = (seconds: number): string => {
    if (seconds === Infinity || seconds > 1e30) {
      return 'Practically Infinite (Decillions of Years)';
    }

    if (seconds < 1) {
      return 'Instantly (< 1 millisecond)';
    }

    const mins = seconds / 60;
    if (mins < 1) return `${seconds.toFixed(0)} seconds`;

    const hours = mins / 60;
    if (hours < 1) return `${mins.toFixed(0)} minutes`;

    const days = hours / 24;
    if (days < 1) return `${hours.toFixed(0)} hours`;

    const years = days / 365.25;
    if (years < 1) return `${days.toFixed(0)} days`;

    if (years < 1000) return `${years.toFixed(0)} years`;
    if (years < 1e6) return `${(years / 1000).toFixed(1)} thousand years`;
    if (years < 1e9) return `${(years / 1e6).toFixed(1)} million years`;
    if (years < 1e12) return `${(years / 1e9).toFixed(1)} billion years`;
    if (years < 1e15) return `${(years / 1e12).toFixed(1)} trillion years`;
    return 'Quadrillions of years';
  };

  const combinationsCount = Math.pow(poolSize, len);

  const speccedRigs = [
    { name: 'Standard Multi-Core CPU', rate: 1e8, speedDesc: '100 Million guesses/sec', model: 'Intel i7 Core Desktop', icon: 'Cpu' },
    { name: 'NVIDIA RTX 4095 GPU Array', rate: 5e10, speedDesc: '50 Billion guesses/sec', model: 'Multi-GPU Brute Force Cluster', icon: 'Zap' },
    { name: 'Professional ASIC Hardware Rig', rate: 1e13, speedDesc: '10 Trillion guesses/sec', model: 'Elitist Offline Decryption Tower', icon: 'Unlink' },
    { name: 'Supercomputer Network (Botnet)', rate: 1e16, speedDesc: '10 Quadrillion guesses/sec', model: 'Distributed Nation-State Cluster', icon: 'Globe' }
  ];

  return (
    <div className={`p-6 ${t.panelBg} rounded-2xl shadow-xl space-y-6`}>
      
      <div className={`border-b ${t.border} pb-4`}>
        <h2 className={`text-base font-semibold ${t.heading} tracking-tight flex items-center gap-2 font-mono select-none`}>
          <Shield className="w-5 h-5 text-sky-450" />
          Password Keyspace &amp; Entropy Calculator
        </h2>
        <p className={`text-xs ${t.textMuted} mt-1`}>
          Evaluate the mathematical strength of passphrases of any length and view estimates of offline brute-force attack runtimes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-2">
            <div className={`flex justify-between items-center`}>
              <label className={`text-xs font-mono font-bold ${t.textMuted} uppercase block`}>Evaluate Passphrase</label>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className={`text-[10px] ${t.textFaint} hover:${t.heading} font-mono`}
              >
                {showPassword ? 'Hide Characters' : 'Reveal Characters'}
              </button>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type or paste passphrase here..."
                className={`w-full p-3 pr-10 ${t.inputBg} rounded-xl text-sm font-mono focus:outline-none focus:border-sky-500/50 transition-colors`}
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <button
                  onClick={() => onCopy(password, 'entropy-copy')}
                  disabled={!password}
                  className={`${t.textFaint} hover:${t.heading} transition-colors`}
                  title="Copy password content"
                >
                  {copiedStatus === 'entropy-copy' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className={`text-[9px] font-mono font-bold ${t.textFaint} self-center`}>DEMOS:</span>
              <button
                onClick={() => setPassword('password')}
                className={`p-1 px-2 border ${t.border} ${t.controlBg} hover:bg-white/10 text-[9px] font-mono ${t.textFaint} hover:${t.heading} rounded transition-all`}
              >
                password
              </button>
              <button
                onClick={() => setPassword('Tr0ub4dor&3')}
                className={`p-1 px-2 border ${t.border} ${t.controlBg} hover:bg-white/10 text-[9px] font-mono ${t.textFaint} hover:${t.heading} rounded transition-all`}
              >
                Tr0ub4dor&amp;3
              </button>
              <button
                onClick={() => setPassword('CorrectHorseBatteryStaple')}
                className={`p-1 px-2 border ${t.border} ${t.controlBg} hover:bg-white/10 text-[9px] font-mono ${t.textFaint} hover:${t.heading} rounded transition-all`}
              >
                CorrectHorseBatteryStaple
              </button>
              <button
                onClick={() => setPassword('G$9#mP!2zKqW6eR')}
                className={`p-1 px-2 border ${t.border} ${t.controlBg} hover:bg-white/10 text-[9px] font-mono ${t.textFaint} hover:${t.heading} rounded transition-all`}
              >
                15-char Random
              </button>
            </div>
          </div>

          <div className={`p-4 ${t.controlBg} rounded-xl space-y-3`}>
            <div className={`flex justify-between items-center`}>
              <span className={`text-[10px] font-mono ${t.textFaint} uppercase tracking-wider block font-bold`}>Mathematical Entropy Gauge</span>
              <span className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                {entropy.toFixed(1)} Bits
              </span>
            </div>

            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${grade.barBg}`}
                style={{ width: `${grade.percentage}%` }}
              />
            </div>

            <div className={`flex justify-between text-[11px] font-mono`}>
              <span className={t.textFaint}>Security Rating:</span>
              <span className={`${grade.color} font-bold`}>{grade.label}</span>
            </div>
          </div>

          <div className={`p-4 ${t.controlBg} rounded-xl space-y-3`}>
            <span className={`text-[10px] font-mono ${t.textFaint} uppercase tracking-wider block font-bold`}>Character Subsets Detected</span>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className={`p-2 rounded-lg flex items-center justify-between border ${hasLower ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : `${t.border} ${t.controlBg} ${t.textFaint}`}`}>
                <span>Lowercase [a-z]</span>
                <span className="font-bold">{hasLower ? '+26' : '0'}</span>
              </div>
              <div className={`p-2 rounded-lg flex items-center justify-between border ${hasUpper ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : `${t.border} ${t.controlBg} ${t.textFaint}`}`}>
                <span>Uppercase [A-Z]</span>
                <span className="font-bold">{hasUpper ? '+26' : '0'}</span>
              </div>
              <div className={`p-2 rounded-lg flex items-center justify-between border ${hasDigit ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : `${t.border} ${t.controlBg} ${t.textFaint}`}`}>
                <span>Numbers [0-9]</span>
                <span className="font-bold">{hasDigit ? '+10' : '0'}</span>
              </div>
              <div className={`p-2 rounded-lg flex items-center justify-between border ${hasSymbol ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : `${t.border} ${t.controlBg} ${t.textFaint}`}`}>
                <span>Symbols (!,@,#,$)</span>
                <span className="font-bold">{hasSymbol ? '+33' : '0'}</span>
              </div>
            </div>

            <div className={`border-t ${t.border} pt-3 grid grid-cols-2 text-[11px] font-mono ${t.textFaint}`}>
              <div>
                <span>Passphrase Length: </span>
                <strong className={`${t.heading} font-bold`}>{len}</strong>
              </div>
              <div>
                <span>Total Pool Size: </span>
                <strong className={`${t.heading} font-bold`}>{poolSize} Chars</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className={`${t.controlBg} rounded-xl p-4 space-y-4`}>
            <div className={`flex items-center gap-1.5 pb-2 border-b ${t.border}`}>
              <span className={`text-[10px] font-mono ${t.textFaint} uppercase tracking-widest font-bold font-mono`}>OFFLINE BRUTE FORCE BREAKDOWN</span>
            </div>

            <div className="space-y-3">
              {speccedRigs.map((rig, i) => {
                const crackTimeSec = combinationsCount / rig.rate;
                return (
                  <div key={'rig-' + i} className={`p-3 ${t.controlBg} border ${t.border} rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-2`}>
                    <div className="text-left font-sans">
                      <span className={`text-xs font-mono font-bold ${t.heading} block`}>{rig.name}</span>
                      <span className={`text-[10px] ${t.textFaint} font-mono block`}>Specs: {rig.model} ({rig.speedDesc})</span>
                    </div>

                    <div className="text-left sm:text-right font-sans">
                      <span className={`text-[10px] ${t.textFaint} block uppercase font-mono font-semibold`}>Cracking ETA:</span>
                      <span className={`text-xs font-mono font-bold ${crackTimeSec < 3600 * 24 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {formatCrackTime(crackTimeSec)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`p-4 ${t.controlBg} border ${t.border} rounded-xl text-left space-y-2 font-mono text-xs ${t.textFaint}`}>
            <div className={`flex gap-1 items-center font-sans`}>
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span className={`${t.heading} font-bold`}>Understanding Math Entropy</span>
            </div>
            <p className={`leading-relaxed text-[11px] font-sans ${t.textMuted}`}>
              Cryptographic entropy is logarithmic. A passphrase with <strong className={t.heading}>80 bits</strong> of entropy contains <strong className={t.heading}>1.2 Trillion Trillion</strong> possible combinations. Each single bit added doubles the difficulty of cracking the password, illustrating why passphrase length is substantially more defensive than dynamic symbol replacement.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}