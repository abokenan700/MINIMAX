import React, { useState } from 'react';

const brands = [
  { id: "1", label: "Chanel" },
  { id: "2", label: "Gucci" },
  { id: "3", label: "Dior" },
  { id: "4", label: "Louis Vuitton" },
  { id: "5", label: "Versace" },
  { id: "6", label: "Prada" },
  { id: "7", label: "Hermès" }
];

export function V3EditorialWarm() {
  const [activeId, setActiveId] = useState("3");
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const handleClick = (id: string) => {
    setActiveId(id);
    setAnimatingId(id);
    setTimeout(() => setAnimatingId(null), 300);
  };

  return (
    <div 
      dir="rtl" 
      style={{
        width: '390px',
        minHeight: '100vh',
        backgroundColor: '#FFFDF9',
        fontFamily: '"IBM Plex Sans Arabic", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Reem+Kufi+Fun:wght@400;500;600;700&display=swap');

        @keyframes scalePop {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .pill-animate {
          animation: scalePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}} />

      <div style={{ padding: '40px 24px 20px', backgroundColor: '#FFFDF9' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontFamily: '"Reem Kufi Fun", sans-serif',
            fontSize: '32px',
            fontWeight: 600,
            color: '#1A1410',
            margin: '0 0 12px 0',
            position: 'relative',
            display: 'inline-block'
          }}>
            الماركات المميزة
            <div style={{
              position: 'absolute',
              bottom: '4px',
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(135deg, rgba(201, 146, 42, 0.2), rgba(232, 184, 75, 0.6))',
              zIndex: -1,
              transform: 'skewX(-15deg)',
              borderRadius: '2px'
            }} />
          </h2>
        </div>

        <div 
          className="hide-scrollbar"
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '24px',
            paddingRight: '4px',
            paddingLeft: '24px',
            marginRight: '-4px'
          }}
        >
          {brands.map((brand) => {
            const isActive = activeId === brand.id;
            const isAnimating = animatingId === brand.id;
            
            return (
              <button
                key={brand.id}
                onClick={() => handleClick(brand.id)}
                className={isAnimating ? 'pill-animate' : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 24px',
                  borderRadius: '9999px',
                  border: isActive ? '1px solid transparent' : '1px solid #E5DFD3',
                  background: isActive 
                    ? 'linear-gradient(135deg, #C9922A, #E8B84B)'
                    : '#FFFFFF',
                  boxShadow: isActive 
                    ? '0 8px 16px -4px rgba(201, 146, 42, 0.4)'
                    : '0 2px 4px -2px rgba(26, 20, 16, 0.05)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  WebkitTapHighlightColor: 'transparent',
                  outline: 'none',
                }}
              >
                <span style={{
                  fontFamily: '"Reem Kufi Fun", sans-serif',
                  fontSize: '17px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#FFFFFF' : '#8B7355',
                  letterSpacing: '0.5px'
                }}>
                  {brand.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default V3EditorialWarm;
