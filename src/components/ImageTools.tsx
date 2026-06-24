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

export function ImageTools({ activeToolId }: { activeToolId: string }) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(id);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  switch (activeToolId) {
    case 'image-enlarger': return <ImageEnlarger />;
    case 'image-cropper': return <ImageCropper />;
    case 'image-resizer': return <ImageResizer />;
    case 'image-converter': return <ImageConverter />;
    case 'jpg-to-png': return <JpgToPngConverter />;
    case 'jpg-converter': return <JpgConverter />;
    case 'webp-to-jpg': return <WebpToJpgConverter />;
    case 'png-to-jpg': return <PngToJpgConverter />;
    case 'ico-to-png': return <IcoToPngConverter />;
    case 'ico-converter': return <IcoConverterComponent />;
    case 'image-to-base64': return <ImageToBase64 onCopy={handleCopy} copiedStatus={copiedStatus} />;
    case 'base64-to-image': return <Base64ToImage />;
    case 'flip-image': return <FlipImage />;
    
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
      return <DirectPairConverter toolId={activeToolId} />;
      
    default: return null;
  }
}

// 1. IMAGE ENLARGER (Upscaler)
function ImageEnlarger() {
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">IMAGE</span>
          Image Enlarger & Upscaler
        </h2>
        <p className="text-sm text-gray-400">Increase image fidelity and dimensions using custom on-device smoothing or pixelated (nearest-neighbor) interpolation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#141414] hover:border-orange-550/30 transition-all relative">
            <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            <UploadCloud className="w-10 h-10 mx-auto text-gray-500 mb-2 pointer-events-none" />
            <p className="text-xs font-bold text-gray-300">Choose an image file</p>
            <p className="text-[10px] text-gray-500 mt-1">PNG, JPG, WebP supported</p>
          </div>

          {file && (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 text-xs space-y-4">
              <div className="space-y-2">
                <label className="text-gray-400 block font-bold">Scaling Factor:</label>
                <div className="grid grid-cols-4 gap-1">
                  {[1.5, 2, 3, 4].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setScale(s)}
                      className={`p-1.5 rounded font-mono text-xs cursor-pointer ${scale === s ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-300'}`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 select-none">
                <label className="text-gray-400 block font-bold">Scaling Algorithm:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
                    <input type="radio" checked={smoothing} onChange={() => setSmoothing(true)} className="accent-orange-500 cursor-pointer" />
                    <span>Smooth (Bilinear)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
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
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[300px]">
              <ImageIcon className="w-12 h-12 mb-2 text-gray-600" />
              <p className="text-sm">Select an image to open the upscaling workstation.</p>
            </div>
          ) : (
            <div className="border border-white/10 rounded-xl p-5 bg-[#161616] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 block uppercase font-mono mb-1">Source Preview:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 relative">
                    <img src={src} className="max-w-full max-h-full object-contain" alt="Original visual" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono mb-1">Upscaled Render:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 relative">
                    {outUrl ? (
                      <img src={outUrl} className="max-w-full max-h-full object-contain" alt="Enlarged visual" />
                    ) : (
                      <p className="text-center text-xs text-gray-500 px-4">Click "Upscale Image" to apply interpolation.</p>
                    )}
                  </div>
                </div>
              </div>

              {specs && outUrl && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-orange-950/15 p-4 rounded-xl border border-orange-500/20">
                  <div className="space-y-1 text-xs">
                    <p className="text-orange-200 font-bold">Fidelity Enlist Complete!</p>
                    <p className="text-gray-400 font-mono text-[10px]">Ratio: {scale}x • Original: {specs.w}×{specs.h} px • Target: {specs.outW}×{specs.outH} px</p>
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
function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 }); // in percentages
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

    // Adjust crop box width and height to match aspect ratio
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">IMAGE</span>
          Precision Image Cropper
        </h2>
        <p className="text-sm text-gray-400">Crop images with interactive aspect ratios and coordinate sliders with high precision offline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#141414] relative">
            <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className="w-8 h-8 mx-auto text-gray-500 mb-2" />
            <p className="text-xs font-bold text-gray-300">Choose canvas source</p>
          </div>

          {file && src && (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 text-xs space-y-4">
              <div>
                <span className="text-gray-400 font-bold block mb-1.5">Preset Aspect Ratio:</span>
                <div className="grid grid-cols-3 gap-1">
                  {['free', '1:1', '16:9', '4:3', '2:3'].map((asp) => (
                    <button
                      key={asp}
                      type="button"
                      onClick={() => applyAspect(asp)}
                      className={`p-1 rounded font-semibold text-[10px] capitalize cursor-pointer ${aspect === asp ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-400'}`}
                    >
                      {asp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-gray-400 font-bold block">Manual Box Alignment (%):</span>
                <div className="space-y-2 font-mono">
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
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
                    <div className="flex justify-between text-[10px] mb-1">
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
                    <div className="flex justify-between text-[10px] mb-1">
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
            <div className="border border-white/10 rounded-xl p-5 bg-[#161616] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 block uppercase font-mono mb-1">Crop Grid overlay:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 relative flex items-center justify-center select-none">
                    <img 
                      ref={imgRef}
                      src={src} 
                      className="max-w-full max-h-full object-contain pointer-events-none" 
                      alt="Crop target" 
                    />
                    {/* Bounding box highlighter */}
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
                      <p className="text-center text-xs text-gray-500 px-4">Determine your coordinates and click "Compile Crop Area".</p>
                    )}
                  </div>
                </div>
              </div>

              {outUrl && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Crop Segment Cleared!</p>
                    <p className="text-gray-400 font-mono text-[10px]">Specifications: {previewSpec}</p>
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
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[300px]">
              <Crop className="w-12 h-12 mb-2 text-gray-650" />
              <p className="text-sm">Provide an image to activate custom spatial crop boundaries.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. IMAGE RESIZER
function ImageResizer() {
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">IMAGE</span>
          Smart Image Resizer
        </h2>
        <p className="text-sm text-gray-400">Modify output layout dimensions, configure strict aspect ratio parameters and reduce file heft offline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 text-xs">
          <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#141414] relative">
            <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className="w-8 h-8 mx-auto text-gray-500 mb-2 pointer-events-none" />
            <p className="text-xs font-bold text-gray-300">Choose Image Source</p>
          </div>

          {file && (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                <div>
                  <label className="text-gray-400 block mb-1">Width (px):</label>
                  <input
                    type="number"
                    value={width === 0 ? '' : width}
                    onChange={(e) => changeWidth(Number(e.target.value))}
                    className="w-full bg-[#1e1e1e] p-2 rounded text-white border border-white/10 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Height (px):</label>
                  <input
                    type="number"
                    value={height === 0 ? '' : height}
                    onChange={(e) => changeHeight(Number(e.target.value))}
                    className="w-full bg-[#1e1e1e] p-2 rounded text-white border border-white/10 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 select-none text-[11px] text-gray-300">
                <input
                  type="checkbox"
                  checked={lockRatio}
                  onChange={(e) => setLockRatio(e.target.checked)}
                  className="w-4 h-4 rounded accent-orange-500 cursor-pointer"
                  id="lock-ratio-checkbox"
                />
                <label htmlFor="lock-ratio-checkbox" className="cursor-pointer">Maintain Original Aspect Ratio</label>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-white/5">
                <span className="text-gray-400 block">Quick Scale Scaling:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {[{ f: 0.25, l: '25%' }, { f: 0.5, l: '50%' }, { f: 0.75, l: '75%' }, { f: 0.9, l: '90%' }].map(it => (
                    <button
                      key={it.l}
                      type="button"
                      onClick={() => quickResize(it.f)}
                      className="p-1 px-2.5 rounded bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 text-[10px] cursor-pointer"
                    >
                      {it.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-3">
                <div>
                  <label className="text-gray-400 block mb-1">Format Output:</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full p-2 bg-[#202020] border border-white/10 text-white rounded text-xs focus:outline-none"
                  >
                    <option value="image/png">Lossless PNG</option>
                    <option value="image/jpeg">Optimized JPEG</option>
                    <option value="image/webp">Next-Gen WebP</option>
                  </select>
                </div>

                {format !== 'image/png' && (
                  <div>
                    <div className="flex justify-between mb-1 text-[10px]">
                      <span className="text-gray-400">Quality:</span>
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
            <div className="border border-white/10 rounded-xl p-5 bg-[#161616] space-y-4">
              <span className="text-[10px] font-bold text-gray-500 block uppercase font-mono">Image dimension preview:</span>
              <div className="aspect-video bg-[#141414] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-3 relative max-h-[300px]">
                <img src={src} className="max-w-full max-h-full object-contain" alt="Current visual" />
              </div>

              {specs && outUrl && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Rescaling finalized!</p>
                    <p className="text-gray-400 font-mono text-[10px] mt-0.5">Fidelity: {specs.w} × {specs.h} px • Target Weight: {formatSize(specs.size)}</p>
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
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[300px]">
              <MoveHorizontal className="w-12 h-12 mb-2 text-gray-650" />
              <p className="text-sm">Provide an image to activate custom size parameters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. IMAGE CONVERTER (Universal Format Transformer)
function ImageConverter() {
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">IMAGE</span>
          Universal Image Converter
        </h2>
        <p className="text-sm text-gray-400">Perform on-device file migrations between PNG, JPEG, WebP and alternative graphics standards easily.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#141414] relative">
            <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className="w-8 h-8 mx-auto text-gray-500 mb-2 pointer-events-none" />
            <p className="text-xs font-bold text-gray-300">Choose Image Target</p>
          </div>

          {file && (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 text-xs space-y-4 text-gray-300 font-sans">
              <div>
                <label className="text-gray-400 block mb-1">Target Format Output:</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                  className="w-full p-2 bg-[#202020] border border-white/10 text-white rounded text-xs focus:outline-none"
                >
                  <option value="image/png">Lossless PNG Format</option>
                  <option value="image/jpeg">Standard JPEG Graphics</option>
                  <option value="image/webp">Next-Gen WebP Engine</option>
                </select>
              </div>

              {targetType !== 'image/png' && (
                <div>
                  <div className="flex justify-between mb-1 text-[10px]">
                    <span className="text-gray-400">Compression Level:</span>
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
            <div className="border border-white/10 rounded-xl p-4 bg-[#161616] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 block uppercase font-mono mb-1">Original Asset:</span>
                  <div className="aspect-square bg-[#121212] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2">
                    <img src={src} className="max-w-full max-h-full object-contain" alt="Original asset" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono mb-1">Converted Preview:</span>
                  <div className="aspect-square bg-[#121212] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2">
                    {outUrl ? (
                      <img src={outUrl} className="max-w-full max-h-full object-contain" alt="Output asset" />
                    ) : (
                      <p className="text-xs text-gray-500 text-center px-4 self-center">Confirm format constraints and initiate conversion process.</p>
                    )}
                  </div>
                </div>
              </div>

              {outUrl && outSize && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Migration Complete!</p>
                    <p className="text-gray-400 font-mono text-[10px]">Origin: {formatSize(file?.size || 0)} • Result: {formatSize(outSize)} [{getFormatLabel(targetType)}]</p>
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
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[300px]">
              <RefreshCw className="w-12 h-12 mb-2 text-gray-650" />
              <p className="text-sm">Supply any picture file to open format adjustment options.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 5. JPG TO PNG CONVERTER
function JpgToPngConverter() {
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">IMAGE</span>
          JPG to PNG Converter
        </h2>
        <p className="text-sm text-gray-400">Convert single or batch JPEG/JPG images to clean, lossless, standard PNG files locally inside your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#141414] relative">
            <input type="file" accept="image/jpeg, image/jpg" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className="w-8 h-8 mx-auto text-gray-500 mb-2 pointer-events-none" />
            <p className="text-xs font-bold text-gray-300">Choose JPEG/JPG file</p>
          </div>

          {file && (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 text-xs space-y-3">
              <div className="text-gray-300 font-mono text-[10px] space-y-1">
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
            <div className="border border-white/10 rounded-xl p-4 bg-[#161616] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 block uppercase font-mono">JPG Target:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                    <img src={src} className="max-w-full max-h-full object-contain" alt="Original JPG" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">PNG Output:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                    {outUrl ? (
                      <img src={outUrl} className="max-w-full max-h-full object-contain" alt="Lossless PNG" />
                    ) : (
                      <p className="text-xs text-gray-500 text-center self-center px-4">Initiate translation to obtain transparent lossless alpha output.</p>
                    )}
                  </div>
                </div>
              </div>

              {outUrl && outSize && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Translation finished!</p>
                    <p className="text-gray-400 font-mono text-[10px]">JPG: {formatSize(file?.size || 0)} • PNG Output: {formatSize(outSize)}</p>
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
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[280px]">
              <FileImage className="w-12 h-12 mb-2 text-gray-650" />
              <p className="text-sm">Open any standard `.jpg` or `.jpeg` file to convert.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 6. JPG CONVERTER
function JpgConverter() {
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
        // Enforce background color to fill PNG alphas
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">IMAGE</span>
          Universal JPG/JPEG Compiler
        </h2>
        <p className="text-sm text-gray-400">Convert WebP, PNG, BMP, or SVG visuals into space-optimized JPEG/JPG graphics with customizable opacity fill.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 text-xs">
          <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#141414] relative">
            <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className="w-8 h-8 mx-auto text-gray-500 mb-2 pointer-events-none" />
            <p className="text-xs font-bold text-gray-300">Choose Image input</p>
          </div>

          {file && (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 space-y-4 text-gray-300 font-sans">
              <div>
                <label className="text-gray-400 block mb-1">Fill Alphas Background:</label>
                <select
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="w-full p-2 bg-[#202020] border border-white/10 text-white rounded text-xs focus:outline-none"
                >
                  <option value="#ffffff">Plain White Canvas Fill</option>
                  <option value="#000000">Plain Black Canvas Fill</option>
                  <option value="#f3f4f6">Light Gray Canvas Fill</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-[10px]">
                  <span className="text-gray-400">JPG Quality Coefficient:</span>
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
            <div className="border border-white/10 rounded-xl p-4 bg-[#161616] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 block uppercase font-mono">Original visual:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                    <img src={src} className="max-w-full max-h-full object-contain" alt="Original visual" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">Estimated JPG:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                    {outUrl ? (
                      <img src={outUrl} className="max-w-full max-h-full object-contain" alt="Finished JPG" />
                    ) : (
                      <p className="text-xs text-gray-500 text-center self-center px-4 border border-dashed border-white/5 h-20 flex items-center justify-center">Fill alphas & click "Export JPG File"</p>
                    )}
                  </div>
                </div>
              </div>

              {outUrl && outSize && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Successfully constructed JPG!</p>
                    <p className="text-gray-400 font-mono text-[10px]">Orig Size: {formatSize(file?.size || 0)} • Result JPG: {formatSize(outSize)}</p>
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
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[280px]">
              <FileImage className="w-12 h-12 mb-2 text-gray-650" />
              <p className="text-sm">Import graphics to perform standardized JPG translations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 7. WEBP TO JPG CONVERTER
function WebpToJoyConverter() {
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
        ctx.fillStyle = '#ffffff'; // WebP transparent backfill default
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">IMAGE</span>
          WebP to JPG Web Converter
        </h2>
        <p className="text-sm text-gray-400">Decode optimized modern WebP assets back down to high-compatibility standard JPEG format offline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 text-xs">
          <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#141414] relative">
            <input type="file" accept="image/webp" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className="w-8 h-8 mx-auto text-gray-500 mb-2 pointer-events-none" />
            <p className="text-xs font-bold text-gray-300">Choose `.webp` format file</p>
          </div>

          {file && (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 space-y-4 text-gray-300 font-sans">
              <div>
                <div className="flex justify-between mb-1 text-[10px]">
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
            <div className="border border-white/10 rounded-xl p-4 bg-[#161616] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 block uppercase font-mono">WebP input:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                    <img src={src} className="max-w-full max-h-full object-contain" alt="Original WebP" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">JPEG output:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                    {outUrl ? (
                      <img src={outUrl} className="max-w-full max-h-full object-contain" alt="Converted JPEG" />
                    ) : (
                      <p className="text-xs text-gray-500 text-center self-center px-4">Click "Perform Decode" to compile JPEG.</p>
                    )}
                  </div>
                </div>
              </div>

              {outUrl && outSize && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20 font-sans">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Successfully decoded WebP image!</p>
                    <p className="text-gray-400 font-mono text-[10px]">Origin WebP: {formatSize(file?.size || 0)} • Result JPG: {formatSize(outSize)}</p>
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
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[285px]">
              <FileImage className="w-12 h-12 mb-2 text-gray-650" />
              <p className="text-sm">Supply `.webp` file format inputs to decode.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 7 alias component
function WebpToJoyEnlist() {
  return <WebpToJoyConverter />;
}

// 8. PNG TO JPG CONVERTER
function PngToJpgConverter() {
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
        ctx.fillStyle = '#ffffff'; // White background for transparency
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">IMAGE</span>
          PNG to JPG Image Converter
        </h2>
        <p className="text-sm text-gray-400">Convert PNG files to high compatibility JPG format offline with zero cloud server processing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="space-y-4">
          <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#141414] relative">
            <input type="file" accept="image/png" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className="w-8 h-8 mx-auto text-gray-500 mb-2 pointer-events-none" />
            <p className="text-xs font-bold text-gray-300">Choose PNG target</p>
          </div>

          {selectedFile && originalSpec && (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 text-xs space-y-4 text-gray-350">
              <div className="space-y-1.5 font-mono text-[10px]">
                <p className="truncate"><span className="text-gray-400 font-sans">File Name:</span> {selectedFile.name}</p>
                <p><span className="text-gray-400 font-sans">Input Weight:</span> {formatSize(originalSpec.size)}</p>
                <p><span className="text-gray-400 font-sans">Layout bounds:</span> {originalSpec.width} × {originalSpec.height} px</p>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-400 font-sans">JPG Output Quality:</span>
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
            <div className="border border-white/10 rounded-xl p-4 bg-[#161616] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 block uppercase font-mono">PNG target:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                    <img src={originalUrl || ''} className="max-w-full max-h-full object-contain" alt="Original PNG" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">JPG converted:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                    {convertedUrl ? (
                      <img src={convertedUrl} className="max-w-full max-h-full object-contain" alt="Converted JPG" />
                    ) : (
                      <p className="text-xs text-gray-500 text-center self-center px-4 h-20 flex items-center">Click "Perform Conversion" to render JPEG.</p>
                    )}
                  </div>
                </div>
              </div>

              {convertedUrl && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Successfully compressed PNG!</p>
                    <p className="text-gray-400 font-mono text-[10px] mt-0.5">Origin PNG: {originalSpec ? formatSize(originalSpec.size) : ''} • Output JPG: {convertedSpec ? formatSize(convertedSpec.size) : ''} [Minimized {savedPercent}%]</p>
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
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[280px]">
              <FileImage className="w-12 h-12 mb-2 text-gray-650" />
              <p className="text-sm">Provide standard `.png` inputs to convert.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 9. ICO TO PNG CONVERTER
function IcoToPngConverter() {
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

  return (
    <div className="space-y-6" id="ico-to-png-container">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">IMAGE</span>
          ICO to PNG Converter
        </h2>
        <p className="text-sm text-gray-400">Extract high-resolution transparent PNG images from Windows `.ico` icons entirely within your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#141414] hover:border-indigo-500/30 transition-all relative">
            <input type="file" accept=".ico" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            <UploadCloud className="w-10 h-10 mx-auto text-gray-500 mb-2 pointer-events-none" />
            <p className="text-xs font-bold text-gray-300">Choose or drop an ICO file</p>
          </div>

          {selectedFile && (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 text-xs space-y-4 text-gray-350">
              <div className="space-y-1.5 font-sans">
                <p className="truncate"><span className="text-gray-500">Filename:</span> {selectedFile.name}</p>
                <p><span className="text-gray-400 font-sans">Size:</span> {formatSize(selectedFile.size)}</p>
                {dimensions && (
                  <p><span className="text-gray-400 font-sans">Dimensions:</span> {dimensions.width} x {dimensions.height} px</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400 block font-bold">Resize Option:</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-2 border border-white/10 roundedbg-[#161616] text-white bg-[#202020] focus:outline-none"
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
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[280px]">
              <FileImage className="w-12 h-12 mb-2 text-gray-650" />
              <p className="text-sm">Select an `.ico` image file to extract transparent PNG visual frames.</p>
            </div>
          ) : (
            <div className="border border-white/10 rounded-xl p-4 bg-[#161616] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 block uppercase font-mono">Source ICO:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                    <img src={originalUrl || ''} className="max-w-full max-h-full object-contain" alt="Original ICO" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">Extracted PNG:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                    {convertedUrl ? (
                      <img src={convertedUrl} className="max-w-full max-h-full object-contain" alt="Extracted PNG" />
                    ) : (
                      <p className="text-xs text-gray-500 text-center self-center px-4 h-20 flex items-center">Click "Extract PNG" to compute output.</p>
                    )}
                  </div>
                </div>
              </div>

              {convertedUrl && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20 font-sans">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Extraction finalized successfully!</p>
                    <p className="text-gray-400 font-mono text-[10px] mt-0.5">Alpha transparent frames preserved completely.</p>
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
function IcoConverterComponent() {
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
        view.setUint16(2, 1, true); // type ico
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">IMAGE</span>
          Universal ICO Compiler
        </h2>
        <p className="text-sm text-gray-400">Compile smart multi-resolution Windows `.ico` icons or browser favicons.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="space-y-4">
          <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#141414] relative">
            <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className="w-8 h-8 mx-auto text-gray-500 mb-2 pointer-events-none" />
            <p className="text-xs font-bold text-gray-300">Choose custom picture</p>
          </div>

          {selectedFile && (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 text-xs space-y-4 text-gray-350">
              <div className="space-y-1">
                <span className="text-gray-400 block font-bold">Check active sizes:</span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                  {[16, 32, 48, 64, 128, 256].map(s => (
                    <label key={s} className="flex items-center gap-1.5 p-1 px-2 bg-white/5 rounded cursor-pointer leading-none">
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
            <div className="border border-white/10 rounded-xl p-4 bg-[#161616] space-y-4">
              <span className="text-[10px] font-bold text-gray-500 block uppercase font-mono">Source input image:</span>
              <div className="aspect-video bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                <img src={src} className="max-w-full max-h-full object-contain" alt="Original visual" />
              </div>

              {icoUrl && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">ICO bundle successfully generated!</p>
                    <p className="text-gray-400 font-mono text-[10px] mt-0.5">Size weight: {icoBlob ? formatSize(icoBlob.size) : 'Calculated'}</p>
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
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[280px]">
              <FileImage className="w-12 h-12 mb-2 text-gray-650" />
              <p className="text-sm">Supply a high-resolution transparent picture target to compile ICO.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 11. IMAGE TO BASE64
function ImageToBase64({ onCopy, copiedStatus }: { onCopy: (text: string, id: string) => void, copiedStatus: string | null }) {
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">CONVERTER</span>
          Image to Base64 Code
        </h2>
        <p className="text-sm text-gray-400 font-sans">Translate custom image files into layout-safe Base64 strings or standard inline stylesheet schemes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="space-y-4">
          <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#141414] relative">
            <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className="w-8 h-8 mx-auto text-gray-500 mb-2 pointer-events-none" />
            <p className="text-xs font-bold text-gray-300">Choose picture file</p>
          </div>

          {file && (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 text-xs space-y-2 text-gray-400 font-mono">
              <p className="truncate"><span className="font-sans text-gray-500 font-bold block">Filename:</span> {file.name}</p>
              <p><span className="font-sans text-gray-500 font-bold block">Size:</span> {formatSize(file.size)}</p>
              <p><span className="font-sans text-gray-500 font-bold block">Base64 length:</span> {base64String.length.toLocaleString()} chars</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {file ? (
            <div className="border border-white/10 rounded-xl p-4 bg-[#161616] space-y-4">
              <div className="flex flex-wrap gap-1 border-b border-white/5 pb-2">
                {[
                  { id: 'datauri', label: 'Data URI' },
                  { id: 'raw', label: 'Raw Base64' },
                  { id: 'html', label: 'HTML Tag' },
                  { id: 'css', label: 'CSS Background' }
                ].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => setActiveTab(tb.id as any)}
                    className={`p-1.5 px-3 rounded text-xs font-bold cursor-pointer transition-all ${activeTab === tb.id ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
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
                  className="w-full h-48 p-3 bg-[#111] text-indigo-300 font-mono text-[10px] rounded border border-white/5 focus:outline-none resize-none break-all"
                  value={outputString}
                />
              </div>
            </div>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[280px]">
              <Code className="w-12 h-12 mb-2 text-gray-650" />
              <p className="text-sm">Provide an image asset to translate into inline-safe Base64 representation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 12. BASE64 TO IMAGE
function Base64ToImage() {
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">DECODER</span>
          Base64 to Image Decoder
        </h2>
        <p className="text-sm text-gray-400">Decode alphanumeric representation strings back into downloadable visual formats.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="space-y-4 text-xs">
          <div className="bg-[#141414] border border-white/5 rounded-xl p-4 space-y-3">
            <span className="text-gray-400 block font-bold">Mime constraints:</span>
            <div className="p-2.5 bg-[#1a1a1a] rounded font-mono text-indigo-400 font-bold border border-white/5">{mime}</div>
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
            className="w-full h-40 p-3 bg-[#161616] border border-white/10 text-white font-mono text-[11px] rounded focus:outline-none focus:border-orange-500 resize-none placeholder-gray-650"
            placeholder="Paste your base64 code string here (raw or Data-URI)..."
            value={inputStr}
            onChange={(e) => setInputStr(e.target.value)}
          />

          {err && <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded">{err}</div>}

          {src && (
            <div className="border border-white/10 rounded-xl p-4 bg-[#161616] space-y-4">
              <span className="text-xs font-mono text-orange-400 font-bold block">Render Decoded:</span>
              <div className="aspect-video bg-[#101010] rounded border border-white/5 p-3 flex items-center justify-center max-h-[250px]">
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
function FlipImage() {
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">IMAGE</span>
          Flip & Rotate Image
        </h2>
        <p className="text-sm text-gray-400">Instantly mirror images horizontally, vertically, or spin by custom degrees with instant previews.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-xs">
        <div className="space-y-4">
          <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#141414] relative">
            <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className="w-8 h-8 mx-auto text-gray-500 mb-2 pointer-events-none" />
            <p className="text-xs font-bold text-gray-300">Choose picture file</p>
          </div>

          {file && (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 space-y-4 text-gray-300">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFlipH(p => !p)}
                  className={`flex-1 p-2 rounded font-bold cursor-pointer transition-all ${flipH ? 'bg-orange-600 text-white' : 'bg-[#202020] text-gray-400'}`}
                >
                  Flip Horizontal
                </button>
                <button
                  type="button"
                  onClick={() => setFlipV(p => !p)}
                  className={`flex-1 p-2 rounded font-bold cursor-pointer transition-all ${flipV ? 'bg-orange-600 text-white' : 'bg-[#202020] text-gray-400'}`}
                >
                  Flip Vertical
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex justify-between text-[10px]">
                  <span>Rotate Degrees:</span>
                  <span className="font-bold text-orange-400">{rotation}°</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
                  {[0, 90, 180, 270].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setRotation(d)}
                      className={`p-1.5 rounded font-bold text-center cursor-pointer ${rotation === d ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-400'}`}
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
            <div className="border border-white/10 rounded-xl p-4 bg-[#161616] space-y-4">
              <span className="text-[10px] font-bold text-gray-500 block uppercase font-mono">Orientation view:</span>
              <div className="aspect-video bg-[#101010] rounded border border-white/5 flex items-center justify-center p-3 relative max-h-[300px]">
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
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[280px]">
              <RotateCw className="w-12 h-12 mb-2 text-gray-650" />
              <p className="text-sm">Provide an image to activate pivot/symmetry tools.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 14. WEBP TO JPG COMPLIANT DECODER CONVERTER DEFINITION FOR EXCELLENCE
function WebpToWebpDecoder() {
  return <WebpToJpgConverter />;
}

// Map alias Webp to Webp
function WebpToWebpDecoderEnlist() {
  return <WebpToJpgConverter />;
}

// Alias mapping for final export
function WebpToJpgConverter() {
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
        ctx.fillStyle = '#ffffff'; // default white backdrop
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">IMAGE</span>
          WebP to JPG Web Converter
        </h2>
        <p className="text-sm text-gray-400">Convert WebP images to high-compatibility JPEG/JPG layout standards offline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="space-y-4">
          <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#141414] relative">
            <input type="file" accept="image/webp" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" />
            <UploadCloud className="w-8 h-8 mx-auto text-gray-500 mb-2 pointer-events-none" />
            <p className="text-xs font-bold text-gray-300">Choose custom WebP</p>
          </div>

          {selectedFile && originalSpec && (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 text-xs space-y-4 text-gray-350">
              <div className="space-y-1.5 font-mono text-[10px]">
                <p className="truncate"><span className="text-gray-400 font-sans">File:</span> {selectedFile.name}</p>
                <p><span className="text-gray-400 font-sans">Weight:</span> {formatSize(originalSpec.size)}</p>
                <p><span className="text-gray-400 font-sans">Resolution:</span> {originalSpec.width} × {originalSpec.height} px</p>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-400 font-sans">Output JPG Quality:</span>
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
                <span>Convert to JPG</span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedFile ? (
            <div className="border border-white/10 rounded-xl p-4 bg-[#161616] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 block uppercase font-mono">Source WebP:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                    <img src={originalUrl || ''} className="max-w-full max-h-full object-contain" alt="Original WebP" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">Converted JPG:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                    {convertedUrl ? (
                      <img src={convertedUrl} className="max-w-full max-h-full object-contain" alt="Converted JPG" />
                    ) : (
                      <p className="text-xs text-gray-500 text-center self-center px-4 h-20 flex items-center">Click "Convert to JPG" to preview.</p>
                    )}
                  </div>
                </div>
              </div>

              {convertedUrl && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Successfully constructed JPG!</p>
                    <p className="text-gray-400 font-mono text-[10px] mt-0.5">Original: {originalSpec ? formatSize(originalSpec.size) : ''} • Target JPG: {convertedSpec ? formatSize(convertedSpec.size) : ''} [Compressed {savedPercent}%]</p>
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
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[280px]">
              <FileImage className="w-12 h-12 mb-2 text-gray-650" />
              <p className="text-sm">Provide WebP target elements to initiate conversions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
function DirectPairConverter({ toolId }: { toolId: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [originalSpec, setOriginalSpec] = useState<{ width: number; height: number; size: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState<number>(0.85);
  
  // Custom states for GIF background fill option
  const [bgFill, setBgFill] = useState<string>('transparent'); // 'transparent', '#ffffff', '#000000'
  
  // Custom states for ICO sizes
  const [icoSizes, setIcoSizes] = useState<{ [key: number]: boolean }>({
    16: true,
    32: true,
    48: true,
    64: false,
    128: false,
    256: true
  });

  const meta = getFormatMetadata(toolId);

  // Clean URLs on unmount or toolId switch
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    };
  }, [originalUrl, convertedUrl]);

  // Handle new tool selection (reset states)
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

        // Apply custom backgrounds if solid conversion layout is desired
        if (bgFill !== 'transparent') {
          ctx.fillStyle = bgFill;
          ctx.fillRect(0, 0, w, h);
        } else {
          ctx.clearRect(0, 0, w, h);
        }

        ctx.drawImage(img, 0, 0);

        if (meta.target === 'BMP') {
          // Uncompressed 32-bit RGBA BMP
          const blob = canvasToBmp(canvas);
          setConvertedBlob(blob);
          if (convertedUrl) URL.revokeObjectURL(convertedUrl);
          setConvertedUrl(URL.createObjectURL(blob));
          setIsProcessing(false);
        } else if (meta.target === 'ICO') {
          // Compile active sizes directory
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
          // WebP, PNG, GIF
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">IMAGE CRAFT</span>
          {meta.source} to {meta.target} Converter
        </h2>
        <p className="text-sm text-gray-400">Perform direct offline {meta.source} image conversion to standard {meta.target} assets in one tap.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="space-y-4">
          <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-[#141414] hover:border-indigo-500/20 transition-all relative">
            <input 
              type="file" 
              accept={meta.accept} 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full cursor-pointer" 
            />
            <UploadCloud className="w-8 h-8 mx-auto text-gray-500 mb-2 pointer-events-none" />
            <p className="text-xs font-bold text-gray-300">Choose custom {meta.source} target</p>
          </div>

          {selectedFile && originalSpec && (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 text-xs space-y-4 text-gray-350">
              <div className="space-y-1.5 font-mono text-[10px] pb-3 border-b border-white/5">
                <p className="truncate"><span className="text-gray-500 font-sans">File Name:</span> {selectedFile.name}</p>
                <p><span className="text-gray-500 font-sans">Input Weight:</span> {formatSize(originalSpec.size)}</p>
                <p><span className="text-gray-500 font-sans">Format Type:</span> {meta.source}</p>
                <p><span className="text-gray-500 font-sans">Resolution:</span> {originalSpec.width} × {originalSpec.height} px</p>
              </div>

              {/* Quality Selection for WebP */}
              {meta.target === 'WebP' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 font-sans font-bold">WebP Quality Compression:</span>
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

              {/* Solid Background overlay fills options for PNG files converting to elements without Alpha constraints */}
              {(meta.target === 'BMP' || meta.target === 'GIF') && meta.source === 'PNG' && (
                <div className="space-y-2">
                  <span className="text-gray-400 font-bold block">Alpha Backfill Color:</span>
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
                        className={`p-1.5 rounded text-center cursor-pointer font-bold border transition-all ${bgFill === bg.id ? 'bg-orange-600 text-white border-orange-500' : 'bg-white/5 text-gray-400 border-white/5'}`}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ICO Size Multi resolution choices */}
              {meta.target === 'ICO' && (
                <div className="space-y-2 font-mono">
                  <span className="text-gray-400 font-sans font-bold block">Favicon Packed Resoluations:</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    {[16, 32, 48, 64, 128, 256].map(s => (
                      <label key={s} className="flex items-center gap-1.5 p-1 bg-[#1a1a1a] rounded border border-white/5 cursor-pointer leading-none">
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
            <div className="border border-white/10 rounded-xl p-4 bg-[#161616] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 block uppercase font-mono">Original {meta.source}:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                    <img src={originalUrl || ''} className="max-w-full max-h-full object-contain" alt="Original Target" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 block uppercase font-mono">Output {meta.target}:</span>
                  <div className="aspect-square bg-[#101010] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-2 max-h-[220px]">
                    {convertedUrl ? (
                      <img src={convertedUrl} className="max-w-full max-h-full object-contain" alt="Converted Output" />
                    ) : (
                      <p className="text-xs text-gray-500 text-center self-center px-4 h-20 flex items-center">Generate compiler bytes to preview.</p>
                    )}
                  </div>
                </div>
              </div>

              {convertedUrl && convertedBlob && (
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1c2e] p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-xs">
                    <p className="text-indigo-200 font-bold">Successfully transformed original {meta.source} format!</p>
                    <p className="text-gray-400 font-mono text-[10px] mt-0.5">
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
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[280px]">
              <FileImage className="w-12 h-12 mb-2 text-gray-650" />
              <p className="text-sm">Provide standard original asset targets to active conversions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
