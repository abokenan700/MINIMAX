/**
 * FeaturedCard — شبكة 2 عمود للمنتجات المميزة
 * نظيره للتمرير الأفقي: DealCard.tsx
 */
import { useState } from "react";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { CartButton } from "./CartButton";
import { useWishlist } from "../context/WishlistContext";
import { colorToCss, needsBorder } from "../lib/colorMap";
import { Stars } from "./Stars";

function formatSales(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".", "٫")} ألف`;
  return n.toLocaleString("ar-SA");
}

export function FeaturedCard({ item }: { item: Product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [activeColor, setActiveColor] = useState(0);
  const [, navigate] = useLocation();
  const liked = isWishlisted(item.id);
  const selectedColor = item.colors?.[activeColor] ?? "";

  return (
    <article
      aria-label={`${item.name} — ${item.price.toLocaleString("ar-SA")} ريال`}
      className="card-pressable flex flex-col overflow-hidden relative"
      onClick={() => navigate(`/product/${item.id}`)}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-card)",
        cursor: "pointer",
      }}
    >
      {/* Badges row */}
      <div className="absolute top-2 inset-x-2 flex items-center justify-between z-10">
        {item.is_new ? (
          <span
            style={{
              fontSize: "clamp(7.5px, 2vw, 9px)",
              fontWeight: 700,
              color: "#fff",
              background: "var(--gradient-cta)",
              borderRadius: "var(--radius-pill)",
              padding: "2.5px 8px",
              lineHeight: 1.4,
              letterSpacing: "0.3px",
            }}
          >
            جديد
          </span>
        ) : (
          <span />
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}
          aria-label={liked ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Heart
            size={13}
            className={liked ? "fill-red-400 stroke-red-400" : "fill-none"}
            style={{ color: liked ? undefined : "#BBBBBB" }}
          />
        </button>
      </div>

      {/* Image */}
      <div
        className="relative w-full"
        style={{ aspectRatio: "1 / 1", background: "var(--card-img-bg)" }}
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.opacity = "0"; }}
        />
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border-separator)" }} />

      {/* Content */}
      <div className="flex flex-col gap-1 px-2.5 pt-2 pb-2.5">
        {/* Brand + Colors */}
        <div className="flex items-center justify-between">
          <p style={{ fontSize: "clamp(9.5px, 2.6vw, 11px)", color: "var(--text-brand)", fontWeight: 700, letterSpacing: "0.3px" }}>
            {item.brand}
          </p>
          {item.colors.length > 0 && (
            <div
              className="flex items-center"
              style={{ gap: 4 }}
              onClick={(e) => e.stopPropagation()}
            >
              {item.colors.slice(0, 4).map((c, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveColor(i); }}
                  aria-label={`اللون ${c}`}
                  aria-pressed={i === activeColor}
                  style={{
                    width: 22, height: 22, padding: 0, border: "none",
                    background: "transparent", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, position: "relative",
                  }}
                >
                  <span
                    className="rounded-full block"
                    style={{
                      width: 13,
                      height: 13,
                      background: colorToCss(c),
                      boxShadow: "0 1px 4px rgba(0,0,0,0.22)",
                      transition: "transform 0.15s ease",
                      transform: i === activeColor ? "scale(1.35)" : "scale(1)",
                    }}
                  />
                </button>
              ))}
              {item.colors.length > 4 && (
                <span style={{
                  fontSize: "9px",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  lineHeight: 1,
                }}>
                  +{item.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Name */}
        <p className="line-clamp-1 font-semibold" style={{ fontSize: "clamp(11px, 3vw, 13px)", color: "var(--text-primary)", lineHeight: 1.35 }}>
          {item.name}
        </p>

        {/* Rating + Sales */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Stars rating={item.rating} />
            <span style={{ fontSize: "clamp(9px, 2.5vw, 10px)", color: "var(--text-brand)", fontWeight: 700 }}>
              {item.rating}
            </span>
          </div>
          <span style={{ fontSize: "clamp(8.5px, 2.3vw, 9.5px)", color: "var(--text-muted)" }}>
            {formatSales(item.sales)} مبيعة
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-baseline gap-0.5">
            <span style={{ fontSize: "clamp(13px, 3.6vw, 15px)", fontWeight: 800, color: "var(--text-price)" }}>
              {item.price.toLocaleString("ar-SA")}
            </span>
            <span style={{ fontSize: "clamp(9px, 2.5vw, 10px)", color: "var(--text-muted)" }}>ر.س</span>
          </div>
          <span className="line-through" style={{ fontSize: "clamp(8.5px, 2.3vw, 9.5px)", color: "var(--text-muted)" }}>
            {item.original_price.toLocaleString("ar-SA")}
          </span>
        </div>

        {/* Discount + Cart */}
        <div className="flex items-center justify-between mt-0.5">
          <span
            style={{
              fontSize: "clamp(8.5px, 2.3vw, 9.5px)",
              fontWeight: 700,
              background: "var(--discount-bg)",
              color: "var(--discount-text)",
              borderRadius: "var(--radius-pill)",
              padding: "2px 8px",
              border: "1px solid rgba(249,115,22,0.15)",
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
