import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { X, ShoppingBag, Check, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuickView } from "../context/QuickViewContext";
import { useWishlist } from "../context/WishlistContext";
import { useCartButton } from "../hooks/useCartButton";
import { Stars } from "./Stars";
import { Heart } from "./ui/Heart";
import { IconButton } from "./ui/IconButton";
import { Badge } from "./ui/Badge";
import { ColorSwatchRow } from "./ColorSwatchRow";
import { PriceTag } from "./ui/PriceTag";
import { Button } from "./ui/Button";

function formatSales(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".", "٫")} ألف`;
  return n.toLocaleString("ar-SA");
}

export function QuickViewSheet() {
  const { product, close } = useQuickView();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [, navigate] = useLocation();
  const [activeColor, setActiveColor] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const isOpen = product !== null;
  const selectedColor = product?.colors?.[activeColor] ?? "";
  const { added, handleAdd } = useCartButton(product ?? undefined, selectedColor);
  const liked = product ? isWishlisted(product.id) : false;

  useEffect(() => { setActiveColor(0); }, [product?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function goToDetail() {
    if (!product) return;
    close();
    navigate(`/product/${product.id}`);
  }

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          {/* Backdrop */}
          <motion.div
            key="qv-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={close}
            aria-hidden="true"
            style={{
              position: "fixed", inset: 0,
              zIndex: "var(--z-overlay)" as unknown as number,
              background: "rgba(0,0,0,0.48)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />

          {/* Sheet */}
          <motion.div
            key="qv-sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.9 }}
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: "var(--z-modal)" as unknown as number,
              background: "var(--bg-card)",
              borderRadius: "24px 24px 0 0",
              maxHeight: "88dvh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "var(--shadow-sheet)",
            }}
          >
            {/* Drag handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 2px", flexShrink: 0 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border-warm)" }} />
            </div>

            {/* Close button */}
            <IconButton
              variant="outline"
              size="sm"
              aria-label="إغلاق"
              onClick={close}
              style={{ position: "absolute", top: 12, left: 14, zIndex: 1 }}
            >
              <X size={14} />
            </IconButton>

            {/* Scrollable content */}
            <div style={{ overflowY: "auto", flex: "1 1 auto", padding: "8px 16px 24px" }} dir="rtl">

              {/* Image + wishlist */}
              <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", marginBottom: 14, background: "var(--card-img-bg)" }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
                />
                {/* Badges */}
                <div style={{ position: "absolute", top: 10, insetInlineStart: 10, display: "flex", gap: 6 }}>
                  {product.is_new && (
                    <Badge variant="new" size="sm">جديد</Badge>
                  )}
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: "#fff",
                    background: "rgba(0,0,0,0.42)",
                    borderRadius: "var(--radius-pill)",
                    padding: "3px 10px",
                    backdropFilter: "blur(4px)",
                  }}>خصم {product.discount}%</span>
                </div>
                {/* Wishlist */}
                <Heart
                  pressed={liked}
                  size={16}
                  onClick={() => toggleWishlist(product)}
                  style={{
                    position: "absolute", top: 10, insetInlineEnd: 10,
                    width: 36, height: 36,
                  }}
                />
              </div>

              {/* Brand */}
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-brand)", letterSpacing: "0.4px", marginBottom: 4, fontFamily: "var(--font-text)" }}>
                {product.brand}
              </p>

              {/* Name */}
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.35, marginBottom: 8, fontFamily: "var(--font-text)" }}>
                {product.name}
              </h2>

              {/* Rating + sales */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Stars rating={product.rating} size={14} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-brand)", fontFamily: "var(--font-text)" }}>{product.rating}</span>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontFamily: "var(--font-text)" }}>({formatSales(product.sales)} مبيعة)</span>
              </div>

              {/* Colors */}
              {product.colors.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, fontFamily: "var(--font-text)" }}>اللون</p>
                  <ColorSwatchRow
                    colors={product.colors}
                    active={activeColor}
                    onSelect={setActiveColor}
                    size="md"
                    max={product.colors.length}
                  />
                </div>
              )}

              {/* Price row */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
                <PriceTag price={product.price} original={product.original_price} size="xl" />
                <span style={{
                  marginInlineStart: "auto",
                  fontSize: 11, fontWeight: 700,
                  color: "var(--color-brand-700)",
                  background: "var(--color-brand-50)",
                  borderRadius: "var(--radius-pill)",
                  padding: "3px 10px",
                  fontFamily: "var(--font-text)",
                }}>
                  وفّر {(product.original_price - product.price).toLocaleString("ar-SA")} ر.س
                </span>
              </div>

              {/* CTA buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Button
                  variant={added ? "success" : "primary"}
                  size="lg"
                  style={{ width: "100%", borderRadius: 16, justifyContent: "center" }}
                  onClick={handleAdd}
                  leftIcon={added ? <Check size={18} strokeWidth={2.5} /> : <ShoppingBag size={18} strokeWidth={1.8} />}
                >
                  {added ? "تمت الإضافة" : "أضف للسلة"}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  style={{ width: "100%", borderRadius: 16, justifyContent: "center" }}
                  onClick={goToDetail}
                  leftIcon={<ArrowLeft size={15} strokeWidth={2} />}
                >
                  عرض التفاصيل الكاملة
                </Button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
