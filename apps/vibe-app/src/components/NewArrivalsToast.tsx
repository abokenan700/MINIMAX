import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { useGetProducts } from "@workspace/api-client-react";

const STORAGE_KEY = "nakhba_new_arrivals_seen";
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

export function NewArrivalsToast() {
  const [visible, setVisible]   = useState(false);
  const [leaving, setLeaving]   = useState(false);
  const { data: products = [] }  = useGetProducts();

  const newCount = products.filter(p => (p as { is_new?: boolean }).is_new).length;

  useEffect(() => {
    if (!newCount) return;

    const lastSeen = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
    if (Date.now() - lastSeen < COOLDOWN_MS) return;

    const t = setTimeout(() => setVisible(true), 1400);
    return () => clearTimeout(t);
  }, [newCount]);

  function dismiss() {
    setLeaving(true);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setTimeout(() => setVisible(false), 280);
  }

  function goToNewArrivals() {
    dismiss();
    setTimeout(() => {
      const el = document.getElementById("section-new-arrivals");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  if (!visible) return null;

  return (
    <div
      dir="rtl"
      role="status"
      aria-live="polite"
      onClick={goToNewArrivals}
      style={{
        position: "fixed",
        top: 64,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 250,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px 10px 10px",
        borderRadius: 40,
        background: "linear-gradient(135deg, #1A1410 0%, #2d1f14 100%)",
        boxShadow: "0 8px 28px rgba(26,20,16,0.35), 0 2px 8px rgba(212,80,58,0.2)",
        cursor: "pointer",
        userSelect: "none",
        animation: leaving
          ? "toastSlideOut 0.28s cubic-bezier(0.4,0,1,1) both"
          : "toastSlideIn 0.38s cubic-bezier(0.16,1,0.3,1) both",
        whiteSpace: "nowrap",
      }}
    >
      {/* icon */}
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: "linear-gradient(135deg, #D4503A, #E8674A)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Sparkles size={14} style={{ color: "#fff" }} />
      </div>

      {/* text */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <span style={{
          fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700,
          color: "#fff", lineHeight: 1.2,
        }}>
          وصل حديثاً ✨
        </span>
        <span style={{
          fontFamily: "var(--font-main)", fontSize: 11, fontWeight: 400,
          color: "rgba(255,255,255,0.6)", lineHeight: 1.2,
        }}>
          {newCount > 1 ? `${newCount} منتجات جديدة` : "منتج جديد"} — اضغط للعرض
        </span>
      </div>

      {/* dismiss */}
      <button
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        aria-label="إغلاق"
        style={{
          marginRight: 4,
          width: 22, height: 22, borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <X size={11} style={{ color: "rgba(255,255,255,0.7)" }} />
      </button>
    </div>
  );
}
