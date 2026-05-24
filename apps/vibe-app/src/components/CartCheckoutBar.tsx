import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { calcShipping } from "../lib/shippingPolicy";

/*
 * الزر ملتصق بأعلى شريط التنقل (bottom = --nav-h = 67px).
 * قمة دائرة السلة تقع عند نفس الارتفاع (67px من أسفل الشاشة)،
 * فيبدو الزر كأنه يخرج من الدائرة.
 * الارتفاع ≤ 42px (قطر الدائرة) كي لا يطغى عليها.
 */
export function CartCheckoutBar() {
  const { items, total, discountAmount } = useCart();
  const [location, navigate] = useLocation();

  const visible = items.length > 0 && location === "/cart";
  const grandTotal = total - discountAmount + calcShipping(total);
  const qty = items.reduce((s, i) => s + i.qty, 0);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cart-checkout-bar"
          initial={{ y: 48, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{    y: 48, opacity: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          style={{
            position: "absolute",
            /*
             * TOP_PAD = 17px → الشريط يبدأ عند y=50 من أسفل الشاشة.
             * bottom: 50 يضع قاع الزر عند حافة الشريط العلوية مباشرةً،
             * أي "قبل الانحدار" للدائرة بالضبط.
             */
            bottom: 50,
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
              height: 40,                /* ≤ قطر الدائرة 42px */
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              /* padding: top right bottom left — البيل البرتقالي يحتاج 3px من اليمين */
              padding: "3px 3px 3px 16px",
              borderRadius: 20,
              border: "1px solid rgba(0,0,0,0.07)",
              background: "#FFFFFF",
              boxShadow:
                "0 -2px 14px rgba(0,0,0,0.07), 0 4px 18px rgba(0,0,0,0.08)",
              cursor: "pointer",
              fontFamily: "var(--font-main)",
              transition: "transform 0.12s",
              gap: 0,
            }}
            onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.975)"; }}
            onTouchEnd={(e)   => { e.currentTarget.style.transform = ""; }}
            onMouseDown={(e)  => { e.currentTarget.style.transform = "scale(0.975)"; }}
            onMouseUp={(e)    => { e.currentTarget.style.transform = ""; }}
          >

            {/* ══ يمين (RTL-start): بيل الأكشن البرتقالي ══ */}
            <div style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 60%, #c2410c 100%)",
              borderRadius: 17,
              height: "100%",           /* يملأ كامل ارتفاع الزر ناقص 3px padding */
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 13px 0 10px",
              flexShrink: 0,
              boxShadow: "0 2px 10px rgba(234,88,12,0.35)",
            }}>
              <span style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "0.3px",
                whiteSpace: "nowrap",
              }}>
                إتمام الطلب
              </span>
              <ChevronLeft size={14} strokeWidth={2.5} color="rgba(255,255,255,0.90)" />
            </div>

            {/* ══ مساحة مرنة ══ */}
            <div style={{ flex: 1 }} />

            {/* ══ يسار (RTL-end): العدد + الإجمالي ══ */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingLeft: 4,
            }}>

              {/* عدد القطع */}
              <div style={{
                background: "rgba(234,88,12,0.07)",
                border: "1px solid rgba(234,88,12,0.18)",
                borderRadius: 8,
                padding: "2px 8px",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}>
                <span style={{
                  fontFamily: "var(--font-numeric)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#EA580C",
                  lineHeight: 1,
                }}>
                  {qty}
                </span>
                <span style={{
                  fontFamily: "var(--font-main)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(234,88,12,0.75)",
                  lineHeight: 1,
                }}>
                  {qty === 1 ? "قطعة" : "قطع"}
                </span>
              </div>

              {/* السعر */}
              <div style={{
                display: "flex",
                alignItems: "baseline",
                gap: 2,
              }}>
                <span style={{
                  fontFamily: "var(--font-numeric)",
                  fontSize: 18,
                  fontWeight: 900,
                  color: "#1A1410",
                  letterSpacing: "-0.5px",
                  lineHeight: 1,
                }}>
                  {grandTotal.toLocaleString("ar-SA")}
                </span>
                <span style={{
                  fontFamily: "var(--font-numeric)",
                  fontSize: 10,
                  color: "rgba(26,20,16,0.45)",
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
