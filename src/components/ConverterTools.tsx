import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

interface Unit {
  name: string;
  code: string;
  factor: number; // Factor relative to standard base unit
}

interface ConverterConfig {
  title: string;
  id: string;
  description: string;
  icon: keyof typeof Icons;
  baseUnit: string;
  units: Unit[];
  placeholderVal?: number;
}

const CONVERTER_CONFIG_MAP: Record<string, ConverterConfig> = {
  'length-conv': {
    title: 'Length Converter',
    id: 'length-conv',
    description: 'Convert lengths and distances across metric, imperial, and maritime units.',
    icon: 'Ruler',
    baseUnit: 'm',
    units: [
      { name: 'Meters (m)', code: 'm', factor: 1.0 },
      { name: 'Kilometers (km)', code: 'km', factor: 0.001 },
      { name: 'Centimeters (cm)', code: 'cm', factor: 100.0 },
      { name: 'Millimeters (mm)', code: 'mm', factor: 1000.0 },
      { name: 'Micrometers (μm)', code: 'um', factor: 1000000.0 },
      { name: 'Nanometers (nm)', code: 'nm', factor: 1e9 },
      { name: 'Miles (mi)', code: 'mi', factor: 0.000621371192 },
      { name: 'Yards (yd)', code: 'yd', factor: 1.0936133 },
      { name: 'Feet (ft)', code: 'ft', factor: 3.2808399 },
      { name: 'Inches (in)', code: 'in', factor: 39.3700787 },
      { name: 'Nautical Miles (nmi)', code: 'nmi', factor: 0.000539956803 }
    ]
  },
  'area-conv': {
    title: 'Area Converter',
    id: 'area-conv',
    description: 'Convert land size, building areas, and geographic dimensions seamlessly.',
    icon: 'Square',
    baseUnit: 'm2',
    units: [
      { name: 'Square Meters (m²)', code: 'm2', factor: 1.0 },
      { name: 'Square Kilometers (km²)', code: 'km2', factor: 1e-6 },
      { name: 'Square Centimeters (cm²)', code: 'cm2', factor: 10000.0 },
      { name: 'Square Millimeters (mm²)', code: 'mm2', factor: 1000000.0 },
      { name: 'Square Miles (mi²)', code: 'mi2', factor: 3.86102159e-7 },
      { name: 'Square Yards (yd²)', code: 'yd2', factor: 1.19599005 },
      { name: 'Square Feet (ft²)', code: 'ft2', factor: 10.7639104 },
      { name: 'Square Inches (in²)', code: 'in2', factor: 1550.0031 },
      { name: 'Hectares (ha)', code: 'ha', factor: 1e-4 },
      { name: 'Acres (ac)', code: 'ac', factor: 0.000247105381 }
    ]
  },
  'weight-conv': {
    title: 'Weight & Mass Converter',
    id: 'weight-conv',
    description: 'Convert masses across scientific precision scales and everyday units.',
    icon: 'Scale',
    baseUnit: 'g',
    units: [
      { name: 'Grams (g)', code: 'g', factor: 1.0 },
      { name: 'Kilograms (kg)', code: 'kg', factor: 0.001 },
      { name: 'Milligrams (mg)', code: 'mg', factor: 1000.0 },
      { name: 'Micrograms (μg)', code: 'ug', factor: 1000000.0 },
      { name: 'Metric Tons (t)', code: 't', factor: 1e-6 },
      { name: 'Pounds (lb)', code: 'lb', factor: 0.00220462262 },
      { name: 'Ounces (oz)', code: 'oz', factor: 0.0352739619 },
      { name: 'Stones (st)', code: 'st', factor: 0.000157473044 },
      { name: 'Carats (ct)', code: 'ct', factor: 5.0 },
      { name: 'Grains (gr)', code: 'gr', factor: 15.4323584 }
    ]
  },
  'volume-conv': {
    title: 'Volume Converter',
    id: 'volume-conv',
    description: 'Convert liquid and dry volumes, kitchen recipes, and cubic standard volumes.',
    icon: 'Droplet',
    baseUnit: 'L',
    units: [
      { name: 'Liters (L)', code: 'L', factor: 1.0 },
      { name: 'Milliliters (mL)', code: 'mL', factor: 1000.0 },
      { name: 'Cubic Meters (m³)', code: 'm3', factor: 0.001 },
      { name: 'Cubic Centimeters (cm³)', code: 'cm3', factor: 1000.0 },
      { name: 'US Gallons (gal)', code: 'gal', factor: 0.264172052 },
      { name: 'US Quarts (qt)', code: 'qt', factor: 1.05668821 },
      { name: 'US Pints (pt)', code: 'pt', factor: 2.11337642 },
      { name: 'US Cups (cup)', code: 'cup', factor: 4.16666667 }, // Standard US Cup (approx 240ml)
      { name: 'US Fluid Ounces (fl oz)', code: 'floz', factor: 33.8140227 },
      { name: 'US Tablespoons (tbsp)', code: 'tbsp', factor: 67.6280454 },
      { name: 'US Teaspoons (tsp)', code: 'tsp', factor: 202.884136 }
    ]
  },
  'temp-conv': {
    title: 'Temperature Converter',
    id: 'temp-conv',
    description: 'Convert temperature values across thermal scientific bounds.',
    icon: 'Thermometer',
    baseUnit: 'c',
    units: [
      { name: 'Celsius (°C)', code: 'c', factor: 1.0 },
      { name: 'Fahrenheit (°F)', code: 'f', factor: 1.0 },
      { name: 'Kelvin (K)', code: 'k', factor: 1.0 },
      { name: 'Rankine (°R)', code: 'r', factor: 1.0 }
    ]
  },
  'each-conv': {
    title: 'Each & Count Converter',
    id: 'each-conv',
    description: 'Convert item count arrays between standard batches and bulk quantities.',
    icon: 'Boxes',
    baseUnit: 'pcs',
    units: [
      { name: 'Single Units (pcs)', code: 'pcs', factor: 1.0 },
      { name: 'Pairs (pr)', code: 'pr', factor: 0.5 },
      { name: 'Dozens (doz)', code: 'doz', factor: 1 / 12 },
      { name: 'Baker\'s Dozens', code: 'ba.doz', factor: 1 / 13 },
      { name: 'Scores (score)', code: 'score', factor: 1 / 20 },
      { name: 'Gross (grs)', code: 'grs', factor: 1 / 144 },
      { name: 'Great Gross (gg)', code: 'gg', factor: 1 / 1728 }
    ]
  },
  'time-conv': {
    title: 'Time & Calendar Converter',
    id: 'time-conv',
    description: 'Convert chronos parameters from nanosecond thresholds up to average calendar years.',
    icon: 'Clock',
    baseUnit: 's',
    units: [
      { name: 'Seconds (s)', code: 's', factor: 1.0 },
      { name: 'Nanoseconds (ns)', code: 'ns', factor: 1e9 },
      { name: 'Microseconds (μs)', code: 'us', factor: 1e6 },
      { name: 'Milliseconds (ms)', code: 'ms', factor: 1000.0 },
      { name: 'Minutes (min)', code: 'min', factor: 1 / 60 },
      { name: 'Hours (h)', code: 'h', factor: 1 / 3600 },
      { name: 'Days (d)', code: 'd', factor: 1 / 86400 },
      { name: 'Weeks (wk)', code: 'wk', factor: 1 / 604800 },
      { name: 'Months (mo)', code: 'mo', factor: 1 / 2629746 }, // Average Gregorian month
      { name: 'Years (yr)', code: 'yr', factor: 1 / 31536000 } // Average calendar year
    ]
  },
  'digital-conv': {
    title: 'Digital Storage Converter',
    id: 'digital-conv',
    description: 'Convert data capacities between binary (base-2) and decimal (base-10) metrics.',
    icon: 'Database',
    baseUnit: 'B',
    units: [
      { name: 'Bytes (B)', code: 'B', factor: 1.0 },
      { name: 'Bits (b)', code: 'b', factor: 8.0 },
      { name: 'Kilobits (kb)', code: 'kb', factor: 0.008 },
      { name: 'Kilobytes (KB - Binary)', code: 'KB', factor: 1 / 1024 },
      { name: 'Megabits (Mb)', code: 'Mb', factor: 0.000008 },
      { name: 'Megabytes (MB - Binary)', code: 'MB', factor: 1 / 1048576 },
      { name: 'Gigabits (Gb)', code: 'Gb', factor: 8e-9 },
      { name: 'Gigabytes (GB - Binary)', code: 'GB', factor: 1 / 1073741824 },
      { name: 'Terabits (Tb)', code: 'Tb', factor: 8e-12 },
      { name: 'Terabytes (TB - Binary)', code: 'TB', factor: 1 / 1099511627776 },
      { name: 'Petabits (Pb)', code: 'Pb', factor: 8e-15 },
      { name: 'Petabytes (PB - Binary)', code: 'PB', factor: 1 / 1125899906842624 }
    ]
  },
  'parts-per-conv': {
    title: 'Parts-Per (Concentration) Converter',
    id: 'parts-per-conv',
    description: 'Convert scientific fractions, ratios, and concentration solutions instantly.',
    icon: 'Percent',
    baseUnit: 'ppm',
    units: [
      { name: 'Parts-per-million (ppm)', code: 'ppm', factor: 1.0 },
      { name: 'Ratio (Fraction)', code: 'ratio', factor: 0.000001 },
      { name: 'Percentage (%)', code: 'percent', factor: 0.0001 },
      { name: 'Permille (‰)', code: 'permille', factor: 0.001 },
      { name: 'Parts-per-billion (ppb)', code: 'ppb', factor: 1000.0 },
      { name: 'Parts-per-trillion (ppt)', code: 'ppt', factor: 1000000.0 }
    ]
  },
  'speed-conv': {
    title: 'Speed Converter',
    id: 'speed-conv',
    description: 'Convert travel velocities across standard terrestrial, aeronautical, and maritime ratios.',
    icon: 'Gauge',
    baseUnit: 'm/s',
    units: [
      { name: 'Meters per Second (m/s)', code: 'm/s', factor: 1.0 },
      { name: 'Kilometers per Hour (km/h)', code: 'km/h', factor: 3.6 },
      { name: 'Miles per Hour (mph)', code: 'mph', factor: 2.23693629 },
      { name: 'Knots (kt)', code: 'kt', factor: 1.94384449 },
      { name: 'Feet per Second (ft/s)', code: 'ft/s', factor: 3.2808399 },
      { name: 'Mach (Speed of Sound)', code: 'mach', factor: 0.00293866996 }
    ]
  },
  'pace-conv': {
    title: 'Athletic Pace Converter',
    id: 'pace-conv',
    description: 'Convert professional athletic pacing times and calculate speed equivalents.',
    icon: 'Activity',
    baseUnit: 'min/km',
    units: [
      { name: 'Minutes per Kilometer (min/km)', code: 'min/km', factor: 1.0 },
      { name: 'Minutes per Mile (min/mi)', code: 'min/mi', factor: 1.609344 },
      { name: 'Seconds per Kilometer (sec/km)', code: 'sec/km', factor: 60.0 },
      { name: 'Seconds per Mile (sec/mi)', code: 'sec/mi', factor: 96.56064 }
    ]
  },
  'pressure-conv': {
    title: 'Pressure Converter',
    id: 'pressure-conv',
    description: 'Convert pressure thresholds between atmospheric standards and industrial scales.',
    icon: 'Compass',
    baseUnit: 'Pa',
    units: [
      { name: 'Pascals (Pa)', code: 'Pa', factor: 1.0 },
      { name: 'Kilopascals (kPa)', code: 'kPa', factor: 0.001 },
      { name: 'Bars (bar)', code: 'bar', factor: 0.00001 },
      { name: 'Millibars (mbar)', code: 'mbar', factor: 0.01 },
      { name: 'Pounds per Sq. Inch (psi)', code: 'psi', factor: 0.000145037738 },
      { name: 'Atmospheres (atm)', code: 'atm', factor: 9.86923267e-6 },
      { name: 'Torr (mmHg)', code: 'Torr', factor: 0.00750061561 }
    ]
  },
  'current-conv': {
    title: 'Current Converter',
    id: 'current-conv',
    description: 'Convert electric currents between milliamp, ampere, and mega-ampere flows.',
    icon: 'Zap',
    baseUnit: 'A',
    units: [
      { name: 'Amperes (A)', code: 'A', factor: 1.0 },
      { name: 'Milliamperes (mA)', code: 'mA', factor: 1000.0 },
      { name: 'Microamperes (μA)', code: 'uA', factor: 1000000.0 },
      { name: 'Kiloamperes (kA)', code: 'kA', factor: 0.001 },
      { name: 'Megaamperes (MA)', code: 'MA', factor: 1e-6 }
    ]
  },
  'voltage-conv': {
    title: 'Voltage Converter',
    id: 'voltage-conv',
    description: 'Convert electrical potential differences between volts, millivolts, and kilovolts.',
    icon: 'Cpu',
    baseUnit: 'V',
    units: [
      { name: 'Volts (V)', code: 'V', factor: 1.0 },
      { name: 'Millivolts (mV)', code: 'mV', factor: 1000.0 },
      { name: 'Microvolts (μV)', code: 'uV', factor: 1000000.0 },
      { name: 'Kilovolts (kV)', code: 'kV', factor: 0.001 },
      { name: 'Megavolts (MV)', code: 'MV', factor: 1e-6 }
    ]
  },
  'power-conv': {
    title: 'Power Converter',
    id: 'power-conv',
    description: 'Convert active energy consumption and power output rates dynamically.',
    icon: 'Battery',
    baseUnit: 'W',
    units: [
      { name: 'Watts (W)', code: 'W', factor: 1.0 },
      { name: 'Milliwatts (mW)', code: 'mW', factor: 1000.0 },
      { name: 'Kilowatts (kW)', code: 'kW', factor: 0.001 },
      { name: 'Megawatts (MW)', code: 'MW', factor: 1e-6 },
      { name: 'Gigawatts (GW)', code: 'GW', factor: 1e-9 },
      { name: 'Horsepower (hp)', code: 'hp', factor: 0.00134102209 },
      { name: 'Calories/sec (cal/s)', code: 'cals', factor: 0.2388458966 },
      { name: 'BTU/hour (BTU/h)', code: 'btuh', factor: 3.41214163 }
    ]
  },
  'reactive-power-conv': {
    title: 'Reactive Power Converter',
    id: 'reactive-power-conv',
    description: 'Convert AC circuit inductive and capacitive reactive power scales.',
    icon: 'Activity',
    baseUnit: 'var',
    units: [
      { name: 'Volt-Amperes Reactive (var)', code: 'var', factor: 1.0 },
      { name: 'Millivolt-Amperes Reactive (mvar)', code: 'mvar', factor: 1000.0 },
      { name: 'Kilovolt-Amperes Reactive (kvar)', code: 'kvar', factor: 0.001 },
      { name: 'Megavolt-Amperes Reactive (Mvar)', code: 'Mvar', factor: 1e-6 }
    ]
  },
  'apparent-power-conv': {
    title: 'Apparent Power Converter',
    id: 'apparent-power-conv',
    description: 'Convert AC electrical grid total apparent power thresholds.',
    icon: 'Gauge',
    baseUnit: 'VA',
    units: [
      { name: 'Volt-Amperes (VA)', code: 'VA', factor: 1.0 },
      { name: 'Millivolt-Amperes (mVA)', code: 'mVA', factor: 1000.0 },
      { name: 'Kilovolt-Amperes (kVA)', code: 'kVA', factor: 0.001 },
      { name: 'Megavolt-Amperes (MVA)', code: 'MVA', factor: 1e-6 }
    ]
  },
  'energy-conv': {
    title: 'Energy Converter',
    id: 'energy-conv',
    description: 'Convert active work, heat capacity, and power duration energy metrics.',
    icon: 'Flame',
    baseUnit: 'J',
    units: [
      { name: 'Joules (J)', code: 'J', factor: 1.0 },
      { name: 'Kilojoules (kJ)', code: 'kJ', factor: 0.001 },
      { name: 'Megajoules (MJ)', code: 'MJ', factor: 1e-6 },
      { name: 'Watt-hours (Wh)', code: 'Wh', factor: 0.000277777778 },
      { name: 'Kilowatt-hours (kWh)', code: 'kWh', factor: 2.77777778e-7 },
      { name: 'Megawatt-hours (MWh)', code: 'MWh', factor: 2.77777778e-10 },
      { name: 'Calories (cal)', code: 'cal', factor: 0.2388458966 },
      { name: 'Kilocalories (kcal)', code: 'kcal', factor: 0.0002388458966 },
      { name: 'British Thermal Units (BTU)', code: 'BTU', factor: 0.00094781712 }
    ]
  },
  'reactive-energy-conv': {
    title: 'Reactive Energy Converter',
    id: 'reactive-energy-conv',
    description: 'Convert AC circuit inductive and capacitive reactive energy values.',
    icon: 'Activity',
    baseUnit: 'varh',
    units: [
      { name: 'Volt-Amperes Reactive Hour (varh)', code: 'varh', factor: 1.0 },
      { name: 'Millivolt-Amperes Reactive Hour (mvarh)', code: 'mvarh', factor: 1000.0 },
      { name: 'Kilovolt-Amperes Reactive Hour (kvarh)', code: 'kvarh', factor: 0.001 },
      { name: 'Megavolt-Amperes Reactive Hour (Mvarh)', code: 'Mvarh', factor: 1e-6 }
    ]
  },
  'vol-flow-conv': {
    title: 'Volumetric Flow Rate Converter',
    id: 'vol-flow-conv',
    description: 'Convert fluid, liquid, and gas volume transfer rates precisely.',
    icon: 'Wind',
    baseUnit: 'm3s',
    units: [
      { name: 'Cubic Meters/Second (m³/s)', code: 'm3s', factor: 1.0 },
      { name: 'Cubic Meters/Hour (m³/h)', code: 'm3h', factor: 3600.0 },
      { name: 'Liters/Second (L/s)', code: 'ls', factor: 1000.0 },
      { name: 'Liters/Minute (L/min)', code: 'lmin', factor: 60000.0 },
      { name: 'US Gallons/Minute (gpm)', code: 'gpm', factor: 15850.32314 },
      { name: 'Cubic Feet/Minute (cfm)', code: 'cfm', factor: 2118.880003 }
    ]
  },
  'illuminance-conv': {
    title: 'Illuminance Converter',
    id: 'illuminance-conv',
    description: 'Convert luminous flux incident per unit area across scientific scales.',
    icon: 'Sun',
    baseUnit: 'lx',
    units: [
      { name: 'Lux (lx)', code: 'lx', factor: 1.0 },
      { name: 'Foot-candle (fc)', code: 'fc', factor: 0.09290304 },
      { name: 'Phot (ph)', code: 'ph', factor: 0.0001 }
    ]
  },
  'frequency-conv': {
    title: 'Frequency Converter',
    id: 'frequency-conv',
    description: 'Convert cycle rates, radio frequencies, and processor clocks safely.',
    icon: 'Radio',
    baseUnit: 'Hz',
    units: [
      { name: 'Hertz (Hz)', code: 'Hz', factor: 1.0 },
      { name: 'Kilohertz (kHz)', code: 'kHz', factor: 0.001 },
      { name: 'Megahertz (MHz)', code: 'MHz', factor: 1e-6 },
      { name: 'Gigahertz (GHz)', code: 'GHz', factor: 1e-9 }
    ]
  },
  'angle-conv': {
    title: 'Angle Converter',
    id: 'angle-conv',
    description: 'Convert geometric, trigonometric, and rotational angular values.',
    icon: 'Compass',
    baseUnit: 'deg',
    units: [
      { name: 'Degrees (°)', code: 'deg', factor: 1.0 },
      { name: 'Radians (rad)', code: 'rad', factor: 0.0174532925 },
      { name: 'Gradians (grad)', code: 'grad', factor: 1.11111111 },
      { name: 'Turns (turn)', code: 'turn', factor: 1 / 360 }
    ]
  },
  'torque-conv': {
    title: 'Torque Converter',
    id: 'torque-conv',
    description: 'Convert rotational mechanical forces and engine twisting moments.',
    icon: 'Wrench',
    baseUnit: 'Nm',
    units: [
      { name: 'Newton-meters (N·m)', code: 'Nm', factor: 1.0 },
      { name: 'Kilogram-force meters (kgf·m)', code: 'kgfm', factor: 0.101971621 },
      { name: 'Pound-force feet (lbf·ft)', code: 'lbfft', factor: 0.737562149 },
      { name: 'Pound-force inches (lbf·in)', code: 'lbfin', factor: 8.85074579 }
    ]
  },
  'charge-conv': {
    title: 'Charge Converter',
    id: 'charge-conv',
    description: 'Convert electromagnetic charge amounts across scientific metrics.',
    icon: 'Zap',
    baseUnit: 'C',
    units: [
      { name: 'Coulombs (C)', code: 'C', factor: 1.0 },
      { name: 'Millicoulombs (mC)', code: 'mC', factor: 1000.0 },
      { name: 'Microcoulombs (μC)', code: 'uC', factor: 1000000.0 },
      { name: 'Ampere-hours (Ah)', code: 'Ah', factor: 0.000277777778 }
    ]
  }
};

