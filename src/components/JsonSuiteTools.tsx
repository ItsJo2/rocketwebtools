import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

interface JsonSuiteToolsProps {
  activeToolId: string;
}

// =========================================================================
// UTILITY PARSERS: CSV/TSV, XML, TEXT DATA CONVERTERS
// =========================================================================

// CSV / TSV helper parser
function delimToJSON(text: string, delimiter: string): any {
  if (!text.trim()) return [];
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return [];

  // Parse header
  const headers = splitDelimLine(lines[0], delimiter);
  const resultList = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitDelimLine(lines[i], delimiter);
    const obj: Record<string, any> = {};
    headers.forEach((h, idx) => {
      let rawVal = values[idx] !== undefined ? values[idx] : '';
      // Try to parse values as numbers, booleans, or raw string fallback
      if (rawVal.toLowerCase() === 'true') {
        obj[h] = true;
      } else if (rawVal.toLowerCase() === 'false') {
        obj[h] = false;
      } else if (!isNaN(rawVal as any) && rawVal.trim() !== '') {
        obj[h] = Number(rawVal);
      } else {
        obj[h] = rawVal;
      }
    });
    resultList.push(obj);
  }
  return resultList;
}

// Split delimiters while preserving quotes
function splitDelimLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let currentVal = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(currentVal.trim().replace(/^"|"$/g, ''));
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  result.push(currentVal.trim().replace(/^"|"$/g, ''));
  return result;
}

