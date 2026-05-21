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
const COPIES = 5;
const PAD = 24; // paddingInline

export function V2FrostedGlass() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const [centerIdx, setCenterIdx] = useState(-1);

  const loopItems = Array.from({ length: COPIES }, () => BRANDS).flat();
  const totalLen = loopItems.length * STEP;
  const singleLen = BRANDS.length * STEP;
  const startPos = singleLen * Math.floor(COPIES / 2); // start at middle copy

  const detectCenter = () => {
    const el = scrollRef.current;
    if (!el) return;
    // absolute pixel position of the viewport center
    const viewCenter = el.scrollLeft + el.clientWidth / 2;
    // which card index (accounting for left padding) is closest to center
    const rawIdx = (viewCenter - PAD - CARD_W / 2) / STEP;
    const idx = Math.round(rawIdx);
    const clamped = Math.max(0, Math.min(idx, loopItems.length - 1));
    setCenterIdx(clamped);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    posRef.current = startPos;
    el.scrollLeft = startPos;
    detectCenter();

    const tick = () => {
      if (!pausedRef.current && scrollRef.current) {
        posRef.current += 0.5;
        // seamless loop: when we pass end of 4th copy, jump back to start of 2nd copy
        if (posRef.current >= singleLen * (COPIES - 1)) {
          posRef.current = singleLen;
        }
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

        @keyframes v2-glow {
          0%, 100% { box-shadow: 0 8px 24px -6px rgba(180,140,60,0.30), inset 0 0 14px rgba(212,175,55,0.10); }
          50%       { box-shadow: 0 12px 32px -6px rgba(180,140,60,0.50), inset 0 0 22px rgba(212,175,55,0.20); }
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
          padding: 12px;
          border: 1px solid rgba(255,255,255,0.55);
          background: rgba(255,255,255,0.42);
          backdrop-filter: blur(10px) saturate(160%);
          -webkit-backdrop-filter: blur(10px) saturate(160%);
          box-shadow: 0 4px 14px -4px rgba(180,140,60,0.08);
          transition:
            border-color 0.35s ease,
            background 0.35s ease,
            box-shadow 0.35s ease,
            transform 0.35s ease,
            opacity 0.35s ease;
          transform: scale(0.92);
          opacity: 0.55;
          user-select: none;
        }

        .v2-card.active {
          border-color: rgba(212,175,55,0.88);
          background: rgba(255,255,255,0.85);
          transform: scale(1.0);
          opacity: 1;
          animation: v2-glow 2.6s ease-in-out infinite;
        }

        .v2-card-label {
          font-family: "IBM Plex Sans Arabic", sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #8A7060;
          text-align: center;
          line-height: 1.3;
          transition: font-size 0.3s ease, font-weight 0.3s ease, color 0.3s ease;
        }

        .v2-card.active .v2-card-label {
          font-size: 15px;
          font-weight: 700;
          color: #B8763E;
        }

        .v2-fade-left {
          position: absolute;
          top: 0; left: 0;
          width: 70px; height: 100%;
          background: linear-gradient(to right, #F5F0E8 15%, transparent);
          pointer-events: none;
          z-index: 5;
        }
        .v2-fade-right {
          position: absolute;
          top: 0; right: 0;
          width: 70px; height: 100%;
          background: linear-gradient(to left, #F5F0E8 15%, transparent);
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
        <div className="v2-fade-left" />
        <div className="v2-fade-right" />

        <div
          ref={scrollRef}
          className="v2-scroll"
          style={{
            display: 'flex',
            gap: `${CARD_GAP}px`,
            paddingInline: `${PAD}px`,
            overflowX: 'scroll',
            height: '100%',
            alignItems: 'center',
          }}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          {loopItems.map((brand, i) => (
            <div
              key={i}
              className={"v2-card" + (i === centerIdx ? " active" : "")}
            >
              <span className="v2-card-label">{brand.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default V2FrostedGlass;
