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

export function V2FrostedGlass() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const [centerId, setCenterId] = useState<string | null>(null);

  const COPIES = 3;
  const loopItems = Array.from({ length: COPIES }, () => BRANDS).flat();
  const singleLen = BRANDS.length * STEP;

  const detectCenter = () => {
    const el = scrollRef.current;
    if (!el) return;
    const containerCenter = el.scrollLeft + el.clientWidth / 2;
    const idx = Math.round((containerCenter - CARD_W / 2) / STEP);
    const clamped = Math.max(0, Math.min(idx, loopItems.length - 1));
    const brand = loopItems[clamped];
    if (brand) setCenterId(brand.id);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    posRef.current = singleLen;
    el.scrollLeft = singleLen;
    detectCenter();

    const speed = 0.5;

    const tick = () => {
      if (!pausedRef.current && scrollRef.current) {
        posRef.current += speed;
        if (posRef.current >= singleLen * 2) {
          posRef.current = singleLen;
        }
        scrollRef.current.scrollLeft = posRef.current;
        detectCenter();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    const onScroll = () => {
      posRef.current = el.scrollLeft;
      detectCenter();
    };
    el.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      el.removeEventListener('scroll', onScroll);
    };
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

        @keyframes v2-float {
          0%, 100% { transform: translateY(-5px) scale(1.04); }
          50%       { transform: translateY(-9px) scale(1.04); }
        }

        @keyframes v2-glow-pulse {
          0%, 100% { box-shadow: 0 14px 28px -8px rgba(180,140,60,0.38), inset 0 0 16px rgba(212,175,55,0.14); }
          50%       { box-shadow: 0 18px 36px -8px rgba(180,140,60,0.55), inset 0 0 22px rgba(212,175,55,0.22); }
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
          transition: border 0.35s ease, background 0.35s ease, transform 0.45s cubic-bezier(0.2,0.8,0.2,1);
          padding: 12px;
          border: 1px solid rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
          box-shadow: 0 6px 18px -6px rgba(180,140,60,0.12);
          transform: translateY(0) scale(1);
          user-select: none;
        }

        .v2-card.active {
          border: 1px solid rgba(212,175,55,0.85);
          background: rgba(255,255,255,0.82);
          animation: v2-float 3s ease-in-out infinite, v2-glow-pulse 3s ease-in-out infinite;
        }

        .v2-card-label {
          font-family: "IBM Plex Sans Arabic", sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #5C4C40;
          text-align: center;
          line-height: 1.3;
          transition: font-size 0.35s ease, font-weight 0.35s ease, color 0.35s ease;
        }

        .v2-card.active .v2-card-label {
          font-size: 15px;
          font-weight: 700;
          color: #B8763E;
        }

        .v2-fade-left {
          position: absolute;
          top: 72px;
          left: 0;
          width: 48px;
          height: 138px;
          background: linear-gradient(to right, #F5F0E8 30%, transparent);
          pointer-events: none;
          z-index: 2;
        }
        .v2-fade-right {
          position: absolute;
          top: 72px;
          right: 0;
          width: 48px;
          height: 138px;
          background: linear-gradient(to left, #F5F0E8 30%, transparent);
          pointer-events: none;
          z-index: 2;
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

      <div style={{ position: 'relative' }}>
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
