import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { calcShipping } from "../lib/shippingPolicy";

/*
 * الزر يطفو فوق منطقة الأيقونات مباشرةً:
 *   — bottom: 44px  (فوق الأيقونات التي تشغل 0–41px من الأسفل)
 *   — height: 36px  (نحيف واحترافي)
 *   — paddingLeft: calc(25% + 10px)  (يبدأ بعد دائرة السلة)
 */
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
          initial={{ y: 48, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{    y: 48, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          style={{
            position: "absolute",
            bottom: 44,
            left: 0,
            right: 0,
            zIndex: 51,
            pointerEvents: "none",
            direction: "rtl",
            display: "flex",
            alignItems: "stretch",
            paddingLeft: "calc(25% + 10px)",
            paddingRight: 12,
          }}
        >
          <button
            onClick={() => navigate("/checkout")}
            style={{
              flex: 1,
              height: 36,
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 12px 0 10px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 55%, #c2410c 100%)",
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(234,88,12,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
              transition: "transform 0.1s, box-shadow 0.1s",
              fontFamily: "var(--font-main)",
            }}
            onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.96)"; }}
            onTouchEnd={(e)   => { e.currentTarget.style.transform = ""; }}
            onMouseDown={(e)  => { e.currentTarget.style.transform = "scale(0.96)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(234,88,12,0.2)"; }}
            onMouseUp={(e)    => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(234,88,12,0.35), inset 0 1px 0 rgba(255,255,255,0.15)"; }}
          >
            {/* يمين: النص + السهم */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.2px" }}>إتمام الطلب</span>
              <ChevronLeft size={13} strokeWidth={3} style={{ opacity: 0.85, flexShrink: 0 }} />
            </div>

            {/* يسار: الإجمالي */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              {discountAmount > 0 && (
                <span style={{ fontFamily: "var(--font-main)", fontSize: 9, color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
                  وفّرت {discountAmount.toLocaleString("ar-SA")} ·&nbsp;
                </span>
              )}
              <span style={{ fontFamily: "var(--font-numeric)", fontSize: 17, fontWeight: 900, letterSpacing: "-0.5px", lineHeight: 1 }}>
                {grandTotal.toLocaleString("ar-SA")}
              </span>
              <span style={{ fontFamily: "var(--font-numeric)", fontSize: 10, opacity: 0.8 }}>ر.س</span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
