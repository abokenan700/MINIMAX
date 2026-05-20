import { useState, useEffect } from "react";
import { Flame } from "lucide-react";

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

export function GradientVariant() {
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
        @keyframes slide-shine { 0%{transform:translateX(200%)} 100%{transform:translateX(-200%)} }
        @keyframes tick { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
      `}</style>

      {/* Strip — full warm gradient background */}
      <div style={{
        width: "100%", maxWidth: 420, position: "relative",
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px",
        borderRadius: 16,
        background: "linear-gradient(110deg, #EA580C 0%, #f97316 45%, #fb923c 100%)",
        boxShadow: "0 6px 28px #EA580C44, 0 2px 8px #00000018",
        overflow: "hidden",
        cursor: "pointer",
      }}>
        {/* Shine sweep */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%)",
          animation: "slide-shine 3s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* Icon circle */}
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: "rgba(255,255,255,0.22)",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.35)",
        }}>
          <Flame size={15} strokeWidth={2.5} fill="white" stroke="white" />
        </div>

        {/* Label */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>عروض</div>
          <div style={{ fontSize: 10.5, fontWeight: 500, color: "rgba(255,255,255,0.82)", lineHeight: 1.2, marginTop: 2 }}>أسعار لن تتكرر</div>
        </div>

        {/* Countdown */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.8)", fontWeight: 500, whiteSpace: "nowrap" }}>ينتهي</span>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }} dir="ltr">
            {[h, m, s].map((v, i) => (
              <div key={i} style={{
                minWidth: 27, height: 26, borderRadius: 7, padding: "0 4px",
                background: "rgba(0,0,0,0.22)",
                border: "1px solid rgba(255,255,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff",
                fontVariantNumeric: "tabular-nums",
                backdropFilter: "blur(2px)",
              }}>{v}</div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: "rgba(255,255,255,0.96)",
          borderRadius: 20, padding: "6px 14px", flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#EA580C", whiteSpace: "nowrap" }}>اكتشف</span>
        </div>
      </div>
    </div>
  );
}
