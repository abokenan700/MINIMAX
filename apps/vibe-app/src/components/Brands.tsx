import { useEffect, useRef, useState } from "react";
import { useGetBrands } from "@workspace/api-client-react";
import { useLocation } from "wouter";

const CARD_W = 82;
const CARD_H = 110;
const GAP    = 10;
const PAD    = 14;
const STEP   = CARD_W + GAP;

const SLOT_COUNT = 5;

export function Brands() {
  const { data: brands = [], isLoading } = useGetBrands();
  const [, navigate] = useLocation();
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  // 3 copies for seamless infinite loop
  const loopItems = brands.length > 0
    ? [...brands, ...brands, ...brands]
    : [];

  const setW = brands.length * STEP;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || brands.length === 0) return;

    // Start at middle copy
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
      style={{
        background: "#0d0d0d",
        position: "relative",
        paddingTop: "2px",
        paddingBottom: "2px",
      }}
    >
      {/* top gold line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, rgba(212,175,55,0.25), transparent)",
      }} />
      {/* bottom gold line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, rgba(212,175,55,0.25), transparent)",
      }} />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes brands-glow {
          0%,100% {
            box-shadow:
              0 8px 22px -4px rgba(180,140,60,0.22),
              inset 0 0 10px rgba(212,175,55,0.07);
          }
          50% {
            box-shadow:
              0 10px 30px -4px rgba(180,140,60,0.42),
              inset 0 0 18px rgba(212,175,55,0.16);
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
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 8px;
          cursor: pointer;
          position: relative;
          overflow: hidden;

          border: 1px solid rgba(212,175,55,0.32);
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(10px) saturate(140%);
          -webkit-backdrop-filter: blur(10px) saturate(140%);

          animation:
            brands-glow  3.2s ease-in-out infinite,
            brands-float 3.2s ease-in-out infinite;

          transition: border-color .25s ease, background .25s ease;
        }

        .brands-card:active {
          background: rgba(212,175,55,0.08);
          border-color: rgba(212,175,55,0.65);
        }

        /* stagger so cards float at different phases */
        ${Array.from({ length: 24 }, (_, i) =>
          `.brands-card:nth-child(${i + 1}) { animation-delay: ${(i % SLOT_COUNT) * -0.62}s; }`
        ).join("\n")}

        /* bottom gold shimmer overlay */
        .brands-card::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(212,175,55,0.18), transparent);
          pointer-events: none;
        }

        .brands-label {
          position: relative;
          z-index: 1;
          font-family: serif;
          font-size: clamp(9px, 2.4vw, 11px);
          font-weight: 700;
          letter-spacing: 0.4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
          text-align: center;
          color: #d4af37;
          text-shadow: 0 0 10px rgba(212,175,55,0.45);
        }

        .brands-img {
          position: relative;
          z-index: 1;
          width: 68%;
          height: 52%;
          object-fit: contain;
          filter: brightness(1.05) drop-shadow(0 0 6px rgba(212,175,55,0.35));
        }

        .brands-fade-l, .brands-fade-r {
          position: absolute; top: 0;
          width: 32px; height: 100%;
          pointer-events: none; z-index: 5;
        }
        .brands-fade-l { left:0;  background: linear-gradient(to right, #0d0d0d 10%, transparent); }
        .brands-fade-r { right:0; background: linear-gradient(to left,  #0d0d0d 10%, transparent); }
      `}} />

      <div style={{ position: "relative" }}>
        <div className="brands-fade-l" />
        <div className="brands-fade-r" />

        {isLoading ? (
          /* skeleton */
          <div
            dir="rtl"
            style={{
              display: "flex",
              gap: `${GAP}px`,
              padding: `10px ${PAD}px`,
              overflowX: "hidden",
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
                  borderRadius: "6px",
                  background: "#1a1a1a",
                  border: "1px solid rgba(212,175,55,0.08)",
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
              padding: `10px ${PAD}px`,
              overflowX: "scroll",
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
