import { useCompare } from "../context/CompareContext";
import { X, GitCompareArrows, ShoppingBag, Star } from "lucide-react";
import { useLocation } from "wouter";
import { useCart } from "../context/CartContext";

export function CompareSheet() {
  const { items, remove, clear, open, setOpen } = useCompare();
  const { addToCart } = useCart();
  const [, navigate]  = useLocation();

  if (!open || items.length < 2) return null;

  const rows = [
    { label: "الماركة",   key: (p: typeof items[0]) => p.brand },
    { label: "السعر",     key: (p: typeof items[0]) => `${p.price.toLocaleString("ar-SA")} ر.س` },
    { label: "الخصم",     key: (p: typeof items[0]) => `${p.discount}%` },
    { label: "التقييم",   key: (p: typeof items[0]) => `${p.rating} ⭐` },
    { label: "المبيعات",  key: (p: typeof items[0]) => `${p.sales.toLocaleString("ar-SA")}` },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }} onClick={() => setOpen(false)} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, maxWidth: 430, margin: "0 auto", background: "var(--bg-card)", borderRadius: "24px 24px 0 0", maxHeight: "88vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)", margin: "10px auto 0" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 10px" }} dir="rtl">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GitCompareArrows size={18} style={{ color: "var(--text-brand)" }} />
            <h2 style={{ fontFamily: "var(--font-main)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              مقارنة المنتجات ({items.length})
            </h2>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={clear} style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid var(--border-warm)", background: "transparent", fontFamily: "var(--font-main)", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}>مسح الكل</button>
            <button onClick={() => setOpen(false)} style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border-warm)", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={14} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
        </div>

        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "0 16px 32px" }}>
          {/* Product images row */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 8, marginBottom: 16 }} dir="rtl">
            {items.map(p => (
              <div key={p.id} style={{ position: "relative", borderRadius: 14, overflow: "hidden", background: "var(--card-img-bg)", border: "1px solid var(--border-warm)", cursor: "pointer" }}
                onClick={() => navigate(`/product/${p.id}`)}>
                <div style={{ aspectRatio: "1/1", position: "relative" }}>
                  <img src={p.image} alt={p.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: 12 }} />
                </div>
                <div style={{ padding: "6px 8px 8px", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-main)", fontSize: 10, fontWeight: 700, color: "var(--text-brand)" }}>{p.brand}</p>
                  <p className="line-clamp-1" style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 600 }}>{p.name}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); remove(p.id); }}
                  style={{ position: "absolute", top: 5, insetInlineEnd: 5, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <X size={10} color="#fff" />
                </button>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--border-warm)" }}>
            {rows.map(({ label, key }, idx) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: `80px repeat(${items.length}, 1fr)`, background: idx % 2 === 0 ? "var(--bg-card)" : "var(--bg-page)", borderBottom: idx < rows.length - 1 ? "1px solid var(--border)" : "none" }} dir="rtl">
                <div style={{ padding: "11px 12px", borderInlineEnd: "1px solid var(--border)", display: "flex", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-main)", fontSize: 11.5, fontWeight: 700, color: "var(--text-secondary)" }}>{label}</span>
                </div>
                {items.map(p => {
                  const val = key(p);
                  const isPrice = label === "السعر";
                  const isBest = isPrice
                    ? p.price === Math.min(...items.map(x => x.price))
                    : label === "التقييم"
                    ? p.rating === Math.max(...items.map(x => x.rating))
                    : label === "الخصم"
                    ? p.discount === Math.max(...items.map(x => x.discount))
                    : false;
                  return (
                    <div key={p.id} style={{ padding: "11px 8px", display: "flex", alignItems: "center", justifyContent: "center", borderInlineEnd: "1px solid var(--border)" }}>
                      <span style={{ fontFamily: "var(--font-main)", fontSize: 12, fontWeight: isBest ? 800 : 500, color: isBest ? "var(--text-brand)" : "var(--text-primary)", background: isBest ? "var(--color-brand-50)" : "transparent", padding: isBest ? "2px 6px" : "0", borderRadius: 6 }}>{val}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Add to cart row */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 8, marginTop: 14 }} dir="rtl">
            {items.map(p => (
              <button key={p.id}
                onClick={() => { addToCart(p, p.colors?.[0]); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "10px 0", borderRadius: 12, border: "none", background: "var(--gradient-brand)", color: "#fff", fontFamily: "var(--font-main)", fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "var(--shadow-btn)" }}>
                <ShoppingBag size={13} /> أضف للسلة
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Floating Compare Bar ─────────────────────────────────────── */
export function CompareBar() {
  const { items, open, setOpen } = useCompare();
  if (items.length < 1) return null;
  return (
    <div
      style={{ position: "absolute", bottom: "calc(var(--nav-h) + 10px)", left: "50%", transform: "translateX(-50%)", zIndex: 90, pointerEvents: "none", display: "flex", justifyContent: "center" }}
    >
      <button
        style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 40, background: "var(--gradient-brand)", color: "#fff", fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "var(--shadow-btn)", whiteSpace: "nowrap" }}
        onClick={() => setOpen(!open)}
        aria-label="فتح نافذة المقارنة"
      >
        <GitCompareArrows size={15} />
        مقارنة ({items.length})
      </button>
    </div>
  );
}
