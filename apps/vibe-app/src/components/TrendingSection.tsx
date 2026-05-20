import { useMemo } from "react";
import { useLocation } from "wouter";
import { useGetProducts } from "@workspace/api-client-react";
import { TrendingUp, Heart } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Stars } from "./Stars";
import { CartButton } from "./CartButton";
import { useWishlist } from "../context/WishlistContext";
import { colorToCss, needsBorder } from "../lib/colorMap";

const RANK_STYLES = [
  { bg: "linear-gradient(135deg, #D4AF37, #B8960C)", text: "#fff", label: "🥇" },
  { bg: "linear-gradient(135deg, #B0B0B0, #888888)", text: "#fff", label: "🥈" },
  { bg: "linear-gradient(135deg, #EA580C, #C2410C)", text: "#fff", label: "🥉" },
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
    <div className="trending-section">
      <div className="trending-header-wrap">
        <SectionHeader
          title="الأكثر مبيعاً"
          icon={<TrendingUp size={14} strokeWidth={2.2} style={{ color: "var(--text-brand)" }} />}
          onViewAll={() => navigate("/search")}
        />
      </div>

      <div className="hide-scrollbar trending-scroll" dir="rtl">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="trending-card-skeleton animate-pulse" />
            ))
          : trending.map((p, index) => {
              const rank  = index < 3 ? RANK_STYLES[index] : null;
              const liked = isWishlisted(p.id);

              return (
                <article
                  key={p.id}
                  className="trending-card card-pressable"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  {/* Rank badge */}
                  {rank && (
                    <div
                      className="trending-rank-badge"
                      style={{ background: rank.bg }}
                      aria-label={`المرتبة ${index + 1}`}
                    >
                      <span style={{ fontSize: 11, color: rank.text, fontWeight: 700 }}>{index + 1}</span>
                    </div>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                    aria-label={liked ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                    className="trending-wish-btn"
                  >
                    <Heart size={12} className={liked ? "fill-red-400 stroke-red-400" : "fill-none"} style={{ color: liked ? undefined : "#AAAAAA" }} />
                  </button>

                  {/* Image */}
                  <div className="trending-img-wrap">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.style.opacity = "0"; }}
                    />
                  </div>

                  <div style={{ height: "1px", background: "var(--border-separator)" }} />

                  {/* Info */}
                  <div className="trending-card-body" dir="rtl">
                    <p className="trending-brand">{p.brand}</p>
                    <p className="line-clamp-2 trending-name">{p.name}</p>

                    {/* Color swatches — 14px circles beneath product name */}
                    {p.colors && p.colors.length > 0 && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 3, marginBottom: 2 }}
                      >
                        {p.colors.slice(0, 3).map((c, i) => (
                          <span
                            key={i}
                            aria-label={c}
                            style={{
                              display: "block",
                              width: 14,
                              height: 14,
                              borderRadius: "50%",
                              background: colorToCss(c),
                              flexShrink: 0,
                              boxShadow: `0 1px 3px rgba(0,0,0,0.20)${needsBorder(c) ? ", 0 0 0 1px rgba(0,0,0,0.12)" : ""}`,
                            }}
                          />
                        ))}
                        {p.colors.length > 3 && (
                          <span style={{
                            fontSize: 8,
                            fontFamily: "var(--font-text)",
                            color: "var(--text-muted)",
                            fontWeight: 600,
                            lineHeight: 1,
                          }}>
                            +{p.colors.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-0.5">
                      <Stars rating={p.rating} />
                      <span className="trending-rating">{p.rating}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-baseline gap-0.5">
                        <span className="trending-price">{p.price.toLocaleString("ar-SA")}</span>
                        <span className="trending-currency">ر.س</span>
                      </div>
                      <span className="trending-original">{p.original_price.toLocaleString("ar-SA")}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="trending-discount-badge">خصم {p.discount}%</span>
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
