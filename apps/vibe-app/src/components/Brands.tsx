import { useState } from "react";
import { useGetBrands } from "@workspace/api-client-react";
import { useLocation } from "wouter";

const BRAND_SLOT_COUNT = 5;

export function Brands() {
  const { data: brands = [], isLoading } = useGetBrands();
  const [, navigate] = useLocation();
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleImgError(id: string) {
    setFailedIds((prev) => new Set([...prev, id]));
  }

  return (
    <div
      style={{
        background: "#0d0d0d",
        position: "relative",
        paddingTop: "2px",
        paddingBottom: "2px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(212,175,55,0.25), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(212,175,55,0.25), transparent)",
        }}
      />

      <div
        dir="rtl"
        style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          paddingInline: "12px",
          paddingTop: "10px",
          paddingBottom: "10px",
          scrollSnapType: "x mandatory",
          position: "relative",
        }}
      >
        {isLoading
          ? Array.from({ length: BRAND_SLOT_COUNT }).map((_, i) => (
              <div
                key={i}
                className="skeleton flex-shrink-0"
                style={{
                  width: "clamp(72px, 20vw, 90px)",
                  height: "clamp(90px, 25vw, 116px)",
                  borderRadius: "4px",
                  background: "#1a1a1a",
                  border: "1px solid rgba(212,175,55,0.08)",
                  flexShrink: 0,
                }}
              />
            ))
          : brands.map((brand) => {
              const isActive = activeId === brand.id;
              return (
                <button
                  key={brand.id}
                  onClick={() => {
                    setActiveId(brand.id);
                    navigate(
                      `/search?brand=${encodeURIComponent(brand.label)}`
                    );
                  }}
                  aria-label={`تصفح منتجات ${brand.label}`}
                  style={{
                    position: "relative",
                    flexShrink: 0,
                    scrollSnapAlign: "center",
                    borderRadius: "4px",
                    overflow: "hidden",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    width: isActive
                      ? "clamp(88px, 24vw, 108px)"
                      : "clamp(72px, 20vw, 90px)",
                    height: isActive
                      ? "clamp(110px, 30vw, 136px)"
                      : "clamp(90px, 25vw, 116px)",
                    background: "#111",
                    border: isActive
                      ? "1px solid rgba(212,175,55,0.35)"
                      : "1px solid rgba(255,255,255,0.05)",
                    boxShadow: isActive
                      ? "inset 0 -20px 40px -10px rgba(212,175,55,0.35), 0 8px 24px -8px rgba(0,0,0,0.8)"
                      : "0 4px 16px -4px rgba(0,0,0,0.5)",
                    opacity: !isActive && activeId !== null ? 0.65 : 1,
                    transform: isActive ? "scale(1)" : "scale(0.96)",
                    transition:
                      "width 0.4s ease, height 0.4s ease, opacity 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "65%",
                      background:
                        "linear-gradient(to top, rgba(212,175,55,0.28), transparent)",
                      opacity: isActive ? 1 : 0,
                      transition: "opacity 0.5s ease",
                      pointerEvents: "none",
                    }}
                  />

                  {brand.icon && !failedIds.has(brand.id) ? (
                    <img
                      src={brand.icon}
                      alt={brand.label}
                      loading="lazy"
                      onError={() => handleImgError(brand.id)}
                      style={{
                        position: "relative",
                        zIndex: 1,
                        width: "72%",
                        height: "72%",
                        objectFit: "contain",
                        filter: isActive
                          ? "brightness(1.1) drop-shadow(0 0 8px rgba(212,175,55,0.4))"
                          : "brightness(0.75) grayscale(0.3)",
                        transition: "filter 0.4s ease",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        position: "relative",
                        zIndex: 1,
                        fontFamily: "serif",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        fontSize: "clamp(10px, 2.8vw, 13px)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "85%",
                        textAlign: "center",
                        color: isActive ? "#d4af37" : "#888",
                        textShadow: isActive
                          ? "0 0 12px rgba(212,175,55,0.5)"
                          : "none",
                        transition: "color 0.4s ease, text-shadow 0.4s ease",
                      }}
                    >
                      {brand.label}
                    </span>
                  )}
                </button>
              );
            })}
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "32px",
          background:
            "linear-gradient(to left, #0d0d0d, transparent)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "32px",
          background:
            "linear-gradient(to right, #0d0d0d, transparent)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
