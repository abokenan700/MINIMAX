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

const CARD_W  = 104;
const CARD_H  = 138;
const GAP     = 14;
const STEP    = CARD_W + GAP;
const PAD     = 24;          // padding on each side
const COPIES  = 5;

export function V2FrostedGlass() {
  const scrollRef  = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number | null>(null);
  const posRef     = useRef(0);
  const pausedRef  = useRef(false);
  const [centerIdx, setCenterIdx] = useState(-1);

  // ─── build loop list ───────────────────────────────────────────────
  const loopItems  = Array.from({ length: COPIES }, () => BRANDS).flat();
  const singleLen  = BRANDS.length * STEP;
  const startPos   = singleLen * Math.floor(COPIES / 2);   // start at middle copy

  // ─── center detection (LTR scroll, no RTL quirks) ──────────────────
  const detectCenter = () => {
    const el = scrollRef.current;
    if (!el) return;
    const midX   = el.scrollLeft + el.clientWidth / 2;
    const rawIdx = (midX - PAD - CARD_W / 2) / STEP;
    const idx    = Math.max(0, Math.min(Math.round(rawIdx), loopItems.length - 1));
    setCenterIdx(idx);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    posRef.current = startPos;
    el.scrollLeft  = startPos;
    detectCenter();

    const tick = () => {
      if (!pausedRef.current && scrollRef.current) {
        posRef.current += 0.5;
        // seamless jump: when we enter the last copy, snap back to the second copy
        if (posRef.current >= singleLen * (COPIES - 1)) posRef.current = singleLen;
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

        /* ── glow pulse stays on the card in place ── */
        @keyframes v2-glow {
          0%,100% { box-shadow: 0 6px 22px -4px rgba(180,140,60,0.28), inset 0 0 12px rgba(212,175,55,0.10); }
          50%      { box-shadow: 0 6px 32px -4px rgba(180,140,60,0.52), inset 0 0 22px rgba(212,175,55,0.20); }
        }

        .v2-scroll::-webkit-scrollbar { display: none; }
        .v2-scroll { -ms-overflow-style:none; scrollbar-width:none; }

        /* ── all cards same fixed size, no scale/translate ── */
        .v2-card {
          flex-shrink: 0;
          width: ${CARD_W}px;
          height: ${CARD_H}px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;

          /* dim state */
          border: 1px solid rgba(255,255,255,0.50);
          background: rgba(255,255,255,0.36);
          box-shadow: none;
          opacity: 0.50;

          backdrop-filter: blur(10px) saturate(150%);
          -webkit-backdrop-filter: blur(10px) saturate(150%);
          transition: border-color .35s ease, background .35s ease,
                      box-shadow .35s ease, opacity .35s ease;
          user-select: none;
        }

        /* ── center card: lights up IN PLACE, no movement ── */
        .v2-card.active {
          border-color: rgba(212,175,55,0.88);
          background: rgba(255,255,255,0.88);
          opacity: 1;
          animation: v2-glow 2.6s ease-in-out infinite;
        }

        .v2-label {
          font-family: "IBM Plex Sans Arabic", sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #9A8878;
          text-align: center;
          line-height: 1.3;
          transition: font-size .3s ease, font-weight .3s ease, color .3s ease;
        }
        .v2-card.active .v2-label {
          font-size: 15px;
          font-weight: 700;
          color: #B8763E;
        }

        /* ── edge fades ── */
        .v2-fade-l, .v2-fade-r {
          position: absolute; top:0; width:70px; height:100%;
          pointer-events:none; z-index:5;
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

      {/* ── track wrapper: LTR so scrollLeft is always 0 → max ── */}
      <div style={{ position: 'relative', height: `${CARD_H}px` }}>
        <div className="v2-fade-l" />
        <div className="v2-fade-r" />

        <div
          ref={scrollRef}
          className="v2-scroll"
          dir="ltr"                          /* ← LTR: predictable scrollLeft */
          style={{
            display: 'flex',
            gap: `${GAP}px`,
            padding: `0 ${PAD}px`,
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
              <span className="v2-label">{brand.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default V2FrostedGlass;
