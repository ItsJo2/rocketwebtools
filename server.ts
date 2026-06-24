import express from "express";
import path from "path";
import dns from "dns";
import fs from "fs";
import tls from "tls";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Check server health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API: Get client request headers and IP
app.get("/api/visitor-info", (req, res) => {
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "Unknown";
  
  // Return request headers to visualize
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") {
      headers[key] = value;
    }
  }

  res.json({ ip, headers, userAgent });
});

// API: Perform actual DNS Lookup
app.post("/api/dns-lookup", (req, res) => {
  const { domain } = req.body;
  if (!domain || typeof domain !== "string") {
    return res.status(400).json({ error: "A valid domain is required." });
  }

  // Clean domain name from standard prefixes
  let hostname = domain.trim().toLowerCase();
  hostname = hostname.replace(/^(https?:\/\/)?(www\.)?/, "");
  hostname = hostname.split("/")[0].split(":")[0];

  const results: Record<string, string[]> = {};
  const queryTypes = ["A", "AAAA", "MX", "TXT", "NS", "CNAME"] as const;
  let completed = 0;

  queryTypes.forEach((type) => {
    dns.resolve(hostname, type, (err, addresses) => {
      if (!err && addresses) {
        if (type === "MX") {
          results[type] = (addresses as any[]).map(
            (addr) => `Priority ${addr.priority} -> ${addr.exchange}`
          );
        } else {
          results[type] = Array.isArray(addresses)
            ? (addresses as string[]).map(String)
            : [String(addresses)];
        }
      } else {
        // Log or safe empty
        results[type] = [];
      }

      completed++;
      if (completed === queryTypes.length) {
        // Return results
        res.json({ domain: hostname, records: results });
      }
    });
  });
});

// API: Geo IP Address Lookup
app.post("/api/ip-lookup", async (req, res) => {
  const { ip } = req.body;
  if (!ip || typeof ip !== "string") {
    return res.status(400).json({ error: "A valid IP address target is required." });
  }
  
  try {
    const cleanIp = ip.trim();
    // Fetch geo information securely from public ip-api.com
    const response = await fetch(`http://ip-api.com/json/${encodeURIComponent(cleanIp)}`);
    if (!response.ok) {
      throw new Error(`Geographic provider returned bad status (HTTP ${response.status})`);
    }
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Unable to retrieve IP mapping coordinates." });
  }
});

// GET: Dynamic SEO XML Sitemap
app.get("/sitemap.xml", (req, res) => {
  try {
    const appTsxContent = fs.readFileSync(path.join(process.cwd(), "src/App.tsx"), "utf-8");
    // Find all instantiated id parameters: e.g. { id: 'html-decode', ... }
    const matches = [...appTsxContent.matchAll(/id:\s*'([a-zA-Z0-9_-]+)'/g)];
    const toolIds = Array.from(new Set(matches.map(m => m[1])));

    const host = req.headers["x-forwarded-host"] || req.headers.host || "rocketwebtools.com";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const baseUrl = `${protocol}://${host}`;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Home page
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // 2. Legal Policy & Contact Pages
    const pages = ["privacy", "terms", "about-contact"];
    pages.forEach(page => {
      xml += `  <url>\n    <loc>${baseUrl}/?page=${page}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // 3. Dynamic Tool Sub-pages
    toolIds.forEach(id => {
      // Exclude values that aren't tool IDs (like state matches, routing keys)
      if (!["privacy", "terms", "about-contact", "all", "starred", "development", "text", "network", "utility", "ai", "image", "calculator", "binary", "web-mgmt"].includes(id)) {
        xml += `  <url>\n    <loc>${baseUrl}/?tool=${id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      }
    });

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (error) {
    console.error("Failed to generate sitemap.xml dynamic index:", error);
    res.status(500).send("Error compiling sitemap index");
  }
});

// Lazy-loaded Gemini AI helper
let aiClient: GoogleGenAI | null = null;
function getAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.includes("MY_GEMINI_API_KEY")) {
    throw new Error("GEMINI_API_KEY environment variable is not configured in the Secrets panel.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API: AI-powered helper tools
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { mode, text, option } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text prompt input is required." });
    }

    const ai = getAI();
    let promptString = "";
    let systemInstruction = "You are a highly efficient web assistant producing clean output.";

    if (mode === "rephrase") {
      systemInstruction = "You are an expert editor. Output ONLY the rephrased or translated text. Do not provide chatty introductions, explanations, or code blocks unless requested. Keep formatting.";
      promptString = `Please translate or rephrase the following content into a ${option || "professional"} style/language:
\n\n"${text}"`;
    } else if (mode === "regex") {
      systemInstruction = "You are a regex engineer. Generate precise regular expressions and explanations. Be direct and clean.";
      if (option === "explain") {
        promptString = `Deconstruct and explain this regular expression pattern in simple developer-friendly markdown: \`${text}\``;
      } else {
        promptString = `Build a high-performance regular expression pattern for this requested scenario: "${text}". Include the regex clearly on a line inside a code block, then add a 2-sentence explanation of how it works.`;
      }
    } else if (mode === "code_comments") {
      systemInstruction = "You are a seasoned software architect. Paste back the completed code with beautiful, highly readable dock comments, annotations, and brief inline helper notes.";
      promptString = `Analyze the code below and add high-quality comments, type annotations if necessary, and clean docstrings. Return the commented code directly inside a markdown code block:

\`\`\`
${text}
\`\`\`
`;
    } else if (mode === "social_caption") {
      systemInstruction = "You are an expert social media manager and copywriter. Produce engaging, click-worthy social media content with multiple platform variations, target hashtags, and energetic hooks.";
      promptString = `Generate an optimized social media caption or post for the target platform: ${option || "Instagram"}. The theme, text, or query is:\n\n"${text}"\n\nInclude a hook line, beautiful spacing, and 5-10 relevant trending hashtags.`;
    } else if (mode === "email_drafter") {
      systemInstruction = "You are a skilled communications expert and corporate email write assistant. Structure formal or informal emails beautifully with a clear Subject Line and styled Body structure.";
      promptString = `Draft a comprehensive email based on these notes or prompt with an targeted tone of "${option || "Professional"}":\n\n"${text}"\n\nOutput should contain clear Subject: [Subject] and Body elements without any conversational preamble.`;
    } else if (mode === "code_translator") {
      systemInstruction = "You are an expert polyglot programmer who translates code files securely between languages. Output ONLY the translated code formatted inside an appropriate code block, preserving comments and original program flow.";
      promptString = `Translate the following source code into the target language of "${option || "TypeScript"}" beautifully and precisely:\n\n\`\`\`\n${text}\n\`\`\``;
    } else {
      promptString = text;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptString,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    if (!response || !response.text) {
      throw new Error("No response or empty content returned from Gemini AI.");
    }

    res.json({ output: response.text });
  } catch (err: any) {
    console.error("Gemini route error:", err);
    res.status(500).json({
      error: err.message || "An error occurred while calling the AI model. Check your API configuration.",
    });
  }
});

