import { useEffect, useRef } from "react";
import { useGetBrands } from "@workspace/api-client-react";
import { useLocation } from "wouter";

const CARD_W = 80;
const CARD_H = 96;
const GAP    = 10;
const PAD    = 16;
const STEP   = CARD_W + GAP;
const SLOT_COUNT = 5;

/* ── SVG monograms for each brand ─────────────────────────────────── */
const MONOGRAMS: Record<string, JSX.Element> = {

  chanel: (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* interlocking C C */}
      <path d="M28 12 A20 20 0 0 0 28 48 L32 48 A16 16 0 0 1 32 12 Z" fill="currentColor" />
      <path d="M52 12 A20 20 0 0 1 52 48 L48 48 A16 16 0 0 0 48 12 Z" fill="currentColor" />
      <path d="M28 12 L52 12 L50 16 L30 16 Z" fill="currentColor" />
      <path d="M28 48 L52 48 L50 44 L30 44 Z" fill="currentColor" />
    </svg>
  ),

  dior: (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* elegant CD */}
      <text x="10" y="48" fontFamily="Georgia,serif" fontSize="44" fontWeight="400" fill="currentColor" letterSpacing="-2">CD</text>
    </svg>
  ),

  gucci: (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* interlocking G G */}
      <circle cx="27" cy="30" r="17" stroke="currentColor" strokeWidth="4.5" fill="none" />
      <circle cx="53" cy="30" r="17" stroke="currentColor" strokeWidth="4.5" fill="none" />
      <rect x="24" y="30" width="15" height="4.5" fill="currentColor" />
      <rect x="41" y="25.5" width="15" height="4.5" fill="currentColor" />
    </svg>
  ),

  lv: (
    <svg viewBox="0 0 80 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* LV monogram inspired by Louis Vuitton */}
      <path d="M18 8 L18 52 L38 52 L38 46 L25 46 L25 8 Z" fill="currentColor" />
      <path d="M42 8 L58 44 L62 44 L62 8 L55 8 L55 36 L44 8 Z" fill="currentColor" />
      <path d="M38 46 L42 52 L46 52 L42 44 Z" fill="currentColor" />
    </svg>
  ),

  versace: (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* V with medusa-inspired detail */}
      <path d="M12 8 L40 52 L68 8 L60 8 L40 40 L20 8 Z" fill="currentColor" />
      <circle cx="40" cy="28" r="6" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="40" cy="28" r="2.5" fill="currentColor" />
      {/* radiating lines */}
      <line x1="40" y1="18" x2="40" y2="14" stroke="currentColor" strokeWidth="2" />
      <line x1="40" y1="38" x2="40" y2="42" stroke="currentColor" strokeWidth="2" />
      <line x1="30" y1="28" x2="26" y2="28" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="28" x2="54" y2="28" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),

  burberry: (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* TB — Thomas Burberry monogram */}
      <text x="8" y="48" fontFamily="Georgia,serif" fontSize="42" fontWeight="700" fill="currentColor" letterSpacing="-3">TB</text>
    </svg>
  ),

  prada: (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* P with inverted triangle */}
      <path d="M22 8 L22 52 L29 52 L29 36 L44 36 Q58 36 58 22 Q58 8 44 8 Z" fill="currentColor" />
      <path d="M29 14 L44 14 Q51 14 51 22 Q51 30 44 30 L29 30 Z" fill="var(--bg-card)" />
      {/* triangle */}
      <path d="M36 42 L44 56 L52 42 Z" fill="currentColor" />
    </svg>
  ),

  valentino: (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* V with star */}
      <path d="M12 8 L40 54 L68 8 L60 8 L40 42 L20 8 Z" fill="currentColor" />
      {/* 5-pointed star small */}
      <path d="M40 14 L41.8 19.5 L47.5 19.5 L43 23 L44.8 28.5 L40 25 L35.2 28.5 L37 23 L32.5 19.5 L38.2 19.5 Z" fill="var(--bg-card)" />
    </svg>
  ),

  hermes: (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* H — Hermès */}
      <rect x="16" y="8" width="7" height="44" rx="1" fill="currentColor" />
      <rect x="57" y="8" width="7" height="44" rx="1" fill="currentColor" />
      <rect x="16" y="27" width="48" height="7" rx="1" fill="currentColor" />
    </svg>
  ),

  rolex: (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Crown + R */}
      {/* crown */}
      <path d="M26 10 L26 22 L32 16 L40 22 L48 16 L54 22 L54 10 Z" fill="currentColor" />
      <rect x="24" y="22" width="32" height="4" fill="currentColor" />
      {/* R */}
      <path d="M30 30 L30 52 L37 52 L37 44 L46 52 L55 52 L44 43 Q52 41 52 36 Q52 30 44 30 Z" fill="currentColor" />
      <path d="M37 36 L44 36 Q45.5 36 45.5 38.5 Q45.5 41 44 41 L37 41 Z" fill="var(--bg-card)" />
    </svg>
  ),
};

