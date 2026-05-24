/* Variant C — "النقاء المتدرج" White + Soft Shadow + Gold Price + Slim Pill CTA */
const BRAND = "#EA580C";
const GOLD  = "#c49a27";

function NavBar() {
  const tabs = ["الرئيسية", "التصنيفات", "المفضلة", "السلة"];
  return (
    <div style={{ position: "relative", width: "100%", height: 67, flexShrink: 0 }}>
      <div style={{
        position: "absolute", top: 0, left: "calc(12.5% - 21px)",
        width: 42, height: 42, borderRadius: "50%",
        background: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,0.14)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
      }}>
        <svg width="20" height="20" fill="none" stroke={BRAND} strokeWidth="2.2" viewBox="0 0 24 24">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 50,
        background: "#fff", borderRadius: "16px 16px 0 0",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.06)",
        display: "flex", direction: "rtl",
      }}>
        {tabs.map((t, i) => (
          <div key={t} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 6, gap: 3 }}>
            {i === 3 ? <div style={{ width: 20, height: 20 }} /> : (
              <svg width="20" height="20" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.6" viewBox="0 0 24 24">
                {i === 0 && <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}
                {i === 1 && <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>}
                {i === 2 && <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>}
              </svg>
            )}
            <span style={{ fontSize: 10, fontWeight: i === 3 ? 700 : 500, color: i === 3 ? BRAND : "rgba(0,0,0,0.4)" }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VariantC() {
  return (
    <div style={{ width: 390, height: 280, background: "#FBFAF8", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ flex: 1, padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {[{ n: "عطر الفجر الذهبي", p: "٢٨٠ ر.س", b: "ديور" }, { n: "كريم الليل الفاخر", p: "٢٠٥ ر.س", b: "شانيل" }].map(item => (
          <div key={item.n} style={{ background: "#fff", borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", direction: "rtl" }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: "linear-gradient(135deg,#f3e8d8,#e8d5b8)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1410" }}>{item.n}</div>
              <div style={{ fontSize: 10, color: "rgba(0,0,0,0.45)", marginTop: 2 }}>{item.b}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: BRAND }}>{item.p}</div>
          </div>
        ))}
      </div>

      <div style={{ position: "relative" }}>
        {/* Variant C: White Premium — split layout with gold price + slim orange CTA */}
        <div style={{ position: "absolute", bottom: 50, left: "calc(12.5% + 27px)", right: 12, zIndex: 51 }}>
          <div style={{
            height: 44, display: "flex", alignItems: "center",
            padding: "4px 4px 4px 14px", borderRadius: 22,
            border: "1px solid rgba(196,154,39,0.20)",
            background: "linear-gradient(105deg, #fff 0%, #fffdf8 60%, #fff9ee 100%)",
            boxShadow: "0 2px 16px rgba(0,0,0,0.09), 0 1px 0 rgba(255,255,255,0.9) inset",
            direction: "rtl",
          }}>
            {/* Right: slim orange pill CTA */}
            <div style={{
              background: "linear-gradient(135deg,#f97316,#ea580c 55%,#c2410c)",
              borderRadius: 18, height: "100%",
              display: "flex", alignItems: "center", gap: 5,
              padding: "0 14px 0 10px", flexShrink: 0,
              boxShadow: "0 3px 12px rgba(234,88,12,0.38), 0 1px 0 rgba(255,255,255,0.20) inset",
            }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: "#fff", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>إتمام الطلب</span>
              <svg width="13" height="13" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </div>
            <div style={{ flex: 1 }} />
            {/* Thin gold divider */}
            <div style={{ width: 1, height: 20, background: "rgba(196,154,39,0.25)", margin: "0 10px", flexShrink: 0 }} />
            {/* Left: count + gold price */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ background: "rgba(234,88,12,0.07)", border: "1px solid rgba(234,88,12,0.16)", borderRadius: 8, padding: "2px 8px" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: BRAND }}>3 قطع</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <span style={{ fontSize: 19, fontWeight: 900, color: GOLD, letterSpacing: "-0.5px", lineHeight: 1 }}>٤٨٥</span>
                <span style={{ fontSize: 10, color: "rgba(196,154,39,0.60)", letterSpacing: "0.2px" }}>ر.س</span>
              </div>
            </div>
          </div>
        </div>
        <NavBar />
      </div>
    </div>
  );
}
