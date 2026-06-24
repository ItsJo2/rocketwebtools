import React, { useState } from 'react';
import { 
  Calendar, 
  Percent, 
  Coins, 
  DollarSign, 
  CreditCard,
  Sigma,
  TrendingUp,
  Dices,
  Trash2,
  RefreshCw,
  Plus,
  Compass,
  ArrowRight,
  Tag,
  Home,
  CalendarDays,
  Clock,
  CalendarRange,
  Wallet,
  Flame,
  Activity,
  Calculator
} from 'lucide-react';
import * as Icons from 'lucide-react';

const exportResultsAsPDF = (title: string, results: { label: string; value: string }[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title} — Rocket Web Tools</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
          padding: 40px; 
          color: #111;
          max-width: 600px;
          margin: 0 auto;
        }
        .header { 
          border-bottom: 2px solid #f97316; 
          padding-bottom: 16px; 
          margin-bottom: 24px; 
        }
        .brand { 
          font-size: 11px; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 0.1em; 
          color: #f97316; 
          margin-bottom: 6px;
          font-family: monospace;
        }
        .title { 
          font-size: 22px; 
          font-weight: 900; 
          color: #111;
        }
        .date { 
          font-size: 11px; 
          color: #888; 
          margin-top: 4px;
          font-family: monospace;
        }
        .results { margin-top: 8px; }
        .result-row { 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          padding: 12px 16px; 
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .result-row:nth-child(odd) { background: #f8f8f8; }
        .result-row:nth-child(even) { background: #fff; border: 1px solid #f0f0f0; }
        .result-label { 
          font-size: 13px; 
          color: #555; 
          font-weight: 500;
        }
        .result-value { 
          font-size: 14px; 
          font-weight: 800; 
          color: #111;
          text-align: right;
        }
        .footer { 
          margin-top: 32px; 
          padding-top: 16px; 
          border-top: 1px solid #eee;
          font-size: 10px; 
          color: #aaa; 
          text-align: center;
          font-family: monospace;
        }
        @media print {
          body { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">🚀 Rocket Web Tools</div>
        <div class="title">${title}</div>
        <div class="date">Generated on ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', month: 'long', day: 'numeric', 
          hour: '2-digit', minute: '2-digit' 
        })}</div>
      </div>
      <div class="results">
        ${results.map(r => `
          <div class="result-row">
            <span class="result-label">${r.label}</span>
            <span class="result-value">${r.value}</span>
          </div>
        `).join('')}
      </div>
      <div class="footer">
        rocketwebtools.com — Free browser-based calculators. Results are for estimation purposes only.
      </div>
      <script>
        window.onload = () => { window.print(); }
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
};

const copyResultsToClipboard = (title: string, results: { label: string; value: string }[]) => {
  const text = `${title} — Rocket Web Tools\n${'─'.repeat(40)}\n${
    results.map(r => `${r.label}: ${r.value}`).join('\n')
  }\n${'─'.repeat(40)}\nGenerated on ${new Date().toLocaleDateString()}`;
  navigator.clipboard.writeText(text);
};

const ExportBar = ({ 
  title, 
  results, 
  isDark 
}: { 
  title: string; 
  results: { label: string; value: string }[];
  isDark: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyResultsToClipboard(title, results);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-center gap-2 flex-wrap pt-4 mt-4 border-t ${
      isDark ? 'border-white/5' : 'border-gray-100'
    }`}>
      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest mr-1 ${
        isDark ? 'text-gray-500' : 'text-gray-400'
      }`}>Export</span>

      <button
        type="button"
        onClick={() => exportResultsAsPDF(title, results)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          isDark
            ? 'bg-white/3 border-white/8 text-gray-300 hover:text-white hover:bg-white/8'
            : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        }`}
      >
        <Icons.Printer className="w-3.5 h-3.5" />
        Print / Save PDF
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          copied
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : isDark
              ? 'bg-white/3 border-white/8 text-gray-300 hover:text-white hover:bg-white/8'
              : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        }`}
      >
        {copied
          ? <><Icons.Check className="w-3.5 h-3.5" /> Copied!</>
          : <><Icons.Copy className="w-3.5 h-3.5" /> Copy Results</>
        }
      </button>
    </div>
  );
};

export function CalculatorTools({ activeToolId, isDark = true }: { activeToolId: string; isDark?: boolean }) {
  if (activeToolId === 'age-calc') {
    return <AgeCalculator isDark={isDark} />;
  }
  if (activeToolId === 'percentage-calc') {
    return <PercentageCalculator isDark={isDark} />;
  }
  if (activeToolId === 'average-calc') {
    return <AverageCalculator isDark={isDark} />;
  }
  if (activeToolId === 'confidence-interval-calc') {
    return <ConfidenceIntervalCalculator />;
  }
  if (activeToolId === 'sales-tax-calc') {
    return <SalesTaxCalculator isDark={isDark} />;
  }
  if (activeToolId === 'margin-calc') {
    return <MarginCalculator isDark={isDark} />;
  }
  if (activeToolId === 'probability-calc') {
    return <ProbabilityCalculator />;
  }
  if (activeToolId === 'paypal-calc') {
    return <PaypalFeeCalculator isDark={isDark} />;
  }
  if (activeToolId === 'discount-calc') {
    return <DiscountCalculator isDark={isDark} />;
  }
  if (activeToolId === 'cpm-calc') {
    return <CpmCalculator />;
  }
  if (activeToolId === 'loan-calc') {
    return <LoanCalculator isDark={isDark} />;
  }
  if (activeToolId === 'gst-calc') {
    return <GstCalculator isDark={isDark} />;
  }
  if (activeToolId === 'days-calc') {
    return <DaysCalculator isDark={isDark} />;
  }
  if (activeToolId === 'hours-calc') {
    return <HoursCalculator isDark={isDark} />;
  }
  if (activeToolId === 'month-calc') {
    return <MonthCalculator />;
  }
  if (activeToolId === 'stripe-calc') {
    return <StripeFeeCalculator isDark={isDark} />;
  }
  if (activeToolId === 'calorie-calc' || activeToolId === 'tdee-calc') {
    return <CalorieAndTdeeCalculator isDark={isDark} activeToolId={activeToolId} />;
  }

  return null;
}

