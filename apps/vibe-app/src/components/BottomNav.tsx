import { useRef, useCallback, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Home, LayoutGrid, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

const ACTIVE_COLOR = "#F97316";
const INACTIVE     = "#9CA3AF";
const BADGE_BG     = "#EF4444";

// Dimensions — matched to the reference image proportions
const PILL_H      = 60;   // bar height px
const CORNER_R    = 24;   // bar corner radius
const CIRCLE_R    = 24;   // active bubble radius (diameter = 48px)
const NOTCH_HALF  = 32;   // half-width of the concave notch (notch = 64px wide)
const NOTCH_ARC   = 32;   // arc radius = NOTCH_HALF → perfect semicircle, depth = 32px

export type NavId = "home" | "categories" | "wishlist" | "cart";

const NAV_ROUTE: Record<NavId, string> = {
  home:       "/",
  categories: "/categories",
  wishlist:   "/wishlist",
  cart:       "/cart",
};

const navItems: { id: NavId; label: string; Icon: React.ElementType }[] = [
  { id: "home",       label: "الرئيسية",  Icon: Home        },
  { id: "categories", label: "التصنيفات", Icon: LayoutGrid  },
  { id: "wishlist",   label: "المفضلة",   Icon: Heart       },
  { id: "cart",       label: "السلة",     Icon: ShoppingBag },
];

/**
 * Rounded-rectangle pill with a smooth CONCAVE semicircular notch at the top.
 *
 * Arc direction: sweep-flag=1 (clockwise in SVG = curves DOWNWARD into the bar).
 * The notch center sits at (cx, 0) — the bar's top edge.
 * The arc dips NOTCH_ARC px downward at its deepest point.
 */
function pillPath(W: number, H: number, cx: number): string {
  const nL = Math.max(CORNER_R + 1,     cx - NOTCH_HALF);
  const nR = Math.min(W - CORNER_R - 1, cx + NOTCH_HALF);

  return [
    `M ${CORNER_R} 0`,
    `L ${nL} 0`,
    `A ${NOTCH_ARC} ${NOTCH_ARC} 0 0 1 ${nR} 0`,   // concave notch ↓
    `L ${W - CORNER_R} 0`,
    `Q ${W} 0 ${W} ${CORNER_R}`,
    `L ${W} ${H - CORNER_R}`,
    `Q ${W} ${H} ${W - CORNER_R} ${H}`,
    `L ${CORNER_R} ${H}`,
    `Q 0 ${H} 0 ${H - CORNER_R}`,
    `L 0 ${CORNER_R}`,
    `Q 0 0 ${CORNER_R} 0`,
    `Z`,
  ].join(" ");
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
    const ro = new ResizeObserver(([e]) => setBarW(e.contentRect.width));
    ro.observe(el);
    setBarW(el.offsetWidth);
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

  // RTL: idx 0 (home) is the RIGHTMOST tab visually.
  // Physical left % of each tab center: 87.5 − idx×25
  const notchPct = 87.5 - activeIdx * 25;
  const cx       = (notchPct / 100) * barW;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
    },
    [activeIdx, navigate]
  );

  return (
    /*
     * The nav's background MUST match the page background so the transparent
     * concave notch in the pill exposes this colour — creating the visible gap
     * between the floating circle and the bar body.
     */
    <nav
      role="tablist"
      aria-label="التنقل الرئيسي"
      onKeyDown={handleKeyDown}
      style={{
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        paddingBottom: "max(10px, env(safe-area-inset-bottom, 0px))",
        paddingInline: 12,
        overflow: "visible",
        background: "var(--bg-page)", // ← exposes bg colour through notch
      }}
    >
      <div
        ref={wrapRef}
        style={{
          position: "relative",
          width: "100%",
          height: PILL_H,
          overflow: "visible",
        }}
      >
        {/* ── White pill with SVG concave notch ── */}
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${barW} ${PILL_H}`}
          width={barW}
          height={PILL_H}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            overflow: "visible",
            filter:
              "drop-shadow(0px -1px 8px rgba(0,0,0,0.08))" +
              " drop-shadow(0px 4px 12px rgba(0,0,0,0.10))",
          }}
        >
          <path d={pillPath(barW, PILL_H, cx)} fill="#ffffff" />
        </svg>

        {/* ── Buttons ── */}
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
                  flex: 1,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingBottom: 10,
                  gap: 4,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {/* Floating white bubble — sits half-above / half-inside the notch */}
                {isActive && (
                  <motion.div
                    layoutId="nav-bubble"
                    style={{
                      position: "absolute",
                      // center of circle = top edge of bar (y=0 of pill)
                      top: -CIRCLE_R,
                      left: "50%",
                      x: "-50%",
                      width:  CIRCLE_R * 2,
                      height: CIRCLE_R * 2,
                      borderRadius: "50%",
                      background: "#ffffff",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  >
                    <Icon size={22} strokeWidth={2.2} style={{ color: ACTIVE_COLOR }} />

                    {showBadge && (
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          top: 3, right: 3,
                          background: BADGE_BG,
                          color: "#fff",
                          fontSize: 8,
                          fontWeight: 800,
                          width: 14, height: 14,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1.5px solid #fff",
                        }}
                      >
                        {count > 9 ? "9+" : count}
                      </span>
                    )}
                  </motion.div>
                )}

                {/* Inactive icon */}
                {!isActive && (
                  <div style={{ position: "relative" }}>
                    <Icon size={20} strokeWidth={1.6} style={{ color: INACTIVE }} />
                    {showBadge && (
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          top: -6, right: -6,
                          background: BADGE_BG,
                          color: "#fff",
                          fontSize: 8,
                          fontWeight: 800,
                          width: 14, height: 14,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1.5px solid #fff",
                        }}
                      >
                        {count > 9 ? "9+" : count}
                      </span>
                    )}
                  </div>
                )}

                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "var(--font-main)",
                    color: isActive ? ACTIVE_COLOR : INACTIVE,
                    fontWeight: isActive ? 700 : 500,
                    lineHeight: 1,
                    transition: "color 0.2s",
                  }}
                >
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
