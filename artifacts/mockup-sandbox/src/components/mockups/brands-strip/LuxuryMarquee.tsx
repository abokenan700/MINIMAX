import React, { useState } from 'react';
import './_group.css';

const BRANDS = [
  "نايك",
  "أديداس",
  "بوما",
  "نيو بالانس",
  "ريبوك",
  "فيلا",
  "أنبر",
  "فيلكرو"
];

export function LuxuryMarquee() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div 
      className="w-full max-w-[390px] mx-auto overflow-hidden relative cursor-pointer shadow-sm group"
      style={{
        background: 'linear-gradient(135deg, #FDFBF7 0%, #F3EBD8 50%, #E8D5B5 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.4)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.4)',
      }}
      onClick={() => setIsPaused(!isPaused)}
      title="Click to pause/play"
    >
      <div 
        className="flex whitespace-nowrap items-center py-3.5 luxury-marquee-track"
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
          direction: 'ltr' 
        }}
      >
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <React.Fragment key={i}>
            <button 
              dir="rtl"
              className="text-[#4A3B2C] font-semibold text-sm px-6 hover:text-[#B8860B] transition-colors whitespace-nowrap focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {brand}
            </button>
            <span className="text-[#D4AF37] text-[9px] opacity-70 select-none">◆</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
