import React, { useState, useEffect } from 'react';
import { FileText, Download, Youtube, ArrowRight, Copy, Check, Terminal, Play, Clipboard, RefreshCw, Sparkles, Upload } from 'lucide-react';

interface AvSubtitleToolsProps {
  activeToolId: string;
  isDark: boolean;
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

export function AvSubtitleTools({ activeToolId, isDark }: AvSubtitleToolsProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (activeToolId === 'youtube-thumbnail') {
    return <YoutubeThumbnailDownloader isDark={isDark} />;
  }

  return <SubtitleConverter activeToolId={activeToolId} isDark={isDark} handleCopy={handleCopy} copied={copied} />;
}

// 1. SUBTITLE CONVERTER (VTT <-> SRT)
interface SubComponentProps {
  activeToolId: string;
  handleCopy: (text: string) => void;
  copied: boolean;
  isDark: boolean;
}

function SubtitleConverter({ activeToolId, handleCopy, copied, isDark }: SubComponentProps) {
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

  const badgeClass = isDark
    ? 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/20'
    : 'bg-red-50 text-red-600 border-red-200';

  return (
    <div className="space-y-6" id="subtitle-converter-container">
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${t.border}`}>
        <div>
          <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
            <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>AV TOOL</span>
            {isVttToSrt ? 'VTT to SRT Converter' : 'SRT to VTT Converter'}
          </h2>
          <p className={`text-sm ${t.textMuted}`}>
            {isVttToSrt 
              ? 'Normalize WebVTT captions into matching SubRip (SRT) playback sequences.' 
              : 'Add standard WebVTT signatures and convert timings to conform to browser players.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className={`p-2 px-3.5 ${t.copyBtn} text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors rounded-xl`}>
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
          <label className={`text-xs font-mono font-bold ${t.labelFaint} uppercase tracking-widest block`}>
            {isVttToSrt ? 'SOURCE WEBVTT DATA' : 'SOURCE SUBRIP (SRT) DATA'}
          </label>
          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={isVttToSrt ? 'Paste WebVTT markup details...' : 'Paste SRT file contents...'}
            rows={14}
            className={`w-full p-4 ${t.textareaBg} rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-red-500/10 focus:border-red-500/30 transition-all leading-relaxed`}
          />
        </div>

        {/* Output Text Block */}
        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex flex-col flex-grow">
            <label className={`text-xs font-mono font-bold ${t.labelFaint} uppercase tracking-widest block`}>
              {isVttToSrt ? 'COMPILED SRT TEXT' : 'COMPILED WEBVTT CAPTIONS'}
            </label>
            <div className="relative flex-grow">
              <textarea
                readOnly
                value={outputVal}
                placeholder="Parsed outcomes will produce here..."
                rows={14}
                className={`w-full p-4 ${t.outputBg} rounded-xl text-xs font-mono focus:outline-none leading-relaxed`}
              />

              {errorMsg && (
                <div className={`absolute inset-0 ${t.panelBg} border border-red-500/20 p-6 flex flex-col justify-center items-center text-center rounded-xl space-y-2`}>
                  <Terminal className="w-8 h-8 text-rose-500" />
                  <span className="text-xs font-mono font-bold text-rose-455">Subtitle validation broken</span>
                  <p className={`text-[11px] ${t.textMuted} max-w-xs`}>{errorMsg}</p>
                </div>
              )}
            </div>
          </div>

          {outputVal && (
            <div className="flex gap-2 justify-end mt-3">
              <button
                onClick={() => handleCopy(outputVal)}
                className={`p-2 px-4 ${t.copyBtn} rounded-xl text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors cursor-pointer`}
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
interface YoutubeThumbnailDownloaderProps {
  isDark: boolean;
}

function YoutubeThumbnailDownloader({ isDark }: YoutubeThumbnailDownloaderProps) {
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

  const badgeClass = isDark
    ? 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/20'
    : 'bg-red-50 text-red-600 border-red-200';

  return (
    <div className="space-y-6" id="youtube-thumbnail-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>AV TOOL</span>
          YouTube Thumbnail Downloader
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Extract high-fidelity maximum resolution and standard thumbnails from any YouTube video.</p>
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
              className={`w-full p-3 pl-11 ${t.inputBg} rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 font-mono`}
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
          <div className={`flex justify-between items-center ${t.controlBg} p-3 px-4 rounded-xl text-xs font-mono`}>
            <div className="flex items-center gap-2">
              <span className={`${t.textFaint} font-bold font-mono`}>RESOLVED YOUTUBE ID:</span>
              <span className="text-red-400 font-bold bg-red-950/20 px-2 py-0.5 rounded border border-red-500/20 select-all">{videoId}</span>
            </div>
            <button 
              type="button" 
              onClick={clearSandbox} 
              className={`p-1 px-3 ${t.copyBtn} rounded`}
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Max Resolution (1080p, 1920x1080) */}
            <div className={`${t.panelBg} rounded-2xl overflow-hidden p-4 space-y-4 flex flex-col justify-between`}>
              <div className="space-y-2">
                <div className={`flex justify-between items-center text-xs font-mono border-b ${t.border} pb-2`}>
                  <span className="text-emerald-400 font-bold">MAXIMUM RESOLUTION (1080p)</span>
                  <span className={`${t.textFaint} uppercase font-black`}>1920 x 1080</span>
                </div>
                {/* Image layout rendering without referer header blocks to bypass standard security controls */}
                <div className={`h-44 ${t.controlBg} rounded-lg border ${t.border} overflow-hidden flex items-center justify-center relative group`}>
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
                        fallbackMsg.className = `text-xs ${t.textFaint} text-center font-mono p-4`;
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
            <div className={`${t.panelBg} rounded-2xl overflow-hidden p-4 space-y-4 flex flex-col justify-between`}>
              <div className="space-y-2">
                <div className={`flex justify-between items-center text-xs font-mono border-b ${t.border} pb-2`}>
                  <span className="text-blue-400 font-bold">HIGH QUALITY (720p)</span>
                  <span className={`${t.textFaint} uppercase font-black`}>1280 x 720</span>
                </div>
                <div className={`h-44 ${t.controlBg} rounded-lg border ${t.border} overflow-hidden flex items-center justify-center relative group`}>
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
            <div className={`${t.panelBg} rounded-2xl overflow-hidden p-4 space-y-4 flex flex-col justify-between`}>
              <div className="space-y-2">
                <div className={`flex justify-between items-center text-xs font-mono border-b ${t.border} pb-2`}>
                  <span className="text-amber-400 font-bold">STANDARD QUALITY (480p)</span>
                  <span className={`${t.textFaint} uppercase font-black`}>640 x 480</span>
                </div>
                <div className={`h-44 ${t.controlBg} rounded-lg border ${t.border} overflow-hidden flex items-center justify-center relative group`}>
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
            <div className={`${t.panelBg} rounded-2xl overflow-hidden p-4 space-y-4 flex flex-col justify-between`}>
              <div className="space-y-2">
                <div className={`flex justify-between items-center text-xs font-mono border-b ${t.border} pb-2`}>
                  <span className="text-purple-400 font-bold">MEDIUM QUALITY (360p)</span>
                  <span className={`${t.textFaint} uppercase font-black`}>480 x 360</span>
                </div>
                <div className={`h-44 ${t.controlBg} rounded-lg border ${t.border} overflow-hidden flex items-center justify-center relative group`}>
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
                className={`w-full p-2 ${t.copyBtn} text-center block rounded-xl text-xs font-bold font-mono transition-colors shadow`}
              >
                View Fullscreen 360p
              </a>
            </div>

          </div>
        </div>
      ) : (
        <div className={`border border-dashed ${t.border} p-12 text-center rounded-2xl ${t.controlBg} space-y-2 flex flex-col items-center justify-center`}>
          <Youtube className={`w-10 h-10 ${t.textFaint}`} />
          <h4 className={`font-semibold ${t.textMuted} text-xs font-mono uppercase tracking-widest mt-2`}>No Active Video Fetched</h4>
          <p className={`text-xs ${t.textFaint} max-w-sm`}>Provide a standard YouTube link or video timeline URL above to compile matching sizes.</p>
        </div>
      )}
    </div>
  );
}