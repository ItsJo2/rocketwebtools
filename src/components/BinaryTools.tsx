import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

interface BinaryToolsProps {
  activeToolId: string;
  isDark: boolean;
}

// 24 binary converter tool definitions
const CONVERTERS_CONFIG: Record<string, {
  title: string;
  placeholder: string;
  sampleInput: string;
  fromLabel: string;
  toLabel: string;
  swapToolId: string;
  explanation: string;
}> = {
  'txt-to-bin': {
    title: 'Text to Binary Converter',
    placeholder: 'Enter text list (e.g., Hello)',
    sampleInput: 'Hello World',
    fromLabel: 'Plain Text',
    toLabel: 'Binary String (8-bit representation)',
    swapToolId: 'bin-to-txt',
    explanation: 'Converts each text character into its corresponding UTF-8/ASCII byte value, then formatting those integers as 8-digit binary chunks (base-2).'
  },
  'bin-to-txt': {
    title: 'Binary to Text Converter',
    placeholder: 'Enter space-separated binary bits (e.g., 01001000 01101001)',
    sampleInput: '01001000 01100101 01101100 01101100 01101111',
    fromLabel: 'Binary Bits',
    toLabel: 'Plain Text',
    swapToolId: 'txt-to-bin',
    explanation: 'Splits incoming base-2 binary arrays into 8-bit packages, translates them to base-10 code values, then maps them back to UTF-8 characters.'
  },
  'hex-to-bin': {
    title: 'HEX to Binary Converter',
    placeholder: 'Enter hexadecimal string (e.g., 4A 6F 65 or 4d5f)',
    sampleInput: '4A 6F 79',
    fromLabel: 'Hexadecimal (Base-16)',
    toLabel: 'Binary (Base-2)',
    swapToolId: 'bin-to-hex',
    explanation: 'Parses hexadecimal digits and converts each into an equivalent 4-bit binary nibble (0-15 scale).'
  },
  'bin-to-hex': {
    title: 'Binary to HEX Converter',
    placeholder: 'Enter binary bits (e.g., 01001010 01101111)',
    sampleInput: '01001010 01101111 01111001',
    fromLabel: 'Binary (Base-2)',
    toLabel: 'Hexadecimal (Base-16)',
    swapToolId: 'hex-to-bin',
    explanation: 'Aggregates groups of 4 binary bits (nibbles) from right to left, converting active electric states directly to alphanumeric base-16 digits.'
  },
  'ascii-to-bin': {
    title: 'ASCII to Binary Converter',
    placeholder: 'Enter ASCII characters or space-separated codes (e.g., A B or 65 66)',
    sampleInput: 'ASCII Code 99',
    fromLabel: 'ASCII Value / Chars',
    toLabel: 'Binary Stream',
    swapToolId: 'bin-to-ascii',
    explanation: 'Maps standard American Standard Code for Information Interchange codes or literal characters into binary byte streams.'
  },
  'bin-to-ascii': {
    title: 'Binary to ASCII Converter',
    placeholder: 'Enter binary (e.g., 01000001 01011010)',
    sampleInput: '01000001 01010011 01000011 01001001 01001001',
    fromLabel: 'Binary Code',
    toLabel: 'ASCII Characters',
    swapToolId: 'ascii-to-bin',
    explanation: 'Converts base-2 streams into standard printable ASCII characters ranging from 0-127 index systems.'
  },
  'dec-to-bin': {
    title: 'Decimal to Binary Converter',
    placeholder: 'Enter a decimal integer or real number (e.g., 255)',
    sampleInput: '156',
    fromLabel: 'Decimal Number (Base-10)',
    toLabel: 'Binary Representation (Base-2)',
    swapToolId: 'bin-to-dec',
    explanation: 'Applies continuous division-by-2 mechanisms, tracking remainders upwards, to compile standard binary numbers.'
  },
  'bin-to-dec': {
    title: 'Binary to Decimal Converter',
    placeholder: 'Enter binary sequence (e.g., 10011100)',
    sampleInput: '10011100',
    fromLabel: 'Binary String',
    toLabel: 'Decimal Number (Base-10)',
    swapToolId: 'dec-to-bin',
    explanation: 'Decodes base-2 sequences back into modern base-10 numerical representations using mathematical power-weights (2^0, 2^1, ...).'
  },
  'txt-to-ascii': {
    title: 'Text to ASCII Converter',
    placeholder: 'Enter characters to index (e.g., AI)',
    sampleInput: 'AI Studio',
    fromLabel: 'Raw Characters',
    toLabel: 'ASCII Decimal List',
    swapToolId: 'ascii-to-txt',
    explanation: 'Translates literal human symbols into standard decimal indexes as declared in basic byte tables.'
  },
  'ascii-to-txt': {
    title: 'ASCII to Text Converter',
    placeholder: 'Enter space-separated decimal codes (e.g., 65 73)',
    sampleInput: '65 73 32 83 116 117 100 105 111',
    fromLabel: 'ASCII Decimal Indexes',
    toLabel: 'Text Output',
    swapToolId: 'txt-to-ascii',
    explanation: 'Parses list of standard integer indices representing glyphs in ASCII standard tables back into printable characters.'
  },
  'hex-to-dec': {
    title: 'HEX to Decimal Converter',
    placeholder: 'Enter hexadecimal numbers (e.g., 1FF)',
    sampleInput: '2A3F',
    fromLabel: 'Hexadecimal (Base-16)',
    toLabel: 'Decimal (Base-10)',
    swapToolId: 'dec-to-hex',
    explanation: 'Performs base-16 mathematical weight summation (16^0, 16^1, e.g.) to scale hexadecimal strings back to decimal indices.'
  },
  'dec-to-hex': {
    title: 'Decimal to HEX Converter',
    placeholder: 'Enter a base-10 integer (e.g., 10815)',
    sampleInput: '10815',
    fromLabel: 'Decimal Number',
    toLabel: 'Hexadecimal Value',
    swapToolId: 'hex-to-dec',
    explanation: 'Computes continuous division by 16 remainder sequences, encoding values 10-15 into letters A-F.'
  },
  'oct-to-bin': {
    title: 'Octal to Binary Converter',
    placeholder: 'Enter octal number (digits 0-7, e.g., 752)',
    sampleInput: '752',
    fromLabel: 'Octal (Base-8)',
    toLabel: 'Binary (Base-2)',
    swapToolId: 'bin-to-oct',
    explanation: 'Maps each individual octal base-8 digit directly onto a 3-bit binary group sequence.'
  },
  'bin-to-oct': {
    title: 'Binary to Octal Converter',
    placeholder: 'Enter binary elements (e.g., 111101010)',
    sampleInput: '111101010',
    fromLabel: 'Binary',
    toLabel: 'Octal Representation',
    swapToolId: 'oct-to-bin',
    explanation: 'Groups binary streams into triplets starting from right to left, converting each block to digits 0 to 7.'
  },
  'oct-to-dec': {
    title: 'Octal to Decimal Converter',
    placeholder: 'Enter octal digits (e.g., 377)',
    sampleInput: '377',
    fromLabel: 'Octal (Base-8)',
    toLabel: 'Decimal (Base-10)',
    swapToolId: 'dec-to-oct',
    explanation: 'Expresses octal number digits as sums of mathematical base-8 powers: d * 8^n.'
  },
  'dec-to-oct': {
    title: 'Decimal to Octal Converter',
    placeholder: 'Enter decimal positive integer (e.g., 255)',
    sampleInput: '255',
    fromLabel: 'Decimal Number (Base-10)',
    toLabel: 'Octal String (Base-8)',
    swapToolId: 'oct-to-dec',
    explanation: 'Calculates octal figures by repetitive division coefficients by 8 tracking the remaining fraction offsets.'
  },
  'hex-to-oct': {
    title: 'HEX to Octal Converter',
    placeholder: 'Enter hexadecimal numbers (e.g., FF)',
    sampleInput: 'BABA',
    fromLabel: 'Hexadecimal (Base-16)',
    toLabel: 'Octal (Base-8)',
    swapToolId: 'oct-to-hex',
    explanation: 'Translates hexadecimal characters first to binary structures or base-10 indices, and reformulates that scale to base-8.'
  },
  'oct-to-hex': {
    title: 'Octal to HEX Converter',
    placeholder: 'Enter base-8 octal digits (e.g., 177)',
    sampleInput: '13527',
    fromLabel: 'Octal (Base-8)',
    toLabel: 'Hexadecimal (Base-16)',
    swapToolId: 'hex-to-oct',
    explanation: 'Translates base-8 characters to standard base-10 numbers, and converts the resulting integer sequence to base-16.'
  },
  'txt-to-oct': {
    title: 'Text to Octal Converter',
    placeholder: 'Enter custom text message',
    sampleInput: 'Terminal',
    fromLabel: 'Human Text',
    toLabel: 'Octal Codes (Space-separated)',
    swapToolId: 'oct-to-txt',
    explanation: 'Converts letters to base-10 byte values, then formats each code into its corresponding 3-digit octal notation.'
  },
  'oct-to-txt': {
    title: 'Octal to Text Converter',
    placeholder: 'Enter octal chunks (e.g., 124 145 155)',
    sampleInput: '124 145 155 160 154 141 164 145',
    fromLabel: 'Octal Bytes',
    toLabel: 'Text Outcome',
    swapToolId: 'txt-to-oct',
    explanation: 'Translates space-separated octal integers back to standard base-10 values to display Unicode text symbols.'
  },
  'txt-to-hex': {
    title: 'Text to HEX Converter',
    placeholder: 'Enter string to encode in hex (e.g., Web)',
    sampleInput: 'Vite React',
    fromLabel: 'Plain Text Input',
    toLabel: 'Hexadecimal Stream',
    swapToolId: 'hex-to-txt',
    explanation: 'Translates raw symbols into their Unicode decimal numbers and displays them as clean 2-digit hex keys.'
  },
  'hex-to-txt': {
    title: 'HEX to Text Converter',
    placeholder: 'Enter space-separated hex codes (e.g., 56 69 74 65)',
    sampleInput: '56 69 74 65 20 52 65 61 63 74',
    fromLabel: 'Hexadecimal Chunks',
    toLabel: 'Literal Text',
    swapToolId: 'txt-to-hex',
    explanation: 'Transforms safe space-separated or raw sequential hex streams into active plain text characters.'
  },
  'txt-to-dec': {
    title: 'Text to Decimal Converter',
    placeholder: 'Enter text to analyze',
    sampleInput: 'Code',
    fromLabel: 'Plain Text',
    toLabel: 'Decimal Integers (Space-separated)',
    swapToolId: 'dec-to-txt',
    explanation: 'Provides a clean decimal index conversion output representing character sets in the computer memory registries.'
  },
  'dec-to-txt': {
    title: 'Decimal to Text Converter',
    placeholder: 'Enter space-separated decimal indexes',
    sampleInput: '67 111 100 101',
    fromLabel: 'Decimal Array',
    toLabel: 'Readable Text',
    swapToolId: 'txt-to-dec',
    explanation: 'Assembles space-separated base-10 integers back into readable character strings.'
  }
};

