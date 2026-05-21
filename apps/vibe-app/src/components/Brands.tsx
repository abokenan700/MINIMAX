import { useEffect, useRef, useState } from "react";
import { useGetBrands } from "@workspace/api-client-react";
import { useLocation } from "wouter";

const CARD_W = 104;
const CARD_H = 138;
const GAP    = 14;
const PAD    = 24;
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
        backgroundColor: "#F5F0E8",
        position: "relative",
        padding: "28px 0 36px",
        fontFamily: '"IBM Plex Sans Arabic", sans-serif',
        overflow: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes brands-glow {
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

        @keyframes brands-float {
          0%,100% { transform: translateY(-3px); }
          50%      { transform: translateY(-7px); }
        }

        .brands-scroll::-webkit-scrollbar { display: none; }
        .brands-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .brands-card {
          flex-shrink: 0;
          width: ${CARD_W}px;
          height: ${CARD_H}px;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px;
          cursor: pointer;
          position: relative;
          overflow: hidden;

          border: 1px solid rgba(212,175,55,0.80);
          background: rgba(255,255,255,0.76);
          backdrop-filter: blur(14px) saturate(180%);
          -webkit-backdrop-filter: blur(14px) saturate(180%);

          animation:
            brands-glow  3.2s ease-in-out infinite,
            brands-float 3.2s ease-in-out infinite;
        }

        .brands-card:active {
          background: rgba(255,255,255,0.92);
          border-color: rgba(212,175,55,1.0);
        }

        ${Array.from({ length: 24 }, (_, i) =>
          `.brands-card:nth-child(${i + 1}) { animation-delay: ${(i % SLOT_COUNT) * -0.64}s; }`
        ).join("\n")}

        .brands-card::after {
          content: "";
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(212,175,55,0.12), transparent);
          pointer-events: none;
        }

        .brands-label {
          position: relative;
          z-index: 1;
          font-family: "IBM Plex Sans Arabic", sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #B8763E;
          text-align: center;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
        }

        .brands-img {
          position: relative;
          z-index: 1;
          width: 68%;
          height: 52%;
          object-fit: contain;
          filter: drop-shadow(0 0 6px rgba(212,175,55,0.30));
        }

        .brands-fade-l, .brands-fade-r {
          position: absolute; top: 0;
          width: 56px; height: 100%;
          pointer-events: none; z-index: 5;
        }
        .brands-fade-l { left:0;  background: linear-gradient(to right, #F5F0E8 15%, transparent); }
        .brands-fade-r { right:0; background: linear-gradient(to left,  #F5F0E8 15%, transparent); }
      `}} />

      {/* section title */}
      <h2 style={{
        fontFamily: '"Reem Kufi Fun", sans-serif',
        fontSize: "22px",
        fontWeight: 600,
        color: "#1A1410",
        margin: "0 22px 20px",
        textAlign: "right",
      }}>
        استكشف الماركات
      </h2>

      <div style={{ position: "relative", height: `${CARD_H}px` }}>
        <div className="brands-fade-l" />
        <div className="brands-fade-r" />

        {isLoading ? (
          <div
            style={{
              display: "flex",
              gap: `${GAP}px`,
              padding: `0 ${PAD}px`,
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
              padding: `0 ${PAD}px`,
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
