import { useState } from "react";
import { Heart, Eye } from "lucide-react";
import { useLocation } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { CartButton } from "./CartButton";
import { useWishlist } from "../context/WishlistContext";
import { useQuickView } from "../context/QuickViewContext";
import { colorToCss, needsBorder } from "../lib/colorMap";
import { Stars } from "./Stars";

function formatSales(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".", "٫")} ألف`;
  return n.toLocaleString("ar-SA");
}

export function FeaturedCard({ item }: { item: Product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { open: openQuickView } = useQuickView();
  const [activeColor, setActiveColor] = useState(0);
  const [, navigate] = useLocation();
  const liked = isWishlisted(item.id);
  const selectedColor = item.colors?.[activeColor] ?? "";

  const isOutOfStock = typeof (item as Product & { stock?: number }).stock === "number" && (item as Product & { stock?: number }).stock === 0;

  return (
    <article
      aria-label={`${item.name} — ${item.price.toLocaleString("ar-SA")} ريال`}
      className="card-pressable flex flex-col overflow-hidden relative"
      onClick={() => navigate(`/product/${item.id}`)}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--elev-2)",
        cursor: "pointer",
        opacity: isOutOfStock ? 0.7 : 1,
      }}
    >
      {/* Badges row */}
      <div className="absolute top-2 inset-x-2 flex items-center justify-between z-10">
        {item.is_new ? (
          <span
            className="new-badge-pulse"
            style={{
              fontSize: "clamp(7.5px, 2vw, 9px)",
              fontWeight: 700,
              color: "#fff",
              background: "var(--gradient-brand)",
              borderRadius: "var(--radius-pill)",
              padding: "2.5px 8px",
              lineHeight: 1.4,
              letterSpacing: "0.3px",
            }}
          >
            جديد
          </span>
        ) : isOutOfStock ? (
          <span style={{ fontSize: "clamp(7.5px, 2vw, 9px)", fontWeight: 700, color: "#fff", background: "rgba(0,0,0,0.55)", borderRadius: "var(--radius-pill)", padding: "2.5px 8px", lineHeight: 1.4 }}>
            نفد
          </span>
        ) : (
          <span />
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}
          aria-label={liked ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Heart
            size={13}
            className={liked ? "fill-red-400 stroke-red-400 heart-pop" : "fill-none"}
            style={{ color: liked ? undefined : "#BBBBBB" }}
          />
        </button>
      </div>

      {/* Image */}
      <div className="relative w-full group" style={{ aspectRatio: "1 / 1", background: "var(--card-img-bg)" }}>
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.opacity = "0"; }}
        />
        <button
          onClick={(e) => { e.stopPropagation(); openQuickView(item); }}
          aria-label="نظرة سريعة"
          style={{
            position: "absolute",
            bottom: 6,
            insetInlineStart: 6,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            color: "var(--text-primary)",
            cursor: "pointer",
            boxShadow: "var(--elev-2)",
            transition: "opacity 0.2s, transform 0.2s",
            flexShrink: 0,
          }}
        >
          <Eye size={13} strokeWidth={2} />
        </button>

        {item.discount > 0 && (
          <div style={{
            position: "absolute", top: 36, insetInlineStart: 4,
            background: "var(--color-danger-600)",
            color: "#fff", fontSize: 9, fontWeight: 700,
            padding: "2px 6px", borderRadius: "var(--radius-xs)",
            fontFamily: "var(--font-numeric)",
            fontVariantNumeric: "tabular-nums",
          }}>
            -{item.discount}%
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border-separator)" }} />

      {/* Content */}
      <div className="flex flex-col gap-0.5 px-2 pt-1.5 pb-2">
        {/* Brand + Colors */}
        <div className="flex items-center justify-between">
          <p style={{ fontSize: "clamp(9.5px, 2.6vw, 11px)", color: "var(--text-brand)", fontWeight: 700, letterSpacing: "0.3px", fontFamily: "var(--font-text)" }}>
            {item.brand}
          </p>
          {item.colors.length > 0 && (
            <div className="flex items-center" style={{ gap: 4 }} onClick={(e) => e.stopPropagation()}>
              {item.colors.slice(0, 4).map((c, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveColor(i); }}
                  aria-label={`اللون ${c}`}
                  aria-pressed={i === activeColor}
                  style={{ width: 22, height: 22, padding: 0, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}
                >
                  <span
                    className="rounded-full block"
                    style={{
                      width: 14, height: 14,
                      background: colorToCss(c),
                      boxShadow: `0 1px 4px rgba(0,0,0,0.22)${needsBorder(c) ? ", 0 0 0 1px rgba(0,0,0,0.12)" : ""}`,
                      transition: "transform 0.15s ease",
                      transform: i === activeColor ? "scale(1.35)" : "scale(1)",
                    }}
                  />
                </button>
              ))}
              {item.colors.length > 4 && (
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: 600, lineHeight: 1, fontFamily: "var(--font-text)" }}>
                  +{item.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Name */}
        <p className="line-clamp-1 font-semibold" style={{ fontSize: "clamp(11px, 3vw, 13px)", color: "var(--text-primary)", lineHeight: "var(--leading-snug)", fontFamily: "var(--font-text)" }}>
          {item.name}
        </p>

        {/* Rating + Sales */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Stars rating={item.rating} />
            <span style={{ fontSize: "clamp(9px, 2.5vw, 10px)", color: "var(--text-brand)", fontWeight: 700, fontFamily: "var(--font-text)" }}>
              {item.rating}
            </span>
          </div>
          <span style={{ fontSize: "clamp(8.5px, 2.3vw, 9.5px)", color: "var(--text-muted)", fontFamily: "var(--font-text)" }}>
            {formatSales(item.sales)} مبيعة
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-0.5">
            <span style={{ fontSize: "clamp(13px, 3.6vw, 15px)", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-numeric)", fontVariantNumeric: "tabular-nums" }}>
              {item.price.toLocaleString("ar-SA")}
            </span>
            <span style={{ fontSize: "clamp(9px, 2.5vw, 10px)", color: "var(--text-muted)", fontFamily: "var(--font-numeric)" }}>ر.س</span>
          </div>
          <span className="line-through" style={{ fontSize: "clamp(8.5px, 2.3vw, 9.5px)", color: "var(--text-muted)", fontFamily: "var(--font-numeric)", fontVariantNumeric: "tabular-nums" }}>
            {item.original_price.toLocaleString("ar-SA")}
          </span>
        </div>

        {/* Discount + Cart */}
        <div className="flex items-center justify-between">
          <span
            style={{
              fontSize: "clamp(8.5px, 2.3vw, 9.5px)",
              fontWeight: 700,
              background: "var(--color-brand-50)",
              color: "var(--color-brand-700)",
              borderRadius: "var(--radius-pill)",
              padding: "2px 8px",
              border: "1px solid rgba(194,65,12,0.15)",
              fontFamily: "var(--font-numeric)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            خصم {item.discount}%
          </span>
          <CartButton size="md" product={item} selectedColor={selectedColor} />
        </div>
      </div>
    </article>
  );
}
