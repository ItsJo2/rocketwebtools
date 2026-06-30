import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, RefreshCw, Sparkles, Download, CheckCircle, FileImage, 
  FileText, Code, RotateCw, Maximize, Crop, MoveHorizontal, Check, Copy, 
  Sliders, Image as ImageIcon, HelpCircle 
} from 'lucide-react';

// Format helper
const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface ImageToolsProps {
  activeToolId: string;
  isDark: boolean;
}

export function ImageTools({ activeToolId, isDark }: ImageToolsProps) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(id);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  switch (activeToolId) {
    case 'image-enlarger': return <ImageEnlarger isDark={isDark} />;
    case 'image-cropper': return <ImageCropper isDark={isDark} />;
    case 'image-resizer': return <ImageResizer isDark={isDark} />;
    case 'image-converter': return <ImageConverter isDark={isDark} />;
    case 'jpg-to-png': return <JpgToPngConverter isDark={isDark} />;
    case 'jpg-converter': return <JpgConverter isDark={isDark} />;
    case 'webp-to-jpg': return <WebpToJpgConverter isDark={isDark} />;
    case 'png-to-jpg': return <PngToJpgConverter isDark={isDark} />;
    case 'ico-to-png': return <IcoToPngConverter isDark={isDark} />;
    case 'ico-converter': return <IcoConverterComponent isDark={isDark} />;
    case 'image-to-base64': return <ImageToBase64 isDark={isDark} onCopy={handleCopy} copiedStatus={copiedStatus} />;
    case 'base64-to-image': return <Base64ToImage isDark={isDark} />;
    case 'flip-image': return <FlipImage isDark={isDark} />;
    
    // 9 New Dynamic Direct Converters
    case 'png-to-webp':
    case 'png-to-bmp':
    case 'png-to-gif':
    case 'png-to-ico':
    case 'jpg-to-webp':
    case 'jpg-to-bmp':
    case 'jpg-to-gif':
    case 'jpg-to-ico':
    case 'webp-to-png':
      return <DirectPairConverter isDark={isDark} toolId={activeToolId} />;
      
    default: return null;
  }
}

