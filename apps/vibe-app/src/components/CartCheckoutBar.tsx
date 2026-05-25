import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { calcShipping } from "../lib/shippingPolicy";
import { useAuth, RETURN_TO_KEY } from "../context/AuthContext";
import { useAccountSheet } from "../context/AccountSheetContext";

/*
 * الزر ملتصق بأعلى شريط التنقل (bottom = --nav-h = 67px).
 * دورة الأنيميشن عند فتح السلة:
 *   0s  → يظهر كأيقونة (أيقونة الحقيبة فقط)
 *   1s  → يتمدد إلى الزر الكامل
 *   6s  → ينكمش ويبقى كأيقونة
 */
export function CartCheckoutBar() {
  const { items, total, discountAmount } = useCart();
  const { user } = useAuth();
  const { openSheet } = useAccountSheet();
  const [location, navigate] = useLocation();

  const visible = items.length > 0 && location === "/cart";
  const grandTotal = total - discountAmount + calcShipping(total);
  const qty = items.reduce((s, i) => s + i.qty, 0);

  /* ─── phase: "icon" → "full" → "icon" ─── */
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!visible) {
      setExpanded(false);
      return;
    }
    /* 1s أيقونة، ثم يتمدد */
    const t1 = setTimeout(() => setExpanded(true), 1000);
    /* 1s + 5s = ينكمش */
    const t2 = setTimeout(() => setExpanded(false), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [visible]);

  /* عند تغيير محتوى السلة بعد الانكماش، لا نعيد الدورة */

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cart-checkout-bar"
          initial={{ y: 48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 48, opacity: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          style={{
            position: "absolute",
            bottom: 50,
            left: "calc(12.5% + 27px)",
            right: 12,
            zIndex: 51,
            pointerEvents: "none",
            direction: "rtl",
            display: "flex",
            justifyContent: "flex-start", /* RTL-start = يمين */
          }}
        >
          <motion.button
            onClick={() => {
              if (!user) {
                try { sessionStorage.setItem(RETURN_TO_KEY, "/checkout"); } catch { }
                openSheet();
              } else {
                navigate("/checkout");
              }
            }}
            animate={{ width: expanded ? "100%" : 40 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            style={{
              height: 40,
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              padding: "3px 3px 3px 0",
              borderRadius: 20,
              border: "1px solid rgba(0,0,0,0.07)",
              background: "#FBFAF8",
              boxShadow:
                "0 -2px 14px rgba(0,0,0,0.07), 0 4px 18px rgba(0,0,0,0.08)",
              cursor: "pointer",
              fontFamily: "var(--font-main)",
              overflow: "hidden",
              gap: 0,
              minWidth: 40,
              flexShrink: 0,
            }}
            onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.975)"; }}
            onTouchEnd={(e) => { e.currentTarget.style.transform = ""; }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.975)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = ""; }}
          >

            {/* ══ يمين (RTL-start): بيل الأكشن — دائماً ظاهر ══ */}
            <div style={{
              background: "linear-gradient(135deg, #b54026 0%, #a43a21 60%, #90321c 100%)",
              borderRadius: 17,
              height: "100%",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: expanded ? "0 13px 0 10px" : "0 13px",
              flexShrink: 0,
              boxShadow: "0 2px 10px rgba(164,58,33,0.35)",
              transition: "padding 0.3s ease",
            }}>
              {/* أيقونة الحقيبة — دائماً ظاهرة */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>

              {/* النص والسهم — يظهران فقط في الوضع الممتد */}
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: "0.3px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      display: "block",
                    }}
                  >
                    إتمام الطلب
                  </motion.span>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {expanded && (
                  <motion.span
                    key="chevron"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
                  >
                    <ChevronLeft size={14} strokeWidth={2.5} color="rgba(255,255,255,0.90)" />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* ══ يسار (RTL-end): العدد + الإجمالي ══ */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: 14,
                    paddingRight: 6,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {/* عدد القطع */}
                  <div style={{
                    background: "rgba(164,58,33,0.07)",
                    border: "1px solid rgba(164,58,33,0.18)",
                    borderRadius: 8,
                    padding: "2px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    flexShrink: 0,
                  }}>
                    <span style={{
                      fontFamily: "var(--font-numeric)",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#a43a21",
                      lineHeight: 1,
                    }}>
                      {qty}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-main)",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "rgba(164,58,33,0.75)",
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
                    flexShrink: 0,
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
                </motion.div>
              )}
            </AnimatePresence>

          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
