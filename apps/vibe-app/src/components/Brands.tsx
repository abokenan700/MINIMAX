import { useEffect, useRef, useState } from "react";
import { useGetBrands } from "@workspace/api-client-react";
import { useLocation } from "wouter";

const CARD_W = 114;
const CARD_H = 90;
const GAP    = 10;
const PAD    = 16;
const STEP   = CARD_W + GAP;
const SLOT_COUNT = 5;

export function Brands() {
  const { data: brands = [], isLoading } = useGetBrands();
  const [, navigate] = useLocation();
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
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
        padding: "8px 0",
        fontFamily: '"IBM Plex Sans Arabic", sans-serif',
        overflow: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes brands-glow {
          0%,100% {
            box-shadow:
              0 6px 18px -4px rgba(180,140,60,0.28),
              inset 0 0 10px rgba(212,175,55,0.08);
          }
          50% {
            box-shadow:
              0 8px 26px -4px rgba(180,140,60,0.48),
              inset 0 0 18px rgba(212,175,55,0.18);
          }
        }

        @keyframes brands-float {
          0%,100% { transform: translateY(-2px); }
          50%      { transform: translateY(-5px); }
        }

        .brands-scroll::-webkit-scrollbar { display: none; }
        .brands-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .brands-card {
          flex-shrink: 0;
          width: ${CARD_W}px;
          height: ${CARD_H}px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 0;
          cursor: pointer;
          position: relative;
          overflow: hidden;

          border: 1px solid rgba(212,175,55,0.38);
          background: var(--bg-card);
          backdrop-filter: blur(12px) saturate(160%);
          -webkit-backdrop-filter: blur(12px) saturate(160%);

          animation:
            brands-glow  3.2s ease-in-out infinite,
            brands-float 3.2s ease-in-out infinite;

          transition: border-color .2s ease, background .2s ease;
        }

        .brands-card:active {
          border-color: rgba(212,175,55,0.75);
        }

        ${Array.from({ length: 24 }, (_, i) =>
          `.brands-card:nth-child(${i + 1}) { animation-delay: ${(i % SLOT_COUNT) * -0.64}s; }`
        ).join("\n")}

        .brands-card::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 45%;
          background: linear-gradient(to top, rgba(212,175,55,0.10), transparent);
          pointer-events: none;
        }

        .brands-label {
          position: relative;
          z-index: 1;
          font-family: "IBM Plex Sans Arabic", sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #d4af37;
          text-align: center;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
          text-shadow: 0 0 8px rgba(212,175,55,0.35);
        }

        .brands-img {
          display: block;
          width: 92%;
          height: 78%;
          object-fit: contain;
          margin: auto;
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
          <div
            style={{
              display: "flex",
              gap: `${GAP}px`,
              padding: `6px ${PAD}px`,
              height: "100%",
              alignItems: "center",
            }}
          >
            {Array.from({ length: SLOT_COUNT }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{
                  flexShrink: 0,
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: "18px",
                  background: "rgba(212,175,55,0.10)",
                  border: "1px solid rgba(212,175,55,0.15)",
                }}
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
                onClick={() =>
                  navigate(`/search?brand=${encodeURIComponent(brand.label)}`)
                }
                aria-label={`تصفح منتجات ${brand.label}`}
              >
                {brand.icon && !failedIds.has(brand.id) ? (
                  <img
                    src={brand.icon}
                    alt={brand.label}
                    loading="lazy"
                    className="brands-img"
                    onError={() =>
                      setFailedIds((prev) => new Set([...prev, brand.id]))
                    }
                  />
                ) : (
                  <span className="brands-label">{brand.label}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
