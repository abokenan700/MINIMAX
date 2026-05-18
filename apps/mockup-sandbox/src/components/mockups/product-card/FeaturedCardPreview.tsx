import { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import "./styles.css";

function colorToCss(c: string): string {
  if (c.startsWith("#") || c.startsWith("rgb")) return c;
  return c;
}

function needsBorder(c: string): boolean {
  if (!c.startsWith("#")) return false;
  const hex = c.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 0.80;
}

const PRODUCTS = [
  {
    id: 1,
    name: "عطر شانيل No.5",
    brand: "CHANEL",
    price: 385,
    original_price: 550,
    discount: 30,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400",
    is_new: false,
    rating: 4.9,
    sales: 1420,
    colors: ["#F5F0E8", "#E8D5B7", "#C0A882"],
  },
  {
    id: 2,
    name: "حقيبة ديور سادل",
    brand: "DIOR",
    price: 8200,
    original_price: 9800,
    discount: 16,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
    is_new: true,
    rating: 4.8,
    sales: 312,
    colors: ["#1C1C1C", "#8B6914", "#D4B483", "#F5EDD8"],
  },
  {
    id: 3,
    name: "نظارة غوتشي شمسية",
    brand: "GUCCI",
    price: 1450,
    original_price: 1800,
    discount: 19,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    is_new: false,
    rating: 4.7,
    sales: 880,
    colors: ["#0A0A0A", "#2C2C5E"],
  },
  {
    id: 4,
    name: "ساعة رولكس سبمارينر",
    brand: "ROLEX",
    price: 42000,
    original_price: 48000,
    discount: 12,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400",
    is_new: true,
    rating: 5.0,
    sales: 95,
    colors: ["#C0C0C0", "#1B3A5C", "#1C1C1C", "#1B4D2C", "#B8860B"],
  },
];

function formatSales(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={9}
          style={{
            fill: s <= Math.round(rating) ? "#F97316" : "none",
            color: s <= Math.round(rating) ? "#F97316" : "#DDDDDD",
          }}
        />
      ))}
    </div>
  );
}

function Card({ item }: { item: typeof PRODUCTS[0] }) {
  const [activeColor, setActiveColor] = useState(0);
  const [liked, setLiked] = useState(false);

  return (
    <article
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        width: 160,
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* Badges */}
      <div style={{ position: "absolute", top: 8, left: 8, right: 8, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10 }}>
        {item.is_new ? (
          <span style={{ fontSize: 8, fontWeight: 700, color: "#fff", background: "linear-gradient(135deg,#F97316,#EA580C)", borderRadius: 20, padding: "2.5px 8px" }}>
            جديد
          </span>
        ) : <span />}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          style={{ width: 28, height: 28, background: "rgba(255,255,255,0.90)", border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}
        >
          <Heart size={11} style={{ fill: liked ? "#F87171" : "none", color: liked ? "#F87171" : "#BBBBBB" }} />
        </button>
      </div>

      {/* Image */}
      <div style={{ width: "100%", aspectRatio: "1/1", background: "#FAFAFA", position: "relative" }}>
        <img src={item.image} alt={item.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: 12 }} />
      </div>

      <div style={{ height: 1, background: "rgba(0,0,0,0.05)" }} />

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "8px 10px 10px" }}>

        {/* Brand + Colors */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, color: "#F97316", fontWeight: 700, letterSpacing: "0.3px" }}>{item.brand}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} onClick={(e) => e.stopPropagation()}>
            {item.colors.slice(0, 4).map((c, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveColor(i); }}
                style={{
                  width: 22, height: 22, padding: 0, border: "none",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, position: "relative",
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    display: "block",
                    background: colorToCss(c),
                    boxShadow: needsBorder(c)
                      ? "inset 0 0 0 1px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.10)"
                      : "0 1px 3px rgba(0,0,0,0.18)",
                    transition: "transform 0.15s ease",
                    transform: i === activeColor ? "scale(1.25)" : "scale(1)",
                  }}
                />
                {i === activeColor && (
                  <span style={{
                    position: "absolute",
                    width: 5, height: 5,
                    background: needsBorder(c) ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.85)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                  }} />
                )}
              </button>
            ))}
            {item.colors.length > 4 && (
              <span style={{ fontSize: 9, color: "#9A9A9A", fontWeight: 600 }}>+{item.colors.length - 4}</span>
            )}
          </div>
        </div>

        {/* Name */}
        <p style={{ fontSize: 12, fontWeight: 600, color: "#0F0F0F", lineHeight: 1.35, margin: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {item.name}
        </p>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Stars rating={item.rating} />
            <span style={{ fontSize: 9, color: "#F97316", fontWeight: 700 }}>{item.rating}</span>
          </div>
          <span style={{ fontSize: 9, color: "#9A9A9A" }}>{formatSales(item.sales)} مبيعة</span>
        </div>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#0F0F0F" }}>{item.price.toLocaleString("ar-SA")}</span>
          <span style={{ fontSize: 9, color: "#9A9A9A" }}>ر.س</span>
          <span style={{ fontSize: 9, color: "#9A9A9A", textDecoration: "line-through", marginRight: "auto" }}>{item.original_price.toLocaleString("ar-SA")}</span>
        </div>

        {/* Discount + Cart */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 9, fontWeight: 700, background: "#FFF7F0", color: "#EA580C", borderRadius: 20, padding: "2px 8px", border: "1px solid rgba(249,115,22,0.15)" }}>
            خصم {item.discount}%
          </span>
          <button style={{ width: 30, height: 30, background: "none", border: "1.5px solid #F97316", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShoppingCart size={13} style={{ color: "#F97316" }} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function FeaturedCardPreview() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#F7F7F7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        fontFamily: "'Tajawal', 'Cairo', 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 160px)", gap: 12 }}>
        {PRODUCTS.map((p) => <Card key={p.id} item={p} />)}
      </div>
    </div>
  );
}
