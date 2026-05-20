import React, { useState } from "react";
import "./_group.css";

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

export function DarkCinematic() {
  const [activeBrand, setActiveBrand] = useState<string>("نايك");

  return (
    <div 
      className="w-full bg-[#0a0a0a] min-h-[100dvh] flex flex-col items-center pt-24 font-sans text-white"
      dir="rtl"
    >
      <div className="w-[390px] px-4 flex flex-col gap-6">
        <h2 className="text-xl font-medium text-[#d4af37] px-2" style={{ fontFamily: "serif" }}>الماركات العالمية</h2>
        
        <div className="w-full relative">
          {/* Subtle top/bottom borders to frame the strip like a cinematic letterbox */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent"></div>
          
          <div className="flex overflow-x-auto hide-scrollbar gap-4 py-6 px-2 snap-x snap-mandatory">
            {BRANDS.map((brand) => {
              const isActive = activeBrand === brand;
              
              return (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`
                    relative shrink-0 snap-center rounded-sm overflow-hidden transition-all duration-500 ease-out
                    flex items-center justify-center
                    ${isActive ? 'w-32 h-40 scale-100' : 'w-24 h-32 scale-95 opacity-70'}
                  `}
                  style={{
                    backgroundColor: "#111",
                    boxShadow: isActive 
                      ? "inset 0 -20px 40px -10px rgba(212, 175, 55, 0.4), 0 10px 30px -10px rgba(0,0,0,0.8)" 
                      : "inset 0 0 0 1px rgba(255,255,255,0.05), 0 4px 20px -5px rgba(0,0,0,0.5)",
                    border: isActive ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid transparent",
                  }}
                >
                  {/* Dramatic bottom glow for active item */}
                  <div 
                    className={`absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#d4af37]/30 to-transparent transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  />
                  
                  {/* Cinematic grain overlay */}
                  <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

                  <span 
                    className={`relative z-10 font-bold tracking-wider transition-all duration-500 ${isActive ? 'text-[#d4af37] text-xl drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'text-gray-400 text-sm'}`}
                    style={{ fontFamily: "serif" }}
                  >
                    {brand}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Edge fades */}
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
