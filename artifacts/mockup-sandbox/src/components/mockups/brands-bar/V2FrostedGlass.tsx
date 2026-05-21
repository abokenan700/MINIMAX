import React, { useState } from 'react';

const BRANDS = [
  { id: "1", label: "Chanel" },
  { id: "2", label: "Gucci" },
  { id: "3", label: "Dior" },
  { id: "4", label: "Louis Vuitton" },
  { id: "5", label: "Versace" },
  { id: "6", label: "Prada" },
  { id: "7", label: "Hermès" }
];

export function V2FrostedGlass() {
  const [activeId, setActiveId] = useState("1");

  return (
    <div 
      dir="rtl" 
      style={{
        width: '390px',
        minHeight: '280px',
        backgroundColor: '#F5F0E8', // Warm champagne
        padding: '32px 0 40px',
        fontFamily: '"IBM Plex Sans Arabic", sans-serif',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Reem+Kufi+Fun:wght@400;500;600;700&display=swap');

        @keyframes v2-float {
          0% { transform: translateY(-4px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(-4px); }
        }

        .v2-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}} />

      <h2 style={{
        fontFamily: '"Reem Kufi Fun", sans-serif',
        fontSize: '24px',
        fontWeight: 600,
        color: '#1A1410',
        margin: '0 24px 24px',
        textAlign: 'right'
      }}>
        استكشف الماركات
      </h2>

      <div 
        className="v2-scroll-container"
        style={{
          display: 'flex',
          gap: '16px',
          padding: '0 24px',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {BRANDS.map((brand) => {
          const isActive = activeId === brand.id;
          
          return (
            <button
              key={brand.id}
              onClick={() => setActiveId(brand.id)}
              style={{
                flexShrink: 0,
                width: '100px',
                height: '140px',
                borderRadius: '16px',
                border: isActive 
                  ? '1px solid rgba(212, 175, 55, 0.8)' // Gold border
                  : '1px solid rgba(255, 255, 255, 0.7)',
                backgroundColor: isActive 
                  ? 'rgba(255, 255, 255, 0.75)'
                  : 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(12px) saturate(180%)',
                WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                boxShadow: isActive 
                  ? '0 12px 24px -8px rgba(180, 140, 60, 0.3), inset 0 0 12px rgba(212, 175, 55, 0.1)'
                  : '0 8px 20px -6px rgba(180, 140, 60, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                animation: isActive ? 'v2-float 3s ease-in-out infinite' : 'none',
                transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                padding: '12px'
              }}
            >
              <span style={{
                fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                fontSize: isActive ? '15px' : '14px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#B8763E' : '#5C4C40',
                textAlign: 'center',
                lineHeight: 1.3,
                transition: 'all 0.4s ease'
              }}>
                {brand.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default V2FrostedGlass;
