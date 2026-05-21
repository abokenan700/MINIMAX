import React, { useState } from "react";

const brands = [
  { id: "1", label: "Chanel" },
  { id: "2", label: "Gucci" },
  { id: "3", label: "Dior" },
  { id: "4", label: "Louis Vuitton" },
  { id: "5", label: "Versace" },
  { id: "6", label: "Prada" },
  { id: "7", label: "Hermès" },
];

export function V5GoldGradient() {
  const [activeId, setActiveId] = useState(brands[0].id);
  const [ripples, setRipples] = useState<{ id: string; x: number; y: number }[]>([]);

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>, brandId: string) => {
    setActiveId(brandId);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: `${Date.now()}`, x, y };
    
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <div 
      dir="rtl" 
      style={{
        width: "390px",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #1A1410, #2C1F12)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative"
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Reem+Kufi+Fun:wght@400;500;600;700&display=swap');
        
        .nakhba-v5-container {
          width: 100%;
          padding: 32px 0;
        }

        .nakhba-v5-header {
          display: flex;
          justifyContent: space-between;
          align-items: center;
          padding: 0 20px;
          margin-bottom: 24px;
        }

        .nakhba-v5-title {
          font-family: 'Reem Kufi Fun', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: white;
          position: relative;
          display: inline-block;
        }

        .nakhba-v5-title::after {
          content: '';
          position: absolute;
          bottom: -4px;
          right: 0;
          width: 40px;
          height: 3px;
          background: #D4AF37;
          border-radius: 2px;
        }

        .nakhba-v5-scroll {
          display: flex;
          gap: 6px;
          padding: 10px 20px 30px;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        
        .nakhba-v5-scroll::-webkit-scrollbar {
          display: none;
        }

        .nakhba-v5-card {
          position: relative;
          flex: 0 0 auto;
          width: 100px;
          height: 140px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          outline: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          overflow: hidden;
          background: linear-gradient(135deg, #8B6914, #D4AF37, #F5D77A, #C9922A);
        }

        .nakhba-v5-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, transparent 100%);
          pointer-events: none;
        }

        .nakhba-v5-card.inactive {
          filter: saturate(0.2) opacity(0.7);
          transform: scale(0.96);
        }

        .nakhba-v5-card.active {
          transform: scale(1.08);
          box-shadow: 0 12px 40px rgba(212, 175, 55, 0.6);
          z-index: 10;
        }

        .nakhba-v5-label {
          font-family: 'Reem Kufi Fun', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: white;
          text-align: center;
          padding: 0 10px;
          z-index: 2;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-effect 0.6s linear;
          background-color: rgba(255, 255, 255, 0.5);
          pointer-events: none;
        }

        @keyframes ripple-effect {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}} />

      <div className="nakhba-v5-container">
        <div className="nakhba-v5-header">
          <h2 className="nakhba-v5-title">ماركات نخبة</h2>
        </div>
        
        <div className="nakhba-v5-scroll">
          {brands.map((brand) => {
            const isActive = activeId === brand.id;
            return (
              <button
                key={brand.id}
                className={`nakhba-v5-card ${isActive ? 'active' : 'inactive'}`}
                onClick={(e) => handleRipple(e, brand.id)}
              >
                {isActive && ripples.map(ripple => (
                  <span
                    key={ripple.id}
                    className="ripple"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: 50,
                      height: 50,
                      marginTop: -25,
                      marginLeft: -25
                    }}
                  />
                ))}
                <span className="nakhba-v5-label">{brand.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default V5GoldGradient;