// 1. AGE CALCULATOR (ENHANCED STATE AND CHINESE ZODIAC)
function AgeCalculator({ isDark }: { isDark: boolean }) {
  const [birthdate, setBirthdate] = useState('');
  const [stats, setStats] = useState<{
    years: number;
    months: number;
    days: number;
    totalWeeks: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    zodiac: string;
    chineseZodiac: string;
    dayOfWeek: string;
    nextBirthday: number;
  } | null>(null);

  const getZodiac = (day: number, month: number) => {
    const zodiacs = [
      { name: "Capricorn ♑", start: "12-22", end: "01-19" },
      { name: "Aquarius ♒", start: "01-20", end: "02-18" },
      { name: "Pisces ♓", start: "02-19", end: "03-20" },
      { name: "Aries ♈", start: "03-21", end: "04-19" },
      { name: "Taurus ♉", start: "04-20", end: "05-20" },
      { name: "Gemini ♊", start: "05-21", end: "06-20" },
      { name: "Cancer ♋", start: "06-21", end: "07-22" },
      { name: "Leo ♌", start: "07-23", end: "08-22" },
      { name: "Virgo ♍", start: "08-23", end: "09-22" },
      { name: "Libra ♎", start: "09-23", end: "10-22" },
      { name: "Scorpio ♏", start: "10-23", end: "11-21" },
      { name: "Sagittarius ♐", start: "11-22", end: "12-21" }
    ];
    const dateFormatted = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const matched = zodiacs.find(z => {
      if (z.start <= z.end) {
        return dateFormatted >= z.start && dateFormatted <= z.end;
      }
      return dateFormatted >= z.start || dateFormatted <= z.end;
    });
    return matched ? matched.name : "Capricorn ♑";
  };

  const getChineseZodiac = (year: number) => {
    const animals = [
      "Rat 🐀", "Ox 🐂", "Tiger 🐅", "Rabbit 🐇", "Dragon 🐉", "Snake 🐍", 
      "Horse 🐎", "Goat 🐐", "Monkey 🐒", "Rooster 🐓", "Dog 🐕", "Pig 🐖"
    ];
    // Year 4 was Year of the Rat
    const index = (year - 4) % 12;
    return animals[index >= 0 ? index : index + 12];
  };

  const handleCalculate = () => {
    if (!birthdate) return;
    const birth = new Date(birthdate + 'T00:00:00');
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
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffTime / (1000 * 60));

    // Next birthday countdown
    const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const nextBdayDiff = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeekStr = weekdayNames[birth.getDay()];

    setStats({
      years,
      months,
      days,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      zodiac: getZodiac(birth.getDate(), birth.getMonth() + 1),
      chineseZodiac: getChineseZodiac(birth.getFullYear()),
      dayOfWeek: dayOfWeekStr,
      nextBirthday: nextBdayDiff === 365 ? 0 : nextBdayDiff
    });
  };

  return (
    <div className="space-y-6" id="age-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Multi-Metric Age Calculator
        </h2>
        <p className="text-sm text-gray-400">Evaluate exact year-month-day variables, total live duration milestones, and traditional cosmic zodiac mappings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit">
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1.5">Enter Birthdate:</label>
            <input
              type="date"
              className="w-full p-2.5 border border-white/10 rounded-lg text-xs font-semibold text-white bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            disabled={!birthdate}
            className="w-full p-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calculate Age Statistics</span>
          </button>
        </div>

        <div className="lg:col-span-2">
          {stats ? (
            <div className="space-y-6">
              <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#1a1a1a] border border-white/5 rounded-lg text-center">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase font-mono">Exact Age</span>
                    <p className="text-base font-black text-white mt-1">{stats.years} Yrs, {stats.months} Mos, {stats.days} Days</p>
                  </div>

                  <div className="p-4 bg-[#1a1a1a] border border-white/5 rounded-lg text-center">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase font-mono">Day of Week Born</span>
                    <p className="text-base font-black text-indigo-300 mt-1">{stats.dayOfWeek}</p>
                  </div>

                  <div className="p-4 bg-rose-955/10 border border-rose-500/10 rounded-lg text-center bg-[#241a1a]/30">
                    <span className="text-[10px] font-bold text-rose-455 block uppercase font-mono">Countdown to Birthday</span>
                    <p className="text-base font-black text-rose-400 mt-1">
                      {stats.nextBirthday === 0 ? "Today! 🎂" : `${stats.nextBirthday} Days`}
                    </p>
                  </div>

                  <div className="p-4 bg-[#1a1a1a] border border-white/5 rounded-lg text-center">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase font-mono">Zodiac Constellation</span>
                    <p className="text-sm font-bold text-gray-200 mt-1">{stats.zodiac}</p>
                  </div>

                  <div className="p-4 bg-[#1a1a1a] border border-white/5 rounded-lg text-center">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase font-mono">Chinese Zodiac Animal</span>
                    <p className="text-sm font-bold text-gray-200 mt-1">{stats.chineseZodiac}</p>
                  </div>

                  <div className="p-4 bg-[#1a1a1a] border border-white/5 rounded-lg text-center">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase font-mono">Next Milestone Age</span>
                    <p className="text-base font-black text-white mt-1">Turning {stats.years + 1}</p>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <h4 className="text-xs font-bold text-gray-300 uppercase font-mono mb-3">Equivalent Cumulative Metrics</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-2.5 bg-white/5 rounded border border-white/5">
                      <span className="text-[9px] font-bold text-gray-450 block font-mono">TOTAL WEEKS</span>
                      <p className="text-sm font-extrabold text-indigo-400 font-mono mt-0.5">{stats.totalWeeks.toLocaleString()}</p>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded border border-white/5">
                      <span className="text-[9px] font-bold text-gray-450 block font-mono">TOTAL DAYS</span>
                      <p className="text-sm font-extrabold text-indigo-400 font-mono mt-0.5">{stats.totalDays.toLocaleString()}</p>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded border border-white/5">
                      <span className="text-[9px] font-bold text-gray-450 block font-mono">TOTAL HOURS</span>
                      <p className="text-sm font-extrabold text-indigo-400 font-mono mt-0.5">{stats.totalHours.toLocaleString()}</p>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded border border-white/5">
                      <span className="text-[9px] font-bold text-gray-450 block font-mono">TOTAL MINUTES</span>
                      <p className="text-[11px] font-extrabold text-indigo-400 font-mono mt-1 break-all">{stats.totalMinutes.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              <ExportBar
                isDark={isDark}
                title="Age Calculator Results"
                results={[
                  { label: 'Age', value: `${stats.years} years, ${stats.months} months, ${stats.days} days` },
                  { label: 'Total Days Lived', value: stats.totalDays.toLocaleString() },
                  { label: 'Total Hours Lived', value: stats.totalHours.toLocaleString() },
                  { label: 'Zodiac Sign', value: stats.zodiac },
                ]}
              />
            </div>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
              <Calendar className="w-10 h-10 mb-2 text-gray-650" />
              <p className="text-xs">Provide a validated birthday coordinate on the left side to compile age records.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. PERCENTAGE CALCULATOR (MULTIPLE MODE SOLVER)
function PercentageCalculator({ isDark }: { isDark: boolean }) {
  // Mode A: What is X% of Y?
  const [aPct, setAPct] = useState('');
  const [aVal, setAVal] = useState('');
  const [aResult, setAResult] = useState<number | null>(null);

  // Mode B: X is what % of Y?
  const [bVal1, setBVal1] = useState('');
  const [bVal2, setBVal2] = useState('');
  const [bResult, setBResult] = useState<number | null>(null);

  // Mode C: Percentage change from X to Y?
  const [cVal1, setCVal1] = useState('');
  const [cVal2, setCVal2] = useState('');
  const [cResult, setCResult] = useState<{ change: number; type: 'increase' | 'decrease' | 'none' } | null>(null);

  // Mode D: Add/Sub X% to/from Y?
  const [dOp, setDOp] = useState<'add' | 'subtract'>('add');
  const [dPct, setDPct] = useState('');
  const [dVal, setDVal] = useState('');
  const [dResult, setDResult] = useState<number | null>(null);

  const calcA = () => {
    const p = parseFloat(aPct);
    const v = parseFloat(aVal);
    if (!isNaN(p) && !isNaN(v)) {
      setAResult((p / 100) * v);
    } else {
      setAResult(null);
    }
  };

  const calcB = () => {
    const v1 = parseFloat(bVal1);
    const v2 = parseFloat(bVal2);
    if (!isNaN(v1) && !isNaN(v2) && v2 !== 0) {
      setBResult((v1 / v2) * 100);
    } else {
      setBResult(null);
    }
  };

  const calcC = () => {
    const v1 = parseFloat(cVal1);
    const v2 = parseFloat(cVal2);
    if (!isNaN(v1) && !isNaN(v2)) {
      if (v1 === 0) {
        setCResult({ change: v2 > 0 ? 100 : 0, type: v2 > 0 ? 'increase' : 'none' });
        return;
      }
      const raw = ((v2 - v1) / Math.abs(v1)) * 100;
      setCResult({
        change: Math.abs(raw),
        type: raw > 0 ? 'increase' : raw < 0 ? 'decrease' : 'none'
      });
    } else {
      setCResult(null);
    }
  };

  const calcD = () => {
    const p = parseFloat(dPct);
    const v = parseFloat(dVal);
    if (!isNaN(p) && !isNaN(v)) {
      const offset = (p / 100) * v;
      setDResult(dOp === 'add' ? v + offset : v - offset);
    } else {
      setDResult(null);
    }
  };

  let activeResult: { val: string; mode: string } | null = null;
  if (aResult !== null) {
    activeResult = { val: Number(aResult.toFixed(4)).toString(), mode: `What is ${aPct}% of ${aVal}?` };
  } else if (bResult !== null) {
    activeResult = { val: `${Number(bResult.toFixed(4))}%`, mode: `${bVal1} is what percent of ${bVal2}?` };
  } else if (cResult !== null) {
    activeResult = { 
      val: `${cResult.type === 'increase' ? '+' : cResult.type === 'decrease' ? '-' : ''}${Number(cResult.change.toFixed(4))}%`, 
      mode: `Percentage change from ${cVal1} to ${cVal2}` 
    };
  } else if (dResult !== null) {
    activeResult = { val: Number(dResult.toFixed(4)).toString(), mode: `${dOp === 'add' ? 'Add' : 'Subtract'} ${dPct}% from ${dVal}` };
  }

  return (
    <div className="space-y-6" id="percentage-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Standard Percentage Solver
        </h2>
        <p className="text-sm text-gray-400">Perform ratios, fractional splits, percentile addition/subtraction, and incremental rate change analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        {/* Type A: What is X% of Y */}
        <div className="bg-[#141414] border border-white/5 p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[10px] uppercase font-bold text-gray-400 block font-mono">solver 1: fractional weight</span>
            <span className="text-[10px] font-mono text-indigo-400">What is X% of Y?</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1">Percentage (X %)</label>
              <input
                type="number" step="any" placeholder="e.g. 15"
                className="w-full p-2 bg-[#1a1a1a] border border-white/10 rounded text-xs text-white outline-none focus:border-indigo-500 font-mono"
                value={aPct} onChange={(e) => setAPct(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1">Base Target (Y)</label>
              <input
                type="number" step="any" placeholder="e.g. 250"
                className="w-full p-2 bg-[#1a1a1a] border border-white/10 rounded text-xs text-white outline-none focus:border-indigo-500 font-mono"
                value={aVal} onChange={(e) => setAVal(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 items-center pt-1.5">
            <button type="button" onClick={calcA} className="p-2 px-4 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] cursor-pointer">Solve</button>
            {aResult !== null && (
              <span className="text-[11px] font-mono font-bold text-emerald-400">Result: {Number(aResult.toFixed(4))}</span>
            )}
          </div>
        </div>

        {/* Type B: X is what percent of Y */}
        <div className="bg-[#141414] border border-white/5 p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[10px] uppercase font-bold text-gray-400 block font-mono">solver 2: comparative share</span>
            <span className="text-[10px] font-mono text-indigo-400">X is what percent of Y?</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1">Value (X)</label>
              <input
                type="number" step="any" placeholder="e.g. 50"
                className="w-full p-2 bg-[#1a1a1a] border border-white/10 rounded text-xs text-white outline-none focus:border-indigo-500 font-mono"
                value={bVal1} onChange={(e) => setBVal1(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1">Total (Y)</label>
              <input
                type="number" step="any" placeholder="e.g. 200"
                className="w-full p-2 bg-[#1a1a1a] border border-white/10 rounded text-xs text-white outline-none focus:border-indigo-500 font-mono"
                value={bVal2} onChange={(e) => setBVal2(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 items-center pt-1.5">
            <button type="button" onClick={calcB} className="p-2 px-4 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] cursor-pointer">Solve</button>
            {bResult !== null && (
              <span className="text-[11px] font-mono font-bold text-emerald-400">Result: {Number(bResult.toFixed(4))}%</span>
            )}
          </div>
        </div>

        {/* Type C: Percentage change from X to Y */}
        <div className="bg-[#141414] border border-white/5 p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[10px] uppercase font-bold text-gray-400 block font-mono">solver 3: increment delta</span>
            <span className="text-[10px] font-mono text-indigo-400">% Change from X to Y?</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1">From Value (Old X)</label>
              <input
                type="number" step="any" placeholder="e.g. 80"
                className="w-full p-2 bg-[#1a1a1a] border border-white/10 rounded text-xs text-white outline-none focus:border-indigo-500 font-mono"
                value={cVal1} onChange={(e) => setCVal1(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1">To Value (New Y)</label>
              <input
                type="number" step="any" placeholder="e.g. 120"
                className="w-full p-2 bg-[#1a1a1a] border border-white/10 rounded text-xs text-white outline-none focus:border-indigo-500 font-mono"
                value={cVal2} onChange={(e) => setCVal2(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 items-center pt-1.5">
            <button type="button" onClick={calcC} className="p-2 px-4 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] cursor-pointer">Solve</button>
            {cResult !== null && (
              <span className={`text-[11px] font-mono font-bold ${cResult.type === 'increase' ? 'text-emerald-400' : cResult.type === 'decrease' ? 'text-rose-400' : 'text-gray-400'}`}>
                {cResult.type === 'increase' ? '+' : cResult.type === 'decrease' ? '-' : ''}
                {Number(cResult.change.toFixed(4))}% {cResult.type}
              </span>
            )}
          </div>
        </div>

        {/* Type D: Add or Subtract % */}
        <div className="bg-[#141414] border border-white/5 p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[10px] uppercase font-bold text-gray-400 block font-mono">solver 4: percentage offset</span>
            <span className="text-[10px] font-mono text-indigo-400">Add/Subtract % from base</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1">Operator Offset</label>
              <select
                className="w-full p-2 bg-[#1a1a1a] border border-white/10 rounded text-xs text-white outline-none focus:border-indigo-500 font-mono"
                value={dOp} onChange={(e) => setDOp(e.target.value as 'add' | 'subtract')}
              >
                <option value="add">Add (+)</option>
                <option value="subtract">Subtract (-)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-1 px-1">
              <div>
                <label className="text-[9px] font-bold text-gray-400 block mb-1">X %</label>
                <input
                  type="number" step="any" placeholder="10"
                  className="w-full p-2 bg-[#1a1a1a] border border-white/10 rounded text-xs text-white outline-none focus:border-indigo-500 font-mono"
                  value={dPct} onChange={(e) => setDPct(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-gray-400 block mb-1">Base Y</label>
                <input
                  type="number" step="any" placeholder="150"
                  className="w-full p-2 bg-[#1a1a1a] border border-white/10 rounded text-xs text-white outline-none focus:border-indigo-500 font-mono"
                  value={dVal} onChange={(e) => setDVal(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center pt-1.5">
            <button type="button" onClick={calcD} className="p-2 px-4 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] cursor-pointer">Solve</button>
            {dResult !== null && (
              <span className="text-[11px] font-mono font-bold text-emerald-400">Result: {Number(dResult.toFixed(4))}</span>
            )}
          </div>
        </div>
      </div>
      {activeResult && (
        <ExportBar
          isDark={isDark}
          title="Percentage Calculator Results"
          results={[
            { label: 'Calculated Value', value: activeResult.val },
            { label: 'Mode / Equation', value: activeResult.mode },
          ]}
        />
      )}
    </div>
  );
}

// 3. AVERAGE CALCULATOR (CENTRAL TENDENCY AND SPREAD METRICS)
function AverageCalculator({ isDark }: { isDark: boolean }) {
  const [inputStr, setInputStr] = useState('');
  const [metrics, setMetrics] = useState<{
    mean: number;
    median: number;
    mode: string;
    range: number;
    min: number;
    max: number;
    count: number;
    sum: number;
    variance: number;
    stdDev: number;
    sorted: number[];
  } | null>(null);

  const handleAnalyze = () => {
    // Regex matches space, comma, newline or semicolon separation
    const numbers = inputStr
      .split(/[\s,;\n]+/)
      .map(v => parseFloat(v))
      .filter(v => !isNaN(v));

    if (numbers.length === 0) {
      alert("Provide at least one validated numerical parameter!");
      return;
    }

    const n = numbers.length;
    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((acc, current) => acc + current, 0);
    const mean = sum / n;

    // Median
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Mode
    const freq: Record<number, number> = {};
    let maxFreq = 0;
    numbers.forEach(num => {
      freq[num] = (freq[num] || 0) + 1;
      if (freq[num] > maxFreq) maxFreq = freq[num];
    });
    const modes: number[] = [];
    if (maxFreq > 1) {
      Object.keys(freq).forEach(k => {
        if (freq[Number(k)] === maxFreq) modes.push(Number(k));
      });
    }
    const modeString = modes.length > 0 ? modes.join(', ') : 'No repeated mode (all unique)';

    // Spread parameters
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    // Variance & Standard Deviation
    const sqDiffSum = numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
    const variance = sqDiffSum / (n > 1 ? n - 1 : 1); // Sample Variance
    const stdDev = Math.sqrt(variance);

    setMetrics({
      mean,
      median,
      mode: modeString,
      range,
      min,
      max,
      count: n,
      sum,
      variance,
      stdDev,
      sorted
    });
  };

  return (
    <div className="space-y-6" id="average-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Average & Central Tendency Analyzer
        </h2>
        <p className="text-sm text-gray-400">Determine statistical mean, median, sample standard deviations, variance parameters, modes, and range values.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit">
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1.5">Input Number Collection (comma/space separated):</label>
            <textarea
              className="w-full h-32 p-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-xs leading-relaxed text-white font-mono placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
              placeholder="e.g. 12, 15, 23, 42, 16, 23, 8"
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!inputStr.trim()}
              className="flex-1 p-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Sigma className="w-3.5 h-3.5" />
              <span>Compute Metrics</span>
            </button>
            <button
              type="button"
              onClick={() => { setInputStr(''); setMetrics(null); }}
              className="p-2.5 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/5 text-gray-450 rounded-lg transition-colors cursor-pointer"
              title="Clear inputs"
            >
              <Trash2 className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {metrics ? (
            <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-5">
              <h4 className="text-xs font-bold text-indigo-400 uppercase font-mono pb-2 border-b border-white/5">Statistical Assessment Reports</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-[#1a1a1a] border border-white/5 rounded-lg">
                  <span className="text-[10px] font-bold text-gray-400 block font-mono">ARITHMETIC MEAN</span>
                  <p className="text-base font-black text-white mt-1 font-mono">{Number(metrics.mean.toFixed(4))}</p>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-white/5 rounded-lg">
                  <span className="text-[10px] font-bold text-gray-400 block font-mono">MEDIAN (MIDPOINT)</span>
                  <p className="text-base font-black text-white mt-1 font-mono">{Number(metrics.median.toFixed(4))}</p>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-white/5 rounded-lg">
                  <span className="text-[10px] font-bold text-gray-400 block font-mono">SAMPLE STD DEV</span>
                  <p className="text-base font-black text-indigo-455 text-indigo-300 mt-1 font-mono">{Number(metrics.stdDev.toFixed(4))}</p>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-white/5 rounded-lg">
                  <span className="text-[10px] font-bold text-gray-400 block font-mono">SAMPLE VARIANCE</span>
                  <p className="text-base font-black text-white mt-1 font-mono">{Number(metrics.variance.toFixed(4))}</p>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 text-xs space-y-3 font-mono text-[11px] text-gray-300">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/3 p-3 rounded border border-white/5">
                  <div>
                    <span className="text-[9px] text-gray-500 block">ELEMENT COUNT</span>
                    <span className="font-bold font-mono text-white text-xs">{metrics.count}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 block">SUM TOTAL</span>
                    <span className="font-bold font-mono text-white text-xs">{metrics.sum}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 block">MINIMUM VALUE</span>
                    <span className="font-bold font-mono text-white text-xs">{metrics.min}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 block">MAXIMUM VALUE</span>
                    <span className="font-bold font-mono text-white text-xs">{metrics.max}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] py-1 border-b border-white/5">
                  <span className="text-gray-400">Mode values (peaks):</span>
                  <span className="text-emerald-400 font-bold">{metrics.mode}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] py-1 border-b border-white/5">
                  <span className="text-gray-400">Standard range (Max - Min):</span>
                  <span className="text-white font-bold">{metrics.range}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] py-1">
                  <span className="text-gray-400">Ordered sequence (sorted ascending):</span>
                  <span className="text-white max-w-[280px] truncate block" title={metrics.sorted.join(', ')}>{metrics.sorted.join(', ')}</span>
                </div>
              </div>
              <ExportBar
                isDark={isDark}
                title="Average Calculator Results"
                results={[
                  { label: 'Mean', value: metrics.mean.toFixed(4) },
                  { label: 'Median', value: metrics.median.toFixed(4) },
                  { label: 'Mode', value: metrics.mode },
                  { label: 'Standard Deviation', value: metrics.stdDev.toFixed(4) },
                  { label: 'Min', value: metrics.min.toString() },
                  { label: 'Max', value: metrics.max.toString() },
                ]}
              />
            </div>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
              <Sigma className="w-10 h-10 mb-2 text-gray-650" />
              <p className="text-xs">Submit numbers formatted with spaces or commas to resolve central values.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. CONFIDENCE INTERVAL CALCULATOR (WITH DETAILED VERBALIZED STATEMENT)
function ConfidenceIntervalCalculator() {
  const [mean, setMean] = useState('');
  const [stdDev, setStdDev] = useState('');
  const [sampleN, setSampleN] = useState('');
  const [level, setLevel] = useState('95'); // 90%, 95%, 99%
  const [report, setReport] = useState<{
    zMultiplier: number;
    marginOfError: number;
    lower: number;
    upper: number;
    meanVal: number;
    explain: string;
  } | null>(null);

  const handleGenerate = () => {
    const m = parseFloat(mean);
    const s = parseFloat(stdDev);
    const n = parseInt(sampleN, 10);
    const pct = parseFloat(level);

    if (isNaN(m) || isNaN(s) || isNaN(n) || n <= 1) {
      alert("Provide validated Mean, Standard Deviation, and Sample count greater than 1.");
      return;
    }

    // Standard Z multipliers mapping for key values
    let z = 1.95996; // default 95%
    if (pct === 90) z = 1.64485;
    else if (pct === 99) z = 2.57583;

    // Standard error = stdDev / sqrt(N)
    const stdErr = s / Math.sqrt(n);
    const margin = z * stdErr;
    const lowerLimit = m - margin;
    const upperLimit = m + margin;

    const explainStr = `We are ${pct}% confident that the actual true population mean resides between the boundaries of ${lowerLimit.toFixed(4)} and ${upperLimit.toFixed(4)}. This is calculated based on standard normal distribution variables (Z = ${z.toFixed(3)}) with a calculated margin of error equal to ±${margin.toFixed(4)}.`;

    setReport({
      zMultiplier: z,
      marginOfError: margin,
      lower: lowerLimit,
      upper: upperLimit,
      meanVal: m,
      explain: explainStr
    });
  };

  return (
    <div className="space-y-6" id="confidence-interval-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Confidence Interval Statistics Solver
        </h2>
        <p className="text-sm text-gray-400">Resolve population margins based on standard deviation factors, sample density counts, and normal distribution indices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit text-xs">
          <div>
            <label className="text-gray-400 font-semibold block mb-1">Sample Mean (X̄)</label>
            <input
              type="number" step="any" placeholder="e.g. 120"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={mean} onChange={(e) => setMean(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Standard Deviation (S)</label>
            <input
              type="number" step="any" placeholder="e.g. 15.5"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={stdDev} onChange={(e) => setStdDev(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Sample Size (N)</label>
            <input
              type="number" min="2" placeholder="e.g. 50"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={sampleN} onChange={(e) => setSampleN(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Desired Confidence Level</label>
            <select
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono"
              value={level} onChange={(e) => setLevel(e.target.value)}
            >
              <option value="90">90% Confidence Interval (Z = 1.645)</option>
              <option value="95">95% Confidence Interval (Z = 1.960)</option>
              <option value="99">99% Confidence Interval (Z = 2.576)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Generate Interval Range</span>
          </button>
        </div>

        <div className="lg:col-span-2">
          {report ? (
            <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-5">
              <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">Compiled Margin Report</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-[#1a1a1a] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-mono">MARGIN OF ERROR (E)</span>
                  <p className="text-base font-black text-rose-400 mt-1 font-mono">±{report.marginOfError.toFixed(4)}</p>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-mono">LOWER LIMIT BOUND</span>
                  <p className="text-base font-black text-emerald-400 mt-1 font-mono">{report.lower.toFixed(4)}</p>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-mono">UPPER LIMIT BOUND</span>
                  <p className="text-base font-black text-emerald-400 mt-1 font-mono">{report.upper.toFixed(4)}</p>
                </div>
              </div>

              <div className="bg-white/3 border border-white/5 p-4 rounded-lg font-mono text-xs leading-relaxed text-gray-300">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Verbalized Interpretation</p>
                {report.explain}
              </div>
            </div>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
              <Compass className="w-10 h-10 mb-2 text-gray-650" />
              <p className="text-xs">Specify the standard deviation and sample bounds on the left side to compile intervals.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 5. SALES TAX CALCULATOR (WITH DISCOUNT AND DETAILED TARIFF REVIEWS)
function SalesTaxCalculator({ isDark }: { isDark: boolean }) {
  const [price, setPrice] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [discount, setDiscount] = useState('');
  const [result, setResult] = useState<{
    originalPrice: number;
    discountedPrice: number;
    discountApplied: number;
    taxApplied: number;
    grandTotal: number;
  } | null>(null);

  const handleCalculate = () => {
    const rawPrice = parseFloat(price);
    const rawTax = parseFloat(taxRate) || 0;
    const rawDiscount = parseFloat(discount) || 0;

    if (isNaN(rawPrice) || rawPrice < 0) {
      alert("Provide a valid item base price!");
      return;
    }

    const discountAmount = rawPrice * (rawDiscount / 100);
    const targetBase = Math.max(0, rawPrice - discountAmount);
    const taxAmount = targetBase * (rawTax / 100);
    const total = targetBase + taxAmount;

    setResult({
      originalPrice: rawPrice,
      discountedPrice: targetBase,
      discountApplied: discountAmount,
      taxApplied: taxAmount,
      grandTotal: total
    });
  };

  return (
    <div className="space-y-6" id="sales-tax-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Multi-Rate Sales Tax & Discount Solver
        </h2>
        <p className="text-sm text-gray-400">Calculate net final purchases by applying percentage values, custom markdowns, and local regional tariffs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit text-xs">
          <div>
            <label className="text-gray-400 font-semibold block mb-1">Base Price ($)</label>
            <input
              type="number" step="any" placeholder="e.g. 99.99"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={price} onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Sales Tax Rate (%)</label>
            <input
              type="number" step="any" placeholder="e.g. 8.25"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={taxRate} onChange={(e) => setTaxRate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Optional Markdown/Discount (%)</label>
            <input
              type="number" step="any" placeholder="e.g. 15"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={discount} onChange={(e) => setDiscount(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Apply Tax Parameters</span>
          </button>
        </div>

        <div className="lg:col-span-2">
          {result ? (
            <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-4">
              <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">Financial Statement Receipt</span>
              
              <div className="space-y-2 bg-[#101010] p-4 rounded-lg border border-white/5 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500">Gross Initial Price:</span>
                  <span className="text-white font-bold">${result.originalPrice.toFixed(2)}</span>
                </div>
                {result.discountApplied > 0 && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-emerald-500">Markdown applied (Discount):</span>
                    <span className="text-emerald-400 font-bold">-${result.discountApplied.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500">Taxable Net Amount:</span>
                  <span className="text-white font-bold">${result.discountedPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-rose-405 text-rose-400">Regional Tariffs (Tax):</span>
                  <span className="text-rose-400 font-bold">+${result.taxApplied.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2.5 text-sm">
                  <span className="text-indigo-300 font-bold">Grand Purchase Total:</span>
                  <span className="text-indigo-400 font-black text-base">${result.grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <ExportBar
                isDark={isDark}
                title="Sales Tax Calculator Results"
                results={[
                  { label: 'Original Price', value: `$${result.originalPrice.toFixed(2)}` },
                  { label: 'Tax Amount', value: `$${result.taxApplied.toFixed(2)}` },
                  { label: 'Final Price', value: `$${result.grandTotal.toFixed(2)}` },
                  { label: 'Tax Rate', value: `${parseFloat(taxRate) || 0}%` },
                ]}
              />
            </div>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
              <Coins className="w-10 h-10 mb-2 text-gray-650" />
              <p className="text-xs">Provide pricing figures on the left coordinates to format purchase receipts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 6. MARGIN CALCULATOR (FOR SMALL BUSINESS SALES CONV)
function MarginCalculator({ isDark }: { isDark: boolean }) {
  const [cost, setCost] = useState('');
  const [revenue, setRevenue] = useState('');
  const [marginPct, setMarginPct] = useState('');
  const [mode, setMode] = useState<'with-rev' | 'with-margin'>('with-rev');

  const [results, setResults] = useState<{
    rev: number;
    costVal: number;
    profit: number;
    margin: number;
    markup: number;
  } | null>(null);

  const handleCalculate = () => {
    const rawCost = parseFloat(cost);
    if (isNaN(rawCost) || rawCost < 0) {
      alert("Please specify a valid item inventory cost.");
      return;
    }

    if (mode === 'with-rev') {
      const rawRev = parseFloat(revenue);
      if (isNaN(rawRev) || rawRev <= 0) {
        alert("Please specify a valid output sale Revenue.");
        return;
      }
      const profit = rawRev - rawCost;
      const margin = (profit / rawRev) * 100;
      const markup = rawCost > 0 ? (profit / rawCost) * 100 : 0;

      setResults({
        rev: rawRev,
        costVal: rawCost,
        profit,
        margin,
        markup
      });
    } else {
      const targetMg = parseFloat(marginPct);
      if (isNaN(targetMg) || targetMg >= 100 || targetMg < 0) {
        alert("Margin percentage must be on a normal coordinate of 0 to 99.9%.");
        return;
      }
      // Revenue = cost / (1 - (margin / 100))
      const targetRev = rawCost / (1 - (targetMg / 100));
      const profit = targetRev - rawCost;
      const markup = rawCost > 0 ? (profit / rawCost) * 100 : 0;

      setResults({
        rev: targetRev,
        costVal: rawCost,
        profit,
        margin: targetMg,
        markup
      });
    }
  };

  return (
    <div className="space-y-6" id="margin-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Standard Margin & Markup Solver
        </h2>
        <p className="text-sm text-gray-400">Assess gross profit lines, required sale prices, markup percentages, and business retail coordinates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit text-xs">
          <div className="flex gap-2 p-1 bg-[#1a1a1a] rounded border border-white/5">
            <button
              type="button"
              onClick={() => { setMode('with-rev'); setResults(null); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer ${mode === 'with-rev' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Cost + Revenue
            </button>
            <button
              type="button"
              onClick={() => { setMode('with-margin'); setResults(null); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer ${mode === 'with-margin' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Cost + Target Margin
            </button>
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Inventory Cost ($)</label>
            <input
              type="number" step="any" placeholder="e.g. 45.00"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={cost} onChange={(e) => setCost(e.target.value)}
            />
          </div>

          {mode === 'with-rev' ? (
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Target Sale Revenue ($)</label>
              <input
                type="number" step="any" placeholder="e.g. 75.00"
                className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                value={revenue} onChange={(e) => setRevenue(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Target Profit Margin (%)</label>
              <input
                type="number" step="any" placeholder="e.g. 40"
                className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                value={marginPct} onChange={(e) => setMarginPct(e.target.value)}
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleCalculate}
            className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Resolve Business Margins</span>
          </button>
        </div>

        <div className="lg:col-span-2">
          {results ? (
            <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-5">
              <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block font-mono">Business Profitability Matrix</span>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
                <div className="p-3 bg-[#1a1a1a] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">NET PROFIT</span>
                  <p className="text-sm font-black text-emerald-400 mt-1">${results.profit.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">GROSS MARGIN</span>
                  <p className="text-sm font-black text-indigo-300 mt-1">{results.margin.toFixed(2)}%</p>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">MARKUP %</span>
                  <p className="text-sm font-black text-white mt-1">{results.markup.toFixed(2)}%</p>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">RECOMMENDED SALE</span>
                  <p className="text-[11px] font-black text-amber-400 mt-1 break-all">${results.rev.toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 text-xs font-sans text-gray-400 leading-relaxed">
                <p>For inventory acquired at <span className="text-white font-bold">${results.costVal.toFixed(2)}</span>, offering them at a sale value of <span className="text-white font-bold">${results.rev.toFixed(2)}</span> results in <span className="text-white font-bold">${results.profit.toFixed(2)}</span> net earnings per transaction. This triggers a retail markup value equivalent to <span className="text-white font-bold">{results.markup.toFixed(2)}%</span> on standard bookkeeping entries.</p>
              </div>
              <ExportBar
                isDark={isDark}
                title="Margin Calculator Results"
                results={[
                  { label: 'Revenue', value: `$${results.rev.toFixed(2)}` },
                  { label: 'Cost', value: `$${results.costVal.toFixed(2)}` },
                  { label: 'Gross Profit', value: `$${results.profit.toFixed(2)}` },
                  { label: 'Profit Margin', value: `${results.margin.toFixed(2)}%` },
                  { label: 'Markup', value: `${results.markup.toFixed(2)}%` },
                ]}
              />
            </div>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
              <DollarSign className="w-10 h-10 mb-2 text-gray-650" />
              <p className="text-xs">Select a computation layout format on the left coordinates to assess metrics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 7. PROBABILITY CALCULATOR (FOR KEY DICES, COINS & EVENTS)
function ProbabilityCalculator() {
  const [probA, setProbA] = useState('');
  const [probB, setProbB] = useState('');
  const [results, setResults] = useState<{
    notA: number;
    notB: number;
    andIndependent: number;
    orMutuallyExclusive: number;
    orIndependent: number;
  } | null>(null);

  const handleCalculate = () => {
    let a = parseFloat(probA);
    let b = parseFloat(probB);

    if (isNaN(a) || isNaN(b) || a < 0 || a > 1 || b < 0 || b > 1) {
      alert("Probability indices must restrict cleanly to boundaries between 0 and 1.0 (or percentage fractions).");
      return;
    }

    const notA = 1 - a;
    const notB = 1 - b;
    const andIndependent = a * b;
    const orMutuallyExclusive = Math.min(1, a + b);
    const orIndependent = a + b - (a * b);

    setResults({
      notA,
      notB,
      andIndependent,
      orMutuallyExclusive,
      orIndependent
    });
  };

  return (
    <div className="space-y-6" id="probability-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Probability & Intersection Event Solver
        </h2>
        <p className="text-sm text-gray-400">Analyze compound occurrence structures, independent factor intersections, and mutual exclusion matrices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit text-xs">
          <div>
            <label className="text-gray-400 font-semibold block mb-1">Probability of Event A: P(A)</label>
            <input
              type="number" step="any" min="0" max="1" placeholder="e.g. 0.5 (or 50%)"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={probA} onChange={(e) => setProbA(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Probability of Event B: P(B)</label>
            <input
              type="number" step="any" min="0" max="1" placeholder="e.g. 0.4 (or 40%)"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={probB} onChange={(e) => setProbB(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Evaluate Event Models</span>
          </button>
        </div>

        <div className="lg:col-span-2">
          {results ? (
            <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-4">
              <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">Compound Occurrence Formulas</span>
              
              <div className="font-mono text-xs space-y-2 bg-[#101010] p-4 rounded-lg border border-white/5">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500 font-sans">P(Not occurring A):</span>
                  <span className="text-white font-bold">{Number(results.notA.toFixed(4))} ({(results.notA * 100).toFixed(2)}%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500 font-sans">P(Not occurring B):</span>
                  <span className="text-white font-bold">{Number(results.notB.toFixed(4))} ({(results.notB * 100).toFixed(2)}%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-emerald-455 text-emerald-400 font-sans">Both A AND B happen (P(A ∩ B) - Independent):</span>
                  <span className="text-emerald-400 font-bold">{Number(results.andIndependent.toFixed(4))} ({(results.andIndependent * 100).toFixed(2)}%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500 font-sans">Either A OR B happens (Mutually Exclusive):</span>
                  <span className="text-white font-bold">{Number(results.orMutuallyExclusive.toFixed(4))} ({(results.orMutuallyExclusive * 100).toFixed(2)}%)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-indigo-300 font-sans font-bold">Either A OR B happens (P(A ∪ B) - Independent):</span>
                  <span className="text-indigo-400 font-bold">{Number(results.orIndependent.toFixed(4))} ({(results.orIndependent * 100).toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
              <Dices className="w-10 h-10 mb-2 text-gray-650" />
              <p className="text-xs">Provide probability indices between 0 and 1.0 to compute compound state matrices.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 8. PAYPAL FEE CALCULATOR (UP TO DATE MERCHANT AND DOMESTIC RATES)
function PaypalFeeCalculator({ isDark }: { isDark: boolean }) {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('2.99'); // Default standard merchant rate is 2.99%
  const [fixedFee, setFixedFee] = useState('0.49'); // Default standard domestic fixed fee standard is $0.49
  const [mode, setMode] = useState<'receive' | 'send'>('receive');

  const [fees, setFees] = useState<{
    rawAmt: number;
    feeVal: number;
    disbursed: number;
    explain: string;
  } | null>(null);

  const handleCalculate = () => {
    const rawAmt = parseFloat(amount);
    const rawRate = parseFloat(rate) || 0;
    const rawFixed = parseFloat(fixedFee) || 0;

    if (isNaN(rawAmt) || rawAmt <= 0) {
      alert("Provide a valid base money transaction limit parameter!");
      return;
    }

    if (mode === 'receive') {
      // Receive mode: how much should client invoice or ask for to receive exactly rawAmt?
      // Net = Ask * (1 - rate / 100) - fixed
      // Ask = (Net + fixed) / (1 - rate / 100)
      const denominator = 1 - (rawRate / 100);
      if (denominator <= 0) {
        alert("The rate percentage cannot equal or exceed 100%!");
        return;
      }
      const askAmount = (rawAmt + rawFixed) / denominator;
      const feeVal = askAmount - rawAmt;

      setFees({
        rawAmt: askAmount,
        feeVal,
        disbursed: rawAmt,
        explain: `In order to clear a clean disbursed balance of exactly $${rawAmt.toFixed(2)} after fees, you must request or charge exactly $${askAmount.toFixed(2)}. This accounts for a deducted commission fee of $${feeVal.toFixed(2)} (${rawRate}% plus a $${rawFixed} fixed transaction fee).`
      });
    } else {
      // Send mode: client sends rawAmt, how much triggers in fees, and what is disbursed?
      const feeVal = (rawAmt * (rawRate / 100)) + rawFixed;
      const disbursed = Math.max(0, rawAmt - feeVal);

      setFees({
        rawAmt,
        feeVal,
        disbursed,
        explain: `If you send a horizontal base volume of $${rawAmt.toFixed(2)}, Paypal will deduct a transaction commission fee equal to $${feeVal.toFixed(2)} (${rawRate}% plus a $${rawFixed} flat fixed fee). The final recipient clears exactly $${disbursed.toFixed(2)} after accounting definitions.`
      });
    }
  };

  return (
    <div className="space-y-6" id="paypal-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Paypal Merchant Fee Compiler
        </h2>
        <p className="text-sm text-gray-400">Calculate net money-back ratios, invoice target requests, and flat domestic or global processing tariff variables.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit text-xs">
          <div className="flex gap-2 p-1 bg-[#1a1a1a] rounded border border-white/5">
            <button
              type="button"
              onClick={() => { setMode('receive'); setFees(null); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer ${mode === 'receive' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              To Receive Exactly
            </button>
            <button
              type="button"
              onClick={() => { setMode('send'); setFees(null); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer ${mode === 'send' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              When Sending Exactly
            </button>
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Target Base Amount ($)</label>
            <input
              type="number" step="any" placeholder="e.g. 150.00"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={amount} onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Fee Rate (%)</label>
              <input
                type="number" step="any" placeholder="2.99"
                className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                value={rate} onChange={(e) => setRate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Fixed Fee ($)</label>
              <input
                type="number" step="any" placeholder="0.49"
                className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                value={fixedFee} onChange={(e) => setFixedFee(e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Process Merchant Fees</span>
          </button>
        </div>

        <div className="lg:col-span-2">
          {fees ? (
            <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-5">
              <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block font-mono">Deduction Ledger Balance</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono">
                <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">GROSS ASK AMOUNT</span>
                  <p className="text-base font-black text-white mt-1 break-all">${fees.rawAmt.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">PAYPAL PORTION FEE</span>
                  <p className="text-base font-black text-rose-400 mt-1 break-all">-${fees.feeVal.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-emerald-955/10 border border-emerald-500/10 rounded-lg text-center bg-[#1a241a]/30">
                  <span className="text-[9px] font-bold text-emerald-455 block font-sans">FINAL CLIPPED NET</span>
                  <p className="text-base font-black text-emerald-400 mt-1 break-all">${fees.disbursed.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-[#101010] border border-white/5 p-4 rounded-lg font-mono text-xs leading-relaxed text-gray-300">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 font-sans">Invoice Ledger Explanation</p>
                {fees.explain}
              </div>
              <ExportBar
                isDark={isDark}
                title="PayPal Fee Calculator Results"
                results={[
                  { label: mode === 'receive' ? 'Amount to Charge' : 'Amount to Send', value: `$${fees.rawAmt.toFixed(2)}` },
                  { label: 'Calculated Fee', value: `$${fees.feeVal.toFixed(2)}` },
                  { label: mode === 'receive' ? 'Amount Received' : 'Amount Recipient Gets', value: `$${fees.disbursed.toFixed(2)}` },
                  { label: 'Fee Rate', value: `${rate}% + $${fixedFee}` },
                ]}
              />
            </div>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
              <CreditCard className="w-10 h-10 mb-2 text-gray-650" />
              <p className="text-xs">Specify the raw funds payload parameters on the left controls to format the invoice logic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 9. DISCOUNT CALCULATOR
function DiscountCalculator({ isDark }: { isDark: boolean }) {
  const [price, setPrice] = useState('');
  const [discount1, setDiscount1] = useState('');
  const [discount2, setDiscount2] = useState(''); // Stackable/double discount
  const [taxRate, setTaxRate] = useState('');
  const [result, setResult] = useState<{
    original: number;
    savingsVal1: number;
    savingsVal2: number;
    totalSavings: number;
    salePrice: number;
    taxVal: number;
    finalTotal: number;
  } | null>(null);

  const handleCalculate = () => {
    const rawPrice = parseFloat(price);
    const d1 = parseFloat(discount1) || 0;
    const d2 = parseFloat(discount2) || 0;
    const tax = parseFloat(taxRate) || 0;

    if (isNaN(rawPrice) || rawPrice < 0) {
      alert("Please enter a valid original price!");
      return;
    }

    const s1 = rawPrice * (d1 / 100);
    const priceAfterD1 = Math.max(0, rawPrice - s1);
    const s2 = priceAfterD1 * (d2 / 100);
    const salePrice = Math.max(0, priceAfterD1 - s2);
    const taxVal = salePrice * (tax / 100);
    const finalTotal = salePrice + taxVal;
    const totalSavings = s1 + s2;

    setResult({
      original: rawPrice,
      savingsVal1: s1,
      savingsVal2: s2,
      totalSavings,
      salePrice,
      taxVal,
      finalTotal
    });
  };

  return (
    <div className="space-y-6" id="discount-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Standard & Stacked Discount Solver
        </h2>
        <p className="text-sm text-gray-400">Calculate net final purchases after double-tiered discount reductions and sales taxes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit text-xs">
          <div>
            <label className="text-gray-400 font-semibold block mb-1">Base Original Price ($)</label>
            <input
              type="number" step="any" placeholder="e.g. 120.00"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none focus:border-indigo-505 focus:border-indigo-500"
              value={price} onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Discount 1 (%)</label>
              <input
                type="number" step="any" placeholder="e.g. 20"
                className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                value={discount1} onChange={(e) => setDiscount1(e.target.value)}
              />
            </div>
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Discount 2 (%)</label>
              <input
                type="number" step="any" placeholder="e.g. 10"
                className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                value={discount2} onChange={(e) => setDiscount2(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Subsequent Sales Tax (%)</label>
            <input
              type="number" step="any" placeholder="e.g. 8.25"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={taxRate} onChange={(e) => setTaxRate(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Apply Coupon Parameters</span>
          </button>
        </div>

        <div className="lg:col-span-2">
          {result ? (
            <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-4">
              <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">Pricing Adjustment Ledger</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono">
                <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">TOTAL CASH SAVED</span>
                  <p className="text-base font-black text-emerald-400 mt-1">${result.totalSavings.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">TAX APPLIED</span>
                  <p className="text-base font-black text-rose-400 mt-1">+${result.taxVal.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-indigo-950/20 border border-indigo-500/10 rounded-lg">
                  <span className="text-[9px] font-bold text-indigo-400 block font-sans">FINAL BUY PRICE</span>
                  <p className="text-base font-black text-white mt-1">${result.finalTotal.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2 bg-[#101010] p-4 rounded-lg border border-white/5 font-mono text-xs text-gray-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Gross Initial Cost:</span>
                  <span className="text-white font-bold">${result.original.toFixed(2)}</span>
                </div>
                {result.savingsVal1 > 0 && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-emerald-500">First Discount ({discount1}%):</span>
                    <span className="text-emerald-400 font-bold">-${result.savingsVal1.toFixed(2)}</span>
                  </div>
                )}
                {result.savingsVal2 > 0 && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-emerald-500">Second Stackable Discount ({discount2}%):</span>
                    <span className="text-emerald-400 font-bold">-${result.savingsVal2.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Pre-tax Item Total:</span>
                  <span className="text-white font-bold">${result.salePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Sales Tax ({taxRate}%):</span>
                  <span className="text-white font-bold">+${result.taxVal.toFixed(2)}</span>
                </div>
              </div>
              <ExportBar
                isDark={isDark}
                title="Discount Calculator Results"
                results={[
                  { label: 'Original Price', value: `$${result.original.toFixed(2)}` },
                  { label: 'Discount Amount', value: `$${result.totalSavings.toFixed(2)}` },
                  { label: 'Final Price', value: `$${result.finalTotal.toFixed(2)}` },
                  { label: 'Discount Percentage', value: `${parseFloat(discount1) || 0}%${parseFloat(discount2) ? ' + ' + discount2 + '%' : ''}` },
                ]}
              />
            </div>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
              <Tag className="w-10 h-10 mb-2 text-gray-650" />
              <p className="text-xs">Provide base pricing elements on the left parameters to compile the net checkout costs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 10. CPM CALCULATOR
function CpmCalculator() {
  const [calcMode, setCalcMode] = useState<'cpm' | 'cost' | 'impressions'>('cpm');
  const [cost, setCost] = useState('');
  const [impressions, setImpressions] = useState('');
  const [cpm, setCpm] = useState('');
  const [clicks, setClicks] = useState('');

  const [result, setResult] = useState<{
    cpm: number;
    cost: number;
    impressions: number;
    cpc: number | null;
    ctr: number | null;
  } | null>(null);

  const handleCalculate = () => {
    const rawCost = parseFloat(cost) || 0;
    const rawImps = parseFloat(impressions) || 0;
    const rawCpm = parseFloat(cpm) || 0;
    const rawClicks = parseFloat(clicks) || 0;

    let targetCpm = rawCpm;
    let targetCost = rawCost;
    let targetImps = rawImps;

    if (calcMode === 'cpm') {
      if (rawCost <= 0 || rawImps <= 0) {
        alert("Campaign budget cost and Impressions quantity must exceed zero!");
        return;
      }
      targetCpm = (rawCost / rawImps) * 1000;
    } else if (calcMode === 'cost') {
      if (rawCpm <= 0 || rawImps <= 0) {
        alert("CPM factor and overall impressions must exceed zero!");
        return;
      }
      targetCost = (rawCpm * rawImps) / 1000;
    } else if (calcMode === 'impressions') {
      if (rawCost <= 0 || rawCpm <= 0) {
        alert("Campaign budget limit and standard CPM rate must exceed zero!");
        return;
      }
      targetImps = (rawCost / rawCpm) * 1000;
    }

    const cpc = rawClicks > 0 ? targetCost / rawClicks : null;
    const ctr = targetImps > 0 && rawClicks > 0 ? (rawClicks / targetImps) * 100 : null;

    setResult({
      cpm: targetCpm,
      cost: targetCost,
      impressions: targetImps,
      cpc,
      ctr
    });
  };

  return (
    <div className="space-y-6" id="cpm-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Advertising CPM Campaign Solver
        </h2>
        <p className="text-sm text-gray-400">Resolve Cost Per Mille (CPM), impressions quantities, total ad budgets, and click conversion metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit text-xs">
          <div className="flex gap-2 p-1 bg-[#1a1a1a] rounded border border-white/5">
            <button
              type="button"
              onClick={() => { setCalcMode('cpm'); setResult(null); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer transition-colors ${calcMode === 'cpm' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Solve CPM
            </button>
            <button
              type="button"
              onClick={() => { setCalcMode('cost'); setResult(null); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer transition-colors ${calcMode === 'cost' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Solve Cost
            </button>
            <button
              type="button"
              onClick={() => { setCalcMode('impressions'); setResult(null); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer transition-colors ${calcMode === 'impressions' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Solve Imp.
            </button>
          </div>

          {calcMode !== 'cost' && (
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Total Budget Cost ($)</label>
              <input
                type="number" step="any" placeholder="e.g. 500.00"
                className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                value={cost} onChange={(e) => setCost(e.target.value)}
              />
            </div>
          )}

          {calcMode !== 'impressions' && (
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Ad Impressions Volume</label>
              <input
                type="number" placeholder="e.g. 50000"
                className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                value={impressions} onChange={(e) => setImpressions(e.target.value)}
              />
            </div>
          )}

          {calcMode !== 'cpm' && (
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Cost Per Mille (CPM) ($)</label>
              <input
                type="number" step="any" placeholder="e.g. 10.00"
                className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                value={cpm} onChange={(e) => setCpm(e.target.value)}
              />
            </div>
          )}

          <div className="border-t border-white/5 pt-3">
            <label className="text-gray-405 font-bold block mb-1 text-indigo-400">Optional Clicks Received (CPC metrics)</label>
            <input
              type="number" placeholder="e.g. 125"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={clicks} onChange={(e) => setClicks(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Process Campaign Metrics</span>
          </button>
        </div>

        <div className="lg:col-span-2">
          {result ? (
            <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-4">
              <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">Compiled Campaign Output</span>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center font-mono">
                <div className="p-3 bg-[#111] border border-white/5 rounded-lg col-span-2 md:col-span-1">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">RESOLVED CPM</span>
                  <p className="text-sm font-black text-indigo-305 text-indigo-300 mt-1">${result.cpm.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">TOTAL COST</span>
                  <p className="text-sm font-black text-white mt-1">${result.cost.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">IMPRESSIONS</span>
                  <p className="text-sm font-black text-white mt-1">{result.impressions.toLocaleString()}</p>
                </div>
              </div>

              {(result.cpc !== null || result.ctr !== null) && (
                <div className="border-t border-white/5 pt-4">
                  <span className="text-[10px] font-bold text-amber-400 uppercase font-mono block mb-2">Calculated Engagement KPI Metrics</span>
                  <div className="grid grid-cols-2 gap-4 text-center font-mono">
                    <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                      <span className="text-[9px] font-bold text-gray-500 block font-sans">COST PER CLICK (CPC)</span>
                      <p className="text-xs font-black text-amber-400 mt-1">
                        {result.cpc !== null ? `$${result.cpc.toFixed(4)}` : 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                      <span className="text-[9px] font-bold text-gray-500 block font-sans">CLICK-THROUGH RATE (CTR)</span>
                      <p className="text-xs font-black text-emerald-400 mt-1">
                        {result.ctr !== null ? `${result.ctr.toFixed(3)}%` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-[#101010] p-4 border border-white/5 rounded-lg font-mono text-xs text-gray-400 leading-relaxed">
                Evaluating a budget of <span className="text-white font-bold">${result.cost.toFixed(2)}</span> with <span className="text-white font-bold">{result.impressions.toLocaleString()}</span> impressions sets your ad cost rate at <span className="text-white font-bold">${result.cpm.toFixed(2)}</span> CPM. 
                {result.ctr !== null && ` Out of these views, receiving ${clicks} clicks results in a CTR of ${result.ctr.toFixed(2)}% with each click valuing at an average CPC index of $${result.cpc?.toFixed(2)}.`}
              </div>
            </div>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
              <TrendingUp className="w-10 h-10 mb-2 text-gray-650" />
              <p className="text-xs">Specify target media metrics on the left panel to execute advertising CPM structures.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 11. LOAN CALCULATOR SUPPORTING COMPLETE AMORTIZATION SCHEDULE TABLE
function LoanCalculator({ isDark }: { isDark: boolean }) {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [term, setTerm] = useState('');
  const [termType, setTermType] = useState<'years' | 'months'>('years');
  const [schedule, setSchedule] = useState<{
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
    rows: Array<{
      period: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }>;
  } | null>(null);

  const [expanded, setExpanded] = useState(false);

  const handleCalculate = () => {
    const principal = parseFloat(amount);
    const apr = parseFloat(rate);
    const rawTerm = parseFloat(term);

    if (isNaN(principal) || principal <= 0 || isNaN(apr) || apr < 0 || isNaN(rawTerm) || rawTerm <= 0) {
      alert("Provide valid loan amount, annual percentage rate (APR), and duration term.");
      return;
    }

    const totalMonths = termType === 'years' ? Math.round(rawTerm * 12) : Math.round(rawTerm);
    const monthlyRate = (apr / 100) / 12;

    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = principal / totalMonths;
    } else {
      monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                       (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    let balance = principal;
    let cumulativeInterest = 0;
    const rows = [];

    for (let m = 1; m <= totalMonths; m++) {
      const interestPayment = balance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment;
      if (m === totalMonths) {
        principalPayment = balance;
      }
      balance = Math.max(0, balance - principalPayment);
      cumulativeInterest += interestPayment;

      rows.push({
        period: m,
        payment: principalPayment + interestPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance
      });
    }

    setSchedule({
      monthlyPayment,
      totalInterest: cumulativeInterest,
      totalPayment: principal + cumulativeInterest,
      rows
    });
  };

  return (
    <div className="space-y-6" id="loan-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Loan Amortization Schedule Solver
        </h2>
        <p className="text-sm text-gray-400">Calculate regular monthly installments, lifetime interest costs, and generate complete balance schedules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit text-xs">
          <div>
            <label className="text-gray-400 font-semibold block mb-1">Loan Amount/Principal ($)</label>
            <input
              type="number" step="any" placeholder="e.g. 250000"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={amount} onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Annual Interest Rate (APR %)</label>
            <input
              type="number" step="any" placeholder="e.g. 5.5"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={rate} onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Term Length</label>
              <input
                type="number" placeholder="e.g. 30"
                className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                value={term} onChange={(e) => setTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Period Unit</label>
              <select
                className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono"
                value={termType} onChange={(e) => setTermType(e.target.value as any)}
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Compute Amortization Table</span>
          </button>
        </div>

        <div className="lg:col-span-2">
          {schedule ? (
            <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-5">
              <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">Financial Amortization Summary</span>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center font-mono">
                <div className="p-3 bg-[#111] border border-white/5 rounded-lg col-span-2 md:col-span-1">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">MONTHLY PAYMENT</span>
                  <p className="text-base font-black text-[#5e94f3] mt-1">${schedule.monthlyPayment.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">LIFETIME INTEREST</span>
                  <p className="text-base font-black text-rose-400 mt-1">${schedule.totalInterest.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">TOTAL PRINCIPAL+INT</span>
                  <p className="text-base font-black text-white mt-1">${schedule.totalPayment.toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-400 font-mono">Monthly Amortization Schedule</span>
                  <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="p-1 px-3 text-[10px] bg-white/5 border border-white/10 rounded text-gray-300 hover:bg-white/10 cursor-pointer"
                  >
                    {expanded ? "Collapse List" : "Show Full Schedule"}
                  </button>
                </div>

                <div className="overflow-x-auto max-h-72 overflow-y-auto border border-white/10 rounded-lg bg-[#111]">
                  <table className="w-full text-left border-collapse text-[11px] font-mono">
                    <thead>
                      <tr className="bg-white/5 text-gray-400 border-b border-white/5 font-mono text-[9px] uppercase font-bold">
                        <th className="p-2">Month</th>
                        <th className="p-2">Payment</th>
                        <th className="p-2">Principal Portion</th>
                        <th className="p-2">Interest Portion</th>
                        <th className="p-2 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.rows.slice(0, expanded ? undefined : 12).map((row) => (
                        <tr key={row.period} className="border-b border-white/3 hover:bg-white/3 text-gray-300">
                          <td className="p-2 font-bold text-white">{row.period}</td>
                          <td className="p-2">${row.payment.toFixed(2)}</td>
                          <td className="p-2 text-emerald-400">${row.principal.toFixed(2)}</td>
                          <td className="p-2 text-rose-455 text-rose-400">${row.interest.toFixed(2)}</td>
                          <td className="p-2 text-right text-white font-bold">${row.balance.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!expanded && schedule.rows.length > 12 && (
                  <p className="text-[10px] text-gray-500 text-center font-mono italic">Showing the first 12 months. Choose "Show Full Schedule" to see all remaining months.</p>
                )}
              </div>
              <ExportBar
                isDark={isDark}
                title="Loan Calculator Results"
                results={[
                  { label: 'Monthly Payment', value: `$${schedule.monthlyPayment.toFixed(2)}` },
                  { label: 'Total Interest', value: `$${schedule.totalInterest.toFixed(2)}` },
                  { label: 'Total Payment', value: `$${schedule.totalPayment.toFixed(2)}` },
                  { label: 'Principal Amount', value: `$${parseFloat(amount) || 0}` },
                  { label: 'Annual Interest Rate', value: `${parseFloat(rate) || 0}%` },
                  { label: 'Loan Term', value: `${parseFloat(term) || 0} ${termType}` },
                ]}
              />
            </div>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
              <Home className="w-10 h-10 mb-2 text-gray-650" />
              <p className="text-xs">Specify the principal amount, interest parameters, and term length to assemble amortization lists.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 12. GST TAX CALCULATOR (ADD / REMOVE GST TARIFFS)
function GstCalculator({ isDark }: { isDark: boolean }) {
  const [price, setPrice] = useState('');
  const [gstRate, setGstRate] = useState('18');
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [result, setResult] = useState<{
    original: number;
    gstAmount: number;
    finalPrice: number;
  } | null>(null);

  const handleCalculate = (rateOption?: string) => {
    const rateVal = parseFloat(rateOption || gstRate) || 0;
    const rawPrice = parseFloat(price);

    if (rateOption) {
      setGstRate(rateOption);
    }

    if (isNaN(rawPrice) || rawPrice <= 0) {
      alert("Provide a valid baseline cost amount!");
      return;
    }

    let gstAmount = 0;
    let finalPrice = 0;

    if (mode === 'add') {
      gstAmount = rawPrice * (rateVal / 100);
      finalPrice = rawPrice + gstAmount;
    } else {
      const base = rawPrice / (1 + (rateVal / 100));
      gstAmount = rawPrice - base;
      finalPrice = base;
    }

    setResult({
      original: rawPrice,
      gstAmount,
      finalPrice
    });
  };

  return (
    <div className="space-y-6" id="gst-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          GST Goods & Services Tax Solver
        </h2>
        <p className="text-sm text-gray-400">Apply GST additions, extract inclusive tax margins, and split total net pricing parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit text-xs">
          <div className="flex gap-2 p-1 bg-[#1a1a1a] rounded border border-white/5">
            <button
              type="button"
              onClick={() => { setMode('add'); setResult(null); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer transition-colors ${mode === 'add' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Add GST (+)
            </button>
            <button
              type="button"
              onClick={() => { setMode('remove'); setResult(null); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer transition-colors ${mode === 'remove' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Remove GST (-)
            </button>
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">
              {mode === 'add' ? "Base Cost (Tax Exclusive) ($)" : "Gross Cost (Tax Inclusive) ($)"}
            </label>
            <input
              type="number" step="any" placeholder="e.g. 500.00"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={price} onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">GST Rate (%)</label>
            <input
              type="number" step="any" placeholder="18"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={gstRate} onChange={(e) => setGstRate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-500 font-bold block">Standard GST Presets:</span>
            <div className="grid grid-cols-4 gap-1">
              {['5', '12', '18', '28'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleCalculate(r)}
                  className={`p-1.5 font-mono text-[10px] font-bold border rounded transition-colors cursor-pointer ${gstRate === r ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-[#1a1a1a] text-gray-400 border-white/5 hover:bg-white/5'}`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleCalculate()}
            className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Process GST Split</span>
          </button>
        </div>

        <div className="lg:col-span-2">
          {result ? (
            <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-4">
              <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">GST Split Ledger Report</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono">
                <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">NET EXCLUDING TAX</span>
                  <p className="text-sm font-black text-white mt-1">
                    ${(mode === 'add' ? result.original : result.finalPrice).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">GST TAX VALUE</span>
                  <p className="text-sm font-black text-rose-400 mt-1">${result.gstAmount.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">GROSS INCLUDING TAX</span>
                  <p className="text-sm font-black text-emerald-400 mt-1">
                    ${(mode === 'add' ? result.finalPrice : result.original).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-[#101010] p-4 border border-white/5 rounded-lg font-mono text-xs text-gray-400 leading-relaxed">
                Appraising a baseline of <span className="text-white font-bold">${result.original.toFixed(2)}</span> under a <span className="text-white font-bold">{gstRate}%</span> GST rate 
                {mode === 'add' 
                  ? ` yields a net GST surcharge component equal to $${result.gstAmount.toFixed(2)}, aggregating to a gross final purchase price of $${result.finalPrice.toFixed(2)}.` 
                  : ` extracts an embedded net GST portion of $${result.gstAmount.toFixed(2)}, leaving a net baseline product value of $${result.finalPrice.toFixed(2)}.`}
              </div>
              <ExportBar
                isDark={isDark}
                title="GST Calculator Results"
                results={[
                  { label: 'Original Amount', value: `$${result.original.toFixed(2)}` },
                  { label: 'GST Amount', value: `$${result.gstAmount.toFixed(2)}` },
                  { label: 'Total Amount', value: `$${(mode === 'add' ? result.finalPrice : result.original).toFixed(2)}` },
                  { label: 'GST Rate', value: `${gstRate}%` },
                ]}
              />
            </div>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
              <Coins className="w-10 h-10 mb-2 text-gray-650" />
              <p className="text-xs">Provide transaction prices and select your GST parameters to generate tax statements.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 13. DAYS CALCULATOR
function DaysCalculator() {
  const [calcMode, setCalcMode] = useState<'diff' | 'offset'>('diff');
  
  // Date grid
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');

  // Offset states
  const [startDate, setStartDate] = useState('');
  const [daysOffset, setDaysOffset] = useState('');

  const [diffResult, setDiffResult] = useState<{
    calendarDays: number;
    businessDays: number;
    weeks: number;
    months: number;
  } | null>(null);

  const [offsetResult, setOffsetResult] = useState<{
    newDate: string;
    dayOfWeek: string;
  } | null>(null);

  const handleDiff = () => {
    if (!date1 || !date2) {
      alert("Provide both date parameters!");
      return;
    }

    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const calendarDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate Business Days
    let businessDays = 0;
    const tempDate = new Date(Math.min(d1.getTime(), d2.getTime()));
    const targetTime = Math.max(d1.getTime(), d2.getTime());

    while (tempDate.getTime() <= targetTime) {
      const day = tempDate.getDay();
      if (day !== 0 && day !== 6) { // Skip Sunday (0) and Saturday (6)
        businessDays++;
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }

    const weeks = calendarDays / 7;
    const months = calendarDays / 30.4375;

    setDiffResult({
      calendarDays,
      businessDays: calendarDays === 0 ? 0 : businessDays,
      weeks,
      months
    });
  };

  const handleOffset = () => {
    if (!startDate || daysOffset === '') {
      alert("Please provide target start date and a valid offset day count!");
      return;
    }

    const d = new Date(startDate);
    const offsetNum = parseInt(daysOffset, 10);
    if (isNaN(offsetNum)) return;

    d.setDate(d.getDate() + offsetNum);

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setOffsetResult({
      newDate: d.toISOString().split('T')[0],
      dayOfWeek: weekdays[d.getDay()]
    });
  };

  return (
    <div className="space-y-6" id="days-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Days & Timeline Calendar Solver
        </h2>
        <p className="text-sm text-gray-400">Resolve exact day counts between selected calendars, workweek days ratios, or project deadlines offset.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit text-xs">
          <div className="flex gap-2 p-1 bg-[#1a1a1a] rounded border border-white/5">
            <button
              type="button"
              onClick={() => { setCalcMode('diff'); setDiffResult(null); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer transition-colors ${calcMode === 'diff' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Days Between
            </button>
            <button
              type="button"
              onClick={() => { setCalcMode('offset'); setOffsetResult(null); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer transition-colors ${calcMode === 'offset' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Add/Sub Days
            </button>
          </div>

          {calcMode === 'diff' ? (
            <>
              <div>
                <label className="text-gray-400 font-semibold block mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                  value={date1} onChange={(e) => setDate1(e.target.value)}
                />
              </div>

              <div>
                <label className="text-gray-400 font-semibold block mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                  value={date2} onChange={(e) => setDate2(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={handleDiff}
                className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Calculate Days Difference</span>
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="text-gray-400 font-semibold block mb-1">Starting Benchmark Date</label>
                <input
                  type="date"
                  className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                  value={startDate} onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-gray-400 font-semibold block mb-1">Days Offset (positive or negative)</label>
                <input
                  type="number" placeholder="e.g. 45 or -30"
                  className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                  value={daysOffset} onChange={(e) => setDaysOffset(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={handleOffset}
                className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Generate Resulting Date</span>
              </button>
            </>
          )}
        </div>

        <div className="lg:col-span-2">
          {calcMode === 'diff' ? (
            diffResult ? (
              <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-4">
                <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">Evaluated Calendar Span</span>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
                  <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                    <span className="text-[9px] font-bold text-gray-500 block font-sans">CALENDAR DAYS</span>
                    <p className="text-base font-black text-indigo-400 mt-1">{diffResult.calendarDays}</p>
                  </div>
                  <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                    <span className="text-[9px] font-bold text-gray-500 block font-sans">BUSINESS DAYS</span>
                    <p className="text-base font-black text-emerald-400 mt-1">{diffResult.businessDays}</p>
                  </div>
                  <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                    <span className="text-[9px] font-bold text-gray-500 block font-sans">WEEKS COUNT</span>
                    <p className="text-base font-black text-white mt-1">{diffResult.weeks.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                    <span className="text-[9px] font-bold text-gray-500 block font-sans">EST. MONTHS</span>
                    <p className="text-base font-black text-white mt-1">{diffResult.months.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-[#101010] p-4 border border-white/5 rounded-lg font-mono text-xs text-gray-400 leading-relaxed">
                  The interval between the requested benchmark dates spans exactly <span className="text-white font-bold">{diffResult.calendarDays} calendar days</span>, which includes <span className="text-white font-bold">{diffResult.businessDays} standard business workdays</span> (excluding Saturdays and Sundays). This translates visually to about <span className="text-white font-bold">{diffResult.weeks.toFixed(1)} weeks</span> of duration.
                </div>
              </div>
            ) : (
              <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
                <CalendarDays className="w-10 h-10 mb-2 text-gray-650" />
                <p className="text-xs">Specify standard start and end calendar dates on the left coordinates to resolve spans.</p>
              </div>
            )
          ) : (
            offsetResult ? (
              <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-4">
                <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">Resulting Offset Date Target</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center font-mono">
                  <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                    <span className="text-[9px] font-bold text-gray-500 block font-sans">COMPUTED TARGET DATE</span>
                    <p className="text-base font-black text-[#6366f1] mt-1">{offsetResult.newDate}</p>
                  </div>
                  <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                    <span className="text-[9px] font-bold text-gray-500 block font-sans">WEEKDAY NAME</span>
                    <p className="text-base font-black text-white mt-1">{offsetResult.dayOfWeek}</p>
                  </div>
                </div>

                <div className="bg-[#101010] p-4 border border-white/5 rounded-lg font-mono text-xs text-gray-400 leading-relaxed">
                  Applying a dynamic offset of <span className="text-white font-bold">{daysOffset} days</span> starting from <span className="text-white font-bold">{startDate}</span> translates the physical tracking coordinate directly to <span className="text-white font-bold">{offsetResult.newDate}</span>, which settles on a <span className="text-white font-bold">{offsetResult.dayOfWeek}</span>.
                </div>
              </div>
            ) : (
              <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
                <CalendarDays className="w-10 h-10 mb-2 text-gray-650" />
                <p className="text-xs">Specify baseline starting date and desired numeric buffer size on the left parameters.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// 14. HOURS CALCULATOR
function HoursCalculator() {
  const [calcMode, setCalcMode] = useState<'duration' | 'timesheet'>('duration');

  // Duration mode
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');
  const [unpaidBreak, setUnpaidBreak] = useState('0');
  const [durResult, setDurResult] = useState<{
    hours: number;
    minutes: number;
    decimal: number;
  } | null>(null);

  // Timesheet mode
  const [timesheetRows, setTimesheetRows] = useState<Array<{ id: number; hours: string; minutes: string }>>([
    { id: 1, hours: '8', minutes: '0' },
  ]);

  const handleAddRow = () => {
    setTimesheetRows([...timesheetRows, { id: Date.now(), hours: '', minutes: '' }]);
  };

  const handleRemoveRow = (id: number) => {
    if (timesheetRows.length === 1) return;
    setTimesheetRows(timesheetRows.filter(r => r.id !== id));
  };

  const handleRowChange = (id: number, field: 'hours' | 'minutes', val: string) => {
    setTimesheetRows(timesheetRows.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const handleCalculateDuration = () => {
    if (!time1 || !time2) {
      alert("Provide both target clock timings!");
      return;
    }

    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    
    let mins1 = h1 * 60 + m1;
    let mins2 = h2 * 60 + m2;

    if (mins2 < mins1) {
      mins2 += 24 * 60; // Safe cross-midnight coverage
    }

    const breakMins = parseInt(unpaidBreak, 10) || 0;
    const netMins = Math.max(0, mins2 - mins1 - breakMins);

    setDurResult({
      hours: Math.floor(netMins / 60),
      minutes: netMins % 60,
      decimal: netMins / 60
    });
  };

  const getTimesheetAggregation = () => {
    let totMins = 0;
    timesheetRows.forEach(row => {
      const h = parseInt(row.hours, 10) || 0;
      const m = parseInt(row.minutes, 10) || 0;
      totMins += h * 60 + m;
    });

    return {
      hours: Math.floor(totMins / 60),
      minutes: totMins % 60,
      decimal: totMins / 60
    };
  };

  const timesheetTotal = getTimesheetAggregation();

  return (
    <div className="space-y-6" id="hours-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Hours & Freelance Timesheet Compiler
        </h2>
        <p className="text-sm text-gray-400">Resolve exact timings gaps, convert hours format to decimals and aggregate complex billable timesheets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit text-xs">
          <div className="flex gap-2 p-1 bg-[#1a1a1a] rounded border border-white/5">
            <button
              type="button"
              onClick={() => { setCalcMode('duration'); setDurResult(null); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer transition-colors ${calcMode === 'duration' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Time Gap Code
            </button>
            <button
              type="button"
              onClick={() => { setCalcMode('timesheet'); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer transition-colors ${calcMode === 'timesheet' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Timesheet Sum
            </button>
          </div>

          {calcMode === 'duration' ? (
            <>
              <div>
                <label className="text-gray-400 font-semibold block mb-1">Start Hour (Clock In)</label>
                <input
                  type="time"
                  className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                  value={time1} onChange={(e) => setTime1(e.target.value)}
                />
              </div>

              <div>
                <label className="text-gray-400 font-semibold block mb-1">End Hour (Clock Out)</label>
                <input
                  type="time"
                  className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                  value={time2} onChange={(e) => setTime2(e.target.value)}
                />
              </div>

              <div>
                <label className="text-gray-400 font-semibold block mb-1">Unpaid Break Duration (minutes)</label>
                <input
                  type="number" placeholder="e.g. 45"
                  className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                  value={unpaidBreak} onChange={(e) => setUnpaidBreak(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={handleCalculateDuration}
                className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Calculate Active Interval</span>
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <span className="text-[10px] text-gray-500 font-bold block mb-1">Timesheet Cards List:</span>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {timesheetRows.map((row) => (
                  <div key={row.id} className="flex gap-2 items-center">
                    <input
                      type="number" placeholder="Hrs"
                      className="w-16 p-2 bg-[#1a1a1a] border border-white/10 rounded text-white text-center font-mono text-xs"
                      value={row.hours} onChange={(e) => handleRowChange(row.id, 'hours', e.target.value)}
                    />
                    <span className="text-gray-600 font-bold">:</span>
                    <input
                      type="number" placeholder="Min"
                      className="w-16 p-2 bg-[#1a1a1a] border border-white/10 rounded text-white text-center font-mono text-xs"
                      value={row.minutes} onChange={(e) => handleRowChange(row.id, 'minutes', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(row.id)}
                      className="p-2 bg-rose-950/20 text-rose-400 border border-rose-500/10 rounded text-xs hover:bg-rose-900/30 cursor-pointer transition-colors"
                      title="Remove shift row"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddRow}
                className="w-full p-2 bg-indigo-550 border border-indigo-500/20 text-indigo-300 rounded font-bold hover:bg-indigo-500/10 flex items-center justify-center gap-1 cursor-pointer text-xs"
              >
                <Plus className="w-3 h-3" />
                <span>Add Shift Slot</span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {calcMode === 'duration' ? (
            durResult ? (
              <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-4">
                <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">Compiled Duration Values</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center font-mono">
                  <div className="p-3 bg-[#111] border border-white/5 rounded-lg border-l-2 border-l-indigo-500">
                    <span className="text-[9px] font-bold text-gray-500 block font-sans">TIMELINE FORMAT</span>
                    <p className="text-base font-black text-white mt-1">{durResult.hours} hours, {durResult.minutes} minutes</p>
                  </div>
                  <div className="p-3 bg-[#111] border border-white/5 rounded-lg border-l-2 border-l-emerald-500">
                    <span className="text-[9px] font-bold text-gray-500 block font-sans">DIGITAL DECIMAL HOURS</span>
                    <p className="text-base font-black text-emerald-400 mt-1">{durResult.decimal.toFixed(4)} hrs</p>
                  </div>
                </div>

                <div className="bg-[#101010] p-4 border border-white/5 rounded-lg font-mono text-xs text-gray-400 leading-relaxed">
                  Clocking in at <span className="text-white font-bold">{time1}</span> and leaving at <span className="text-white font-bold">{time2}</span>, after deducting an unpaid resting break equivalent to <span className="text-white font-bold">{unpaidBreak} minutes</span>, records a total balance of <span className="text-white font-bold">{durResult.hours} hours and {durResult.minutes} minutes</span>. For billing and billing payroll records, this represents exactly <span className="text-white font-bold">{durResult.decimal.toFixed(2)} billable hours</span>.
                </div>
              </div>
            ) : (
              <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
                <Clock className="w-10 h-10 mb-2 text-gray-650" />
                <p className="text-xs">Select target Clock In & Clock Out milestones to resolve active shift gaps.</p>
              </div>
            )
          ) : (
            <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-4">
              <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">Timesheet Aggregate Balance</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center font-mono">
                <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">AGGREGATED WORK TIMINGS</span>
                  <p className="text-base font-black text-white mt-1">{timesheetTotal.hours} hrs, {timesheetTotal.minutes} mins</p>
                </div>
                <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-500 block font-sans">TOTAL DECIMAL QUANTIFICATION</span>
                  <p className="text-base font-black text-emerald-400 mt-1">{timesheetTotal.decimal.toFixed(4)} decimal hrs</p>
                </div>
              </div>

              <div className="bg-[#101010] p-4 border border-white/5 rounded-lg font-mono text-xs text-gray-400 leading-relaxed">
                Compilers are aggregating <span className="text-white font-bold">{timesheetRows.length} shift cards</span>. The accumulated sum volume matches exactly <span className="text-white font-bold">{timesheetTotal.hours} hours and {timesheetTotal.minutes} minutes</span>, representing a total coefficient of <span className="text-white font-bold">{timesheetTotal.decimal.toFixed(2)} active decimal hours</span> on accounting databases.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 15. MONTH CALCULATOR
function MonthCalculator() {
  const [calcMode, setCalcMode] = useState<'diff' | 'offset'>('diff');
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [startDate, setStartDate] = useState('');
  const [monthsOffset, setMonthsOffset] = useState('');

  const [diffMsg, setDiffMsg] = useState<{
    months: number;
    quarters: number;
    daysRemainder: number;
    totalDays: number;
  } | null>(null);

  const [offsetMsg, setOffsetMsg] = useState<{
    newDate: string;
    quarter: string;
    isLeap: boolean;
  } | null>(null);

  const handleDiff = () => {
    if (!date1 || !date2) {
      alert("Please provide both target dates!");
      return;
    }
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;

    let yearDiff = end.getFullYear() - start.getFullYear();
    let monthDiff = end.getMonth() - start.getMonth();
    let totalMonths = yearDiff * 12 + monthDiff;

    let daysRemainder = end.getDate() - start.getDate();
    if (daysRemainder < 0) {
      totalMonths -= 1;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      daysRemainder = prevMonth.getDate() + daysRemainder;
    }

    const diffDays = Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));

    setDiffMsg({
      months: totalMonths,
      quarters: totalMonths / 3,
      daysRemainder,
      totalDays: diffDays
    });
  };

  const handleOffset = () => {
    if (!startDate || monthsOffset === '') {
      alert("Provide starting benchmark date and dynamic month offset values!");
      return;
    }

    const d = new Date(startDate);
    const offsetNum = parseInt(monthsOffset, 10);
    if (isNaN(offsetNum)) return;

    d.setMonth(d.getMonth() + offsetNum);

    const q = Math.ceil((d.getMonth() + 1) / 3);
    const year = d.getFullYear();
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

    setOffsetMsg({
      newDate: d.toISOString().split('T')[0],
      quarter: `Q${q} (${year})`,
      isLeap
    });
  };

  return (
    <div className="space-y-6" id="month-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Month Milestone & Business Quarter Solver
        </h2>
        <p className="text-sm text-gray-400">Evaluate timeline month-span counts, calculate financial quarters, and apply offset periods cleanly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit text-xs">
          <div className="flex gap-2 p-1 bg-[#1a1a1a] rounded border border-white/5">
            <button
              type="button"
              onClick={() => { setCalcMode('diff'); setDiffMsg(null); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer transition-colors ${calcMode === 'diff' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Months Difference
            </button>
            <button
              type="button"
              onClick={() => { setCalcMode('offset'); setOffsetMsg(null); }}
              className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer transition-colors ${calcMode === 'offset' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Month Shifter
            </button>
          </div>

          {calcMode === 'diff' ? (
            <>
              <div>
                <label className="text-gray-400 font-semibold block mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                  value={date1} onChange={(e) => setDate1(e.target.value)}
                />
              </div>

              <div>
                <label className="text-gray-400 font-semibold block mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                  value={date2} onChange={(e) => setDate2(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={handleDiff}
                className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <CalendarRange className="w-3.5 h-3.5" />
                <span>Calculate Month Gap</span>
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="text-gray-400 font-semibold block mb-1">Benchmark Start Date</label>
                <input
                  type="date"
                  className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                  value={startDate} onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-gray-400 font-semibold block mb-1">Months Offset magnitude (+/-)</label>
                <input
                  type="number" placeholder="e.g. 6 or -12"
                  className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                  value={monthsOffset} onChange={(e) => setMonthsOffset(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={handleOffset}
                className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <CalendarRange className="w-3.5 h-3.5" />
                <span>Shift Calendar Date</span>
              </button>
            </>
          )}
        </div>

        <div className="lg:col-span-2">
          {calcMode === 'diff' ? (
            diffMsg ? (
              <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-4">
                <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">Compiled Month Timeline Difference</span>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
                  <div className="p-3 bg-[#111] border border-white/5 rounded-lg border-l-2 border-l-indigo-500">
                    <span className="text-[9px] font-bold text-gray-500 block font-sans">FULL MONTHS</span>
                    <p className="text-base font-black text-white mt-1">{diffMsg.months}</p>
                  </div>
                  <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                    <span className="text-[9px] font-bold text-gray-500 block font-sans">DAYS REMAINDER</span>
                    <p className="text-base font-black text-white mt-1">{diffMsg.daysRemainder}</p>
                  </div>
                  <div className="p-3 bg-[#111] border border-white/5 rounded-lg border-l-2 border-l-emerald-500">
                    <span className="text-[9px] font-bold text-gray-500 block font-sans">QUARTERS RATIO</span>
                    <p className="text-base font-black text-emerald-400 mt-1">{diffMsg.quarters.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                    <span className="text-[9px] font-bold text-gray-500 block font-sans">TOTAL DAYS</span>
                    <p className="text-base font-black text-white mt-1">{diffMsg.totalDays}</p>
                  </div>
                </div>

                <div className="bg-[#101010] p-4 border border-white/5 rounded-lg font-mono text-xs text-gray-400 leading-relaxed">
                  The interval covers an aggregate difference of <span className="text-white font-bold">{diffMsg.months} full calendar months</span> and <span className="text-white font-bold">{diffMsg.daysRemainder} days</span>. On standard economic records, this matches <span className="text-white font-bold">{diffMsg.quarters.toFixed(2)} physical business quarters</span>, representing a gross day total of <span className="text-white font-bold">{diffMsg.totalDays} calendar days</span>.
                </div>
              </div>
            ) : (
              <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
                <CalendarRange className="w-10 h-10 mb-2 text-gray-650" />
                <p className="text-xs">Specify timeline calendar targets to parse comparative monthly milestones.</p>
              </div>
            )
          ) : (
            offsetMsg ? (
              <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-4">
                <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">Shifted Calendar Target</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono">
                  <div className="p-3 bg-[#111] border border-white/5 rounded-lg border-l-2 border-l-indigo-500 col-span-2">
                    <span className="text-[9px] font-bold text-gray-500 block font-sans">CALCULATED TARGET DATE</span>
                    <p className="text-base font-black text-white mt-1">{offsetMsg.newDate}</p>
                  </div>
                  <div className="p-3 bg-[#111] border border-white/5 rounded-lg">
                    <span className="text-[9px] font-bold text-gray-500 block font-sans">QUARTER LABEL</span>
                    <p className="text-sm font-black text-white mt-1">{offsetMsg.quarter}</p>
                  </div>
                </div>

                <div className="bg-[#101010] p-4 border border-white/5 rounded-lg font-mono text-xs text-gray-400 leading-relaxed">
                  Shifting the starting date forward/backwards by <span className="text-white font-bold">{monthsOffset} months</span> evaluates the target milestone coordinates to <span className="text-white font-bold">{offsetMsg.newDate}</span>, residing inside <span className="text-white font-bold">{offsetMsg.quarter}</span>. 
                  {offsetMsg.isLeap ? " The resulting destination year is a Leap Year (366 days)." : " The resulting destination year is a standard 365-day calendar cycle."}
                </div>
              </div>
            ) : (
              <div className="h-full border border-dashed border-white/10 rounded-xl bg-[#141414] flex flex-col items-center justify-center text-center p-8 text-gray-500 min-h-[220px]">
                <CalendarRange className="w-10 h-10 mb-2 text-gray-650" />
                <p className="text-xs">Provide a target baseline date and month shifter coefficients to resolve bounds.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// 16. STRIPE FEE CALCULATOR
function StripeFeeCalculator() {
  const [amountInput, setAmountInput] = useState('100');
  const [feePercent, setFeePercent] = useState('2.9');
  const [fixedFee, setFixedFee] = useState('0.30');
  const [intlCard, setIntlCard] = useState(false);

  const amount = parseFloat(amountInput) || 0;
  const rawRate = (parseFloat(feePercent) || 0) / 100;
  const extraRate = intlCard ? 0.015 : 0; // standard international surcharge 1.5%
  const rate = rawRate + extraRate;
  const fixed = parseFloat(fixedFee) || 0;

  // Calculations
  const calculatedFee = (amount * rate) + fixed;
  const netAmount = Math.max(0, amount - calculatedFee);

  // Target amount to charge to receive exactly "amount"
  // net = charge - (charge * rate + fixed)
  // net + fixed = charge * (1 - rate)
  // charge = (net + fixed) / (1 - rate)
  const targetToCharge = rate >= 1 ? 0 : (amount + fixed) / (1 - rate);
  const targetFee = (targetToCharge * rate) + fixed;

  return (
    <div className="space-y-6" id="stripe-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-[#635bff]/20 text-[#7a73ff] border border-[#635bff]/30 rounded">STRIPE SERVICE</span>
          Stripe Payment Fee & Invoice Premium Solver
        </h2>
        <p className="text-sm text-gray-400">Identify precise stripe transaction charges, payout deductions and exact request invoicing metrics dynamically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-xs">
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono block">Transaction Rules Parameters</span>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Base Transaction Amount ($)</label>
            <input
              type="number" step="any" placeholder="e.g. 100.00"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={amountInput} onChange={(e) => setAmountInput(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Fee Percentage (%)</label>
              <input
                type="number" step="any"
                className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                value={feePercent} onChange={(e) => setFeePercent(e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-400 font-semibold block mb-1">Fixed Cost Fee ($)</label>
              <input
                type="number" step="any"
                className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
                value={fixedFee} onChange={(e) => setFixedFee(e.target.value)}
              />
            </div>
          </div>

          <div className="p-3 bg-[#111] border border-white/5 rounded-lg flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-white block">International Gateway</span>
              <p className="text-[10px] text-gray-500">Adds an additional 1.5% inter-region card rate fee.</p>
            </div>
            <input
              type="checkbox"
              className="w-4 h-4 accent-[#635bff] cursor-pointer"
              checked={intlCard} onChange={(e) => setIntlCard(e.target.checked)}
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-5">
            <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">Transaction Breakdown Statistics</span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono">
              <div className="p-3 bg-[#111] border border-white/5 rounded-lg border-l-2 border-l-[#635bff]">
                <span className="text-[9px] font-bold text-gray-500 block font-sans">ORIGINAL INVOICE</span>
                <p className="text-sm font-black text-white mt-1">${amount.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-[#111] border border-white/5 rounded-lg border-l-2 border-l-red-500">
                <span className="text-[9px] font-bold text-gray-500 block font-sans">STRIPE FEE</span>
                <p className="text-sm font-black text-rose-400 mt-1">-${calculatedFee.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-[#111] border border-white/5 rounded-lg border-l-2 border-l-emerald-500">
                <span className="text-[9px] font-bold text-gray-500 block font-sans">NET CASHOUT PAYOUT</span>
                <p className="text-sm font-black text-emerald-400 mt-1">${netAmount.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-indigo-950/10 border border-indigo-500/10 rounded-xl p-4 space-y-3">
              <span className="text-[10px] font-semibold text-indigo-400 uppercase font-mono block">Exact Invoice Goal Calculator</span>
              <p className="text-gray-400 text-xs font-sans leading-relaxed">
                If you request your client to pay exactly <span className="text-emerald-400 font-bold">${amount.toFixed(2)}</span> cash-in hand, you must invoice them for a gross transaction of:
              </p>
              <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg border border-white/5 font-mono">
                <div>
                  <span className="text-[9px] text-gray-500 font-sans block">TOTAL GROSS CHARGE REQUIRED</span>
                  <p className="text-base font-black text-white mt-0.5">${targetToCharge.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-gray-500 font-sans block">DEDUCTIBLE FEES</span>
                  <p className="text-xs font-bold text-rose-400 mt-0.5">-${targetFee.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 17. UNIFIED CALORIE & TDEE CALCULATOR
function CalorieAndTdeeCalculator() {
  const [gender, setGender] = useState<'m' | 'f'>('m');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('25');
  const [activity, setActivity] = useState('1.375'); // Lightly active
  const [bodyFat, setBodyFat] = useState('');
  const [macroStyle, setMacroStyle] = useState<'moderate' | 'low-carb' | 'high-carb'>('moderate');

  const w = parseFloat(weight) || 0;
  const h = parseFloat(height) || 0;
  const a = parseFloat(age) || 0;
  const act = parseFloat(activity) || 1.2;
  const bf = parseFloat(bodyFat) || 0;

  // BMR resolution - Katch-McArdle or Mifflin
  let bmr = 0;
  let calculationMethod = 'Mifflin-St Jeor';
  
  if (bf > 0 && bf < 100) {
    const lbm = w * (1 - (bf / 100));
    bmr = 370 + (21.6 * lbm);
    calculationMethod = 'Katch-McArdle (LBM-based)';
  } else {
    bmr = gender === 'm'
      ? (10 * w) + (6.25 * h) - (5 * a) + 5
      : (10 * w) + (6.25 * h) - (5 * a) - 161;
  }

  const tdee = bmr * act;

  // Macro Splits setup
  let proteinRatio = 0.35;
  let carbRatio = 0.35;
  let fatRatio = 0.30;

  if (macroStyle === 'low-carb') {
    proteinRatio = 0.45;
    carbRatio = 0.20;
    fatRatio = 0.35;
  } else if (macroStyle === 'high-carb') {
    proteinRatio = 0.30;
    carbRatio = 0.45;
    fatRatio = 0.25;
  }

  // Weight (grams) conversion: Protein (4 kcal/g), Carb (4 kcal/g), Fat (9 kcal/g)
  const proteinGrams = (tdee * proteinRatio) / 4;
  const carbGrams = (tdee * carbRatio) / 4;
  const fatGrams = (tdee * fatRatio) / 9;

  return (
    <div className="space-y-6" id="unified-calorie-tdee-calc-comp">
      <div className="pb-4 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="p-1 px-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">CALCULATOR</span>
          Unified Calorie & TDEE Metabolic Solver
        </h2>
        <p className="text-sm text-gray-400">Estimate cellular resting metabolism (BMR), actual active expenditure (TDEE), and align precise dietary macros.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-xs">
        {/* Left Inputs Card */}
        <div className="bg-[#141414] border border-white/5 p-5 rounded-xl space-y-4 h-fit">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono block">Biometrics & Composition</span>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Gender</label>
            <div className="flex gap-2 p-1 bg-[#1a1a1a] rounded border border-white/5">
              <button
                type="button"
                onClick={() => setGender('m')}
                className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer transition-colors ${gender === 'm' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender('f')}
                className={`flex-1 p-1.5 font-bold rounded text-center cursor-pointer transition-colors ${gender === 'f' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
              >
                Female
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Weight (kg)</label>
              <input
                type="number"
                className="w-full p-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none text-center"
                value={weight} onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Height (cm)</label>
              <input
                type="number"
                className="w-full p-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none text-center"
                value={height} onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Age (Years)</label>
              <input
                type="number"
                className="w-full p-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none text-center"
                value={age} onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">
              Body Fat Percentage (%) <span className="text-gray-650 font-normal">(optional)</span>
            </label>
            <input
              type="number" 
              placeholder="Estimate using Mifflin-St Jeor"
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-mono outline-none"
              value={bodyFat} onChange={(e) => setBodyFat(e.target.value)}
            />
            <p className="text-[10px] text-gray-450 mt-1 italic">
              Providing body fat enables precise Lean Body Mass (LBM) calculations using Katch-McArdle formula.
            </p>
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Activity Level / Routine</label>
            <select
              className="w-full p-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white font-sans outline-none"
              value={activity} onChange={(e) => setActivity(e.target.value)}
            >
              <option value="1.2">Sedentary (No workouts / desk bound)</option>
              <option value="1.375">Lightly Active (1-3 days high-intensity / week)</option>
              <option value="1.55">Moderately Active (3-5 sessions of active workouts)</option>
              <option value="1.725">Very Active (6-7 intense days of training)</option>
              <option value="1.9">Extra Active (Professional double day athletic volume)</option>
            </select>
          </div>
        </div>

        {/* Right Output Dash */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-5">
            <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block">
              Daily Metabolism Evaluation &bull; {calculationMethod} Method
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center font-mono">
              <div className="p-3 bg-[#111] border border-white/5 rounded-lg border-l-2 border-l-indigo-500">
                <span className="text-[9px] font-bold text-gray-500 block font-sans">BASAL METABOLIC RATE (BMR)</span>
                <p className="text-lg font-black text-indigo-400 mt-1">{bmr.toFixed(0)} kcal/day</p>
                <span className="text-[9px] text-gray-500">Resting background cellular burn</span>
              </div>
              <div className="p-3 bg-[#111] border border-white/5 rounded-lg border-l-2 border-l-emerald-500">
                <span className="text-[9px] font-bold text-gray-500 block font-sans">TOTAL ACTIVE ENERGY (TDEE)</span>
                <p className="text-lg font-black text-emerald-400 mt-1">{tdee.toFixed(0)} kcal/day</p>
                <span className="text-[9px] text-gray-500">Active maintenance energy threshold</span>
              </div>
            </div>

            {/* Nutrition Target Vectors */}
            <div className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-3 font-sans">
              <span className="text-[10px] font-bold text-white uppercase font-mono block">Nutritional Target Vectors</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs">
                <div className="flex justify-between items-center p-2.5 bg-[#1b1b1b] rounded border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block border border-indigo-400"></span>
                    <span>Maintenance Limit</span>
                  </div>
                  <span className="font-bold text-white">{tdee.toFixed(0)} kcal</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-[#1b1b1b] rounded border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block border border-emerald-400"></span>
                    <span>Mild Loss (-0.25 kg/wk)</span>
                  </div>
                  <span className="font-bold text-emerald-400">{(tdee - 250).toFixed(0)} kcal</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-[#1b1b1b] rounded border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block border border-yellow-400"></span>
                    <span>Standard Cut (-0.5 kg/wk)</span>
                  </div>
                  <span className="font-bold text-yellow-400">{(tdee - 500).toFixed(0)} kcal</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-[#1b1b1b] rounded border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block border border-red-450"></span>
                    <span>Bulk Surplus Gain (+0.5 kg/wk)</span>
                  </div>
                  <span className="font-bold text-rose-400">{(tdee + 500).toFixed(0)} kcal</span>
                </div>
              </div>
            </div>

            {/* Macros Section */}
            <div className="bg-[#111] border border-white/5 rounded-xl p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-white uppercase font-mono block">Nutritional Macronutrient Alignment</span>
                  <p className="text-[10px] text-gray-500">Based on target TDEE maintenance values</p>
                </div>
                <div className="flex bg-[#1a1a1a] p-1 rounded border border-white/5 gap-1 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setMacroStyle('moderate')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${macroStyle === 'moderate' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
                  >
                    Balanced Split (35/35/30)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMacroStyle('low-carb')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${macroStyle === 'low-carb' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
                  >
                    Low Carb Cuts (45/20/35)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMacroStyle('high-carb')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${macroStyle === 'high-carb' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
                  >
                    High Carb Bulk (30/45/25)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                <div className="bg-[#151515] p-3 text-center rounded-lg border border-white/5">
                  <span className="text-[8px] font-semibold text-gray-500 block font-sans">PROTEIN ({(proteinRatio * 100)}%)</span>
                  <p className="text-sm font-bold text-indigo-400 mt-1">{proteinGrams.toFixed(0)}g</p>
                  <span className="text-[9px] text-gray-550 font-normal">{(tdee * proteinRatio).toFixed(0)} kcal</span>
                </div>

                <div className="bg-[#151515] p-3 text-center rounded-lg border border-white/5">
                  <span className="text-[8px] font-semibold text-gray-500 block font-sans">CARBS ({(carbRatio * 100)}%)</span>
                  <p className="text-sm font-bold text-yellow-400 mt-1">{carbGrams.toFixed(0)}g</p>
                  <span className="text-[9px] text-gray-550 font-normal">{(tdee * carbRatio).toFixed(0)} kcal</span>
                </div>

                <div className="bg-[#151515] p-3 text-center rounded-lg border border-white/5">
                  <span className="text-[8px] font-semibold text-gray-500 block font-sans">FAT ({(fatRatio * 100)}%)</span>
                  <p className="text-sm font-bold text-emerald-400 mt-1">{fatGrams.toFixed(0)}g</p>
                  <span className="text-[9px] text-gray-550 font-normal">{(tdee * fatRatio).toFixed(0)} kcal</span>
                </div>
              </div>
            </div>

            {/* Explanation/Insight Box */}
            <div className="bg-[#101010] p-4 border border-white/5 rounded-lg text-gray-400 text-xs leading-relaxed font-sans">
              Based on the biological coordinates configured ({weight}kg, {height}cm, {age}yo, biological sex: {gender === 'm' ? 'Male' : 'Female'}), your body expends roughly <span className="text-indigo-400 font-bold font-mono">{bmr.toFixed(0)} kcal</span> simply maintaining basic life systems at complete rest. Integrating your physical routine index pushes your daily expenditure threshold to <span className="text-emerald-400 font-bold font-mono">{tdee.toFixed(0)} kcal</span>. To facilitate standard body composition cuts, consume <span className="text-yellow-400 font-bold font-mono">{(tdee - 500).toFixed(0)} kcal</span> daily with a split of <span className="text-white font-bold font-mono">{proteinGrams.toFixed(0)}g</span> protein, <span className="text-white font-bold font-mono">{carbGrams.toFixed(0)}g</span> carbohydrate, and <span className="text-white font-bold font-mono">{fatGrams.toFixed(0)}g</span> dietary fat.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