// JSON arrays to CSV/TSV
function jsonToDelim(jsonData: any, delimiter: string): string {
  let cleanData = jsonData;
  if (typeof jsonData === 'string') {
    cleanData = JSON.parse(jsonData);
  }
  if (!Array.isArray(cleanData)) {
    if (typeof cleanData === 'object' && cleanData !== null) {
      cleanData = [cleanData];
    } else {
      throw new Error('Input must be a JSON array or a collection of objects.');
    }
  }
  if (cleanData.length === 0) return '';

  // Discover all unique keys
  const headerKeys = Array.from(
    new Set(cleanData.reduce((acc: string[], item: any) => {
      if (typeof item === 'object' && item !== null) {
        return acc.concat(Object.keys(item));
      }
      return acc;
    }, []))
  ) as string[];

  if (headerKeys.length === 0) return '';

  const csvRows = [];
  // Heading row
  csvRows.push(headerKeys.map(k => `"${k.replace(/"/g, '""')}"`).join(delimiter));

  // Map rows
  cleanData.forEach((row: any) => {
    const values = headerKeys.map(k => {
      const val = row[k];
      if (val === undefined || val === null) {
        return '""';
      }
      const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
      return `"${valStr.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(delimiter));
  });

  return csvRows.join('\n');
}

// Bidirectional XML converter
function xmlToJSON(xmlText: string): any {
  if (!xmlText.trim()) return {};
  
  // Custom simple XML parser
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const errorNode = xmlDoc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('XML Syntax Error: ' + errorNode.textContent);
  }

  function domNodeToObj(node: Node): any {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue?.trim();
      return text ? text : null;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const obj: Record<string, any> = {};
    const element = node as Element;

    // Attributes
    if (element.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let j = 0; j < element.attributes.length; j++) {
        const attr = element.attributes[j];
        obj['@attributes'][attr.name] = attr.value;
      }
    }

    // Children
    const children = element.childNodes;
    if (children.length === 0) {
      if (Object.keys(obj).length === 0) return '';
      return obj;
    }

    let hasElementChild = false;
    for (let i = 0; i < children.length; i++) {
      if (children[i].nodeType === Node.ELEMENT_NODE) {
        hasElementChild = true;
        break;
      }
    }

    if (!hasElementChild) {
      const textContent = element.textContent?.trim();
      if (Object.keys(obj).length === 0) {
        // Try parsing numbers or booleans
        if (textContent === 'true') return true;
        if (textContent === 'false') return false;
        if (textContent && !isNaN(textContent as any)) return Number(textContent);
        return textContent || '';
      }
      obj['#text'] = textContent;
      return obj;
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeType !== Node.ELEMENT_NODE) continue;

      const childName = child.nodeName;
      const childVal = domNodeToObj(child);

      if (obj[childName] === undefined) {
        obj[childName] = childVal;
      } else {
        if (!Array.isArray(obj[childName])) {
          obj[childName] = [obj[childName]];
        }
        obj[childName].push(childVal);
      }
    }

    return obj;
  }

  const rootNode = xmlDoc.documentElement;
  return {
    [rootNode.nodeName]: domNodeToObj(rootNode)
  };
}

// Convert JSON object to standard XML tag text
function jsonToXML(obj: any, rootName = 'root', indent = '  ', depth = 0): string {
  const tabs = indent.repeat(depth);
  let xmlStr = '';

  if (obj === null || obj === undefined) {
    return `${tabs}<${rootName} />`;
  }

  if (typeof obj !== 'object') {
    return `${tabs}<${rootName}>${escapeXml(String(obj))}</${rootName}>`;
  }

  // Handle tags mapping
  let attributesStr = '';
  let childrenStr = '';

  if (obj['@attributes']) {
    attributesStr = Object.keys(obj['@attributes'])
      .map(attr => ` ${attr}="${escapeXml(String(obj['@attributes'][attr]))}"`)
      .join('');
  }

  const keys = Object.keys(obj).filter(k => k !== '@attributes' && k !== '#text');

  if (keys.length === 0) {
    const textVal = obj['#text'] !== undefined ? obj['#text'] : '';
    if (textVal === '') {
      return `${tabs}<${rootName}${attributesStr} />`;
    }
    return `${tabs}<${rootName}${attributesStr}>${escapeXml(String(textVal))}</${rootName}>`;
  }

  keys.forEach(k => {
    const item = obj[k];
    if (Array.isArray(item)) {
      item.forEach(childItem => {
        childrenStr += jsonToXML(childItem, k, indent, depth + 1) + '\n';
      });
    } else {
      childrenStr += jsonToXML(item, k, indent, depth + 1) + '\n';
    }
  });

  return `${tabs}<${rootName}${attributesStr}>\n${childrenStr}${tabs}</${rootName}>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Flat text tree outline builders
function jsonToOutline(obj: any, indent = '', isLast = true): string {
  let text = '';
  
  if (obj === null) {
    return `null\n`;
  }

  if (Array.isArray(obj)) {
    text += `(Array: ${obj.length} items)\n`;
    obj.forEach((item, index) => {
      const lastItem = index === obj.length - 1;
      text += `${indent}${lastItem ? '└── ' : '├── '}[${index}]: `;
      text += jsonToOutline(item, indent + (lastItem ? '    ' : '│   '), lastItem);
    });
  } else if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    text += `(Object: ${keys.length} fields)\n`;
    keys.forEach((key, index) => {
      const lastKey = index === keys.length - 1;
      text += `${indent}${lastKey ? '└── ' : '├── '}${key}: `;
      text += jsonToOutline(obj[key], indent + (lastKey ? '    ' : '│   '), lastKey);
    });
  } else {
    text += `${obj} (${typeof obj})\n`;
  }

  return text;
}

// Simple JSON syntax healing helper (repair basic trailing commas, missing quotes, single quotes etc)
function repairSimpleJSON(badJson: string): string {
  let healed = badJson.trim();
  
  // Replace single quotes with double quotes around parameters keys & literal values
  healed = healed.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');

  // Strip trailing commas before curly braces or array brackets
  healed = healed.replace(/,(\s*[}\]])/g, '$1');

  // Check if wraps around curly brackets
  if (!healed.startsWith('{') && !healed.startsWith('[') && healed.includes(':')) {
    healed = '{' + healed + '}';
  }

  return healed;
}

// =========================================================================
// COLLAPSIBLE TREE NODES VISUALIZER (JSON VIEW COMPONENT)
// =========================================================================
interface TreeNodeProps {
  name: string | number;
  value: any;
  depth: number;
  searchFilter: string;
}

export function TreeViewerNode({ name, value, depth, searchFilter }: TreeNodeProps) {
  const [collapsed, setCollapsed] = useState<boolean>(depth > 2);
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;

  // Search match highlighting status
  const keyMatches = searchFilter ? String(name).toLowerCase().includes(searchFilter.toLowerCase()) : false;
  const valueMatches = (searchFilter && (type === 'string' || type === 'number' || type === 'boolean')) 
    ? String(value).toLowerCase().includes(searchFilter.toLowerCase()) 
    : false;

  const isMatched = keyMatches || valueMatches;

  const copySubtree = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(value, null, 2));
  };

  const getLabelColor = () => {
    switch (type) {
      case 'string': return 'text-amber-300';
      case 'number': return 'text-blue-300';
      case 'boolean': return 'text-emerald-400 font-bold';
      case 'null': return 'text-rose-400 italic';
      default: return 'text-indigo-200';
    }
  };

  if (type === 'array' || type === 'object') {
    const keys = type === 'array' ? Object.keys(value) : Object.keys(value);
    const count = keys.length;

    // Filter list check
    return (
      <div className="pl-4 border-l border-white/5 py-1 select-none">
        <div 
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-1.5 cursor-pointer p-0.5 rounded transition-all hover:bg-white/5 ${isMatched ? 'bg-indigo-950/40 border-l border-indigo-500' : ''}`}
        >
          {collapsed ? (
            <Icons.ChevronRight className="w-3.5 h-3.5 text-gray-500 hover:text-white" />
          ) : (
            <Icons.ChevronDown className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
          )}

          <span className="font-mono text-xs text-indigo-300 font-semibold">{name}</span>
          <span className="text-[10px] text-gray-500 font-mono">
            {type === 'array' ? `[Array: ${count} items]` : `{Object: ${count} properties}`}
          </span>

          <button 
            type="button"
            onClick={copySubtree} 
            className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-500 hover:text-emerald-400 ml-auto transition-opacity"
            title="Copy branch"
          >
            <Icons.Copy className="w-3 h-3" />
          </button>
        </div>

        {!collapsed && (
          <div className="pl-3 space-y-0.5 mt-0.5">
            {keys.map((key, index) => {
              const childVal = value[key];
              const childName = type === 'array' ? Number(key) : key;
              return (
                <div key={index} className="group">
                  <TreeViewerNode 
                    name={childName} 
                    value={childVal} 
                    depth={depth + 1} 
                    searchFilter={searchFilter} 
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 pl-4 py-0.5 hover:bg-white/5 rounded font-mono text-xs select-text ${isMatched ? 'bg-indigo-950/65 border-l border-indigo-400' : ''}`}>
      <span className="text-gray-400">{name}:</span>
      
      <span className={getLabelColor()}>
        {type === 'string' ? `"${value}"` : String(value)}
      </span>
      
      <span className="text-[9px] text-gray-600 font-mono uppercase">({type})</span>
    </div>
  );
}

