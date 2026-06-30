import React, { useState, useEffect } from 'react';
import { Palette, Copy, Check, Sliders, Hash, RotateCw, AlertCircle, RefreshCw } from 'lucide-react';

interface ColorToolsProps {
  activeToolId: string;
  isDark: boolean;
}

// Helper: Hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Clear prepended hash and standardize
  let c = hex.replace(/^#/, '').trim();
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  if (c.length !== 6) return null;
  const num = parseInt(c, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Helper: RGB to Hex
function rgbToHexStr(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return '#' + ((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1).toUpperCase();
}

// Helper: RGB to HSL
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Helper: HSL to RGB
function hslToRgb(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r = l, g = l, b = l;

  if (s !== 0) {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// Helper: RGB to CMYK
function rgbToCmyk(r: number, g: number, b: number) {
  let r0 = r / 255;
  let g0 = g / 255;
  let b0 = b / 255;
  let k = 1 - Math.max(r0, g0, b0);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  let c = Math.round(((1 - r0 - k) / (1 - k)) * 100);
  let m = Math.round(((1 - g0 - k) / (1 - k)) * 100);
  let y = Math.round(((1 - b0 - k) / (1 - k)) * 100);
  return { c, m, y, k: Math.round(k * 100) };
}

// Helper: Contrast Ratio
function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number {
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function ColorTools({ activeToolId, isDark }: ColorToolsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (activeToolId === 'color-converter') {
    return <ColorConverter isDark={isDark} onCopy={handleCopy} copiedId={copiedId} />;
  }
  if (activeToolId === 'hex-to-rgb') {
    return <HexToRgbComponent isDark={isDark} onCopy={handleCopy} copiedId={copiedId} />;
  }
  if (activeToolId === 'rgb-to-hex') {
    return <RgbToHexComponent isDark={isDark} onCopy={handleCopy} copiedId={copiedId} />;
  }

  return null;
}

// 1. UNIFIED COLOR CONVERTER
function ColorConverter({ isDark, onCopy, copiedId }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedId: string | null }) {
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

  const [colorInput, setColorInput] = useState('#4F46E5');
  const [rgb, setRgb] = useState({ r: 79, g: 70, b: 229 });
  const [error, setError] = useState<string | null>(null);

  const updateFromHex = (hex: string) => {
    setColorInput(hex);
    const parsed = hexToRgb(hex);
    if (parsed) {
      setRgb(parsed);
      setError(null);
    } else {
      setError('Invalid Hex Color format (e.g. #3b82f6 or FFF)');
    }
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    const clampedR = Math.max(0, Math.min(255, r));
    const clampedG = Math.max(0, Math.min(255, g));
    const clampedB = Math.max(0, Math.min(255, b));
    setRgb({ r: clampedR, g: clampedG, b: clampedB });
    setColorInput(rgbToHexStr(clampedR, clampedG, clampedB));
    setError(null);
  };

  const generateRandomColor = () => {
    const randomHex = rgbToHexStr(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    );
    updateFromHex(randomHex);
  };

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const contrastWhite = getContrast(rgb, { r: 255, g: 255, b: 255 });
  const contrastBlack = getContrast(rgb, { r: 9, g: 9, b: 11 });

  const badgeClass = isDark
    ? 'bg-rose-500/10 text-rose-455 border-rose-500/20'
    : 'bg-rose-50 text-rose-600 border-rose-200';

  return (
    <div className="space-y-6" id="color-converter-container">
      <div className={`pb-4 border-b ${t.border} flex justify-between items-center flex-wrap gap-4`}>
        <div>
          <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
            <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>COLOR</span>
            Advanced Color Converter
          </h2>
          <p className={`text-sm ${t.textMuted}`}>Convert deep color values between HEX, RGB, HSL, and CMYK schemas.</p>
        </div>
        <button
          onClick={generateRandomColor}
          className="p-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Generate Random
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Color Controller Block */}
        <div className={`lg:col-span-4 space-y-4 ${t.panelBg} p-5 rounded-2xl`}>
          <div className="space-y-3">
            <label className={`text-xs font-mono ${t.labelFaint} uppercase tracking-wider block font-bold`}>Pick Color or Type Hex</label>
            <div className="flex gap-3">
              <input 
                type="color" 
                value={colorInput.startsWith('#') && colorInput.length === 7 ? colorInput : '#4f46e5'} 
                onChange={(e) => updateFromHex(e.target.value)}
                className="w-14 h-11 bg-transparent border border-white/10 rounded-lg cursor-pointer overflow-hidden p-0"
              />
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => updateFromHex(e.target.value)}
                  className={`w-full p-2.5 pl-9 ${t.inputBg} rounded-lg text-sm font-mono uppercase focus:outline-none focus:border-indigo-500`}
                  placeholder="#4F46E5"
                />
              </div>
            </div>
          </div>

          {/* Fallback alert */}
          {error && (
            <div className="p-2.5 px-3 bg-red-950/20 text-red-400 border border-red-950/40 text-xs rounded-lg flex items-center gap-1.5 font-mono">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Visual color slab preview */}
          <div 
            style={{ backgroundColor: colorInput }}
            className="h-32 rounded-xl border border-white/10 shadow-lg flex items-end justify-between p-4 transition-all duration-300 relative group overflow-hidden"
          >
            {/* Ambient pattern */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <span className="text-white relative z-10 font-bold font-mono text-sm tracking-wide select-all uppercase">
              {colorInput}
            </span>
            <button
              onClick={() => onCopy(colorInput, 'slab')}
              className={`p-1.5 ${t.copyBtn} rounded-lg relative z-10 transition-colors`}
              title="Copy hex code"
            >
              {copiedId === 'slab' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* RGB Sliders control block */}
          <div className={`space-y-3 pt-3 border-t ${t.border} font-mono text-xs ${t.textMuted}`}>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-rose-455 font-bold">R (Red):</span>
                <span>{rgb.r}</span>
              </div>
              <input 
                type="range" min="0" max="255" value={rgb.r} 
                onChange={(e) => updateFromRgb(parseInt(e.target.value), rgb.g, rgb.b)}
                className="w-full accent-rose-500 bg-white/5 rounded-lg appearance-none h-1 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-emerald-400 font-bold">G (Green):</span>
                <span>{rgb.g}</span>
              </div>
              <input 
                type="range" min="0" max="255" value={rgb.g} 
                onChange={(e) => updateFromRgb(rgb.r, parseInt(e.target.value), rgb.b)}
                className="w-full accent-emerald-500 bg-white/5 rounded-lg appearance-none h-1 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-blue-400 font-bold">B (Blue):</span>
                <span>{rgb.b}</span>
              </div>
              <input 
                type="range" min="0" max="255" value={rgb.b} 
                onChange={(e) => updateFromRgb(rgb.r, rgb.g, parseInt(e.target.value))}
                className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none h-1 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Calculations / Converts Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            
            {/* Hex block code */}
            <div className={`p-4 ${t.panelBg} rounded-2xl space-y-2 flex flex-col justify-between`}>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-rose-455 font-bold uppercase text-[10px] tracking-widest">Hexadecimal</span>
                  <button 
                    onClick={() => onCopy(colorInput, 'hex-f')} 
                    className={`p-1 px-2 ${t.copyBtn} rounded transition-colors`}
                  >
                    {copiedId === 'hex-f' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className={`p-2.5 ${t.controlBg} rounded text-indigo-300 font-semibold select-all`}>
                  {colorInput.toUpperCase()}
                </div>
              </div>
              <p className={`text-[10px] ${t.textFaint} mt-1`}>Universal web markup CSS color token representation.</p>
            </div>

            {/* RGB block code */}
            <div className={`p-4 ${t.panelBg} rounded-2xl space-y-2 flex flex-col justify-between`}>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">RGB & RGBA</span>
                  <button 
                    onClick={() => onCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb-f')} 
                    className={`p-1 px-2 ${t.copyBtn} rounded transition-colors`}
                  >
                    {copiedId === 'rgb-f' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className={`p-2.5 ${t.controlBg} rounded text-emerald-400 font-semibold select-all`}>
                  rgb({rgb.r}, {rgb.g}, {rgb.b})
                </div>
              </div>
              <p className={`text-[10px] ${t.textFaint} mt-1`}>Red, Green, and Blue light color integers from 0 to 255.</p>
            </div>

            {/* HSL block code */}
            <div className={`p-4 ${t.panelBg} rounded-2xl space-y-2 flex flex-col justify-between`}>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-400 font-bold uppercase text-[10px] tracking-widest">HSL Color Space</span>
                  <button 
                    onClick={() => onCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl-f')} 
                    className={`p-1 px-2 ${t.copyBtn} rounded transition-colors`}
                  >
                    {copiedId === 'hsl-f' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className={`p-2.5 ${t.controlBg} rounded text-blue-400 font-semibold select-all`}>
                  hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                </div>
              </div>
              <p className={`text-[10px] ${t.textFaint} mt-1`}>Hue degrees, Saturation %, and Lightness % values.</p>
            </div>

            {/* CMYK printing block */}
            <div className={`p-4 ${t.panelBg} rounded-2xl space-y-2 flex flex-col justify-between`}>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-400 font-bold uppercase text-[10px] tracking-widest">CMYK printing</span>
                  <button 
                    onClick={() => onCopy(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, 'cmyk-f')} 
                    className={`p-1 px-2 ${t.copyBtn} rounded transition-colors`}
                  >
                    {copiedId === 'cmyk-f' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className={`p-2.5 ${t.controlBg} rounded text-purple-400 font-semibold select-all`}>
                  cmyk({cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%)
                </div>
              </div>
              <p className={`text-[10px] ${t.textFaint} mt-1`}>Cyan, Magenta, Yellow, and Key Black subtraction plates.</p>
            </div>
          </div>

          {/* Accessible contrast analysis report */}
          <div className={`p-5 ${t.panelBg} rounded-2xl space-y-4`}>
            <h4 className={`text-xs font-bold font-mono ${t.textMuted} uppercase tracking-wider flex items-center gap-1.5 border-b ${t.border} pb-2.5`}>
              <Sliders className="w-4 h-4 text-rose-500" />
              WCAG Contrast Accessibility Checker
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* White Contrast Card */}
              <div className={`p-4 ${t.controlBg} rounded-xl space-y-2`}>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-mono ${t.textMuted}`}>Against White background</span>
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${contrastWhite >= 4.5 ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20' : 'bg-red-950/20 text-red-400 border border-red-500/20'}`}>
                    {contrastWhite.toFixed(2)} : 1
                  </span>
                </div>
                
                <div className={`flex justify-between text-xxs font-mono ${t.textFaint} pt-1 border-t ${t.border}`}>
                  <span>Regular Text (4.5:1):</span>
                  <span className={contrastWhite >= 4.5 ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                    {contrastWhite >= 4.5 ? 'PASS (AA)' : 'FAIL'}
                  </span>
                </div>
                <div className={`flex justify-between text-xxs font-mono ${t.textFaint}`}>
                  <span>Large Text (3.0:1):</span>
                  <span className={contrastWhite >= 3.0 ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                    {contrastWhite >= 3.0 ? 'PASS (AA)' : 'FAIL'}
                  </span>
                </div>
              </div>

              {/* Black Contrast Card */}
              <div className={`p-4 ${t.controlBg} rounded-xl space-y-2`}>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-mono ${t.textMuted}`}>Against Dark slate bg</span>
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${contrastBlack >= 4.5 ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20' : 'bg-red-950/20 text-red-400 border border-red-500/20'}`}>
                    {contrastBlack.toFixed(2)} : 1
                  </span>
                </div>
                
                <div className={`flex justify-between text-xxs font-mono ${t.textFaint} pt-1 border-t ${t.border}`}>
                  <span>Regular Text (4.5:1):</span>
                  <span className={contrastBlack >= 4.5 ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                    {contrastBlack >= 4.5 ? 'PASS (AA)' : 'FAIL'}
                  </span>
                </div>
                <div className={`flex justify-between text-xxs font-mono ${t.textFaint}`}>
                  <span>Large Text (3.0:1):</span>
                  <span className={contrastBlack >= 3.0 ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                    {contrastBlack >= 3.0 ? 'PASS (AA)' : 'FAIL'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// 2. SPECIFIC HEX TO RGB
function HexToRgbComponent({ isDark, onCopy, copiedId }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedId: string | null }) {
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

  const [input, setInput] = useState('#EF4444');
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const rawVal = input.trim();
    if (!rawVal) {
      setResult(null);
      return;
    }
    const parsed = hexToRgb(rawVal);
    if (parsed) {
      setResult(`rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`);
    } else {
      setResult(null);
    }
  }, [input]);

  const badgeClass = isDark
    ? 'bg-rose-500/10 text-rose-455 border-rose-500/20'
    : 'bg-rose-50 text-rose-600 border-rose-200';

  return (
    <div className="space-y-6" id="hex-to-rgb-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>COLOR</span>
          HEX to RGB Converter
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Convert hex color hashes directly back into light-emitting RGB integer formats.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className={`p-5 ${t.panelBg} rounded-2xl space-y-4`}>
          <label className={`text-xs font-mono ${t.textFaint} uppercase tracking-wide block font-bold`}>Input HEX Code</label>
          <div className="relative">
            <Hash className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. #3b82f6 or 3B82F6"
              className={`w-full p-3 pl-10 ${t.inputBg} rounded-xl text-sm font-mono uppercase focus:outline-none focus:border-red-500`}
            />
          </div>
          <div className="flex gap-2">
            {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'].map((col) => (
              <button 
                key={col}
                onClick={() => setInput(col)}
                style={{ backgroundColor: col }}
                className="w-10 h-7 rounded border border-white/10 cursor-pointer pointer-events-auto shadow hover:scale-105 transition-transform" 
                title={col}
              />
            ))}
          </div>
        </div>

        {/* Right Output Column */}
        <div className={`p-5 ${t.panelBg} rounded-2xl flex flex-col justify-between`}>
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className={`text-xs font-mono ${t.textFaint} font-bold uppercase tracking-widest`}>CONVERTED RGB VALUE:</span>
              {result && (
                <button 
                  onClick={() => onCopy(result, 'rgb-c')}
                  className="text-xs text-indigo-400 hover:text-indigo-350 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === 'rgb-c' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Value
                </button>
              )}
            </div>

            {result ? (
              <div className={`p-4 ${t.controlBg} rounded-xl text-center space-y-3`}>
                <p className="text-2xl font-black font-mono text-emerald-350 tracking-wide select-all">{result}</p>
                <div 
                  style={{ backgroundColor: result }}
                  className="h-10 rounded-lg border border-white/5 mt-2 transition-all"
                />
              </div>
            ) : (
              <div className={`border border-dashed ${t.border} rounded-xl p-8 text-center ${t.textFaint} font-mono text-xs`}>
                Supply a fully matching HEX value code correctly trigger conversion.
              </div>
            )}
          </div>
          <p className={`text-[10px] font-mono ${t.textFaint} mt-3 leading-relaxed`}>
            Note: This utility supports both 3-digit shorthand (e.g. F00) and standard 6-digit layouts (e.g. FF0000) with or without standard hash tokens.
          </p>
        </div>
      </div>
    </div>
  );
}

// 3. SPECIFIC RGB TO HEX
function RgbToHexComponent({ isDark, onCopy, copiedId }: { isDark: boolean; onCopy: (text: string, id: string) => void; copiedId: string | null }) {
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

  const [r, setR] = useState<number>(59);
  const [g, setG] = useState<number>(130);
  const [b, setB] = useState<number>(246);

  const rgbHex = rgbToHexStr(r, g, b);

  const badgeClass = isDark
    ? 'bg-rose-500/10 text-rose-455 border-rose-500/20'
    : 'bg-rose-50 text-rose-600 border-rose-200';

  return (
    <div className="space-y-6" id="rgb-to-hex-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>COLOR</span>
          RGB to HEX Converter
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Reconstruct standard hexadecimal hash colors from distinct component light values.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column Controls */}
        <div className={`p-5 ${t.panelBg} rounded-2xl space-y-4 font-mono text-xs ${t.textMuted}`}>
          <span className={`text-xs uppercase font-bold ${t.textFaint} tracking-wider`}>Configure component values</span>
          
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between mb-1 text-rose-400 font-bold">
                <span>R value (Red):</span>
                <span>{r}</span>
              </div>
              <input 
                type="number" min="0" max="255" value={r} onChange={(e) => setR(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
                className={`w-full p-2 ${t.inputBg} rounded focus:outline-none focus:border-indigo-500 block mb-2`}
              />
              <input 
                type="range" min="0" max="255" value={r} onChange={(e) => setR(parseInt(e.target.value))}
                className="w-full accent-rose-500 bg-white/5 rounded-lg appearance-none h-1 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-emerald-400 font-bold">
                <span>G value (Green):</span>
                <span>{g}</span>
              </div>
              <input 
                type="number" min="0" max="255" value={g} onChange={(e) => setG(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
                className={`w-full p-2 ${t.inputBg} rounded focus:outline-none focus:border-indigo-500 block mb-2`}
              />
              <input 
                type="range" min="0" max="255" value={g} onChange={(e) => setG(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-white/5 rounded-lg appearance-none h-1 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-blue-400 font-bold">
                <span>B value (Blue):</span>
                <span>{b}</span>
              </div>
              <input 
                type="number" min="0" max="255" value={b} onChange={(e) => setB(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
                className={`w-full p-2 ${t.inputBg} rounded focus:outline-none focus:border-indigo-500 block mb-2`}
              />
              <input 
                type="range" min="0" max="255" value={b} onChange={(e) => setB(parseInt(e.target.value))}
                className="w-full accent-blue-500 bg-white/5 rounded-lg appearance-none h-1 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className={`p-5 ${t.panelBg} rounded-2xl flex flex-col justify-between`}>
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className={`text-xs font-mono ${t.textFaint} font-bold uppercase tracking-widest`}>COMPILE RESULT HEX CODE:</span>
              <button 
                onClick={() => onCopy(rgbHex, 'hex-c')}
                className="text-xs text-indigo-400 hover:text-indigo-350 transition-colors inline-flex items-center gap-1 cursor-pointer font-mono"
              >
                {copiedId === 'hex-c' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Hex
              </button>
            </div>

            <div className={`p-4 ${t.controlBg} rounded-xl text-center space-y-3`}>
              <p className="text-2xl font-black font-mono text-indigo-300 tracking-wider select-all uppercase">{rgbHex}</p>
              <div 
                style={{ backgroundColor: rgbHex }}
                className="h-10 rounded-lg border border-white/5 mt-2 transition-all duration-300 shadow"
              />
            </div>
          </div>
          <p className={`text-[10px] font-mono ${t.textFaint} mt-3 leading-relaxed`}>
            Light values are correctly clamped between standard boundaries (0 and 255) before compilation. Use this standard hexadecimal output directly in CSS files.
          </p>
        </div>

      </div>
    </div>
  );
}