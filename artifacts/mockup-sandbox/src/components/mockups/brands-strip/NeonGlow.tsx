import React from "react";
import { Link } from "wouter";
import "./_group.css";

const BRANDS = [
  { id: "1", name: "نايك" },
  { id: "2", name: "أديداس" },
  { id: "3", name: "بوما" },
  { id: "4", name: "نيو بالانس" },
  { id: "5", name: "ريبوك" },
  { id: "6", name: "فيلا" },
  { id: "7", name: "أنبر" },
  { id: "8", name: "فيلكرو" }
];

const NEON_COLORS = ["cyan", "magenta", "lime"];

export function NeonGlow() {
  return (
    <div 
      dir="rtl" 
      className="w-full max-w-[390px] mx-auto overflow-hidden bg-[#050014] py-6 relative"
      style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(20, 0, 40, 0.5) 0%, rgba(5, 0, 20, 1) 100%)"
      }}
    >
      {/* Grid overlay for cyberpunk feel */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />
      
      <div className="relative z-10 w-full overflow-x-auto brands-strip-hide-scrollbar pb-4 pt-2 px-4">
        <div className="flex w-max gap-4 items-center">
          {BRANDS.map((brand, i) => {
            const colorClass = NEON_COLORS[i % NEON_COLORS.length];
            
            return (
              <button
                key={brand.id}
                className={`flex-shrink-0 px-6 py-2.5 rounded-sm border-2 font-bold text-lg hover-neon-${colorClass} tracking-wide backdrop-blur-sm relative overflow-hidden`}
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif"
                }}
              >
                <span className="relative z-10">{brand.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Edge gradients for smooth scroll fade out */}
      <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[#050014] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[#050014] to-transparent z-10 pointer-events-none"></div>
    </div>
  );
}
