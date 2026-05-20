import React from "react";

const tokens = {
  primary:    "#E8674A",
  primarySoft:"#F3B29D",
  bg:         "#F7F3EE",
  surface:    "#FFFFFF",
  secondary:  "#222222",
  muted:      "#6B6B6B",
  pressed:    "#D4503A",
};

function Swatch({ color, label, sub }: { color: string; label: string; sub: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:40, height:40, borderRadius:10, background:color, boxShadow:"0 1px 4px rgba(0,0,0,.12)", flexShrink:0 }} />
      <div>
        <div style={{ fontFamily:"Tajawal,sans-serif", fontSize:13, fontWeight:700, color:tokens.secondary }}>{label}</div>
        <div style={{ fontFamily:"monospace", fontSize:11, color:tokens.muted }}>{sub}</div>
      </div>
    </div>
  );
}

export default function IdentityShowcase() {
  return (
    <div dir="rtl" style={{
      width: "100%", minHeight: "100vh",
      background: tokens.bg,
      fontFamily: "Tajawal, sans-serif",
      padding: "20px 16px",
      display: "flex", flexDirection: "column", gap: 20,
    }}>

      {/* Header */}
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:22, fontWeight:800, color:tokens.secondary }}>نخبة — هوية v4.0</div>
        <div style={{ fontSize:12, color:tokens.muted, marginTop:2 }}>الألوان · الأزرار · الكروت · الشريط</div>
      </div>

      {/* Color swatches */}
      <div style={{ background:tokens.surface, borderRadius:16, padding:16, display:"flex", flexDirection:"column", gap:12, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <div style={{ fontSize:13, fontWeight:700, color:tokens.muted, borderBottom:`1px solid ${tokens.bg}`, paddingBottom:8 }}>🎨 توكنز الألوان</div>
        <Swatch color={tokens.primary}    label="Primary"     sub="#E8674A — brand-500" />
        <Swatch color={tokens.pressed}    label="Pressed"     sub="#D4503A — brand-600" />
        <Swatch color={tokens.primarySoft}label="Soft Accent" sub="#F3B29D — brand-300" />
        <Swatch color={tokens.bg}         label="Background"  sub="#F7F3EE — neutral-25" />
        <Swatch color={tokens.surface}    label="Surface"     sub="#FFFFFF — neutral-0" />
        <Swatch color={tokens.secondary}  label="Secondary"   sub="#222222 — neutral-900" />
        <Swatch color={tokens.muted}      label="Muted Text"  sub="#6B6B6B — neutral-500" />
      </div>

      {/* Buttons */}
      <div style={{ background:tokens.surface, borderRadius:16, padding:16, display:"flex", flexDirection:"column", gap:12, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <div style={{ fontSize:13, fontWeight:700, color:tokens.muted, borderBottom:`1px solid ${tokens.bg}`, paddingBottom:8 }}>🔲 الأزرار</div>
        <button style={{ background:tokens.primary, color:"#fff", border:"none", borderRadius:12, padding:"12px 0", fontFamily:"Tajawal,sans-serif", fontSize:15, fontWeight:700, width:"100%", boxShadow:`0 4px 16px rgba(232,103,74,.36)`, cursor:"pointer" }}>
          🛍 تسوّق الآن
        </button>
        <button style={{ background:"transparent", color:tokens.primary, border:`2px solid ${tokens.primary}`, borderRadius:12, padding:"11px 0", fontFamily:"Tajawal,sans-serif", fontSize:15, fontWeight:700, width:"100%", cursor:"pointer" }}>
          اكتشف المزيد
        </button>
        <button style={{ background:tokens.secondary, color:"#fff", border:"none", borderRadius:12, padding:"12px 0", fontFamily:"Tajawal,sans-serif", fontSize:15, fontWeight:700, width:"100%", cursor:"pointer" }}>
          إضافة للسلة
        </button>
      </div>

      {/* Flash strip */}
      <div style={{
        borderRadius: 14,
        background: `linear-gradient(110deg, ${tokens.primary} 0%, #EE8A6A 45%, ${tokens.primarySoft} 100%)`,
        boxShadow: `0 6px 28px rgba(232,103,74,.28)`,
        padding: "0 14px",
        height: 54,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:18 }}>🔥</span>
          <div>
            <div style={{ color:"#fff", fontSize:13, fontWeight:800, lineHeight:1.2 }}>عروض</div>
            <div style={{ color:"rgba(255,255,255,.80)", fontSize:10 }}>أسعار لن تتكرر</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ display:"flex", gap:4 }}>
            {["01","47","21"].map((v,i) => (
              <div key={i} style={{ background:"rgba(0,0,0,.22)", borderRadius:6, width:30, height:26, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:800 }}>{v}</div>
            ))}
          </div>
          <div style={{ background:"#fff", color:tokens.primary, borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:800 }}>اكتشف</div>
        </div>
      </div>

      {/* Product card */}
      <div style={{ background:tokens.surface, borderRadius:16, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,.08)" }}>
        <div style={{ background:`linear-gradient(135deg, ${tokens.bg} 0%, #EDE5DC 100%)`, height:140, display:"flex", alignItems:"center", justifyContent:"center", fontSize:48 }}>👗</div>
        <div style={{ padding:"12px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:tokens.secondary }}>فستان أنيق</div>
              <div style={{ fontSize:12, color:tokens.muted, marginTop:2 }}>مجموعة ربيع ٢٠٢٦</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:16, fontWeight:800, color:tokens.primary }}>٢٤٩ ر.س</div>
              <div style={{ fontSize:11, color:tokens.muted, textDecoration:"line-through" }}>٣٩٩ ر.س</div>
            </div>
          </div>
          <div style={{ marginTop:10, display:"flex", gap:6 }}>
            <div style={{ background:tokens.primary, color:"#fff", borderRadius:8, padding:"7px 0", fontSize:12, fontWeight:700, flex:1, textAlign:"center" }}>أضف للسلة</div>
            <div style={{ background:tokens.bg, color:tokens.secondary, borderRadius:8, padding:"7px 12px", fontSize:16, cursor:"pointer" }}>♡</div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div style={{ background:tokens.surface, borderRadius:16, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <div style={{ fontSize:13, fontWeight:700, color:tokens.muted, borderBottom:`1px solid ${tokens.bg}`, paddingBottom:8, marginBottom:12 }}>حروف</div>
        <div style={{ fontSize:22, fontWeight:800, color:tokens.secondary, lineHeight:1.3 }}>تشكيلة جديدة</div>
        <div style={{ fontSize:15, fontWeight:600, color:tokens.secondary, marginTop:4 }}>تصاميم راقية تعبّر عن ذوقك</div>
        <div style={{ fontSize:13, color:tokens.muted, marginTop:4, lineHeight:1.6 }}>اكتشفي أحدث صيحات الموضة بأسعار تنافسية مع ضمان الجودة.</div>
        <div style={{ fontSize:11, fontWeight:800, color:tokens.primary, marginTop:8, letterSpacing:1, textTransform:"uppercase" }}>تسوّق الآن ←</div>
      </div>

    </div>
  );
}
