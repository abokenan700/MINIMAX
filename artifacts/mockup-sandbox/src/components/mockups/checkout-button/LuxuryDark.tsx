import { useState } from "react";

export function LuxuryDark() {
  const [pressed, setPressed] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F4F2",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'IBM Plex Sans Arabic', 'Noto Sans Arabic', sans-serif",
      gap: 24,
      padding: 32,
      direction: "rtl",
    }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700;800;900&family=Reem+Kufi+Fun:wght@700;800&display=swap" />

      <p style={{ fontSize: 11, color: "#999", letterSpacing: 1, textTransform: "uppercase", marginBottom: -8 }}>فاخر ذهبي</p>

      {/* ─── Luxury Dark button ─── */}
      <div style={{ width: 340 }}>
        <button
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          onTouchStart={() => setPressed(true)}
          onTouchEnd={() => setPressed(false)}
          style={{
            width: "100%",
            height: 58,
            display: "flex",
            alignItems: "center",
            padding: "0 5px 0 20px",
            borderRadius: 30,
            border: "1px solid rgba(212,175,55,0.30)",
            background: "linear-gradient(135deg, #1f1a14 0%, #2c2318 50%, #1a1410 100%)",
            boxShadow: pressed
              ? "0 2px 10px rgba(0,0,0,0.35)"
              : "0 6px 28px rgba(0,0,0,0.28), 0 0 0 1px rgba(212,175,55,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
            cursor: "pointer",
            transform: pressed ? "scale(0.975)" : "scale(1)",
            transition: "transform 0.14s ease, box-shadow 0.14s ease",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle gold shimmer */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(110deg, transparent 35%, rgba(212,175,55,0.07) 50%, transparent 65%)",
            borderRadius: "inherit",
            pointerEvents: "none",
          }} />

          {/* Right side: label + icon */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
            <span style={{
              fontSize: 15,
              fontWeight: 800,
              fontFamily: "'Reem Kufi Fun', 'IBM Plex Sans Arabic', sans-serif",
              color: "#d4af37",
              letterSpacing: "0.3px",
              whiteSpace: "nowrap",
              textShadow: "0 0 20px rgba(212,175,55,0.30)",
            }}>
              إتمام الطلب
            </span>
            {/* Gold chevron */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.70)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </div>

          <div style={{ flex: 1 }} />

          {/* Left side: dark price capsule with gold border */}
          <div style={{
            height: 46,
            borderRadius: 24,
            border: "1px solid rgba(212,175,55,0.25)",
            background: "rgba(212,175,55,0.06)",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            position: "relative",
          }}>
            {/* qty */}
            <div style={{
              display: "flex", alignItems: "baseline", gap: 3,
            }}>
              <span style={{
                fontSize: 14,
                fontWeight: 700,
                color: "rgba(212,175,55,0.65)",
                lineHeight: 1,
              }}>3</span>
              <span style={{
                fontSize: 10,
                color: "rgba(212,175,55,0.40)",
                lineHeight: 1,
              }}>قطع</span>
            </div>

            {/* gold divider */}
            <div style={{ width: 1, height: 18, background: "rgba(212,175,55,0.20)" }} />

            {/* price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
              <span style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#d4af37",
                letterSpacing: "-0.5px",
                lineHeight: 1,
                textShadow: "0 0 24px rgba(212,175,55,0.25)",
              }}>٢٣٥</span>
              <span style={{
                fontSize: 11,
                color: "rgba(212,175,55,0.55)",
                letterSpacing: "0.2px",
              }}>ر.س</span>
            </div>
          </div>
        </button>
      </div>

      {/* Annotations */}
      <div style={{ width: 340, display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {[
          { icon: "✅", text: "داكن + ذهبي — يعكس هوية نخبة الفاخرة مباشرة" },
          { icon: "✅", text: "خط Reem Kufi Fun للنص — يقوي الطابع العربي الراقي" },
          { icon: "✅", text: "ارتفاع 58px مع border ذهبي خفي — حضور ملكي" },
          { icon: "✅", text: "السعر ذهبي لامع — يبرز كعنصر القرار الرئيسي" },
        ].map((a, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 8,
            background: "rgba(212,175,55,0.04)",
            border: "1px solid rgba(212,175,55,0.18)",
            borderRadius: 10, padding: "8px 12px",
          }}>
            <span style={{ fontSize: 14 }}>{a.icon}</span>
            <span style={{ fontSize: 12, color: "#5C4E1A", lineHeight: 1.5 }}>{a.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
