import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

interface CookieBannerProps {
  isDark: boolean;
}

export function CookieBanner({ isDark }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('rwt_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('rwt_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('rwt_cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop blur on mobile */}
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] sm:hidden" />

      {/* Banner */}
      <div
        className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50 rounded-2xl border shadow-2xl transition-all duration-300 ${
          isDark
            ? 'bg-[#111113] border-white/10 shadow-black/60'
            : 'bg-white border-gray-200 shadow-gray-200/80'
        }`}
      >
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isDark ? 'bg-orange-500/10' : 'bg-orange-50'
              }`}>
                <Icons.Cookie className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Cookie Settings
                </p>
                <p className={`text-[10px] font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  rocketwebtools.com
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDecline}
              aria-label="Decline and close cookie banner"
              className={`p-1 rounded-lg transition-colors shrink-0 ${
                isDark
                  ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            We use cookies for advertising (Google AdSense) and to remember your preferences like dark mode and starred tools. Your tool inputs are never stored or tracked.
          </p>

          {/* Details toggle */}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
            className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
              isDark
                ? 'text-gray-500 hover:text-gray-300'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icons.ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            {showDetails ? 'Hide details' : 'What do we use cookies for?'}
          </button>

          {/* Details panel */}
          {showDetails && (
            <div className={`rounded-xl border p-3 space-y-2.5 text-[11px] ${
              isDark ? 'bg-white/3 border-white/5' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start gap-2">
                <Icons.CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Essential cookies</p>
                  <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>Theme preference, starred tools, recently used tools. Always active.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Icons.Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Advertising cookies</p>
                  <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>Google AdSense serves ads to keep this site free. These are third-party cookies managed by Google.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Icons.XCircle className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>What we never do</p>
                  <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>We never sell your data, track your tool inputs, or share personal information with third parties.</p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleDecline}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/8 text-gray-300 hover:bg-white/10'
                  : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Decline optional
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all"
            >
              Accept all
            </button>
          </div>

          {/* Privacy link */}
          <p className={`text-[10px] text-center font-mono ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            Read our{' '}
            <button
              type="button"
              className="underline hover:text-orange-500 transition-colors"
              onClick={() => {
                handleDecline();
                // Navigate to privacy page - dispatch a custom event
                window.dispatchEvent(new CustomEvent('navigate-to-privacy'));
              }}
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
