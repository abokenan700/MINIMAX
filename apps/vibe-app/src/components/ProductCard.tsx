/**
 * ProductCard — Unified card replacing DealCard + FeaturedCard
 * layout="vertical"   → grid (formerly FeaturedCard)
 * layout="horizontal" → rail (formerly DealCard)
 */
import { useState } from "react";
import { Eye, Flame, Zap } from "lucide-react";
import { useLocation } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { useWishlist } from "../context/WishlistContext";
import { useQuickView } from "../context/QuickViewContext";
import { CartButton } from "./CartButton";
import { ColorSwatchRow } from "./ColorSwatchRow";
import { Stars } from "./Stars";
import { Heart } from "./ui/Heart";
import { Badge } from "./ui/Badge";
import { Tag } from "./ui/Tag";
import { PriceTag } from "./ui/PriceTag";
import { Divider } from "./ui/Divider";

type Layout  = "vertical" | "horizontal";
type Density = "compact"  | "comfortable";

interface ProductCardProps {
  product:  Product;
  layout?:  Layout;
  density?: Density;
}

/* ── helpers ──────────────────────────────────────────────────── */
function getRemaining(product: Product): number | null {
  if (product.discount < 20) return null;
  return ((product.id * 13 + 7) % 6) + 2;
}
function getViewers(product: Product): number {
  return ((product.id * 17 + 3) % 24) + 4;
}
function formatSales(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".", "٫")} ألف`;
  return n.toLocaleString("ar-SA");
}

/* ── component ────────────────────────────────────────────────── */
export function ProductCard({ product, layout = "vertical", density = "compact" }: ProductCardProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { open: openQuickView }          = useQuickView();
  const [activeColor, setActiveColor]    = useState(0);
  const [, navigate]                     = useLocation();

  const liked        = isWishlisted(product.id);
  const selectedColor = product.colors?.[activeColor] ?? "";
  const remaining    = getRemaining(product);
  const viewers      = getViewers(product);
  const isFire       = product.discount >= 30;

  const isOOS =
    typeof (product as Product & { stock?: number }).stock === "number" &&
    (product as Product & { stock?: number }).stock === 0;
  const stock = (product as Product & { stock?: number }).stock ?? null;
  const isLow = stock !== null && stock > 0 && stock < 5;

  const isHorizontal = layout === "horizontal";

  if (isHorizontal) {
    return <HorizontalCard
      product={product} liked={liked} remaining={remaining} viewers={viewers}
      isFire={isFire} isOOS={isOOS} isLow={isLow} stock={stock}
      activeColor={activeColor} setActiveColor={setActiveColor}
      selectedColor={selectedColor} navigate={navigate}
      toggleWishlist={toggleWishlist}
    />;
  }

  return (
    <article
      aria-label={`${product.name} — ${product.price.toLocaleString("ar-SA")} ريال`}
      className="card-pressable flex flex-col overflow-hidden relative"
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--elev-2)",
        cursor: "pointer",
        opacity: isOOS ? 0.7 : 1,
      }}
    >
      {/* ── Badges row ── */}
      <div className="absolute top-2 inset-x-2 flex items-center justify-between z-10">
        <span>
          {product.is_new ? (
            <Badge variant="new" size="sm" className="new-badge-pulse">جديد</Badge>
          ) : isOOS ? (
            <Badge variant="oos" size="sm">نفد</Badge>
          ) : null}
        </span>
        <Heart
          pressed={liked}
          size={13}
          onClick={(e) => { e?.stopPropagation(); toggleWishlist(product); }}
        />
      </div>

      {/* ── Image ── */}
      <div className="relative w-full group" style={{ aspectRatio: "1 / 1", background: "var(--card-img-bg)" }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.opacity = "0"; }}
        />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); openQuickView(product); }}
          aria-label="نظرة سريعة"
          style={{
            position: "absolute", bottom: 6, insetInlineStart: 6,
            width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", border: "none",
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
            color: "var(--text-primary)", cursor: "pointer",
            boxShadow: "var(--elev-2)",
            transition: "opacity var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
            flexShrink: 0,
          }}
        >
          <Eye size={13} strokeWidth={2} />
        </button>
        {product.discount > 0 && (
          <div style={{
            position: "absolute", top: 36, insetInlineStart: 4,
            background: "var(--color-danger-600)",
            color: "#fff", fontSize: 9, fontWeight: 700,
            padding: "2px 6px", borderRadius: "var(--radius-xs)",
            fontFamily: "var(--font-numeric)", fontVariantNumeric: "tabular-nums",
          }}>
            -{product.discount}%
          </div>
        )}
      </div>

      <Divider />

      {/* ── Content ── */}
      <div className="flex flex-col gap-0.5 px-2 pt-1.5 pb-2">
        {/* Brand + Colors */}
        <div className="flex items-center justify-between">
          <p style={{ fontSize: "clamp(9.5px,2.6vw,11px)", color: "var(--text-brand)", fontWeight: 700, letterSpacing: "0.3px", fontFamily: "var(--font-text)" }}>
            {product.brand}
          </p>
          {product.colors.length > 0 && (
            <ColorSwatchRow
              colors={product.colors}
              active={activeColor}
              onSelect={setActiveColor}
              max={4}
              size="xs"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>

        {/* Name */}
        <p
          className={density === "compact" ? "line-clamp-1" : "line-clamp-2"}
          style={{ fontSize: "clamp(11px,3vw,13px)", color: "var(--text-primary)", fontWeight: 600, lineHeight: "var(--leading-snug)", fontFamily: "var(--font-text)" }}
        >
          {product.name}
        </p>

        {/* Rating + Sales */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Stars rating={product.rating} />
            <span style={{ fontSize: "clamp(9px,2.5vw,10px)", color: "var(--text-brand)", fontWeight: 700, fontFamily: "var(--font-text)" }}>
              {product.rating}
            </span>
          </div>
          <span style={{ fontSize: "clamp(8.5px,2.3vw,9.5px)", color: "var(--text-muted)", fontFamily: "var(--font-text)" }}>
            {formatSales(product.sales)} مبيعة
          </span>
        </div>

        {/* Price */}
        <PriceTag price={product.price} original={product.original_price} size="sm" />

        {/* Discount + Cart */}
        <div className="flex items-center justify-between">
          <Badge variant="discount-soft" size="sm">خصم {product.discount}%</Badge>
          <CartButton size="md" product={product} selectedColor={selectedColor} />
        </div>
      </div>
    </article>
  );
}

/* ── Horizontal (rail) card ──────────────────────────────────── */
interface HCardProps {
  product: Product; liked: boolean; remaining: number | null; viewers: number;
  isFire: boolean; isOOS: boolean; isLow: boolean; stock: number | null;
  activeColor: number; setActiveColor: (i: number) => void;
  selectedColor: string; navigate: (p: string) => void;
  toggleWishlist: (p: Product) => void;
}

function HorizontalCard({ product, liked, remaining, viewers, isFire, isOOS, isLow, stock, setActiveColor, selectedColor, navigate, toggleWishlist }: HCardProps) {
  return (
    <article
      aria-label={`${product.name} — ${product.price.toLocaleString("ar-SA")} ريال`}
      className="deal-card card-pressable"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image block */}
      <div className="deal-card-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.opacity = "0"; }}
        />
        <Heart
          pressed={liked}
          size={13}
          onClick={(e) => { e?.stopPropagation(); toggleWishlist(product); }}
          style={{ position: "absolute", top: 6, insetInlineEnd: 6 }}
        />
      </div>

      <Divider className="deal-card-divider" />

      {/* Content */}
      <div className="deal-card-body" dir="rtl">
        <p className="deal-card-brand">{product.brand}</p>
        <p className="deal-card-name line-clamp-2">{product.name}</p>

        {product.colors && product.colors.length > 0 && (
          <ColorSwatchRow
            colors={product.colors}
            max={3}
            size="xs"
            style={{ marginTop: 2 }}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {/* Viewers */}
        <p className="deal-card-viewers">
          <span className="deal-card-viewers-dot" />
          {viewers} يشاهدون الآن
        </p>

        {/* Price + discount + cart */}
        <div className="deal-card-bottom-row" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col leading-none gap-0.5">
            <div className="flex items-center gap-1">
              <span className="deal-card-discount-inline">
                {isFire && <Flame size={8} className="fill-white stroke-none inline -mt-0.5" />}
                {product.discount}%
              </span>
              <span className="deal-card-original">{product.original_price.toLocaleString("ar-SA")}</span>
            </div>
            <PriceTag price={product.price} size="sm" />
          </div>

          <div style={{ position: "relative", flexShrink: 0 }}>
            <CartButton size="md" product={product} selectedColor={selectedColor} />
          </div>
        </div>

      </div>
    </article>
  );
}
