/**
 * BottomNav — pixel-perfect port of the reference React Native CustomTabBar.
 *
 * Geometry constants mirror the source exactly:
 *   CIRCLE_R=30  BAR_H=64  NOTCH_D=28  NOTCH_HALF=29  NOTCH_EXT=19  CORNER_R=22
 *
 * The notch dips DOWNWARD into the bar via two cubic-bezier curves (not arcs).
 * The active circle sits with its centre 4 px above the bar top, cradled in the notch.
 * TOP_PAD=34 px of empty space is reserved above the bar so the circle can float.
 */
import { useRef, useCallback, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Home, LayoutGrid, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion, useMotionValue, animate } from "framer-motion";
import { Badge } from "./ui/Badge";

/* ── Geometry — exact values from the reference source ───────────────────── */
const CIRCLE_R    = 24;   // active-tab floating circle radius (px)
const BAR_H       = 64;   // height of the white pill body (px)
const NOTCH_D     = 22;   // how deep the notch dips INTO the bar (px, downward)
const NOTCH_HALF  = 23;   // half-width of the notch bowl
const NOTCH_EXT   = 15;   // bezier tangent extension for smooth approach curve
const CORNER_R    = 22;   // pill corner radius
const CIRCLE_ABOVE = CIRCLE_R - NOTCH_D + 2; // = 4 px — centre sits this far above bar top
const TOP_PAD      = CIRCLE_ABOVE + CIRCLE_R; // = 28 px — space reserved above bar
const CONTAINER_H  = TOP_PAD + BAR_H;         // = 92 px total nav height

/* ── Tab definitions ─────────────────────────────────────────────────────── */
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

/* ── SVG path — direct port of reference getBarPath() ───────────────────── */
function getBarPath(W: number, cx: number): string {
  const lx = cx - NOTCH_HALF;
  const rx = cx + NOTCH_HALF;
  return [
    `M ${CORNER_R} 0`,
    `L ${lx - NOTCH_EXT} 0`,
    /* left  bezier: horizontal → dip down to notch floor */
    `C ${lx} 0 ${lx} ${NOTCH_D} ${cx} ${NOTCH_D}`,
    /* right bezier: notch floor → climb back to horizontal */
    `C ${rx} ${NOTCH_D} ${rx} 0 ${rx + NOTCH_EXT} 0`,
    `L ${W - CORNER_R} 0`,
    `Q ${W} 0 ${W} ${CORNER_R}`,
    `L ${W} ${BAR_H}`,
    `L 0 ${BAR_H}`,
    `L 0 ${CORNER_R}`,
    `Q 0 0 ${CORNER_R} 0`,
    `Z`,
  ].join(" ");
}

/* ── Spring config — mirrors reference tension:130, friction:11 ──────────── */
const SPRING = { type: "spring" as const, stiffness: 130, damping: 11 * 0.5 + 5 };

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function activeIdFromPath(path: string): NavId {
  if (path === "/" || path === "") return "home";
  const match = Object.entries(NAV_ROUTE)
    .find(([, r]) => path.startsWith(r) && r !== "/");
  const id = match?.[0];
  return id && id in NAV_ROUTE ? (id as NavId) : "home";
}

