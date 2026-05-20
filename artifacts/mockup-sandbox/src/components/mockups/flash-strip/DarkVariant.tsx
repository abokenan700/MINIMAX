import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

function useCountdown(endMs: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, endMs - now);
  const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
  return [h, m, s];
}

const END = Date.now() + (1 * 3600 + 47 * 60 + 22) * 1000;

export function DarkVariant() {
  const [h, m, s] = useCountdown(END);
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#FBFAF8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif",
        padding: "24px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
        @keyframes shim-dark { 0%{transform:translateX(150%)} 100%{transform:translateX(-150%)} }
        @keyframes badge-pulse { 0%,100%{opacity:1} 50%{opacity:0.65} }
      `}</style>

      {/* Strip — ink dark luxury */}
      <div style={{
        width: "100%", maxWidth: 420, position: "relative",
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px",
        borderRadius: 16,
        background: "linear-gradient(135deg, #1A1410 0%, #2E2A24 100%)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06)",
        overflow: "hidden",
        cursor: "pointer",
      }}>
        {/* Shine */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.07) 50%, transparent 65%)",
          animation: "shim-dark 3s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* Icon */}
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, #EA580C, #f97316)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 3px 12px #EA580C77",
        }}>
          <Zap size={15} strokeWidth={2.5} fill="white" stroke="white" />
        </div>

        {/* Label */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>عروض</span>
            <span style={{
              fontSize: 9, fontWeight: 700, color: "#EA580C", background: "#EA580C18",
              border: "1px solid #EA580C44", borderRadius: 5, padding: "1px 5px",
              animation: "badge-pulse 2s ease-in-out infinite",
              letterSpacing: "0.03em",
            }}>HOT</span>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 500, color: "#948C7C", lineHeight: 1.2, marginTop: 2 }}>أسعار لن تتكرر</div>
        </div>

        {/* Countdown */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 9.5, color: "#6A6256", fontWeight: 500, whiteSpace: "nowrap" }}>ينتهي خلال</span>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }} dir="ltr">
            {[h, m, s].map((v, i) => (
              <div key={i} style={{
                minWidth: 27, height: 26, borderRadius: 7, padding: "0 4px",
                background: "rgba(234,88,12,0.15)",
                border: "1px solid rgba(234,88,12,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#f97316",
                fontVariantNumeric: "tabular-nums",
              }}>{v}</div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: "linear-gradient(135deg, #EA580C, #f97316)",
          borderRadius: 20, padding: "6px 14px", flexShrink: 0,
          boxShadow: "0 3px 12px #EA580C66",
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>عروض</span>
        </div>
      </div>
    </div>
  );
}
