import { useState } from "react";
import { useGetBrands } from "@workspace/api-client-react";
import { useLocation } from "wouter";

const BRAND_SLOT_COUNT = 5;

export function Brands() {
  const { data: brands = [], isLoading } = useGetBrands();
  const [, navigate] = useLocation();
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());

  function handleImgError(id: string) {
    setFailedIds((prev) => new Set([...prev, id]));
  }

  return (
    <div className="pt-1 pb-4">
      <div
        className="flex gap-2"
        style={{
          overflowX: "auto",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          paddingInline: "12px",
        }}
      >
        {isLoading
          ? Array.from({ length: BRAND_SLOT_COUNT }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl skeleton flex-shrink-0"
                style={{
                  width: "clamp(90px, 26vw, 120px)",
                  height: "clamp(46px, 13vw, 60px)",
                  border: "1px solid var(--border)",
                }}
              />
            ))
          : brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => navigate(`/search?brand=${encodeURIComponent(brand.label)}`)}
                className="rounded-xl flex items-center justify-center flex-shrink-0 transition-[transform,opacity] active:scale-95 active:opacity-70"
                style={{
                  width: "clamp(90px, 26vw, 120px)",
                  height: "clamp(46px, 13vw, 60px)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  cursor: "pointer",
                  overflow: "hidden",
                  padding: "8px 10px",
                }}
                aria-label={`تصفح منتجات ${brand.label}`}
              >
                {brand.icon && !failedIds.has(brand.id) ? (
                  <img
                    src={brand.icon}
                    alt={brand.label}
                    loading="lazy"
                    className="object-contain w-full h-full"
                    onError={() => handleImgError(brand.id)}
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--font-main)",
                      fontSize: "clamp(8.5px, 2.4vw, 11px)",
                      fontWeight: 700,
                      letterSpacing: "0.8px",
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                      textAlign: "center",
                    }}
                  >
                    {brand.label}
                  </span>
                )}
              </button>
            ))}
      </div>
    </div>
  );
}
