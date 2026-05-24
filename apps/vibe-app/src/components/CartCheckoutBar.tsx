import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useCart } from "../context/CartContext";
import { calcShipping } from "../lib/shippingPolicy";

export function CartCheckoutBar() {
  const { items, total, discountAmount } = useCart();
  const [location, navigate] = useLocation();

  if (items.length === 0 || location !== "/cart") return null;

  const grandTotal = total - discountAmount + calcShipping(total);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        /* نفس ارتفاع شريط التنقل — الزر يجلس داخله */
        height: "var(--nav-h)",
        zIndex: 51,
        pointerEvents: "none",
        direction: "rtl",
        display: "flex",
        alignItems: "flex-end",
        /* اليسار: يبدأ بعد دائرة السلة (الربع الأيسر = 25%) + فراغ صغير */
        paddingLeft: "calc(25% + 10px)",
        paddingRight: 12,
        paddingBottom: 7,
      }}
    >
      <button
        onClick={() => navigate("/checkout")}
        style={{
          flex: 1,
          height: 42,
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px 0 12px",
          borderRadius: 14,
          border: "none",
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 55%, #c2410c 100%)",
          color: "#fff",
          cursor: "pointer",
          boxShadow: "0 3px 14px rgba(234,88,12,0.38), inset 0 1px 0 rgba(255,255,255,0.18)",
          transition: "transform 0.1s, box-shadow 0.1s",
          fontFamily: "var(--font-main)",
        }}
        onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.96)"; }}
        onTouchEnd={(e)   => { e.currentTarget.style.transform = ""; }}
        onMouseDown={(e)  => { e.currentTarget.style.transform = "scale(0.96)"; e.currentTarget.style.boxShadow = "0 1px 5px rgba(234,88,12,0.25)"; }}
        onMouseUp={(e)    => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 3px 14px rgba(234,88,12,0.38), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
      >
        {/* يمين: النص + السهم */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.2px" }}>إتمام الطلب</span>
          <ChevronLeft size={14} strokeWidth={3} style={{ opacity: 0.85, flexShrink: 0 }} />
        </div>

        {/* يسار: الإجمالي */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          {discountAmount > 0 && (
            <span style={{ fontFamily: "var(--font-main)", fontSize: 9, color: "rgba(255,255,255,0.75)", fontWeight: 600, lineHeight: 1, marginBottom: 1 }}>
              وفّرت {discountAmount.toLocaleString("ar-SA")} ر.س
            </span>
          )}
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            <span style={{ fontFamily: "var(--font-numeric)", fontSize: 20, fontWeight: 900, letterSpacing: "-0.5px", lineHeight: 1 }}>
              {grandTotal.toLocaleString("ar-SA")}
            </span>
            <span style={{ fontFamily: "var(--font-numeric)", fontSize: 11, opacity: 0.8 }}>ر.س</span>
          </div>
        </div>
      </button>
    </div>
  );
}
