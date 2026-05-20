/**
 * DealCard — عروض اليوم (تمرير أفقي)
 * نظيره للشبكة: FeaturedCard.tsx
 */
import { Heart, Flame, ShoppingBag, Check } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import type { Product } from "@workspace/api-client-react";
import { useWishlist } from "../context/WishlistContext";
import { useCartButton } from "../hooks/useCartButton";
import { colorToCss, needsBorder } from "../lib/colorMap";
import { CartConfetti } from "./CartConfetti";

function getRemaining(product: Product): number | null {
  if (product.discount < 20) return null;
  const val = ((product.id * 13 + 7) % 6) + 2;
  return val;
}

function getViewers(product: Product): number {
  return ((product.id * 17 + 3) % 24) + 4;
}

export function DealCard({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { added, handleAdd, showConfetti } = useCartButton(product, product.colors?.[0]);
  const [, navigate] = useLocation();
  const liked     = isWishlisted(product.id);
  const remaining = getRemaining(product);
  const viewers   = getViewers(product);
  const isFire    = product.discount >= 30;

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

        {/* Wishlist — top right */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          aria-label={liked ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          className="deal-card-wish-btn"
        >
          <Heart
            size={13}
            className={liked ? "fill-red-400 stroke-red-400" : "fill-none"}
            style={{ color: liked ? undefined : "#AAAAAA" }}
          />
        </button>
      </div>

      {/* Divider */}
      <div className="deal-card-divider" />

      {/* Content */}
      <div className="deal-card-body" dir="rtl">
        <p className="deal-card-brand">{product.brand}</p>
        <p className="deal-card-name line-clamp-2">{product.name}</p>

        {/* Color swatches — 14px circles beneath product name */}
        {product.colors && product.colors.length > 0 && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}
          >
            {product.colors.slice(0, 3).map((c, i) => (
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
            {product.colors.length > 3 && (
              <span style={{
                fontSize: 8,
                fontFamily: "var(--font-text)",
                color: "var(--text-muted)",
                fontWeight: 600,
                lineHeight: 1,
              }}>
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Viewers */}
        <p className="deal-card-viewers">
          <span className="deal-card-viewers-dot" />
          {viewers} يشاهدون الآن
        </p>

        {/* Stock heat gauge */}
        {remaining !== null && (
          <div className="deal-card-heat-wrap" dir="rtl">
            <span className="deal-card-heat-label" style={{ color: remaining <= 3 ? "var(--color-danger-600)" : "var(--text-muted)" }}>
              {remaining <= 3 ? "⚡" : "●"} {remaining}
            </span>
            <div className="deal-card-heat-bars">
              {Array.from({ length: 6 }).map((_, i) => {
                const filled = i < remaining;
                const low = remaining <= 3;
                return (
                  <span
                    key={i}
                    className={`deal-card-heat-bar${filled && low ? " deal-card-heat-bar--pulse" : ""}`}
                    style={{
                      height: `${6 + i * 2}px`,
                      background: filled
                        ? low
                          ? `rgba(220,38,38,${0.55 + i * 0.08})`
                          : `rgba(234,88,12,${0.40 + i * 0.10})`
                        : "rgba(0,0,0,0.08)",
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

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
            <div className="flex items-baseline gap-0.5">
              <span className="deal-card-price">{product.price.toLocaleString("ar-SA")}</span>
              <span className="deal-card-currency">ر.س</span>
            </div>
          </div>

          <div style={{ position: "relative", flexShrink: 0 }}>
            <CartConfetti active={showConfetti} />
            <motion.button
              onClick={handleAdd}
              aria-label={added ? "تمت الإضافة للسلة" : "أضف للسلة"}
              whileTap={{ scale: 0.82 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="deal-card-cart-btn"
            >
              {added
                ? <Check size={15} strokeWidth={2.5} style={{ color: "#fff" }} />
                : <ShoppingBag size={15} strokeWidth={2} style={{ color: "#fff" }} />
              }
            </motion.button>
          </div>
        </div>
      </div>
    </article>
  );
}
