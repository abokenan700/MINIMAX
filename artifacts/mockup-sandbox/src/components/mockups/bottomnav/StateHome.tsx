import { useState } from "react";
import { Home, LayoutGrid, Heart, ShoppingBag } from "lucide-react";

const BRAND = "#D4503A";
const INACTIVE = "#AEA59A";
const PILL_H = 60;
const CORNER_R = 24;
const NOTCH_HALF = 32;
const NOTCH_ARC = 32;
const CIRCLE_R = 26;

const navItems = [
  { id: "home",       label: "الرئيسية",  Icon: Home        },
  { id: "categories", label: "التصنيفات", Icon: LayoutGrid  },
  { id: "wishlist",   label: "المفضلة",   Icon: Heart       },
  { id: "cart",       label: "السلة",     Icon: ShoppingBag },
];

function pillPath(W: number, H: number, cx: number) {
  const nL = Math.max(0, cx - NOTCH_HALF);
  const nR = Math.min(W, cx + NOTCH_HALF);
  const CR = CORNER_R;
  const d: string[] = [];
  if (nL >= CR) { d.push(`M ${CR} 0`); d.push(`L ${nL} 0`); }
  else { d.push(`M ${nL} 0`); }
  d.push(`A ${NOTCH_ARC} ${NOTCH_ARC} 0 0 1 ${nR} 0`);
  if (nR <= W - CR) { d.push(`L ${W - CR} 0`); d.push(`Q ${W} 0 ${W} ${CR}`); }
  else { d.push(`Q ${W} 0 ${W} ${CR}`); }
  d.push(`L ${W} ${H - CR}`);
  d.push(`Q ${W} ${H} ${W - CR} ${H}`);
  d.push(`L ${CR} ${H}`);
  d.push(`Q 0 ${H} 0 ${H - CR}`);
  if (nL >= CR) { d.push(`L 0 ${CR}`); d.push(`Q 0 0 ${CR} 0`); }
  else { d.push(`L 0 0`); }
  d.push("Z");
  return d.join(" ");
}

export function StateHome() {
  const [active, setActive] = useState(0);
  const W = 370;
  const notchPct = 87.5 - active * 25;
  const cx = (notchPct / 100) * W;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F7F3EE",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 32,
      fontFamily: "'Tajawal', 'IBM Plex Sans Arabic', sans-serif",
      direction: "rtl",
    }}>

      {/* Label */}
      <div style={{ fontSize: 12, color: "#8C8480", letterSpacing: 1, fontWeight: 600, textTransform: "uppercase" }}>
        حالة الشريط السفلي — تفاعل مباشر
      </div>

      {/* Phone shell */}
      <div style={{
        width: 390,
        background: "#fff",
        borderRadius: 28,
        boxShadow: "0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        overflow: "hidden",
        border: "6px solid #1A1A1A",
        position: "relative",
      }}>
        {/* Notch */}
        <div style={{ height: 28, background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 80, height: 6, background: "#333", borderRadius: 9999 }} />
        </div>

        {/* Screen content */}
        <div style={{ background: "#F7F3EE", height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>
              {active === 0 ? "🏠" : active === 1 ? "🏷️" : active === 2 ? "❤️" : "🛍️"}
            </div>
            <div style={{ fontSize: 13, color: "#6B6B6B", fontFamily: "inherit" }}>
              {navItems[active].label}
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div style={{
          background: "rgba(247,243,238,0.95)",
          backdropFilter: "blur(12px)",
          padding: "0 10px",
          display: "flex",
          alignItems: "flex-end",
          height: 64,
          position: "relative",
          overflow: "visible",
        }}>
          <div style={{ position: "relative", width: "100%", height: PILL_H, overflow: "visible" }}>
            <svg
              viewBox={`0 0 ${W} ${PILL_H}`}
              width="100%" height={PILL_H}
              preserveAspectRatio="none"
              style={{
                position: "absolute", top: 0, left: 0, overflow: "visible",
                filter: "drop-shadow(0 -2px 6px rgba(0,0,0,0.06)) drop-shadow(0 3px 10px rgba(0,0,0,0.08))",
              }}
            >
              <path
                d={pillPath(W, PILL_H, cx)}
                fill="#ffffff"
                stroke="rgba(212,80,58,0.12)"
                strokeWidth="1"
              />
            </svg>

            <div style={{ position: "relative", display: "flex", height: "100%", zIndex: 1 }}>
              {navItems.map(({ id, label, Icon }, idx) => {
                const isActive = active === idx;
                return (
                  <button
                    key={id}
                    onClick={() => setActive(idx)}
                    style={{
                      flex: 1, height: "100%",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "flex-end",
                      paddingBottom: 9, gap: 4,
                      background: "transparent", border: "none", cursor: "pointer",
                      position: "relative", fontFamily: "inherit",
                    }}
                  >
                    {/* Top indicator */}
                    {isActive && (
                      <div style={{
                        position: "absolute", top: 3, left: "50%", transform: "translateX(-50%)",
                        width: 28, height: 3, borderRadius: 9999,
                        background: BRAND,
                        boxShadow: "0 1px 6px rgba(212,80,58,0.45)",
                        transition: "left 0.3s",
                      }} />
                    )}

                    {/* Active bubble */}
                    {isActive && (
                      <div style={{
                        position: "absolute", top: -CIRCLE_R, left: "50%", transform: "translateX(-50%)",
                        width: CIRCLE_R * 2, height: CIRCLE_R * 2, borderRadius: "50%",
                        background: "#ffffff",
                        boxShadow: "0 0 0 2px rgba(212,80,58,0.30), 0 4px 14px rgba(0,0,0,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 10,
                        transition: "left 0.3s",
                      }}>
                        <Icon size={21} strokeWidth={2.2} style={{ color: BRAND }} />
                      </div>
                    )}

                    {!isActive && (
                      <Icon size={20} strokeWidth={1.6} style={{ color: INACTIVE }} />
                    )}

                    <span style={{
                      fontSize: 10,
                      color: isActive ? BRAND : INACTIVE,
                      fontWeight: isActive ? 700 : 500,
                      lineHeight: 1,
                      fontFamily: "inherit",
                    }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: "#AEA59A", textAlign: "center" }}>
        انقر على أي زر للتنقل بين الحالات
      </div>
    </div>
  );
}