function BrandMonogram({ brandId, label }: { brandId: string; label: string }) {
  const mono = MONOGRAMS[brandId.toLowerCase()];
  if (mono) return mono;
  /* fallback: first 2 letters */
  const initials = label.replace(/\s+/g, "").slice(0, 2).toUpperCase();
  return (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text
        x="40" y="46"
        textAnchor="middle"
        fontFamily="Georgia,serif"
        fontSize="40"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-2"
      >
        {initials}
      </text>
    </svg>
  );
}

export function Brands() {
  const { data: brands = [], isLoading } = useGetBrands();
  const [, navigate] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const loopItems = brands.length > 0
    ? [...brands, ...brands, ...brands]
    : [];

  const setW = brands.length * STEP;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || brands.length === 0) return;

    el.scrollLeft = setW + PAD;

    const onScroll = () => {
      const sl = el.scrollLeft;
      if (sl < setW * 0.25)      el.scrollLeft = sl + setW;
      else if (sl > setW * 1.75) el.scrollLeft = sl - setW;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [brands.length, setW]);

  return (
    <div
      dir="rtl"
      style={{
        background: "var(--color-brand-500)",
        position: "relative",
        padding: "2px 0",
        overflow: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .brands-scroll::-webkit-scrollbar { display: none; }
        .brands-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .brands-card {
          flex-shrink: 0;
          width: ${CARD_W}px;
          height: ${CARD_H}px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 10px 6px 8px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(212,175,55,0.3);
          background: #FBFAF8;
          color: #1A1410;
          transition: border-color .18s ease, transform .15s ease, background .18s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .brands-card:active {
          transform: scale(0.95);
          border-color: rgba(212,175,55,0.7);
          background: #F5F0E8;
        }

        .brands-card svg {
          width: 100%;
          height: 52px;
          flex-shrink: 0;
        }

        .brands-label {
          font-family: "Tajawal", sans-serif;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #1A1410;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          text-transform: uppercase;
          line-height: 1.2;
          margin-top: 2px;
          opacity: 0.75;
        }

        .brands-fade-l, .brands-fade-r {
          position: absolute; top: 0;
          width: 44px; height: 100%;
          pointer-events: none; z-index: 5;
        }
        .brands-fade-l { left:0;  background: linear-gradient(to right, var(--color-brand-500) 15%, transparent); }
        .brands-fade-r { right:0; background: linear-gradient(to left,  var(--color-brand-500) 15%, transparent); }
      `}} />

      <div style={{ position: "relative", height: `${CARD_H + 12}px` }}>
        <div className="brands-fade-l" />
        <div className="brands-fade-r" />

        {isLoading ? (
          <div style={{ display: "flex", gap: `${GAP}px`, padding: `6px ${PAD}px`, height: "100%", alignItems: "center" }}>
            {Array.from({ length: SLOT_COUNT }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ flexShrink: 0, width: CARD_W, height: CARD_H, borderRadius: "10px", background: "rgba(212,175,55,0.12)" }}
              />
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="brands-scroll"
            dir="ltr"
            style={{
              display: "flex",
              gap: `${GAP}px`,
              padding: `6px ${PAD}px`,
              overflowX: "scroll",
              height: "100%",
              alignItems: "center",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {loopItems.map((brand, i) => (
              <div
                key={i}
                className="brands-card"
                onClick={() => navigate(`/search?brand=${encodeURIComponent(brand.label)}`)}
                aria-label={`تصفح منتجات ${brand.label}`}
              >
                <BrandMonogram brandId={brand.id} label={brand.label} />
                <span className="brands-label">{brand.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
