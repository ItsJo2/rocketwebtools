import React, { useState, useEffect } from 'react';
import { FileText, Download, Youtube, ArrowRight, Copy, Check, Terminal, Play, Clipboard, RefreshCw, Sparkles, Upload } from 'lucide-react';

interface AvSubtitleToolsProps {
  activeToolId: string;
}

// Subtitle converters logic
function convertVttToSrt(vttText: string): string {
  if (!vttText.trim()) return '';
  const lines = vttText.split(/\r?\n/);
  let out = '';
  let counter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip WebVTT signature header blocks and comments
    if (line.startsWith('WEBVTT') || line.startsWith('NOTE') || line.startsWith('STYLE')) {
      continue;
    }
    
    // Detect timecodes line
    if (line.includes('-->')) {
      const parts = line.split(/\s+/);
      if (parts.length >= 3 && parts[1] === '-->') {
        let start = parts[0];
        let end = parts[2];
        
        // Pad WebVTT shorthands, e.g., "00:05.120" -> "00:00:05.120"
        if (start.indexOf(':') === start.lastIndexOf(':')) {
          start = '00:' + start;
        }
        if (end.indexOf(':') === end.lastIndexOf(':')) {
          end = '00:' + end;
        }
        
        // Swap decimal points with commas
        const startSrt = start.replace('.', ',');
        const endSrt = end.replace('.', ',');
        
        out += `\n${counter}\n${startSrt} --> ${endSrt}\n`;
        counter++;
      }
    } else {
      // Inline visual tags strip (e.g. <b> or <v Amelia>)
      const cleanText = line.replace(/<[^>]+>/g, '');
      if (cleanText) {
        out += cleanText + '\n';
      } else if (line === '' && out !== '' && !out.endsWith('\n\n')) {
        out += '\n';
      }
    }
  }
  
  return out.trim() + '\n';
}

function convertSrtToVtt(srtText: string): string {
  if (!srtText.trim()) return '';
  const lines = srtText.split(/\r?\n/);
  let out = 'WEBVTT\n\n';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip number indexes
    if (/^\d+$/.test(line)) {
      continue;
    }
    
    // Convert cue timings
    if (line.includes('-->')) {
      const parts = line.split(/\s+/);
      if (parts.length >= 3 && parts[1] === '-->') {
        // Swap commas with decimal dots
        const startVtt = parts[0].replace(',', '.');
        const endVtt = parts[2].replace(',', '.');
        out += `${startVtt} --> ${endVtt}\n`;
      }
    } else {
      out += line + '\n';
    }
  }
  
  return out.trim() + '\n';
}

