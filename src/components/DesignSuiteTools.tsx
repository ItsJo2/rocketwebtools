import React, { useState, useEffect } from 'react';
import { Sliders, Palette, Activity, Check, Copy, AlertCircle, RefreshCw, Eye, Download, ShieldCheck, Grid, HelpCircle, Sparkles, Settings } from 'lucide-react';

interface DesignSuiteToolsProps {
  activeToolId: string;
}

export function DesignSuiteTools({ activeToolId }: DesignSuiteToolsProps) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(id);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  if (activeToolId === 'css-gradient') {
    return <CssGradient onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'color-palette') {
    return <ColorPalette onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'svg-optimizer') {
    return <SvgOptimizer onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }
  if (activeToolId === 'svg-path-editor') {
    return <SvgPathEditor onCopy={handleCopy} copiedStatus={copiedStatus} />;
  }

  return null;
}

// ==========================================
// 1. CSS GRADIENT GENERATOR
// ==========================================
function CssGradient({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<{ id: number; color: string; position: number; opacity: number }[]>([
    { id: 1, color: '#3b82f6', position: 0, opacity: 100 },
    { id: 2, color: '#8b5cf6', position: 50, opacity: 100 },
    { id: 3, color: '#ec4899', position: 100, opacity: 100 }
  ]);
  const [activeStopId, setActiveStopId] = useState<number>(1);

  // Helper: hexadecimal opacity representation
  const hexToRgba = (hex: string, opacity: number) => {
    const raw = hex.replace('#', '');
    const r = parseInt(raw.substring(0, 2), 16) || 0;
    const g = parseInt(raw.substring(2, 4), 16) || 0;
    const b = parseInt(raw.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const getGradientCode = () => {
    // Sort stops sequentially
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    const stopsStr = sorted.map(st => `${hexToRgba(st.color, st.opacity)} ${st.position}%`).join(', ');

    if (gradientType === 'linear') {
      return `background: linear-gradient(${angle}deg, ${stopsStr});`;
    } else {
      return `background: radial-gradient(circle, ${stopsStr});`;
    }
  };

  const handleUpdateStopValue = (id: number, key: 'color' | 'position' | 'opacity', val: any) => {
    setStops(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s));
  };

  const handleAddStop = () => {
    const nextId = Math.max(...stops.map(s => s.id)) + 1;
    // Add inside midsection
    setStops(prev => [
      ...prev,
      { id: nextId, color: '#6366f1', position: 75, opacity: 100 }
    ]);
    setActiveStopId(nextId);
  };

  const handleRemoveStop = (id: number) => {
    if (stops.length <= 2) return; // limit minimum
    setStops(prev => prev.filter(s => s.id !== id));
    if (activeStopId === id) {
      setActiveStopId(stops[0].id);
    }
  };

  const activeStop = stops.find(s => s.id === activeStopId) || stops[0];

  return (
    <div className="space-y-6" id="css-gradient-container">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded">UI</span>
          Aesthetic CSS Gradient Generator
        </h2>
        <p className="text-sm text-gray-400">Design multi-stop color compositions, customize angles, opacity ranges, and copy ready production-safe cross-browser CSS.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Preview panel */}
        <div className="space-y-4">
          <div 
            className="w-full h-60 rounded-2xl border border-white/10 shadow-inner flex items-end p-5 transition-all duration-300"
            style={{ backgroundImage: getGradientCode().replace('background: ', '').replace(';', '') }}
          >
            <div className="bg-black/40 backdrop-blur-md border border-white/5 p-3 rounded-lg text-xxs font-mono text-gray-300 select-all">
              {getGradientCode()}
            </div>
          </div>

          <div className="p-4 border border-white/15 bg-white/2 rounded-xl flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">OUTPUT CODEBLOCK CSS:</span>
            <button
              onClick={() => onCopy(getGradientCode(), 'grad-css')}
              className="p-1.5 px-4 bg-violet-600 hover:bg-violet-700 hover:text-white transition-all text-xs text-white rounded-lg cursor-pointer flex items-center gap-1 font-semibold"
            >
              {copiedStatus === 'grad-css' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedStatus === 'grad-css' ? 'Copied Gradient CSS' : 'Copy Styles Rules'}
            </button>
          </div>
        </div>

        {/* Editing Controllers */}
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-5">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-mono text-gray-400 mb-1 block">GRADIENT FORM:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGradientType('linear')}
                  className={`flex-1 p-2 text-xs font-mono rounded-lg border cursor-pointer transition-colors ${gradientType === 'linear' ? 'bg-violet-600 border-violet-500 text-white font-bold' : 'border-white/10 text-gray-400 bg-white/2 hover:bg-white/5'}`}
                >
                  Linear
                </button>
                <button
                  type="button"
                  onClick={() => setGradientType('radial')}
                  className={`flex-1 p-2 text-xs font-mono rounded-lg border cursor-pointer transition-colors ${gradientType === 'radial' ? 'bg-violet-600 border-violet-500 text-white font-bold' : 'border-white/10 text-gray-400 bg-white/2 hover:bg-white/5'}`}
                >
                  Radial
                </button>
              </div>
            </div>

            {gradientType === 'linear' && (
              <div className="w-28">
                <label className="text-xs font-mono text-gray-400 mb-1 block">ANGLE (°):</label>
                <input
                  type="number"
                  min="0"
                  max="360"
                  className="w-full p-2 border border-white/10 rounded-lg text-xs font-mono bg-[#161616] text-white text-center focus:ring-1 focus:ring-violet-500"
                  value={angle}
                  onChange={(e) => setAngle(Math.min(360, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                />
              </div>
            )}
          </div>

          {/* Color stops navigation timeline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">COLOR STOPS TIMELINE:</span>
              <button
                onClick={handleAddStop}
                className="text-violet-400 hover:text-violet-300 font-bold hover:underline cursor-pointer text-xxs"
              >
                + ADD COLOR STOP
              </button>
            </div>

            {/* Stops map */}
            <div className="flex items-center gap-3">
              {stops.map(st => (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setActiveStopId(st.id)}
                  className={`flex items-center gap-1.5 p-1.5 px-3 rounded-lg text-xxs font-mono border cursor-pointer transition-all ${activeStopId === st.id ? 'border-violet-500 bg-violet-600/10 text-white font-bold' : 'border-white/10 text-gray-400 bg-white/2 hover:bg-white/5'}`}
                >
                  <span className="w-3.5 h-3.5 rounded border border-white/20" style={{ backgroundColor: st.color }} />
                  <span>{st.position}%</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected stop specific options */}
          <div className="border border-white/5 bg-[#1a1a1a]/40 p-4 rounded-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xxs font-mono text-gray-400">EDIT SELECTED STOP:</span>
              {stops.length > 2 && (
                <button
                  onClick={() => handleRemoveStop(activeStop.id)}
                  className="text-rose-500 hover:text-rose-400 text-xxs font-mono font-bold cursor-pointer hover:underline"
                >
                  Delete Stop
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-gray-400 mb-1 block">HEX VALUE:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                    value={activeStop.color}
                    onChange={(e) => handleUpdateStopValue(activeStop.id, 'color', e.target.value)}
                  />
                  <input
                    type="text"
                    maxLength={7}
                    className="flex-1 p-2 py-1.5 border border-white/10 rounded-lg text-xs font-mono bg-[#161616] text-white focus:outline-none focus:ring-1 focus:ring-violet-500 uppercase"
                    value={activeStop.color}
                    onChange={(e) => handleUpdateStopValue(activeStop.id, 'color', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 mb-1 block">POSITION ON TIMELINE ({activeStop.position}%):</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full h-2 rounded-lg cursor-pointer bg-white/5"
                  value={activeStop.position}
                  onChange={(e) => handleUpdateStopValue(activeStop.id, 'position', parseInt(e.target.value, 10))}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-400 mb-1 block">OPACITY VALUE ({activeStop.opacity}%):</label>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full h-2 rounded-lg cursor-pointer bg-white/5"
                value={activeStop.opacity}
                onChange={(e) => handleUpdateStopValue(activeStop.id, 'opacity', parseInt(e.target.value, 10))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. COLOR PALETTE CREATOR
// ==========================================
function ColorPalette({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const [baseColor, setBaseColor] = useState('#2563eb');
  const [harmonyType, setHarmonyType] = useState<'complementary' | 'analogous' | 'triadic' | 'monochromatic'>('analogous');
  const [palette, setPalette] = useState<string[]>([]);

  // Simple browser-side Hex/Hsl conversions to achieve balance color rules
  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100;
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
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const computeHarmony = (hex: string, rule: string) => {
    const { h, s, l } = hexToHsl(hex);
    let outputColors: string[] = [];

    if (rule === 'complementary') {
      const compH = (h + 180) % 360;
      outputColors = [
        hslToHex(h, s, Math.min(90, l + 15)),
        hex,
        hslToHex(h, s, Math.max(10, l - 15)),
        hslToHex(compH, s, Math.min(90, l + 15)),
        hslToHex(compH, s, l),
        hslToHex(compH, s, Math.max(10, l - 15))
      ];
    } else if (rule === 'analogous') {
      outputColors = [
        hslToHex((h + 330) % 360, s, l),
        hslToHex((h + 345) % 360, s, l),
        hex,
        hslToHex((h + 15) % 360, s, l),
        hslToHex((h + 30) % 360, s, l),
        hslToHex((h + 45) % 360, s, l)
      ];
    } else if (rule === 'triadic') {
      outputColors = [
        hslToHex(h, s, Math.min(90, l + 15)),
        hex,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 120) % 360, s, Math.max(10, l - 15)),
        hslToHex((h + 240) % 360, s, l),
        hslToHex((h + 240) % 360, s, Math.max(10, l - 15))
      ];
    } else if (rule === 'monochromatic') {
      outputColors = [
        hslToHex(h, Math.max(10, s - 20), Math.min(90, l + 30)),
        hslToHex(h, Math.max(10, s - 10), Math.min(85, l + 15)),
        hex,
        hslToHex(h, Math.min(100, s + 10), Math.max(15, l - 15)),
        hslToHex(h, Math.min(100, s + 20), Math.max(10, l - 30)),
        hslToHex(h, Math.min(100, s + 30), Math.max(5, l - 40))
      ];
    }

    setPalette(outputColors);
  };

  useEffect(() => {
    if (/^#[0-9A-F]{6}$/i.test(baseColor)) {
      computeHarmony(baseColor, harmonyType);
    }
  }, [baseColor, harmonyType]);

  const handleRandomizeColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    setBaseColor(color);
  };

  return (
    <div className="space-y-6" id="color-palette-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/52">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="p-1 px-2 text-xs font-mono bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded">DESIGN</span>
            Cohesive Color Palette Generator
          </h2>
          <p className="text-sm text-gray-400">Compile beautifully paired color schemes depending on classic geometric color wheels. Click on any hex to copy instantly.</p>
        </div>
        <button
          onClick={handleRandomizeColor}
          className="p-1.5 px-4 rounded border border-white/10 text-xs font-mono flex items-center gap-1.5 hover:bg-white/5 text-gray-350 cursor-pointer self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          RANDOMIZE COLOR
        </button>
      </div>

      <div className="bg-[#141414] border border-white/5 p-5 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between select-none">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div>
            <span className="text-xs font-mono text-gray-400 block mb-1">BASE COLOR INDEX:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-white/15"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
              />
              <input
                type="text"
                maxLength={7}
                className="w-28 p-2 border border-white/10 rounded-lg text-xs font-mono bg-[#161616] text-white focus:outline-none focus:ring-1 focus:ring-violet-500 uppercase font-black"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-96">
          <span className="text-xs font-mono text-gray-400 block mb-1">GEOMETRIC ACCENT RULES:</span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {['analogous', 'complementary', 'triadic', 'monochromatic'].map(rule => (
              <button
                type="button"
                key={rule}
                onClick={() => setHarmonyType(rule as any)}
                className={`p-2 rounded-lg border text-left cursor-pointer capitalize ${harmonyType === rule ? 'border-violet-500 bg-violet-600/10 text-white font-bold' : 'border-white/5 text-gray-400 bg-white/2 hover:bg-white/5'}`}
              >
                {rule}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
        {palette.map((color, idx) => (
          <button
            key={`palette-${color}-${idx}`}
            onClick={() => onCopy(color, `pal-${idx}`)}
            className="group flex flex-col rounded-2xl border border-white/10 overflow-hidden bg-[#161616] hover:border-white/20 transition-all text-left shadow-lg cursor-pointer"
          >
            <div className="w-full h-28" style={{ backgroundColor: color }} />
            <div className="p-3 font-mono flex items-center justify-between w-full h-11 bg-[#121212]">
              <span className="text-xxs font-black text-gray-300 uppercase">{color}</span>
              {copiedStatus === `pal-${idx}` ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. SVG OPTIMIZER & MINIFIER
// ==========================================
function SvgOptimizer({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void; copiedStatus: string | null }) {
  const [rawSvg, setRawSvg] = useState(`<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">\n<!-- Generator: Adobe Illustrator 24.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) -->\n<style type="text/css">\n\t.st0{fill:#6366F1;}\n</style>\n<g>\n\t<circle class="st0" cx="50" cy="50" r="40"/>\n</g>\n</svg>`);
  const [minifiedSvg, setMinifiedSvg] = useState('');
  const [origSize, setOrigSize] = useState(0);
  const [minSize, setMinSize] = useState(0);
  const [savingPercentage, setSavingPercentage] = useState(0);

  const handleOptimize = () => {
    let svg = rawSvg.trim();

    // 1. Remove comments
    svg = svg.replace(/<!--[\s\S]*?-->/g, '');

    // 2. Remove xml namespaces/namespaces metadata
    svg = svg.replace(/xmlns:xlink="[^"]*"/g, '');
    svg = svg.replace(/x="[^"]*"/g, '');
    svg = svg.replace(/y="[^"]*"/g, '');
    svg = svg.replace(/style="enable-background:[^"]*"/g, '');
    svg = svg.replace(/xml:space="[^"]*"/g, '');
    svg = svg.replace(/id="[^"]*"/g, '');
    svg = svg.replace(/version="[^"]*"/g, '');

    // 3. Strip extra spaces and tabs
    svg = svg.replace(/\n/g, ' ');
    svg = svg.replace(/\t/g, ' ');
    svg = svg.replace(/\s+/g, ' ');

    // 4. Remove spacing around brackets/tag boundaries
    svg = svg.replace(/>\s+</g, '><');
    svg = svg.replace(/\s*=\s*/g, '=');

    const cleanSvg = svg.trim();
    setMinifiedSvg(cleanSvg);

    const oSize = new Blob([rawSvg]).size;
    const mSize = new Blob([cleanSvg]).size;

    setOrigSize(oSize);
    setMinSize(mSize);

    if (oSize > 0) {
      setSavingPercentage(Math.round(((oSize - mSize) / oSize) * 100));
    }
  };

  useEffect(() => {
    handleOptimize();
  }, [rawSvg]);

  return (
    <div className="space-y-6" id="svg-optimizer-container">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded">SVG</span>
          SVG Layout Optimizer & Minifier
        </h2>
        <p className="text-sm text-gray-400">Strip useless generator identifiers, Adobe markup headers, local namespaces, and reduce vector file payloads for instant loading.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-gray-400 mb-1.5 block">RAW SVG GRAPHIC ELEMENT MARKUP:</label>
            <textarea
              className="w-full h-64 p-3 border border-white/10 rounded-lg text-xs font-mono bg-[#161616] text-white focus:outline-none focus:ring-1 focus:ring-violet-500 leading-normal"
              placeholder="Paste raw vector XML element here (<svg>... </svg>)"
              value={rawSvg}
              onChange={(e) => setRawSvg(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg border border-white/5 bg-white/2">
              <span className="text-xxs font-mono text-gray-500 block">Original Size</span>
              <span className="text-sm font-mono font-bold text-white">{origSize} bytes</span>
            </div>
            <div className="p-3 rounded-lg border border-white/5 bg-white/2">
              <span className="text-xxs font-mono text-gray-500 block">Optimized Size</span>
              <span className="text-sm font-mono font-bold text-violet-400">{minSize} bytes</span>
            </div>
            <div className="p-3 rounded-lg border border-emerald-950 bg-emerald-950/20">
              <span className="text-xxs font-mono text-emerald-500 block">Savings</span>
              <span className="text-sm font-mono font-bold text-emerald-400">{savingPercentage}% ratio</span>
            </div>
          </div>
        </div>

        {/* Right Side Visual and copy block */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-mono text-gray-400">VECTOR VISUAL PREVIEW:</span>
            {minifiedSvg && (
              <button
                onClick={() => onCopy(minifiedSvg, 'opt-svg')}
                className="text-xs inline-flex items-center gap-1 hover:text-violet-400 text-gray-400 cursor-pointer"
              >
                {copiedStatus === 'opt-svg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStatus === 'opt-svg' ? 'Copied Clean SVG Markup' : 'Copy Optimized SVG'}
              </button>
            )}
          </div>

          {/* Render the sanitized vector markup */}
          <div className="h-64 rounded-xl border border-white/10 bg-[#161616] flex items-center justify-center p-6 relative overflow-hidden">
            {minifiedSvg ? (
              <div 
                className="w-full h-full max-w-[160px] max-h-[160px]"
                dangerouslySetInnerHTML={{ __html: minifiedSvg }} 
              />
            ) : (
              <span className="text-xs text-gray-500">Vector layout preview is empty.</span>
            )}
          </div>

          <div className="p-3 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 rounded-lg flex items-center gap-2 text-xxs font-mono">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>Success: Cleaned vector properties locally inside memory without stripping coordinates or styles.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SVG PATH COORDINATE VISUALIZER & EDITOR
// ==========================================
export function SvgPathEditor({
  onCopy,
  copiedStatus
}: {
  onCopy: (text: string, id: string) => void;
  copiedStatus: string | null;
}) {
  const [rawPath, setRawPath] = useState('M 10 80 C 40 10, 60 10, 95 80');
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(1);
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
  const [svgWidth, setSvgWidth] = useState(120);
  const [svgHeight, setSvgHeight] = useState(100);
  const [gridOpacity, setGridOpacity] = useState(30);

  // Parse path string into structured nodes
  const nodes: PathNode[] = [];
  const commandRegex = /([MLHVCSQTAZmlhvcsqtaz])([^MLHVCSQTAZmlhvcsqtaz]*)/g;
  let match;
  let idCounter = 1;

  while ((match = commandRegex.exec(rawPath)) !== null) {
    const cmd = match[1];
    const argsStr = match[2];
    const numRegex = /-?\d*\.?\d+(?:[eE][-+]?\d+)?/g;
    const args: number[] = [];
    let numMatch;
    while ((numMatch = numRegex.exec(argsStr)) !== null) {
      args.push(parseFloat(numMatch[0]));
    }
    nodes.push({ id: idCounter++, command: cmd, args });
  }

  interface PathNode {
    id: number;
    command: string;
    args: number[];
  }

  // Pre-configured paths for demos
  const presets = [
    { name: 'Cubic Bezier Curve', path: 'M 10 80 C 40 10, 60 10, 95 80' },
    { name: 'Symmetrical Heart', path: 'M 50 25 C 35 5, 5 10, 5 45 C 5 70, 35 85, 50 105 C 65 85, 95 70, 95 45 C 95 10, 65 5, 50 25' },
    { name: 'Spear Arrowhead', path: 'M 10 50 L 90 50 M 60 20 L 90 50 L 60 80' },
    { name: 'Speeches Bubble', path: 'M 15 15 L 85 15 L 85 65 L 55 65 L 35 90 L 35 65 L 15 65 Z' }
  ];

  // Helper: Compile nodes back to path string
  const getCompiledPath = (currentNodes: PathNode[]) => {
    return currentNodes.map(n => {
      // Standardize empty spaces between arguments
      return `${n.command} ${n.args.join(' ')}`;
    }).join(' ');
  };

  const handleUpdateNodeArg = (nodeId: number, argIndex: number, newValue: number) => {
    const updated = nodes.map(n => {
      if (n.id === nodeId) {
        const newArgs = [...n.args];
        newArgs[argIndex] = parseFloat(newValue.toFixed(1));
        return { ...n, args: newArgs };
      }
      return n;
    });
    setRawPath(getCompiledPath(updated));
  };

  const handleLoadPreset = (pStr: string) => {
    setRawPath(pStr);
    setSelectedNodeId(1);
  };

  // Traversal loop to calculate actual segment start/end/control coordinates
  let currentX = 0;
  let currentY = 0;
  const pathSegments: any[] = [];

  nodes.forEach((node) => {
    const uppercaseCmd = node.command.toUpperCase();
    const isRelative = node.command !== uppercaseCmd;
    const segment: any = {
      nodeId: node.id,
      command: node.command,
      start: { x: currentX, y: currentY },
      end: { x: currentX, y: currentY },
      handles: []
    };

    if (uppercaseCmd === 'M' || uppercaseCmd === 'L') {
      const targetX = node.args[0] ?? 0;
      const targetY = node.args[1] ?? 0;
      if (isRelative) {
        currentX += targetX;
        currentY += targetY;
      } else {
        currentX = targetX;
        currentY = targetY;
      }
      segment.end = { x: currentX, y: currentY };
    } 
    else if (uppercaseCmd === 'H') {
      const targetX = node.args[0] ?? 0;
      if (isRelative) {
        currentX += targetX;
      } else {
        currentX = targetX;
      }
      segment.end = { x: currentX, y: currentY };
    }
    else if (uppercaseCmd === 'V') {
      const targetY = node.args[0] ?? 0;
      if (isRelative) {
        currentY += targetY;
      } else {
        currentY = targetY;
      }
      segment.end = { x: currentX, y: currentY };
    }
    else if (uppercaseCmd === 'C') {
      const x1 = node.args[0] ?? 0;
      const y1 = node.args[1] ?? 0;
      const x2 = node.args[2] ?? 0;
      const y2 = node.args[3] ?? 0;
      const targetX = node.args[4] ?? 0;
      const targetY = node.args[5] ?? 0;

      let absX1 = x1, absY1 = y1, absX2 = x2, absY2 = y2, absX = targetX, absY = targetY;
      if (isRelative) {
        absX1 = currentX + x1;
        absY1 = currentY + y1;
        absX2 = currentX + x2;
        absY2 = currentY + y2;
        absX = currentX + targetX;
        absY = currentY + targetY;
      }

      segment.handles = [
        { start: { x: segment.start.x, y: segment.start.y }, end: { x: absX1, y: absY1 }, type: 'Control h1' },
        { start: { x: absX, y: absY }, end: { x: absX2, y: absY2 }, type: 'Control h2' }
      ];

      currentX = absX;
      currentY = absY;
      segment.end = { x: currentX, y: currentY };
    }
    else if (uppercaseCmd === 'Q') {
      const x1 = node.args[0] ?? 0;
      const y1 = node.args[1] ?? 0;
      const targetX = node.args[2] ?? 0;
      const targetY = node.args[3] ?? 0;

      let absX1 = x1, absY1 = y1, absX = targetX, absY = targetY;
      if (isRelative) {
        absX1 = currentX + x1;
        absY1 = currentY + y1;
        absX = currentX + targetX;
        absY = currentY + targetY;
      }

      segment.handles = [
        { start: { x: segment.start.x, y: segment.start.y }, end: { x: absX1, y: absY1 }, type: 'Quadratic' }
      ];

      currentX = absX;
      currentY = absY;
      segment.end = { x: currentX, y: currentY };
    }
    else if (uppercaseCmd === 'S') {
      const x2 = node.args[0] ?? 0;
      const y2 = node.args[1] ?? 0;
      const targetX = node.args[2] ?? 0;
      const targetY = node.args[3] ?? 0;

      let absX2 = x2, absY2 = y2, absX = targetX, absY = targetY;
      if (isRelative) {
        absX2 = currentX + x2;
        absY2 = currentY + y2;
        absX = currentX + targetX;
        absY = currentY + targetY;
      }

      segment.handles = [
        { start: { x: absX, y: absY }, end: { x: absX2, y: absY2 }, type: 'Smooth Handle' }
      ];

      currentX = absX;
      currentY = absY;
      segment.end = { x: currentX, y: currentY };
    }
    else if (uppercaseCmd === 'A') {
      const targetX = node.args[5] ?? 0;
      const targetY = node.args[6] ?? 0;
      let absX = targetX, absY = targetY;
      if (isRelative) {
        absX = currentX + targetX;
        absY = currentY + targetY;
      }
      currentX = absX;
      currentY = absY;
      segment.end = { x: currentX, y: currentY };
    }
    else if (uppercaseCmd === 'Z') {
      let mx = 0, my = 0;
      for (let j = pathSegments.length - 1; j >= 0; j--) {
        if (pathSegments[j].command.toUpperCase() === 'M') {
          mx = pathSegments[j].end.x;
          my = pathSegments[j].end.y;
          break;
        }
      }
      currentX = mx;
      currentY = my;
      segment.end = { x: currentX, y: currentY };
    }

    pathSegments.push(segment);
  });

  const selectedSegment = pathSegments.find(s => s.nodeId === selectedNodeId);

  // Helper: Render friendly name for coordinates input arrays
  const getArgLabel = (cmd: string, idx: number): string => {
    const uc = cmd.toUpperCase();
    if (uc === 'M' || uc === 'L') {
      return idx === 0 ? 'Target X (Horizontal)' : 'Target Y (Vertical)';
    }
    if (uc === 'H') {
      return 'Target Horizontal X';
    }
    if (uc === 'V') {
      return 'Target Vertical Y';
    }
    if (uc === 'C') {
      if (idx === 0) return 'Handle 1 X1';
      if (idx === 1) return 'Handle 1 Y1';
      if (idx === 2) return 'Handle 2 X2';
      if (idx === 3) return 'Handle 2 Y2';
      if (idx === 4) return 'Dest End X';
      if (idx === 5) return 'Dest End Y';
    }
    if (uc === 'Q') {
      if (idx === 0) return 'Control X1';
      if (idx === 1) return 'Control Y1';
      if (idx === 2) return 'Dest End X';
      if (idx === 3) return 'Dest End Y';
    }
    if (uc === 'S') {
      if (idx === 0) return 'Reflect X2';
      if (idx === 1) return 'Reflect Y2';
      if (idx === 2) return 'Dest End X';
      if (idx === 3) return 'Dest End Y';
    }
    if (uc === 'A') {
      if (idx === 0) return 'Radius X (rx)';
      if (idx === 1) return 'Radius Y (ry)';
      if (idx === 2) return 'Degrees Rotation';
      if (idx === 3) return 'Large Arc (0/1)';
      if (idx === 4) return 'Sweep Flag (0/1)';
      if (idx === 5) return 'Dest End X';
      if (idx === 6) return 'Dest End Y';
    }
    return `Argument Index ${idx}`;
  };

  const selectedNodeObj = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="p-6 bg-[#18181b]/95 border border-white/5 rounded-2xl shadow-xl space-y-6">
      
      {/* Header Block */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2 font-mono">
          <Grid className="w-5 h-5 text-indigo-400" />
          SVG Path Coordinate Visualizer &amp; Editor
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Trace Scalable Vector path curves, display cubic Bezier anchor handles, and edit coordinates directly on a real-time responsive high-contrast grid system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Interactive Canvas Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">Dynamic Interactive Canvas</span>
            
            <div className="flex items-center gap-3">
              <label className="text-[11px] font-mono text-gray-500 flex items-center gap-1.5">
                Grid: 
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={gridOpacity}
                  onChange={(e) => setGridOpacity(parseInt(e.target.value))}
                  className="w-16 accent-indigo-500 h-1"
                />
              </label>
            </div>
          </div>

          {/* SVG Vector Stage */}
          <div className="relative rounded-2xl border border-white/10 bg-[#07070a] p-4 flex items-center justify-center min-h-[380px] select-none">
            
            {/* Background alignment grid */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              style={{ opacity: gridOpacity / 100 }}
            >
              <defs>
                <pattern id="editorGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" />
                </pattern>
                <pattern id="editorGridBold" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#editorGrid)" />
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#editorGridBold)" />
            </svg>

            {/* Core render scale */}
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full max-w-[340px] h-auto overflow-visible relative z-10"
            >
              {/* Actual segment paths of the SVG */}
              <path
                d={rawPath}
                fill="none"
                stroke="transparent"
                strokeWidth="10"
                className="cursor-pointer"
              />
              <path
                d={rawPath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
              />

              {/* Draw Bezier Handles/Control lines */}
              {pathSegments.map((seg, i) => {
                const isSelected = seg.nodeId === selectedNodeId;
                if (!seg.handles || seg.handles.length === 0) return null;
                return seg.handles.map((hand: any, hIdx: number) => (
                  <g key={`hand-${i}-${hIdx}`} className="opacity-80">
                    {/* Draw line to control point */}
                    <line
                      x1={hand.start.x}
                      y1={hand.start.y}
                      x2={hand.end.x}
                      y2={hand.end.y}
                      stroke={isSelected ? '#38bdf8' : '#64748b'}
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                    {/* Circle representing control handle itself */}
                    <circle
                      cx={hand.end.x}
                      cy={hand.end.y}
                      r="2"
                      fill={isSelected ? '#38bdf8' : '#94a3b8'}
                      stroke="#07070a"
                      strokeWidth="1"
                      cursor="pointer"
                      title={hand.type}
                    />
                  </g>
                ));
              })}

              {/* Plot Coordinates circles representing actual Nodes */}
              {pathSegments.map((seg, i) => {
                const isSelected = seg.nodeId === selectedNodeId;
                const isHovered = seg.nodeId === hoveredNodeId;
                return (
                  <g 
                    key={`node-${i}`}
                    onMouseEnter={() => setHoveredNodeId(seg.nodeId)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={() => setSelectedNodeId(seg.nodeId)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={seg.end.x}
                      cy={seg.end.y}
                      r={isSelected ? "4.5" : isHovered ? "4" : "3"}
                      fill={isSelected ? '#f43f5e' : isHovered ? '#10b981' : '#a5b4fc'}
                      stroke="#07070a"
                      strokeWidth="1.2"
                      className="transition-all duration-150"
                    />
                    {/* Mini node index label */}
                    <text
                      x={seg.end.x}
                      y={seg.end.y - (isSelected ? 7 : 5)}
                      fontSize="5"
                      fill={isSelected ? '#f43f5e' : '#94a3b8'}
                      textAnchor="middle"
                      className="font-mono font-bold select-none pointer-events-none"
                    >
                      #{seg.nodeId}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Preset Demos Block */}
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono">
            <span className="text-[10px] text-gray-500 font-bold">PRESETS:</span>
            {presets.map((p, i) => (
              <button
                key={i}
                onClick={() => handleLoadPreset(p.path)}
                className="p-1 px-2 border border-white/5 bg-white/5 hover:bg-white/10 text-[10px] text-gray-400 hover:text-white rounded transition-all flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Parameters Editor */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Node Selector Table View */}
          <div className="bg-[#09090c] border border-white/5 rounded-xl p-4 space-y-3">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">Vector Points Matrix</span>

            <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1 font-mono">
              {nodes.map((n) => {
                const isSelected = n.id === selectedNodeId;
                const endCoords = pathSegments.find(s => s.nodeId === n.id)?.end || { x: 0, y: 0 };
                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNodeId(n.id)}
                    onMouseEnter={() => setHoveredNodeId(n.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className={`p-2 rounded-lg cursor-pointer flex justify-between items-center transition-all border ${
                      isSelected 
                        ? 'bg-indigo-500/10 border-indigo-500/20 text-white' 
                        : 'bg-[#111114] border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="bg-white/5 p-1 px-2 rounded-md font-bold text-[10px] text-indigo-400">
                        #{n.id}
                      </span>
                      <strong className="text-xs font-semibold">{n.command}</strong>
                    </div>

                    <div className="text-[10px] text-gray-500 flex gap-2">
                      <span>End X: <strong className="text-gray-300">{endCoords.x.toFixed(0)}</strong></span>
                      <span>End Y: <strong className="text-gray-300">{endCoords.y.toFixed(0)}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Arguments Form Fields */}
          {selectedNodeObj ? (
            <div className="bg-[#09090c] border border-white/5 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">
                  Editing Point #{selectedNodeId} (Command: {selectedNodeObj.command})
                </span>
              </div>

              {selectedNodeObj.args.length === 0 ? (
                <p className="text-xs text-gray-500 italic leading-relaxed font-sans">
                  The closed path instruction (Z) has no mathematical coordinate handles. It connects the current coordinates directly back to the initial segment source.
                </p>
              ) : (
                <div className="space-y-3 font-mono">
                  {selectedNodeObj.args.map((arg, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xxs font-mono text-gray-500 font-bold uppercase">
                        <span>{getArgLabel(selectedNodeObj.command, idx)}</span>
                        <span>Value: {arg}</span>
                      </div>

                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => handleUpdateNodeArg(selectedNodeObj.id, idx, arg - 5)}
                          className="p-1 px-2.5 bg-white/5 border border-white/10 rounded font-bold text-xs hover:bg-white/10 text-white transition-colors"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleUpdateNodeArg(selectedNodeObj.id, idx, arg - 1)}
                          className="p-1 px-2 bg-white/5 border border-white/10 rounded font-bold text-xs hover:bg-white/10 text-white transition-colors"
                        >
                          -1
                        </button>

                        <input
                          type="number"
                          value={arg}
                          step="0.5"
                          onChange={(e) => handleUpdateNodeArg(selectedNodeObj.id, idx, parseFloat(e.target.value) || 0)}
                          className="w-full p-1 bg-[#121214] border border-white/5 rounded text-xs text-white font-mono text-center focus:outline-none focus:border-indigo-500/40"
                        />

                        <button
                          onClick={() => handleUpdateNodeArg(selectedNodeObj.id, idx, arg + 1)}
                          className="p-1 px-2 bg-white/5 border border-white/10 rounded font-bold text-xs hover:bg-white/10 text-white transition-colors"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleUpdateNodeArg(selectedNodeObj.id, idx, arg + 5)}
                          className="p-1 px-2.5 bg-white/5 border border-white/10 rounded font-bold text-xs hover:bg-white/10 text-white transition-colors"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#09090c] p-4 rounded-xl border border-white/5 text-center text-xs text-gray-500">
              Select one point on the path graph to edit.
            </div>
          )}

          {/* Main raw coordinate output */}
          <div className="bg-[#09090c] border border-white/5 rounded-xl p-4 space-y-3">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">Generated Path string (d)</span>
            
            <div className="space-y-3">
              <div className="p-3 bg-[#111114] border border-white/5 rounded-lg select-all break-all font-mono text-xs text-indigo-400 font-semibold leading-relaxed">
                {rawPath}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(rawPath);
                    onCopy(rawPath, 'copied-rawpath');
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2 bg-indigo-500 hover:bg-indigo-600 text-white font-mono font-medium rounded-lg text-xs transition-colors shadow-lg"
                >
                  {copiedStatus === 'copied-rawpath' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      Copied SVG Path
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Path Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
