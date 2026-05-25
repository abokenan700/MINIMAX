export function Current() {
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
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700;800&display=swap" />

      <p style={{ fontSize: 11, color: "#999", letterSpacing: 1, textTransform: "uppercase", marginBottom: -8 }}>التصميم الحالي</p>

      {/* ─── Current button ─── */}
      <div style={{ width: 340, position: "relative" }}>
        <button
          style={{
            width: "100%",
            height: 40,
            display: "flex",
            alignItems: "center",
            padding: "3px 3px 3px 16px",
            borderRadius: 20,
            border: "1px solid rgba(0,0,0,0.07)",
            background: "#FFFFFF",
            boxShadow: "0 -2px 14px rgba(0,0,0,0.07), 0 4px 18px rgba(0,0,0,0.08)",
            cursor: "pointer",
            gap: 0,
          }}
        >
          {/* Orange pill inside */}
          <div style={{
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 60%, #c2410c 100%)",
            borderRadius: 17,
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 13px 0 10px",
            flexShrink: 0,
            boxShadow: "0 2px 10px rgba(234,88,12,0.35)",
          }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "0.3px", whiteSpace: "nowrap" }}>
              إتمام الطلب
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.90)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </div>

          <div style={{ flex: 1 }} />

          {/* Count + price */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 4 }}>
            <div style={{
              background: "rgba(234,88,12,0.07)",
              border: "1px solid rgba(234,88,12,0.18)",
              borderRadius: 8,
              padding: "2px 8px",
              display: "flex", alignItems: "center", gap: 3,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#EA580C", lineHeight: 1 }}>3</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(234,88,12,0.75)", lineHeight: 1 }}>قطع</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: "#1A1410", letterSpacing: "-0.5px", lineHeight: 1 }}>٢٣٥</span>
              <span style={{ fontSize: 10, color: "rgba(26,20,16,0.45)", letterSpacing: "0.2px" }}>ر.س</span>
            </div>
          </div>
        </button>
      </div>

      {/* Annotations */}
      <div style={{ width: 340, display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {[
          { icon: "⚠️", text: "تصميم «Pill داخل Pill» — تعقيد بصري غير ضروري" },
          { icon: "⚠️", text: "خلفية بيضاء لا تعكس هوية العلامة الفاخرة" },
          { icon: "⚠️", text: "ارتفاع 40px — صغير جداً لأهم زر في رحلة الشراء" },
          { icon: "⚠️", text: "السعر والكمية محشوران في يسار ضيق" },
        ].map((a, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 8,
            background: "rgba(234,88,12,0.04)",
            border: "1px solid rgba(234,88,12,0.12)",
            borderRadius: 10, padding: "8px 12px",
          }}>
            <span style={{ fontSize: 14 }}>{a.icon}</span>
            <span style={{ fontSize: 12, color: "#6B5E54", lineHeight: 1.5 }}>{a.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
