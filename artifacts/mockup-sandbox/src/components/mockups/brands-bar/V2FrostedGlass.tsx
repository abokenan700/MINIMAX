import React, { useEffect, useRef } from 'react';

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
const GAP    = 14;
const PAD    = 24;
const STEP   = CARD_W + GAP;
// One full copy width (no trailing gap after last card)
const SET_W  = BRANDS.length * STEP;

// 3 copies: [copy A | copy B | copy C]
// start at copy B so user can scroll both ways infinitely
const LOOP = [...BRANDS, ...BRANDS, ...BRANDS];

export function V2FrostedGlass() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Start at the beginning of copy B
    el.scrollLeft = SET_W + PAD;

    const onScroll = () => {
      const sl = el.scrollLeft;
      // Nearing the start (copy A territory) → jump to copy B equivalent
      if (sl < SET_W * 0.25) {
        el.scrollLeft = sl + SET_W;
        return;
      }
      // Nearing the end (copy C territory) → jump to copy B equivalent
      if (sl > SET_W * 1.75) {
        el.scrollLeft = sl - SET_W;
      }
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
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

        /* permanent glow pulse on every card */
        @keyframes v2-glow {
          0%,100% {
            box-shadow:
              0 12px 28px -6px rgba(180,140,60,0.30),
              inset 0 0 14px rgba(212,175,55,0.10);
          }
          50% {
            box-shadow:
              0 16px 36px -6px rgba(180,140,60,0.52),
              inset 0 0 24px rgba(212,175,55,0.22);
          }
        }

        @keyframes v2-float {
          0%,100% { transform: translateY(-3px); }
          50%      { transform: translateY(-7px); }
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

          /* every card is permanently in the "active" state */
          border: 1px solid rgba(212,175,55,0.80);
          background: rgba(255,255,255,0.76);
          backdrop-filter: blur(14px) saturate(180%);
          -webkit-backdrop-filter: blur(14px) saturate(180%);

          animation:
            v2-glow  3s ease-in-out infinite,
            v2-float 3s ease-in-out infinite;

          /* stagger each card so they don't pulse in unison */
          user-select: none;
          cursor: default;
        }

        /* stagger delays so each card floats at a different phase */
        ${LOOP.map((_, i) => `.v2-card:nth-child(${i + 1}) { animation-delay: ${(i % BRANDS.length) * -0.38}s; }`).join('\n')}

        .v2-label {
          font-family: "IBM Plex Sans Arabic", sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #B8763E;
          text-align: center;
          line-height: 1.3;
          pointer-events: none;
        }

        .v2-fade-l, .v2-fade-r {
          position: absolute; top: 0;
          width: 56px; height: 100%;
          pointer-events: none; z-index: 5;
        }
        .v2-fade-l { left:0;  background: linear-gradient(to right, #F5F0E8 15%, transparent); }
        .v2-fade-r { right:0; background: linear-gradient(to left,  #F5F0E8 15%, transparent); }
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

      <div style={{ position: 'relative', height: '148px' }}>
        <div className="v2-fade-l" />
        <div className="v2-fade-r" />

        <div
          ref={scrollRef}
          className="v2-scroll"
          dir="ltr"
          style={{
            display: 'flex',
            gap: `${GAP}px`,
            padding: `0 ${PAD}px`,
            overflowX: 'scroll',
            height: '100%',
            alignItems: 'center',
            WebkitOverflowScrolling: 'touch',
          }}
        >
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