export function BinaryTools({ activeToolId, isDark }: BinaryToolsProps) {
  const config = CONVERTERS_CONFIG[activeToolId] || CONVERTERS_CONFIG['txt-to-bin'];

  const [inputVal, setInputVal] = useState<string>('');
  const [outputVal, setOutputVal] = useState<string>('');
  const [stepsList, setStepsList] = useState<React.ReactNode | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Playground States
  const [playDec, setPlayDec] = useState<string>('255');
  const [playBin, setPlayBin] = useState<string>('11111111');
  const [playOct, setPlayOct] = useState<string>('377');
  const [playHex, setPlayHex] = useState<string>('FF');

  // Trigger default sample on load or swap tool change
  useEffect(() => {
    setInputVal(config.sampleInput);
  }, [activeToolId]);

  // Execute actual real-time mathematical conversions
  useEffect(() => {
    if (!inputVal.trim()) {
      setOutputVal('');
      setStepsList(null);
      return;
    }

    try {
      const result = runConversion(activeToolId, inputVal);
      setOutputVal(result.output);
      setStepsList(result.stepsElement || null);
    } catch (e: any) {
      setOutputVal(`Conversion Error: ${e.message || 'Invalid characters entered for this base.'}`);
      setStepsList(
        <div className="p-3 bg-red-950/20 border border-red-500/10 text-red-400 rounded-lg text-xs font-mono">
          <strong>Syntax Check:</strong> The current input values do not align with constraints. Please make sure there are no illegal numeric symbols according to the current radix system.
        </div>
      );
    }
  }, [inputVal, activeToolId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    // Navigate safely using URLSearchParams or triggering custom state if applicable.
    // We update URL params to change active tool for instant refresh
    const params = new URLSearchParams(window.location.search);
    params.set('tool', config.swapToolId);
    window.history.pushState({}, '', `/?${params.toString()}`);
    // Trigger popstate event or window refresh or allow user to click standard categories.
    // For single-view reliability within AI Studio, we dispatch an event or let App hook do navigation
    window.dispatchEvent(new Event('popstate'));
  };

  const t = {
    heading: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textFaint: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-white/5' : 'border-gray-200',
    panelBg: isDark ? 'bg-[#18181b]/95 border-white/5' : 'bg-white border-gray-200',
    inputBg: isDark ? 'bg-[#09090b] border-white/5 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400',
    outputBg: isDark ? 'bg-[#0c0c0e] border-white/5 text-emerald-400' : 'bg-gray-50 border-gray-200 text-emerald-600',
    stepCard: isDark ? 'bg-[#0d0d0f] border-white/5' : 'bg-gray-50 border-gray-200',
    stepBg: isDark ? 'bg-[#09090a] border-white/5' : 'bg-gray-50 border-gray-200',
    label: isDark ? 'text-gray-500' : 'text-gray-400',
    copyBtn: isDark ? 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/5' : 'text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border-gray-200',
    sampleBtn: isDark ? 'text-gray-400 hover:text-emerald-400 bg-white/5 border-white/5' : 'text-gray-500 hover:text-emerald-600 bg-gray-100 border-gray-200',
  };

  // Convert custom base play values
  const handlePlaygroundChange = (type: 'dec' | 'bin' | 'oct' | 'hex', val: string) => {
    const cleaned = val.trim();
    if (!cleaned) {
      if (type === 'dec') setPlayDec('');
      if (type === 'bin') setPlayBin('');
      if (type === 'oct') setPlayOct('');
      if (type === 'hex') setPlayHex('');
      return;
    }

    try {
      let num = 0;
      if (type === 'dec') {
        setPlayDec(val);
        num = parseInt(cleaned, 10);
      } else if (type === 'bin') {
        setPlayBin(val);
        if (/[^01]/.test(cleaned)) return;
        num = parseInt(cleaned, 2);
      } else if (type === 'oct') {
        setPlayOct(val);
        if (/[^0-7]/.test(cleaned)) return;
        num = parseInt(cleaned, 8);
      } else if (type === 'hex') {
        setPlayHex(val);
        if (/[^0-9a-fA-F]/.test(cleaned)) return;
        num = parseInt(cleaned, 16);
      }

      if (!isNaN(num)) {
        if (type !== 'dec') setPlayDec(num.toString(10));
        if (type !== 'bin') setPlayBin(num.toString(2));
        if (type !== 'oct') setPlayOct(num.toString(8));
        if (type !== 'hex') setPlayHex(num.toString(16).toUpperCase());
      }
    } catch (e) {
      // Ignore conversion failures inside direct typing
    }
  };

  // The comprehensive mathematical conversion engine
  const runConversion = (id: string, raw: string): { output: string; stepsElement: React.ReactNode } => {
    switch (id) {
      case 'txt-to-bin': {
        const chars = Array.from(raw);
        const codes = chars.map(c => c.charCodeAt(0));
        const binaries = codes.map(c => c.toString(2).padStart(8, '0'));
        
        const steps = (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">UTF-8 Character Byte Mapping</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
              {chars.map((char, index) => (
                <div key={index} className={`p-2 border rounded flex justify-between ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>'{char}' &rarr; {codes[index]}</span>
                  <strong className={isDark ? "text-white" : "text-gray-900"}>{binaries[index]}</strong>
                </div>
              ))}
            </div>
          </div>
        );
        return { output: binaries.join(' '), stepsElement: steps };
      }

      case 'bin-to-txt': {
        const cleanBinary = raw.replace(/[^01\s]/g, '');
        // Split by whitespace. If no spaces, chunk by 8-bits
        let blocks: string[] = [];
        if (/\s/.test(cleanBinary.trim())) {
          blocks = cleanBinary.trim().split(/\s+/);
        } else {
          for (let i = 0; i < cleanBinary.length; i += 8) {
            blocks.push(cleanBinary.substring(i, i + 8));
          }
        }

        const characters = blocks.map(b => {
          if (!b) return '';
          const code = parseInt(b, 2);
          return isNaN(code) ? '' : String.fromCharCode(code);
        });

        const steps = (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono font-bold">Bit Chunks to Glyph Transcription</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
              {blocks.map((b, idx) => (
                <div key={idx} className={`p-2 border rounded flex justify-between ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                  <span className="text-gray-500">{b}</span>
                  <strong className="text-emerald-400">&rarr; '{characters[idx] || '?'}'</strong>
                </div>
              ))}
            </div>
          </div>
        );

        return { output: characters.join(''), stepsElement: steps };
      }

      case 'hex-to-bin': {
        const cleanHex = raw.replace(/[^0-9a-fA-F]/g, '');
        const binaries = Array.from(cleanHex).map(char => {
          const bin = parseInt(char, 16).toString(2).padStart(4, '0');
          return bin;
        });

        const steps = (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">Nibble Breakdown (Base-16 &rarr; Base-2)</h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[11px] font-mono">
              {Array.from(cleanHex).map((char, index) => (
                <div key={index} className={`p-2 border rounded text-center ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                  <span className="text-cyan-400 font-bold text-xs">{char}</span>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">({parseInt(char, 16)})</div>
                  <div className="mt-1 text-white font-bold text-[10px]">{binaries[index]}</div>
                </div>
              ))}
            </div>
          </div>
        );

        // Group into sets of 2 nibbles for byte layout readability
        const formattedOutput: string[] = [];
        for (let i = 0; i < binaries.length; i += 2) {
          if (binaries[i + 1]) {
            formattedOutput.push(binaries[i] + binaries[i + 1]);
          } else {
            formattedOutput.push(binaries[i]);
          }
        }

        return { output: formattedOutput.join(' '), stepsElement: steps };
      }

      case 'bin-to-hex': {
        const cleanBin = raw.replace(/[^01]/g, '');
        // Pad binary stream to multiple of 4
        const padLen = (4 - (cleanBin.length % 4)) % 4;
        const padded = '0'.repeat(padLen) + cleanBin;

        const nibbles: string[] = [];
        const hexDigits: string[] = [];
        for (let i = 0; i < padded.length; i += 4) {
          const chunk = padded.substring(i, i + 4);
          nibbles.push(chunk);
          hexDigits.push(parseInt(chunk, 2).toString(16).toUpperCase());
        }

        const steps = (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono">Nibble Gathering Translation</h4>
            {padLen > 0 && (
              <p className="text-[10px] text-gray-500 font-mono">Left-padded with {padLen} zeros to fulfill exact 4-bit nibble blocks.</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
              {nibbles.map((nib, index) => (
                <div key={index} className={`p-2 border rounded flex justify-between items-center ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                  <span className="text-gray-450">{nib}</span>
                  <span className="text-xs text-gray-600 font-bold">&rarr;</span>
                  <strong className="text-indigo-400 text-xs">{hexDigits[index]}</strong>
                </div>
              ))}
            </div>
          </div>
        );

        return { output: hexDigits.join(''), stepsElement: steps };
      }

      case 'ascii-to-bin': {
        // Support either decimal ASCII list (65 66) OR raw ASCII text structure
        const isNumericList = /^[0-9\s,]+$/.test(raw.trim());
        let codes: number[] = [];
        if (isNumericList) {
          codes = raw.trim().split(/[\s,]+/).map(x => parseInt(x, 10)).filter(num => !isNaN(num) && num >= 0 && num <= 255);
        } else {
          codes = Array.from(raw).map(c => c.charCodeAt(0));
        }

        const binaries = codes.map(c => c.toString(2).padStart(8, '0'));

        const steps = (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider font-mono">ASCII Standard Map Matrix</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
              {codes.map((val, i) => (
                <div key={i} className={`p-2 border rounded flex justify-between ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                  <span className="text-gray-400">ASCII {val} (char: '{String.fromCharCode(val)}')</span>
                  <strong className={isDark ? "text-white" : "text-gray-900"}>{binaries[i]}</strong>
                </div>
              ))}
            </div>
          </div>
        );

        return { output: binaries.join(' '), stepsElement: steps };
      }

      case 'bin-to-ascii': {
        const cleanBin = raw.replace(/[^01\s]/g, '');
        let blocks: string[] = [];
        if (/\s/.test(cleanBin.trim())) {
          blocks = cleanBin.trim().split(/\s+/);
        } else {
          for (let i = 0; i < cleanBin.length; i += 8) {
            blocks.push(cleanBin.substring(i, i + 8));
          }
        }

        const codes = blocks.map(b => parseInt(b, 2));
        const chars = codes.map(c => (isNaN(c) || c > 255) ? '?' : String.fromCharCode(c));

        const steps = (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider font-mono">Register Code Translation Matrix</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
              {blocks.map((block, i) => (
                <div key={i} className={`p-2 border rounded flex justify-between items-center text-[10px] ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                  <span className="text-gray-500">{block}</span>
                  <span className="text-gray-4s text-amber-500 font-bold">&rarr; Code {codes[i]}</span>
                  <strong className="text-white">'{chars[i]}'</strong>
                </div>
              ))}
            </div>
          </div>
        );

        return { output: chars.join(''), stepsElement: steps };
      }

      case 'dec-to-bin': {
        const cleanDec = raw.replace(/[^0-9.]/g, '');
        if (cleanDec.includes('.')) {
          const [intStr, fracStr] = cleanDec.split('.');
          const intVal = parseInt(intStr, 10) || 0;
          const fracVal = parseFloat('0.' + fracStr) || 0.0;

          // Integer part
          const intBin = intVal.toString(2);
          
          // Fractional part multiplication
          let tempFrac = fracVal;
          const fracBinChars: string[] = [];
          const fracSteps: string[] = [];
          
          for (let i = 0; i < 8; i++) {
            const multiplied = tempFrac * 2;
            const bit = Math.floor(multiplied);
            fracBinChars.push(bit.toString());
            fracSteps.push(`${tempFrac.toFixed(4)} * 2 = ${multiplied.toFixed(4)} (Bit: ${bit})`);
            tempFrac = multiplied - bit;
            if (tempFrac === 0) break;
          }

          const steps = (
            <div className="space-y-2 font-mono text-xs">
              <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Mixed Decimal Math Stack</h4>
              <div className={`p-3 border rounded-lg space-y-1 ${isDark ? "bg-[#0d0d0f] border-white/5 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
                <p><span className="text-gray-500">Integer:</span> {intVal} &rarr; <strong>{intBin}</strong></p>
                <p className="text-gray-500 mt-2">Fraction Binary Synthesis:</p>
                {fracSteps.map((s, idx) => (
                  <div key={idx} className="text-[10px] text-gray-400 pl-2 border-l border-white/5">{s}</div>
                ))}
                <p className="mt-1"><span className="text-gray-500">Fraction Output:</span> 0.{fracBinChars.join('')}</p>
              </div>
            </div>
          );

          return { output: `${intBin}.${fracBinChars.join('')}`, stepsElement: steps };
        } else {
          const val = parseInt(cleanDec, 10);
          if (isNaN(val)) return { output: '', stepsElement: <div /> };

          const stepsArr: string[] = [];
          let temp = val;
          if (temp === 0) {
            stepsArr.push('0 / 2 = 0 with remainder 0');
          }
          while (temp > 0) {
            const rem = temp % 2;
            stepsArr.push(`${temp} / 2 = ${Math.floor(temp / 2)} (Remainder: ${rem})`);
            temp = Math.floor(temp / 2);
          }

          const steps = (
            <div className="space-y-2 font-mono text-xs">
              <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Base-2 Division Algorithm (Remainders read bottom-to-top)</h4>
              <div className={`p-3 border rounded-lg space-y-1 ${isDark ? "bg-[#0d0d0f] border-white/5 text-gray-400" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
                {stepsArr.map((s, idx) => (
                  <div key={idx} className={`border-b pb-1 last:border-0 ${isDark ? 'border-white/5' : 'border-gray-200'}`}>{s}</div>
                ))}
              </div>
            </div>
          );

          return { output: val.toString(2), stepsElement: steps };
        }
      }

      case 'bin-to-dec': {
        const cleanBin = raw.replace(/[^01.]/g, '');
        if (cleanBin.includes('.')) {
          const [intPart, fracPart] = cleanBin.split('.');
          const intDec = parseInt(intPart, 2) || 0;
          
          let fracDec = 0.0;
          const powerSteps: string[] = [];
          for (let i = 0; i < fracPart.length; i++) {
            const bit = parseInt(fracPart[i], 10);
            const term = bit * Math.pow(2, -(i + 1));
            fracDec += term;
            powerSteps.push(`Bit [${i + 1}] &rarr; ${bit} * 2^-${i + 1} = ${term}`);
          }

          const steps = (
            <div className="space-y-2 font-mono text-[11px] text-gray-400">
              <h4 className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Dynamic Place-Value Summations</h4>
              <div className={`p-3 border rounded-lg space-y-1 ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                <p><span className="text-gray-500">Integer base decimal:</span> {intDec}</p>
                <div className="space-y-1 mt-1 text-[10px]">
                  {powerSteps.map((p, idx) => (
                    <div key={idx} dangerouslySetInnerHTML={{ __html: p }} />
                  ))}
                </div>
                <p className={`pt-2 border-t font-bold ${isDark ? 'border-white/5 text-white' : 'border-gray-200 text-gray-900'}`}>Sum: {(intDec + fracDec).toString()}</p>
              </div>
            </div>
          );

          return { output: (intDec + fracDec).toString(), stepsElement: steps };
        } else {
          const decimalVal = parseInt(cleanBin, 2);
          if (isNaN(decimalVal)) return { output: '', stepsElement: <div /> };

          const placeValues = Array.from(cleanBin).reverse().map((char, index) => {
            const active = char === '1';
            const val = active ? Math.pow(2, index) : 0;
            return { index, active, val };
          });

          const steps = (
            <div className="space-y-2 font-mono text-[11px] text-gray-400">
              <h4 className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Base-2 Positional Power Matrix</h4>
              <div className="flex flex-wrap gap-1.5 matches">
                {placeValues.reverse().map((item, idx) => (
                  <div key={idx} className={`p-1.5 border text-center rounded flex-1 min-w-[50px] ${item.active ? 'border-teal-500/20 bg-teal-500/5 text-white' : 'border-white/5 text-gray-600'}`}>
                    <div className="text-[9px] font-bold">2^{item.index}</div>
                    <div className="text-[10px] text-gray-500">({Math.pow(2, item.index)})</div>
                    <div className="text-xs font-mono font-bold mt-1">{item.active ? '1' : '0'}</div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-500">Sum of active registers: {placeValues.filter(v => v.active).map(v => v.val).join(' + ')} = <strong className="text-white">{decimalVal}</strong></p>
            </div>
          );

          return { output: decimalVal.toString(), stepsElement: steps };
        }
      }

      case 'txt-to-ascii': {
        const codes = Array.from(raw).map(c => c.charCodeAt(0));
        
        const steps = (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            {Array.from(raw).map((char, index) => (
              <div key={index} className={`p-2 border rounded flex justify-between ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                <span className="text-gray-400">'{char}' &rarr;</span>
                <strong className="text-purple-400">{codes[index]}</strong>
              </div>
            ))}
          </div>
        );
        return { output: codes.join(' '), stepsElement: steps };
      }

      case 'ascii-to-txt': {
        const codes = raw.trim().split(/[\s,]+/).map(x => parseInt(x, 10)).filter(num => !isNaN(num));
        const text = codes.map(c => String.fromCharCode(c)).join('');

        const steps = (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            {codes.map((code, index) => (
              <div key={index} className={`p-2 border rounded flex justify-between ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                <span className="text-gray-500">Code {code} &rarr;</span>
                <strong className="text-white">'{String.fromCharCode(code)}'</strong>
              </div>
            ))}
          </div>
        );
        return { output: text, stepsElement: steps };
      }

      case 'hex-to-dec': {
        const hex = raw.replace(/[^0-9a-fA-F]/g, '');
        const dec = parseInt(hex, 16);
        if (isNaN(dec)) return { output: '', stepsElement: <div /> };

        const terms = Array.from(hex).reverse().map((char, index) => {
          const val = parseInt(char, 16);
          const weight = Math.pow(16, index);
          return { char, val, index, weight, term: val * weight };
        });

        const steps = (
          <div className="space-y-2 font-mono text-[11px] text-gray-400">
            <h4 className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Base-16 Matrix Multiplication Sums</h4>
            <div className="space-y-1">
              {terms.reverse().map((t, idx) => (
                <div key={idx} className="flex justify-between border-b border-white/5 pb-0.5">
                  <span>Digit [{t.char}] &times; 16^{t.index}</span>
                  <span>{t.val} &times; {t.weight.toLocaleString()} = <strong className="text-white">{t.term.toLocaleString()}</strong></span>
                </div>
              ))}
            </div>
            <p className="pt-1.5 text-right text-xs">Total: <strong className="text-white">{dec.toLocaleString()}</strong></p>
          </div>
        );

        return { output: dec.toString(10), stepsElement: steps };
      }

      case 'dec-to-hex': {
        const decimalStr = raw.replace(/[^0-9]/g, '');
        const decimalNum = parseInt(decimalStr, 10);
        if (isNaN(decimalNum)) return { output: '', stepsElement: <div /> };

        const stepsArr: string[] = [];
        let temp = decimalNum;
        if (temp === 0) {
          stepsArr.push('0 / 16 = 0 with remainder 0');
        }
        while (temp > 0) {
          const rem = temp % 16;
          const remHex = rem.toString(16).toUpperCase();
          stepsArr.push(`${temp} / 16 = ${Math.floor(temp / 16)} (Remainder: ${rem} &rarr; ${remHex})`);
          temp = Math.floor(temp / 16);
        }

        const steps = (
          <div className="space-y-2 font-mono text-xs">
            <h4 className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Hexadecimal division remainders</h4>
            <div className={`p-3 border rounded-lg space-y-1 ${isDark ? "bg-[#0d0d0f] border-white/5 text-gray-400" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
              {stepsArr.map((s, idx) => (
                <div key={idx} className={`border-b pb-1 last:border-0 ${isDark ? 'border-white/5' : 'border-gray-200'}`}>{s}</div>
              ))}
            </div>
          </div>
        );

        return { output: decimalNum.toString(16).toUpperCase(), stepsElement: steps };
      }

      case 'oct-to-bin': {
        const octStr = raw.replace(/[^0-7]/g, '');
        const binaries = Array.from(octStr).map(d => parseInt(d, 8).toString(2).padStart(3, '0'));

        const steps = (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[11px] font-mono text-center">
            {Array.from(octStr).map((d, i) => (
              <div key={i} className={`p-2 border rounded ${isDark ? 'bg-[#0d0d0f] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <span className={`font-bold block ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Octal {d}</span>
                <span className="text-sky-400 font-mono text-xs font-bold block mt-1">{binaries[i]}</span>
              </div>
            ))}
          </div>
        );

        return { output: binaries.join(' '), stepsElement: steps };
      }

      case 'bin-to-oct': {
        const binStr = raw.replace(/[^01]/g, '');
        const padLen = (3 - (binStr.length % 3)) % 3;
        const paddedBinary = '0'.repeat(padLen) + binStr;

        const chunks: string[] = [];
        const octals: string[] = [];
        for (let i = 0; i < paddedBinary.length; i += 3) {
          const chunk = paddedBinary.substring(i, i + 3);
          chunks.push(chunk);
          octals.push(parseInt(chunk, 2).toString(8));
        }

        const steps = (
          <div className="space-y-2 font-mono text-[11px] text-gray-400">
            <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Binary Group-of-3 Triplet Conversions</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {chunks.map((chk, index) => (
                <div key={index} className={`p-2 border rounded flex justify-between ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                  <span>{chk}</span>
                  <strong className="text-blue-400">&rarr; Octal {octals[index]}</strong>
                </div>
              ))}
            </div>
          </div>
        );

        return { output: octals.join(''), stepsElement: steps };
      }

      case 'oct-to-dec': {
        const octStr = raw.replace(/[^0-7]/g, '');
        const decimalNum = parseInt(octStr, 8);
        if (isNaN(decimalNum)) return { output: '', stepsElement: <div /> };

        const sumTerms = Array.from(octStr).reverse().map((d, index) => {
          const val = parseInt(d, 8);
          return { digit: d, power: index, totalVal: val * Math.pow(8, index) };
        });

        const steps = (
          <div className="space-y-1.5 font-mono text-xs text-gray-450">
            {sumTerms.reverse().map((item, id) => (
              <div key={id} className="flex justify-between border-b border-white/5 pb-0.5">
                <span>Octal Digit {item.digit} &times; 8^{item.power}:</span>
                <span className="text-white">{item.totalVal}</span>
              </div>
            ))}
            <p className="text-right font-bold text-teal-400 mt-2">Combined Decimal Sum: {decimalNum}</p>
          </div>
        );

        return { output: decimalNum.toString(10), stepsElement: steps };
      }

      case 'dec-to-oct': {
        const decStr = raw.replace(/[^0-9]/g, '');
        const decVal = parseInt(decStr, 10);
        if (isNaN(decVal)) return { output: '', stepsElement: <div /> };

        const stepsArr: string[] = [];
        let temp = decVal;
        if (temp === 0) {
          stepsArr.push('0 / 8 = 0 with remainder 0');
        }
        while (temp > 0) {
          const rem = temp % 8;
          stepsArr.push(`${temp} / 8 = ${Math.floor(temp / 8)} (Remainder: ${rem})`);
          temp = Math.floor(temp / 8);
        }

        const steps = (
          <div className="space-y-2 font-mono text-xs text-gray-400">
            <h4 className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Base-8 Continual Division Remainder Track</h4>
            <div className={`space-y-1 p-3 rounded-lg ${isDark ? 'bg-[#0d0d0f]' : 'bg-gray-50 border border-gray-200'}`}>
              {stepsArr.map((v, i) => (
                <p key={i} className="border-b border-light/5 pb-0.5">{v}</p>
              ))}
            </div>
          </div>
        );

        return { output: decVal.toString(8), stepsElement: steps };
      }

      case 'hex-to-oct': {
        const hexStr = raw.replace(/[^0-9a-fA-F]/g, '');
        const decNum = parseInt(hexStr, 16);
        if (isNaN(decNum)) return { output: '', stepsElement: <div /> };
        const octStr = decNum.toString(8);

        const steps = (
          <div className={`p-3 border rounded-lg space-y-1 text-xs font-mono ${isDark ? 'bg-[#0d0d0f] border-white/5 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
            <p><span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Step 1: Convert Hex to Integer:</span> {hexStr}<sub>(16)</sub> &rarr; {decNum}<sub>(10)</sub></p>
            <p><span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Step 2: Convert Integer to Octal:</span> {decNum}<sub>(10)</sub> &rarr; <strong>{octStr}<sub>(8)</sub></strong></p>
          </div>
        );

        return { output: octStr, stepsElement: steps };
      }

      case 'oct-to-hex': {
        const octStr = raw.replace(/[^0-7]/g, '');
        const decNum = parseInt(octStr, 8);
        if (isNaN(decNum)) return { output: '', stepsElement: <div /> };
        const hexStr = decNum.toString(16).toUpperCase();

        const steps = (
          <div className={`p-3 border rounded-lg space-y-1 text-xs font-mono ${isDark ? 'bg-[#0d0d0f] border-white/5 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
            <p><span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Step 1: Convert Octal to Integer:</span> {octStr}<sub>(8)</sub> &rarr; {decNum}<sub>(10)</sub></p>
            <p><span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Step 2: Convert Integer to Hexidecimal:</span> {decNum}<sub>(10)</sub> &rarr; <strong>{hexStr}<sub>(16)</sub></strong></p>
          </div>
        );
        return { output: hexStr, stepsElement: steps };
      }

      case 'txt-to-oct': {
        const chars = Array.from(raw);
        const codes = chars.map(c => c.charCodeAt(0));
        const octvals = codes.map(c => c.toString(8).padStart(3, '0'));

        const steps = (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
            {chars.map((char, index) => (
              <div key={index} className={`p-2 border rounded flex justify-between ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                <span>'{char}'</span>
                <span className="text-sky-400">{codes[index]}<sub>(10)</sub> &rarr; <strong>{octvals[index]}<sub>(8)</sub></strong></span>
              </div>
            ))}
          </div>
        );

        return { output: octvals.join(' '), stepsElement: steps };
      }

      case 'oct-to-txt': {
        const octCodes = raw.trim().split(/\s+/).map(x => parseInt(x, 8)).filter(num => !isNaN(num));
        const characters = octCodes.map(c => String.fromCharCode(c)).join('');

        const steps = (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
            {octCodes.map((c, i) => (
              <div key={i} className={`p-2 border rounded flex justify-between ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                <span>Octal {c.toString(8)} &rarr; Code {c}</span>
                <strong className="text-white">'{String.fromCharCode(c)}'</strong>
              </div>
            ))}
          </div>
        );

        return { output: characters, stepsElement: steps };
      }

      case 'txt-to-hex': {
        const chars = Array.from(raw);
        const hexStr = chars.map(c => c.charCodeAt(0).toString(16).toUpperCase());

        const steps = (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
            {chars.map((c, i) => (
              <div key={i} className={`p-2 border rounded flex justify-between ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                <span className="text-gray-500">'{c}'</span>
                <strong className="text-[#bfdbfe]">{hexStr[i]}</strong>
              </div>
            ))}
          </div>
        );

        return { output: hexStr.join(' '), stepsElement: steps };
      }

      case 'hex-to-txt': {
        const cleanHex = raw.replace(/[^0-9a-fA-F\s]/g, '');
        let chunks: string[] = [];
        if (/\s/.test(cleanHex.trim())) {
          chunks = cleanHex.trim().split(/\s+/);
        } else {
          for (let i = 0; i < cleanHex.length; i += 2) {
            chunks.push(cleanHex.substring(i, i + 2));
          }
        }

        const characters = chunks.map(chunk => {
          const code = parseInt(chunk, 16);
          return isNaN(code) ? '' : String.fromCharCode(code);
        });

        const steps = (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
            {chunks.map((chk, i) => (
              <div key={i} className={`p-2 border rounded flex justify-between ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                <span className="text-gray-500">0x{chk}</span>
                <strong className="text-white">'{characters[i]}'</strong>
              </div>
            ))}
          </div>
        );

        return { output: characters.join(''), stepsElement: steps };
      }

      case 'txt-to-dec': {
        const codes = Array.from(raw).map(c => c.charCodeAt(0));
        const steps = (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
            {Array.from(raw).map((char, index) => (
              <div key={index} className={`p-2 border rounded flex justify-between ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                <span>'{char}'</span>
                <strong className="text-emerald-400">{codes[index]}</strong>
              </div>
            ))}
          </div>
        );
        return { output: codes.join(' '), stepsElement: steps };
      }

      case 'dec-to-txt': {
        const codes = raw.trim().split(/\s+/).map(x => parseInt(x, 10)).filter(num => !isNaN(num));
        const text = codes.map(c => String.fromCharCode(c)).join('');

        const steps = (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono text-[10px]">
            {codes.map((code, index) => (
              <div key={index} className={`p-2 border rounded flex justify-between ${isDark ? "bg-[#0d0d0f] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                <span>Decimal {code} &rarr;</span>
                <strong className="text-white">'{String.fromCharCode(code)}'</strong>
              </div>
            ))}
          </div>
        );

        return { output: text, stepsElement: steps };
      }

      default:
        return { output: '', stepsElement: <div /> };
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Conversion Panel */}
      <div id="binary-main-panel" className={`relative p-6 border rounded-2xl shadow-xl space-y-6 ${t.panelBg}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className={`text-base font-semibold tracking-tight flex items-center gap-2 select-none ${t.heading}`}>
              <Icons.Binary className="w-5 h-5 text-emerald-400" />
              {config.title}
            </h2>
            <p className={`text-xs mt-1 ${t.textMuted}`}>{config.explanation}</p>
          </div>
          <button
            onClick={handleSwap}
            className="flex items-center gap-2 p-2 px-3 text-xs font-medium text-emerald-300 hover:text-white bg-emerald-900/10 hover:bg-emerald-900/20 rounded-lg border border-emerald-500/10 transition-all font-mono"
          >
            <Icons.ArrowRightLeft className="w-3.5 h-3.5" />
            Swap Direction
          </button>
        </div>

        {/* Input Box and Output Box in grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
              <span className={t.label}>{config.fromLabel}</span>
              <span className={t.label}>{inputVal.length} Characters • {new Blob([inputVal]).size} Bytes</span>
            </div>
            <div className="relative">
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={config.placeholder}
                rows={6}
                className={`w-full p-4 border rounded-xl text-[13px] font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-colors ${t.inputBg}`}
              />
              {inputVal && (
                <button
                  onClick={() => setInputVal('')}
                  className={`absolute right-3 top-3 p-1 rounded transition-all ${isDark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                  title="Clear input"
                >
                  <Icons.X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => setInputVal(config.sampleInput)}
                className={`text-[10px] font-mono p-1.5 px-3 rounded border transition-colors ${t.sampleBtn}`}
              >
                Insert Sample Data
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
              <span className={t.label}>{config.toLabel}</span>
              <span className={t.label}>Converted Result</span>
            </div>
            <textarea
              readOnly
              value={outputVal}
              placeholder="Conversion outcome generates instantly..."
              rows={6}
              className={`w-full p-4 border rounded-xl text-[13px] font-mono focus:outline-none ${t.outputBg} ${isDark ? 'placeholder:text-gray-700' : 'placeholder:text-gray-400'}`}
            />
            <div className="flex justify-end gap-2 pt-1">
              {outputVal && !outputVal.startsWith('Conversion Error') && (
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 text-[10px] font-mono p-1.5 px-3 rounded border transition-colors ${t.copyBtn}`}
                >
                  {copied ? (
                    <>
                      <Icons.Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Icons.Copy className="w-3.5 h-3.5" />
                      <span>Copy Output</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Step-by-Step Breakdown section */}
        {stepsList && (
          <div className={`border-t pt-5 space-y-3 ${t.border}`}>
            <div className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest ${t.textFaint}`}>
              <Icons.Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-time Logical Breakdown</span>
            </div>
            <div className={`p-4 border rounded-xl ${t.stepBg}`}>
              {stepsList}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Global Base Conversion Playground (Extremely cool for techies and students!) */}
      <div id="base-converter-playground" className={`p-6 border rounded-2xl shadow-xl space-y-4 ${t.panelBg}`}>
        <div>
          <h3 className={`text-sm font-semibold tracking-tight flex items-center gap-2 select-none ${t.heading}`}>
            <Icons.Sliders className="w-4 h-4 text-emerald-400" />
            Live Base Converter Playground
          </h3>
          <p className={`text-xs mt-0.5 ${t.textFaint}`}>Type any value in any of the fields below; all corresponding radices adjust automatically in real-time!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${t.label}`}>Decimal (Base-10)</label>
            <input
              type="text"
              value={playDec}
              onChange={(e) => handlePlaygroundChange('dec', e.target.value)}
              placeholder="e.g. 255"
              className={`w-full p-2.5 border rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-500/40 ${t.inputBg}`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${t.label}`}>Binary (Base-2)</label>
            <input
              type="text"
              value={playBin}
              onChange={(e) => handlePlaygroundChange('bin', e.target.value)}
              placeholder="e.g. 11111111"
              className={`w-full p-2.5 border rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-500/40 ${t.inputBg}`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${t.label}`}>Octal (Base-8)</label>
            <input
              type="text"
              value={playOct}
              onChange={(e) => handlePlaygroundChange('oct', e.target.value)}
              placeholder="e.g. 377"
              className={`w-full p-2.5 border rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-500/40 ${t.inputBg}`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${t.label}`}>Hexadecimal (Base-16)</label>
            <input
              type="text"
              value={playHex}
              onChange={(e) => handlePlaygroundChange('hex', e.target.value)}
              placeholder="e.g. FF"
              className={`w-full p-2.5 border rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-500/40 ${t.inputBg}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
