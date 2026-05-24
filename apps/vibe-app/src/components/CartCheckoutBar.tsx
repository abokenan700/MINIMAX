import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { calcShipping } from "../lib/shippingPolicy";

export function CartCheckoutBar() {
  const { items, total, discountAmount } = useCart();
  const [location, navigate] = useLocation();

  const visible = items.length > 0 && location === "/cart";
  const grandTotal = total - discountAmount + calcShipping(total);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cart-checkout-bar"
          initial={{ y: 56, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{    y: 56, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          style={{
            position: "absolute",
            bottom: 56,
            left: 12,
            right: 12,
            zIndex: 51,
            pointerEvents: "none",
            direction: "rtl",
          }}
        >
          <button
            onClick={() => navigate("/checkout")}
            style={{
              width: "100%",
              height: 46,
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 10px 0 14px",
              borderRadius: 23,
              border: "1px solid rgba(255,255,255,0.07)",
              background: "linear-gradient(135deg, rgba(24,15,8,0.93) 0%, rgba(38,22,10,0.91) 100%)",
              backdropFilter: "blur(24px) saturate(1.6)",
              WebkitBackdropFilter: "blur(24px) saturate(1.6)",
              color: "#fff",
              cursor: "pointer",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset, 0 0 0 1px rgba(255,255,255,0.04)",
              transition: "transform 0.12s, box-shadow 0.12s",
              fontFamily: "var(--font-main)",
            }}
            onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.975)"; }}
            onTouchEnd={(e)   => { e.currentTarget.style.transform = ""; }}
            onMouseDown={(e)  => { e.currentTarget.style.transform = "scale(0.975)"; }}
            onMouseUp={(e)    => { e.currentTarget.style.transform = ""; }}
          >

            {/* ══ يمين (RTL-start): إتمام الطلب ══ */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* دائرة السهم */}
              <div style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
                boxShadow: "0 3px 10px rgba(234,88,12,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <ChevronLeft size={16} strokeWidth={2.5} color="#fff" />
              </div>
              <span style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.4px",
                color: "#fff",
              }}>
                إتمام الطلب
              </span>
            </div>

            {/* ══ فاصل ══ */}
            <div style={{
              width: 1,
              height: 22,
              background: "rgba(255,255,255,0.10)",
              flexShrink: 0,
              margin: "0 2px",
            }} />

            {/* ══ يسار (RTL-end): العدد + الإجمالي ══ */}
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>

              {/* badge عدد المنتجات */}
              <div style={{
                background: "rgba(249,115,22,0.15)",
                border: "1px solid rgba(249,115,22,0.30)",
                borderRadius: 9,
                padding: "3px 9px",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}>
                <span style={{
                  fontFamily: "var(--font-numeric)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fb923c",
                  lineHeight: 1,
                }}>
                  {items.length}
                </span>
                <span style={{
                  fontFamily: "var(--font-main)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(251,146,60,0.80)",
                  lineHeight: 1,
                }}>
                  {items.length === 1 ? "منتج" : "منتجات"}
                </span>
              </div>

              {/* السعر الإجمالي */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <span style={{
                  fontFamily: "var(--font-numeric)",
                  fontSize: 19,
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.6px",
                  lineHeight: 1,
                }}>
                  {grandTotal.toLocaleString("ar-SA")}
                </span>
                <span style={{
                  fontFamily: "var(--font-numeric)",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.50)",
                  letterSpacing: "0.2px",
                }}>
                  ر.س
                </span>
              </div>

            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
