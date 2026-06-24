import React from 'react';

export function TopAdBanner() {
  return (
    <div 
      className="w-full max-w-5xl mx-auto mb-6 h-[90px] bg-[#0a0a0a]/50 border border-dashed border-white/5 rounded-xl relative overflow-hidden flex items-center justify-center" 
      id="ad-top-banner"
    >
      <div className="text-[10px] uppercase tracking-widest font-mono text-white/10 select-none">
        Advertisement Space
      </div>
    </div>
  );
}

export function BottomAdBanner() {
  return (
    <div 
      className="w-full max-w-5xl mx-auto mt-10 h-[90px] bg-[#0a0a0a]/50 border border-dashed border-white/5 rounded-xl relative overflow-hidden flex items-center justify-center" 
      id="ad-bottom-banner"
    >
      <div className="text-[10px] uppercase tracking-widest font-mono text-white/10 select-none">
        Advertisement Space
      </div>
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
        <div className="absolute top-2 left-3 bg-white/5 border border-white/5 rounded text-[8px] font-mono font-bold tracking-widest text-white/30 px-1.5 py-0.5 select-none uppercase">
          Ad Space ({side === 'left' ? 'L1' : 'R1'})
        </div>
        <div className="text-[10px] uppercase tracking-widest font-mono text-white/15 select-none font-bold">
          300 x 250 Banner
        </div>
        <div className="text-[9px] text-white/5 font-mono mt-1 group-hover:text-white/10 transition-colors">
          Place Ad Code Here
        </div>
      </div>
      
      {/* 300x250 Ad Box 2 */}
      <div className="w-[300px] h-[250px] bg-[#0a0a0a]/50 border border-dashed border-white/5 rounded-2xl relative shadow-lg flex flex-col items-center justify-center overflow-hidden hover:border-white/10 transition-all group">
        <div className="absolute top-2 left-3 bg-white/5 border border-white/5 rounded text-[8px] font-mono font-bold tracking-widest text-white/30 px-1.5 py-0.5 select-none uppercase">
          Ad Space ({side === 'left' ? 'L2' : 'R2'})
        </div>
        <div className="text-[10px] uppercase tracking-widest font-mono text-white/15 select-none font-bold">
          300 x 250 Banner
        </div>
        <div className="text-[9px] text-white/5 font-mono mt-1 group-hover:text-white/10 transition-colors">
          Place Ad Code Here
        </div>
      </div>
    </div>
  );
}
