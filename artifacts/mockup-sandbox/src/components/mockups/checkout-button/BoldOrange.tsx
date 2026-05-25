import { useState } from "react";

export function BoldOrange() {
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
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700;800;900&display=swap" />

      <p style={{ fontSize: 11, color: "#999", letterSpacing: 1, textTransform: "uppercase", marginBottom: -8 }}>برتقالي مكثّف</p>

      {/* ─── Bold Orange button ─── */}
      <div style={{ width: 340 }}>
        <button
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          onTouchStart={() => setPressed(true)}
          onTouchEnd={() => setPressed(false)}
          style={{
            width: "100%",
            height: 56,
            display: "flex",
            alignItems: "center",
            padding: "0 6px 0 20px",
            borderRadius: 28,
            border: "none",
            background: "linear-gradient(135deg, #fb923c 0%, #ea580c 50%, #c2410c 100%)",
            boxShadow: pressed
              ? "0 2px 8px rgba(234,88,12,0.30)"
              : "0 4px 20px rgba(234,88,12,0.40), 0 1px 4px rgba(234,88,12,0.20)",
            cursor: "pointer",
            transform: pressed ? "scale(0.975)" : "scale(1)",
            transition: "transform 0.12s ease, box-shadow 0.12s ease",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Shimmer overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
            borderRadius: "inherit",
          }} />

          {/* Right side: label + chevron */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
            <span style={{
              fontSize: 16,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "0.2px",
              whiteSpace: "nowrap",
            }}>
              إتمام الطلب
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </div>

          <div style={{ flex: 1 }} />

          {/* Left side: price pill */}
          <div style={{
            background: "rgba(0,0,0,0.18)",
            borderRadius: 22,
            height: 44,
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            position: "relative",
            backdropFilter: "blur(4px)",
          }}>
            {/* qty badge */}
            <div style={{
              background: "rgba(255,255,255,0.22)",
              borderRadius: 10,
              padding: "2px 7px",
              display: "flex", alignItems: "center", gap: 3,
            }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1 }}>3</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.80)", lineHeight: 1 }}>قطع</span>
            </div>

            {/* divider */}
            <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.25)" }} />

            {/* price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1 }}>٢٣٥</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.70)", letterSpacing: "0.2px" }}>ر.س</span>
            </div>
          </div>
        </button>
      </div>

      {/* Annotations */}
      <div style={{ width: 340, display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {[
          { icon: "✅", text: "زر واحد متسق — لا تعقيد بصري" },
          { icon: "✅", text: "ارتفاع 56px — حضور أقوى وضغط أسهل باليد" },
          { icon: "✅", text: "السعر والكمية في pill داخلي واضح على الخلفية البرتقالية" },
          { icon: "✅", text: "تأثير shimmer وضغط سلس مع shadow متجاوب" },
        ].map((a, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 8,
            background: "rgba(34,197,94,0.04)",
            border: "1px solid rgba(34,197,94,0.15)",
            borderRadius: 10, padding: "8px 12px",
          }}>
            <span style={{ fontSize: 14 }}>{a.icon}</span>
            <span style={{ fontSize: 12, color: "#3D6B4F", lineHeight: 1.5 }}>{a.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
