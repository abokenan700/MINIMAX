import React, { useEffect, useRef, useState } from 'react';

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

const CARD_W = 104;
const CARD_GAP = 14;
const STEP = CARD_W + CARD_GAP;
const COPIES = 3;

export function V2FrostedGlass() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const [centerId, setCenterId] = useState<string | null>(null);

  const loopItems = Array.from({ length: COPIES }, () => BRANDS).flat();
  const singleLen = BRANDS.length * STEP;

  const detectCenter = () => {
    const el = scrollRef.current;
    if (!el) return;
    const containerCenter = el.scrollLeft + el.clientWidth / 2;
    const idx = Math.round((containerCenter - CARD_W / 2) / STEP);
    const clamped = ((idx % loopItems.length) + loopItems.length) % loopItems.length;
    const brand = loopItems[clamped];
    if (brand) setCenterId(brand.id);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    posRef.current = singleLen;
    el.scrollLeft = singleLen;
    detectCenter();

    const tick = () => {
      if (!pausedRef.current && scrollRef.current) {
        posRef.current += 0.45;
        if (posRef.current >= singleLen * 2) posRef.current = singleLen;
        scrollRef.current.scrollLeft = posRef.current;
        detectCenter();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

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

        @keyframes spotlight-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.18), inset 0 0 18px rgba(212,175,55,0.10); }
          50%       { box-shadow: 0 0 0 4px rgba(212,175,55,0.10), inset 0 0 28px rgba(212,175,55,0.18); }
        }

        .v2-scroll::-webkit-scrollbar { display: none; }
        .v2-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .v2-card {
          flex-shrink: 0;
          width: ${CARD_W}px;
          height: 138px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: default;
          padding: 12px;
          border: 1px solid rgba(255,255,255,0.55);
          background: rgba(255,255,255,0.42);
          backdrop-filter: blur(10px) saturate(160%);
          -webkit-backdrop-filter: blur(10px) saturate(160%);
          box-shadow: 0 4px 14px -4px rgba(180,140,60,0.08);
          transition:
            border-color 0.4s ease,
            background 0.4s ease,
            box-shadow 0.4s ease,
            transform 0.4s ease;
          transform: scale(1);
          user-select: none;
        }

        .v2-card.active {
          border-color: rgba(212,175,55,0.9);
          background: rgba(255,255,255,0.82);
          transform: scale(1.06);
          box-shadow:
            0 0 0 1px rgba(212,175,55,0.3),
            0 10px 26px -6px rgba(180,140,60,0.32),
            inset 0 0 16px rgba(212,175,55,0.12);
          animation: spotlight-pulse 2.4s ease-in-out infinite;
          z-index: 2;
          position: relative;
        }

        .v2-card-label {
          font-family: "IBM Plex Sans Arabic", sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #7A6655;
          text-align: center;
          line-height: 1.3;
          transition: font-size 0.35s ease, font-weight 0.35s ease, color 0.35s ease;
        }

        .v2-card.active .v2-card-label {
          font-size: 15px;
          font-weight: 700;
          color: #B8763E;
        }

        /* Fixed spotlight window — decorative ring at center */
        .v2-spotlight {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${CARD_W + 20}px;
          height: 158px;
          border-radius: 22px;
          pointer-events: none;
          z-index: 10;
          border: 1.5px solid rgba(212,175,55,0.22);
          background: linear-gradient(180deg, rgba(212,175,55,0.04) 0%, rgba(212,175,55,0.0) 100%);
        }

        .v2-fade-left {
          position: absolute;
          top: 0; left: 0;
          width: 60px; height: 100%;
          background: linear-gradient(to right, #F5F0E8 20%, transparent);
          pointer-events: none;
          z-index: 5;
        }
        .v2-fade-right {
          position: absolute;
          top: 0; right: 0;
          width: 60px; height: 100%;
          background: linear-gradient(to left, #F5F0E8 20%, transparent);
          pointer-events: none;
          z-index: 5;
        }
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

      <div style={{ position: 'relative', height: '158px' }}>
        {/* Fixed spotlight ring always at center */}
        <div className="v2-spotlight" />

        <div className="v2-fade-left" />
        <div className="v2-fade-right" />

        <div
          ref={scrollRef}
          className="v2-scroll"
          style={{
            display: 'flex',
            gap: `${CARD_GAP}px`,
            paddingInline: '24px',
            overflowX: 'scroll',
            height: '100%',
            alignItems: 'center',
          }}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          {loopItems.map((brand, i) => {
            const isActive = centerId === brand.id;
            return (
              <div
                key={i}
                className={"v2-card" + (isActive ? " active" : "")}
              >
                <span className="v2-card-label">{brand.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default V2FrostedGlass;