interface ConverterToolsProps {
  activeToolId: string;
  isDark: boolean;
}

export function ConverterTools({ activeToolId, isDark }: ConverterToolsProps) {
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

  if (activeToolId === 'currency-conv') {
    return <CurrencyConverter isDark={isDark} />;
  }
  if (activeToolId === 'num-to-word-conv') {
    return <NumberToWordConverter isDark={isDark} />;
  }
  if (activeToolId === 'word-to-num-conv') {
    return <WordToNumberConverter isDark={isDark} />;
  }
  if (activeToolId === 'num-to-roman-conv') {
    return <NumberToRomanConverter isDark={isDark} />;
  }
  if (activeToolId === 'roman-to-num-conv') {
    return <RomanToNumberConverter isDark={isDark} />;
  }

  const config = CONVERTER_CONFIG_MAP[activeToolId];

  if (!config) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
        Error: Converter configuration not found for active ID: {activeToolId}
      </div>
    );
  }

  const [inputVal, setInputVal] = useState<number>(config.id === 'temp-conv' ? 25 : 10);
  const [fromUnit, setFromUnit] = useState<string>(config.units[0].code);
  const [toUnit, setToUnit] = useState<string>(config.units[1]?.code || config.units[0].code);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    setInputVal(config.id === 'temp-conv' ? 25 : 10);
    setFromUnit(config.units[0].code);
    setToUnit(config.units[1]?.code || config.units[0].code);
  }, [activeToolId, config]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const convertTemp = (value: number, from: string, to: string): number => {
    let celsius = value;
    if (from === 'f') celsius = (value - 32) * (5 / 9);
    else if (from === 'k') celsius = value - 273.15;
    else if (from === 'r') celsius = (value - 491.67) * (5 / 9);

    let result = celsius;
    if (to === 'f') result = celsius * (9 / 5) + 32;
    else if (to === 'k') result = celsius + 273.15;
    else if (to === 'r') result = (celsius + 273.15) * (9 / 5);

    return parseFloat(result.toFixed(4));
  };

  const convertPace = (value: number, from: string, to: string): number => {
    const fromObj = config.units.find((u) => u.code === from);
    const toObj = config.units.find((u) => u.code === to);
    if (!fromObj || !toObj) return 0;
    const baseVal = value / fromObj.factor;
    const result = baseVal * toObj.factor;
    return parseFloat(result.toFixed(4));
  };

  const getConversionResult = (): number => {
    if (config.id === 'temp-conv') {
      return convertTemp(inputVal, fromUnit, toUnit);
    }
    if (config.id === 'pace-conv') {
      return convertPace(inputVal, fromUnit, toUnit);
    }

    const fromObj = config.units.find((u) => u.code === fromUnit);
    const toObj = config.units.find((u) => u.code === toUnit);

    if (!fromObj || !toObj) return 0;

    const baseVal = inputVal / fromObj.factor;
    const converted = baseVal * toObj.factor;

    if (converted === 0) return 0;
    if (Math.abs(converted) < 1e-4) {
      return parseFloat(converted.toPrecision(6));
    }
    return parseFloat(converted.toFixed(6));
  };

  const convertedResult = getConversionResult();

  const getProseText = () => {
    const fromUName = config.units.find((u) => u.code === fromUnit)?.name || fromUnit;
    const toUName = config.units.find((u) => u.code === toUnit)?.name || toUnit;
    return `${inputVal} ${fromUName.split(' ')[0]} is equivalent to ${convertedResult} ${toUName.split(' ')[0]}`;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getPaceSpeedAnalysis = () => {
    if (config.id !== 'pace-conv') return null;

    let minPerKm = inputVal;
    if (fromUnit === 'min/mi') minPerKm = inputVal / 1.609344;
    else if (fromUnit === 'sec/km') minPerKm = inputVal / 60;
    else if (fromUnit === 'sec/mi') minPerKm = (inputVal / 96.56064);

    if (minPerKm <= 0) return null;

    const kmh = 60 / minPerKm;
    const mph = kmh * 0.621371;

    const fiveKSeconds = minPerKm * 5 * 60;
    const tenKSeconds = minPerKm * 10 * 60;
    const halfMarathonSeconds = minPerKm * 21.0975 * 60;
    const marathonSeconds = minPerKm * 42.195 * 60;

    const formatSeconds = (totalSec: number) => {
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = Math.floor(totalSec % 60);
      return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-5 bg-[#141416]/60 border border-white/5 rounded-xl text-xs text-gray-300">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-orange-400 font-mono uppercase tracking-widest block">Speed Equivalence</span>
          <div className="grid grid-cols-2 gap-2 bg-[#09090a] p-3 rounded-lg border border-white/5">
            <div>
              <span className="text-gray-500 block text-[10px] font-mono">KILOMETERS/HOUR</span>
              <span className="text-sm font-bold text-white">{kmh.toFixed(2)} km/h</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] font-mono">MILES/HOUR</span>
              <span className="text-sm font-bold text-white">{mph.toFixed(2)} mph</span>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-amber-400 font-mono uppercase tracking-widest block font-sans">Predicted Race Timings</span>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-400">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>5K:</span>
              <strong className="text-white">{formatSeconds(fiveKSeconds)}</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>10K:</span>
              <strong className="text-white">{formatSeconds(tenKSeconds)}</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Half-Mar:</span>
              <strong className="text-white">{formatSeconds(halfMarathonSeconds)}</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Marathon:</span>
              <strong className="text-white">{formatSeconds(marathonSeconds)}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getDigitalAnalysis = () => {
    if (config.id !== 'digital-conv') return null;

    const fromObj = config.units.find((u) => u.code === fromUnit);
    if (!fromObj) return null;
    const bytes = inputVal / fromObj.factor;

    const formatDuration = (secondsVal: number) => {
      if (secondsVal < 0.1) return 'Instant';
      if (secondsVal < 60) return `${secondsVal.toFixed(1)} seconds`;
      const mins = Math.floor(secondsVal / 60);
      const secs = Math.ceil(secondsVal % 60);
      return `${mins}m ${secs}s`;
    };

    const bits = bytes * 8;
    const sec100Mbps = bits / 100_000_000;
    const sec500Mbps = bits / 500_000_000;
    const sec1Gbps = bits / 1_000_000_000;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-5 bg-[#141416]/60 border border-white/5 rounded-xl text-xs text-gray-300">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-sky-400 font-mono uppercase tracking-widest block">Transmission Size Equivalencies</span>
          <div className="space-y-1.5 text-[11px] font-mono text-gray-400 bg-[#09090a] p-3 rounded-lg border border-white/5">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Total Bits:</span>
              <strong className="text-white">{bits.toLocaleString()} bits</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Total Bytes:</span>
              <strong className="text-white">{bytes.toLocaleString()} B</strong>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase tracking-widest block">Estimated Network Download Speeds</span>
          <div className="space-y-1.5 text-[11px] font-mono text-gray-450">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Generic Broaband (100 Mbps):</span>
              <strong className="text-white">{formatDuration(sec100Mbps)}</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Fiber Fast Connection (500 Mbps):</span>
              <strong className="text-white">{formatDuration(sec500Mbps)}</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Gigabit Ethernet (1 Gbps):</span>
              <strong className="text-white">{formatDuration(sec1Gbps)}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getElectricalAnalysis = () => {
    if (!['current-conv', 'voltage-conv', 'power-conv', 'energy-conv'].includes(config.id)) return null;

    if (config.id === 'power-conv') {
      const fromObj = config.units.find((u) => u.code === fromUnit);
      if (!fromObj) return null;
      const watts = inputVal / fromObj.factor;
      if (watts <= 0 || isNaN(watts)) return null;

      const kilowatts = watts / 1000;
      const ratePerHour = 0.16;
      const costPerHour = kilowatts * ratePerHour;
      const costPerDay = costPerHour * 24;
      const costPerMonth = costPerDay * 30.44;
      const costPerYear = costPerDay * 365.25;

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-5 bg-[#141416]/60 border border-white/5 rounded-xl text-xs text-gray-300">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-yellow-400 font-mono uppercase tracking-widest block">Utility Load Equivalent</span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-400 bg-[#09090a] p-3 rounded-lg border border-white/5">
              <div>
                <span className="text-gray-500 block text-[9px]">TOTAL KILOWATTS</span>
                <span className="text-sm font-bold text-white">{kilowatts >= 1 ? kilowatts.toFixed(3) : kilowatts.toPrecision(3)} kW</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px]">HORSEPOWER (hp)</span>
                <span className="text-sm font-bold text-white">{(watts * 0.00134102).toFixed(3)} hp</span>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase tracking-widest block">Estimated Appliance Operational Cost</span>
            <div className="space-y-1 text-[11px] font-mono text-gray-400">
              <div className="flex justify-between border-b border-white/5 pb-0.5">
                <span>Per Hour (@$0.16/kWh):</span>
                <strong className="text-white">${costPerHour < 0.01 ? costPerHour.toFixed(4) : costPerHour.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-0.5">
                <span>Per 24h Day:</span>
                <strong className="text-white">${costPerDay < 0.01 ? costPerDay.toFixed(4) : costPerDay.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-0.5">
                <span>Per Month (30d):</span>
                <strong className="text-white">${costPerMonth.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-0.5">
                <span>Per Year (365d):</span>
                <strong className="text-white">${costPerYear.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (config.id === 'energy-conv') {
      const fromObj = config.units.find((u) => u.code === fromUnit);
      if (!fromObj) return null;
      const joules = inputVal / fromObj.factor;
      if (joules <= 0 || isNaN(joules)) return null;

      const kwh = joules / 3600000;
      const ratePerKwh = 0.16;
      const monetaryValue = kwh * ratePerKwh;
      const kcal = joules * 0.0002388458966;
      const btu = joules * 0.00094781712;

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-5 bg-[#141416]/60 border border-white/5 rounded-xl text-xs text-gray-300">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-amber-500 font-mono uppercase tracking-widest block">Thermal & Work Equivalencies</span>
            <div className="space-y-1.5 text-[11px] font-mono text-gray-400 bg-[#09090a] p-3 rounded-lg border border-white/5">
              <div className="flex justify-between">
                <span>Total Food Calories:</span>
                <strong className="text-white">{kcal.toLocaleString(undefined, { maximumFractionDigits: 1 })} kcal</strong>
              </div>
              <div className="flex justify-between">
                <span>Total BTU Thermal:</span>
                <strong className="text-white">{btu.toLocaleString(undefined, { maximumFractionDigits: 1 })} BTU</strong>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-amber-500 font-mono uppercase tracking-widest block">Equivalent Grid Power Value</span>
            <div className="space-y-1.5 text-[11px] font-mono text-gray-400">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Total Kilowatt-Hours:</span>
                <strong className="text-white">{kwh.toLocaleString(undefined, { maximumFractionDigits: 4 })} kWh</strong>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Gross Electric Utility Value:</span>
                <strong className="text-emerald-400">${monetaryValue.toFixed(4)} USD</strong>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (config.id === 'voltage-conv') {
      const fromObj = config.units.find((u) => u.code === fromUnit);
      if (!fromObj) return null;
      const volts = inputVal / fromObj.factor;
      if (volts <= 0 || isNaN(volts)) return null;

      const getVoltageReference = (v: number) => {
        if (v < 0.1) return 'Brain signal thresholds (~50-100 millivolts)';
        if (v <= 1.5) return 'Standard AA/AAA cell battery (1.5 Volts)';
        if (v <= 5.0) return 'Standard computer USB power terminal (5.0 Volts)';
        if (v <= 12.0) return 'Automotive passenger car rechargeable acid battery (12 Volts)';
        if (v <= 125.0) return 'US Domestic alternating-current residential wall socket (120 Volts)';
        if (v <= 250.0) return 'Heavy home appliances standard, EU wall outlets (230-240 Volts)';
        if (v <= 600.0) return 'US Industrial machinery electrical standard (480 Volts)';
        if (v <= 15000) return 'High-voltage train overhead catenary current lines (12 to 25 Kilovolts)';
        return 'Major utility electrical grid cross-country transmission circuits (110+ Kilovolts)';
      };

      return (
        <div className="mt-6 p-5 bg-[#141416]/60 border border-white/5 rounded-xl text-xs text-gray-300 space-y-1.5">
          <span className="text-[10px] font-bold text-sky-400 font-mono uppercase tracking-widest block">Electrical System Reference Scale</span>
          <div className="p-3 bg-[#09090a] rounded-lg border border-white/5 font-mono text-[11px] text-gray-400 space-y-1 shadow-inner">
            <div className="flex justify-between">
              <span>Standard context match for {inputVal} {fromObj.name.split(' ')[0]}:</span>
            </div>
            <p className="text-white font-bold text-xs mt-1">{getVoltageReference(volts)}</p>
          </div>
        </div>
      );
    }

    if (config.id === 'current-conv') {
      const fromObj = config.units.find((u) => u.code === fromUnit);
      if (!fromObj) return null;
      const amps = inputVal / fromObj.factor;
      if (amps <= 0 || isNaN(amps)) return null;

      const getCurrentRisk = (a: number) => {
        if (a < 0.001) return 'Barely perceptible skin sensation threshold';
        if (a < 0.01) return 'Safe standard static electricity discharge';
        if (a < 0.015) return 'Painful muscle spasms occur, let-go threshold compromised';
        if (a < 0.1) return 'High risk of respiratory failure or heart contractions';
        if (a < 15.0) return 'Sufficient current to trigger residential circuit protective breaker (15A/20A)';
        return 'Dangerous macro electric currents, specialized commercial equipment load limits';
      };

      return (
        <div className="mt-6 p-5 bg-[#141416]/60 border border-white/5 rounded-xl text-xs text-gray-300 space-y-1.5">
          <span className="text-[10px] font-bold text-orange-400 font-mono uppercase tracking-widest block">Physiological Impact & Load Status</span>
          <div className="p-3 bg-[#09090a] rounded-lg border border-white/5 font-mono text-[11px] text-gray-400 space-y-1 shadow-inner">
            <div className="flex justify-between">
              <span>Generic current exposure threshold safety reference:</span>
            </div>
            <p className="text-white font-bold text-xs mt-1">{getCurrentRisk(amps)}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  const IconComponent = Icons[config.icon] || Icons.Scale;
  const badgeClass = isDark
    ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    : 'bg-orange-50 text-orange-600 border-orange-200';

  return (
    <div className="space-y-8 font-sans" id={`unit-converter-view-${config.id}`}>
      <div className={`pb-4 border-b ${t.border} flex items-center justify-between flex-wrap gap-4`}>
        <div>
          <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
            <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>
              CONVERTER
            </span>
            {config.title}
          </h2>
          <p className={`text-sm ${t.textMuted}`}>{config.description}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className={`lg:col-span-3 space-y-5 ${t.panelBg} p-6 rounded-2xl relative shadow-md`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={`text-xs font-bold ${t.label} block font-mono`}>VALUE TO CONVERT:</label>
              <input
                type="number"
                className={`w-full p-3 ${t.inputBg} rounded-xl font-mono font-bold text-lg focus:ring-1 focus:ring-orange-500/40 focus:border-orange-500 focus:outline-none`}
                value={isNaN(inputVal) ? '' : inputVal}
                onChange={(e) => setInputVal(parseFloat(e.target.value))}
                placeholder="1.0"
              />
            </div>

            <div className="space-y-1">
              <label className={`text-xs font-bold ${t.label} block font-mono`}>FROM UNIT:</label>
              <select
                className={`w-full p-3.5 ${t.selectBg} rounded-xl text-sm focus:ring-1 focus:ring-orange-500/40 focus:border-orange-500 focus:outline-none`}
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
              >
                {config.units.map((unit) => (
                  <option key={unit.code} value={unit.code}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center -my-2.5 relative z-10">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2.5 rounded-full bg-[#1c1c1f] hover:bg-[#27272a] border border-white/10 hover:border-orange-500/40 text-gray-400 hover:text-white transition-all cursor-pointer shadow-md flex items-center justify-center"
              title="Swap units"
            >
              <Icons.ArrowRightLeft className="w-4 h-4 rotate-90 md:rotate-0" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={`text-xs font-bold ${t.label} block font-mono`}>TO UNIT:</label>
              <select
                className={`w-full p-3.5 ${t.selectBg} rounded-xl text-sm focus:ring-1 focus:ring-orange-500/40 focus:border-orange-500 focus:outline-none`}
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
              >
                {config.units
                  .filter((unit) => unit.code !== fromUnit || config.units.length === 1)
                  .map((unit) => (
                    <option key={unit.code} value={unit.code}>
                      {unit.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-orange-400 block font-mono">CONVERTED RESULT:</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  className={`w-full p-3 ${t.outputBg} border border-orange-500/10 rounded-xl text-orange-400 font-mono font-black text-lg focus:outline-none select-all`}
                  value={isNaN(convertedResult) ? 'Pending val...' : convertedResult}
                />
                <button
                  type="button"
                  onClick={() => handleCopy(convertedResult.toString(), 'main-res')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-orange-500/10 text-gray-400 hover:text-orange-400 rounded-lg cursor-pointer transition-colors"
                  title="Copy result"
                >
                  {copiedCode === 'main-res' ? (
                    <Icons.Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icons.Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {!isNaN(convertedResult) && (
            <div className="p-3.5 bg-orange-500/5 border border-orange-500/10 rounded-xl text-xs text-orange-300 font-medium flex items-center justify-between gap-4">
              <span>{getProseText()}</span>
              <button
                type="button"
                onClick={() => handleCopy(getProseText(), 'prose-copy')}
                className="text-[10px] font-bold text-orange-400 hover:text-orange-300 font-mono flex items-center gap-1 cursor-pointer"
              >
                {copiedCode === 'prose-copy' ? 'Copied!' : 'Copy Summary'}
              </button>
            </div>
          )}

          {getPaceSpeedAnalysis()}
          {getDigitalAnalysis()}
          {getElectricalAnalysis()}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className={`${t.cardBg} p-5 rounded-2xl space-y-3 shadow-md max-h-[440px] overflow-y-auto`}>
            <div>
              <span className={`text-[10px] font-bold ${t.labelFaint} uppercase tracking-widest block font-mono`}>
                COMPREHENSIVE TRANSLATIONS
              </span>
              <h3 className={`text-sm font-bold ${t.heading}`}>Value in All Measured Metrics</h3>
              <p className={`text-[11px] ${t.textMuted} leading-normal`}>
                Quick reference preview of {inputVal || 1} {config.units.find((u) => u.code === fromUnit)?.name.split(' ')[0]} inside other corresponding standards.
              </p>
            </div>

            <div className={`border ${t.border} rounded-xl divide-y divide-white/5 overflow-hidden text-xs ${t.controlBg} font-mono`}>
              {config.units.map((unit) => {
                let displayVal = 0;
                if (config.id === 'temp-conv') {
                  displayVal = convertTemp(inputVal || 0, fromUnit, unit.code);
                } else if (config.id === 'pace-conv') {
                  displayVal = convertPace(inputVal || 0, fromUnit, unit.code);
                } else {
                  const fromObj = config.units.find((u) => u.code === fromUnit);
                  if (fromObj) {
                    const baseVal = (inputVal || 0) / fromObj.factor;
                    displayVal = baseVal * unit.factor;
                  }
                }

                const roundedVal =
                  displayVal === 0
                    ? 0
                    : Math.abs(displayVal) < 1e-4
                    ? parseFloat(displayVal.toPrecision(5))
                    : parseFloat(displayVal.toFixed(5));

                return (
                  <div
                    key={unit.code}
                    className={`flex items-center justify-between p-2 px-3 text-[11px] transition-colors ${
                      unit.code === fromUnit
                        ? 'bg-orange-500/5 text-orange-400 font-bold'
                        : `hover:bg-white/5 ${t.textMuted}`
                    }`}
                  >
                    <span className={`text-left line-clamp-1 ${t.label}`}>{unit.name}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0 text-right">
                      <span className={unit.code === fromUnit ? 'text-orange-400 font-extrabold' : t.heading}>
                        {isNaN(roundedVal) ? '0' : roundedVal.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(roundedVal.toString(), `table-${unit.code}`)}
                        className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white cursor-pointer"
                        title="Copy value"
                      >
                        {copiedCode === `table-${unit.code}` ? (
                          <Icons.Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Icons.Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 1. DYNAMIC CURRENCY CONVERTER INTEGRATION
// ----------------------------------------------------

const FALLBACK_CURRENCIES: Record<string, { name: string; symbol: string; rate: number }> = {
  USD: { name: 'US Dollar', symbol: '$', rate: 1.0 },
  EUR: { name: 'Euro', symbol: '€', rate: 0.92 },
  GBP: { name: 'British Pound Sterling', symbol: '£', rate: 0.78 },
  JPY: { name: 'Japanese Yen', symbol: '¥', rate: 156.40 },
  CAD: { name: 'Canadian Dollar', symbol: 'CA$', rate: 1.37 },
  AUD: { name: 'Australian Dollar', symbol: 'A$', rate: 1.51 },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', rate: 0.89 },
  CNY: { name: 'Chinese Yuan Renminbi', symbol: 'CN¥', rate: 7.25 },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', rate: 1.35 },
  INR: { name: 'Indian Rupee', symbol: '₹', rate: 83.50 }
};

interface CurrencyConverterProps {
  isDark: boolean;
}

function CurrencyConverter({ isDark }: CurrencyConverterProps) {
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

  const [rates, setRates] = useState<Record<string, number>>(() => {
    const initialRates: Record<string, number> = {};
    Object.entries(FALLBACK_CURRENCIES).forEach(([code, data]) => {
      initialRates[code] = data.rate;
    });
    return initialRates;
  });
  const [currencyMetadata, setCurrencyMetadata] = useState<Record<string, { name: string; symbol: string }>>(() => {
    const meta: Record<string, { name: string; symbol: string }> = {};
    Object.entries(FALLBACK_CURRENCIES).forEach(([code, data]) => {
      meta[code] = { name: data.name, symbol: data.symbol };
    });
    return meta;
  });

  const [inputVal, setInputVal] = useState<number>(100);
  const [fromCurr, setFromCurr] = useState<string>('USD');
  const [toCurr, setToCurr] = useState<string>('EUR');
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Offline Default Rates');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => {
        if (!res.ok) throw new Error('API down');
        return res.json();
      })
      .then((data) => {
        if (data && data.rates) {
          const freshRates: Record<string, number> = data.rates;
          setRates(freshRates);

          const updatedMeta = { ...currencyMetadata };
          Object.keys(freshRates).forEach((code) => {
            if (!updatedMeta[code]) {
              updatedMeta[code] = {
                name: `${code} Currency`,
                symbol: code
              };
            }
          });
          setCurrencyMetadata(updatedMeta);
          
          if (data.time_last_update_utc) {
            setLastUpdated(`Live: ${new Date(data.time_last_update_utc).toLocaleDateString()} GMT`);
          } else {
            setLastUpdated('Live Rates Connected');
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setLastUpdated('Showing cached standard rates');
      });
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const exchangeVal = (() => {
    if (isNaN(inputVal)) return 0;
    const rateFrom = rates[fromCurr] || 1.0;
    const rateTo = rates[toCurr] || 1.0;
    const usdAmount = inputVal / rateFrom;
    return usdAmount * rateTo;
  })();

  const fromSymbol = currencyMetadata[fromCurr]?.symbol || fromCurr;
  const toSymbol = currencyMetadata[toCurr]?.symbol || toCurr;
  const badgeClass = isDark
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    : 'bg-amber-50 text-amber-600 border-amber-200';

  return (
    <div className="space-y-6" id="currency-converter-root">
      <div className={`pb-4 border-b ${t.border} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
        <div>
          <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
            <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>UNIT</span>
            Currency Converter
          </h2>
          <p className={`text-sm ${t.textMuted}`}>Perform standard global currency exchanges with live-fetched bank exchange ratios.</p>
        </div>
        <div className={`text-xs font-mono ${t.textFaint} bg-[#141416]/90 p-2 border ${t.border} rounded-xl uppercase flex items-center gap-1.5 shrink-0 select-none`}>
          <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
          {lastUpdated}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className={`lg:col-span-2 ${t.panelBg} p-6 rounded-2xl space-y-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={`text-xs font-bold ${t.label} block font-mono`}>EXCHANGE AMOUNT ({fromSymbol}):</label>
              <div className="relative">
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.labelFaint} font-mono font-bold text-base`}>{fromSymbol}</span>
                <input
                  type="number"
                  className={`w-full p-3.5 pl-11 ${t.inputBg} rounded-xl font-mono font-bold text-lg focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500 focus:outline-none`}
                  value={isNaN(inputVal) ? '' : inputVal}
                  onChange={(e) => setInputVal(parseFloat(e.target.value))}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={`text-xs font-bold ${t.label} block font-mono`}>FROM CURRENCY:</label>
              <select
                className={`w-full p-4 ${t.selectBg} rounded-xl text-sm focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500 focus:outline-none font-mono`}
                value={fromCurr}
                onChange={(e) => setFromCurr(e.target.value)}
              >
                {Object.keys(rates).sort().map((code) => (
                  <option key={code} value={code}>
                    {code} - {currencyMetadata[code]?.name || code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center -my-3.5 relative z-10">
            <button
              type="button"
              onClick={() => {
                const temp = fromCurr;
                setFromCurr(toCurr);
                setToCurr(temp);
              }}
              className="p-3 rounded-full bg-[#1c1c1f] hover:bg-[#27272a] border border-white/10 hover:border-amber-500/40 text-gray-450 hover:text-white transition-all cursor-pointer shadow-md flex items-center justify-center"
              title="Swap From/To currencies"
            >
              <Icons.ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={`text-xs font-bold ${t.label} block font-mono`}>TO TARGET CURRENCY:</label>
              <select
                className={`w-full p-4 ${t.selectBg} rounded-xl text-sm focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500 focus:outline-none font-mono`}
                value={toCurr}
                onChange={(e) => setToCurr(e.target.value)}
              >
                {Object.keys(rates).sort().map((code) => (
                  <option key={code} value={code}>
                    {code} - {currencyMetadata[code]?.name || code}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-400 block font-mono font-black">CONVERTED VAL ({toSymbol}):</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  className={`w-full p-3.5 ${t.outputBg} border border-amber-500/15 rounded-xl text-amber-400 font-mono font-black text-lg focus:outline-none select-all`}
                  value={isNaN(exchangeVal) ? 'Loading rates...' : `${toSymbol} ${exchangeVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`}
                />
                <button
                  type="button"
                  onClick={() => handleCopy(exchangeVal.toFixed(4), 'curr-val')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-amber-500/10 text-gray-455 hover:text-amber-400 rounded-lg cursor-pointer transition-colors"
                  title="Copy currency value"
                >
                  {copiedCode === 'curr-val' ? (
                    <Icons.Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icons.Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <p className={`text-xs ${t.textFaint} text-center font-mono select-none`}>
            Let 1.00 {fromCurr} = {(rates[toCurr] / (rates[fromCurr] || 1)).toFixed(6)} {toCurr}. 
            Data refreshed live from decentralized er-api nodes.
          </p>
        </div>

        <div className="space-y-4">
          <div className={`${t.cardBg} p-5 rounded-2xl space-y-3.5 shadow-md`}>
            <div>
              <span className={`text-[10px] font-bold text-amber-400 uppercase tracking-widest block font-mono`}>LIVE MATRIX SHEET</span>
              <h3 className={`text-sm font-bold ${t.heading} mt-0.5`}>Value of ({inputVal || 1.0}) {fromCurr}</h3>
              <p className={`text-[11px] ${t.textMuted} leading-normal`}>
                Comparison chart for ({inputVal || 1.0}) {fromCurr} conversion into standard robust assets.
              </p>
            </div>

            <div className={`border ${t.border} rounded-xl divide-y divide-white/5 overflow-hidden text-xs ${t.controlBg} font-mono`}>
              {['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'].map((code) => {
                if (code === fromCurr) return null;
                const converted = (inputVal || 1.0) / (rates[fromCurr] || 1) * (rates[code] || 1);
                const sym = currencyMetadata[code]?.symbol || code;
                return (
                  <div key={code} className={`flex items-center justify-between p-2.5 px-3 hover:bg-white/5 ${t.textMuted}`}>
                    <span className={`text-left ${t.label}`}>{code} - {currencyMetadata[code]?.name.split(' ')[0]}</span>
                    <span className={`font-extrabold text-right ${t.heading}`}>
                      {sym} {converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. NUMBER TO WORD CONVERTER
// ----------------------------------------------------

function numberToWords(num: number): string {
  if (num === 0) return 'zero';

  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const thousands = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];

  let sign = '';
  if (num < 0) {
    sign = 'minus ';
    num = Math.abs(num);
  }

  const mainPart = Math.floor(num);
  const decimalPart = num - mainPart;

  const helper = (n: number): string => {
    let s = '';
    if (n >= 100) {
      s += units[Math.floor(n / 100)] + ' hundred ';
      n %= 100;
    }
    if (n >= 20) {
      s += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      s += (n < 10 ? units[n] : teens[n - 10]) + ' ';
    }
    return s.trim();
  };

  let thousandGroupIndex = 0;
  let text = '';
  let tempNum = mainPart;

  while (tempNum > 0) {
    const chunk = tempNum % 1000;
    if (chunk > 0) {
      const chunkText = helper(chunk);
      const groupName = thousands[thousandGroupIndex];
      text = chunkText + (groupName ? ' ' + groupName : '') + (text ? ' ' + text : '');
    }
    tempNum = Math.floor(tempNum / 1000);
    thousandGroupIndex++;
  }

  let finalStr = sign + (text.trim() || 'zero');

  if (decimalPart > 0) {
    const decimalString = decimalPart.toFixed(4).replace(/0+$/, '');
    const digits = decimalString.split('.')[1] || '';
    if (digits) {
      const spelledDigits = digits.split('').map(digit => {
        if (digit === '0') return 'zero';
        return units[parseInt(digit)];
      }).join(' ');
      finalStr += ' point ' + spelledDigits;
    }
  }

  return finalStr.trim();
}

interface NumberToWordConverterProps {
  isDark: boolean;
}

function NumberToWordConverter({ isDark }: NumberToWordConverterProps) {
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

  const [numInput, setNumInput] = useState<string>('123456');
  const [formatMode, setFormatMode] = useState<'standard' | 'currency'>('standard');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const numVal = parseFloat(numInput);
  const wordsResult = (() => {
    if (isNaN(numVal)) return 'Please input a valid number';
    if (Math.abs(numVal) > 1e15) return 'Number is too large to translate (maximum: 1 quadrillion)';

    const standardText = numberToWords(numVal);
    
    if (formatMode === 'currency') {
      const dollarsStr = numVal < 0 ? 'minus ' : '';
      const posVal = Math.abs(numVal);
      const dollars = Math.floor(posVal);
      const cents = Math.round((posVal - dollars) * 100);

      const mainWord = numberToWords(dollars);
      const dollarPlural = dollars === 1 ? 'dollar' : 'dollars';
      
      if (cents === 0) {
        return `${dollarsStr}${mainWord} ${dollarPlural} only`.trim();
      } else {
        const centWord = numberToWords(cents);
        const centPlural = cents === 1 ? 'cent' : 'cents';
        return `${dollarsStr}${mainWord} ${dollarPlural} and ${centWord} ${centPlural}`.trim();
      }
    }

    return standardText;
  })();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const badgeClass = isDark
    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    : 'bg-indigo-50 text-indigo-600 border-indigo-200';

  return (
    <div className="space-y-6" id="num-to-word-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>WORD</span>
          Number to Word Converter
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Translate scientific digits and integers into formal English spelled-out written patterns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className={`lg:col-span-5 ${t.panelBg} p-5 rounded-2xl flex flex-col justify-between`}>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className={`text-xs font-bold ${t.label} block font-mono`}>ENTER DIGITS OR DECIMALS:</label>
              <input
                type="text"
                className={`w-full p-3 ${t.inputBg} rounded-xl font-mono font-bold text-lg focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500 focus:outline-none`}
                value={numInput}
                onChange={(e) => setNumInput(e.target.value)}
                placeholder="1234.56"
              />
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-bold ${t.label} block font-mono`}>TRANSLATION STYLE FORMAT:</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setFormatMode('standard')}
                  className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                    formatMode === 'standard'
                      ? 'bg-indigo-505/10 border-indigo-500 text-white font-bold'
                      : `bg-black/35 ${t.border} ${t.textMuted} hover:text-white`
                  }`}
                >
                  Standard Spelled Out
                </button>
                <button
                  type="button"
                  onClick={() => setFormatMode('currency')}
                  className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                    formatMode === 'currency'
                      ? 'bg-indigo-505/10 border-indigo-500 text-white font-bold'
                      : `bg-black/35 ${t.border} ${t.textMuted} hover:text-white`
                  }`}
                >
                  Financial USD Notes
                </button>
              </div>
            </div>
          </div>

          <div className={`pt-4 border-t ${t.border} text-xs ${t.textFaint} font-mono space-y-1.5 select-none`}>
            <span className={`font-bold ${t.label} block`}>Quick Examples (click to load)</span>
            <div className="flex flex-wrap gap-2">
              {['1450', '98754.20', '-35', '1000000'].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setNumInput(ex)}
                  className="bg-[#1c1c1f] px-2 py-1 rounded border border-white/5 hover:border-indigo-500/20 text-gray-300 hover:text-white active:scale-95 transition-all text-[11px]"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`lg:col-span-7 ${t.panelBg} p-5 rounded-2xl flex flex-col justify-between`}>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">TRANSLATED ENGLISH</span>
              <button
                type="button"
                onClick={() => handleCopy(wordsResult, 'word-res')}
                className="text-xs font-mono text-gray-450 hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode === 'word-res' ? (
                  <>
                    <Icons.Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied Summary
                  </>
                ) : (
                  <>
                    <Icons.Copy className="w-3.5 h-3.5" />
                    Copy English Words
                  </>
                )}
              </button>
            </div>

            <div className={`p-4 bg-black/40 rounded-xl border ${t.border} min-h-[95px] flex items-center text-sm ${t.heading} font-semibold leading-relaxed break-words capitalize-first`}>
              {wordsResult}
            </div>
          </div>

          <p className={`text-[11px] ${t.textFaint} leading-normal font-mono select-none border-t ${t.border} pt-3.5 mt-4`}>
            Ideal for printing checks, draft documents, or translating decimal values inside engineering specifications.
          </p>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. WORD TO NUMBER CONVERTER
// ----------------------------------------------------

function wordsToNumber(str: string): number {
  const cleanStr = str.toLowerCase()
    .replace(/,/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\band\b/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  if (!cleanStr) return NaN;

  const units: Record<string, number> = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
    'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90
  };

  const largeMultiplier: Record<string, number> = {
    'hundred': 100,
    'thousand': 1000,
    'million': 1000000,
    'billion': 1000000000,
    'trillion': 1000000000000
  };

  const tokens = cleanStr.split(' ');
  
  let sign = 1;
  let startIndex = 0;
  if (tokens[0] === 'minus' || tokens[0] === 'negative') {
    sign = -1;
    startIndex = 1;
  }

  const pointIndex = tokens.indexOf('point');
  if (pointIndex !== -1) {
    const wholeTokens = tokens.slice(startIndex, pointIndex);
    const decimalTokens = tokens.slice(pointIndex + 1);

    const wholeNum = parseHelper(wholeTokens, units, largeMultiplier);
    if (isNaN(wholeNum)) return NaN;

    let decimalStr = '0.';
    for (const t of decimalTokens) {
      if (units[t] !== undefined) {
        decimalStr += units[t];
      } else {
        if (t === 'zero' || t === 'oh') decimalStr += '0';
        else if (t === 'one') decimalStr += '1';
        else if (t === 'two') decimalStr += '2';
        else if (t === 'three') decimalStr += '3';
        else if (t === 'four') decimalStr += '4';
        else if (t === 'five') decimalStr += '5';
        else if (t === 'six') decimalStr += '6';
        else if (t === 'seven') decimalStr += '7';
        else if (t === 'eight') decimalStr += '8';
        else if (t === 'nine') decimalStr += '9';
        else {
          return NaN;
        }
      }
    }
    return sign * (wholeNum + parseFloat(decimalStr));
  }

  return sign * parseHelper(tokens.slice(startIndex), units, largeMultiplier);
}

function parseHelper(tokens: string[], units: Record<string, number>, multipliers: Record<string, number>): number {
  if (tokens.length === 0) return 0;
  let total = 0;
  let currentGroup = 0;

  for (const token of tokens) {
    if (units[token] !== undefined) {
      currentGroup += units[token];
    } else if (token === 'hundred') {
      currentGroup *= 100;
    } else if (multipliers[token] !== undefined) {
      total += currentGroup * multipliers[token];
      currentGroup = 0;
    } else {
      return NaN;
    }
  }

  return total + currentGroup;
}

interface WordToNumberConverterProps {
  isDark: boolean;
}

function WordToNumberConverter({ isDark }: WordToNumberConverterProps) {
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

  const [wordsInput, setWordsInput] = useState<string>('one million two hundred thirty-four thousand five hundred and sixty-seven');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const numericResult = wordsToNumber(wordsInput);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const badgeClass = isDark
    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    : 'bg-cyan-50 text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6" id="word-to-num-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>UNIT</span>
          Word to Number Converter
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Reconstruct high precision digits from alphabetical English text notations automatically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className={`lg:col-span-6 ${t.panelBg} p-5 rounded-2xl flex flex-col justify-between`}>
          <div className="space-y-3">
            <label className={`text-xs font-bold ${t.label} block font-mono`}>PASTE OR WRITE ENGLISH WORDS:</label>
            <textarea
              className={`w-full h-28 p-3.5 ${t.textareaBg} rounded-xl font-mono placeholder-gray-650 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none resize-none leading-relaxed`}
              value={wordsInput}
              onChange={(e) => setWordsInput(e.target.value)}
              placeholder="e.g., forty-five thousand six hundred and twelve point three"
            />
          </div>

          <div className={`pt-4 border-t ${t.border} text-xs ${t.textFaint} font-mono space-y-1.5 mt-4 select-none`}>
            <span className={`font-bold ${t.label} block`}>Click Examples to Load</span>
            <div className="space-y-1">
              {[
                'one hundred fifty thousand and five',
                'minus seven hundred eighty-two point zero nine',
                'three trillion five billion and two hundred thousand'
              ].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setWordsInput(ex)}
                  className="bg-[#1c1c1f] text-left block w-full px-2 py-1 rounded border border-white/5 hover:border-cyan-500/20 text-gray-300 hover:text-white transition-all text-[11px] truncate"
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`lg:col-span-6 ${t.panelBg} p-5 rounded-2xl flex flex-col justify-between`}>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block font-mono">PARSED INT / DECIMAL</span>
              <button
                type="button"
                disabled={isNaN(numericResult)}
                onClick={() => handleCopy(numericResult.toString(), 'num-res')}
                className="text-xs font-mono text-gray-450 hover:text-cyan-400 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode === 'num-res' ? (
                  <>
                    <Icons.Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied Value
                  </>
                ) : (
                  <>
                    <Icons.Copy className="w-3.5 h-3.5" />
                    Copy Numeric Value
                  </>
                )}
              </button>
            </div>

            <div className={`p-4 bg-black/40 rounded-xl border ${t.border} min-h-[95px] flex flex-col items-center justify-center text-center`}>
              {isNaN(numericResult) ? (
                <div className="space-y-1.5 text-red-400">
                  <Icons.AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
                  <p className="text-xs font-mono">Parser Warning: Unrecognized tokens or syntax</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-3xl font-black font-mono text-cyan-400 break-all select-all">{numericResult.toLocaleString(undefined, { maximumFractionDigits: 10 })}</span>
                  <p className={`text-[10px] ${t.textFaint} font-mono tracking-wider`}>RAW FORMAT: {numericResult}</p>
                </div>
              )}
            </div>
          </div>

          <p className={`text-[11px] ${t.textFaint} leading-normal font-mono select-none border-t ${t.border} pt-3.5 mt-4`}>
            Supports standard hyphenations, hundreds, millions, trillions, decimals ("point") and optional negatives ("minus").
          </p>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. NUMBER TO ROMAN NUMERALS CONVERTER
// ----------------------------------------------------

function integerToRoman(num: number): string {
  if (num < 1 || num > 3999) return '';
  const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syb = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let roman = "";
  for (let i = 0; i < val.length; i++) {
    while (num >= val[i]) {
      roman += syb[i];
      num -= val[i];
    }
  }
  return roman;
}

interface NumberToRomanConverterProps {
  isDark: boolean;
}

function NumberToRomanConverter({ isDark }: NumberToRomanConverterProps) {
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

  const [inputStr, setInputStr] = useState<string>('2026');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const numVal = parseInt(inputStr);
  const romanOutput = (() => {
    if (isNaN(numVal) || numVal <= 0) return 'Please type a positive integer greater than 0';
    if (numVal > 3999) return 'Standard Roman Numerals maximum target is 3999 (I–MMMCMXCIX)';
    return integerToRoman(numVal);
  })();

  const isError = isNaN(numVal) || numVal <= 0 || numVal > 3999;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const badgeClass = isDark
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    : 'bg-purple-50 text-purple-600 border-purple-200';

  return (
    <div className="space-y-6" id="num-to-roman-container">
      <div className={`pb-4 border-b ${t.border} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
        <div>
          <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
            <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>HISTORIC</span>
            Number to Roman Numerals
          </h2>
          <p className={`text-sm ${t.textMuted}`}>Convert modern base-10 standard Hindu-Arabic integers into chronological classic Roman digits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className={`${t.panelBg} p-6 rounded-2xl flex flex-col justify-between space-y-4`}>
          <div className="space-y-1.5">
            <label className={`text-xs font-bold ${t.label} block font-mono`}>POSITIVE INTEGER (1 TO 3999):</label>
            <input
              type="number"
              min="1"
              max="3999"
              className={`w-full p-3.5 ${t.inputBg} rounded-xl font-mono font-bold text-xl focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500 focus:outline-none`}
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              placeholder="e.g. 1999"
            />
          </div>

          <div className={`text-xs ${t.textFaint} font-mono space-y-1.5 select-none`}>
            <span className={`font-bold ${t.label} block`}>Historic Presets</span>
            <div className="flex flex-wrap gap-2">
              {['44', '100', '1999', '2000', '2026', '3999'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setInputStr(p)}
                  className="bg-[#1c1c1f] px-2 py-1 rounded border border-white/5 hover:border-purple-500/25 text-gray-300 hover:text-white transition-all text-[11px]"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`${t.panelBg} p-6 rounded-2xl flex flex-col justify-between`}>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block font-mono">ROMAN DIGIT MATCH</span>
              <button
                type="button"
                disabled={isError}
                onClick={() => handleCopy(romanOutput, 'rom-cop')}
                className="text-xs font-mono text-gray-450 hover:text-purple-400 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode === 'rom-cop' ? (
                  <>
                    <Icons.Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied Code
                  </>
                ) : (
                  <>
                    <Icons.Copy className="w-3.5 h-3.5" />
                    Copy Roman
                  </>
                )}
              </button>
            </div>

            <div className={`p-4 bg-black/40 rounded-xl border ${t.border} min-h-[90px] flex items-center justify-center text-center`}>
              {isError ? (
                <p className={`text-xs font-mono ${t.textFaint}`}>{romanOutput}</p>
              ) : (
                <span className="text-4xl font-extrabold font-serif text-purple-400 tracking-widest break-all select-all">{romanOutput}</span>
              )}
            </div>
          </div>

          <p className={`text-[11px] ${t.textFaint} leading-normal font-mono select-none pt-3 border-t ${t.border} mt-4`}>
            Formula breakdown: {romanOutput.split('').map((char, index) => {
              const symValue: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
              if (isError) return '';
              return `${char} (${symValue[char] || 0})${index === romanOutput.length - 1 ? '' : ' + '}`;
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. ROMAN NUMERALS TO NUMBER CONVERTER
// ----------------------------------------------------

function romanToInteger(str: string): number {
  const romanMap: Record<string, number> = {
    I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
  };

  const clean = str.toUpperCase().trim();
  if (!clean) return NaN;

  const romanRegex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
  if (!romanRegex.test(clean)) return NaN;

  let total = 0;
  for (let i = 0; i < clean.length; i++) {
    const currentVal = romanMap[clean[i]];
    const nextVal = romanMap[clean[i + 1]] || 0;

    if (currentVal < nextVal) {
      total -= currentVal;
    } else {
      total += currentVal;
    }
  }
  return total;
}

interface RomanToNumberConverterProps {
  isDark: boolean;
}

function RomanToNumberConverter({ isDark }: RomanToNumberConverterProps) {
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

  const [romanStr, setRomanStr] = useState<string>('MCMXCIX');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const parsedVal = romanToInteger(romanStr);
  const isErr = isNaN(parsedVal);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const badgeClass = isDark
    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    : 'bg-indigo-50 text-indigo-600 border-indigo-200';

  return (
    <div className="space-y-6" id="roman-to-num-container">
      <div className={`pb-4 border-b ${t.border}`}>
        <h2 className={`text-xl font-semibold ${t.heading} flex items-center gap-2 select-none`}>
          <span className={`p-1 px-2 text-xs font-mono ${badgeClass} border rounded`}>HISTORIC</span>
          Roman Numerals to Number
        </h2>
        <p className={`text-sm ${t.textMuted}`}>Resolve standard Latin Roman alphabet strings back into standard base-10 numerical values.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className={`${t.panelBg} p-6 rounded-2xl flex flex-col justify-between space-y-4`}>
          <div className="space-y-1.5 font-mono">
            <label className={`text-xs font-bold ${t.label} block`}>TYPE VALID ROMAN CHARACTERS (I, V, X, L, C, D, M):</label>
            <input
              type="text"
              className={`w-full p-3.5 ${t.inputBg} rounded-xl font-serif font-black text-2xl uppercase tracking-widest focus:ring-1 focus:ring-indigo-550 focus:border-indigo-500 focus:outline-none`}
              value={romanStr}
              onChange={(e) => setRomanStr(e.target.value)}
              placeholder="MCMXCIX"
            />
          </div>

          <div className={`text-xs ${t.textFaint} font-mono space-y-1.5 select-none`}>
            <span className={`font-bold ${t.label} block`}>Common Roman Examples</span>
            <div className="flex flex-wrap gap-2">
              {['IV', 'XCVII', 'DLV', 'MCMXCIX', 'MMXVI', 'MMMCMXCIX'].map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => setRomanStr(char)}
                  className="bg-[#1c1c1f] px-2 py-1 rounded border border-white/5 hover:border-indigo-500/25 text-gray-300 hover:text-white transition-all text-[11px] font-semibold"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`${t.panelBg} p-6 rounded-2xl flex flex-col justify-between`}>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">RESOLVED VALUE</span>
              <button
                type="button"
                disabled={isErr}
                onClick={() => handleCopy(parsedVal.toString(), 'num-cop')}
                className="text-xs font-mono text-gray-450 hover:text-indigo-400 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode === 'num-cop' ? (
                  <>
                    <Icons.Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied Number
                  </>
                ) : (
                  <>
                    <Icons.Copy className="w-3.5 h-3.5" />
                    Copy Numeric
                  </>
                )}
              </button>
            </div>

            <div className={`p-4 bg-black/40 rounded-xl border ${t.border} min-h-[90px] flex items-center justify-center text-center font-mono`}>
              {isErr ? (
                <div className="space-y-1 text-red-400">
                  <Icons.AlertCircle className="w-5 h-5 text-red-500 mx-auto" />
                  <p className="text-xs">Invalid Roman numeral pattern or out of bounds (1–3999).</p>
                </div>
              ) : (
                <span className="text-4xl font-extrabold text-indigo-400 break-all select-all">{parsedVal}</span>
              )}
            </div>
          </div>

          <p className={`text-[11px] ${t.textFaint} leading-normal font-mono select-none pt-3 border-t ${t.border} mt-4`}>
            Subtractive notation rules apply (e.g., IV = 4, IX = 9, XC = 90, CM = 900) standardly.
          </p>
        </div>
      </div>
    </div>
  );
}