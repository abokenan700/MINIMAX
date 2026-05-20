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
  "فيلكرو",
];

export function FloatingPills() {
  const [activeBrand, setActiveBrand] = useState("أديداس");

  return (
    <div 
      dir="rtl" 
      className="w-full max-w-[390px] mx-auto bg-slate-50 py-8 overflow-hidden font-sans"
    >
      <div className="px-5 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">الماركات العالمية</h2>
        <button className="text-sm text-indigo-600 font-medium hover:underline">عرض الكل</button>
      </div>
      
      <div 
        className="flex overflow-x-auto gap-3 px-5 pb-6 pt-2 brands-strip-hide-scrollbar snap-x snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        {BRANDS.map((brand, i) => {
          const isActive = activeBrand === brand;
          return (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`
                relative flex-shrink-0 snap-start
                px-6 py-3 rounded-full text-sm font-bold
                pill-hover-lift
                ${isActive ? 'shadow-lg' : 'shadow-sm'}
              `}
              style={{
                background: isActive 
                  ? 'linear-gradient(135deg, #f43f5e 0%, #6366f1 100%)' 
                  : 'white',
                color: isActive ? 'white' : '#475569',
                border: isActive ? 'none' : '1px solid #e2e8f0',
                animation: !isActive ? `floatPill 4s ease-in-out ${i * 0.2}s infinite` : 'none'
              }}
            >
              {brand}
            </button>
          );
        })}
      </div>
    </div>
  );
}