// Youtube id extraction rule
function getYoutubeId(url: string): string | null {
  const cleanUrl = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=|shorts\/)([^#\&\?]*).*/;
  const match = cleanUrl.match(regExp);
  return (match && match[2].length === 11) ? match[11] || match[2] : null;
}

export function AvSubtitleTools({ activeToolId }: AvSubtitleToolsProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (activeToolId === 'youtube-thumbnail') {
    return <YoutubeThumbnailDownloader />;
  }

  return <SubtitleConverter activeToolId={activeToolId} handleCopy={handleCopy} copied={copied} />;
}

// 1. SUBTITLE CONVERTER (VTT <-> SRT)
interface SubComponentProps {
  activeToolId: string;
  handleCopy: (text: string) => void;
  copied: boolean;
}

function SubtitleConverter({ activeToolId, handleCopy, copied }: SubComponentProps) {
  const [inputVal, setInputVal] = useState('');
  const [outputVal, setOutputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isVttToSrt = activeToolId === 'vtt-to-srt';

  // Demo generators
  useEffect(() => {
    const vttDemo = `WEBVTT\n\n1\n00:00:01.050 --> 00:00:04.200\nWelcome to developer workstation!\n\n2\n00:00:05.400 --> 00:00:09.110\nThis is static, responsive subtitle parsing.`;
    const srtDemo = `1\n00:00:01,050 --> 00:00:04,200\nWelcome to developer workstation!\n\n2\n00:00:05,400 --> 00:00:09,110\nThis is static, responsive subtitle parsing.`;
    
    setInputVal(isVttToSrt ? vttDemo : srtDemo);
    setOutputVal('');
  }, [activeToolId]);

  // Handle live calculation
  useEffect(() => {
    if (!inputVal.trim()) {
      setOutputVal('');
      setErrorMsg(null);
      return;
    }
    try {
      setErrorMsg(null);
      const converted = isVttToSrt ? convertVttToSrt(inputVal) : convertSrtToVtt(inputVal);
      setOutputVal(converted);
    } catch (err: any) {
      setErrorMsg(err.message || 'Formatting fault inside captions. Verify file integrity.');
    }
  }, [inputVal, activeToolId]);

  const downloadFile = () => {
    if (!outputVal) return;
    const blob = new Blob([outputVal], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = isVttToSrt ? 'subtitles.srt' : 'subtitles.vtt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setInputVal(event.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6" id="subtitle-converter-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="p-1 px-2 text-xs font-mono bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/20 rounded">AV TOOL</span>
            {isVttToSrt ? 'VTT to SRT Converter' : 'SRT to VTT Converter'}
          </h2>
          <p className="text-sm text-gray-400">
            {isVttToSrt 
              ? 'Normalize WebVTT captions into matching SubRip (SRT) playback sequences.' 
              : 'Add standard WebVTT signatures and convert timings to conform to browser players.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="p-2 px-3.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload subtitle</span>
            <input 
              type="file" 
              accept={isVttToSrt ? '.vtt' : '.srt'} 
              onChange={fileUploadHandler} 
              className="hidden" 
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Text Box */}
        <div className="space-y-2 flex flex-col">
          <label className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest block">
            {isVttToSrt ? 'SOURCE WEBVTT DATA' : 'SOURCE SUBRIP (SRT) DATA'}
          </label>
          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={isVttToSrt ? 'Paste WebVTT markup details...' : 'Paste SRT file contents...'}
            rows={14}
            className="w-full p-4 bg-[#09090b] border border-white/5 rounded-xl text-xs font-mono text-gray-200 placeholder:text-gray-750 focus:outline-none focus:ring-1 focus:ring-red-500/10 focus:border-red-500/30 transition-all leading-relaxed"
          />
        </div>

        {/* Output Text Block */}
        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex flex-col flex-grow">
            <label className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest block">
              {isVttToSrt ? 'COMPILED SRT TEXT' : 'COMPILED WEBVTT CAPTIONS'}
            </label>
            <div className="relative flex-grow">
              <textarea
                readOnly
                value={outputVal}
                placeholder="Parsed outcomes will produce here..."
                rows={14}
                className="w-full p-4 bg-[#0a0a0c] border border-white/5 rounded-xl text-xs font-mono text-indigo-300 focus:outline-none placeholder:text-gray-700 leading-relaxed"
              />

              {errorMsg && (
                <div className="absolute inset-0 bg-[#09090b]/95 border border-red-500/20 p-6 flex flex-col justify-center items-center text-center rounded-xl space-y-2">
                  <Terminal className="w-8 h-8 text-rose-500" />
                  <span className="text-xs font-mono font-bold text-rose-455">Subtitle validation broken</span>
                  <p className="text-[11px] text-gray-400 max-w-xs">{errorMsg}</p>
                </div>
              )}
            </div>
          </div>

          {outputVal && (
            <div className="flex gap-2 justify-end mt-3">
              <button
                onClick={() => handleCopy(outputVal)}
                className="p-2 px-4 border border-white/5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{copied ? 'Copied' : 'Copy Subtitles'}</span>
              </button>
              <button
                onClick={downloadFile}
                className="p-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Subtitle File</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

// 2. YOUTUBE THUMBNAIL DOWNLOADER
function YoutubeThumbnailDownloader() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFetch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    const id = getYoutubeId(url);
    if (id) {
      setVideoId(id);
    } else {
      setVideoId(null);
      setErrorMsg('Invalid YouTube URL query. Re-verify URL formats (watch, share, embed, or shorts).');
    }
  };

  const clearSandbox = () => {
    setUrl('');
    setVideoId(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6" id="youtube-thumbnail-container">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/20 rounded">AV TOOL</span>
          YouTube Thumbnail Downloader
        </h2>
        <p className="text-sm text-gray-400">Extract high-fidelity maximum resolution and standard thumbnails from any YouTube video.</p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleFetch} className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Youtube className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube watch link here (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
              className="w-full p-3 pl-11 border border-white/10 bg-[#161616] text-white rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 placeholder-gray-650 font-mono"
            />
          </div>
          <button
            type="submit"
            className="p-3 px-6 bg-red-650 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Fetch Thumbnails</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/20 text-red-400 border border-red-950/40 text-xs rounded-lg flex items-center gap-2 font-mono">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}
      </form>

      {/* Rendering results blocks */}
      {videoId ? (
        <div className="space-y-6 pt-2">
          <div className="flex justify-between items-center bg-[#09090b]/80 border border-white/5 p-3 px-4 rounded-xl text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-bold font-mono">RESOLVED YOUTUBE ID:</span>
              <span className="text-red-400 font-bold bg-red-950/20 px-2 py-0.5 rounded border border-red-500/20 select-all">{videoId}</span>
            </div>
            <button 
              type="button" 
              onClick={clearSandbox} 
              className="p-1 px-3 border border-white/10 hover:bg-white/5 rounded text-gray-400 hover:text-white"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Max Resolution (1080p, 1920x1080) */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden p-4 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2">
                  <span className="text-emerald-400 font-bold">MAXIMUM RESOLUTION (1080p)</span>
                  <span className="text-gray-500 uppercase font-black">1920 x 1080</span>
                </div>
                {/* Image layout rendering without referer header blocks to bypass standard security controls */}
                <div className="h-44 bg-[#0a0a0c] rounded-lg border border-white/5 overflow-hidden flex items-center justify-center relative group">
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                    alt="YouTube Max Resolution thumbnail preview" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    onError={(e) => {
                      // fallback layout if maxres default isn't available for this video
                      (e.target as HTMLElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent) {
                        const fallbackMsg = document.createElement('div');
                        fallbackMsg.className = 'text-xs text-gray-500 text-center font-mono p-4';
                        fallbackMsg.innerText = 'Max resolution unavailable. Download the high quality option below.';
                        parent.appendChild(fallbackMsg);
                      }
                    }}
                  />
                </div>
              </div>
              <a 
                href={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                target="_blank" 
                rel="noreferrer" 
                download={`youtube_thumbnail_${videoId}_max.jpg`}
                className="w-full p-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold font-mono text-center block transition-colors shadow"
              >
                View Fullscreen 1080p
              </a>
            </div>

            {/* High Resolution (720p, 1280x720) */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden p-4 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2">
                  <span className="text-blue-400 font-bold">HIGH QUALITY (720p)</span>
                  <span className="text-gray-500 uppercase font-black">1280 x 720</span>
                </div>
                <div className="h-44 bg-[#0a0a0c] rounded-lg border border-white/5 overflow-hidden flex items-center justify-center relative group">
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                    alt="YouTube High Quality thumbnail preview" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>
              </div>
              <a 
                href={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                target="_blank" 
                rel="noreferrer" 
                className="w-full p-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold font-mono text-center block transition-colors shadow"
              >
                View Fullscreen 720p
              </a>
            </div>

            {/* Medium Resolution (480p, 640x480) */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden p-4 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2">
                  <span className="text-amber-400 font-bold">STANDARD QUALITY (480p)</span>
                  <span className="text-gray-500 uppercase font-black">640 x 480</span>
                </div>
                <div className="h-44 bg-[#0a0a0c] rounded-lg border border-white/5 overflow-hidden flex items-center justify-center relative group">
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`} 
                    alt="YouTube Standard Quality thumbnail preview" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>
              </div>
              <a 
                href={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`} 
                target="_blank" 
                rel="noreferrer" 
                className="w-full p-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold font-mono text-center block transition-colors shadow"
              >
                View Fullscreen 480p
              </a>
            </div>

            {/* Low Quality (360p, 480x360) */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden p-4 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2">
                  <span className="text-purple-400 font-bold">MEDIUM QUALITY (360p)</span>
                  <span className="text-gray-500 uppercase font-black">480 x 360</span>
                </div>
                <div className="h-44 bg-[#0a0a0c] rounded-lg border border-white/5 overflow-hidden flex items-center justify-center relative group">
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} 
                    alt="YouTube Medium Quality thumbnail preview" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>
              </div>
              <a 
                href={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} 
                target="_blank" 
                rel="noreferrer" 
                className="w-full p-2 bg-[#252525] hover:bg-[#333333] border border-white/5 text-gray-300 text-center block hover:text-white rounded-xl text-xs font-bold font-mono transition-colors shadow"
              >
                View Fullscreen 360p
              </a>
            </div>

          </div>
        </div>
      ) : (
        <div className="border border-dashed border-white/10 p-12 text-center rounded-2xl bg-white/2 space-y-2 flex flex-col items-center justify-center">
          <Youtube className="w-10 h-10 text-gray-655" />
          <h4 className="font-semibold text-gray-400 text-xs font-mono uppercase tracking-widest mt-2">No Active Video Fetched</h4>
          <p className="text-xs text-gray-500 max-w-sm">Provide a standard YouTube link or video timeline URL above to compile matching sizes.</p>
        </div>
      )}
    </div>
  );
}
