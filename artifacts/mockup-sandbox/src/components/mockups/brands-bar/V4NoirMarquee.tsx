import React from 'react';

const brands = ["Chanel", "Gucci", "Dior", "Louis Vuitton", "Versace", "Prada", "Hermès", "Bulgari", "Cartier", "Tiffany"];
// Duplicate array for seamless infinite scroll
const marqueeBrands = [...brands, ...brands];

export default function V4NoirMarquee() {
  return (
    <div style={{ width: '390px', margin: '0 auto', background: '#080808', overflow: 'hidden', position: 'relative', fontFamily: "'IBM Plex Sans Arabic', sans-serif", padding: '32px 0', minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Reem+Kufi+Fun:wght@400;500;600;700&display=swap');
        
        .v4-marquee-track {
          display: flex;
          width: max-content;
          animation: v4-marquee 18s linear infinite;
        }
        
        .v4-marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes v4-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .v4-marquee-edge-left {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 60px;
          background: linear-gradient(to right, #080808 0%, transparent 100%);
          z-index: 10;
          pointer-events: none;
        }
        
        .v4-marquee-edge-right {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 60px;
          background: linear-gradient(to left, #080808 0%, transparent 100%);
          z-index: 10;
          pointer-events: none;
        }
      `}} />
      
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span style={{
          backgroundColor: '#EA580C15',
          color: '#EA580C',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.5px'
        }}>
          الماركات العالمية
        </span>
      </div>

      <div style={{
        position: 'relative',
        borderTop: '1px solid #d4af37',
        borderBottom: '1px solid #d4af37',
        padding: '18px 0',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        <div className="v4-marquee-edge-left" />
        <div className="v4-marquee-edge-right" />
        
        <div className="v4-marquee-track">
          {marqueeBrands.map((brand, i) => (
            <React.Fragment key={i}>
              <span style={{
                fontFamily: "'Reem Kufi Fun', sans-serif",
                color: '#d4af37',
                fontSize: '18px',
                letterSpacing: '2px',
                whiteSpace: 'nowrap',
                padding: '0 24px',
                fontWeight: 500,
                cursor: 'default'
              }}>
                {brand}
              </span>
              {/* Add a diamond if it's not the absolute last element of the duplicated list, though having it everywhere ensures the loop matches perfectly */}
              <span style={{ color: '#d4af37', fontSize: '10px', display: 'flex', alignItems: 'center' }}>◆</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
