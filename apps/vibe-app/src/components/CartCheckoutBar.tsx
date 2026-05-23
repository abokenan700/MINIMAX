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
        bottom: "var(--nav-h)",
        left: 0,
        right: 0,
        zIndex: 48,
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border-warm)",
        display: "grid",
        /* RTL: عمود auto أول (يُوضع يميناً) ثم 1fr (الإجمالي يساراً) */
        gridTemplateColumns: "auto 1fr",
        alignItems: "center",
        gap: 10,
        padding: "8px 14px",
        boxShadow: "0 -3px 16px rgba(0,0,0,0.08)",
        boxSizing: "border-box",
        direction: "rtl",
      }}
    >
      {/* زر إتمام الطلب — أول عنصر في RTL = يُوضع يميناً */}
      <button
        onClick={() => navigate("/checkout")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 20px",
          height: 46,
          borderRadius: 13,
          border: "none",
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 55%, #c2410c 100%)",
          color: "#fff",
          cursor: "pointer",
          boxShadow: "0 3px 14px rgba(234,88,12,0.4), inset 0 1px 0 rgba(255,255,255,0.18)",
          transition: "transform 0.1s, box-shadow 0.1s",
          fontFamily: "var(--font-main)",
          whiteSpace: "nowrap",
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.95)";
          e.currentTarget.style.boxShadow = "0 1px 5px rgba(234,88,12,0.25)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "0 3px 14px rgba(234,88,12,0.4), inset 0 1px 0 rgba(255,255,255,0.18)";
        }}
        onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.95)"; }}
        onTouchEnd={(e)   => { e.currentTarget.style.transform = ""; }}
      >
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.3px" }}>إتمام الطلب</span>
        <ChevronLeft size={15} strokeWidth={3} style={{ opacity: 0.85 }} />
      </button>

      {/* الإجمالي — ثاني عنصر في RTL = يُوضع يساراً */}
      <div style={{ textAlign: "left", minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "var(--font-main)", fontSize: 10, color: "var(--text-muted)", fontWeight: 500, marginBottom: 1 }}>
          الإجمالي · {items.length} {items.length === 1 ? "منتج" : "منتجات"}
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{ fontFamily: "var(--font-numeric)", fontSize: 26, fontWeight: 900, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", letterSpacing: "-1px", lineHeight: 1 }}>
            {grandTotal.toLocaleString("ar-SA")}
          </span>
          <span style={{ fontFamily: "var(--font-numeric)", fontSize: 11, color: "var(--text-muted)" }}>ر.س</span>
        </div>
        {discountAmount > 0 && (
          <span style={{ display: "block", fontFamily: "var(--font-main)", fontSize: 10, color: "#16a34a", fontWeight: 700, marginTop: 1 }}>
            وفّرت {discountAmount.toLocaleString("ar-SA")} ر.س
          </span>
        )}
      </div>
    </div>
  );
}
