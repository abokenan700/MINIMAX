import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { X, Heart, ShoppingBag, Check, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuickView } from "../context/QuickViewContext";
import { useWishlist } from "../context/WishlistContext";
import { useCartButton } from "../hooks/useCartButton";
import { colorToCss, needsBorder } from "../lib/colorMap";
import { Stars } from "./Stars";

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

  /* Reset color when product changes */
  useEffect(() => { setActiveColor(0); }, [product?.id]);

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  /* Lock body scroll */
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
              position: "fixed", inset: 0, zIndex: 300,
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
              zIndex: 301,
              background: "#FFFFFF",
              borderRadius: "24px 24px 0 0",
              maxHeight: "88dvh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
            }}
          >
            {/* Drag handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 2px", flexShrink: 0 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E0DDD9" }} />
            </div>

            {/* Close button */}
            <button
              onClick={close}
              aria-label="إغلاق"
              style={{
                position: "absolute", top: 12, left: 14,
                width: 32, height: 32, borderRadius: "50%",
                border: "1px solid #EBEBEB",
                background: "#F8F8F7",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 1,
              }}
            >
              <X size={14} color="#6B6560" />
            </button>

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
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: "#fff",
                      background: "var(--gradient-cta)",
                      borderRadius: "var(--radius-pill)",
                      padding: "3px 10px",
                    }}>جديد</span>
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
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={liked ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                  style={{
                    position: "absolute", top: 10, insetInlineEnd: 10,
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(255,255,255,0.88)",
                    backdropFilter: "blur(4px)",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  <Heart
                    size={16}
                    className={liked ? "fill-red-400 stroke-red-400" : ""}
                    style={{ color: liked ? undefined : "#888" }}
                  />
                </button>
              </div>

              {/* Brand */}
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-brand)", letterSpacing: "0.4px", marginBottom: 4 }}>
                {product.brand}
              </p>

              {/* Name */}
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.35, marginBottom: 8 }}>
                {product.name}
              </h2>

              {/* Rating + sales */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Stars rating={product.rating} size={14} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-brand)" }}>{product.rating}</span>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>({formatSales(product.sales)} مبيعة)</span>
              </div>

              {/* Colors */}
              {product.colors.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>اللون</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {product.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveColor(i)}
                        aria-label={`اللون ${c}`}
                        aria-pressed={i === activeColor}
                        style={{
                          width: 32, height: 32,
                          borderRadius: "50%",
                          background: colorToCss(c),
                          border: i === activeColor
                            ? "2.5px solid var(--text-brand)"
                            : needsBorder(c)
                            ? "1.5px solid #DDD"
                            : "2px solid transparent",
                          cursor: "pointer",
                          outline: i === activeColor ? "2px solid var(--gold-light)" : "none",
                          outlineOffset: 1,
                          transform: i === activeColor ? "scale(1.18)" : "scale(1)",
                          transition: "transform 0.15s ease, border 0.15s ease",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Price row */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: "var(--text-price)" }}>
                  {product.price.toLocaleString("ar-SA")}
                </span>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>ر.س</span>
                <span className="line-through" style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {product.original_price.toLocaleString("ar-SA")}
                </span>
                <span style={{
                  marginInlineStart: "auto",
                  fontSize: 11, fontWeight: 700,
                  color: "var(--discount-text)",
                  background: "var(--discount-bg)",
                  borderRadius: "var(--radius-pill)",
                  padding: "3px 10px",
                }}>
                  وفّر {(product.original_price - product.price).toLocaleString("ar-SA")} ر.س
                </span>
              </div>

              {/* CTA buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Add to cart */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAdd}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 16,
                    border: "none",
                    cursor: "pointer",
                    background: added ? "#22C55E" : "var(--gradient-cta)",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: "var(--font-main)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: added
                      ? "0 4px 16px rgba(34,197,94,0.35)"
                      : "var(--shadow-btn)",
                    transition: "background 0.22s ease, box-shadow 0.22s ease",
                  }}
                >
                  {added
                    ? <><Check size={18} strokeWidth={2.5} /> تمت الإضافة</>
                    : <><ShoppingBag size={18} strokeWidth={1.8} /> أضف للسلة</>
                  }
                </motion.button>

                {/* View full details */}
                <button
                  onClick={goToDetail}
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: 16,
                    border: "1.5px solid var(--border-warm)",
                    cursor: "pointer",
                    background: "var(--bg-card)",
                    color: "var(--text-primary)",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "var(--font-main)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  عرض التفاصيل الكاملة
                  <ArrowLeft size={15} strokeWidth={2} />
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
