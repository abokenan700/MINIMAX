import type { Product } from "@workspace/api-client-react";
import { Button } from "./ui/Button";
import { Heart } from "./ui/Heart";
import { Tag } from "./ui/Tag";
import { PriceTag } from "./ui/PriceTag";
import { Check, ShoppingBag } from "lucide-react";

interface StickyBuyBarProps {
  product:    Product;
  liked:      boolean;
  added:      boolean;
  isOOS:      boolean;
  onAdd:      () => void;
  onBuy:      () => void;
  onWishlist: () => void;
}

export function StickyBuyBar({ product, liked, added, isOOS, onAdd, onBuy, onWishlist }: StickyBuyBarProps) {
  const stock = (product as Product & { stock?: number }).stock ?? null;
  const isLow = stock !== null && stock > 0 && stock < 5;

  return (
    <div
      className="sticky-buy-bar"
      dir="rtl"
      style={{
        position: "absolute",
        bottom: "var(--nav-h)",
        insetInlineStart: 0,
        insetInlineEnd: 0,
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border-warm)",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        zIndex: "var(--z-sticky)" as unknown as number,
        boxShadow: "var(--shadow-sticky)",
      }}
    >
      <Heart
        pressed={liked}
        size={17}
        onClick={onWishlist}
        style={{
          width: 44, height: 44,
          border: "1px solid var(--border-warm)",
          background: "var(--bg-card)",
          borderRadius: "50%",
          flexShrink: 0,
        }}
        className="shadow-none"
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        {isLow && !isOOS && (
          <Tag tone="warning" size="xs" style={{ marginBottom: 2 }}>
            تبقّى {stock} فقط!
          </Tag>
        )}
        {isOOS && (
          <Tag tone="danger" size="xs" style={{ marginBottom: 2 }}>
            نفذ المخزون
          </Tag>
        )}
        {!isOOS && !isLow && (
          <p style={{ fontFamily: "var(--font-main)", fontSize: "var(--text-2xs)", color: "var(--text-muted)", lineHeight: 1, marginBottom: 2 }}>
            السعر الآن
          </p>
        )}
        <PriceTag
          price={product.price}
          size="lg"
          style={{ color: isOOS ? "var(--text-muted)" : undefined }}
        />
      </div>

      <Button
        variant={isOOS ? "ghost" : "primary"}
        size="md"
        disabled={isOOS}
        onClick={isOOS ? undefined : onAdd}
        leftIcon={added ? <Check size={14} /> : <ShoppingBag size={14} />}
      >
        {isOOS ? "نفذ" : added ? "تمت ✓" : "أضف للسلة"}
      </Button>

      <Button
        variant="outline"
        size="md"
        disabled={isOOS}
        onClick={isOOS ? undefined : onBuy}
      >
        اشتري الآن
      </Button>
    </div>
  );
}
