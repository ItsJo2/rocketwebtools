import React from 'react';
import * as Icons from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

export function LegalPages({ type, onBack }: LegalPageProps) {
  const lastUpdated = "June 21, 2026";
  const { isDark } = useTheme();

  const t = isDark ? {
    panelBg: 'bg-[#141414]',
    border: 'border-white/5',
    borderStrong: 'border-white/10',
    text: 'text-gray-300',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-400',
    textMuted: 'text-gray-500',
    badgeBg: 'bg-gray-500/10'
  } : {
    panelBg: 'bg-gray-100',
    border: 'border-gray-200',
    borderStrong: 'border-gray-200',
    text: 'text-gray-700',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-550',
    textMuted: 'text-gray-450',
    badgeBg: 'bg-gray-200'
  };

  if (type === 'privacy') {
    return (
      <div className="space-y-8 font-sans max-w-4xl mx-auto" id="privacy-policy-view">
        {/* Header Breadcrumbs */}
        <div className={`flex items-center justify-between border-b ${t.border} pb-4`}>
          <button
            type="button"
            onClick={onBack}
            className={`flex items-center gap-2 text-xs font-semibold p-2 px-4 ${t.panelBg} border ${t.borderStrong} hover:border-orange-550/40 rounded-full ${t.text} hover:${t.textPrimary} transition-all cursor-pointer`}
          >
            <Icons.ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Toolbox</span>
          </button>
          <span className={`text-[10px] font-mono ${t.textMuted} uppercase tracking-widest ${t.badgeBg} px-2.5 py-1 rounded`}>
            Compliance Document
          </span>
        </div>

        {/* Article content */}
        <div className={`space-y-6 text-sm ${t.text} leading-relaxed`}>
          <div className="space-y-2">
            <h1 className={`text-3xl font-black ${t.textPrimary} tracking-tight flex items-center gap-2.5`}>
              <Icons.Shield className="w-8 h-8 text-orange-500" />
              Privacy Policy
            </h1>
            <p className={`text-xs ${t.textMuted} font-mono`}>Last Updated: {lastUpdated} &bull; Version 1.25</p>
          </div>

          <div className="p-4 bg-orange-500/5 border border-orange-500/15 rounded-xl text-xs text-orange-400 font-medium">
            <span className="font-bold uppercase tracking-wider block mb-1 font-mono">On-Device Client-Private Core Directive</span>
            Rocket Web Tools processes your digital entries, images, biometrics, text inputs, and cryptographic requirements directly inside your own web browser using safe client-side JavaScript APIs. Your data does not get uploaded to external server environments or tracked by default unless explicitly specified under safe API protocols.
          </div>

          <section className="space-y-3">
            <h2 className={`text-lg font-bold ${t.textPrimary} border-b ${t.border} pb-1 select-none`}>1. Information We Collect</h2>
            <p>
              We process data through two main vectors: developer tools operating purely client-side, and minor third-party utilities that require remote API handshakes.
            </p>
            <ul className={`list-disc pl-5 space-y-1.5 text-xs ${t.textSecondary}`}>
              <li>
                <strong className={t.textPrimary}>Client-Controlled Sandbox:</strong> For tools like Base64 compilers, JSON Validators, cryptographic checksum calculators, image conversion processes, and biometric calculators (such as BMR & TDEE calculators), execution occurs locally. No raw text, files, or sensitive metadata values leave your local device.
              </li>
              <li>
                <strong className={t.textPrimary}>API-Enabled Gateways:</strong> Tools marked as "Secure API" perform handshakes with our authorized API cloud routes (e.g. rephrasing strings with Gemini). We ensure SSL/TLS encryptions apply during transit.
              </li>
              <li>
                <strong className={t.textPrimary}>Automatic Connection Telemetry:</strong> Standard logs containing browser client headers, IP addresses, screen width calibrations, and standard cookie preferences may be catalogued briefly to manage request queues or protect system stability.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className={`text-lg font-bold ${t.textPrimary} border-b ${t.border} pb-1 select-none`}>2. Google AdSense & Cookies Disclosures</h2>
            <p>
              This website displays contextually relevant web graphics and placements funded by Google and third-party advertising companies. Therefore, we declare the following metrics:
            </p>
            <ul className={`list-disc pl-5 space-y-2 text-xs ${t.textSecondary}`}>
              <li>
                <strong className={t.textPrimary}>Double-Click DART Cookies:</strong> Google, as a third-party vendor, uses specialized cookies (such as DART cookies) to serve active commercial banners on our pages based on your historical visits across the internet network.
              </li>
              <li>
                <strong className={t.textPrimary}>Information Choice:</strong> You have full control to decline, terminate, or adjust specific DART cookie preferences or advertising vectors by visiting the personal privacy declarations located at the official Google Ad and Content Network Privacy Policy.
              </li>
              <li>
                <strong className={t.textPrimary}>Web Beacons:</strong> Third-party ad networks may employ cookies, JavaScript routines, or web beacons to trace campaign efficiencies directly. We possess no supervisory authority or monitoring capabilities over these external tracking mechanisms.
              </li>
              <li>
                <strong className={t.textPrimary}>Cookie Consent & Preferences:</strong> We use essential cookies to remember your preferences (theme, starred tools). We also use Google AdSense advertising cookies to serve ads that keep this service free. You can decline optional cookies using the cookie banner. Essential cookies cannot be disabled as they are required for the site to function correctly.
              </li>
              <li>
                <strong className={t.textPrimary}>Google Analytics Tracking:</strong> We use Google Analytics to understand how visitors use Rocket Web Tools, such as which tools are most popular and how people navigate the site. IP addresses are anonymized before processing. This data helps us improve the service and is never sold or shared with third parties beyond Google&apos;s standard analytics processing. You can decline analytics cookies using the cookie consent banner, and you can also opt out of Google Analytics tracking entirely using the Google Analytics Opt-out Browser Add-on available at <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-500">https://tools.google.com/dlpage/gaoptout</a>.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className={`text-lg font-bold ${t.textPrimary} border-b ${t.border} pb-1 select-none`}>3. California Consumer Privacy Act (CCPA)</h2>
            <p>
              Under California consumer criteria, California visitors retain the right to:
            </p>
            <ul className={`list-disc pl-5 space-y-1.5 text-xs ${t.textSecondary}`}>
              <li>Request full breakdowns of specific general informational categories gathered relative to consumer profiles.</li>
              <li>Request direct erasure of static connection metadata records held by our operations.</li>
              <li>Instruct our servers to refrain from selling personal customer details of any type. (Note: Rocket Web Tools does not barter or sell visitor connection data to brokers).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className={`text-lg font-bold ${t.textPrimary} border-b ${t.border} pb-1 select-none`}>4. General Data Protection Regulation (GDPR)</h2>
            <p>
              European Union residents enjoy comprehensive regulatory safeguards. If you visit our toolsets from the EU, you are legally entitled to:
            </p>
            <ul className={`list-disc pl-5 space-y-1.5 text-xs ${t.textSecondary}`}>
              <li><strong className={t.textPrimary}>The Right of Access:</strong> Review complete lists of connection parameters recorded for security.</li>
              <li><strong className={t.textPrimary}>The Right of Rectification:</strong> Ask us to rectify containing lists or typos that appear inside support logs.</li>
              <li><strong className={t.textPrimary}>The Right of Erasure:</strong> Claim swift deletion of your communication logs under reasonable conditions.</li>
              <li><strong className={t.textPrimary}>The Right to Limit Processing:</strong> Restrict programmatic analysis of query traces safely.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className={`text-lg font-bold ${t.textPrimary} border-b ${t.border} pb-1 select-none`}>5. Third-Party Links & Integrations</h2>
            <p>
              Our utility directories may contain link vectors referencing outer design tool repositories or developer frameworks. Please be advised that their legal rules differ. Rocket Web Tools assumes zero responsibility for legal practices outside our immediate domain scope.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className={`text-lg font-bold ${t.textPrimary} border-b ${t.border} pb-1 select-none`}>6. Policy Modulations</h2>
            <p>
              We reserve immediate rights to update or alter portions of these privacy policies to ensure compliance with global changes in privacy legal standards. Users may review current revision metadata logs on this page at any time.
            </p>
          </section>

          <div className={`p-4 ${t.panelBg} ${t.border} rounded-xl text-center space-y-1`}>
            <span className={`text-xs ${t.textMuted} font-semibold block`}>Questions Regarding Data Integrity & Privacy?</span>
            <span className="text-xs text-orange-400">
              Reach out directly to our compliance unit via our <strong className="text-orange-400">Contact Form</strong>.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // TERMS OF SERVICE
  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto" id="terms-of-service-view">
      {/* Header Breadcrumbs */}
      <div className={`flex items-center justify-between border-b ${t.border} pb-4`}>
        <button
          type="button"
          onClick={onBack}
          className={`flex items-center gap-2 text-xs font-semibold p-2 px-4 ${t.panelBg} border ${t.borderStrong} hover:border-orange-550/40 rounded-full ${t.text} hover:${t.textPrimary} transition-all cursor-pointer`}
        >
          <Icons.ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Toolbox</span>
        </button>
        <span className={`text-[10px] font-mono ${t.textMuted} uppercase tracking-widest ${t.badgeBg} px-2.5 py-1 rounded`}>
          Usage Agreement
        </span>
      </div>

      {/* Article content */}
      <div className={`space-y-6 text-sm ${t.text} leading-relaxed`}>
        <div className="space-y-2">
          <h1 className={`text-3xl font-black ${t.textPrimary} tracking-tight flex items-center gap-2.5`}>
            <Icons.BookOpen className="w-8 h-8 text-orange-500" />
            Terms of Service
          </h1>
          <p className={`text-xs ${t.textMuted} font-mono`}>Last Updated: {lastUpdated} &bull; Document Version 1.10</p>
        </div>

        <section className="space-y-3">
          <h2 className={`text-lg font-bold ${t.textPrimary} border-b ${t.border} pb-1 select-none`}>1. Acceptance of Terms</h2>
          <p>
            By accessing Rocket Web Tools, opening our local computational panels, using our translation integrations, or performing bulk files manipulation in-browser, you consent to be bound by these functional Terms of Service. If you disagree with any terms defined, you must immediately suspend operation of our platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className={`text-lg font-bold ${t.textPrimary} border-b ${t.border} pb-1 select-none`}>2. Code-of-Conduct & Permitted Activities</h2>
          <p>
            We supply web tools for ethical developer operations, design composition pipelines, and standard everyday mathematical estimations. You explicitly agree not to:
          </p>
          <ul className={`list-disc pl-5 space-y-1.5 text-xs ${t.textSecondary}`}>
            <li>Execute rapid robotic bulk querying scripts designed to overwhelm external APIs (such as our AI text wrappers).</li>
            <li>Inject malicious files, cross-site scripting (XSS) vectors, or byte-level code exploits designed to intercept other client frames.</li>
            <li>Use cryptographic tools under fraudulent intentions or build content mimicking official digital agency interfaces.</li>
            <li>Conduct programmatic scrapings designed to harvest intellectual structures from our frontend library.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className={`text-lg font-bold ${t.textPrimary} border-b ${t.border} pb-1 select-none`}>3. Intellectual Property (IP) Boundaries</h2>
          <p>
            All utility calculations, tool architectures, responsive visual mock templates, and unique logos are the exclusive property of Rocket Web Tools developers.
          </p>
          <ul className={`list-disc pl-5 space-y-1.5 text-xs ${t.textSecondary}`}>
            <li>
              You receive a perpetual, non-exclusive, fully revocable virtual license to use these browser toolsets for personal or business workflows (such as formatting client JSON scripts or scaling business assets).
            </li>
            <li>
              You may download outputs created by the calculators, converters, and generators without paying licensing royalties. Outputs are entirely your property.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className={`text-lg font-bold ${t.textPrimary} border-b ${t.border} pb-1 select-none`}>4. Warranty Disclaimers</h2>
          <p className={`italic ${t.textSecondary}`}>
            "Rocket Web Tools are provided 'AS IS' and 'AS AVAILABLE' without warranties of any variety, express or implied."
          </p>
          <p>
            While our development team spends significant time validating calculation bounds and processing formulas (e.g. Stripe/PayPal fee estimations, average standard derivations, loan payment percentages), we do not guarantee total numerical perfection. Real-world financial results may deviate due to regulatory updates, external credit variations, or complex fractional rounding. You operate these calculators at your own sole liability.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className={`text-lg font-bold ${t.textPrimary} border-b ${t.border} pb-1 select-none`}>5. Limitations of Liability</h2>
          <p>
            In no event shall Rocket Web Tools developers, stakeholders, or system operators be liable for direct, secondary, collateral, or punitive financial damage (including lost project profits, network disruptions, or unvalidated code results) linked directly to the application.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className={`text-lg font-bold ${t.textPrimary} border-b ${t.border} pb-1 select-none`}>6. Governing Regulations and Arbitration</h2>
          <p>
            Any disputes arising from these utility tools shall be assessed exclusively under regional commerce regulations. Users consent to resolve matters via professional mediation panels before filing formal litigation requests.
          </p>
        </section>
      </div>
    </div>
  );
}