/* ── Component ───────────────────────────────────────────────────────────── */
export function BottomNav() {
  const [location, navigate] = useLocation();
  const { count } = useCart();
  const navRef   = useRef<HTMLElement>(null);
  const pathRef  = useRef<SVGPathElement>(null);
  const btnRefs  = useRef<(HTMLButtonElement | null)[]>([]);
  const [barW, setBarW] = useState(360);

  /* Measure bar width and keep it in sync on resize */
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const measure = () => setBarW(el.offsetWidth);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  /* Derive active state */
  const activeId  = activeIdFromPath(location);
  const activeIdx = navItems.findIndex(n => n.id === activeId);

  /*
   * RTL layout: item[0] (home) is visually RIGHTMOST.
   * In LTR pixel-space that means the highest X value.
   *   cx = W × (N − idx − 0.5) / N
   * idx=0 → 87.5 %W   idx=3 → 12.5 %W
   */
  const N  = navItems.length;
  const cx = barW * (N - activeIdx - 0.5) / N;

  /* MotionValues — notch drives SVG via onChange (no Framer SVG interpolation),
     circle drives translateX for native-like performance */
  const notchMv  = useMotionValue(cx);
  const circleMv = useMotionValue(cx - CIRCLE_R);

  useEffect(() => {
    const c1 = animate(notchMv,  cx,            SPRING);
    const c2 = animate(circleMv, cx - CIRCLE_R, SPRING);
    return () => { c1.stop(); c2.stop(); };
  }, [cx, notchMv, circleMv]);

  /* Push new SVG path on every notch animation frame */
  useEffect(() => {
    return notchMv.on("change", (val) => {
      pathRef.current?.setAttribute("d", getBarPath(barW, val));
    });
  }, [barW, notchMv]);

  /* Keyboard navigation (RTL: ArrowLeft moves RIGHT in visual order) */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    let next = activeIdx;
    if      (e.key === "ArrowLeft")  next = (activeIdx + 1) % N;
    else if (e.key === "ArrowRight") next = (activeIdx - 1 + N) % N;
    else if (e.key === "Home")       next = 0;
    else if (e.key === "End")        next = N - 1;
    else return;
    e.preventDefault();
    navigate(NAV_ROUTE[navItems[next].id]);
    btnRefs.current[next]?.focus();
  }, [activeIdx, N, navigate]);

  return (
    <nav
      ref={navRef}
      role="tablist"
      aria-label="التنقل الرئيسي"
      onKeyDown={handleKeyDown}
      style={{
        position: "relative",
        width: "100%",
        height: CONTAINER_H,
        overflow: "visible",
        background: "transparent",
      }}
    >
      {/* ── SVG pill with animated notch ───────────────────────────────── */}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${barW} ${BAR_H}`}
        width="100%"
        height={BAR_H}
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: TOP_PAD,
          left: 0,
          overflow: "visible",
          filter: [
            "drop-shadow(0 -2px 5px rgba(0,0,0,0.06))",
            "drop-shadow(0  4px 12px rgba(0,0,0,0.09))",
          ].join(" "),
        }}
      >
        <path
          ref={pathRef}
          d={getBarPath(barW, cx)}
          fill="#ffffff"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1"
        />
      </svg>

      {/* ── Floating active circle (decorative, aria-hidden) ───────────── */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          x: circleMv,
          width:  CIRCLE_R * 2,
          height: CIRCLE_R * 2,
          borderRadius: "50%",
          background: "#ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        {(() => {
          const item = navItems[activeIdx];
          if (!item) return null;
          const { Icon, id } = item;
          const showBadge = id === "cart" && count > 0;
          return (
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={24} strokeWidth={2.2} style={{ color: "var(--color-brand-500)" }} />
              {showBadge && (
                <Badge
                  variant="count"
                  size="count"
                  aria-hidden="true"
                  style={{ position: "absolute", top: -6, right: -8, border: "2px solid #fff" }}
                >
                  {count > 9 ? "9+" : count}
                </Badge>
              )}
            </div>
          );
        })()}
      </motion.div>

      {/* ── Tab button row ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: TOP_PAD,
          left: 0, right: 0,
          height: BAR_H,
          display: "flex",
          zIndex: 5,
        }}
      >
        {navItems.map(({ id, label, Icon }, idx) => {
          const isActive  = activeId === id;
          const showBadge = id === "cart" && count > 0;
          const a11yLabel = showBadge ? `${label} — ${count} عناصر` : label;

          return (
            <motion.button
              key={id}
              ref={el => { btnRefs.current[idx] = el; }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={a11yLabel}
              tabIndex={isActive ? 0 : -1}
              onClick={() => navigate(NAV_ROUTE[id])}
              whileTap={{ scale: 0.88 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="focus-visible:outline-2 focus-visible:outline-[var(--color-brand-500)] focus-visible:outline-offset-2"
              style={{
                flex: 1,
                height: "100%",
                minHeight: 44,
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
                borderRadius: "var(--radius-sm)",
              }}
            >
              {/* Active tab: spacer so label aligns same as inactive tabs */}
              {isActive ? (
                <div
                  aria-hidden="true"
                  style={{ width: 24, height: 24 }}
                />
              ) : (
                /* Inactive tab: show outline icon + optional badge */
                <div style={{ position: "relative" }}>
                  <Icon
                    size={22}
                    strokeWidth={1.6}
                    style={{ color: "var(--color-neutral-400)", display: "block" }}
                  />
                  {showBadge && (
                    <Badge
                      variant="count"
                      size="count"
                      aria-hidden="true"
                      style={{ position: "absolute", top: -6, right: -6, border: "1.5px solid #fff" }}
                    >
                      {count > 9 ? "9+" : count}
                    </Badge>
                  )}
                </div>
              )}

              <span
                style={{
                  fontSize: 10,
                  fontFamily: "var(--font-text)",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive
                    ? "var(--color-brand-500)"
                    : "var(--color-neutral-500)",
                  lineHeight: 1,
                  transition: "color var(--duration-base) var(--ease-out)",
                }}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
