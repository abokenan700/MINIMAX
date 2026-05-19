import { useRef, useCallback, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Home, LayoutGrid, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

/* ── Colours ─────────────────────────────────────────────────── */
const BRAND    = "#F97316";
const NAV_BG   = "#F5EDE0"; // warm cream — clearly distinct from white pill
const INACTIVE = "#9CA3AF";
const BADGE_BG = "#EF4444";

/* ── Geometry ────────────────────────────────────────────────── */
const PILL_H     = 60;
const CORNER_R   = 24;
const CIRCLE_R   = 26;   // bubble radius  (Ø 52 px)
// Semicircle notch: NOTCH_ARC = NOTCH_HALF → depth = NOTCH_HALF always
// Shoulder each side = NOTCH_HALF − CIRCLE_R = 6 px
const NOTCH_HALF = 32;
const NOTCH_ARC  = 32;

export type NavId = "home" | "categories" | "wishlist" | "cart";

const NAV_ROUTE: Record<NavId, string> = {
  home: "/", categories: "/categories", wishlist: "/wishlist", cart: "/cart",
};

const navItems: { id: NavId; label: string; Icon: React.ElementType }[] = [
  { id: "home",       label: "الرئيسية",  Icon: Home        },
  { id: "categories", label: "التصنيفات", Icon: LayoutGrid  },
  { id: "wishlist",   label: "المفضلة",   Icon: Heart       },
  { id: "cart",       label: "السلة",     Icon: ShoppingBag },
];

/**
 * White pill shape with a concave semicircular notch at the top.
 *
 * The notch is UNCLAMPED — it may extend into the corner region.
 * The path handles four cases so no corner region clipping occurs.
 *
 * Sweep-flag = 1 → clockwise in SVG coords → arc curves DOWNWARD = concave ✓
 *
 * Geometry proof (semicircle, NOTCH_ARC = NOTCH_HALF = 32):
 *   depth = NOTCH_ARC = 32 px  ≥  CIRCLE_R = 26 px  ✓
 *   shoulder = NOTCH_HALF − CIRCLE_R = 6 px on each side  ✓
 */
function pillPath(W: number, H: number, cx: number): string {
  // Unclamped notch edges — bounded only by the pill width
  const nL = Math.max(0, cx - NOTCH_HALF);
  const nR = Math.min(W, cx + NOTCH_HALF);

  const CR = CORNER_R;
  const d: string[] = [];

  // ── Top-left corner ────────────────────────────────────────
  if (nL >= CR) {
    // Normal: full left corner, then straight line to notch
    d.push(`M ${CR} 0`);
    d.push(`L ${nL} 0`);
  } else {
    // Notch encroaches on left corner — no left corner curve, just start at nL
    d.push(`M ${nL} 0`);
  }

  // ── Concave notch arc ──────────────────────────────────────
  d.push(`A ${NOTCH_ARC} ${NOTCH_ARC} 0 0 1 ${nR} 0`);

  // ── Top-right corner ──────────────────────────────────────
  if (nR <= W - CR) {
    // Normal: straight line to right corner, then corner arc
    d.push(`L ${W - CR} 0`);
    d.push(`Q ${W} 0 ${W} ${CR}`);
  } else {
    // Notch encroaches on right corner — connect arc end directly to corner
    // Q bezier from (nR, 0) → control (W, 0) → end (W, CR)
    d.push(`Q ${W} 0 ${W} ${CR}`);
  }

  // ── Right wall + bottom-right corner + bottom ──────────────
  d.push(`L ${W} ${H - CR}`);
  d.push(`Q ${W} ${H} ${W - CR} ${H}`);
  d.push(`L ${CR} ${H}`);

  // ── Bottom-left corner ────────────────────────────────────
  d.push(`Q 0 ${H} 0 ${H - CR}`);

  // ── Left wall ─────────────────────────────────────────────
  if (nL >= CR) {
    d.push(`L 0 ${CR}`);
    d.push(`Q 0 0 ${CR} 0`);
  } else {
    // No left corner — go straight up to nL level (y=0)
    d.push(`L 0 0`);
  }

  d.push("Z");
  return d.join(" ");
}

export function BottomNav() {
  const [location, navigate] = useLocation();
  const { count } = useCart();
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [barW, setBarW] = useState(360);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setBarW(el.offsetWidth);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  function activeIdFromPath(path: string): NavId {
    if (path === "/" || path === "") return "home";
    const match = Object.entries(NAV_ROUTE).find(
      ([, r]) => path.startsWith(r) && r !== "/"
    );
    const id = match?.[0];
    return id && id in NAV_ROUTE ? (id as NavId) : "home";
  }

  const activeId  = activeIdFromPath(location);
  const activeIdx = navItems.findIndex(n => n.id === activeId);

  // RTL: idx 0 (home) is the RIGHTMOST tab → physical left% = 87.5 − idx×25
  const notchPct = 87.5 - activeIdx * 25;
  const cx       = (notchPct / 100) * barW;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const total = navItems.length;
    let next = activeIdx;
    if      (e.key === "ArrowLeft")  next = (activeIdx + 1) % total;
    else if (e.key === "ArrowRight") next = (activeIdx - 1 + total) % total;
    else if (e.key === "Home")       next = 0;
    else if (e.key === "End")        next = total - 1;
    else return;
    e.preventDefault();
    navigate(NAV_ROUTE[navItems[next].id]);
    btnRefs.current[next]?.focus();
  }, [activeIdx, navigate]);

  return (
    <nav
      role="tablist"
      aria-label="التنقل الرئيسي"
      onKeyDown={handleKeyDown}
      style={{
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        paddingBottom: "max(8px, env(safe-area-inset-bottom, 0px))",
        paddingInline: 10,
        overflow: "visible",
        background: NAV_BG,
      }}
    >
      <div
        ref={wrapRef}
        style={{ position: "relative", width: "100%", height: PILL_H, overflow: "visible" }}
      >
        {/* ── SVG pill ── */}
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${barW} ${PILL_H}`}
          width="100%"
          height={PILL_H}
          preserveAspectRatio="none"
          style={{
            position: "absolute", top: 0, left: 0,
            overflow: "visible",
            filter:
              "drop-shadow(0 -2px 6px rgba(0,0,0,0.06))" +
              " drop-shadow(0 3px 10px rgba(0,0,0,0.08))",
          }}
        >
          <path
            d={pillPath(barW, PILL_H, cx)}
            fill="#ffffff"
            stroke="rgba(249,115,22,0.12)"
            strokeWidth="1"
          />
        </svg>

        {/* ── Tab buttons ── */}
        <div style={{ position: "relative", display: "flex", height: "100%", zIndex: 1 }}>
          {navItems.map(({ id, label, Icon }, idx) => {
            const isActive  = activeId === id;
            const showBadge = id === "cart" && count > 0;

            return (
              <button
                key={id}
                ref={el => { btnRefs.current[idx] = el; }}
                role="tab"
                aria-selected={isActive}
                aria-label={showBadge ? `${label} — ${count} عناصر` : label}
                tabIndex={isActive ? 0 : -1}
                onClick={() => navigate(NAV_ROUTE[id])}
                style={{
                  flex: 1, height: "100%",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "flex-end",
                  paddingBottom: 9, gap: 4,
                  background: "transparent", border: "none", cursor: "pointer",
                  position: "relative",
                }}
              >
                {/*
                 * Active bubble:
                 *   top = −CIRCLE_R → bubble CENTRE sits exactly on bar's top edge
                 *   Bottom half (CIRCLE_R = 26 px) sits inside the concave notch
                 *   (depth = NOTCH_ARC = 32 px > 26 px ✓)
                 *   The NAV_BG colour shows through the 6 px shoulders on each side
                 */}
                {isActive && (
                  <motion.div
                    layoutId="nav-bubble"
                    style={{
                      position: "absolute",
                      top: -CIRCLE_R,
                      left: "50%",
                      x: "-50%",
                      width:  CIRCLE_R * 2,
                      height: CIRCLE_R * 2,
                      borderRadius: "50%",
                      background: "#ffffff",
                      boxShadow:
                        `0 0 0 2px rgba(249,115,22,0.30),` +
                        `0 4px 14px rgba(0,0,0,0.12)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      zIndex: 10,
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  >
                    <Icon size={21} strokeWidth={2.2} style={{ color: BRAND }} />

                    {showBadge && (
                      <span aria-hidden="true" style={{
                        position: "absolute", top: 3, right: 3,
                        background: BADGE_BG, color: "#fff",
                        fontSize: 8, fontWeight: 800, width: 14, height: 14,
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1.5px solid #fff",
                      }}>
                        {count > 9 ? "9+" : count}
                      </span>
                    )}
                  </motion.div>
                )}

                {!isActive && (
                  <div style={{ position: "relative" }}>
                    <Icon size={20} strokeWidth={1.6} style={{ color: INACTIVE }} />
                    {showBadge && (
                      <span aria-hidden="true" style={{
                        position: "absolute", top: -6, right: -6,
                        background: BADGE_BG, color: "#fff",
                        fontSize: 8, fontWeight: 800, width: 14, height: 14,
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1.5px solid #fff",
                      }}>
                        {count > 9 ? "9+" : count}
                      </span>
                    )}
                  </div>
                )}

                <span style={{
                  fontSize: 10,
                  fontFamily: "var(--font-main)",
                  color: isActive ? BRAND : INACTIVE,
                  fontWeight: isActive ? 700 : 500,
                  lineHeight: 1,
                  transition: "color 0.2s",
                }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
