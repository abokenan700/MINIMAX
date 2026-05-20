import React, { useState } from 'react';

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

export function EditorialMinimal() {
  const [activeBrand, setActiveBrand] = useState("نايك");

  return (
    <div dir="rtl" className="w-[390px] mx-auto bg-white overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      
      <div className="py-12 px-6">
        <h2 className="text-center text-sm tracking-widest uppercase text-black/40 mb-10" style={{ fontFamily: "'Amiri', serif" }}>الماركات</h2>
        
        <div className="flex overflow-x-auto hide-scrollbar scroll-smooth">
          <div className="flex px-2 space-x-reverse space-x-10 border-b border-black/5">
            {BRANDS.map((brand) => {
              const isActive = activeBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`
                    relative pb-4 whitespace-nowrap text-xl transition-all duration-500 ease-out outline-none
                    ${isActive ? 'text-black font-bold' : 'text-black/50 hover:text-black/70'}
                  `}
                  style={{ fontFamily: "'Amiri', serif" }}
                >
                  {brand}
                  {/* Active Indicator */}
                  <span 
                    className={`absolute bottom-[-1px] right-0 left-0 h-[1px] transition-all duration-500 ease-out origin-center
                      ${isActive ? 'bg-[#C5A059] scale-x-100' : 'bg-transparent scale-x-0'}
                    `}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
