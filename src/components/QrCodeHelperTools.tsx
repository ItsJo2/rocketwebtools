import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

interface QrCodeHelperToolsProps {
  activeToolId: string;
}

export function QrCodeHelperTools({ activeToolId }: QrCodeHelperToolsProps) {
  const currentId = activeToolId === 'qr-decoder' ? 'qr-decoder' : 'qr-generator';

  // 1. GENERATOR STATES
  const [textToEncode, setTextToEncode] = useState<string>('https://ai.studio/build');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [fgColor, setFgColor] = useState<string>('#ffffff');
  const [bgColor, setBgColor] = useState<string>('#1f2937'); // Gray 800 for high-contrast on dark app
  const [marginSize, setMarginSize] = useState<number>(4);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrWidth, setQrWidth] = useState<number>(300);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg'>('png');

  // 2. DECODER STATES
  const [decodedText, setDecodedText] = useState<string>('');
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [copiedDecodedText, setCopiedDecodedText] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR Code on config update
  useEffect(() => {
    if (currentId !== 'qr-generator') return;
    if (!textToEncode.trim()) {
      setQrDataUrl('');
      return;
    }

    const generateCode = async () => {
      try {
        const url = await QRCode.toDataURL(textToEncode, {
          width: qrWidth,
          margin: marginSize,
          errorCorrectionLevel: errorLevel,
          color: {
            dark: fgColor,
            light: bgColor
          }
        });
        setQrDataUrl(url);
      } catch (err: any) {
        console.error('QR code generation error:', err);
      }
    };

    generateCode();
  }, [textToEncode, fgColor, bgColor, marginSize, errorLevel, qrWidth, currentId]);

  // Decode QR implementation helper
  const decodeQrImage = (file: File) => {
    setDecodeError(null);
    setDecodedText('');

    if (!file.type.startsWith('image/')) {
      setDecodeError('Please upload a valid image file containing a QR code.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions match image target
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Fetch direct image elements buffer pixels
        try {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(imgData.data, imgData.width, imgData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (qrCode) {
            setDecodedText(qrCode.data);
            setDecodeError(null);
          } else {
            // Attempt with color inversion (good for dark themed QR codes)
            const qrCodeInverted = jsQR(imgData.data, imgData.width, imgData.height, {
              inversionAttempts: 'attemptBoth'
            });

            if (qrCodeInverted) {
              setDecodedText(qrCodeInverted.data);
              setDecodeError(null);
            } else {
              setDecodeError('No clear QR Code could be detected in this image. Try another angle or background.');
            }
          }
        } catch (err: any) {
          setDecodeError('Error decoding image properties. Make sure the file is clean: ' + err.message);
        }
      };
      img.onerror = () => {
        setDecodeError('Failed to load image element file.');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      decodeQrImage(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      decodeQrImage(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qrcode-${Date.now()}.${downloadFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyDecodedValue = () => {
    navigator.clipboard.writeText(decodedText);
    setCopiedDecodedText(true);
    setTimeout(() => setCopiedDecodedText(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div id="qr-core-card" className="p-6 bg-[#18181b]/95 border border-white/5 rounded-2xl shadow-xl space-y-6">
        
        {/* Header Title */}
        <div className="border-b border-white/5 pb-4">
          <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2 font-mono">
            {currentId === 'qr-generator' ? (
              <>
                <Icons.QrCode className="w-5 h-5 text-indigo-400" />
                QR Code Generator
              </>
            ) : (
              <>
                <Icons.ScanLine className="w-5 h-5 text-indigo-400" />
                QR Code Decoder
              </>
            )}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {currentId === 'qr-generator' 
              ? 'Generate highly scalable custom bar QR codes offline with support for colors, sizing, error tolerance, and instant downloads.' 
              : 'Recover payload links, plain texts, or standard contact objects encoded inside images automatically using advanced image sweep decoders.'}
          </p>
        </div>

        {/* 1. VIEW OF QR CODE GENERATOR */}
        {currentId === 'qr-generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Control Panel Form */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Text Input Block */}
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider block">Target payload Content</label>
                <textarea
                  value={textToEncode}
                  onChange={(e) => setTextToEncode(e.target.value)}
                  placeholder="Insert URL, messaging token, wifi credential details, or contacts..."
                  rows={4}
                  className="w-full p-4 bg-[#09090b] border border-white/5 rounded-xl text-[12.5px] text-white font-mono placeholder:text-gray-650 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500/40"
                />
              </div>

              {/* Color styling properties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Foreground color selector */}
                <div className="space-y-1.5 bg-[#09090b]/40 p-3 rounded-lg border border-white/5">
                  <label className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider block">QR Bits (Foreground)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="flex-1 p-1 bg-[#09090b] border border-white/10 rounded text-xs text-white font-mono uppercase text-center"
                    />
                  </div>
                </div>

                {/* Background color selector */}
                <div className="space-y-1.5 bg-[#09090b]/40 p-3 rounded-lg border border-white/5">
                  <label className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider block">QR Tile Paper (Background)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 p-1 bg-[#09090b] border border-white/10 rounded text-xs text-white font-mono uppercase text-center"
                    />
                  </div>
                </div>

              </div>

              {/* Advanced Parameters */}
              <div className="p-4 bg-[#09090b]/80 border border-white/5 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                
                {/* Error correction levels */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 font-mono uppercase tracking-wider block">Error Tolerance</label>
                  <select
                    value={errorLevel}
                    onChange={(e) => setErrorLevel(e.target.value as any)}
                    className="w-full p-2 border border-white/5 bg-[#09090b] rounded text-xs text-white cursor-pointer focus:outline-none"
                  >
                    <option value="L">L - Low (7%)</option>
                    <option value="M">M - Medium (15%)</option>
                    <option value="Q">Q - Quartile (25%)</option>
                    <option value="H">H - High (30% for raw uses)</option>
                  </select>
                </div>

                {/* Border Gap Options */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 font-mono uppercase tracking-wider block">Quiet Zone (Margin)</label>
                  <select
                    value={marginSize}
                    onChange={(e) => setMarginSize(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-white/5 bg-[#09090b] rounded text-xs text-white cursor-pointer focus:outline-none"
                  >
                    <option value="1">1 Module</option>
                    <option value="2">2 Modules</option>
                    <option value="4">4 Modules (Standard)</option>
                    <option value="6">6 Modules (Spacious)</option>
                  </select>
                </div>

                {/* Dimensions Width */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 font-mono uppercase tracking-wider block">QR Width Size</label>
                  <select
                    value={qrWidth}
                    onChange={(e) => setQrWidth(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-white/5 bg-[#09090b] rounded text-xs text-white cursor-pointer focus:outline-none"
                  >
                    <option value="150">150 px</option>
                    <option value="300">300 px (Recommended)</option>
                    <option value="500">500 px (HD Print)</option>
                    <option value="800">800 px (Ultra HD)</option>
                  </select>
                </div>

              </div>

            </div>

            {/* QR Code Presentation Panel */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#09090c] border border-white/5 rounded-2xl space-y-4">
              {qrDataUrl ? (
                <>
                  <div className="p-3 bg-white/2 border border-white/10 rounded-2xl shadow-inner max-w-full">
                    <img
                      src={qrDataUrl}
                      alt="Generated Offline QR Code"
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex flex-col items-center space-y-2 w-full max-w-xs">
                    <div className="flex gap-2 w-full">
                      <select
                        value={downloadFormat}
                        onChange={(e) => setDownloadFormat(e.target.value as any)}
                        className="p-2 border border-white/5 bg-[#18181b] rounded text-xs text-white font-mono cursor-pointer flex-1"
                      >
                        <option value="png">PNG Format</option>
                        <option value="svg">SVG Format (Vector)</option>
                      </select>

                      <button
                        onClick={handleDownload}
                        className="flex items-center justify-center gap-1.5 p-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded font-mono transition-colors"
                      >
                        <Icons.Download className="w-4 h-4 text-white" />
                        Download
                      </button>
                    </div>

                    <p className="text-[10px] text-gray-500 font-mono text-center">Processing completes 100% locally in browser</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500 font-mono text-xs">
                  <Icons.QrCode className="w-12 h-12 text-gray-700 mx-auto mb-3 animate-pulse" />
                  Enter content text to construct dynamic QR code.
                </div>
              )}
            </div>

          </div>
        )}

        {/* 2. VIEW OF QR CODE DECODER */}
        {currentId === 'qr-decoder' && (
          <div className="space-y-6">
            
            {/* hidden canvas for analysis */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Image Drag Drop Zone */}
              <div className="lg:col-span-6 space-y-4">
                <label className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider block">Upload Image Component</label>
                
                {/* File Drop Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`w-full py-16 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isDragOver 
                      ? 'border-indigo-400 bg-indigo-950/20 shadow-lg' 
                      : 'border-white/10 bg-[#09090b]/80 hover:bg-[#0c0c0e]'
                  }`}
                >
                  <Icons.UploadCloud className="w-10 h-10 text-indigo-400 mb-3" />
                  <p className="text-xs font-semibold text-white font-mono text-center px-4">
                    Drag and drop QR Image file here, or click to choose
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono mt-1 text-center px-4">
                    Supports PNG, JPG, JPEG, WEBP and GIF elements
                  </p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Right Column: Decoded Payload Output */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  <span>Decoder Payload Decipher Block</span>
                  <span className="text-teal-400">Scan Complete</span>
                </div>

                <div className="relative">
                  <textarea
                    readOnly
                    value={decodedText}
                    placeholder="Decoded link destination or raw message values will reflect here once scanned..."
                    rows={8}
                    className="w-full p-4 bg-[#0c0c0e] border border-white/5 rounded-xl text-[12.5px] text-indigo-300 font-mono placeholder:text-gray-700"
                  />

                  {decodeError && (
                    <div className="absolute inset-0 p-4 bg-red-950/90 border border-red-500/20 rounded-xl flex flex-col justify-center items-center text-center">
                      <Icons.AlertTriangle className="w-8 h-8 text-rose-500 mb-2" />
                      <span className="text-xs font-mono font-bold text-red-350 uppercase tracking-wider">Decoding Unsuccessful</span>
                      <p className="text-[11px] text-gray-400 mt-1 max-w-xs">{decodeError}</p>
                    </div>
                  )}
                </div>

                {/* Decoder operations drawer */}
                {decodedText && !decodeError && (
                  <div className="flex justify-between items-center">
                    {/* Check if decoded data is web url */}
                    {decodedText.startsWith('http://') || decodedText.startsWith('https://') ? (
                      <a
                        href={decodedText}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] font-mono text-indigo-400 hover:text-indigo-300 hover:underline"
                      >
                        <Icons.ExternalLink className="w-3.5 h-3.5" />
                        Go to web destination
                      </a>
                    ) : <span />}

                    <button
                      onClick={copyDecodedValue}
                      className="flex items-center gap-1.5 text-[10px] font-mono text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 px-3 rounded border border-white/5 transition-colors"
                    >
                      {copiedDecodedText ? (
                        <>
                          <Icons.Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied Link!</span>
                        </>
                      ) : (
                        <>
                          <Icons.Copy className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Copy Raw Result</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
