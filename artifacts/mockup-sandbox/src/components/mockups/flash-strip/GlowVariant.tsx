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

export function GlowVariant() {
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
      {/* Strip */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          borderRadius: 16,
          background: "linear-gradient(135deg, #fff7ed 0%, #fff 60%, #fff7ed 100%)",
          boxShadow: "0 0 0 1.5px #EA580C22, 0 4px 24px #EA580C18, 0 1px 4px #EA580C10",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {/* Shimmer */}
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)",
            animation: "shimmer 2.6s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
          @keyframes shimmer { 0%{transform:translateX(120%)} 100%{transform:translateX(-120%)} }
          @keyframes pulse-glow { 0%,100%{box-shadow:0 0 8px 2px #EA580C55} 50%{box-shadow:0 0 18px 5px #EA580C88} }
        `}</style>

        {/* Icon */}
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, #EA580C, #f97316)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "pulse-glow 2s ease-in-out infinite",
          boxShadow: "0 2px 10px #EA580C66",
        }}>
          <Zap size={15} strokeWidth={2.5} fill="white" stroke="white" />
        </div>

        {/* Label */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1410", lineHeight: 1.1 }}>عروض</div>
          <div style={{ fontSize: 10.5, fontWeight: 500, color: "#EA580C", lineHeight: 1.2, marginTop: 2 }}>أسعار لن تتكرر</div>
        </div>

        {/* Countdown */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 9.5, color: "#948C7C", fontWeight: 500, whiteSpace: "nowrap" }}>ينتهي خلال</span>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }} dir="ltr">
            {[h, m, s].map((v, i) => (
              <div key={i} style={{
                minWidth: 28, height: 26, borderRadius: 7, padding: "0 5px",
                background: "linear-gradient(135deg, #EA580C, #f97316)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff",
                boxShadow: "0 2px 8px #EA580C44",
                fontVariantNumeric: "tabular-nums",
              }}>{v}</div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: "linear-gradient(135deg, #EA580C, #f97316)",
          borderRadius: 20, padding: "6px 14px", flexShrink: 0,
          boxShadow: "0 2px 10px #EA580C55",
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>عروض</span>
        </div>
      </div>
    </div>
  );
}
