import React from 'react';

export function TopAdBanner() {
  return (
    <>
      <div 
        className="w-full max-w-5xl mx-auto mb-6 h-[90px] bg-[#0a0a0a]/50 border border-dashed border-white/5 rounded-xl relative overflow-hidden flex items-center justify-center" 
        id="ad-top-banner"
      >
        <a href="https://www.hostinger.com/ae?REFERRALCODE=ROUJIHEDLE8T" target="_blank" rel="noopener noreferrer sponsored" aria-label="Hostinger Web Hosting">
          <img src="/banners/hostinger_banner_728x90.png" alt="Hostinger - AI Website Builder Sale" width="728" height="90" className="w-full object-cover rounded-lg max-h-[90px]" />
        </a>
      </div>
      <p className="text-center text-[10px] text-gray-500 mt-1 font-mono">
        Sponsored — we may earn a commission at no cost to you
      </p>
    </>
  );
}

export function BottomAdBanner() {
  return (
    <div 
      className="w-full max-w-5xl mx-auto mt-10 h-[90px] bg-[#0a0a0a]/50 border border-dashed border-white/5 rounded-xl relative overflow-hidden flex items-center justify-center" 
      id="ad-bottom-banner"
    >
      <a href="https://www.hostinger.com/ae?REFERRALCODE=ROUJIHEDLE8T" target="_blank" rel="noopener noreferrer sponsored" aria-label="Hostinger Web Hosting">
        <img src="/banners/hostinger_banner_728x90.png" alt="Hostinger - AI Website Builder Sale" width="728" height="90" className="w-full object-cover rounded-lg max-h-[90px]" />
      </a>
    </div>
  );
}

export function SidebarAdSkyscraper({ side }: { side: 'left' | 'right' }) {
  return (
    <div 
      className="hidden xl:flex flex-col gap-5 shrink-0 w-[300px] sticky top-24" 
      id={`ad-sidebar-${side}`}
    >
      {/* 300x250 Ad Box 1 */}
      <div className="w-[300px] h-[250px] bg-[#0a0a0a]/50 border border-dashed border-white/5 rounded-2xl relative shadow-lg flex flex-col items-center justify-center overflow-hidden hover:border-white/10 transition-all group">
        {side === 'left' ? (
          <a href="https://referral.bluehost.com/jihedlajili55!bd7fed8ba3!a" target="_blank" rel="noopener noreferrer sponsored" aria-label="Bluehost Web Hosting" className="w-full h-full">
            <img src="/banners/bluehost_banner_300x250.png" alt="Bluehost - The Best Web Hosting" width="300" height="250" className="w-full h-full object-cover rounded-lg" />
          </a>
        ) : (
          <a href="https://www.hostinger.com/ae?REFERRALCODE=ROUJIHEDLE8T" target="_blank" rel="noopener noreferrer sponsored" aria-label="Hostinger Web Hosting" className="w-full h-full">
            <img src="/banners/hostinger_banner_300x250.png" alt="Hostinger - AI Website Builder Sale" width="300" height="250" className="w-full h-full object-cover rounded-lg" />
          </a>
        )}
      </div>
      
      {/* 300x250 Ad Box 2 */}
      <div className="w-[300px] h-[250px] bg-[#0a0a0a]/50 border border-dashed border-white/5 rounded-2xl relative shadow-lg flex flex-col items-center justify-center overflow-hidden hover:border-white/10 transition-all group">
        {side === 'left' ? (
          <a href="https://www.greengeeks.com/track/itsjo" target="_blank" rel="noopener noreferrer sponsored" aria-label="GreenGeeks Web Hosting" className="w-full h-full">
            <img src="/banners/greengeeks_banner_300x250.png" alt="GreenGeeks - Eco-Friendly Web Hosting" width="300" height="250" className="w-full h-full object-cover rounded-lg" />
          </a>
        ) : (
          <a href="https://my.hosting.com/aff/ba070684070edaad5a42fae4f1864b0f22e69bbd" target="_blank" rel="noopener noreferrer sponsored" aria-label="Hosting.com Web Hosting" className="w-full h-full">
            <img src="/banners/hosting_shared_banner_300x250.png" alt="Hosting.com - Powerful Hosting" width="300" height="250" className="w-full h-full object-cover rounded-lg" />
          </a>
        )}
      </div>
    </div>
  );
}