// =========================================================================
// MAIN JSON DATA CONVERSION SUITE
// =========================================================================
export function JsonSuiteTools({ activeToolId }: JsonSuiteToolsProps) {
  
  // Tab alignment options
  const [inputVal, setInputVal] = useState<string>('');
  const [outputVal, setOutputVal] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [indentWidth, setIndentWidth] = useState<number>(2);

  const [validationContext, setValidationContext] = useState<{
    status: 'success' | 'failed' | 'empty';
    lineCount?: number;
    charCount?: number;
    cleanChecked?: boolean;
  }>({ status: 'empty' });

  // Load sample demo scripts depending on which utility page is highlighted
  useEffect(() => {
    let demo = '';

    switch (activeToolId) {
      case 'json-viewer':
      case 'json-validator':
      case 'json-editor':
      case 'json-minify':
        demo = JSON.stringify({
          appId: "com.ai.sandbox.developer",
          version: 1.05,
          status: "active",
          serverConfig: {
            securePort: 3000,
            allowHmr: false,
            endpointRoutes: ["/api/v1/health", "/api/v1/query", "/api/v1/auth"]
          },
          features: [
            { id: "viewer", active: true, latencyMs: 14.5 },
            { id: "converter", active: true, latencyMs: 22.0 }
          ],
          cachedMetadata: null
        }, null, 2);
        break;

      case 'xml-to-json':
        demo = `<?xml version="1.0" encoding="UTF-8"?>\n<catalog>\n  <product id="P101">\n    <name>Dynamic Dev Workstation</name>\n    <category>Hardware</category>\n    <cost currency="USD">2400</cost>\n    <inStock>true</inStock>\n  </product>\n  <product id="P102">\n    <name>OLED Flat Panel</name>\n    <category>Peripherals</category>\n    <cost currency="USD">650</cost>\n    <inStock>false</inStock>\n  </product>\n</catalog>`;
        break;

      case 'json-to-xml':
        demo = JSON.stringify({
          catalogSummary: {
            "@attributes": { generatedAt: "2026-06-21T08:00:00Z" },
            developerCompany: "Google AI Suite",
            portAddress: 3000,
            activeServices: {
              service: ["Database Engine", "Cache Broker", "Worker Pool"]
            }
          }
        }, null, 2);
        break;

      case 'csv-to-json':
      case 'tsv-to-json':
        const sep = activeToolId === 'tsv-to-json' ? '\t' : ',';
        demo = `userId${sep}userName${sep}sessionMinutes${sep}isAdmin${sep}creditScore\n101${sep}Amelia Vance${sep}145${sep}true${sep}780.25\n102${sep}Darius Miller${sep}22${sep}false${sep}590.00\n103${sep}Sonia Kincaid${sep}415${sep}true${sep}810.50`;
        break;

      case 'json-to-csv':
      case 'json-to-tsv':
        demo = JSON.stringify([
          { orderId: "FX-8891", item: "Dev Monitor", quantity: 2, shipped: true, userEmail: "otaku@dev.com" },
          { orderId: "FX-9011", item: "Mechanical Keys", quantity: 1, shipped: false, userEmail: "darius@miller.io" },
          { orderId: "FX-3412", item: "USB-C Hub Hub", quantity: 5, shipped: true, userEmail: "finance@office.org" }
        ], null, 2);
        break;

      case 'json-to-text':
        demo = JSON.stringify({
          buildStatus: "Success Ready",
          moduleCounts: { components: 14, styles: 1, utilities: 8 },
          activeScopes: ["camera", "geolocation"],
          environment: "Cloud Containers Sandbox 3000"
        }, null, 2);
        break;
      
      default:
        demo = '';
    }

    setInputVal(demo);
    setErrorMsg(null);
  }, [activeToolId]);

  // Unified calculations and parsing handler loops
  useEffect(() => {
    if (!inputVal.trim()) {
      setOutputVal('');
      setErrorMsg(null);
      setValidationContext({ status: 'empty' });
      return;
    }

    try {
      setErrorMsg(null);
      
      switch (activeToolId) {
        case 'json-viewer': {
          // Verify syntax properties
          const parsed = JSON.parse(inputVal);
          setOutputVal(JSON.stringify(parsed, null, indentWidth));
          setValidationContext({ status: 'success', cleanChecked: true });
          break;
        }

        case 'json-validator': {
          try {
            const parsed = JSON.parse(inputVal);
            setValidationContext({ 
              status: 'success', 
              lineCount: inputVal.split('\n').length, 
              charCount: inputVal.length, 
              cleanChecked: true 
            });
            setOutputVal(JSON.stringify(parsed, null, indentWidth));
          } catch (e: any) {
            setValidationContext({ status: 'failed' });
            throw e;
          }
          break;
        }

        case 'json-editor': {
          const parsed = JSON.parse(inputVal);
          setOutputVal(JSON.stringify(parsed, null, indentWidth));
          break;
        }

        case 'json-minify': {
          const parsed = JSON.parse(inputVal);
          setOutputVal(JSON.stringify(parsed));
          break;
        }

        case 'json-to-text': {
          const parsed = JSON.parse(inputVal);
          const outline = jsonToOutline(parsed);
          setOutputVal(outline);
          break;
        }

        case 'xml-to-json': {
          const jsonResult = xmlToJSON(inputVal);
          setOutputVal(JSON.stringify(jsonResult, null, indentWidth));
          break;
        }

        case 'json-to-xml': {
          const jsonParsed = JSON.parse(inputVal);
          const xmlOutput = `<?xml version="1.0" encoding="UTF-8" ?>\n` + jsonToXML(jsonParsed, 'root', ' '.repeat(indentWidth));
          setOutputVal(xmlOutput);
          break;
        }

        case 'csv-to-json': {
          const jsonRes = delimToJSON(inputVal, ',');
          setOutputVal(JSON.stringify(jsonRes, null, indentWidth));
          break;
        }

        case 'tsv-to-json': {
          const jsonRes = delimToJSON(inputVal, '\t');
          setOutputVal(JSON.stringify(jsonRes, null, indentWidth));
          break;
        }

        case 'json-to-csv': {
          const csvText = jsonToDelim(inputVal, ',');
          setOutputVal(csvText);
          break;
        }

        case 'json-to-tsv': {
          const tsvText = jsonToDelim(inputVal, '\t');
          setOutputVal(tsvText);
          break;
        }

        default:
          setOutputVal(inputVal);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error occurred during parsing processing cycles');
      setOutputVal('');
    }
  }, [inputVal, activeToolId, indentWidth]);

  // Attempt automatic heal repair
  const triggerSelfHealJson = () => {
    if (!inputVal.trim()) return;
    try {
      const repaired = repairSimpleJSON(inputVal);
      // Validate repaired text
      const parsed = JSON.parse(repaired);
      setInputVal(JSON.stringify(parsed, null, indentWidth));
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg('Self-Heal was unable to fix all syntactic glitches. Please fix double quotes or brackets structures manually.');
    }
  };

  // Quick action templates
  const loadTemplatesValue = (type: 'object' | 'array' | 'clear') => {
    if (type === 'clear') {
      setInputVal('');
      setOutputVal('');
      setErrorMsg(null);
      return;
    }
    const sample = type === 'object' 
      ? { status: "success", code: 200, debugMessage: "Active workspace" }
      : [{ item: "A", score: 95 }, { item: "B", score: 88 }];
    setInputVal(JSON.stringify(sample, null, indentWidth));
  };

  const copyResult = () => {
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get active descriptors
  const getToolTitle = () => {
    switch (activeToolId) {
      case 'json-viewer': return 'Interactive JSON Viewer';
      case 'json-validator': return 'Strict JSON Syntax Validator';
      case 'json-editor': return 'Structured JSON Workspace Editor';
      case 'json-minify': return 'JSON Minify';
      case 'xml-to-json': return 'XML Elements to JSON Converter';
      case 'json-to-xml': return 'JSON Objects to Standard XML Converter';
      case 'csv-to-json': return 'CSV spreadsheets to JSON Conversion';
      case 'tsv-to-json': return 'Tab Separated Values (TSV) to JSON Parser';
      case 'json-to-csv': return 'JSON Arrays to CSV Format Converter';
      case 'json-to-tsv': return 'JSON to Tab Separated Values (TSV) Encoder';
      case 'json-to-text': return 'JSON Flat text tree Outline Renderer';
      default: return 'JSON & Structured Data Converter';
    }
  };

  const getToolDescription = () => {
    switch (activeToolId) {
      case 'json-viewer': return 'Visualize complex, deeply nested JSON. Fully responsive tree with collapse toggles, data types, and filtering.';
      case 'json-validator': return 'Analyze JSON compliance. Highlight stray characters, pinpoint parsing offsets, and recover instantly.';
      case 'json-editor': return 'Maintain nested key structures, sort parameters alphabetically, and build scripts with responsive outline blocks.';
      case 'json-minify': return 'Compress pretty-printed JSON configurations down into a single line with zero spaces.';
      case 'xml-to-json': return 'Extract nested tags and matching attributes into readable JavaScript values immediately.';
      case 'json-to-xml': return 'Convert nested hashes to standard XML files. Auto-injects headers and child parameters safely.';
      case 'csv-to-json': return 'Convert rows of spreadsheet data (CSV format) into highly queryable JSON lists.';
      case 'tsv-to-json': return 'Convert tab-spaced records into a compliant array of structured Javascript collections.';
      case 'json-to-csv': return 'Generate row-based spreadsheet files with correct string escaping from lists of data.';
      case 'json-to-tsv': return 'Format data matrix collections into standard tab-separated clipboard records.';
      case 'json-to-text': return 'Visualize complex tree hierarchies as a beautiful text map/outline ideal for documentation.';
      default: return 'Advanced sandbox utility to convert, map, and process structured code configurations';
    }
  };

  const getInputCardLabel = () => {
    if (activeToolId.startsWith('json-to')) return 'INPUT SOURCE JSON STRINGS';
    if (activeToolId === 'xml-to-json') return 'RAW XML DOCUMENT INPUT';
    if (activeToolId.includes('delim') || activeToolId.includes('csv') || activeToolId.includes('tsv')) {
      return activeToolId.startsWith('csv') || activeToolId.startsWith('tsv') ? 'RAW MULTILINE SPREADSHEET INPUT' : 'INPUT SOURCE JSON ARRAYS';
    }
    return 'RAW USER DATA INTAKE';
  };

  const getOutputCardLabel = () => {
    if (activeToolId === 'json-viewer') return 'INTERACTIVE NESTED TREE PREVIEW';
    if (activeToolId.endsWith('xml')) return 'COMPILED XML SYNTAX TEXT';
    if (activeToolId.endsWith('csv') || activeToolId.endsWith('tsv')) return 'COMPILED DELIMITER ROWS';
    if (activeToolId.endsWith('text')) return 'GENERATED UTILITY SUMMARY OUTLINE';
    return 'PROCESSED JSON OUTPUT CONFIGURATION';
  };

  return (
    <div className="space-y-6">
      <div id="json-suite-container" className="p-6 bg-[#18181b]/95 border border-white/5 rounded-2xl shadow-xl space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2 font-mono">
              <span className="p-1 px-1.5 text-[9px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">DEV</span>
              {getToolTitle()}
            </h2>
            <p className="text-xs text-gray-400 mt-1">{getToolDescription()}</p>
          </div>

          {/* Core styling options */}
          <div className="flex gap-2 w-full md:w-auto items-center text-xs">
            {['json-viewer', 'json-validator', 'json-editor', 'xml-to-json', 'json-to-xml', 'csv-to-json', 'tsv-to-json'].includes(activeToolId) && (
              <div className="flex items-center gap-1.5 bg-[#09090b]/80 border border-white/5 p-1 px-2.5 rounded-lg">
                <span className="text-gray-500 font-mono text-[10px] uppercase">Indentation:</span>
                <select
                  value={indentWidth}
                  onChange={(e) => setIndentWidth(parseInt(e.target.value, 10))}
                  className="bg-transparent border-none text-white focus:outline-none cursor-pointer font-semibold font-mono"
                >
                  <option value="2">2 Spaces</option>
                  <option value="4">4 Spaces</option>
                  <option value="8">8 Spaces</option>
                </select>
              </div>
            )}

            <button
              onClick={() => {
                // simple refresh default string triggers trigger
                setInputVal(inputVal);
              }}
              title="Reset configuration values"
              className="p-1.5 px-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-gray-300 font-mono text-[11px] font-semibold"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Dynamic Controls Drawer for Specific Tools */}
        {activeToolId === 'json-viewer' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#09090b]/40 border border-white/5 rounded-xl text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">Interactive Node Search Key Filter</label>
              <div className="relative">
                <Icons.Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Type any tag, value text, or key identifier..."
                  className="w-full pl-9 pr-4 p-2 bg-[#09090b] border border-white/10 rounded font-mono text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/40"
                />
              </div>
            </div>

            <div className="flex flex-col justify-end items-start md:items-end font-mono text-[10px] text-gray-500">
              <p>Supports live filtering across deep closures</p>
              <p className="mt-0.5">Click chevron arrows to toggle tree fold states</p>
            </div>
          </div>
        )}

        {/* Dynamic Controls Drawer for Validator */}
        {activeToolId === 'json-validator' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#09090b]/80 border border-white/5 rounded-xl text-xs align-middle">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">LINTER TARGETS:</span>
              <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 border border-emerald-500/20 rounded">
                Strict RFC-8259 Schema Check
              </span>
            </div>

            <div className="font-mono text-[11px] text-gray-400 flex items-center">
              {validationContext.status === 'success' && (
                <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                  <Icons.CheckCircle className="w-4 h-4" />
                  JSON is valid ({validationContext.lineCount} Lines, {validationContext.charCount} Chars)
                </span>
              )}
              {validationContext.status === 'failed' && (
                <span className="text-rose-400 flex items-center gap-1.5 font-bold">
                  <Icons.XCircle className="w-4 h-4" />
                  Validation fault detected inside input code parameters
                </span>
              )}
              {validationContext.status === 'empty' && (
                <span className="text-gray-500">Missing input code payload details.</span>
              )}
            </div>

            {/* validation auto fixing help */}
            <div className="flex items-center justify-end">
              {errorMsg && (
                <button
                  onClick={triggerSelfHealJson}
                  className="flex items-center gap-1 p-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded text-[11px] font-mono text-amber-300 font-semibold"
                  title="Tries resolving basic misplaced quotes or stray commas"
                >
                  <Icons.Wand2 className="w-3.5 h-3.5 text-amber-400" />
                  Auto-Fix Minor Issues
                </button>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Controls Drawer for Editor */}
        {activeToolId === 'json-editor' && (
          <div className="flex gap-2 flex-wrap p-3 bg-[#09090b]/50 border border-white/5 rounded-xl text-xs font-mono">
            <button
              onClick={() => loadTemplatesValue('object')}
              className="p-1 px-3 bg-[#18181b] hover:bg-white/5 border border-white/5 rounded text-gray-300 hover:text-white"
            >
              + Create Template Object
            </button>
            <button
              onClick={() => loadTemplatesValue('array')}
              className="p-1 px-3 bg-[#18181b] hover:bg-white/5 border border-white/5 rounded text-gray-300 hover:text-white"
            >
              + Create Template Array
            </button>
            <button
              onClick={() => {
                try {
                  const parsed = JSON.parse(inputVal);
                  if (typeof parsed === 'object' && parsed !== null) {
                    // Sorting keys
                    const sortedKeys = Object.keys(parsed).sort();
                    const nextObj: Record<string, any> = {};
                    sortedKeys.forEach(k => {
                      nextObj[k] = parsed[k];
                    });
                    setInputVal(JSON.stringify(nextObj, null, indentWidth));
                  }
                } catch {
                  setErrorMsg('Keys Sorting failed. Verify structure is valid JSON.');
                }
              }}
              className="p-1 px-3 bg-[#18181b] hover:bg-white/5 border border-white/5 rounded text-indigo-300 hover:text-indigo-200"
            >
              ⇅ Sort Object Keys
            </button>
            <button
              onClick={() => loadTemplatesValue('clear')}
              className="p-1 px-3 bg-[#18181b] hover:bg-[#201515] border border-white/5 rounded text-rose-400"
            >
              Clear Buffer
            </button>
          </div>
        )}

        {/* WORKSPACE VIEWER CANVAS PANEL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input Panel Column */}
          <div className="space-y-2 flex flex-col">
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              <span>{getInputCardLabel()}</span>
              <span>Buffer size: {inputVal.length} chars</span>
            </div>

            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Supply structured inputs here to initiate conversion or linter validations..."
              rows={14}
              className="w-full p-4 bg-[#09090b] border border-white/5 rounded-xl text-[12.5px] text-gray-200 font-mono placeholder:text-gray-650 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-colors"
            />
          </div>

          {/* Output Panel Column */}
          <div className="space-y-2 flex flex-col">
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              <span>{getOutputCardLabel()}</span>
              <span className="text-emerald-500">Live Browser Renderer</span>
            </div>

            <div className="relative flex-grow">
              
              {/* If JSON Tree Viewer configuration is highlighted */}
              {activeToolId === 'json-viewer' && !errorMsg && outputVal ? (
                <div className="w-full h-72 sm:h-80 p-4 bg-[#0a0a0c] border border-white/5 rounded-xl overflow-y-auto overflow-x-auto">
                  {(() => {
                    try {
                      const rootValue = JSON.parse(inputVal);
                      return (
                        <div className="space-y-1">
                          <TreeViewerNode name="root" value={rootValue} depth={0} searchFilter={searchFilter} />
                        </div>
                      );
                    } catch {
                      return <span />;
                    }
                  })()}
                </div>
              ) : (
                <textarea
                  readOnly
                  value={outputVal}
                  placeholder="Formatted structural text outputs will yield back here..."
                  rows={14}
                  className="w-full p-4 bg-[#0a0a0c] border border-white/5 rounded-xl text-[12.5px] text-indigo-300 font-mono focus:outline-none placeholder:text-gray-700"
                />
              )}

              {/* Error overlay panels */}
              {errorMsg && (
                <div className="absolute inset-0 p-4 bg-red-950/95 border border-red-500/20 rounded-xl flex flex-col justify-center items-center text-center">
                  <Icons.AlertTriangle className="w-8 h-8 text-rose-500 mb-2" />
                  <span className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider">Parsing Interrupted</span>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-sm font-mono overflow-hidden text-ellipsis">{errorMsg}</p>
                </div>
              )}
            </div>

            {/* Save Copy utilities */}
            <div className="flex justify-between items-center">
              {activeToolId === 'json-validator' && !errorMsg && validationContext.status === 'success' ? (
                <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/25 px-2.5 py-1 rounded border border-emerald-500/20">
                  <Icons.BadgeCheck className="w-3.5 h-3.5" /> Strict JSON Validated successfully
                </span>
              ) : <span />}

              {outputVal && !errorMsg && (
                <button
                  onClick={copyResult}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 px-3 rounded border border-white/5 transition-colors self-end ml-auto"
                >
                  {copied ? (
                    <>
                      <Icons.Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Output!</span>
                    </>
                  ) : (
                    <>
                      <Icons.Copy className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Copy Result</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Informative summary footer advice */}
        <div className="border-t border-white/5 pt-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            <Icons.BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Under the hood - offline logic properties</span>
          </div>
          <p className="text-xs text-gray-500 font-mono leading-relaxed p-4 bg-[#09090b] border border-white/5 rounded-xl">
            This module operates inside a secure front-end sandbox environment without transferring your configuration settings to foreign servers. Feel free to use heavy payload blocks securely.
          </p>
        </div>

      </div>
    </div>
  );
}