// 1. IMAGE ENLARGER (Upscaler)
function ImageEnlarger({ isDark }: { isDark: boolean }) {
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

  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(2);
  const [smoothing, setSmoothing] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [specs, setSpecs] = useState<{ w: number; h: number; outW: number; outH: number } | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setSrc(url);
      setOutUrl(null);
      setSpecs(null);
    }
  };

  const handleEnlarge = () => {
    if (!src || !file) return;
    setLoading(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const outW = Math.round(w * scale);
      const outH = Math.round(h * scale);
      
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = smoothing;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, outW, outH);
        canvas.toBlob((blob) => {
          if (blob) {
            if (outUrl) URL.revokeObjectURL(outUrl);
            setOutUrl(URL.createObjectURL(blob));
            setSpecs({ w, h, outW, outH });
          }
          setLoading(false);
        }, file.type);
      } else {
        setLoading(false);
      }
    };
    img.src = src;
  };

  const badgeClass = isDark
    ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    : 'bg-orange-50 text-orange-600 border-orange-200';

  return (
    <div className="space-y-6">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>IMAGE</span>
          Image Enlarger & Upscaler
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Increase image fidelity and dimensions using custom on-device smoothing or pixelated (nearest-neighbor) interpolation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} hover:border-orange-550/30 transition-all relative`}>
            <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            <UploadCloud className={`w-10 h-10 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Choose an image file</p>
            <p className={`text-[10px] ${t.textFaint} mt-1`}>PNG, JPG, WebP supported</p>
          </div>

          {file && (
            <div className={`${t.panelBg} rounded-xl p-4 text-xs space-y-4`}>
              <div className="space-y-2">
                <label className={`${t.textMuted} block font-bold`}>Scaling Factor:</label>
                <div className="grid grid-cols-4 gap-1">
                  {[1.5, 2, 3, 4].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setScale(s)}
                      className={`p-1.5 rounded font-mono text-xs cursor-pointer ${scale === s ? 'bg-orange-600 text-white' : `${t.controlBg} ${t.textMuted}`}`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              <div className={`space-y-2 select-none`}>
                <label className={`${t.textMuted} block font-bold`}>Scaling Algorithm:</label>
                <div className={`flex gap-4 ${t.textMuted}`}>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" checked={smoothing} onChange={() => setSmoothing(true)} className="accent-orange-500 cursor-pointer" />
                    <span>Smooth (Bilinear)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" checked={!smoothing} onChange={() => setSmoothing(false)} className="accent-orange-500 cursor-pointer" />
                    <span>Pixelated (Retro)</span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleEnlarge}
                disabled={loading}
                className="w-full p-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Maximize className="w-3.5 h-3.5" />}
                <span>Upscale Image</span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {!src ? (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[300px]`}>
              <ImageIcon className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Select an image to open the upscaling workstation.</p>
            </div>
          ) : (
            <div className={`border ${t.border} rounded-xl p-5 ${t.controlBg} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className={`text-[10px] font-bold ${t.textFaint} block uppercase font-mono mb-1`}>Source Preview:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 relative ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    <img src={src} className="max-w-full max-h-full object-contain" alt="Original visual" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono mb-1">Upscaled Render:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 relative ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    {outUrl ? (
                      <img src={outUrl} className="max-w-full max-h-full object-contain" alt="Enlarged visual" />
                    ) : (
                      <p className={`text-center text-xs ${t.textFaint} px-4`}>Click "Upscale Image" to apply interpolation.</p>
                    )}
                  </div>
                </div>
              </div>

              {specs && outUrl && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-orange-950/15 p-4 rounded-xl border border-orange-500/20">
                  <div className="space-y-1 text-xs">
                    <p className="text-orange-200 font-bold">Fidelity Enlist Complete!</p>
                    <p className={`${t.textFaint} font-mono text-[10px]`}>Ratio: {scale}x • Original: {specs.w}×{specs.h} px • Target: {specs.outW}×{specs.outH} px</p>
                  </div>
                  <a
                    href={outUrl}
                    download={`upscaled_${scale}x_${file?.name}`}
                    className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Upscaled</span>
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

// 2. IMAGE CROPPER
function ImageCropper({ isDark }: { isDark: boolean }) {
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

  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 });
  const [aspect, setAspect] = useState<string>('free');
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [previewSpec, setPreviewSpec] = useState<string>('');
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setSrc(url);
      setOutUrl(null);
      setCropBox({ x: 15, y: 15, w: 70, h: 70 });
    }
  };

  const applyAspect = (asp: string) => {
    setAspect(asp);
    let ratio = 1;
    if (asp === '1:1') ratio = 1;
    else if (asp === '16:9') ratio = 16 / 9;
    else if (asp === '4:3') ratio = 4 / 3;
    else if (asp === '2:3') ratio = 2 / 3;
    else return;

    const newW = 60;
    const newH = Math.min(60 / ratio, 80);
    setCropBox(prev => ({
      ...prev,
      w: newW,
      h: newH,
      x: Math.max(0, 50 - newW / 2),
      y: Math.max(0, 50 - newH / 2)
    }));
  };

  const handleCrop = () => {
    if (!src || !imgRef.current) return;
    const img = imgRef.current;
    
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    const sourceX = (cropBox.x / 100) * naturalW;
    const sourceY = (cropBox.y / 100) * naturalH;
    const sourceW = (cropBox.w / 100) * naturalW;
    const sourceH = (cropBox.h / 100) * naturalH;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(sourceW);
    canvas.height = Math.round(sourceH);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW, sourceH);
      canvas.toBlob((blob) => {
        if (blob) {
          if (outUrl) URL.revokeObjectURL(outUrl);
          setOutUrl(URL.createObjectURL(blob));
          setPreviewSpec(`${canvas.width} × ${canvas.height} px`);
        }
      }, file?.type || 'image/png');
    }
  };

  const badgeClass = isDark
    ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    : 'bg-orange-50 text-orange-600 border-orange-200';

  return (
    <div className="space-y-6">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>IMAGE</span>
          Precision Image Cropper
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Crop images with interactive aspect ratios and coordinate sliders with high precision offline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} relative`}>
            <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className={`w-8 h-8 mx-auto ${t.textFaint} mb-2`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Choose canvas source</p>
          </div>

          {file && src && (
            <div className={`${t.panelBg} rounded-xl p-4 text-xs space-y-4`}>
              <div>
                <span className={`${t.textMuted} font-bold block mb-1.5`}>Preset Aspect Ratio:</span>
                <div className="grid grid-cols-3 gap-1">
                  {['free', '1:1', '16:9', '4:3', '2:3'].map((asp) => (
                    <button
                      key={asp}
                      type="button"
                      onClick={() => applyAspect(asp)}
                      className={`p-1 rounded font-semibold text-[10px] capitalize cursor-pointer ${aspect === asp ? 'bg-orange-600 text-white' : `${t.controlBg} ${t.textMuted}`}`}
                    >
                      {asp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className={`${t.textMuted} font-bold block`}>Manual Box Alignment (%):</span>
                <div className="space-y-2 font-mono">
                  <div>
                    <div className={`flex justify-between text-[10px] mb-1 ${t.textFaint}`}>
                      <span>Left Offset (X):</span>
                      <span>{Math.round(cropBox.x)}%</span>
                    </div>
                    <input
                      type="range" min="0" max={100 - cropBox.w}
                      value={cropBox.x}
                      onChange={(e) => setCropBox(p => ({ ...p, x: Number(e.target.value) }))}
                      className="w-full accent-orange-500"
                    />
                  </div>
                  <div>
                    <div className={`flex justify-between text-[10px] mb-1 ${t.textFaint}`}>
                      <span>Top Offset (Y):</span>
                      <span>{Math.round(cropBox.y)}%</span>
                    </div>
                    <input
                      type="range" min="0" max={100 - cropBox.h}
                      value={cropBox.y}
                      onChange={(e) => setCropBox(p => ({ ...p, y: Number(e.target.value) }))}
                      className="w-full accent-orange-500"
                    />
                  </div>
                  <div>
                    <div className={`flex justify-between text-[10px] mb-1 ${t.textFaint}`}>
                      <span>Box Width:</span>
                      <span>{Math.round(cropBox.w)}%</span>
                    </div>
                    <input
                      type="range" min="10" max={100 - cropBox.x}
                      value={cropBox.w}
                      onChange={(e) => {
                        const newW = Number(e.target.value);
                        setCropBox(p => {
                          const newH = aspect !== 'free' ? newW / (aspect === '16:9' ? 16/9 : aspect === '4:3' ? 4/3 : aspect === '2:3' ? 2/3 : 1) : p.h;
                          return { ...p, w: newW, h: Math.min(newH, 100 - p.y) };
                        });
                      }}
                      className="w-full accent-orange-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCrop}
                className="w-full p-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Compile Crop Area</span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          {src ? (
            <div className={`border ${t.border} rounded-xl p-5 ${t.controlBg} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className={`text-[10px] font-bold ${t.textFaint} block uppercase font-mono mb-1`}>Crop Grid overlay:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 relative flex items-center justify-center select-none ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    <img 
                      ref={imgRef}
                      src={src} 
                      className="max-w-full max-h-full object-contain pointer-events-none" 
                      alt="Crop target" 
                    />
                    <div 
                      className="absolute border-2 border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.3)] pointer-events-none"
                      style={{
                        left: `${cropBox.x}%`,
                        top: `${cropBox.y}%`,
                        width: `${cropBox.w}%`,
                        height: `${cropBox.h}%`
                      }}
                    >
                      <div className="absolute top-0 left-0 bg-orange-500 text-[8px] px-1 font-mono text-white font-bold">Crop Box</div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono mb-1">Result Preview:</span>
                  <div className="aspect-square bg-[#111] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2">
                    {outUrl ? (
                      <img src={outUrl} className="max-w-full max-h-full object-contain" alt="Cropped output" />
                    ) : (
                      <p className={`text-center text-xs ${t.textFaint} px-4`}>Determine your coordinates and click "Compile Crop Area".</p>
                    )}
                  </div>
                </div>
              </div>

              {outUrl && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Crop Segment Cleared!</p>
                    <p className={`${t.textFaint} font-mono text-[10px]`}>Specifications: {previewSpec}</p>
                  </div>
                  <a
                    href={outUrl}
                    download={`cropped_${file?.name}`}
                    className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Crop File</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[300px]`}>
              <Crop className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Provide an image to activate custom spatial crop boundaries.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. IMAGE RESIZER
function ImageResizer({ isDark }: { isDark: boolean }) {
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

  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [quality, setQuality] = useState<number>(0.9);
  const [format, setFormat] = useState<string>('image/png');
  const [loading, setLoading] = useState<boolean>(false);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [specs, setSpecs] = useState<{ w: number; h: number; size: number } | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setSrc(url);
      setOutUrl(null);
      setSpecs(null);
      setFormat(f.type || 'image/png');

      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        setWidth(w);
        setHeight(h);
        setAspectRatio(w / h);
      };
      img.src = url;
    }
  };

  const changeWidth = (val: number) => {
    setWidth(val);
    if (lockRatio) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const changeHeight = (val: number) => {
    setHeight(val);
    if (lockRatio) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const quickResize = (factor: number) => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const origW = img.naturalWidth || img.width;
      const targetW = Math.round(origW * factor);
      changeWidth(targetW);
    };
    img.src = src;
  };

  const handleResize = () => {
    if (!src || !file) return;
    setLoading(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            if (outUrl) URL.revokeObjectURL(outUrl);
            setOutUrl(URL.createObjectURL(blob));
            setSpecs({ w: width, h: height, size: blob.size });
          }
          setLoading(false);
        }, format, quality);
      } else {
        setLoading(false);
      }
    };
    img.src = src;
  };

  const badgeClass = isDark
    ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    : 'bg-orange-50 text-orange-600 border-orange-200';

  return (
    <div className="space-y-6">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>IMAGE</span>
          Smart Image Resizer
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Modify output layout dimensions, configure strict aspect ratio parameters and reduce file heft offline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 text-xs">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} relative`}>
            <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className={`w-8 h-8 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Choose Image Source</p>
          </div>

          {file && (
            <div className={`${t.panelBg} rounded-xl p-4 space-y-4`}>
              <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                <div>
                  <label className={`${t.textMuted} block mb-1`}>Width (px):</label>
                  <input
                    type="number"
                    value={width === 0 ? '' : width}
                    onChange={(e) => changeWidth(Number(e.target.value))}
                    className={`w-full ${t.inputBg} p-2 rounded border ${t.border} focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`${t.textMuted} block mb-1`}>Height (px):</label>
                  <input
                    type="number"
                    value={height === 0 ? '' : height}
                    onChange={(e) => changeHeight(Number(e.target.value))}
                    className={`w-full ${t.inputBg} p-2 rounded border ${t.border} focus:outline-none`}
                  />
                </div>
              </div>

              <div className={`flex items-center gap-2 select-none text-[11px] ${t.textMuted}`}>
                <input
                  type="checkbox"
                  checked={lockRatio}
                  onChange={(e) => setLockRatio(e.target.checked)}
                  className="w-4 h-4 rounded accent-orange-500 cursor-pointer"
                  id="lock-ratio-checkbox"
                />
                <label htmlFor="lock-ratio-checkbox" className="cursor-pointer">Maintain Original Aspect Ratio</label>
              </div>

              <div className={`space-y-1.5 pt-1 border-t ${t.border}`}>
                <span className={`${t.textMuted} block`}>Quick Scale Scaling:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {[{ f: 0.25, l: '25%' }, { f: 0.5, l: '50%' }, { f: 0.75, l: '75%' }, { f: 0.9, l: '90%' }].map(it => (
                    <button
                      key={it.l}
                      type="button"
                      onClick={() => quickResize(it.f)}
                      className={`p-1 px-2.5 rounded ${t.controlBg} ${t.textMuted} hover:${t.heading} hover:bg-white/10 text-[10px] cursor-pointer`}
                    >
                      {it.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`space-y-2 border-t ${t.border} pt-3`}>
                <div>
                  <label className={`${t.textMuted} block mb-1`}>Format Output:</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className={`w-full p-2 ${t.selectBg} rounded text-xs focus:outline-none`}
                  >
                    <option value="image/png">Lossless PNG</option>
                    <option value="image/jpeg">Optimized JPEG</option>
                    <option value="image/webp">Next-Gen WebP</option>
                  </select>
                </div>

                {format !== 'image/png' && (
                  <div>
                    <div className={`flex justify-between mb-1 text-[10px] ${t.textMuted}`}>
                      <span>Quality:</span>
                      <span className="text-orange-400 font-bold">{Math.round(quality * 100)}%</span>
                    </div>
                    <input
                      type="range" min="0.1" max="1" step="0.05"
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full accent-orange-500"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleResize}
                disabled={loading}
                className="w-full p-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MoveHorizontal className="w-3.5 h-3.5" />}
                <span>Perform Resize</span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {src ? (
            <div className={`border ${t.border} rounded-xl p-5 ${t.controlBg} space-y-4`}>
              <span className={`text-[10px] font-bold ${t.textFaint} block uppercase font-mono`}>Image dimension preview:</span>
              <div className={`aspect-video rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-3 relative max-h-[300px] ${isDark ? "bg-[#141414]" : "bg-gray-100"}`}>
                <img src={src} className="max-w-full max-h-full object-contain" alt="Current visual" />
              </div>

              {specs && outUrl && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Rescaling finalized!</p>
                    <p className={`${t.textFaint} font-mono text-[10px] mt-0.5`}>Fidelity: {specs.w} × {specs.h} px • Target Weight: {formatSize(specs.size)}</p>
                  </div>
                  <a
                    href={outUrl}
                    download={`resized_${file?.name}`}
                    className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Resized Asset</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[300px]`}>
              <MoveHorizontal className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Provide an image to activate custom size parameters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. IMAGE CONVERTER (Universal Format Transformer)
function ImageConverter({ isDark }: { isDark: boolean }) {
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

  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [targetType, setTargetType] = useState<string>('image/png');
  const [quality, setQuality] = useState<number>(0.85);
  const [loading, setLoading] = useState<boolean>(false);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState<number | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setSrc(url);
      setOutUrl(null);
      setOutSize(null);
    }
  };

  const handleConvert = () => {
    if (!src || !file) return;
    setLoading(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            if (outUrl) URL.revokeObjectURL(outUrl);
            setOutUrl(URL.createObjectURL(blob));
            setOutSize(blob.size);
          }
          setLoading(false);
        }, targetType, quality);
      } else {
        setLoading(false);
      }
    };
    img.src = src;
  };

  const getFormatLabel = (mime: string) => {
    if (mime.includes('png')) return 'PNG';
    if (mime.includes('jpeg')) return 'JPEG/JPG';
    if (mime.includes('webp')) return 'WebP';
    return mime;
  };

  const badgeClass = isDark
    ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    : 'bg-orange-50 text-orange-600 border-orange-200';

  return (
    <div className="space-y-6">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>IMAGE</span>
          Universal Image Converter
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Perform on-device file migrations between PNG, JPEG, WebP and alternative graphics standards easily.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} relative`}>
            <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className={`w-8 h-8 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Choose Image Target</p>
          </div>

          {file && (
            <div className={`${t.panelBg} rounded-xl p-4 text-xs space-y-4 ${t.textMuted} font-sans`}>
              <div>
                <label className={`${t.textMuted} block mb-1`}>Target Format Output:</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                  className={`w-full p-2 ${t.selectBg} rounded text-xs focus:outline-none`}
                >
                  <option value="image/png">Lossless PNG Format</option>
                  <option value="image/jpeg">Standard JPEG Graphics</option>
                  <option value="image/webp">Next-Gen WebP Engine</option>
                </select>
              </div>

              {targetType !== 'image/png' && (
                <div>
                  <div className={`flex justify-between mb-1 text-[10px] ${t.textFaint}`}>
                    <span>Compression Level:</span>
                    <span className="text-orange-400 font-bold">{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0.1" max="1" step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleConvert}
                disabled={loading}
                className="w-full p-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Perform Convert</span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {src ? (
            <div className={`border ${t.border} rounded-xl p-4 ${t.controlBg} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className={`text-[10px] font-bold ${t.textFaint} block uppercase font-mono mb-1`}>Original Asset:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 ${isDark ? "bg-[#121212]" : "bg-gray-100"}`}>
                    <img src={src} className="max-w-full max-h-full object-contain" alt="Original asset" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono mb-1">Converted Preview:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 ${isDark ? "bg-[#121212]" : "bg-gray-100"}`}>
                    {outUrl ? (
                      <img src={outUrl} className="max-w-full max-h-full object-contain" alt="Output asset" />
                    ) : (
                      <p className={`text-xs ${t.textFaint} text-center px-4 self-center`}>Confirm format constraints and initiate conversion process.</p>
                    )}
                  </div>
                </div>
              </div>

              {outUrl && outSize && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Migration Complete!</p>
                    <p className={`${t.textFaint} font-mono text-[10px]`}>Origin: {formatSize(file?.size || 0)} • Result: {formatSize(outSize)} [{getFormatLabel(targetType)}]</p>
                  </div>
                  <a
                    href={outUrl}
                    download={`converted_${file?.name.replace(/\.[^/.]+$/, "")}.${targetType.split('/')[1]}`}
                    className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {getFormatLabel(targetType)}</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[300px]`}>
              <RefreshCw className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Supply any picture file to open format adjustment options.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 5. JPG TO PNG CONVERTER
function JpgToPngConverter({ isDark }: { isDark: boolean }) {
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

  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState<number | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setSrc(url);
      setOutUrl(null);
      setOutSize(null);
    }
  };

  const handleConvert = () => {
    if (!src || !file) return;
    setLoading(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            if (outUrl) URL.revokeObjectURL(outUrl);
            setOutUrl(URL.createObjectURL(blob));
            setOutSize(blob.size);
          }
          setLoading(false);
        }, 'image/png');
      } else {
        setLoading(false);
      }
    };
    img.src = src;
  };

  const badgeClass = isDark
    ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    : 'bg-orange-50 text-orange-600 border-orange-200';

  return (
    <div className="space-y-6">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>IMAGE</span>
          JPG to PNG Converter
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Convert single or batch JPEG/JPG images to clean, lossless, standard PNG files locally inside your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} relative`}>
            <input type="file" accept="image/jpeg, image/jpg" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className={`w-8 h-8 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Choose JPEG/JPG file</p>
          </div>

          {file && (
            <div className={`${t.panelBg} rounded-xl p-4 text-xs space-y-3`}>
              <div className={`${t.textMuted} font-mono text-[10px] space-y-1`}>
                <p className="truncate">Name: {file.name}</p>
                <p>Weight: {formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={handleConvert}
                disabled={loading}
                className="w-full p-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Convert to PNG</span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {src ? (
            <div className={`border ${t.border} rounded-xl p-4 ${t.controlBg} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className={`text-[10px] font-bold ${t.textFaint} block uppercase font-mono`}>JPG Target:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px] ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    <img src={src} className="max-w-full max-h-full object-contain" alt="Original JPG" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">PNG Output:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px] ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    {outUrl ? (
                      <img src={outUrl} className="max-w-full max-h-full object-contain" alt="Lossless PNG" />
                    ) : (
                      <p className={`text-xs ${t.textFaint} text-center self-center px-4`}>Initiate translation to obtain transparent lossless alpha output.</p>
                    )}
                  </div>
                </div>
              </div>

              {outUrl && outSize && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Translation finished!</p>
                    <p className={`${t.textFaint} font-mono text-[10px]`}>JPG: {formatSize(file?.size || 0)} • PNG Output: {formatSize(outSize)}</p>
                  </div>
                  <a
                    href={outUrl}
                    download={`${file?.name.replace(/\.[^/.]+$/, "")}.png`}
                    className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[280px]`}>
              <FileImage className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Open any standard `.jpg` or `.jpeg` file to convert.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 6. JPG CONVERTER
function JpgConverter({ isDark }: { isDark: boolean }) {
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

  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [fillColor, setFillColor] = useState<string>('#ffffff');
  const [quality, setQuality] = useState<number>(0.85);
  const [loading, setLoading] = useState<boolean>(false);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState<number | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setSrc(url);
      setOutUrl(null);
      setOutSize(null);
    }
  };

  const handleConvert = () => {
    if (!src || !file) return;
    setLoading(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            if (outUrl) URL.revokeObjectURL(outUrl);
            setOutUrl(URL.createObjectURL(blob));
            setOutSize(blob.size);
          }
          setLoading(false);
        }, 'image/jpeg', quality);
      } else {
        setLoading(false);
      }
    };
    img.src = src;
  };

  const badgeClass = isDark
    ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    : 'bg-orange-50 text-orange-600 border-orange-200';

  return (
    <div className="space-y-6">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>IMAGE</span>
          Universal JPG/JPEG Compiler
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Convert WebP, PNG, BMP, or SVG visuals into space-optimized JPEG/JPG graphics with customizable opacity fill.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 text-xs">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} relative`}>
            <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className={`w-8 h-8 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Choose Image input</p>
          </div>

          {file && (
            <div className={`${t.panelBg} rounded-xl p-4 space-y-4 ${t.textMuted} font-sans`}>
              <div>
                <label className={`${t.textMuted} block mb-1`}>Fill Alphas Background:</label>
                <select
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className={`w-full p-2 ${t.selectBg} rounded text-xs focus:outline-none`}
                >
                  <option value="#ffffff">Plain White Canvas Fill</option>
                  <option value="#000000">Plain Black Canvas Fill</option>
                  <option value="#f3f4f6">Light Gray Canvas Fill</option>
                </select>
              </div>

              <div>
                <div className={`flex justify-between mb-1 text-[10px] ${t.textFaint}`}>
                  <span>JPG Quality Coefficient:</span>
                  <span className="text-orange-400 font-bold">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range" min="0.1" max="1" step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <button
                type="button"
                onClick={handleConvert}
                disabled={loading}
                className="w-full p-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Export JPG File</span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {src ? (
            <div className={`border ${t.border} rounded-xl p-4 ${t.controlBg} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className={`text-[10px] font-bold ${t.textFaint} block uppercase font-mono`}>Original visual:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px] ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    <img src={src} className="max-w-full max-h-full object-contain" alt="Original visual" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">Estimated JPG:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px] ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    {outUrl ? (
                      <img src={outUrl} className="max-w-full max-h-full object-contain" alt="Finished JPG" />
                    ) : (
                      <p className={`text-xs ${t.textFaint} text-center self-center px-4 border border-dashed border-white/5 h-20 flex items-center justify-center`}>Fill alphas & click "Export JPG File"</p>
                    )}
                  </div>
                </div>
              </div>

              {outUrl && outSize && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Successfully constructed JPG!</p>
                    <p className={`${t.textFaint} font-mono text-[10px]`}>Orig Size: {formatSize(file?.size || 0)} • Result JPG: {formatSize(outSize)}</p>
                  </div>
                  <a
                    href={outUrl}
                    download={`${file?.name.replace(/\.[^/.]+$/, "")}_compiled.jpg`}
                    className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JPG</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[280px]`}>
              <FileImage className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Import graphics to perform standardized JPG translations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 7. WEBP TO JPG CONVERTER
function WebpToJpgConverter({ isDark }: { isDark: boolean }) {
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

  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.85);
  const [loading, setLoading] = useState<boolean>(false);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState<number | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (src) URL.revokeObjectURL(src);
      if (outUrl) URL.revokeObjectURL(outUrl);
      setFile(f);
      setSrc(URL.createObjectURL(f));
      setOutUrl(null);
      setOutSize(null);
    }
  };

  const handleConvert = () => {
    if (!src || !file) return;
    setLoading(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            setOutUrl(URL.createObjectURL(blob));
            setOutSize(blob.size);
          }
          setLoading(false);
        }, 'image/jpeg', quality);
      } else {
        setLoading(false);
      }
    };
    img.src = src;
  };

  const badgeClass = isDark
    ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    : 'bg-orange-50 text-orange-600 border-orange-200';

  return (
    <div className="space-y-6">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>IMAGE</span>
          WebP to JPG Web Converter
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Decode optimized modern WebP assets back down to high-compatibility standard JPEG format offline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 text-xs">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} relative`}>
            <input type="file" accept="image/webp" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className={`w-8 h-8 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Choose `.webp` format file</p>
          </div>

          {file && (
            <div className={`${t.panelBg} rounded-xl p-4 space-y-4 ${t.textMuted} font-sans`}>
              <div>
                <div className={`flex justify-between mb-1 text-[10px] ${t.textFaint}`}>
                  <span>Compression Quality:</span>
                  <span className="text-orange-400 font-bold">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range" min="0.1" max="1" step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <button
                type="button"
                onClick={handleConvert}
                disabled={loading}
                className="w-full p-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer font-sans"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Perform Decode</span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {src ? (
            <div className={`border ${t.border} rounded-xl p-4 ${t.controlBg} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className={`text-[10px] font-bold ${t.textFaint} block uppercase font-mono`}>WebP input:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px] ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    <img src={src} className="max-w-full max-h-full object-contain" alt="Original WebP" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">JPEG output:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px] ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    {outUrl ? (
                      <img src={outUrl} className="max-w-full max-h-full object-contain" alt="Converted JPEG" />
                    ) : (
                      <p className={`text-xs ${t.textFaint} text-center self-center px-4`}>Click "Perform Decode" to compile JPEG.</p>
                    )}
                  </div>
                </div>
              </div>

              {outUrl && outSize && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20 font-sans">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Successfully decoded WebP image!</p>
                    <p className={`${t.textFaint} font-mono text-[10px]`}>Origin WebP: {formatSize(file?.size || 0)} • Result JPG: {formatSize(outSize)}</p>
                  </div>
                  <a
                    href={outUrl}
                    download={`${file?.name.replace(/\.[^/.]+$/, "")}.jpg`}
                    className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JPG</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[285px]`}>
              <FileImage className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Supply `.webp` file format inputs to decode.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 8. PNG TO JPG CONVERTER
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
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [originalSpec, setOriginalSpec] = useState<{ width: number; height: number; size: number } | null>(null);
  const [convertedSpec, setConvertedSpec] = useState<{ size: number } | null>(null);
  const [compressionQuality, setCompressionQuality] = useState<number>(0.85);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
      setSelectedFile(file);
      setConvertedUrl(null);
      setConvertedSpec(null);
      
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);

      const img = new Image();
      img.onload = () => {
        setOriginalSpec({
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          size: file.size
        });
      };
      img.src = url;
    }
  };

  const handleConvert = () => {
    if (!selectedFile || !originalUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width || 800;
      canvas.height = img.naturalHeight || img.height || 600;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            if (convertedUrl) URL.revokeObjectURL(convertedUrl);
            setConvertedUrl(URL.createObjectURL(blob));
            setConvertedSpec({ size: blob.size });
          }
          setIsProcessing(false);
        }, 'image/jpeg', compressionQuality);
      } else {
        setIsProcessing(false);
      }
    };
    img.src = originalUrl;
  };

  const savedPercent = originalSpec && convertedSpec ? Math.max(0, Math.round(((originalSpec.size - convertedSpec.size) / originalSpec.size) * 100)) : 0;

  const badgeClass = isDark
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>IMAGE</span>
          PNG to JPG Image Converter
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Convert PNG files to high compatibility JPG format offline with zero cloud server processing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="space-y-4">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} relative`}>
            <input type="file" accept="image/png" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className={`w-8 h-8 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Choose PNG target</p>
          </div>

          {selectedFile && originalSpec && (
            <div className={`${t.panelBg} rounded-xl p-4 text-xs space-y-4 ${t.textMuted}`}>
              <div className="space-y-1.5 font-mono text-[10px]">
                <p className="truncate"><span className={`${t.textFaint} font-sans`}>File Name:</span> {selectedFile.name}</p>
                <p><span className={`${t.textFaint} font-sans`}>Input Weight:</span> {formatSize(originalSpec.size)}</p>
                <p><span className={`${t.textFaint} font-sans`}>Layout bounds:</span> {originalSpec.width} × {originalSpec.height} px</p>
              </div>

              <div className={`space-y-2 border-t pt-3 ${isDark ? "border-white/5" : "border-gray-200"}`}>
                <div className={`flex justify-between items-center text-[10px] ${t.textFaint}`}>
                  <span>JPG Output Quality:</span>
                  <span className="text-orange-400 font-bold">{Math.round(compressionQuality * 100)}%</span>
                </div>
                <input
                  type="range" min="0.10" max="1.00" step="0.05"
                  value={compressionQuality}
                  onChange={(e) => setCompressionQuality(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full p-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Perform Conversion</span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedFile ? (
            <div className={`border ${t.border} rounded-xl p-4 ${t.controlBg} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className={`text-[10px] font-bold ${t.textFaint} block uppercase font-mono`}>PNG target:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px] ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    <img src={originalUrl || ''} className="max-w-full max-h-full object-contain" alt="Original PNG" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">JPG converted:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px] ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    {convertedUrl ? (
                      <img src={convertedUrl} className="max-w-full max-h-full object-contain" alt="Converted JPG" />
                    ) : (
                      <p className={`text-xs ${t.textFaint} text-center self-center px-4 h-20 flex items-center`}>Click "Perform Conversion" to render JPEG.</p>
                    )}
                  </div>
                </div>
              </div>

              {convertedUrl && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Successfully compressed PNG!</p>
                    <p className={`${t.textFaint} font-mono text-[10px] mt-0.5`}>Origin PNG: {originalSpec ? formatSize(originalSpec.size) : ''} • Output JPG: {convertedSpec ? formatSize(convertedSpec.size) : ''} [Minimized {savedPercent}%]</p>
                  </div>
                  <a
                    href={convertedUrl}
                    download={`${selectedFile?.name.replace(/\.[^/.]+$/, "")}.jpg`}
                    className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JPG</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[280px]`}>
              <FileImage className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Provide standard `.png` inputs to convert.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 9. ICO TO PNG CONVERTER
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
        <p className={`text-sm ${t.textMuted}`}>Extract high-resolution transparent PNG images from Windows `.ico` icons entirely within your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} hover:border-indigo-500/30 transition-all relative`}>
            <input type="file" accept=".ico" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            <UploadCloud className={`w-10 h-10 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Choose or drop an ICO file</p>
          </div>

          {selectedFile && (
            <div className={`${t.panelBg} rounded-xl p-4 text-xs space-y-4 ${t.textMuted}`}>
              <div className="space-y-1.5 font-sans">
                <p className="truncate"><span className={t.textFaint}>Filename:</span> {selectedFile.name}</p>
                <p><span className={t.textFaint}>Size:</span> {formatSize(selectedFile.size)}</p>
                {dimensions && (
                  <p><span className={t.textFaint}>Dimensions:</span> {dimensions.width} x {dimensions.height} px</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className={`${t.textMuted} block font-bold`}>Resize Option:</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className={`w-full p-2 ${t.selectBg} rounded focus:outline-none`}
                >
                  <option value="original">Original Size (Embedded)</option>
                  <option value="256">256 x 256 px</option>
                  <option value="128">128 x 128 px</option>
                  <option value="64">64 x 64 px</option>
                  <option value="48">48 x 48 px</option>
                  <option value="32">32 x 32 px</option>
                  <option value="16">16 x 16 px</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full p-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isConverting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Extract PNG</span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {!selectedFile ? (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[280px]`}>
              <FileImage className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Select an `.ico` image file to extract transparent PNG visual frames.</p>
            </div>
          ) : (
            <div className={`border ${t.border} rounded-xl p-4 ${t.controlBg} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className={`text-[10px] font-bold ${t.textFaint} block uppercase font-mono`}>Source ICO:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px] ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    <img src={originalUrl || ''} className="max-w-full max-h-full object-contain" alt="Original ICO" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">Extracted PNG:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px] ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    {convertedUrl ? (
                      <img src={convertedUrl} className="max-w-full max-h-full object-contain" alt="Extracted PNG" />
                    ) : (
                      <p className={`text-xs ${t.textFaint} text-center self-center px-4 h-20 flex items-center`}>Click "Extract PNG" to compute output.</p>
                    )}
                  </div>
                </div>
              </div>

              {convertedUrl && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20 font-sans">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Extraction finalized successfully!</p>
                    <p className={`${t.textFaint} font-mono text-[10px] mt-0.5`}>Alpha transparent frames preserved completely.</p>
                  </div>
                  <a
                    href={convertedUrl}
                    download={`${selectedFile.name.replace(/\.[^/.]+$/, "")}_extracted.png`}
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
    </div>
  );
}

// 10. ICO CONVERTER COMPONENT (PNG/JPG to ICO compilations)
function IcoConverterComponent({ isDark }: { isDark: boolean }) {
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
  const [src, setSrc] = useState<string | null>(null);
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
  const [loading, setLoading] = useState<boolean>(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setSelectedFile(f);
      setIcoBlob(null);
      if (icoUrl) URL.revokeObjectURL(icoUrl);
      setIcoUrl(null);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setSrc(event.target.result as string);
      };
      reader.readAsDataURL(f);
    }
  };

  const toggleSize = (s: number) => {
    setSizes({ ...sizes, [s]: !sizes[s] });
  };

  const handlePack = async () => {
    if (!src) return;
    const activeSizes = Object.keys(sizes).map(Number).filter(k => sizes[k]);
    if (activeSizes.length === 0) {
      alert("Choose at least one size format!");
      return;
    }

    setLoading(true);
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

        const pngBuffers: ArrayBuffer[] = [];
        const sizesMeta: { w: number; h: number }[] = [];
        for (const canvas of canvases) {
          const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'));
          if (blob) {
            const buf = await blob.arrayBuffer();
            pngBuffers.push(buf);
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

        const compiled = new Blob([headerBuffer, ...pngBuffers], { type: 'image/x-icon' });
        setIcoBlob(compiled);
        if (icoUrl) URL.revokeObjectURL(icoUrl);
        setIcoUrl(URL.createObjectURL(compiled));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    img.src = src;
  };

  const badgeClass = isDark
    ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    : 'bg-orange-50 text-orange-600 border-orange-200';

  return (
    <div className="space-y-6">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>IMAGE</span>
          Universal ICO Compiler
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Compile smart multi-resolution Windows `.ico` icons or browser favicons.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="space-y-4">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} relative`}>
            <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className={`w-8 h-8 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Choose custom picture</p>
          </div>

          {selectedFile && (
            <div className={`${t.panelBg} rounded-xl p-4 text-xs space-y-4 ${t.textMuted}`}>
              <div className="space-y-1">
                <span className={`${t.textMuted} block font-bold`}>Check active sizes:</span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                  {[16, 32, 48, 64, 128, 256].map(s => (
                    <label key={s} className={`flex items-center gap-1.5 p-1 px-2 ${t.controlBg} rounded cursor-pointer leading-none`}>
                      <input type="checkbox" checked={sizes[s]} onChange={() => toggleSize(s)} className="accent-orange-500" />
                      <span>{s} × {s} px</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handlePack}
                disabled={loading}
                className="w-full p-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer font-sans"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Compile Multi-ICO</span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {src ? (
            <div className={`border ${t.border} rounded-xl p-4 ${t.controlBg} space-y-4`}>
              <span className={`text-[10px] font-bold ${t.textFaint} block uppercase font-mono`}>Source input image:</span>
              <div className={`aspect-video rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px] ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                <img src={src} className="max-w-full max-h-full object-contain" alt="Original visual" />
              </div>

              {icoUrl && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">ICO bundle successfully generated!</p>
                    <p className={`${t.textFaint} font-mono text-[10px] mt-0.5`}>Size weight: {icoBlob ? formatSize(icoBlob.size) : 'Calculated'}</p>
                  </div>
                  <a
                    href={icoUrl}
                    download={`${selectedFile?.name.replace(/\.[^/.]+$/, "")}.ico`}
                    className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Multi-ICO</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[280px]`}>
              <FileImage className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Supply a high-resolution transparent picture target to compile ICO.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 11. IMAGE TO BASE64
function ImageToBase64({ isDark, onCopy, copiedStatus }: { isDark: boolean; onCopy: (text: string, id: string) => void, copiedStatus: string | null }) {
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

  const [file, setFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'datauri' | 'raw' | 'html' | 'css'>('datauri');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setBase64String(event.target.result as string);
      };
      reader.readAsDataURL(f);
    }
  };

  const getOutputText = () => {
    if (!base64String) return '';
    const raw = base64String.split(',')[1] || '';
    switch (activeTab) {
      case 'raw': return raw;
      case 'html': return `<img src="${base64String}" alt="${file?.name || 'Base64 asset'}" />`;
      case 'css': return `background-image: url("${base64String}");`;
      case 'datauri':
      default: return base64String;
    }
  };

  const outputString = getOutputText();

  const badgeClass = isDark
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>CONVERTER</span>
          Image to Base64 Code
        </h2>
        <p className={`text-sm ${t.textMuted} font-sans`}>Translate custom image files into layout-safe Base64 strings or standard inline stylesheet schemes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="space-y-4">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} relative`}>
            <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className={`w-8 h-8 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Choose picture file</p>
          </div>

          {file && (
            <div className={`${t.panelBg} rounded-xl p-4 text-xs space-y-2 ${t.textMuted} font-mono`}>
              <p className="truncate"><span className={`font-sans ${t.textFaint} font-bold block`}>Filename:</span> {file.name}</p>
              <p><span className={`font-sans ${t.textFaint} font-bold block`}>Size:</span> {formatSize(file.size)}</p>
              <p><span className={`font-sans ${t.textFaint} font-bold block`}>Base64 length:</span> {base64String.length.toLocaleString()} chars</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {file ? (
            <div className={`border ${t.border} rounded-xl p-4 ${t.controlBg} space-y-4`}>
              <div className={`flex flex-wrap gap-1 border-b pb-2 ${isDark ? "border-white/5" : "border-gray-200"}`}>
                {[
                  { id: 'datauri', label: 'Data URI' },
                  { id: 'raw', label: 'Raw Base64' },
                  { id: 'html', label: 'HTML Tag' },
                  { id: 'css', label: 'CSS Background' }
                ].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => setActiveTab(tb.id as any)}
                    className={`p-1.5 px-3 rounded text-xs font-bold cursor-pointer transition-all ${activeTab === tb.id ? 'bg-orange-600 text-white' : `${t.textMuted} hover:${t.heading}`}`}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div className={`flex justify-between items-center text-xs ${t.textMuted} font-mono`}>
                  <span>OUTFLOW STRING:</span>
                  {outputString && (
                    <button
                      type="button"
                      onClick={() => onCopy(outputString, 'b64')}
                      className="text-xs hover:text-orange-400 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedStatus === 'b64' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Code</span>
                    </button>
                  )}
                </div>
                <textarea
                  readOnly
                  className={`w-full h-48 p-3 ${t.outputBg} text-indigo-300 font-mono text-[10px] rounded border ${t.border} focus:outline-none resize-none break-all`}
                  value={outputString}
                />
              </div>
            </div>
          ) : (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[280px]`}>
              <Code className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Provide an image asset to translate into inline-safe Base64 representation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 12. BASE64 TO IMAGE
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

  const [inputStr, setInputStr] = useState<string>('');
  const [src, setSrc] = useState<string | null>(null);
  const [mime, setMime] = useState<string>('image/png');
  const [err, setErr] = useState<string | null>(null);

  const handleDecode = () => {
    setErr(null);
    const cleaned = inputStr.trim().replace(/\s/g, '');
    if (!cleaned) {
      setSrc(null);
      return;
    }

    if (cleaned.startsWith('data:image/')) {
      const match = cleaned.match(/^data:(image\/[^;]+);base64,/);
      if (match) {
        setMime(match[1]);
        setSrc(cleaned);
        return;
      }
    }

    try {
      window.atob(cleaned.replace(/^data:image\/[a-z]+;base64,/, ''));
      let guessedMime = 'image/png';
      if (cleaned.startsWith('iVBORw0KGgo')) guessedMime = 'image/png';
      else if (cleaned.startsWith('/9j/')) guessedMime = 'image/jpeg';
      else if (cleaned.startsWith('UklGR')) guessedMime = 'image/webp';

      setMime(guessedMime);
      setSrc(`data:${guessedMime};base64,${cleaned}`);
    } catch {
      setErr("Failed to decode. Verify the string provided matches base64 formatting.");
      setSrc(null);
    }
  };

  const badgeClass = isDark
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>DECODER</span>
          Base64 to Image Decoder
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Decode alphanumeric representation strings back into downloadable visual formats.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="space-y-4 text-xs">
          <div className={`${t.panelBg} rounded-xl p-4 space-y-3`}>
            <span className={`${t.textMuted} block font-bold`}>Mime constraints:</span>
            <div className={`p-2.5 ${t.controlBg} rounded font-mono text-indigo-400 font-bold border ${t.border}`}>{mime}</div>
            <button
              type="button"
              onClick={handleDecode}
              className="w-full p-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Decode & Display</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <textarea
            className={`w-full h-40 p-3 ${t.textareaBg} font-mono text-[11px] rounded focus:outline-none focus:border-orange-500 resize-none`}
            placeholder="Paste your base64 code string here (raw or Data-URI)..."
            value={inputStr}
            onChange={(e) => setInputStr(e.target.value)}
          />

          {err && <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded">{err}</div>}

          {src && (
            <div className={`border ${t.border} rounded-xl p-4 ${t.controlBg} space-y-4`}>
              <span className={`text-xs font-mono text-orange-400 font-bold block`}>Render Decoded:</span>
              <div className={`aspect-video rounded border flex items-center justify-center p-3 max-h-[250px] ${isDark ? "bg-[#101010] border-white/5" : "bg-gray-100 border-gray-200"}`}>
                <img src={src} className="max-w-full max-h-full object-contain" alt="Decoded visualization" />
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                <span className="text-xs text-indigo-200 font-bold">Base64 translated correctly!</span>
                <a
                  href={src}
                  download={`decoded_base64.${mime.split('/')[1]}`}
                  className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded text-xs cursor-pointer transition-all flex items-center justify-center gap-1 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Graphic</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 13. FLIP & ROTATE IMAGE
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

  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [rotation, setRotation] = useState<number>(0);
  const [outUrl, setOutUrl] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setSrc(url);
      setFlipH(false);
      setFlipV(false);
      setRotation(0);
      setOutUrl(null);
    }
  };

  const handleTransform = () => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const is90or270 = (rotation % 180) === 90;
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const targetW = is90or270 ? h : w;
      const targetH = is90or270 ? w : h;

      canvas.width = targetW;
      canvas.height = targetH;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);

      canvas.toBlob((blob) => {
        if (blob) {
          if (outUrl) URL.revokeObjectURL(outUrl);
          setOutUrl(URL.createObjectURL(blob));
        }
      }, file?.type || 'image/png');
    };
    img.src = src;
  };

  useEffect(() => {
    if (src) handleTransform();
  }, [flipH, flipV, rotation, src]);

  const badgeClass = isDark
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>IMAGE</span>
          Flip & Rotate Image
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Instantly mirror images horizontally, vertically, or spin by custom degrees with instant previews.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-xs">
        <div className="space-y-4">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} relative`}>
            <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className={`w-8 h-8 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Choose picture file</p>
          </div>

          {file && (
            <div className={`${t.panelBg} rounded-xl p-4 space-y-4 ${t.textMuted}`}>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFlipH(p => !p)}
                  className={`flex-1 p-2 rounded font-bold cursor-pointer transition-all ${flipH ? 'bg-orange-600 text-white' : `${t.controlBg} ${t.textMuted}`}`}
                >
                  Flip Horizontal
                </button>
                <button
                  type="button"
                  onClick={() => setFlipV(p => !p)}
                  className={`flex-1 p-2 rounded font-bold cursor-pointer transition-all ${flipV ? 'bg-orange-600 text-white' : `${t.controlBg} ${t.textMuted}`}`}
                >
                  Flip Vertical
                </button>
              </div>

              <div className={`space-y-2 pt-2 border-t ${t.border}`}>
                <div className={`flex justify-between text-[10px] ${t.textFaint}`}>
                  <span>Rotate Degrees:</span>
                  <span className="font-bold text-orange-400">{rotation}°</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
                  {[0, 90, 180, 270].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setRotation(d)}
                      className={`p-1.5 rounded font-bold text-center cursor-pointer ${rotation === d ? 'bg-orange-600 text-white' : `${t.controlBg} ${t.textMuted}`}`}
                    >
                      {d}°
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {src ? (
            <div className={`border ${t.border} rounded-xl p-4 ${t.controlBg} space-y-4`}>
              <span className={`text-[10px] font-bold ${t.textFaint} block uppercase font-mono`}>Orientation view:</span>
              <div className={`aspect-video rounded border flex items-center justify-center p-3 relative max-h-[300px] ${isDark ? "bg-[#101010] border-white/5" : "bg-gray-100 border-gray-200"}`}>
                {outUrl ? (
                  <img src={outUrl} className="max-w-full max-h-full object-contain" alt="Render" />
                ) : (
                  <img src={src} className="max-w-full max-h-full object-contain" alt="Target" />
                )}
              </div>

              {outUrl && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <span className="text-xs text-indigo-200 font-bold">Transformations mapped correctly.</span>
                  <a
                    href={outUrl}
                    download={`flipped_${file?.name}`}
                    className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded text-xs cursor-pointer transition-all flex items-center justify-center gap-1 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Transformed</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[280px]`}>
              <RotateCw className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Provide an image to activate pivot/symmetry tools.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 14. WEBP TO JPG COMPLIANT DECODER CONVERTER DEFINITION FOR EXCELLENCE
function WebpToWebpDecoder() {
  return <WebpToJpgConverter isDark={false} />; // won't be used directly
}

// Map alias Webp to Webp
function WebpToWebpDecoderEnlist() {
  return <WebpToJpgConverter isDark={false} />;
}

// Alias mapping for final export
function WebpToJpgConverterAlias() {
  return <WebpToJpgConverter isDark={false} />;
}

// ==========================================
// CUSTOM BMP BITMAP COMPILER HELPER (32-BIT RGBA WITH ZERO LOSS)
// ==========================================
function canvasToBmp(canvas: HTMLCanvasElement): Blob {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas layout context');

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const fileHeaderSize = 14;
  const infoHeaderSize = 40;
  const pixelDataSize = width * height * 4;
  const fileSize = fileHeaderSize + infoHeaderSize + pixelDataSize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  // File Header
  view.setUint16(0, 0x424D, false); // BM
  view.setUint32(2, fileSize, true);
  view.setUint16(6, 0, true);
  view.setUint16(8, 0, true);
  view.setUint32(10, fileHeaderSize + infoHeaderSize, true);

  // Info Header
  view.setUint32(14, infoHeaderSize, true);
  view.setUint32(18, width, true);
  view.setUint32(22, -height, true); // Top-down
  view.setUint16(26, 1, true);
  view.setUint16(28, 32, true); // 32-bit pixel depth (BGRA)
  view.setUint32(30, 0, true); // compression: uncompressed BI_RGB
  view.setUint32(34, pixelDataSize, true);
  view.setUint32(38, 2835, true);
  view.setUint32(42, 2835, true);
  view.setUint32(46, 0, true);
  view.setUint32(50, 0, true);

  // Write pixel bytes (Canvas RGBA -> BMP BGRA)
  let offset = 54;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    view.setUint8(offset, b);
    view.setUint8(offset + 1, g);
    view.setUint8(offset + 2, r);
    view.setUint8(offset + 3, a);
    offset += 4;
  }

  return new Blob([buffer], { type: 'image/bmp' });
}

// ==========================================
// MULTI-RESOLUTION WINDOWS ICO PACKAGER HELPER
// ==========================================
async function generateIcoBlob(img: HTMLImageElement, sizesToPack: number[]): Promise<Blob> {
  const canvases: HTMLCanvasElement[] = [];
  for (const size of sizesToPack) {
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

  const pngBuffers: ArrayBuffer[] = [];
  const sizesMeta: { w: number; h: number }[] = [];
  for (const canvas of canvases) {
    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'));
    if (blob) {
      const buf = await blob.arrayBuffer();
      pngBuffers.push(buf);
      sizesMeta.push({ w: canvas.width, h: canvas.height });
    }
  }

  const imageCount = pngBuffers.length;
  if (imageCount === 0) {
    throw new Error('No icons were processed successfully');
  }

  const headerSize = 6;
  const directorySize = 16 * imageCount;
  const totalHeaderSize = headerSize + directorySize;
  const headerBuffer = new ArrayBuffer(totalHeaderSize);
  const view = new DataView(headerBuffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true); // type ico is 1
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
}

// Helper formats extractor definition
const getFormatMetadata = (id: string) => {
  switch (id) {
    case 'png-to-webp':
      return { source: 'PNG', target: 'WebP', accept: '.png', ext: '.webp', mime: 'image/webp' };
    case 'png-to-bmp':
      return { source: 'PNG', target: 'BMP', accept: '.png', ext: '.bmp', mime: 'image/bmp' };
    case 'png-to-gif':
      return { source: 'PNG', target: 'GIF', accept: '.png', ext: '.gif', mime: 'image/gif' };
    case 'png-to-ico':
      return { source: 'PNG', target: 'ICO', accept: '.png', ext: '.ico', mime: 'image/x-icon' };
    case 'jpg-to-webp':
      return { source: 'JPG', target: 'WebP', accept: '.jpg,.jpeg', ext: '.webp', mime: 'image/webp' };
    case 'jpg-to-bmp':
      return { source: 'JPG', target: 'BMP', accept: '.jpg,.jpeg', ext: '.bmp', mime: 'image/bmp' };
    case 'jpg-to-gif':
      return { source: 'JPG', target: 'GIF', accept: '.jpg,.jpeg', ext: '.gif', mime: 'image/gif' };
    case 'jpg-to-ico':
      return { source: 'JPG', target: 'ICO', accept: '.jpg,.jpeg', ext: '.ico', mime: 'image/x-icon' };
    case 'webp-to-png':
      return { source: 'WebP', target: 'PNG', accept: '.webp', ext: '.png', mime: 'image/png' };
    default:
      return { source: 'Image', target: 'PNG', accept: 'image/*', ext: '.png', mime: 'image/png' };
  }
};

// ==========================================
// 15. DYNAMIC DIRECT PAIR CONVERTER COMPONENT
// ==========================================
function DirectPairConverter({ isDark, toolId }: { isDark: boolean; toolId: string }) {
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
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [originalSpec, setOriginalSpec] = useState<{ width: number; height: number; size: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState<number>(0.85);
  
  const [bgFill, setBgFill] = useState<string>('transparent');
  const [icoSizes, setIcoSizes] = useState<{ [key: number]: boolean }>({
    16: true,
    32: true,
    48: true,
    64: false,
    128: false,
    256: true
  });

  const meta = getFormatMetadata(toolId);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    };
  }, [originalUrl, convertedUrl]);

  useEffect(() => {
    setSelectedFile(null);
    setConvertedUrl(null);
    setConvertedBlob(null);
    setOriginalSpec(null);
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
      setOriginalUrl(null);
    }
  }, [toolId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
      setConvertedUrl(null);
      setConvertedBlob(null);
      setSelectedFile(file);
      
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);

      const img = new Image();
      img.onload = () => {
        setOriginalSpec({
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          size: file.size
        });
      };
      img.src = url;
    }
  };

  const handleConvert = () => {
    if (!selectedFile || !originalUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        const w = img.naturalWidth || img.width || 800;
        const h = img.naturalHeight || img.height || 600;
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        if (bgFill !== 'transparent') {
          ctx.fillStyle = bgFill;
          ctx.fillRect(0, 0, w, h);
        } else {
          ctx.clearRect(0, 0, w, h);
        }

        ctx.drawImage(img, 0, 0);

        if (meta.target === 'BMP') {
          const blob = canvasToBmp(canvas);
          setConvertedBlob(blob);
          if (convertedUrl) URL.revokeObjectURL(convertedUrl);
          setConvertedUrl(URL.createObjectURL(blob));
          setIsProcessing(false);
        } else if (meta.target === 'ICO') {
          const activeSizes = Object.keys(icoSizes).map(Number).filter(k => icoSizes[k]);
          if (activeSizes.length === 0) {
            alert("Choose at least one sizing resolution for the ICO compiler!");
            setIsProcessing(false);
            return;
          }
          const blob = await generateIcoBlob(img, activeSizes);
          setConvertedBlob(blob);
          if (convertedUrl) URL.revokeObjectURL(convertedUrl);
          setConvertedUrl(URL.createObjectURL(blob));
          setIsProcessing(false);
        } else {
          canvas.toBlob((blob) => {
            if (blob) {
              setConvertedBlob(blob);
              if (convertedUrl) URL.revokeObjectURL(convertedUrl);
              setConvertedUrl(URL.createObjectURL(blob));
            }
            setIsProcessing(false);
          }, meta.mime, meta.target === 'WebP' ? quality : undefined);
        }
      } catch (e) {
        console.error("Layout packaging error:", e);
        setIsProcessing(false);
      }
    };
    img.src = originalUrl;
  };

  const toggleSizeOption = (s: number) => {
    setIcoSizes(prev => ({ ...prev, [s]: !prev[s] }));
  };

  const getOutputDownloadName = () => {
    const baseName = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "image";
    return `${baseName}${meta.ext}`;
  };

  const isSavingBytes = originalSpec && convertedBlob && originalSpec.size > convertedBlob.size;
  const savedPercent = originalSpec && convertedBlob 
    ? Math.max(0, Math.round(((originalSpec.size - convertedBlob.size) / originalSpec.size) * 100))
    : 0;

  const badgeClass = isDark
    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    : 'bg-indigo-50 text-indigo-600 border-indigo-200';

  return (
    <div className="space-y-6">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>IMAGE CRAFT</span>
          {meta.source} to {meta.target} Converter
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Perform direct offline {meta.source} image conversion to standard {meta.target} assets in one tap.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="space-y-4">
          <div className={`border border-dashed ${t.border} rounded-xl p-5 text-center ${t.controlBg} hover:border-indigo-500/20 transition-all relative`}>
            <input 
              type="file" 
              accept={meta.accept} 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" 
            />
            <UploadCloud className={`w-8 h-8 mx-auto ${t.textFaint} mb-2 pointer-events-none`} />
            <p className={`text-xs font-bold ${t.textMuted}`}>Choose custom {meta.source} target</p>
          </div>

          {selectedFile && originalSpec && (
            <div className={`${t.panelBg} rounded-xl p-4 text-xs space-y-4 ${t.textMuted}`}>
              <div className={`space-y-1.5 font-mono text-[10px] pb-3 border-b ${isDark ? "border-white/5" : "border-gray-200"}`}>
                <p className="truncate"><span className={`${t.textFaint} font-sans`}>File Name:</span> {selectedFile.name}</p>
                <p><span className={`${t.textFaint} font-sans`}>Input Weight:</span> {formatSize(originalSpec.size)}</p>
                <p><span className={`${t.textFaint} font-sans`}>Format Type:</span> {meta.source}</p>
                <p><span className={`${t.textFaint} font-sans`}>Resolution:</span> {originalSpec.width} × {originalSpec.height} px</p>
              </div>

              {meta.target === 'WebP' && (
                <div className="space-y-2">
                  <div className={`flex justify-between items-center text-[10px] ${t.textFaint}`}>
                    <span className="font-sans font-bold">WebP Quality Compression:</span>
                    <span className="text-orange-400 font-mono font-bold">{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0.10" max="1.00" step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>
              )}

              {(meta.target === 'BMP' || meta.target === 'GIF') && meta.source === 'PNG' && (
                <div className="space-y-2">
                  <span className={`${t.textMuted} font-bold block`}>Alpha Backfill Color:</span>
                  <div className="grid grid-cols-3 gap-1 font-mono text-[9px]">
                    {[
                      { id: 'transparent', label: 'Alpha Clear' },
                      { id: '#ffffff', label: 'Solid White' },
                      { id: '#000000', label: 'Solid Black' }
                    ].map(bg => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => setBgFill(bg.id)}
                        className={`p-1.5 rounded text-center cursor-pointer font-bold border transition-all ${bgFill === bg.id ? 'bg-orange-600 text-white border-orange-500' : `${t.controlBg} ${t.textMuted} ${t.border}`}`}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {meta.target === 'ICO' && (
                <div className="space-y-2 font-mono">
                  <span className={`${t.textMuted} font-sans font-bold block`}>Favicon Packed Resoluations:</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    {[16, 32, 48, 64, 128, 256].map(s => (
                      <label key={s} className={`flex items-center gap-1.5 p-1 ${t.controlBg} rounded border ${t.border} cursor-pointer leading-none`}>
                        <input 
                          type="checkbox" 
                          checked={icoSizes[s]} 
                          onChange={() => toggleSizeOption(s)} 
                          className="accent-orange-500" 
                        />
                        <span>{s} × {s} px</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full p-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 select-none font-sans"
              >
                {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Perform Conversion</span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedFile ? (
            <div className={`border ${t.border} rounded-xl p-4 ${t.controlBg} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className={`text-[10px] font-bold ${t.textFaint} block uppercase font-mono`}>Original {meta.source}:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px] ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    <img src={originalUrl || ''} className="max-w-full max-h-full object-contain" alt="Original Target" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">Output {meta.target}:</span>
                  <div className={`aspect-square rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px] ${isDark ? "bg-[#101010]" : "bg-gray-100"}`}>
                    {convertedUrl ? (
                      <img src={convertedUrl} className="max-w-full max-h-full object-contain" alt="Converted Output" />
                    ) : (
                      <p className={`text-xs ${t.textFaint} text-center self-center px-4 h-20 flex items-center`}>Generate compiler bytes to preview.</p>
                    )}
                  </div>
                </div>
              </div>

              {convertedUrl && convertedBlob && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Successfully transformed original {meta.source} format!</p>
                    <p className={`${t.textFaint} font-mono text-[10px] mt-0.5`}>
                      Input size: {originalSpec ? formatSize(originalSpec.size) : ''} • Output size: {formatSize(convertedBlob.size)} 
                      {isSavingBytes && (
                        <span className="text-emerald-400 font-bold ml-1"> [Minimized {savedPercent}%]</span>
                      )}
                    </p>
                  </div>
                  <a
                    href={convertedUrl}
                    download={getOutputDownloadName()}
                    className="p-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {meta.target}</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className={`h-full border border-dashed ${t.border} rounded-xl ${t.controlBg} flex flex-col items-center justify-center text-center p-8 ${t.textFaint} min-h-[280px]`}>
              <FileImage className={`w-12 h-12 mb-2 ${t.textFaint}`} />
              <p className={`text-sm ${t.textMuted}`}>Provide standard original asset targets to active conversions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}