// Helper: Query SSL Certificate stats on port 443
function getSslMetadata(hostname: string): Promise<any> {
  return new Promise((resolve) => {
    try {
      const socket = tls.connect({
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false
      }, () => {
        const cert = socket.getPeerCertificate();
        if (cert && Object.keys(cert).length > 0) {
          resolve({
            subject: cert.subject,
            issuer: cert.issuer,
            valid_from: cert.valid_from,
            valid_to: cert.valid_to,
            serialNumber: cert.serialNumber,
            protocol: socket.getProtocol(),
            cipher: socket.getCipher() ? socket.getCipher().name : "Unknown",
            authorized: socket.authorized
          });
        } else {
          resolve(null);
        }
        socket.destroy();
      });

      socket.on('error', (e) => {
        console.log("TLS Cert Socket error:", e.message);
        resolve(null);
      });

      socket.setTimeout(2500, () => {
        socket.destroy();
        resolve(null);
      });
    } catch (err) {
      console.log("TLS Cert connect failed:", err);
      resolve(null);
    }
  });
}

// API: Redirect & Header Inspect Proxy Code
app.post("/api/inspect-url", async (req, res) => {
  let { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "A valid URL address to inspect is required." });
  }

  url = url.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  try {
    let currentUrl = url;
    const hops: { url: string; status: number; statusText: string }[] = [];
    const maxHops = 5;
    let finalResponse: Response | null = null;

    for (let i = 0; i < maxHops; i++) {
      const startTime = Date.now();
      const response = await fetch(currentUrl, {
        method: "HEAD",
        redirect: "manual",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SEO-Inspector/1.0"
        }
      });
      const responseTime = Date.now() - startTime;

      hops.push({
        url: currentUrl,
        status: response.status,
        statusText: response.statusText || `${response.status}`
      });

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (location) {
          currentUrl = new URL(location, currentUrl).toString();
        } else {
          finalResponse = response;
          break;
        }
      } else {
        finalResponse = response;
        break;
      }
    }

    // Now, if we finished redirection or hit the max hops, do a full GET on the current URL
    // to secure all detailed headers:
    const startTimeGet = Date.now();
    const finalResponseGet = await fetch(currentUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SEO-Inspector/1.0"
      }
    });
    const finalResponseTime = Date.now() - startTimeGet;

    const finalHeaders: Record<string, string> = {};
    finalResponseGet.headers.forEach((v, k) => {
      finalHeaders[k] = v;
    });

    // Try parsing hostname to secure SSL certificate particulars
    let sslData = null;
    try {
      const parsedUrl = new URL(currentUrl);
      if (parsedUrl.protocol === "https:") {
        sslData = await getSslMetadata(parsedUrl.hostname);
      }
    } catch (sslErr) {
      console.log("Failed resolving SSL parameters:", sslErr);
    }

    res.json({
      hops,
      finalUrl: currentUrl,
      status: finalResponseGet.status,
      statusText: finalResponseGet.statusText,
      responseTimeMs: finalResponseTime,
      headers: finalHeaders,
      ssl: sslData
    });

  } catch (err: any) {
    console.error("URL Inspection failed:", err);
    res.status(500).json({
      error: err.message || "Unable to retrieve the target host or connection timed out."
    });
  }
});

// Configure Vite or Static Assets based on environment
async function setupViteAndListen() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in Development Mode (Vite Middleware)");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in Production Mode (Static Assets)");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Development Server listening at http://localhost:${PORT}`);
  });
}

setupViteAndListen().catch((err) => {
  console.error("Vite setup failure:", err);
  process.exit(1);
});
