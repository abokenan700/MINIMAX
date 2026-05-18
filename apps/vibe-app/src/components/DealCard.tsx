/**
 * DealCard — عروض اليوم (تمرير أفقي)
 * نظيره للشبكة: FeaturedCard.tsx
 */
import { Heart, Flame } from "lucide-react";
import { useLocation } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { CartButton } from "./CartButton";
import { useWishlist } from "../context/WishlistContext";

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

        {/* Discount badge — top left */}
        <span className="deal-card-discount-badge">
          {isFire && <Flame size={9} className="fill-white stroke-none inline -mt-0.5" />}
          {product.discount}%
        </span>

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

        {/* Price row */}
        <div className="deal-card-price-row">
          <div className="flex items-baseline gap-0.5">
            <span className="deal-card-price">{product.price.toLocaleString("ar-SA")}</span>
            <span className="deal-card-currency">ر.س</span>
          </div>
          <span className="deal-card-original">{product.original_price.toLocaleString("ar-SA")}</span>
        </div>

        {/* Viewers */}
        <p className="deal-card-viewers">
          <span className="deal-card-viewers-dot" />
          {viewers} يشاهدون الآن
        </p>

        {/* Stock bar */}
        {remaining !== null && (
          <div className="deal-card-stock-wrap">
            <div className="deal-card-stock-bar-bg">
              <div
                className="deal-card-stock-bar-fill"
                style={{
                  width: `${(remaining / 10) * 100}%`,
                  background: remaining <= 3 ? "var(--error)" : "var(--gold)",
                }}
              />
            </div>
            <p className="deal-card-stock-text" style={{ color: remaining <= 3 ? "var(--error)" : "var(--text-brand)" }}>
              {remaining <= 3 ? "⚡ " : ""}تبقّى {remaining} قطعة!
            </p>
          </div>
        )}

        {/* Cart button */}
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <CartButton size="sm" product={product} selectedColor={product.colors?.[0]} />
        </div>
      </div>
    </article>
  );
}
