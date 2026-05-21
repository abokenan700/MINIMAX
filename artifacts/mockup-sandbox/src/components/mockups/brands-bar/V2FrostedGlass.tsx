import React from 'react';

const BRANDS = [
  { id: "1", label: "Chanel" },
  { id: "2", label: "Gucci" },
  { id: "3", label: "Dior" },
  { id: "4", label: "Louis Vuitton" },
  { id: "5", label: "Versace" },
  { id: "6", label: "Prada" },
  { id: "7", label: "Hermès" },
  { id: "8", label: "Burberry" },
];

// duplicate for seamless infinite loop
const LOOP = [...BRANDS, ...BRANDS, ...BRANDS];

const CARD_W = 104;
const GAP    = 14;
// total width of one full set
const SET_W  = BRANDS.length * (CARD_W + GAP);

export function V2FrostedGlass() {
  return (
    <div
      dir="rtl"
      style={{
        width: '390px',
        minHeight: '260px',
        backgroundColor: '#F5F0E8',
        padding: '28px 0 36px',
        fontFamily: '"IBM Plex Sans Arabic", sans-serif',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Reem+Kufi+Fun:wght@400;500;600;700&display=swap');

        /* ── infinite scroll: translate from 0 to -1×SET_W then jump back ── */
        @keyframes v2-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${SET_W}px); }
        }

        /* ── glow pulse on hover ── */
        @keyframes v2-glow {
          0%,100% { box-shadow: 0 6px 22px -4px rgba(180,140,60,0.30), inset 0 0 12px rgba(212,175,55,0.10); }
          50%      { box-shadow: 0 6px 34px -4px rgba(180,140,60,0.55), inset 0 0 22px rgba(212,175,55,0.22); }
        }

        .v2-track {
          display: flex;
          gap: ${GAP}px;
          width: max-content;
          animation: v2-marquee ${BRANDS.length * 2.2}s linear infinite;
        }

        /* pause on hover over the whole track */
        .v2-track:hover {
          animation-play-state: paused;
        }

        .v2-card {
          width: ${CARD_W}px;
          height: 138px;
          border-radius: 18px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;

          border: 1px solid rgba(255,255,255,0.60);
          background: rgba(255,255,255,0.50);
          backdrop-filter: blur(12px) saturate(170%);
          -webkit-backdrop-filter: blur(12px) saturate(170%);
          box-shadow: 0 4px 14px -4px rgba(180,140,60,0.10);

          transition:
            border-color .3s ease,
            background   .3s ease,
            box-shadow   .3s ease,
            transform    .3s ease;
          cursor: default;
          user-select: none;
        }

        /* ── hover / active effect on every card ── */
        .v2-card:hover {
          border-color: rgba(212,175,55,0.90);
          background: rgba(255,255,255,0.90);
          transform: translateY(-4px);
          animation: v2-glow 2s ease-in-out infinite;
        }

        .v2-label {
          font-family: "IBM Plex Sans Arabic", sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #7A6655;
          text-align: center;
          line-height: 1.3;
          transition: font-size .3s ease, font-weight .3s ease, color .3s ease;
          pointer-events: none;
        }

        .v2-card:hover .v2-label {
          font-size: 15px;
          font-weight: 700;
          color: #B8763E;
        }

        /* ── edge fades ── */
        .v2-fade-l, .v2-fade-r {
          position: absolute; top: 72px;
          width: 60px; height: 138px;
          pointer-events: none; z-index: 5;
        }
        .v2-fade-l { left:0;  background: linear-gradient(to right, #F5F0E8 20%, transparent); }
        .v2-fade-r { right:0; background: linear-gradient(to left,  #F5F0E8 20%, transparent); }
      `}} />

      <h2 style={{
        fontFamily: '"Reem Kufi Fun", sans-serif',
        fontSize: '22px',
        fontWeight: 600,
        color: '#1A1410',
        margin: '0 22px 20px',
        textAlign: 'right',
      }}>
        استكشف الماركات
      </h2>

      <div style={{ position: 'relative', overflow: 'hidden', height: '138px' }}>
        <div className="v2-fade-l" />
        <div className="v2-fade-r" />

        <div className="v2-track">
          {LOOP.map((brand, i) => (
            <div key={i} className="v2-card">
              <span className="v2-label">{brand.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default V2FrostedGlass;
