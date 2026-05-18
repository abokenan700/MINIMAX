import { useMemo } from "react";
import { useLocation } from "wouter";
import { useGetProducts } from "@workspace/api-client-react";
import { TrendingUp } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Stars } from "./Stars";
import { CartButton } from "./CartButton";
import { useWishlist } from "../context/WishlistContext";
import { Heart } from "lucide-react";

const RANK_COLORS = [
  { bg: "#D4AF37", text: "#1A1A1A" },
  { bg: "#B0B0B0", text: "#1A1A1A" },
  { bg: "#F97316", text: "#fff" },
];

export function TrendingSection() {
  const { data: products = [], isLoading } = useGetProducts();
  const [, navigate] = useLocation();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const trending = useMemo(() =>
    [...products].sort((a, b) => b.sales - a.sales).slice(0, 6),
    [products]
  );

  return (
    <div style={{ background: "var(--bg-page)", padding: "6px 0 12px" }}>
      <div style={{ padding: "12px 12px 10px" }}>
        <SectionHeader
          title="الأكثر مبيعاً"
          icon={<TrendingUp size={14} strokeWidth={2} style={{ color: "var(--text-brand)" }} />}
          onViewAll={() => navigate("/search")}
        />
      </div>

      <div className="hide-scrollbar" style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 12px" }} dir="rtl">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ flexShrink: 0, width: "clamp(155px, 43vw, 195px)", borderRadius: "var(--radius-card)", overflow: "hidden", background: "var(--card-bg)", border: "1px solid var(--card-border)", boxShadow: "var(--shadow-card)" }}>
                <div className="animate-pulse" style={{ aspectRatio: "1/1", background: "var(--border)" }} />
                <div style={{ height: 1, background: "var(--border-separator)" }} />
                <div className="animate-pulse" style={{ padding: "10px 10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ height: 9, width: "48%", background: "var(--border)", borderRadius: 4 }} />
                  <div style={{ height: 11, width: "82%", background: "var(--border)", borderRadius: 4 }} />
                  <div style={{ height: 9, width: "60%", background: "var(--border)", borderRadius: 4 }} />
                  <div style={{ height: 14, width: "44%", background: "var(--border)", borderRadius: 4 }} />
                </div>
              </div>
            ))
          : trending.map((p, index) => {
              const rank = index < 3 ? RANK_COLORS[index] : { bg: "var(--border)", text: "var(--text-muted)" };
              const liked = isWishlisted(p.id);

              return (
                <article
                  key={p.id}
                  className="card-pressable flex flex-col overflow-hidden"
                  style={{
                    flexShrink: 0,
                    width: "clamp(155px, 43vw, 195px)",
                    position: "relative",
                    borderRadius: "var(--radius-card)",
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    boxShadow: "var(--shadow-card)",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  {/* Badges row — rank + wishlist */}
                  <div className="absolute top-2 inset-x-2 flex items-center justify-between z-10">
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: rank.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "var(--shadow-sm)",
                      flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: rank.text }}>{index + 1}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                      aria-label={liked ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                      style={{ minWidth: 44, minHeight: 44, background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <span className="flex items-center justify-center rounded-full"
                        style={{ width: 26, height: 26, background: "rgba(255,255,255,0.90)", boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}>
                        <Heart size={12} className={liked ? "fill-red-400 stroke-red-400" : "fill-none"} style={{ color: liked ? undefined : "#BBBBBB" }} />
                      </span>
                    </button>
                  </div>

                  {/* Image */}
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", background: "var(--card-img-bg)" }}>
                    <img src={p.image} alt={p.name} loading="lazy"
                      className="absolute inset-0 w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.style.opacity = "0"; }} />
                  </div>

                  {/* Divider */}
                  <div style={{ height: "1px", background: "var(--border-separator)" }} />

                  {/* Content */}
                  <div className="flex flex-col gap-1 px-2.5 pt-2 pb-2.5" dir="rtl">
                    <p style={{ fontSize: "clamp(9.5px, 2.6vw, 11px)", color: "var(--text-brand)", fontWeight: 700, letterSpacing: "0.3px" }}>{p.brand}</p>
                    <p className="line-clamp-1 font-semibold" style={{ fontSize: "clamp(11px, 3vw, 13px)", color: "var(--text-primary)", lineHeight: 1.35 }}>{p.name}</p>
                    <div className="flex items-center gap-1">
                      <Stars rating={p.rating} />
                      <span style={{ fontSize: "clamp(9px, 2.5vw, 10px)", color: "var(--text-brand)", fontWeight: 700 }}>{p.rating}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <div className="flex items-baseline gap-0.5">
                        <span style={{ fontSize: "clamp(13px, 3.6vw, 15px)", fontWeight: 800, color: "var(--text-price)" }}>{p.price.toLocaleString("ar-SA")}</span>
                        <span style={{ fontSize: "clamp(9px, 2.5vw, 10px)", color: "var(--text-muted)" }}>ر.س</span>
                      </div>
                      <span className="line-through" style={{ fontSize: "clamp(8.5px, 2.3vw, 9.5px)", color: "var(--text-muted)" }}>{p.original_price.toLocaleString("ar-SA")}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span style={{ fontSize: "clamp(8.5px, 2.3vw, 9.5px)", fontWeight: 700, background: "var(--discount-bg)", color: "var(--discount-text)", borderRadius: "var(--radius-pill)", padding: "2px 8px", border: "1px solid rgba(249,115,22,0.15)" }}>
                        خصم {p.discount}%
                      </span>
                      <div onClick={(e) => e.stopPropagation()}>
                        <CartButton size="md" product={p} selectedColor={p.colors?.[0]} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
      </div>
    </div>
  );
}
