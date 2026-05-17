/**
 * DealCard — عروض اليوم (تمرير أفقي، عرض محدد)
 * نظيره للشبكة: FeaturedCard.tsx
 */
import { Heart } from "lucide-react";
import { useLocation } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { CartButton } from "./CartButton";
import { useWishlist } from "../context/WishlistContext";

export function DealCard({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [, navigate] = useLocation();
  const liked = isWishlisted(product.id);

  return (
    <article
      aria-label={`${product.name} — ${product.price.toLocaleString("ar-SA")} ريال`}
      className="card-pressable flex-shrink-0 overflow-hidden"
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        width: "clamp(112px, 30vw, 138px)",
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-card)",
        cursor: "pointer",
      }}
    >
      <div className="relative" style={{ aspectRatio: "1 / 0.95", background: "var(--card-img-bg)" }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-contain p-2.5"
          onError={(e) => { e.currentTarget.style.opacity = "0"; }}
        />
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          aria-label={liked ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          className="absolute top-0 end-0 flex items-start justify-end"
          style={{
            minWidth: 44, minHeight: 44,
            padding: "7px 7px 0 0",
            background: "transparent", border: "none", cursor: "pointer",
          }}
        >
          <span
            className="w-6 h-6 flex items-center justify-center rounded-full"
            style={{
              background: "rgba(255,255,255,0.88)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
            }}
          >
            <Heart
              className={`w-3.5 h-3.5 ${liked ? "fill-red-400 stroke-red-400" : "fill-none"}`}
              style={{ color: liked ? undefined : "#BBBBBB" }}
            />
          </span>
        </button>
      </div>

      <div style={{ height: 1, background: "var(--border-separator)" }} />

      <div className="px-2 pt-1.5 pb-2">
        <p style={{ fontSize: "clamp(8.5px, 2.3vw, 10px)", color: "var(--text-brand)", fontWeight: 700, letterSpacing: "0.2px", lineHeight: 1.3 }}>
          {product.brand}
        </p>
        <p className="leading-snug line-clamp-1 mt-0.5" style={{ fontSize: "clamp(10px, 2.8vw, 12px)", color: "var(--text-primary)", fontWeight: 600 }}>
          {product.name}
        </p>

        <div className="flex items-center justify-between mt-1.5 gap-1">
          <div className="flex items-baseline gap-0.5">
            <span style={{ fontSize: "clamp(11px, 3vw, 13px)", fontWeight: 800, color: "var(--text-price)" }}>
              {product.price.toLocaleString("ar-SA")}
            </span>
            <span style={{ fontSize: "clamp(8px, 2.2vw, 9px)", color: "var(--text-muted)" }}>ر.س</span>
          </div>
          <span className="line-through" style={{ fontSize: "clamp(8px, 2.2vw, 9px)", color: "var(--text-muted)" }}>
            {product.original_price.toLocaleString("ar-SA")}
          </span>
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <span
            style={{
              fontSize: "clamp(8.5px, 2.3vw, 9.5px)",
              fontWeight: 700,
              background: "var(--discount-bg)",
              color: "var(--discount-text)",
              borderRadius: "var(--radius-pill)",
              padding: "2px 7px",
              border: "1px solid rgba(249,115,22,0.15)",
            }}
          >
            خصم {product.discount}%
          </span>
          <CartButton size="sm" product={product} selectedColor={product.colors?.[0]} />
        </div>
      </div>
    </article>
  );
}
