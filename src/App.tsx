import React, { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from './ThemeContext';
import { LegalPages } from './components/LegalPages';
import { AboutContact } from './components/AboutContact';
import { FaqPage } from './components/FaqPage';
import { BlogPage } from './components/BlogPage';
import { BlogPost } from './components/BlogPost';
import { ToolExplanation } from './components/ToolExplanations';
import { TopAdBanner, BottomAdBanner, SidebarAdSkyscraper } from './components/Advertisements';
import { Tool } from './types';
import { CookieBanner } from './components/CookieBanner';

// Lazy load tool components to optimize initial bundle size and page load speed
const CodeTools = lazy(() => import('./components/CodeTools').then(m => ({ default: m.CodeTools })));
const JsonSuiteTools = lazy(() => import('./components/JsonSuiteTools').then(m => ({ default: m.JsonSuiteTools })));
const WebMgmtTools = lazy(() => import('./components/WebMgmtTools').then(m => ({ default: m.WebMgmtTools })));
const JsDeveloperTools = lazy(() => import('./components/JsDeveloperTools').then(m => ({ default: m.JsDeveloperTools })));
const QrCodeHelperTools = lazy(() => import('./components/QrCodeHelperTools').then(m => ({ default: m.QrCodeHelperTools })));
const UrlMarketingTools = lazy(() => import('./components/UrlMarketingTools').then(m => ({ default: m.UrlMarketingTools })));
const TextTools = lazy(() => import('./components/TextTools').then(m => ({ default: m.TextTools })));
const NetworkTools = lazy(() => import('./components/NetworkTools').then(m => ({ default: m.NetworkTools })));
const UtilityTools = lazy(() => import('./components/UtilityTools').then(m => ({ default: m.UtilityTools })));
const ImageTools = lazy(() => import('./components/ImageTools').then(m => ({ default: m.ImageTools })));
const CalculatorTools = lazy(() => import('./components/CalculatorTools').then(m => ({ default: m.CalculatorTools })));
const ConverterTools = lazy(() => import('./components/ConverterTools').then(m => ({ default: m.ConverterTools })));
const BinaryTools = lazy(() => import('./components/BinaryTools').then(m => ({ default: m.BinaryTools })));
const AvSubtitleTools = lazy(() => import('./components/AvSubtitleTools').then(m => ({ default: m.AvSubtitleTools })));
const ColorTools = lazy(() => import('./components/ColorTools').then(m => ({ default: m.ColorTools })));
const DeveloperSuiteTools = lazy(() => import('./components/DeveloperSuiteTools').then(m => ({ default: m.DeveloperSuiteTools })));
const DesignSuiteTools = lazy(() => import('./components/DesignSuiteTools').then(m => ({ default: m.DesignSuiteTools })));
const SeoSpatialTools = lazy(() => import('./components/SeoSpatialTools').then(m => ({ default: m.SeoSpatialTools })));

const ALL_TOOLS: Tool[] = [
  // Website Management Tools
  { id: 'html-decode', name: 'HTML Decode', description: 'Convert safe HTML entity structures safely back to printable web tag characters.', iconName: 'Terminal', category: 'web-mgmt' },
  { id: 'html-encode', name: 'HTML Encode', description: 'Transform dynamic content characters to safe equivalent HTML entities.', iconName: 'Code', category: 'web-mgmt' },
  { id: 'url-decode', name: 'URL Decode', description: 'Convert percent-safe URL configurations back into natural readable link references.', iconName: 'Unlink', category: 'web-mgmt' },
  { id: 'url-encode', name: 'URL Encode', description: 'Convert special text markers into browser-compliant safe URL symbols.', iconName: 'Link', category: 'web-mgmt' },
  { id: 'html-beautifier', name: 'HTML Beautifier', description: 'Format nested tag layouts and restore indentations to unorganized HTML code outlines.', iconName: 'Sparkles', category: 'development' },
  { id: 'html-minifier', name: 'HTML Minifier', description: 'Compress HTML by shedding annotations, comments, and redundant spacing parameters.', iconName: 'Shrink', category: 'development' },
  { id: 'css-beautifier', name: 'CSS Beautifier', description: 'Structure stylesheets, indent CSS definitions, and clean declaration alignments.', iconName: 'Brush', category: 'development' },
  { id: 'css-minifier', name: 'CSS Minifier', description: 'Minify stylesheet documents by removing spacing, annotations, and comments.', iconName: 'Activity', category: 'development' },
  { id: 'js-beautifier', name: 'JavaScript Beautifier', description: 'Format complex JavaScript statement lists, align structural braces correctly, and space identifiers.', iconName: 'Sparkles', category: 'development' },
  { id: 'js-minifier', name: 'JavaScript Minifier', description: 'Compress JavaScript bundles by removing spaces, single & multi-line comments, and tabs.', iconName: 'Shrink', category: 'development' },
  { id: 'js-obfuscator', name: 'Javascript Obfuscator', description: 'Protect your scripts by translating variables and strings to randomized hex arrays.', iconName: 'ShieldAlert', category: 'development' },
  { id: 'js-deobfuscator', name: 'Javascript DeObfuscator', description: 'Reverse hex encoding sequences, decompress and format packed evaluation codes securely.', iconName: 'HelpCircle', category: 'development' },
  { id: 'qr-generator', name: 'QR Code Generator', description: 'Generate custom vector QR codes offline with color, margin, and error adjustments.', iconName: 'QrCode', category: 'web-mgmt' },
  { id: 'qr-decoder', name: 'QR Code Decoder', description: 'Scan, decode, and read payload values inside uploaded QR code images entirely client-side.', iconName: 'ScanLine', category: 'web-mgmt' },
  { id: 'facebook-id', name: 'Find Facebook ID', description: 'Discover raw numeric profile, page, or group identifiers from standard Facebook links.', iconName: 'Facebook', category: 'web-mgmt' },
  { id: 'uuid-gen', name: 'UUID Generator', description: 'Create Version 4 (Random) or Version 1 (Time-based) universally unique identifiers instantly.', iconName: 'Cpu', category: 'web-mgmt' },
  { id: 'url-parser', name: 'URL Parser', description: 'Decompose web link addresses to view structural ports, protocols, hash tags, and query keys.', iconName: 'Unlink', category: 'web-mgmt' },
  { id: 'utm-builder', name: 'UTM Builder', description: 'Assemble standard Google Analytics marketing campaign coordinates inside links for tracking.', iconName: 'Tag', category: 'web-mgmt' },
  { id: 'query-param-stripper', name: 'Canonical URL Stripper', description: 'Clean tracking indicators (utm_*, fbclid, gclid, msclkid) and redundant fragments from pasted links to get canonical URLs.', iconName: 'Scissors', category: 'web-mgmt' },

  // Development
  { id: 'json-formatter', name: 'JSON Formatter_Validator', description: 'Beautify, minify, validate, and check JSON schemas with direct syntax output.', iconName: 'Terminal', category: 'development' },
  { id: 'json-viewer', name: 'JSON Viewer', description: 'Collapsible interactive tree viewer with properties search, folding, and type coloring.', iconName: 'Eye', category: 'development' },
  { id: 'json-validator', name: 'JSON Validator', description: 'Strict RFC-compliant syntax validator checks double quotes, brackets and pinpoints offset errors.', iconName: 'CheckSquare', category: 'development' },
  { id: 'json-editor', name: 'JSON Editor', description: 'Structured visual code editor workspace with key sorting, clean templates, and real-time formatting.', iconName: 'Edit3', category: 'development' },
  { id: 'json-minify', name: 'JSON Minify', description: 'Strip standard spacing, tab indentation, and newlines to compress configurations instantly.', iconName: 'Minimize2', category: 'development' },
  { id: 'xml-to-json', name: 'XML to JSON Converter', description: 'Parse elements, attributes, and CDATA from XML feeds into clean JavaScript tree arrays.', iconName: 'FolderSync', category: 'development' },
  { id: 'json-to-xml', name: 'JSON to XML Converter', description: 'Compile JavaScript nested maps, structures, and arrays into pretty-printed XML document strings.', iconName: 'Code2', category: 'development' },
  { id: 'csv-to-json', name: 'CSV to JSON Converter', description: 'Convert tabular, comma-separated spreadsheet documents into relational JSON object records.', iconName: 'Database', category: 'development' },
  { id: 'json-to-csv', name: 'JSON to CSV Converter', description: 'Serialize list records and database rows into fully escaped comma-separated CSV matrices.', iconName: 'Table', category: 'development' },
  { id: 'tsv-to-json', name: 'TSV to JSON Converter', description: 'Parse standard tab-spaced rows and columns into highly queryable JavaScript collections.', iconName: 'Database', category: 'development' },
  { id: 'json-to-tsv', name: 'JSON to TSV Converter', description: 'Generate standard tab-separated spreadsheet columns with quote escaping.', iconName: 'Table', category: 'development' },
  { id: 'json-to-text', name: 'JSON to Plain Text Outline', description: 'Visualize complex structures as a clean plain text tree outline map.', iconName: 'FileText', category: 'development' },
  { id: 'base64', name: 'Base64 Encoder / Decoder', description: 'Encode clean text to Base64 representation or decode back safely.', iconName: 'Cpu', category: 'development' },
  { id: 'html-url', name: 'URL & HTML Entity Helper', description: 'Escape HTML characters and encode percent strings for safe URI routing.', iconName: 'Code2', category: 'development' },
  { id: 'hash-gen', name: 'Cryptographic Hash Generator', description: 'Calculate secure browser-side SHA-1, SHA-256 and SHA-512 checksums.', iconName: 'Lock', category: 'development' },

  // Image Tools (New Separated Category)
  { id: 'image-enlarger', name: 'Image Enlarger & Upscaler', description: 'Enlarge and upscale images client-side using responsive canvas interpolation (Bicubic/Bilinear) or pixel enlargement.', iconName: 'Maximize', category: 'image' },
  { id: 'image-cropper', name: 'Precision Image Cropper', description: 'Crop images to custom aspect ratios or custom pixel dimensions with an interactive cropping box.', iconName: 'Crop', category: 'image' },
  { id: 'image-resizer', name: 'Smart Image Resizer', description: 'Resize image dimensions (width, height) with aspect-ratio locking and file scaling.', iconName: 'MoveHorizontal', category: 'image' },
  { id: 'image-converter', name: 'Universal Image Converter', description: 'Convert images dynamically between PNG, JPEG, WebP, GIF, or BMP formats offline.', iconName: 'RefreshCw', category: 'image' },
  { id: 'jpg-to-png', name: 'JPG to PNG Converter', description: 'Convert single or multiple JPEG/JPG images to clean, standard PNG files in-browser.', iconName: 'ImagePlus', category: 'image' },
  { id: 'jpg-converter', name: 'Universal JPG/JPEG Compiler', description: 'Translate WebP, PNG, BMP, or SVG visuals into space-optimized JPEG/JPG graphics.', iconName: 'FileImage', category: 'image' },
  { id: 'webp-to-jpg', name: 'WebP to JPG Web Converter', description: 'Convert next-gen WebP images to high-compatibility JPEG/JPG formats at selected qualities.', iconName: 'ArrowRightLeft', category: 'image' },
  { id: 'png-to-jpg', name: 'PNG to JPG Image Converter', description: 'Convert PNG images to JPG format locally in your browser with adjustable compression quality.', iconName: 'Image', category: 'image' },
  
  // Newly Added Converters
  { id: 'png-to-webp', name: 'PNG to WebP Converter', description: 'Convert lossless PNG files to space-optimized, modern WebP images with alpha channel support.', iconName: 'Sparkles', category: 'image' },
  { id: 'png-to-bmp', name: 'PNG to BMP Converter', description: 'Convert PNG files to standard uncompressed BMP bitmaps offline, preserving original transparent pixels.', iconName: 'Image', category: 'image' },
  { id: 'png-to-gif', name: 'PNG to GIF Converter', description: 'Convert static transparent PNG graphics to standardized GIF files entirely inside the browser.', iconName: 'FileImage', category: 'image' },
  { id: 'png-to-ico', name: 'PNG to ICO Converter', description: 'Translate transparent PNG layouts into standard multi-resolution ICO favicons in a single step.', iconName: 'Settings', category: 'image' },
  { id: 'jpg-to-webp', name: 'JPG to WebP Converter', description: 'Compress and transform standard JPG photos into next-gen high-efficiency WebP files.', iconName: 'RefreshCw', category: 'image' },
  { id: 'jpg-to-bmp', name: 'JPG to BMP Converter', description: 'Convert space-optimized JPG layouts to standard Windows BMP desktop graphics.', iconName: 'Image', category: 'image' },
  { id: 'jpg-to-gif', name: 'JPG to GIF Converter', description: 'Translate JPEG photos into standard single-frame raster GIF graphics local-privately.', iconName: 'FileImage', category: 'image' },
  { id: 'jpg-to-ico', name: 'JPG to ICO Icons Compiler', description: 'Produce Windows ICO desktop launcher icons and browser favicons from any JPEG photograph.', iconName: 'Settings', category: 'image' },
  { id: 'webp-to-png', name: 'WebP to PNG Image Decoder', description: 'Convert standard and high-efficiency WebP graphics to clean, lossless, transparent PNG pictures.', iconName: 'ImagePlus', category: 'image' },

  { id: 'ico-to-png', name: 'ICO to PNG Converter', description: 'Convert ICO files to PNG images in an instant with size selection.', iconName: 'FileImage', category: 'image' },
  { id: 'ico-converter', name: 'ICO Converter', description: 'Convert images (PNG, JPG, WebP) to ICO, or extract original images from ICO files.', iconName: 'Settings', category: 'image' },
  { id: 'image-to-base64', name: 'Image to Base64', description: 'Translate image files into standard, inline-safe Base64 Data URI strings.', iconName: 'Code', category: 'image' },
  { id: 'base64-to-image', name: 'Base64 to Image', description: 'Decode base64 format strings back into visual images and download them.', iconName: 'FileText', category: 'image' },
  { id: 'flip-image', name: 'Flip & Rotate Image', description: 'Mirror images horizontally, vertically, or rotate by custom degrees with instant previews.', iconName: 'RotateCw', category: 'image' },

  // Text
  { id: 'case-converter', name: 'Text Case Converter', description: 'Instantly convert strings into UPPERCASE, lowercase, Title Case, camelCase or snake_case.', iconName: 'Type', category: 'text' },
  { id: 'word-counter', name: 'Word Counter & Text Analyzer', description: 'Analyze word counts, character frequencies, reading duration estimations, and text density.', iconName: 'Calculator', category: 'text' },
  { id: 'markdown-preview', name: 'Markdown Live Viewer', description: 'Edit plain Markdown markup and watch live HTML previews on-the-fly.', iconName: 'Eye', category: 'text' },
  { id: 'text-to-slug', name: 'Text to Slug Converter', description: 'Convert standard text phrases into safe, SEO-friendly layout URL slugs on-the-fly.', iconName: 'Link', category: 'text' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', description: 'Generate structured dummy mock passages tailored by sentences, words or paragraph blocks.', iconName: 'FileText', category: 'text' },
  { id: 'remove-line-breaks', name: 'Remove Line Breaks', description: 'Instantly strip returns and double spacing, converting vertical columns to clean running prose.', iconName: 'Scissors', category: 'text' },
  { id: 'random-word', name: 'Random Word Generator', description: 'Roll and compile random lists of nouns, adjectives or verbs matching custom bounds.', iconName: 'Shuffle', category: 'text' },
  { id: 'privacy-policy', name: 'Privacy Policy Generator', description: 'Draft comprehensive on-the-fly GDPR and CCPA standard privacy policies for digital compliance.', iconName: 'Shield', category: 'text' },
  { id: 'terms-conditions', name: 'Terms & Conditions Generator', description: 'Compile legal Terms of Service policies for websites, online service engines or stores.', iconName: 'BookOpen', category: 'text' },
  { id: 'disclaimer-gen', name: 'Disclaimer Generator', description: 'Build standard legal disclaimers protecting owner liability regarding financial or legal advice.', iconName: 'ShieldAlert', category: 'text' },
  { id: 'text-repeater', name: 'Text & Emoji Repeater', description: 'Construct massive repeated phrase sequences separated by customizable lines or spaces.', iconName: 'Repeat', category: 'text' },
  { id: 'text-sorter', name: 'Advanced Text Sorter', description: 'Order lists of words in alphabetical, length-based, or numerical formats step-by-step.', iconName: 'ArrowUpDown', category: 'text' },
  { id: 'comma-separator', name: 'Comma Separator Tool', description: 'Morph lists of inputs into comma strings or split CSV values back to vertical lines.', iconName: 'Table', category: 'text' },

  // Network
  { id: 'my-ip', name: 'My IP & Headers Checker', description: 'Inspect standard public IPv4 parameters and headers sent by your client.', iconName: 'Wifi', category: 'network' },
  { id: 'dns-lookup', name: 'DNS Record Lookup', description: 'Query domain namespaces directly for records like A, AAAA, MX, NS and TXT.', iconName: 'Globe', category: 'network' },

  // Utility
  { id: 'pass-gen', name: 'Password Generator', description: 'Generate robust client-side cryptographic passwords using custom parameters.', iconName: 'Key', category: 'utility' },
  { id: 'password-entropy', name: 'Password Keyspace & Entropy Calculator', description: 'Analyze password mathematical entropy (bits of keyspace) and estimate brute-force cracking times across various hardware loads (CPU vs. heavy GPU cluster).', iconName: 'Activity', category: 'utility' },
  { id: 'unit-conv', name: 'Multi-Unit Converter', description: 'Convert units cleanly between computer data sizes, length factors or temp.', iconName: 'Scale', category: 'utility' },
  { id: 'length-conv', name: 'Length Converter', description: 'Convert metric and imperial lengths, distances, and astronomical units.', iconName: 'Ruler', category: 'utility' },
  { id: 'area-conv', name: 'Area Converter', description: 'Convert dimensions of land, buildings, and geographic scales seamlessly.', iconName: 'Square', category: 'utility' },
  { id: 'weight-conv', name: 'Weight Converter', description: 'Convert mass parameters across metric, imperial, and gold/carat indices.', iconName: 'Scale', category: 'utility' },
  { id: 'volume-conv', name: 'Volume Converter', description: 'Convert liquid densities, metric liters, and dry culinary volume standards.', iconName: 'Droplet', category: 'utility' },
  { id: 'temp-conv', name: 'Temperature Converter', description: 'Convert temperature values between Celsius, Fahrenheit, Kelvin, and Rankine scales.', iconName: 'Thermometer', category: 'utility' },
  { id: 'each-conv', name: 'Each Converter', description: 'Convert pieces count arrays between dozen, score, gross, and individual units.', iconName: 'Boxes', category: 'utility' },
  { id: 'time-conv', name: 'Time Converter', description: 'Convert chronological variables from microsecond metrics up to standard calendar years.', iconName: 'Clock', category: 'utility' },
  { id: 'digital-conv', name: 'Digital Converter', description: 'Convert binary bytes, bits, and multi-gigabyte digital storage volumes.', iconName: 'Database', category: 'utility' },
  { id: 'parts-per-conv', name: 'Parts Per Converter', description: 'Convert scientific fractions, ratios, and parts-per-million concentration indices.', iconName: 'Percent', category: 'utility' },
  { id: 'speed-conv', name: 'Speed Converter', description: 'Convert velocities between km/h, mph, knots, mach levels and meters per second.', iconName: 'Gauge', category: 'utility' },
  { id: 'pace-conv', name: 'Pace Converter', description: 'Convert minutes per kilometer, miling paces, and predicted marathon race runtimes.', iconName: 'Activity', category: 'utility' },
  { id: 'pressure-conv', name: 'Pressure Converter', description: 'Convert pressure thresholds between bars, millibars, PSI, and atmospheric standards.', iconName: 'Compass', category: 'utility' },
  { id: 'current-conv', name: 'Current Converter', description: 'Convert electric currents between milliamp, ampere, and mega-ampere flows.', iconName: 'Zap', category: 'utility' },
  { id: 'voltage-conv', name: 'Voltage Converter', description: 'Convert electrical potential differences between volts, millivolts, and kilovolts.', iconName: 'Cpu', category: 'utility' },
  { id: 'power-conv', name: 'Power Converter', description: 'Convert active energy consumption and power output rates dynamically.', iconName: 'Battery', category: 'utility' },
  { id: 'reactive-power-conv', name: 'Reactive Power Converter', description: 'Convert AC circuit inductive and capacitive reactive power scales.', iconName: 'Activity', category: 'utility' },
  { id: 'apparent-power-conv', name: 'Apparent Power Converter', description: 'Convert AC electrical grid total apparent power thresholds.', iconName: 'Gauge', category: 'utility' },
  { id: 'energy-conv', name: 'Energy Converter', description: 'Convert active work, heat capacity, and power duration energy metrics.', iconName: 'Flame', category: 'utility' },

  // Binary Converter Tools
  { id: 'txt-to-bin', name: 'Text to Binary', description: 'Convert text characters into space-separated 8-bit binary strings.', iconName: 'Binary', category: 'binary' },
  { id: 'bin-to-txt', name: 'Binary to Text', description: 'Convert space-separated binary bits back into readable text.', iconName: 'FileText', category: 'binary' },
  { id: 'hex-to-bin', name: 'HEX to Binary', description: 'Convert base-16 hexadecimal codes into binary digit nibbles.', iconName: 'Hash', category: 'binary' },
  { id: 'bin-to-hex', name: 'Binary to HEX', description: 'Convert binary code arrays into hexadecimal character pairs.', iconName: 'Sliders', category: 'binary' },
  { id: 'ascii-to-bin', name: 'ASCII to Binary', description: 'Convert ASCII glyphs or indices directly to binary bits.', iconName: 'Cpu', category: 'binary' },
  { id: 'bin-to-ascii', name: 'Binary to ASCII', description: 'Convert base-2 bytes back to standard ASCII symbols.', iconName: 'Keyboard', category: 'binary' },
  { id: 'dec-to-bin', name: 'Decimal to Binary', description: 'Convert standard base-10 decimals or fractions to base-2 binary.', iconName: 'Divide', category: 'binary' },
  { id: 'bin-to-dec', name: 'Binary to Decimal', description: 'Convert base-2 binary arrays back into clean base-10 integers.', iconName: 'Sigma', category: 'binary' },
  { id: 'txt-to-ascii', name: 'Text to ASCII', description: 'Convert plain text characters to their decimal code equivalents.', iconName: 'ClipboardList', category: 'binary' },
  { id: 'ascii-to-txt', name: 'ASCII to Text', description: 'Convert decimal ASCII indices back to human-readable string characters.', iconName: 'Languages', category: 'binary' },
  { id: 'hex-to-dec', name: 'HEX to Decimal', description: 'Convert hexadecimal numbers to clean base-10 decimal representations.', iconName: 'Coins', category: 'binary' },
  { id: 'dec-to-hex', name: 'Decimal to HEX', description: 'Convert base-10 decimal numbers into uppercase hex codes.', iconName: 'Code2', category: 'binary' },
  { id: 'oct-to-bin', name: 'Octal to Binary', description: 'Convert base-8 octal values into stable 3-bit binary groups.', iconName: 'Dices', category: 'binary' },
  { id: 'bin-to-oct', name: 'Binary to Octal', description: 'Convert binary bits back into octal base-8 records.', iconName: 'Activity', category: 'binary' },
  { id: 'oct-to-dec', name: 'Octal to Decimal', description: 'Convert base-8 octal code inputs into base-10 decimal numerals.', iconName: 'Percent', category: 'binary' },
  { id: 'dec-to-oct', name: 'Decimal to Octal', description: 'Convert standard base-10 decimal numbers to base-8 octal format.', iconName: 'Globe', category: 'binary' },
  { id: 'hex-to-oct', name: 'HEX to Octal', description: 'Convert hexadecimal strings directly into matching base-8 octals.', iconName: 'Compass', category: 'binary' },
  { id: 'oct-to-hex', name: 'Octal to HEX', description: 'Convert octal base-8 numbers to uppercase hexadecimal streams.', iconName: 'Settings', category: 'binary' },
  { id: 'txt-to-oct', name: 'Text to Octal', description: 'Convert string characters into standard 3-digit octal codes.', iconName: 'BookOpen', category: 'binary' },
  { id: 'oct-to-txt', name: 'Octal to Text', description: 'Convert space-separated octal integers back into standard characters.', iconName: 'ChevronRight', category: 'binary' },
  { id: 'txt-to-hex', name: 'Text to HEX', description: 'Convert text characters into space-separated hexadecimal streams.', iconName: 'Fingerprint', category: 'binary' },
  { id: 'hex-to-txt', name: 'HEX to Text', description: 'Convert space-separated hexadecimal structures back into plain text.', iconName: 'AlignLeft', category: 'binary' },
  { id: 'txt-to-dec', name: 'Text to Decimal', description: 'Convert text string characters directly into base-10 sequence indices.', iconName: 'Calculator', category: 'binary' },
  { id: 'dec-to-txt', name: 'Decimal to Text', description: 'Convert space-separated decimal points back into readable text.', iconName: 'FileQuestion', category: 'binary' },

  // Calculators Zone
  { id: 'age-calc', name: 'Age Calculator', description: 'Calculate exact birthday statistics, days, weeks or minutes lived, and Western/Chinese cosmic signs.', iconName: 'Calendar', category: 'calculator' },
  { id: 'percentage-calc', name: 'Percentage Calculator', description: 'Resolve portion values, percentage changes, ratios adjustments or base rates step-by-step.', iconName: 'Percent', category: 'calculator' },
  { id: 'average-calc', name: 'Average Calculator', description: 'Analyze numerical collections for Mean, Median, Mode, Standard Deviation, range and variance.', iconName: 'Sigma', category: 'calculator' },
  { id: 'confidence-interval-calc', name: 'Confidence Interval Calculator', description: 'Establish population bounds using mean standards, standard deviations and normal distribution multipliers.', iconName: 'Compass', category: 'calculator' },
  { id: 'sales-tax-calc', name: 'Sales Tax Calculator', description: 'Apply sales tax, regional government tariffs and optional purchase markdown percentages.', iconName: 'Coins', category: 'calculator' },
  { id: 'margin-calc', name: 'Margin Calculator', description: 'Estimate gross business profit lines, required sale prices and cost-markup margins.', iconName: 'DollarSign', category: 'calculator' },
  { id: 'probability-calc', name: 'Probability Calculator', description: 'Compute compound occurrence structures, independent factor intersections or mutually exclusive ranges.', iconName: 'Dices', category: 'calculator' },
  { id: 'paypal-calc', name: 'PayPal Fee Calculator', description: 'Calculate precise invoicing requirements and disbursed funds ratios based on merchant fees.', iconName: 'CreditCard', category: 'calculator' },
  { id: 'discount-calc', name: 'Discount Calculator', description: 'Determine final retail prices, flat percentage markdowns, total savings, and post-coupon regional taxes.', iconName: 'Tag', category: 'calculator' },
  { id: 'cpm-calc', name: 'CPM Calculator', description: 'Analyze Cost Per Mille metrics, configure ad budget, or calculate target campaign impressions.', iconName: 'TrendingUp', category: 'calculator' },
  { id: 'loan-calc', name: 'Loan Calculator', description: 'Construct detailed loan amortization schedules, calculating monthly installments and total interest margins.', iconName: 'Home', category: 'calculator' },
  { id: 'gst-calc', name: 'GST Calculator', description: 'Compute net Goods & Services Tax additions or subtractions with structured tax rate reports.', iconName: 'Coins', category: 'calculator' },
  { id: 'days-calc', name: 'Days Calculator', description: 'Resolve exact distance between dates, or offset calendar periods by fixed days count with business days logic.', iconName: 'CalendarDays', category: 'calculator' },
  { id: 'hours-calc', name: 'Hours Calculator', description: 'Aggregate clock timings, calculate decimal hours, and process net minutes or timesheet slots.', iconName: 'Clock', category: 'calculator' },
  { id: 'month-calc', name: 'Month Calculator', description: 'Find months gaps, or build forward/backwards milestone targets by calendar-month bounds.', iconName: 'CalendarRange', category: 'calculator' },
  { id: 'stripe-calc', name: 'Stripe Fee Calculator', description: 'Formulate credit card transaction rates, payouts, and necessary invoicing volumes for Stripe.', iconName: 'Wallet', category: 'calculator' },
  { id: 'calorie-calc', name: 'Calorie Calculator', description: 'Resolve resting basal metabolic rate (BMR) energy scales using recognized physiology metric indices.', iconName: 'Flame', category: 'calculator' },
  { id: 'tdee-calc', name: 'TDEE Calculator', description: 'Calculate Total Daily Energy Expenditure coefficients based on target fitness goals and activity levels.', iconName: 'Activity', category: 'calculator' },

  // Newly requested tools
  { id: 'md5-gen', name: 'MD5 Generator', description: 'Generate standard 128-bit MD5 signature digests directly inside your browser.', iconName: 'Lock', category: 'development' },
  { id: 'what-is-my-ip', name: 'What Is My IP', description: 'Detailed remote connection diagnostics showing IP version, client proxy, origin, and headers.', iconName: 'Wifi', category: 'network' },
  { id: 'ip-lookup', name: 'IP Address Lookup', description: 'Resolve geographic info (Country, City, ISP, Coordinates) from any IPv4 or IPv6 target.', iconName: 'Globe', category: 'network' },
  { id: 'base64-decode', name: 'Base64 Decode', description: 'Translate base64 format strings back into human-readable plain text safely.', iconName: 'Unlock', category: 'development' },
  { id: 'base64-encode', name: 'Base64 Encode', description: 'Encode standard text content to base64 format representation safely.', iconName: 'Lock', category: 'development' },
  { id: 'color-converter', name: 'Color Converter', description: 'Convert color values between HEX, RGB, HSL, and CMYK schemas with contrast checker.', iconName: 'Palette', category: 'utility' },
  { id: 'vtt-to-srt', name: 'VTT to SRT Converter', description: 'Normalize WebVTT captions into matching SubRip (SRT) format playback sequences.', iconName: 'FileText', category: 'utility' },
  { id: 'srt-to-vtt', name: 'SRT to VTT Converter', description: 'Add standard WebVTT signatures and convert timings to conform to browser players.', iconName: 'FileCode', category: 'utility' },
  { id: 'youtube-thumbnail', name: 'YouTube Thumbnail Downloader', description: 'Extract high-fidelity maximum resolution and standard thumbnails from any YouTube video.', iconName: 'Youtube', category: 'utility' },
  { id: 'hex-to-rgb', name: 'HEX to RGB Converter', description: 'Convert hex color hashes directly back into light-emitting RGB integer formats.', iconName: 'Hash', category: 'utility' },
  { id: 'rgb-to-hex', name: 'RGB to HEX Converter', description: 'Reconstruct standard hexadecimal hash colors from distinct component light values.', iconName: 'Sliders', category: 'utility' },

  // Unit Converter Tools Addition
  { id: 'reactive-energy-conv', name: 'Reactive Energy Converter', description: 'Convert circuit inductive and capacitive reactive energy values.', iconName: 'Activity', category: 'utility' },
  { id: 'vol-flow-conv', name: 'Volumetric Flow Rate Converter', description: 'Convert fluid, liquid, and gas volume transfer rates precisely.', iconName: 'Wind', category: 'utility' },
  { id: 'illuminance-conv', name: 'Illuminance Converter', description: 'Convert incident luminous flux per unit area across scientific scales.', iconName: 'Sun', category: 'utility' },
  { id: 'frequency-conv', name: 'Frequency Converter', description: 'Convert wave cycle rates, radio frequencies, and processor clocks safely.', iconName: 'Radio', category: 'utility' },
  { id: 'angle-conv', name: 'Angle Converter', description: 'Convert geometric, trigonometric, and rotational angular values.', iconName: 'Compass', category: 'utility' },
  { id: 'currency-conv', name: 'Currency Converter', description: 'Convert standard global currency exchanges with live bank forex updates.', iconName: 'Coins', category: 'utility' },
  { id: 'num-to-word-conv', name: 'Number to Word Converter', description: 'Translate base-10 digits and decimals into spoken English written text.', iconName: 'Languages', category: 'utility' },
  { id: 'word-to-num-conv', name: 'Word to Number Converter', description: 'Reconstruct high-precision numbers back from spelled-out English text.', iconName: 'Languages', category: 'utility' },
  { id: 'torque-conv', name: 'Torque Converter', description: 'Convert automotive engine twisting moment and rotational forces.', iconName: 'Wrench', category: 'utility' },
  { id: 'charge-conv', name: 'Charge Converter', description: 'Convert standard electric charge amounts across scientific metrics.', iconName: 'Zap', category: 'utility' },
  { id: 'num-to-roman-conv', name: 'Number to Roman Numerals', description: 'Translate modern Hindu-Arabic numbers into classic Latin Roman letters.', iconName: 'Bookmark', category: 'utility' },
  { id: 'roman-to-num-conv', name: 'Roman Numerals to Number', description: 'Convert Roman numeral letter sequences back into standard positive integers.', iconName: 'Bookmark', category: 'utility' },

  // Advanced Developer Utilities
  { id: 'json-diff', name: 'JSON Diff Checker', description: 'Compare two JSON objects side-by-side with colorized differences showing additions, deletions, and modifications.', iconName: 'GitCompare', category: 'development' },
  { id: 'jwt-debugger', name: 'JWT Debugger', description: 'Decode JSON Web Tokens (JWT) client-side to inspect Header, Payload, and verify signature details.', iconName: 'KeyRound', category: 'development' },
  { id: 'regex-tester', name: 'RegEx Tester', description: 'Build and execute regular expressions with real-time colorful highlighting of matched groups and text.', iconName: 'Search', category: 'development' },
  { id: 'cron-generator', name: 'Cron Schedule Generator', description: 'Generate and parse crontab expressions into human-readable descriptions and calculate upcoming execution times.', iconName: 'Clock', category: 'development' },

  // Design & Frontend Styling Tools
  { id: 'css-gradient', name: 'CSS Gradient Generator', description: 'Design multi-stop CSS gradients with a visual controller, set angles, select colors, and copy compliant CSS.', iconName: 'Sliders', category: 'utility' },
  { id: 'color-palette', name: 'Color Palette Creator', description: 'Generate complementary, analogous, split-complementary, triadic, and monochromatic harmonic palettes with one-click hex copies.', iconName: 'Palette', category: 'utility' },
  { id: 'svg-optimizer', name: 'SVG Optimizer & Minifier', description: 'Compress inline SVG markup by stripping redundant namespaces, editor definitions, metadata, and custom layout tags.', iconName: 'Activity', category: 'utility' },
  { id: 'svg-path-editor', name: 'SVG Path Visualizer & Editor', description: 'Visualize and fine-tune SVG path coordinates with Bezier handles, node highlights, and direct coordinates tuning.', iconName: 'Sliders', category: 'utility' },

  // SEO & Web Management Utilities
  { id: 'social-meta-preview', name: 'Social & Meta Tags Generator', description: 'Generate standard SEO meta tags and visually preview social platform listings for Google search, Facebook, LinkedIn, and X.', iconName: 'Eye', category: 'web-mgmt' },
  { id: 'redirect-header-inspect', name: 'Redirect & Security Header Inspector', description: 'Trace request routes server-side, map out redirectional paths, SSL parameters, and inspect key security headers.', iconName: 'Network', category: 'web-mgmt' },
  { id: 'dns-mx-txt', name: 'DNS MX & TXT Lookup', description: 'Directly extract custom domain verification strings, SPF policy entries, mail configuration files, and MX endpoints.', iconName: 'Globe', category: 'web-mgmt' }
];

const CATEGORIES = [
  { id: 'all', name: 'All Tools', color: 'bg-indigo-950/20 border border-indigo-500/20 text-indigo-400 font-mono' },
  { id: 'web-mgmt', name: 'Website Management', color: 'bg-cyan-950/20 border border-cyan-500/20 text-cyan-400 font-mono' },
  { id: 'development', name: 'Dev Tools', color: 'bg-blue-950/25 border border-blue-500/20 text-blue-400 font-mono' },
  { id: 'binary', name: 'Binary Converter Tools', color: 'bg-teal-950/25 border border-teal-500/20 text-teal-400 font-mono' },
  { id: 'image', name: 'Image Tools', color: 'bg-rose-950/20 border border-rose-500/20 text-rose-400' },
  { id: 'text', name: 'Text Analytics', color: 'bg-fuchsia-950/20 border border-fuchsia-500/20 text-fuchsia-400' },
  { id: 'network', name: 'Network Utilities', color: 'bg-emerald-950/20 border border-emerald-500/20 text-emerald-400' },
  { id: 'calculator', name: 'Calculators Zone', color: 'bg-amber-950/20 border border-amber-500/20 text-amber-400' },
  { id: 'utility', name: 'General Utilities', color: 'bg-sky-950/20 border border-sky-500/20 text-sky-400' }
];

const CATEGORY_COLOR_MAP: Record<string, {
  colorName: string;
  bg: string;
  hoverBg: string;
  shadowColor: string;
  textAccent: string;
  textAccentHover: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  focusRing: string;
  activeBtn: string;
  cardHoverBorder: string;
  cardHoverShadow: string;
  iconBg: string;
  iconText: string;
  iconHoverBg: string;
  titleTextHover: string;
  sparkleText: string;
  checkText: string;
  pulseBg: string;
  gradient: string;
}> = {
  'all': {
    colorName: 'indigo',
    bg: 'bg-indigo-600',
    hoverBg: 'hover:bg-indigo-700',
    shadowColor: 'shadow-indigo-505/10',
    textAccent: 'text-indigo-500',
    textAccentHover: 'hover:text-indigo-550',
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-400',
    badgeBorder: 'border-indigo-500/15',
    focusRing: 'focus:border-indigo-500 focus:ring-indigo-505/50',
    activeBtn: 'bg-indigo-600 text-white border-indigo-500',
    cardHoverBorder: 'hover:border-indigo-500/30',
    cardHoverShadow: 'hover:shadow-indigo-500/[0.02]',
    iconBg: 'bg-indigo-500/5',
    iconText: 'text-indigo-400 group-hover:text-indigo-300',
    iconHoverBg: 'group-hover:bg-indigo-500/10',
    titleTextHover: 'group-hover:text-indigo-400',
    sparkleText: 'text-indigo-400',
    checkText: 'text-indigo-400',
    pulseBg: 'bg-indigo-550',
    gradient: 'from-indigo-500 via-blue-400 to-cyan-500'
  },
  'web-mgmt': {
    colorName: 'cyan',
    bg: 'bg-cyan-600',
    hoverBg: 'hover:bg-cyan-700',
    shadowColor: 'shadow-cyan-505/10',
    textAccent: 'text-cyan-500',
    textAccentHover: 'hover:text-cyan-550',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-400',
    badgeBorder: 'border-cyan-500/15',
    focusRing: 'focus:border-cyan-500 focus:ring-cyan-505/50',
    activeBtn: 'bg-cyan-600 text-white border-cyan-500',
    cardHoverBorder: 'hover:border-cyan-500/30',
    cardHoverShadow: 'hover:shadow-cyan-500/[0.02]',
    iconBg: 'bg-cyan-500/5',
    iconText: 'text-cyan-400 group-hover:text-cyan-300',
    iconHoverBg: 'group-hover:bg-cyan-500/10',
    titleTextHover: 'group-hover:text-cyan-400',
    sparkleText: 'text-cyan-400',
    checkText: 'text-cyan-400',
    pulseBg: 'bg-cyan-550',
    gradient: 'from-cyan-500 via-teal-400 to-blue-500'
  },
  'development': {
    colorName: 'blue',
    bg: 'bg-blue-600',
    hoverBg: 'hover:bg-blue-700',
    shadowColor: 'shadow-blue-505/10',
    textAccent: 'text-blue-500',
    textAccentHover: 'hover:text-blue-550',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-400',
    badgeBorder: 'border-blue-500/15',
    focusRing: 'focus:border-blue-500 focus:ring-blue-505/50',
    activeBtn: 'bg-blue-600 text-white border-blue-500',
    cardHoverBorder: 'hover:border-blue-500/30',
    cardHoverShadow: 'hover:shadow-blue-500/[0.02]',
    iconBg: 'bg-blue-500/5',
    iconText: 'text-blue-400 group-hover:text-blue-300',
    iconHoverBg: 'group-hover:bg-blue-500/10',
    titleTextHover: 'group-hover:text-blue-400',
    sparkleText: 'text-blue-400',
    checkText: 'text-blue-400',
    pulseBg: 'bg-blue-550',
    gradient: 'from-blue-500 via-indigo-400 to-purple-500'
  },
  'binary': {
    colorName: 'teal',
    bg: 'bg-teal-600',
    hoverBg: 'hover:bg-teal-700',
    shadowColor: 'shadow-teal-505/10',
    textAccent: 'text-teal-500',
    textAccentHover: 'hover:text-teal-550',
    badgeBg: 'bg-teal-500/10',
    badgeText: 'text-teal-400',
    badgeBorder: 'border-teal-500/15',
    focusRing: 'focus:border-teal-500 focus:ring-teal-505/50',
    activeBtn: 'bg-teal-600 text-white border-teal-500',
    cardHoverBorder: 'hover:border-teal-500/30',
    cardHoverShadow: 'hover:shadow-teal-500/[0.02]',
    iconBg: 'bg-teal-500/5',
    iconText: 'text-teal-400 group-hover:text-teal-300',
    iconHoverBg: 'group-hover:bg-teal-500/10',
    titleTextHover: 'group-hover:text-teal-400',
    sparkleText: 'text-teal-400',
    checkText: 'text-teal-400',
    pulseBg: 'bg-teal-550',
    gradient: 'from-teal-500 via-emerald-400 to-cyan-500'
  },
  'image': {
    colorName: 'rose',
    bg: 'bg-rose-600',
    hoverBg: 'hover:bg-rose-700',
    shadowColor: 'shadow-rose-505/10',
    textAccent: 'text-rose-500',
    textAccentHover: 'hover:text-rose-550',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-400',
    badgeBorder: 'border-rose-500/15',
    focusRing: 'focus:border-rose-500 focus:ring-rose-505/50',
    activeBtn: 'bg-rose-600 text-white border-rose-500',
    cardHoverBorder: 'hover:border-rose-500/30',
    cardHoverShadow: 'hover:shadow-rose-500/[0.02]',
    iconBg: 'bg-rose-500/5',
    iconText: 'text-rose-400 group-hover:text-rose-305',
    iconHoverBg: 'group-hover:bg-rose-500/10',
    titleTextHover: 'group-hover:text-rose-400',
    sparkleText: 'text-rose-400',
    checkText: 'text-rose-400',
    pulseBg: 'bg-rose-550',
    gradient: 'from-rose-500 via-pink-400 to-orange-500'
  },
  'text': {
    colorName: 'fuchsia',
    bg: 'bg-fuchsia-600',
    hoverBg: 'hover:bg-fuchsia-700',
    shadowColor: 'shadow-fuchsia-505/10',
    textAccent: 'text-fuchsia-500',
    textAccentHover: 'hover:text-fuchsia-550',
    badgeBg: 'bg-fuchsia-500/10',
    badgeText: 'text-fuchsia-400',
    badgeBorder: 'border-fuchsia-500/15',
    focusRing: 'focus:border-fuchsia-500 focus:ring-fuchsia-505/50',
    activeBtn: 'bg-fuchsia-600 text-white border-fuchsia-500',
    cardHoverBorder: 'hover:border-fuchsia-500/30',
    cardHoverShadow: 'hover:shadow-fuchsia-500/[0.02]',
    iconBg: 'bg-fuchsia-500/5',
    iconText: 'text-fuchsia-400 group-hover:text-fuchsia-305',
    iconHoverBg: 'group-hover:bg-fuchsia-500/10',
    titleTextHover: 'group-hover:text-fuchsia-400',
    sparkleText: 'text-fuchsia-400',
    checkText: 'text-fuchsia-400',
    pulseBg: 'bg-fuchsia-550',
    gradient: 'from-fuchsia-500 via-purple-400 to-indigo-500'
  },
  'network': {
    colorName: 'emerald',
    bg: 'bg-emerald-600',
    hoverBg: 'hover:bg-emerald-700',
    shadowColor: 'shadow-emerald-505/10',
    textAccent: 'text-emerald-500',
    textAccentHover: 'hover:text-emerald-550',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/15',
    focusRing: 'focus:border-emerald-500 focus:ring-emerald-505/50',
    activeBtn: 'bg-emerald-600 text-white border-emerald-500',
    cardHoverBorder: 'hover:border-emerald-500/30',
    cardHoverShadow: 'hover:shadow-emerald-500/[0.02]',
    iconBg: 'bg-emerald-500/5',
    iconText: 'text-emerald-400 group-hover:text-emerald-305',
    iconHoverBg: 'group-hover:bg-emerald-500/10',
    titleTextHover: 'group-hover:text-emerald-400',
    sparkleText: 'text-emerald-400',
    checkText: 'text-emerald-400',
    pulseBg: 'bg-emerald-550',
    gradient: 'from-emerald-500 via-teal-400 to-cyan-500'
  },
  'calculator': {
    colorName: 'amber',
    bg: 'bg-amber-600',
    hoverBg: 'hover:bg-amber-700',
    shadowColor: 'shadow-amber-505/10',
    textAccent: 'text-amber-500',
    textAccentHover: 'hover:text-amber-550',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-500/15',
    focusRing: 'focus:border-amber-500 focus:ring-amber-505/50',
    activeBtn: 'bg-amber-600 text-white border-amber-500',
    cardHoverBorder: 'hover:border-amber-500/30',
    cardHoverShadow: 'hover:shadow-amber-500/[0.02]',
    iconBg: 'bg-amber-500/5',
    iconText: 'text-amber-400 group-hover:text-amber-305',
    iconHoverBg: 'group-hover:bg-amber-500/10',
    titleTextHover: 'group-hover:text-amber-400',
    sparkleText: 'text-amber-400',
    checkText: 'text-amber-400',
    pulseBg: 'bg-amber-550',
    gradient: 'from-amber-500 via-orange-400 to-yellow-500'
  },
  'utility': {
    colorName: 'sky',
    bg: 'bg-sky-600',
    hoverBg: 'hover:bg-sky-700',
    shadowColor: 'shadow-sky-505/10',
    textAccent: 'text-sky-500',
    textAccentHover: 'hover:text-sky-550',
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-400',
    badgeBorder: 'border-sky-500/15',
    focusRing: 'focus:border-sky-500 focus:ring-sky-505/50',
    activeBtn: 'bg-sky-600 text-white border-sky-500',
    cardHoverBorder: 'hover:border-sky-500/30',
    cardHoverShadow: 'hover:shadow-sky-500/[0.02]',
    iconBg: 'bg-sky-500/5',
    iconText: 'text-sky-400 group-hover:text-sky-305',
    iconHoverBg: 'group-hover:bg-sky-500/10',
    titleTextHover: 'group-hover:text-sky-400',
    sparkleText: 'text-sky-400',
    checkText: 'text-sky-400',
    pulseBg: 'bg-sky-550',
    gradient: 'from-sky-500 via-cyan-400 to-blue-500'
  }
};

const TOOL_DETAILS_MAP: Record<string, {
  tagline: string;
  features: string[];
  safeStatus: 'Local Browser' | 'Secure API';
  inputType: string;
}> = {
  'json-formatter': {
    tagline: 'Format, align, block-validate, and inspect structure description list.',
    features: ['Real-time Syntax Validations', 'Indentation Customization', 'Collapsible Key Inspector'],
    safeStatus: 'Local Browser',
    inputType: 'Raw Text / JSON string'
  },
  'base64': {
    tagline: 'Standard RFC-4648 compliance encoder/decoder process.',
    features: ['URL-safe Mode Support', 'UTF-8 Character Support', 'Instant Clipboard Copy'],
    safeStatus: 'Local Browser',
    inputType: 'Alphanumeric / Bytes'
  },
  'html-url': {
    tagline: 'Direct string URL component compiler & HTML tag decoder utility.',
    features: ['Full Percent-encoding', 'Special Character Escaping', 'HTML Entity Standard Lookup'],
    safeStatus: 'Local Browser',
    inputType: 'Raw Web Strings'
  },
  'hash-gen': {
    tagline: 'Cryptographic non-reversible browser hashes calculation.',
    features: ['SHA-1, SHA-256, SHA-512 options', 'Zero data leaves your device', 'Lowercase/Uppercase Hash toggle'],
    safeStatus: 'Local Browser',
    inputType: 'Key Phrase / Binary Data'
  },
  'html-decode': {
    tagline: 'Decode HTML entities back to readable tags or characters offline.',
    features: ['Handles named, hex, and decimal entities', 'Secure client-side processing', 'Support for nested tags structures'],
    safeStatus: 'Local Browser',
    inputType: 'Encoded HTML Text'
  },
  'html-encode': {
    tagline: 'Convert special text markers to safe equivalent HTML entities.',
    features: ['Protects layouts against rendering glitches', 'Avoids markup validation breaches', 'Encodes multi-byte or non-ASCII characters'],
    safeStatus: 'Local Browser',
    inputType: 'HTML Syntax / Text'
  },
  'url-decode': {
    tagline: 'Translate percent-encoded strings back to standard URL links.',
    features: ['Converts code blocks and query parameters', 'Replaces plus marks with spacing tags', 'Graceful recovery under syntax problems'],
    safeStatus: 'Local Browser',
    inputType: 'Percent-Encoded String'
  },
  'url-encode': {
    tagline: 'Convert URL links into safe browser-routable percent representations.',
    features: ['Encodes complex queries and parameters safely', 'Optional spacing plus-notation translation', 'RFC-3986 standard compliant conversion'],
    safeStatus: 'Local Browser',
    inputType: 'Clean URL / String'
  },
  'html-beautifier': {
    tagline: 'Clean up nested tags, wrap text components, and fix messy HTML structures.',
    features: ['Maintains structural indentation hierarchies', 'Saves space-tabs config options', 'Formats text nodes nicely in-line'],
    safeStatus: 'Local Browser',
    inputType: 'Messy HTML templates'
  },
  'html-minifier': {
    tagline: 'Compress index files by removing redundant spacing or annotations.',
    features: ['Optional document comment stripping', 'Compresses multiline layouts instantly', 'Improves transfer and processing times'],
    safeStatus: 'Local Browser',
    inputType: 'HTML code'
  },
  'css-beautifier': {
    tagline: 'Format styling rules, align declaration brackets, and standardize spacing.',
    features: ['Establishes clean selector groups spacing', 'Injects configurable indentation steps', 'Bridges split lines perfectly'],
    safeStatus: 'Local Browser',
    inputType: 'Raw CSS code'
  },
  'css-minifier': {
    tagline: 'Minify CSS files to reduce bandwidth consumption.',
    features: ['Drops stylesheet documentation comments', 'Strips redundant trailing semicolons', 'Removes space near bracket markers'],
    safeStatus: 'Local Browser',
    inputType: 'Stylesheets'
  },
  'js-beautifier': {
    tagline: 'Format JavaScript statements and standard code outlines nicely.',
    features: ['Indentation rules customizations', 'Structural brace-block formatting', 'Tidy comma-spacing properties'],
    safeStatus: 'Local Browser',
    inputType: 'Dealigned Javascript script'
  },
  'js-minifier': {
    tagline: 'Compress scripts by trimming comments and multiple spacer elements.',
    features: ['Instant code weight optimization', 'Optional code comment preservation', 'Collapses multiline expressions'],
    safeStatus: 'Local Browser',
    inputType: 'Standard JavaScript text'
  },
  'js-obfuscator': {
    tagline: 'Encrypt literal values and string items to protect your front-end scripts.',
    features: ['Hex representation conversion', 'Optional Base64 evaluation packing', 'Encodes core constants client-side'],
    safeStatus: 'Local Browser',
    inputType: 'Vanilla JavaScript code'
  },
  'js-deobfuscator': {
    tagline: 'Analyze packed eval loops and hex string values back to readable scripts.',
    features: ['Hex-array byte decryptor', 'Unpacker for legendary Eval packing routines', 'Auto-beautifies restructured fragments'],
    safeStatus: 'Local Browser',
    inputType: 'Obfuscated / Packed code'
  },
  'qr-generator': {
    tagline: 'Make high-quality custom color QR codes offline instantly.',
    features: ['Responsive custom color controls', 'Multiple error correction tiers support', 'High resolution downloading files (PNG/SVG)'],
    safeStatus: 'Local Browser',
    inputType: 'URL / Plain text content'
  },
  'qr-decoder': {
    tagline: 'Read encoded data payloads out of uploaded QR images entirely local-browser.',
    features: ['Support for multiple image formats upload', 'Instant fallback inversion scans', 'Active URL discovery & navigation helpers'],
    safeStatus: 'Local Browser',
    inputType: 'QR Code picture files'
  },
  'facebook-id': {
    tagline: 'Discover classic numeric Facebook user page and discussion group identifiers.',
    features: ['Numeric identifier direct URL segment scanning', 'Guides about finding custom vanity page IDs', 'One-click copy tools'],
    safeStatus: 'Local Browser',
    inputType: 'Facebook profile link address'
  },
  'uuid-gen': {
    tagline: 'Produce version-4 (Random) and version-1 (Time-based/Clock) hash tokens.',
    features: ['Bulk generations (up to 100 values)', 'Lowercase / Uppercase letter toggle option', 'Custom wrapping styles (Braces / Quotes)'],
    safeStatus: 'Local Browser',
    inputType: 'Adjustment specifications'
  },
  'url-parser': {
    tagline: 'Extract port numbers, protocol layers, query parameters, and paths.',
    features: ['Full domain credential details visibility', 'Interactive grid mapping search params', 'One-click selection copy functions'],
    safeStatus: 'Local Browser',
    inputType: 'Assembled web address hyperlink'
  },
  'utm-builder': {
    tagline: 'Format Google Analytics campaign parameters into destination addresses.',
    features: ['Campaign metadata tags setup help', 'Automated quick-tag suggestion buttons', 'Copy complete compiled URL instantly'],
    safeStatus: 'Local Browser',
    inputType: 'Destination URL and parameters'
  },
  'case-converter': {
    tagline: 'Instant capitalization converter of standard strings.',
    features: ['camelCase, snake_case, PascalCase, UPPER/lower', 'Word character integrity preserves', 'Quick one-click translation'],
    safeStatus: 'Local Browser',
    inputType: 'Standard String phrases'
  },
  'word-counter': {
    tagline: 'Exhaustive textual stats metrics compilations.',
    features: ['Word, syllable, and char count estimation', 'Total read-time metric calculator', 'Empty spaces and tab counts'],
    safeStatus: 'Local Browser',
    inputType: 'Paragraphs / Articles'
  },
  'markdown-preview': {
    tagline: 'Interactive Markdown representation previewer.',
    features: ['Full CommonMark specification support', 'Instant synchronized live preview scrolling', 'Styled typography stylesheet built-in'],
    safeStatus: 'Local Browser',
    inputType: 'Markdown markup'
  },
  'text-to-slug': {
    tagline: 'Convert normal text into SEO slugs on-the-fly.',
    features: ['Custom separators (dashes, underscores)', 'Lowercase / uppercase toggling', 'URL-safe character filtering'],
    safeStatus: 'Local Browser',
    inputType: 'Raw alphanumeric strings'
  },
  'lorem-ipsum': {
    tagline: 'Draft structured mock design placeholders instantly.',
    features: ['Generates paragraphs, sentences, or words', 'Customize counting variables', 'Option to start with classic preamble'],
    safeStatus: 'Local Browser',
    inputType: 'Custom parameters selection'
  },
  'remove-line-breaks': {
    tagline: 'Clean pdf lines clippings and convert to flat text.',
    features: ['Replace breaks with spaces or custom chars', 'Strip line boundaries dynamically', 'Removes double spacing automatically'],
    safeStatus: 'Local Browser',
    inputType: 'Multi-line Paragraphs'
  },
  'random-word': {
    tagline: 'Generate random words for naming or brainstorming.',
    features: ['Filter by nouns, adjectives, or verbs', 'Limit characters min / max ranges', 'Export as lines, custom separator or CSV'],
    safeStatus: 'Local Browser',
    inputType: 'Custom parameters selection'
  },
  'privacy-policy': {
    tagline: 'Create custom GDPR and compliance drafts offline.',
    features: ['Tailored to website analytics & cookies', 'GDPR / CCPA standard clauses included', 'Interactive drafting wizard layout'],
    safeStatus: 'Local Browser',
    inputType: 'Form details'
  },
  'terms-conditions': {
    tagline: 'Custom Terms of Service legal compiler layout.',
    features: ['Add copyright & intellectual property rules', 'Identify governing law parameters', 'On-device client-private generation'],
    safeStatus: 'Local Browser',
    inputType: 'Form details'
  },
  'disclaimer-gen': {
    tagline: 'Build liability protection papers automatically.',
    features: ['Standard professional advice disclaimers', 'Good faith and limitation provisions', 'Export markdown output or plain text'],
    safeStatus: 'Local Browser',
    inputType: 'Form details'
  },
  'text-repeater': {
    tagline: 'Loop words or strings to bulk repeated files.',
    features: ['Custom delimiter separations', 'High-performance loops processing', 'Counts character weights of compiled stream'],
    safeStatus: 'Local Browser',
    inputType: 'String phrases'
  },
  'text-sorter': {
    tagline: 'Reorder massive lists of values step-by-step.',
    features: ['Sort alphabetically or by word bounds', 'Reverse and shuffle list selections', 'Trim row boundaries and eliminate voids'],
    safeStatus: 'Local Browser',
    inputType: 'List lines blocks'
  },
  'comma-separator': {
    tagline: 'Morph back and forth columns and spreadsheet lists.',
    features: ['Convert columns to horizontal comma rows', 'Re-convert CSV entries into single lines', 'Clean white spacing and quotes bounds'],
    safeStatus: 'Local Browser',
    inputType: 'Tabbed values / CSV string'
  },
  'my-ip': {
    tagline: 'Dynamic fetch verification of client handshakes.',
    features: ['Finds public outgoing IP parameters', 'Details headers sent directly by user', 'User-Agent browser string examiner'],
    safeStatus: 'Secure API',
    inputType: 'Network handshake'
  },
  'dns-lookup': {
    tagline: 'Full DNS registry records nameservers resolver.',
    features: ['Resolves A, AAAA, MX, NS configuration', 'Returns TTL times and record density', 'Validates public server nameservers'],
    safeStatus: 'Secure API',
    inputType: 'Domain (e.g., google.com)'
  },
  'png-to-jpg': {
    tagline: 'Browser-driven quick image compilation layout.',
    features: ['Interactive quality factor slider', 'Zero network transfers (privacy safe)', 'Local Download of target images'],
    safeStatus: 'Local Browser',
    inputType: 'PNG image file (.png)'
  },
  'pass-gen': {
    tagline: 'High-entropy random cryptographic passwords generator.',
    features: ['Configurable length and word options', 'Enforces symbol, case, and digit rules', 'Calculates bit entropy standard score'],
    safeStatus: 'Local Browser',
    inputType: 'Custom parameters selection'
  },
  'unit-conv': {
    tagline: 'Computer data sizing, scale measurements & temp factors.',
    features: ['Bytes/KB/MB/GB/TB conversions', 'Celcius vs Fahrenheit scales', 'Metric/Imperial basic scale factors'],
    safeStatus: 'Local Browser',
    inputType: 'Numeric quantities selection'
  },
  'age-calc': {
    tagline: 'Detailed astrological & milestones life duration compiler.',
    features: ['Calculates exact years, hours & seconds lived', 'Western Zodiac star sign descriptor', 'Next upcoming milestone countdown'],
    safeStatus: 'Local Browser',
    inputType: 'Specific birth dates'
  },
  'percentage-calc': {
    tagline: 'Standard percentage, ratios, and differential incremental solver.',
    features: ['Evaluates fractional value weights', 'Finds comparative percentage change ratios', 'Computes addition or subtraction percentage offsets'],
    safeStatus: 'Local Browser',
    inputType: 'Decimal and fractional parameters'
  },
  'average-calc': {
    tagline: 'Resolve statistical averages, standard deviation, and sample variances.',
    features: ['Mean, Median, and Mode detection', 'Sample variance and standard deviation', 'Ascending sort outputs distribution maps'],
    safeStatus: 'Local Browser',
    inputType: 'Comma or space separated numbers list'
  },
  'confidence-interval-calc': {
    tagline: 'Establish true population margins based on sampling densities.',
    features: ['Adjustable confidence levels (90%, 95%, 99%)', 'Margin of error and upper/lower bounds', 'Plain English interpretation reports'],
    safeStatus: 'Local Browser',
    inputType: 'Sample mean, size, and standard deviation'
  },
  'sales-tax-calc': {
    tagline: 'Calculate final prices after markdown reductions and sales taxes.',
    features: ['Adjustable discount/markdown percentages', 'Applies regional, state, or state-tax tariffs', 'Generates clean ledger purchase receipt lists'],
    safeStatus: 'Local Browser',
    inputType: 'Base price, tax rate, and optional discount percent'
  },
  'margin-calc': {
    tagline: 'Solve gross booking profit margins, markups and required sale quotes.',
    features: ['Mode selection: set revenue or target profit margin', 'Calculates exact profit values and bookkeeping markups', 'Delivers clear per-item margin percentage summaries'],
    safeStatus: 'Local Browser',
    inputType: 'Cost, revenue or margin coefficients'
  },
  'probability-calc': {
    tagline: 'Analyze intersection event arrays, independent, and exclusion bounds.',
    features: ['Inverse occurrence probability P(Not A) formulas', 'Intersection independent state calculations (A AND B)', 'Union probability outcomes (A OR B)'],
    safeStatus: 'Local Browser',
    inputType: 'Event P(A) and P(B) percentages coefficients'
  },
  'paypal-calc': {
    tagline: 'Formulate Paypal merchant deductions, invoicing targets and final proceeds.',
    features: ['Invoices gross asking values to guarantee exact payouts', 'Calculates sending deductions for domestic and global commerce', 'Supports custom rate factors and fixed flat fees'],
    safeStatus: 'Local Browser',
    inputType: 'Target money totals with optional fee rates input'
  },
  'discount-calc': {
    tagline: 'Calculate net purchase totals after sales discounts and tax rates.',
    features: ['Instant visualization of dollar savings', 'Applies double or stackable tiered discounts', 'Adjustable post-discount regional tax percentage'],
    safeStatus: 'Local Browser',
    inputType: 'Base cost, markdown percentages, and optional local tax rate'
  },
  'cpm-calc': {
    tagline: 'Establish ad-campaign cost bounds, mill impressions, or net budgets.',
    features: ['Solve for key missing metrics automatically (CPM, Impressions, or Cost)', 'Computes theoretical cost per individual click (CPC)', 'Identifies efficiency profiles for media buy assessments'],
    safeStatus: 'Local Browser',
    inputType: 'Ad cost, CPM rate, or overall target impressions'
  },
  'loan-calc': {
    tagline: 'Generate periodic loan amortization matrices, principal balances and interest.',
    features: ['Calculates exact periodic principal + interest ratios', 'Generates month-by-month billing and balance depreciation schedules', 'Computes lifetime cumulative credit interest fees side-by-side'],
    safeStatus: 'Local Browser',
    inputType: 'Total loan volume, annual percentage rate (APR), and duration time'
  },
  'gst-calc': {
    tagline: 'Compute net Goods and Services Tax added value or tax extraction.',
    features: ['Calculate inclusive or exclusive GST bounds with one click', 'Support standard international profiles (5%, 12%, 18%, 28%)', 'Full ledger split-reports showing base cost and tax totals'],
    safeStatus: 'Local Browser',
    inputType: 'Starting transaction weight with target GST rates'
  },
  'days-calc': {
    tagline: 'Evaluate calendar gaps, business days, and timelines.',
    features: ['Determines gaps in days, standard weeks, or month-sets', 'Offset dates with dynamic forward/backward buffer periods', 'Includes option to isolate or filter pure business workdays'],
    safeStatus: 'Local Browser',
    inputType: 'Timeline benchmarks with day-adjuster multipliers'
  },
  'hours-calc': {
    tagline: 'Aggregate hours/minutes, complete timesheet summaries and translate dec-time.',
    features: ['Chronological summing of custom hours/minutes lists', 'Calculates precise timeline gaps between two times', 'Auto-converts hours and minutes to digital decimal hours'],
    safeStatus: 'Local Browser',
    inputType: 'Time inputs, timesheet cards, or start/end dials'
  },
  'month-calc': {
    tagline: 'Calculate month timeline spans, quarterly divisions and offsets.',
    features: ['Find month-span bounds or include residual days', 'Calculates exact business quarters or calendar-year offsets', 'Computes timeline differences for milestones and recurring cycles'],
    safeStatus: 'Local Browser',
    inputType: 'Specified start/end dates and monthly shifting values'
  },
  'stripe-calc': {
    tagline: 'Calculate credit card merchant processing fees and required invoice amounts for Stripe.',
    features: ['Configured for up-to-date domestic & international Stripe fee scales (e.g. 2.9% + $0.30)', 'Calculates required custom invoicing to secure exact payout targets', 'Detailed margin split charts with net funds visual ledger'],
    safeStatus: 'Local Browser',
    inputType: 'Target transaction amount with regional custom fee input options'
  },
  'calorie-calc': {
    tagline: 'Calculate baseline Basal Metabolic Rate (BMR) and standard calorie limits.',
    features: ['Employs standard Mifflin-St Jeor & Harris-Benedict formulas', 'Computes accurate personal resting cellular energy limits', 'Provides physical macronutrient baseline guidance'],
    safeStatus: 'Local Browser',
    inputType: 'Biological age, gender, height, and weight metrics'
  },
  'tdee-calc': {
    tagline: 'Resolve Total Daily Energy Expenditure coefficients based on real physical activity.',
    features: ['Applies physical activity multipliers to baseline resting metabolic rates', 'Suggests targets for safe weight loss deficits or muscle-building surplus bulks', 'Calculates dynamic calorie distributions adjusted for fitness targets'],
    safeStatus: 'Local Browser',
    inputType: 'BMR rate or physical statistics with exercise profiling parameters'
  },
  'ico-to-png': {
    tagline: 'Transform ICO files into standard PNG images instantly.',
    features: ['Direct client-side extraction', 'No cloud server uploads involved', 'High resolution canvas drawing preview'],
    safeStatus: 'Local Browser',
    inputType: 'ICO file (.ico)'
  },
  'ico-converter': {
    tagline: 'Convert images to ICO files or extract images from ICOs.',
    features: ['PNG/JPG/WebP to multi-size ICO', 'ICO to PNG converter', 'Options for various sizes (16px to 256px)'],
    safeStatus: 'Local Browser',
    inputType: 'Image file or ICO file'
  },
  'image-to-base64': {
    tagline: 'Convert any image format into Base64 code.',
    features: ['Generate clean raw base64 or Data URI format', 'Format outputs for HTML, CSS, or JSON', 'Instant statistics of encoded size'],
    safeStatus: 'Local Browser',
    inputType: 'Image file (.png, .jpg, .webp, .svg, .gif)'
  },
  'base64-to-image': {
    tagline: 'Turn Base64 representation strings back to downloadable image files.',
    features: ['Automatic headers parsing', 'Live file preview pane', 'Local download as PNG or JPG'],
    safeStatus: 'Local Browser',
    inputType: 'Base64 Data URI or raw character string'
  },
  'flip-image': {
    tagline: 'Flip and rotate images with zero quality degradation.',
    features: ['Flip images horizontally or vertically', 'Rotate left, right, or upside down', 'Interactive custom rotation slider'],
    safeStatus: 'Local Browser',
    inputType: 'Image file (.jpg, .png, .webp, etc.)'
  },
  'image-enlarger': {
    tagline: 'Upscale and enlarge images up to 4x using high-fidelity pixel or smooth bilinear scaling.',
    features: ['Nearest neighbor pixel preserving scaling', 'High quality bilinear interpolation', 'Configurable up to 4x multiplier'],
    safeStatus: 'Local Browser',
    inputType: 'Images (.png, .jpg, .webp)'
  },
  'image-cropper': {
    tagline: 'Crop layout structures with custom aspect ratios & precision offsets.',
    features: ['Standard crop preset boxes (1:1, 16:9, etc.)', 'Drag sliders for pixel coordinate overlays', 'On-canvas fast rendering downloads'],
    safeStatus: 'Local Browser',
    inputType: 'Images (.png, .jpg, .webp)'
  },
  'image-resizer': {
    tagline: 'Interactive target dimension resizing with aspect locking options.',
    features: ['Aspect ratio synchronization lock options', 'Quick ratio scale percentage buttons', 'Inflow/Outflow weight size checks'],
    safeStatus: 'Local Browser',
    inputType: 'Images (.png, .jpg, .webp)'
  },
  'image-converter': {
    tagline: 'Batch convert image assets cleanly entirely in-browser.',
    features: ['Supports JPEG, WebP, BMP and PNG exports', 'Optimized compression factors sliders', 'Instant client-private processing'],
    safeStatus: 'Local Browser',
    inputType: 'Images (.png, .jpg, .webp, .bmp)'
  },
  'jpg-to-png': {
    tagline: 'Single-step optimized JPEG to transparent PNG decoder.',
    features: ['Lossless PNG compression format output', 'Removes typical artifact bounds', 'High fidelity color map preservation'],
    safeStatus: 'Local Browser',
    inputType: 'JPG / JPEG pictures'
  },
  'jpg-converter': {
    tagline: 'Translate any web graphics into optimized JPEG/JPG photos.',
    features: ['Configurable background color backfills', 'Direct quality slider multipliers', 'No internet connectivity required'],
    safeStatus: 'Local Browser',
    inputType: 'Images (.png, .webp, .bmp, .gif)'
  },
  'webp-to-jpg': {
    tagline: 'Lossy WebP graphics compilation down to compliant standard JPEGs.',
    features: ['White overlay backfill transparency preserves', 'High accessibility compression sliders', 'Real-time optimized dimension metrics'],
    safeStatus: 'Local Browser',
    inputType: 'WebP graphics (.webp)'
  },
  'png-to-webp': {
    tagline: 'Export high fidelity PNG targets into next-gen optimized WebP assets.',
    features: ['Supports transparent alpha layers', 'Adjustable quality and compression density', 'Sub-millisecond local processing'],
    safeStatus: 'Local Browser',
    inputType: 'Lossless PNG images (.png)'
  },
  'png-to-bmp': {
    tagline: 'Write transparent or solid PNG layouts into high-compatibility BMP bitmaps.',
    features: ['Pixel-perfect 32-bit RGBA channel packing', 'Completely offline desktop bitmap compiler', 'Preserves original sizing and transparency maps'],
    safeStatus: 'Local Browser',
    inputType: 'Lossless PNG images (.png)'
  },
  'png-to-gif': {
    tagline: 'Translate transparent PNG visual layouts into standardized GIF raster files.',
    features: ['Strict alpha matte transparency mapping', 'Immediate client download capabilities', 'No web service or cloud backend involvement'],
    safeStatus: 'Local Browser',
    inputType: 'Lossless PNG images (.png)'
  },
  'png-to-ico': {
    tagline: 'Compile a single standard PNG picture file into multi-resolution standard ICO favicons.',
    features: ['Auto-reprojects into 16, 32, 48, 64, 128, and 256px formats', 'High-quality resampling operations', 'Optimized multi-file directory packaging output'],
    safeStatus: 'Local Browser',
    inputType: 'Lossless PNG images (.png)'
  },
  'jpg-to-webp': {
    tagline: 'Translate bulky JPEG graphics into space-saving, modern WebP elements.',
    features: ['Immensely reduced asset bytes size weight', 'Smooth compression density factor sliders', 'Immediate side-by-side specs metrics feedback'],
    safeStatus: 'Local Browser',
    inputType: 'JPEG / JPG photos (.jpg, .jpeg)'
  },
  'jpg-to-bmp': {
    tagline: 'Convert standard compressed JPEG photographs into uncompressed BMP bitmaps.',
    features: ['Retains precise photographic RGB pixel channels', 'Uncompressed desktop bitmap structure export', 'Works with all standard legacy layout standards'],
    safeStatus: 'Local Browser',
    inputType: 'JPEG / JPG photos (.jpg, .jpeg)'
  },
  'jpg-to-gif': {
    tagline: 'Convert photographic JPEGs down to lightweight single-frame GIF graphic visuals.',
    features: ['High-contrast color compression optimization', 'Lossless index palette mapping support', 'Preserves crisp layouts and sizes'],
    safeStatus: 'Local Browser',
    inputType: 'JPEG / JPG photos (.jpg, .jpeg)'
  },
  'jpg-to-ico': {
    tagline: 'Translate typical JPEG snapshots into standard size-selectable ICO icons.',
    features: ['Provides adjustable icon quality presets', 'Bundles sizes into standard multi-record systems', 'Excellent for building modern client web favicons'],
    safeStatus: 'Local Browser',
    inputType: 'JPEG / JPG photos (.jpg, .jpeg)'
  },
  'webp-to-png': {
    tagline: 'Decode advanced WebP images into highly compatible, lossless PNG images.',
    features: ['Restores complete original transparency buffers', 'Completely lossless, artifact-free conversion', 'No file size limit for offline batch rendering'],
    safeStatus: 'Local Browser',
    inputType: 'WebP graphics (.webp)'
  },
  'length-conv': {
    tagline: 'Convert metric, imperial, and astronomical distances safely.',
    features: ['Instant multi-unit translations coordinate grid', 'Precision-controlled rounding support', 'Supports maritime and nanotechnology micro-measures'],
    safeStatus: 'Local Browser',
    inputType: 'Decimal distance values input'
  },
  'area-conv': {
    tagline: 'Convert surface areas, building layouts, and land densities.',
    features: ['Converts between standard metric, imperial, and acreage metrics', 'Instant live preview table of equivalent values', 'Accurate scientific representation of micro/macro scopes'],
    safeStatus: 'Local Browser',
    inputType: 'Surface area dimensions'
  },
  'weight-conv': {
    tagline: 'Convert mass weights across professional measurement standards.',
    features: ['Supports micrograms up to metric massive tones', 'Provides specialized jewelry carat and historical grain metrics', '100% accurate mathematical gravitational conversions'],
    safeStatus: 'Local Browser',
    inputType: 'Mass weight values'
  },
  'volume-conv': {
    tagline: 'Convert volumes, cooking fluid ounces, and metric cubic spaces.',
    features: ['Detailed US custom cups, pints, quarts and metric sizes', 'Cubic meters conversion metrics for cargo engineering layouts', 'Ideal for chef calculations and scientific labs calculations'],
    safeStatus: 'Local Browser',
    inputType: 'Volume quantities'
  },
  'temp-conv': {
    tagline: 'Convert thermodynamic scales with pristine precision.',
    features: ['Supports Celsius, Fahrenheit, Kelvin, and Rankine scales', 'Precision-calibrated absolute zero floor blocks', 'Highly detailed thermodynamics educational formulas'],
    safeStatus: 'Local Browser',
    inputType: 'Temperature values selection'
  },
  'each-conv': {
    tagline: 'Convert quantity counts between commercial storage standards.',
    features: ['Dozens, scores, and baker dozens conversions', 'Gross (144) and Great Gross (1728) bulk measurements helper', 'Perfect for wholesale supply chains, inventories, and stock checks'],
    safeStatus: 'Local Browser',
    inputType: 'Inventory pieces count values'
  },
  'time-conv': {
    tagline: 'Translate seconds and micro-timings to standard Gregorian years.',
    features: ['Covering nanosecond scientific values up to average calendar years', 'Adjusts precisely for standard Gregorian average year configurations', 'Intuitive unit relationships layouts'],
    safeStatus: 'Local Browser',
    inputType: 'Time duration value'
  },
  'digital-conv': {
    tagline: 'Translate data capacity ratios between base-2 and base-10 indices.',
    features: ['Detailed bits, bytes, kilobytes, and petabytes translations', 'Calculates estimated download durations across diverse speeds', 'Presents clean binary measurements and transmission metrics'],
    safeStatus: 'Local Browser',
    inputType: 'Data file size bytes input'
  },
  'parts-per-conv': {
    tagline: 'Convert parts-per-million, parts-per-billion, and fractions.',
    features: ['Essential science labs compound concentrations helper', 'Outputs clean fractional and percentage values on-the-fly', 'Translates ppb, ppt, and permille standards accurately'],
    safeStatus: 'Local Browser',
    inputType: 'Fractions and concentration metrics'
  },
  'speed-conv': {
    tagline: 'Convert travel velocities across diverse environments.',
    features: ['Translates km/h, mph, and aeronautical knots seamlessly', 'Includes speed of sound (Mach) reference levels', 'Outputs clean feet per second metrics for physics studies'],
    safeStatus: 'Local Browser',
    inputType: 'Velocity speed values'
  },
  'pace-conv': {
    tagline: 'Convert athletic pacing values and predict race runtimes.',
    features: ['Translates min/km, min/mi and seconds-equivalents', 'Calculates equivalent velocities in km/h and mph', 'Outputs marathon, half-marathon, and 5K target pacing forecasts'],
    safeStatus: 'Local Browser',
    inputType: 'Running pace timings'
  },
  'pressure-conv': {
    tagline: 'Convert pressure thresholds between atmospheric and industrial scales.',
    features: ['Pascals, kilopascals, bar, millibar, Torr, and PSI', 'Calculates equivalents to natural sea level atmospheres', 'Pristine accurate scientific conversion multipliers'],
    safeStatus: 'Local Browser',
    inputType: 'Force pressure values'
  },
  'current-conv': {
    tagline: 'Convert electric current units cleanly with high precision math.',
    features: ['Convert between amperes, milliamperes, microamperes, and mega-amperes', 'Integrated physiological safety impact references', 'Real-time multi-unit equivalent cross-conversion tables'],
    safeStatus: 'Local Browser',
    inputType: 'Electric current value'
  },
  'voltage-conv': {
    tagline: 'Translate electrical potential differences across industrial bounds.',
    features: ['Supports Volts, Millivolts, Microvolts, Kilovolts, and Megavolts', 'Interactive physical system reference matches', 'Pristine floating decimal safety calculations'],
    safeStatus: 'Local Browser',
    inputType: 'Electrical potential difference value'
  },
  'power-conv': {
    tagline: 'Convert active energy consumption and electrical power rates.',
    features: ['Translates Watts, Milliwatts, Kilowatts, Megawatts, and Gigawatts', 'Includes Horsepower and heat-emission rates like BTU/h or cal/s', 'Dynamic operational appliance utility bill predictor'],
    safeStatus: 'Local Browser',
    inputType: 'Power consumption/generation rate'
  },
  'reactive-power-conv': {
    tagline: 'Convert AC circuit inductive and capacitive reactive powers.',
    features: ['Supports var, mvar, kvar, and Mvar unit ranges', 'Ideal for engineers analyzing reactive power grid overheads', 'Clean calculations without server-side processing delay'],
    safeStatus: 'Local Browser',
    inputType: 'Reactive power (var) coefficient'
  },
  'apparent-power-conv': {
    tagline: 'Convert AC electrical grid apparent energy boundaries.',
    features: ['Supports VA, mVA, kVA, and MVA metrics', 'Pristine decimal conversions for heavy load systems', 'Complete local offline functionality for field technicians'],
    safeStatus: 'Local Browser',
    inputType: 'Apparent electrical power (VA)'
  },
  'energy-conv': {
    tagline: 'Convert physical work heat capacities and network power durations.',
    features: ['Converts Joules, Kilojoules, Megajoules, and thermal BTUs', 'Includes power duration indicators like Watt-hours and Kilowatt-hours', 'Interactive equivalent consumer electrical monetary rate cost estimator'],
    safeStatus: 'Local Browser',
    inputType: 'Physical active work or heat energy quantity'
  },
  'txt-to-bin': { tagline: 'Encode raw text into binary byte packages.', features: ['Converts Unicode glyphes to space-separated base-2 numbers', 'Dynamic byte size and character count calculation', 'Step-by-step byte map visualizer'], safeStatus: 'Local Browser', inputType: 'Plain text string' },
  'bin-to-txt': { tagline: 'Decode binary byte packages back to readable text.', features: ['Transforms binary 8-bit streams to Unicode text', 'Handles space-separated or raw sequential binary data', 'Instant conversion with decoding error fallbacks'], safeStatus: 'Local Browser', inputType: 'Binary bits stream' },
  'hex-to-bin': { tagline: 'Translate hexadecimal strings directly into binary code.', features: ['Converts base-16 strings to 4-bit dual binary nibbles', 'Pristine formatting supporting blank space separation', 'Detailed digit-by-digit visual breakdown map'], safeStatus: 'Local Browser', inputType: 'Hexadecimal string (Base-16)' },
  'bin-to-hex': { tagline: 'Decompile base-2 binary strings back into Base-16 hexadecimal.', features: ['Sectors binary values into groups of 4-bit nibbles', 'Automatic padding to form complete hexadecimal bytes', 'Slick on-board bit breakdown tracking system'], safeStatus: 'Local Browser', inputType: 'Binary digits sequence (Base-2)' },
  'ascii-to-bin': { tagline: 'Convert ASCII standard values onto binary registries.', features: ['Supports decimal values or raw ASCII character entries', 'Encodes values immediately into stable 8-bit registers', 'Shows mapping to ASCII decimal table indices'], safeStatus: 'Local Browser', inputType: 'ASCII characters or decimal IDs' },
  'bin-to-ascii': { tagline: 'Decomplex binary bits back to ASCII symbols.', features: ['Translates space-separated byte arrays to printable ASCII', 'Displays index metrics for each converted byte', 'Extremely lightweight offline client execution'], safeStatus: 'Local Browser', inputType: 'Binary register array' },
  'dec-to-bin': { tagline: 'Resolve base-10 numerical elements into binary.', features: ['Converts integers and real fractional decimal numbers', 'Showcases continuous division-by-2 remainder tables', 'High precision accuracy for engineering scaling uses'], safeStatus: 'Local Browser', inputType: 'Decimal numbers (Base-10)' },
  'bin-to-dec': { tagline: 'Recompose base-2 binary entries onto standard decimal code.', features: ['Decodes binary streams back to base-10 indices', 'Supports fractional floating-point values converting', 'Shows detailed dual positional power coefficient sums'], safeStatus: 'Local Browser', inputType: 'Binary string sequence' },
  'txt-to-ascii': { tagline: 'Translate text arrays into standard decimal ASCII tables.', features: ['Displays code numbers for each character', 'Aids in programming string buffer debugging', 'Fully customizable with clipboard features'], safeStatus: 'Local Browser', inputType: 'Character string' },
  'ascii-to-txt': { tagline: 'Convert standard decimal ASCII arrays back into printable text.', features: ['Parses list of integers into UTF-8 characters', 'Supports comma or space separated format criteria', 'Excellent for reversing binary and network payloads'], safeStatus: 'Local Browser', inputType: 'Decimal code indexes' },
  'hex-to-dec': { tagline: 'Translate base-16 hexadecimal into base-10 dec.', features: ['Multiplies hex digits by base-16 positional weights', 'Supports massive values without precision clipping', 'Detailed mathematical sum calculations details'], safeStatus: 'Local Browser', inputType: 'Hexadecimal parameters' },
  'dec-to-hex': { tagline: 'Map decimal codes directly to uppercase base-16 numerals.', features: ['Computes division by 16 coefficients with remainders', 'Creates pristine compact hex codes dynamically', 'Useful for color editing, memory pointers, and assembly'], safeStatus: 'Local Browser', inputType: 'Base-10 integer value' },
  'oct-to-bin': { tagline: 'Convert octal base-8 elements to 3-bit binary equivalents.', features: ['Maps each octal digit (0-7) to physical binary registers', 'Shows convenient digit grouping representation', 'Pristine conversion speeds with immediate feedback'], safeStatus: 'Local Browser', inputType: 'Octal digits series' },
  'bin-to-oct': { tagline: 'Re-assemble binary streams onto octal digits series.', features: ['Divides bits into triplet groupings starting from right', 'Instant conversion for computer scientists and students', 'Helpful step-by-step visual parsing summaries'], safeStatus: 'Local Browser', inputType: 'Binary bit grouping' },
  'oct-to-dec': { tagline: 'Convert octal base-8 values into standard decimals.', features: ['Summates base-8 powers to evaluate overall scale', 'Useful for unix file permissions and legacy structures', 'Interactive logic demonstration tables included'], safeStatus: 'Local Browser', inputType: 'Octal string' },
  'dec-to-oct': { tagline: 'Formulate base-10 numerals into octal strings.', features: ['Applies repetitive division-by-8 processes', 'Renders perfect octal characters for engineers', 'Works offline with fully deterministic mathematics'], safeStatus: 'Local Browser', inputType: 'Decimal integer input' },
  'hex-to-oct': { tagline: 'Translate hexadecimal strings directly into base-8 octals.', features: ['Calculates intermediate base-10 indices automatically', 'Perfect for bridging modern systems with heritage computer architecture', 'High fidelity conversion math logs'], safeStatus: 'Local Browser', inputType: 'Hexadecimal characters string' },
  'oct-to-hex': { tagline: 'Convert octal base-8 codes directly to uppercase Hex.', features: ['Determines decimal value intermediate boundaries', 'Compiles compact standard dual-nibble base-16 representations', 'Saves logs offline directly in local browsers safely'], safeStatus: 'Local Browser', inputType: 'Octal parameters string' },
  'txt-to-oct': { tagline: 'Convert text characters into standard 3-digit octals.', features: ['Maps text symbols to standard octal codes', 'Builds space-separated series of bytes', 'Details translation for each individual symbol'], safeStatus: 'Local Browser', inputType: 'Message or string' },
  'oct-to-txt': { tagline: 'Reconstruct octal byte patterns back to text characters.', features: ['Transforms list of octal integers into UTF-8 glyphs', 'Auto-trims spaces or punctuation artifacts', 'Secure local processing keeping input texts fully secure'], safeStatus: 'Local Browser', inputType: 'Octal space-separated strings' },
  'txt-to-hex': { tagline: 'Convert text strings to space-separated hex codes.', features: ['Perfect for binary packet payload mock-testing', 'Decodes character codes to secure 2-digit base-16 outputs', 'Shows explicit character-to-hex reference map'], safeStatus: 'Local Browser', inputType: 'Text messages' },
  'hex-to-txt': { tagline: 'Reassemble space-separated hex codes to readable text sentences.', features: ['Decodes base-16 pairs back to Unicode characters', 'Cleanses prefix indices (e.g. 0x) automatically', 'Provides diagnostic steps showing byte sequences'], safeStatus: 'Local Browser', inputType: 'Hex codes sequence' },
  'txt-to-dec': { tagline: 'Convert text string characters directly into base-10 sequences.', features: ['Calculates byte values matching memory configurations', 'Highlights base-10 translation bounds', 'Clean copy-to-clipboard action'], safeStatus: 'Local Browser', inputType: 'Human text codes string' },
  'dec-to-txt': { tagline: 'Transcribe base-10 decimal index arrays back to plain text.', features: ['Accepts space or comma-separated lists of characters', 'Restores message layouts instantly', 'Excellent for programming data structure analysis'], safeStatus: 'Local Browser', inputType: 'Decimal values list' }
};

export default function App() {
  const { isDark, toggleTheme } = useTheme();

  const t = isDark ? {
    bodyBg: 'bg-[#0a0a0a]',
    bg: 'bg-[#0f0f0f]',
    headerBg: 'bg-[#0f0f0f] border-b border-white/5 shadow-lg shadow-black/20',
    border: 'border-white/5',
    borderStrong: 'border-white/10',
    text: 'text-gray-300',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-400',
    textMuted: 'text-gray-500',
    panelBg: 'bg-[#141414]',
    searchBg: 'bg-[#111111] border-white/10 text-white placeholder:text-gray-650',
    tabInactive: 'bg-white/2 border border-white/5 text-gray-400 hover:text-white hover:bg-white/5',
    cardBg: 'bg-[#0f0f0f]',
    tooltipBg: 'bg-[#121214]',
    tooltipBorder: 'border-white/10',
    tooltipArrow: 'border-t-[#121214]',
    starBg: 'bg-[#141414] border-white/5 text-gray-650 hover:text-gray-450 hover:bg-yellow-500/5',
    footerBg: 'bg-[#080808] border-t border-white/5',
    tagText: 'text-white/10'
  } : {
    bodyBg: 'bg-gray-50',
    bg: 'bg-white',
    headerBg: 'bg-white border-b border-gray-200 shadow-md shadow-gray-100/45',
    border: 'border-gray-200',
    borderStrong: 'border-gray-200',
    text: 'text-gray-600',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-550',
    panelBg: 'bg-gray-100',
    searchBg: 'bg-gray-100 border border-gray-250 text-gray-900 placeholder:text-gray-500',
    tabInactive: 'bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-200',
    cardBg: 'bg-white',
    tooltipBg: 'bg-white',
    tooltipBorder: 'border-gray-200',
    tooltipArrow: 'border-t-white',
    starBg: 'bg-gray-100 border border-gray-200 text-gray-550 hover:text-yellow-650 hover:bg-yellow-500/5 shadow-sm',
    footerBg: 'bg-gray-105 border-t border-gray-200',
    tagText: 'text-gray-500'
  };

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [starred, setStarred] = useState<string[]>([]);
  const [recentTools, setRecentTools] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [hoveredToolId, setHoveredToolId] = useState<string | null>(null);
  const [activeLegalView, setActiveLegalView] = useState<'privacy' | 'terms' | 'about-contact' | 'faq' | 'blog' | null>(null);
  const [blogPostSlug, setBlogPostSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [toolNotFound, setToolNotFound] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [activeTool]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTool || activeLegalView) return;
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTool, activeLegalView]);

  useEffect(() => {
    const handlePrivacyNav = () => {
      selectLegalView('privacy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('navigate-to-privacy', handlePrivacyNav);
    return () => window.removeEventListener('navigate-to-privacy', handlePrivacyNav);
  }, []);

  const selectTool = (tool: Tool | null) => {
    setActiveTool(tool);
    setToolNotFound(false);
    if (tool) {
      setActiveLegalView(null);
      setBlogPostSlug(null);
      window.history.pushState({ toolId: tool.id }, '', `?tool=${tool.id}`);
      setRecentTools(prev => {
        const updated = [tool.id, ...prev.filter(id => id !== tool.id)].slice(0, 5);
        localStorage.setItem('rwt_recent', JSON.stringify(updated));
        return updated;
      });
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const selectLegalView = (view: 'privacy' | 'terms' | 'about-contact' | 'faq' | 'blog' | null) => {
    setActiveLegalView(view);
    if (view) {
      setActiveTool(null);
      if (view !== 'blog') {
        setBlogPostSlug(null);
      }
      window.history.pushState({ page: view }, '', `?page=${view}`);
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const handleOpenTool = (toolId: string) => {
    let actualId = toolId;
    if (toolId === 'base64-encoder') actualId = 'base64';
    if (toolId === 'password-generator') actualId = 'pass-gen';
    if (toolId === 'stripe-fee-calculator') actualId = 'stripe-calc';
    if (toolId === 'paypal-fee-calculator') actualId = 'paypal-calc';
    if (toolId === 'qr-code-generator') actualId = 'qr-generator';

    const matched = ALL_TOOLS.find(t => t.id === actualId);
    if (matched) {
      selectTool(matched);
    }
  };

  // Load Starred and URL parameters on startup, and listen to popstate for history navigation
  useEffect(() => {
    const saved = localStorage.getItem('omnitool_starred');
    if (saved) {
      try {
        setStarred(JSON.parse(saved));
      } catch (e) {
        setStarred([]);
      }
    }

    const savedRecent = localStorage.getItem('rwt_recent');
    if (savedRecent) {
      try {
        setRecentTools(JSON.parse(savedRecent));
      } catch (e) {
        setRecentTools([]);
      }
    }

    const loadFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const targetToolId = params.get('tool');
      const targetPage = params.get('page');

      if (targetToolId) {
        const match = ALL_TOOLS.find(t => t.id === targetToolId);
        if (match) {
          setActiveTool(match);
          setActiveLegalView(null);
          setBlogPostSlug(null);
          setToolNotFound(false);
        } else {
          setActiveTool(null);
          setToolNotFound(true);
        }
      } else if (targetPage && ['privacy', 'terms', 'about-contact', 'faq', 'blog'].includes(targetPage)) {
        setActiveLegalView(targetPage as 'privacy' | 'terms' | 'about-contact' | 'faq' | 'blog');
        if (targetPage === 'blog') {
          setBlogPostSlug(params.get('slug'));
        } else {
          setBlogPostSlug(null);
        }
        setActiveTool(null);
        setToolNotFound(false);
      } else {
        setActiveTool(null);
        setActiveLegalView(null);
        setBlogPostSlug(null);
        setToolNotFound(false);
      }
    };

    loadFromUrl();

    window.addEventListener('popstate', loadFromUrl);
    return () => window.removeEventListener('popstate', loadFromUrl);
  }, []);

  useEffect(() => {
    const siteName = 'Rocket Web Tools';
    
    if (activeTool) {
      const descriptions: Record<string, string> = {
        // JSON Tools
        'json-formatter': 'Free online JSON formatter and validator. Paste your JSON and instantly format, beautify, or minify it in your browser — no upload needed.',
        'json-viewer': 'Visualize JSON as an interactive tree. Collapse, expand, and search nodes instantly in your browser.',
        'json-validator': 'Validate JSON syntax and catch errors instantly. Highlights the exact line of any problem.',
        'json-editor': 'Edit and modify JSON structures directly in your browser with live validation.',
        'json-minifier': 'Minify JSON by removing whitespace to reduce file size instantly in your browser.',
        'json-diff': 'Compare two JSON objects side by side and highlight every difference instantly.',
        'json-to-xml': 'Convert JSON to XML format instantly in your browser. No signup or upload required.',
        'xml-to-json': 'Convert XML to clean JSON format instantly. Runs entirely in your browser.',
        'json-to-csv': 'Convert JSON arrays to CSV format for Excel or Google Sheets instantly.',
        'csv-to-json': 'Convert CSV files to JSON format instantly in your browser.',
        'json-to-tsv': 'Convert JSON to TSV (tab-separated) format instantly in your browser.',
        'tsv-to-json': 'Convert TSV files to JSON format instantly in your browser.',
        'json-to-text': 'Extract plain text values from JSON structures instantly.',
  
        // Developer Tools
        'base64': 'Encode or decode Base64 strings instantly in your browser. Your data never leaves your device.',
        'html-encode': 'Convert special characters to HTML entities instantly. Safe for embedding in web pages.',
        'html-decode': 'Convert HTML entities back to readable characters instantly in your browser.',
        'url-encode': 'Encode URLs with percent-encoding instantly. RFC-3986 compliant, runs in your browser.',
        'url-decode': 'Decode percent-encoded URLs back to readable text instantly in your browser.',
        'hash-gen': 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly in your browser.',
        'jwt-debugger': 'Decode and inspect JWT tokens client-side. View header, payload, and signature instantly.',
        'regex-tester': 'Test and debug regular expressions with real-time match highlighting.',
        'cron-generator': 'Build and validate cron expressions visually with a plain-English explanation.',
        'js-beautifier': 'Beautify and format JavaScript code instantly in your browser.',
        'js-minifier': 'Minify JavaScript to reduce file size and improve page load speed.',
        'js-obfuscator': 'Obfuscate JavaScript source code to protect it from reverse engineering.',
        'js-deobfuscator': 'Deobfuscate and clean up obfuscated JavaScript code instantly.',
        'html-beautifier': 'Format and indent HTML code for better readability instantly.',
        'html-minifier': 'Strip whitespace from HTML to reduce file size and improve load time.',
        'css-beautifier': 'Format and beautify CSS code with proper indentation instantly.',
        'css-minifier': 'Minify CSS to reduce file size and speed up your website.',
  
        // Binary Tools
        'binary-to-text': 'Convert binary code to readable text instantly in your browser.',
        'text-to-binary': 'Convert any text to binary code instantly. Shows step-by-step breakdown.',
        'binary-to-decimal': 'Convert binary numbers to decimal instantly with a conversion breakdown.',
        'decimal-to-binary': 'Convert decimal numbers to binary instantly in your browser.',
        'binary-to-hex': 'Convert binary to hexadecimal instantly in your browser.',
        'hex-to-binary': 'Convert hexadecimal to binary instantly in your browser.',
        'binary-to-octal': 'Convert binary to octal format instantly in your browser.',
        'octal-to-binary': 'Convert octal to binary format instantly in your browser.',
        'hex-to-decimal': 'Convert hexadecimal to decimal numbers instantly in your browser.',
        'decimal-to-hex': 'Convert decimal numbers to hexadecimal instantly in your browser.',
        'octal-to-decimal': 'Convert octal to decimal numbers instantly in your browser.',
        'decimal-to-octal': 'Convert decimal to octal numbers instantly in your browser.',
        'hex-to-octal': 'Convert hexadecimal to octal format instantly in your browser.',
        'octal-to-hex': 'Convert octal to hexadecimal format instantly in your browser.',
  
        // Image Tools
        'image-converter': 'Convert images between PNG, JPEG, WebP, and other formats free. No upload to servers.',
        'image-cropper': 'Crop images to any size or aspect ratio free. Works entirely in your browser.',
        'image-resizer': 'Resize images to exact dimensions free. Keeps aspect ratio automatically.',
        'image-enlarger': 'Enlarge and upscale images using browser-based interpolation. Free and private.',
        'jpg-to-png': 'Convert JPG images to PNG format free. Instant download, no server upload.',
        'png-to-jpg': 'Convert PNG images to JPG format free. Adjust quality and download instantly.',
        'png-to-webp': 'Convert PNG to WebP for better compression and web performance. Free.',
        'webp-to-jpg': 'Convert WebP images to JPG format free. Instant in-browser conversion.',
        'webp-to-png': 'Convert WebP images to PNG format free. No upload to servers.',
        'jpg-to-webp': 'Convert JPG images to WebP for smaller file sizes. Free and instant.',
        'image-to-base64': 'Convert images to Base64 data URIs for embedding in HTML or CSS. Free.',
        'base64-to-image': 'Convert Base64 strings back to downloadable image files instantly.',
        'image-compressor': 'Compress images to reduce file size without visible quality loss. Free.',
        'gif-to-png': 'Convert GIF images to PNG format free in your browser.',
        'bmp-to-png': 'Convert BMP images to PNG format free in your browser.',
        'svg-to-png': 'Convert SVG vector files to PNG raster images free. Choose your output size.',
  
        // Text Tools
        'word-counter': 'Count words, characters, sentences, and reading time instantly.',
        'case-converter': 'Convert text between uppercase, lowercase, title case, camelCase, and more.',
        'markdown-preview': 'Preview Markdown as rendered HTML in real time. Great for README files.',
        'lorem-ipsum': 'Generate Lorem Ipsum placeholder text by paragraph, sentence, or word count.',
        'text-diff': 'Compare two blocks of text and highlight every difference line by line.',
        'text-reverser': 'Reverse any string of text or reverse word order instantly.',
        'duplicate-remover': 'Remove duplicate lines from any list instantly in your browser.',
        'text-sorter': 'Sort lines of text alphabetically, numerically, or in reverse order.',
        'whitespace-remover': 'Strip extra whitespace, tabs, and blank lines from text instantly.',
        'slug-generator': 'Convert any text to a clean URL-friendly slug instantly.',
        'string-utilities': 'Count, trim, reverse, and transform strings with multiple utilities in one place.',
  
        // Network Tools
        'my-ip': 'Find your public IP address and browser request headers instantly.',
        'ip-lookup': 'Look up geographic location and ISP info for any IP address.',
        'dns-lookup': 'Query DNS records (A, AAAA, MX, TXT, NS, CNAME) for any domain.',
        'what-is-my-ip': 'See your public IP address and detailed browser information instantly.',
  
        // Calculator Tools
        'loan-calc': 'Calculate monthly loan payments, total interest, and full amortization schedule.',
        'age-calc': 'Calculate your exact age in years, months, days, hours, and seconds.',
        'percentage-calc': 'Calculate percentages, percentage change, and reverse percentages instantly.',
        'stripe-calc': 'Calculate exact Stripe fees and the invoice amount needed to receive a target sum.',
        'paypal-calc': 'Calculate exact PayPal fees and net payout for any transaction amount.',
        'sales-tax-calc': 'Calculate sales tax, GST, or VAT for any price and tax rate.',
        'discount-calc': 'Calculate discounted prices, savings amounts, and original prices from any discount.',
        'gst-calc': 'Calculate GST amounts, pre-tax prices, and total prices instantly.',
        'margin-calc': 'Calculate profit margin, markup percentage, and gross profit for any sale.',
        'average-calc': 'Calculate mean, median, mode, and standard deviation for any set of numbers.',
        'days-calc': 'Calculate the number of days between any two dates, including business days.',
        'hours-calc': 'Calculate total hours and minutes between two times.',
        'tdee-calc': 'Calculate your Total Daily Energy Expenditure and BMR based on activity level.',
        'calorie-calc': 'Calculate daily calorie needs using the Mifflin-St Jeor and Harris-Benedict formulas.',
  
        // General Utilities
        'pass-gen': 'Generate strong random passwords. Cryptographically secure, never sent to servers.',
        'password-entropy': 'Calculate password strength in bits and estimate brute-force cracking time.',
        'qr-generator': 'Generate custom QR codes free. Choose colors, size, and error correction.',
        'qr-decoder': 'Decode QR codes from images instantly in your browser. No upload to servers.',
        'uuid-gen': 'Generate UUID v1 and v4 identifiers in bulk instantly in your browser.',
        'utm-builder': 'Build UTM tracking URLs for Google Analytics campaigns in seconds.',
        'url-parser': 'Parse any URL into its components — protocol, host, path, and query params.',
        'facebook-id': 'Find the numeric ID for any Facebook profile, page, or group URL.',
  
        // SEO & Web Tools
        'social-meta-preview': 'Preview how your page looks when shared on Twitter, Facebook, and LinkedIn.',
        'redirect-header-inspect': 'Inspect HTTP redirect chains and response headers for any URL.',
        'dns-mx-txt': 'Look up MX, TXT, and SPF records for email configuration and verification.',
        'canonical-url-stripper': 'Strip UTM parameters and tracking tags from URLs to get the clean version.',
        'youtube-thumbnail': 'Download YouTube video thumbnails in HD, SD, and all available sizes free.',
  
        // Design Tools
        'css-gradient': 'Design CSS gradients visually and copy the ready-to-use code instantly.',
        'color-palette': 'Generate complementary, triadic, and analogous color palettes from any color.',
        'svg-optimizer': 'Optimize and minify SVG files to reduce size without losing quality.',
        'svg-path-editor': 'Visualize and edit SVG path coordinates interactively in your browser.',
        'color-converter': 'Convert colors between HEX, RGB, HSL, and CMYK formats instantly.',
        'hex-to-rgb': 'Convert HEX color codes to RGB values instantly in your browser.',
        'rgb-to-hex': 'Convert RGB color values to HEX color codes instantly in your browser.',
  
        // Converters
        'length-conv': 'Convert length and distance between metric, imperial, and maritime units.',
        'area-conv': 'Convert area between square meters, acres, hectares, and more.',
        'weight-conv': 'Convert weight and mass between grams, pounds, kilograms, and more.',
        'volume-conv': 'Convert volume between liters, gallons, cups, and more.',
        'temp-conv': 'Convert temperatures between Celsius, Fahrenheit, Kelvin, and Rankine.',
        'time-conv': 'Convert time between seconds, minutes, hours, days, weeks, and years.',
        'digital-conv': 'Convert digital storage between bytes, kilobytes, megabytes, and gigabytes.',
        'speed-conv': 'Convert speed between km/h, mph, knots, and meters per second.',
        'currency-conv': 'Convert currencies with live exchange rates from 150+ countries.',
        'num-to-word-conv': 'Convert numbers to written English words. Great for checks and documents.',
        'word-to-num-conv': 'Convert written English number words back to digits instantly.',
        'num-to-roman-conv': 'Convert numbers to Roman numerals instantly. Supports 1 to 3999.',
        'roman-to-num-conv': 'Convert Roman numerals back to standard numbers instantly.',
        'pressure-conv': 'Convert pressure between pascals, bars, PSI, and atmospheres.',
        'energy-conv': 'Convert energy between joules, kilowatt-hours, calories, and BTU.',
        'power-conv': 'Convert power between watts, kilowatts, horsepower, and BTU/hour.',
        'frequency-conv': 'Convert frequency between hertz, kilohertz, megahertz, and gigahertz.',
        'angle-conv': 'Convert angles between degrees, radians, gradians, and turns.',
        'pace-conv': 'Convert running pace between min/km, min/mile, and seconds.',
        'current-conv': 'Convert electric current between amperes, milliamperes, and more.',
        'voltage-conv': 'Convert voltage between volts, millivolts, kilovolts, and megavolts.',
  
        // AV & Subtitle Tools
        'vtt-to-srt': 'Convert VTT subtitle files to SRT format instantly in your browser.',
        'srt-to-vtt': 'Convert SRT subtitle files to VTT format instantly in your browser.',
      };

      const toolDescription = descriptions[activeTool.id] || 
        `Free online ${activeTool.name} — runs entirely in your browser. No signup required, no data uploaded.`;

      document.title = `${activeTool.name} — ${siteName}`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', toolDescription);

      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', `https://www.rocketwebtools.com?tool=${activeTool.id}`);
      }

    } else if (activeLegalView) {
      const pageTitles: Record<string, string> = {
        'privacy': `Privacy Policy — ${siteName}`,
        'terms': `Terms of Service — ${siteName}`,
        'about-contact': `About Us & Contact — ${siteName}`,
        'faq': `FAQ — ${siteName}`,
        'blog': `Blog — ${siteName}`,
      };
      document.title = pageTitles[activeLegalView] || siteName;

      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', `https://www.rocketwebtools.com?page=${activeLegalView}`);
      }

    } else {
      document.title = `${siteName} — 150+ Free Online Web Utilities`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Rocket Web Tools — 150+ free browser-based utilities for developers, designers and everyday users. JSON formatter, image converter, calculators, AI tools and more. No signup, no upload, no tracking.');
      }
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', 'https://www.rocketwebtools.com');
      }
    }
  }, [activeTool, activeLegalView]);

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (starred.includes(id)) {
      updated = starred.filter(x => x !== id);
    } else {
      updated = [...starred, id];
    }
    setStarred(updated);
    localStorage.setItem('omnitool_starred', JSON.stringify(updated));
  };

  // Helper to get related tools from the same category
  const getRelatedTools = (tool: Tool): Tool[] => {
    const sameCategory = ALL_TOOLS.filter(
      (t) => t.category === tool.category && t.id !== tool.id
    );
    const shuffled = [...sameCategory].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  // Filter tools based on query and selected category tab
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || 
                            tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  // Get dynamic icon based on registration key
  const getToolIcon = (name: string) => {
    const LucideIcon = (Icons as any)[name];
    if (LucideIcon) {
      return <LucideIcon className="w-5 h-5" />;
    }
    return <Icons.HelpCircle className="w-5 h-5" />;
  };

  const currentCategory = activeTool ? activeTool.category : activeCategory;
  const theme = CATEGORY_COLOR_MAP[currentCategory] || CATEGORY_COLOR_MAP['all'];

  return (
    <div className={`min-h-screen ${t.bodyBg} ${t.text} font-sans`} id="applet-viewport">
      {/* Dynamic Header */}
      <header className={`sticky top-0 z-40 ${t.headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a 
              href="/"
              aria-label="Rocket Web Tools logo, go to home page"
              className={`w-9 h-9 ${theme.bg} ${theme.hoverBg} text-white rounded-lg flex items-center justify-center cursor-pointer transition-all shadow-md ${theme.shadowColor}`}
              onClick={(e) => { e.preventDefault(); selectTool(null); setActiveCategory('all'); setActiveLegalView(null); }}
            >
              <Icons.Rocket className="w-5 h-5 text-white" />
            </a>
            <div className="flex items-baseline">
              <a 
                href="/"
                className={`text-base font-black tracking-tight ${t.textPrimary} cursor-pointer flex items-center gap-1 ${theme.textAccentHover} transition-colors`}
                onClick={(e) => { e.preventDefault(); selectTool(null); setActiveCategory('all'); setActiveLegalView(null); }}
              >
                ROCKET<span className={theme.textAccent}>WEB TOOLS</span>
              </a>
              <span className={`hidden sm:inline-block ml-2 text-[10px] font-bold px-2.5 py-0.5 ${theme.badgeBg} ${theme.badgeText} rounded-full border ${theme.badgeBorder} uppercase select-none font-mono`}>STANDALONE UTILITIES</span>
            </div>
          </div>

          {/* Core App Stats & Theme Toggle */}
          <div className={`flex items-center gap-4 sm:gap-6 text-xs ${t.textMuted} font-medium font-mono`}>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${theme.pulseBg} animate-pulse`}></span> 
              Starred: {starred.length}
            </span>
            <span>Active: {ALL_TOOLS.length} Utilities</span>

            <span className={isDark ? "text-white/10" : "text-gray-200"}>|</span>
            <a 
              href="?page=blog"
              onClick={(e) => { e.preventDefault(); selectLegalView('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`text-xs font-mono ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'} transition-colors cursor-pointer`}
            >
              Blog
            </a>

            <button
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`rounded-full p-1.5 px-3 flex items-center gap-1.5 text-xs font-mono transition-all cursor-pointer ${
                isDark 
                  ? 'bg-[#141414] border border-white/10 text-gray-400 hover:text-white' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:text-black shadow-sm'
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <>
                  <Icons.Sun className="w-3.5 h-3.5 text-orange-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Icons.Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 items-start justify-center w-full">
          {/* Left Skyscraper Ad */}
          <SidebarAdSkyscraper side="left" />

          {/* Core Layout Workspace */}
          <div className="flex-1 min-w-0 max-w-5xl">
            {/* Top Ad Banner */}
            <TopAdBanner />

            {toolNotFound && !activeTool && !activeLegalView ? (
              <div className="py-24 text-center space-y-4 max-w-sm mx-auto">
                <Icons.SearchX className="w-12 h-12 mx-auto text-gray-500" />
                <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} font-black text-xl`}>Tool Not Found</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-650'}`}>The tool you're looking for doesn't exist or may have been moved.</p>
                <button
                  type="button"
                  onClick={() => { setToolNotFound(false); window.history.pushState(null, '', '/'); }}
                  className="mt-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full transition-all cursor-pointer"
                >
                  Back to All Tools
                </button>
              </div>
            ) : activeLegalView ? (
              activeLegalView === 'about-contact' ? (
                <AboutContact onBack={() => selectLegalView(null)} />
              ) : activeLegalView === 'faq' ? (
                <FaqPage onBack={() => selectLegalView(null)} onContactSupport={() => selectLegalView('about-contact')} />
              ) : activeLegalView === 'blog' ? (
                blogPostSlug ? (
                  <BlogPost
                    onBack={() => {
                      setBlogPostSlug(null);
                      window.history.pushState({ page: 'blog' }, '', '?page=blog');
                    }}
                    slug={blogPostSlug}
                    isDark={isDark}
                    onOpenTool={handleOpenTool}
                    onOpenPost={(slug) => {
                      setBlogPostSlug(slug);
                      window.history.pushState({ page: 'blog', slug }, '', `?page=blog&slug=${slug}`);
                    }}
                  />
                ) : (
                  <BlogPage
                    onBack={() => selectLegalView(null)}
                    onOpenPost={(slug) => {
                      setBlogPostSlug(slug);
                      window.history.pushState({ page: 'blog', slug }, '', `?page=blog&slug=${slug}`);
                    }}
                    isDark={isDark}
                  />
                )
              ) : (
                <LegalPages type={activeLegalView as 'privacy' | 'terms'} onBack={() => selectLegalView(null)} />
              )
            ) : activeTool ? (
          /* ACTIVE SINGLE UTILITY CONTAINER */
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <a 
                  href="/"
                  onClick={(e) => { e.preventDefault(); selectTool(null); }}
                  className={`flex items-center gap-1.5 p-2 px-4 ${t.panelBg} border ${t.borderStrong} hover:border-${theme.colorName}-500/40 rounded-full ${t.text} hover:${t.textPrimary} transition-all cursor-pointer shadow-sm`}
                >
                  <Icons.ArrowLeft className="w-4 h-4" />
                  <span>Return to Toolbox</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://www.rocketwebtools.com?tool=${activeTool.id}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`flex items-center gap-1.5 p-2 px-4 ${
                    isDark 
                      ? 'bg-[#141414] border border-white/10 text-gray-300 hover:text-white' 
                      : 'bg-gray-100 border border-gray-200 text-gray-700 hover:text-black'
                  } hover:border-orange-500/40 rounded-full transition-all text-xs font-semibold cursor-pointer`}
                >
                  {copied ? <Icons.Check className="w-3.5 h-3.5 text-emerald-400" /> : <Icons.Link className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              
              <div className={`flex items-center gap-2 flex-wrap ${t.textMuted}`}>
                <a 
                  href="/" 
                  className={`hover:${t.text} cursor-pointer`} 
                  onClick={(e) => { e.preventDefault(); selectTool(null); }}
                >
                  Home
                </a>
                <Icons.ChevronRight className="w-3.5 h-3.5 text-gray-650" />
                <span className="capitalize">{activeTool.category}</span>
                <Icons.ChevronRight className="w-3.5 h-3.5 text-gray-650" />
                <span className={`${t.textPrimary} font-bold`}>{activeTool.name}</span>
              </div>
            </div>

            {/* Renderer Router */}
            <div className={`border rounded-2xl p-6 sm:p-8 shadow-xl ${isDark ? 'bg-[#0f0f0f] border-white/5' : 'bg-white border-gray-200'}`}>
              <Suspense fallback={
                <div className="flex items-center justify-center py-24">
                  <div className={`w-8 h-8 border-2 rounded-full animate-spin ${
                    isDark ? 'border-white/10 border-t-orange-500' : 'border-gray-200 border-t-orange-500'
                  }`} />
                </div>
              }>
                {activeTool.category === 'web-mgmt' && (
                  ['qr-generator', 'qr-decoder'].includes(activeTool.id) ? (
                    <QrCodeHelperTools activeToolId={activeTool.id} isDark={isDark} />
                  ) : ['facebook-id', 'uuid-gen', 'url-parser', 'utm-builder', 'query-param-stripper'].includes(activeTool.id) ? (
                    <UrlMarketingTools activeToolId={activeTool.id} />
                  ) : ['social-meta-preview', 'redirect-header-inspect', 'dns-mx-txt'].includes(activeTool.id) ? (
                    <SeoSpatialTools activeToolId={activeTool.id} />
                  ) : (
                    <WebMgmtTools activeToolId={activeTool.id} />
                  )
                )}
                {activeTool.category === 'development' && (
                  ['json-viewer', 'json-validator', 'json-editor', 'json-minify', 'xml-to-json', 'json-to-xml', 'csv-to-json', 'tsv-to-json', 'json-to-csv', 'json-to-tsv', 'json-to-text'].includes(activeTool.id) ? (
                    <JsonSuiteTools activeToolId={activeTool.id} isDark={isDark} />
                  ) : ['json-diff', 'jwt-debugger', 'regex-tester', 'cron-generator'].includes(activeTool.id) ? (
                    <DeveloperSuiteTools activeToolId={activeTool.id} />
                  ) : ['js-beautifier', 'js-minifier', 'js-obfuscator', 'js-deobfuscator'].includes(activeTool.id) ? (
                    <JsDeveloperTools activeToolId={activeTool.id} isDark={isDark} />
                  ) : ['html-beautifier', 'html-minifier', 'css-beautifier', 'css-minifier'].includes(activeTool.id) ? (
                    <WebMgmtTools activeToolId={activeTool.id} />
                  ) : (
                    <CodeTools activeToolId={activeTool.id} isDark={isDark} />
                  )
                )}
                {activeTool.category === 'text' && <TextTools activeToolId={activeTool.id} />}
                {activeTool.category === 'network' && <NetworkTools activeToolId={activeTool.id} />}
                {activeTool.category === 'binary' && <BinaryTools activeToolId={activeTool.id} isDark={isDark} />}
                {['css-gradient', 'color-palette', 'svg-optimizer', 'svg-path-editor'].includes(activeTool.id) ? (
                  <DesignSuiteTools activeToolId={activeTool.id} />
                ) : ['length-conv', 'area-conv', 'weight-conv', 'volume-conv', 'temp-conv', 'each-conv', 'time-conv', 'digital-conv', 'parts-per-conv', 'speed-conv', 'pace-conv', 'pressure-conv', 'current-conv', 'voltage-conv', 'power-conv', 'reactive-power-conv', 'apparent-power-conv', 'energy-conv', 'reactive-energy-conv', 'vol-flow-conv', 'illuminance-conv', 'frequency-conv', 'angle-conv', 'currency-conv', 'num-to-word-conv', 'word-to-num-conv', 'torque-conv', 'charge-conv', 'num-to-roman-conv', 'roman-to-num-conv'].includes(activeTool.id) ? (
                  <ConverterTools activeToolId={activeTool.id} />
                ) : ['vtt-to-srt', 'srt-to-vtt', 'youtube-thumbnail'].includes(activeTool.id) ? (
                  <AvSubtitleTools activeToolId={activeTool.id} />
                ) : ['color-converter', 'hex-to-rgb', 'rgb-to-hex'].includes(activeTool.id) ? (
                  <ColorTools activeToolId={activeTool.id} />
                ) : (
                  activeTool.category === 'utility' && <UtilityTools activeToolId={activeTool.id} />
                )}
                {activeTool.category === 'image' && <ImageTools activeToolId={activeTool.id} />}
                {activeTool.category === 'calculator' && <CalculatorTools activeToolId={activeTool.id} isDark={isDark} />}
              </Suspense>
            </div>

            {/* Dynamic Rich SEO Explanation Article */}
            <ToolExplanation 
              toolId={activeTool.id} 
              category={activeTool.category} 
              name={activeTool.name} 
              description={activeTool.description} 
              isDark={isDark}
            />

            {/* Related Tools */}
            {activeTool && (() => {
              const related = getRelatedTools(activeTool);
              if (related.length === 0) return null;
              const categoryColor = CATEGORY_COLOR_MAP[activeTool.category] || CATEGORY_COLOR_MAP['all'];
              return (
                <div className={`mt-8 pt-6 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                  <p className={`text-xs font-bold font-mono uppercase tracking-widest mb-4 ${
                    isDark ? 'text-gray-500' : 'text-gray-550'
                  }`}>
                    More {activeTool.category.replace(/-/g, ' ')} tools
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {related.map((relTool) => (
                      <button
                        key={relTool.id}
                        type="button"
                        onClick={() => {
                          selectTool(relTool);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`text-left p-3 rounded-xl border transition-all group ${
                          isDark
                            ? 'bg-[#0f0f0f] border-white/5 hover:border-orange-500/25 hover:bg-white/2'
                            : 'bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50/30'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${categoryColor.iconBg} ${categoryColor.iconText}`}>
                          {getToolIcon(relTool.iconName)}
                        </div>
                        <p className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                          isDark
                            ? 'text-gray-300 group-hover:text-white'
                            : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                          {relTool.name}
                        </p>
                        <p className={`text-[10px] mt-1 line-clamp-1 ${
                          isDark ? 'text-gray-600' : 'text-gray-550'
                        }`}>
                          {relTool.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* SEARCHABLE GRID DASHBOARD SCREEN */
          <div className="space-y-8 animate-fade-in">
            {/* Hero Section — only on homepage */}
            <div className={`text-center space-y-4 pt-4 pb-8 border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold border ${
                isDark
                  ? 'bg-orange-500/8 border-orange-500/15 text-orange-400'
                  : 'bg-orange-50 border-orange-200 text-orange-600'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                {ALL_TOOLS.length} free tools — no account needed
              </div>

              <h1 className={`text-3xl sm:text-4xl font-black tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                The toolbox for people<br className="hidden sm:block" /> who build things online.
              </h1>

              <p className={`text-sm sm:text-base max-w-xl mx-auto leading-relaxed ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Format JSON, convert files, generate passwords, calculate fees, and {ALL_TOOLS.length}+ more utilities — all free, all private, all running directly in your browser.
              </p>

              <div className={`flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono ${
                isDark ? 'text-gray-500' : 'text-gray-550'
              }`}>
                <span className="flex items-center gap-1.5">
                  <Icons.Shield className="w-3.5 h-3.5 text-emerald-500" />
                  No data uploaded
                </span>
                <span className={isDark ? 'text-white/10' : 'text-gray-200'}>•</span>
                <span className="flex items-center gap-1.5">
                  <Icons.Zap className="w-3.5 h-3.5 text-orange-500" />
                  Works offline
                </span>
                <span className={isDark ? 'text-white/10' : 'text-gray-200'}>•</span>
                <span className="flex items-center gap-1.5">
                  <Icons.Lock className="w-3.5 h-3.5 text-indigo-400" />
                  No signup required
                </span>
                <span className={isDark ? 'text-white/10' : 'text-gray-200'}>•</span>
                <span className="flex items-center gap-1.5">
                  <Icons.Globe className="w-3.5 h-3.5 text-sky-400" />
                  100% free forever
                </span>
              </div>
            </div>

            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className={`inline-flex items-center gap-1.5 p-1 px-3.5 ${theme.badgeBg} border ${theme.badgeBorder} rounded-full ${theme.badgeText} text-xs font-mono font-bold mx-auto mb-1 animate-pulse`}>
                <Icons.Rocket className="w-3.5 h-3.5" />
                <span>RAPID WEB UTILITIES</span>
              </div>
              <h2 className={`text-4xl sm:text-5xl font-black tracking-tight ${t.textPrimary} leading-tight`}>
                Rocket <span className={`text-transparent bg-gradient-to-r ${theme.gradient} bg-clip-text`}>Web Tools</span>
              </h2>
              <p className={`text-sm ${t.textSecondary} max-w-xl mx-auto leading-relaxed`}>
                Super-charged, client-safe utilities engineered for seamless, lightning-fast on-device computations. Direct offline capabilities, professional interfaces, and zero processing lag.
              </p>

              {/* Instant Search Bar */}
              <div className="relative max-w-lg mx-auto">
                <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                <input
                   ref={searchInputRef}
                   type="text"
                   placeholder="Filter through utilities (e.g. JSON, Base64, Password...)"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className={`w-full ${t.searchBg} rounded-2xl p-4 pl-12 text-sm focus:outline-none ${theme.focusRing} focus:ring-1 transition-all shadow-inner`}
                />
                {!search && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 pointer-events-none">
                    <kbd className={`px-1.5 py-0.5 text-[10px] font-mono border rounded ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-gray-500' 
                        : 'bg-gray-100 border-gray-200 text-gray-400'
                    }`}>/</kbd>
                  </div>
                )}
                {search && (
                  <button 
                    type="button" 
                    onClick={() => setSearch('')} 
                    aria-label="Clear search query"
                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 ${isDark ? 'hover:text-white' : 'hover:text-black'} transition-colors`}
                  >
                    <Icons.X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Recently Used Section */}
            {recentTools.length > 0 && !search && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icons.History className={`w-4 h-4 ${theme.textAccent}`} />
                  <span className={`text-xs font-bold font-mono ${isDark ? 'text-gray-500' : 'text-gray-550'} uppercase tracking-widest`}>Recently Used</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentTools.map(id => {
                    const tool = ALL_TOOLS.find(t => t.id === id);
                    if (!tool) return null;
                    const toolTheme = CATEGORY_COLOR_MAP[tool.category] || CATEGORY_COLOR_MAP['all'];
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => selectTool(tool)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                          isDark 
                            ? 'bg-[#0f0f0f] border border-white/5 text-gray-300 hover:text-white' 
                            : 'bg-white border border-gray-200 text-gray-700 hover:text-gray-900'
                        } hover:border-${toolTheme.colorName}-500/30 transition-all`}
                      >
                        <span className={toolTheme.textAccent}>{getToolIcon(tool.iconName)}</span>
                        {tool.name}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setRecentTools([]);
                      localStorage.removeItem('rwt_recent');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-550 hover:text-gray-700'
                    } transition-all`}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Categories Selectors Tabs */}
            <div className={`flex flex-wrap items-center justify-center gap-2.5 py-4 border-t border-b ${t.border}`}>
              {CATEGORIES.map(category => {
                const catTheme = CATEGORY_COLOR_MAP[category.id] || CATEGORY_COLOR_MAP['all'];
                const isActive = activeCategory === category.id;
                let activeStyle = `${catTheme.activeBtn} shadow-md`;
                let inactiveStyle = t.tabInactive;

                const categoryCount = category.id === 'all' 
                  ? ALL_TOOLS.length 
                  : ALL_TOOLS.filter(t => t.category === category.id).length;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`p-2 px-4 rounded-xl text-xs sm:text-xs font-bold transition-all duration-150 cursor-pointer ${
                      isActive ? activeStyle : inactiveStyle
                    }`}
                  >
                    {category.name}
                    <span className="ml-1.5 opacity-60 font-normal">({categoryCount})</span>
                  </button>
                );
              })}
            </div>

            {/* Filtered Grid */}
            <div>
              {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTools.map(tool => {
                    const isStarred = starred.includes(tool.id);
                    const details = TOOL_DETAILS_MAP[tool.id] || {
                      tagline: tool.description,
                      features: ['Instant browser response', 'Zero tracking offline mode'],
                      safeStatus: 'Local Browser',
                      inputType: 'Any Text Character'
                    };
                    const toolTheme = CATEGORY_COLOR_MAP[tool.category] || CATEGORY_COLOR_MAP['all'];

                    return (
                      <a
                        key={tool.id}
                        href={`?tool=${tool.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          selectTool(tool);
                        }}
                        onMouseEnter={() => setHoveredToolId(tool.id)}
                        onMouseLeave={() => setHoveredToolId(null)}
                        className={`group block relative ${t.cardBg} border ${t.border} ${toolTheme.cardHoverBorder} rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl ${toolTheme.cardHoverShadow} cursor-pointer z-10 hover:z-20`}
                      >
                        {/* Tooltip Overlay */}
                        <AnimatePresence>
                          {hoveredToolId === tool.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10, x: '-50%' }}
                              animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                              exit={{ opacity: 0, scale: 0.95, y: 10, x: '-50%' }}
                              transition={{ duration: 0.15, ease: 'easeOut' }}
                              className={`absolute bottom-full left-1/2 mb-4 w-72 sm:w-80 ${t.tooltipBg} border ${t.tooltipBorder} ${t.text} rounded-xl p-4 shadow-2xl z-50 pointer-events-none text-left flex flex-col gap-3`}
                              style={{ transformOrigin: 'bottom center' }}
                            >
                              <div className={`flex items-center justify-between border-b ${t.border} pb-2`}>
                                <span className={`text-xs font-black ${t.textPrimary} tracking-wide uppercase flex items-center gap-1.5 font-mono`}>
                                  <Icons.Sparkles className={`w-3.5 h-3.5 ${toolTheme.sparkleText} animate-pulse`} />
                                  QUICK INFO
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider font-mono ${
                                  details.safeStatus === 'Local Browser'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    details.safeStatus === 'Local Browser' ? 'bg-emerald-400 animate-ping' : 'bg-indigo-400 animate-pulse'
                                  }`} />
                                  {details.safeStatus}
                                </span>
                              </div>

                              <div className="space-y-2">
                                <h4 className={`text-xs font-semibold ${t.textPrimary}`}>
                                  {details.tagline}
                                </h4>
                                <ul className={`space-y-1.5 text-[11px] ${t.textSecondary}`}>
                                  {details.features.map((feat, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5 leading-snug">
                                      <Icons.Check className={`w-3.5 h-3.5 ${toolTheme.checkText} shrink-0 mt-0.5`} />
                                      <span>{feat}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className={`flex items-center justify-between border-t ${t.border} pt-2 text-[10px] font-mono ${t.textMuted}`}>
                                <span>Input Protocol:</span>
                                <span className={`${toolTheme.sparkleText}/80 font-bold`}>{details.inputType}</span>
                              </div>

                              {/* Tooltip pointer triangle */}
                              <div className={`absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-x-[6px] border-x-transparent border-t-[6px] ${isDark ? 'border-t-[#121214]' : 'border-t-white'} w-0 h-0`} />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Star Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleStar(tool.id, e);
                          }}
                          className={`absolute top-4 right-4 p-1.5 rounded-lg ${t.starBg} transition-all text-xs`}
                          title={isStarred ? "Unstar tool" : "Star tool"}
                          aria-label={isStarred ? `Remove ${tool.name} from starred tools` : `Add ${tool.name} to starred tools`}
                        >
                          <Icons.Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                        </button>

                        <div className="space-y-3 pr-6">
                          <div className={`w-10 h-10 ${toolTheme.iconBg} ${toolTheme.iconText} ${toolTheme.iconHoverBg} rounded-xl flex items-center justify-center transition-colors shadow`}>
                            {getToolIcon(tool.iconName)}
                          </div>
                          <div>
                            <h3 className={`font-extrabold ${t.textPrimary} text-base tracking-tight ${toolTheme.titleTextHover} transition-colors`}>{tool.name}</h3>
                            <p className={`text-xs ${t.textSecondary} mt-1.5 leading-relaxed`}>{tool.description}</p>
                          </div>
                        </div>

                        <div className={`flex items-center justify-between text-[11px] font-bold border-t ${t.border} pt-4`}>
                          <span className={`uppercase font-mono ${toolTheme.textAccent}/70 tracking-wider h-5`}>{tool.category}</span>
                          <span className={`${toolTheme.textAccent} flex items-center gap-1 group-hover:translate-x-1 transition-transform`}>
                            Open Utility <Icons.ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className={`py-16 text-center ${t.textMuted} border ${t.border} ${t.panelBg} rounded-2xl max-w-sm mx-auto`}>
                  <Icons.SearchX className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                  <h3 className={`font-semibold ${t.textPrimary} text-sm`}>No matched utilities found</h3>
                  <p className={`text-xs ${t.textSecondary} mt-1`}>Try modifying your query or select a different category filter.</p>
                </div>
              )}
            </div>
          </div>
        )}
            {/* Bottom Ad Banner */}
            <BottomAdBanner />
          </div>

          {/* Right Skyscraper Ad */}
          <SidebarAdSkyscraper side="right" />
        </div>
      </main>

      {/* Footer */}
      <footer className={`${t.footerBg} mt-20 py-8`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:items-center sm:justify-between text-xs ${t.textMuted} gap-4`}>
          <div className="space-y-2 text-center sm:text-left">
            <p>© 2026 Rocket Web Tools. Professional browser-side utilities compiled for maximum performance.</p>
            <div className={`flex flex-wrap justify-center sm:justify-start items-center gap-3 text-xs ${t.textSecondary}`}>
              <a
                href="?page=privacy"
                onClick={(e) => { e.preventDefault(); selectLegalView('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`hover:${theme.textAccent} transition-colors cursor-pointer font-semibold`}
              >
                Privacy Policy
              </a>
              <span className={`${t.tagText} select-none`}>&bull;</span>
              <a
                href="?page=terms"
                onClick={(e) => { e.preventDefault(); selectLegalView('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`hover:${theme.textAccent} transition-colors cursor-pointer font-semibold`}
              >
                Terms of Service
              </a>
              <span className={`${t.tagText} select-none`}>&bull;</span>
              <a
                href="?page=about-contact"
                onClick={(e) => { e.preventDefault(); selectLegalView('about-contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`hover:${theme.textAccent} transition-colors cursor-pointer font-semibold`}
              >
                About Us &amp; Contact Support
              </a>
              <span className={`${t.tagText} select-none`}>&bull;</span>
              <a
                href="?page=faq"
                onClick={(e) => { e.preventDefault(); selectLegalView('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`hover:${theme.textAccent} transition-colors cursor-pointer font-semibold`}
              >
                FAQ
              </a>
              <span className={`${t.tagText} select-none`}>&bull;</span>
              <a
                href="?page=blog"
                onClick={(e) => { e.preventDefault(); selectLegalView('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`hover:${theme.textAccent} transition-colors cursor-pointer font-semibold`}
              >
                Blog
              </a>
            </div>
          </div>
          <div className="flex justify-center items-center gap-4 mt-4 sm:mt-0 font-mono text-[10px]">
            <span className={`flex items-center gap-1.5 ${t.panelBg} p-1 px-3 border ${t.border} rounded-full`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ALL SYSTEM UTILITIES OPERATIONAL
            </span>
          </div>
        </div>
      </footer>
      <CookieBanner isDark={isDark} />
    </div>
  );
}