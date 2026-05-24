import { useRef, useCallback, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Home, LayoutGrid, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion, useMotionValue, animate } from "framer-motion";
import { Badge } from "./ui/Badge";

/* ── Geometry ────────────────────────────────────────────────── */
const PILL_H     = 60;
const CORNER_R   = 22;
const CIRCLE_R   = 27;
const NOTCH_HALF = 30;
const NOTCH_ARC  = 30;

/* ── The notch must stay inside the corner-radius zone ───────── */
function clampNotch(cx: number, W: number) {
  const minCx = CORNER_R + NOTCH_HALF + 4;
  const maxCx = W - CORNER_R - NOTCH_HALF - 4;
  return Math.min(maxCx, Math.max(minCx, cx));
}

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

function pillPath(W: number, H: number, rawCx: number): string {
  const cx = clampNotch(rawCx, W);
  const nL = cx - NOTCH_HALF;
  const nR = cx + NOTCH_HALF;
  const CR = CORNER_R;

  return [
    `M ${CR} 0`,
    `L ${nL} 0`,
    `A ${NOTCH_ARC} ${NOTCH_ARC} 0 0 1 ${nR} 0`,
    `L ${W - CR} 0`,
    `Q ${W} 0 ${W} ${CR}`,
    `L ${W} ${H - CR}`,
    `Q ${W} ${H} ${W - CR} ${H}`,
    `L ${CR} ${H}`,
    `Q 0 ${H} 0 ${H - CR}`,
    `L 0 ${CR}`,
    `Q 0 0 ${CR} 0`,
    `Z`,
  ].join(" ");
}

const NAV_SPRING = { type: "spring" as const, stiffness: 380, damping: 32 };

export function BottomNav() {
  const [location, navigate] = useLocation();
  const { count }  = useCart();
  const btnRefs    = useRef<(HTMLButtonElement | null)[]>([]);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const pathRef    = useRef<SVGPathElement>(null);
  const [barW, setBarW] = useState(360);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setBarW(el.offsetWidth);
    const ro = new ResizeObserver(measure);
    ro.observe(el); measure();
    return () => ro.disconnect();
  }, []);

  function activeIdFromPath(path: string): NavId {
    if (path === "/" || path === "") return "home";
    const match = Object.entries(NAV_ROUTE).find(([, r]) => path.startsWith(r) && r !== "/");
    const id = match?.[0];
    return id && id in NAV_ROUTE ? (id as NavId) : "home";
  }

  const activeId  = activeIdFromPath(location);
  const activeIdx = navItems.findIndex(n => n.id === activeId);

  /* RTL: item 0 is visually rightmost → cx near barW end */
  const notchPct = 87.5 - activeIdx * 25;
  const cx       = (notchPct / 100) * barW;

  /* Animate the notch cx via MotionValue → direct DOM setAttribute per frame */
  const cxMotion = useMotionValue(cx);

  useEffect(() => {
    const controls = animate(cxMotion, cx, NAV_SPRING);
    return controls.stop;
  }, [cx, cxMotion]);

  useEffect(() => {
    return cxMotion.on("change", (val) => {
      pathRef.current?.setAttribute("d", pillPath(barW, PILL_H, val));
    });
  }, [barW, cxMotion]);

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
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingInline: 12,
        overflow: "visible",
        /* transparent: the white pill is the only background — no color strip */
        background: "transparent",
      }}
    >
      <div
        ref={wrapRef}
        style={{ position: "relative", width: "100%", height: PILL_H, overflow: "visible" }}
      >
        {/* ── SVG pill ── notch animated via spring on cxMotion */}
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${barW} ${PILL_H}`}
          width="100%"
          height={PILL_H}
          preserveAspectRatio="none"
          style={{
            position: "absolute", top: 0, left: 0,
            overflow: "visible",
            filter: "drop-shadow(0 -3px 8px rgba(0,0,0,0.07)) drop-shadow(0 4px 12px rgba(0,0,0,0.09))",
          }}
        >
          <path
            ref={pathRef}
            d={pillPath(barW, PILL_H, cx)}
            fill="#ffffff"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="1"
          />
        </svg>

        {/* ── Tab buttons ── */}
        <div style={{ position: "relative", display: "flex", height: "100%", zIndex: 1 }}>
          {navItems.map(({ id, label, Icon }, idx) => {
            const isActive  = activeId === id;
            const showBadge = id === "cart" && count > 0;

            return (
              <motion.button
                key={id}
                ref={el => { btnRefs.current[idx] = el; }}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={showBadge ? `${label} — ${count} عناصر` : label}
                tabIndex={isActive ? 0 : -1}
                onClick={() => navigate(NAV_ROUTE[id])}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="focus-visible:outline-2 focus-visible:outline-[var(--color-brand-500)] focus-visible:outline-offset-2"
                style={{
                  flex: 1,
                  height: "100%",
                  minHeight: 44,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "flex-end",
                  paddingBottom: 9, gap: 4,
                  background: "transparent", border: "none", cursor: "pointer",
                  position: "relative", borderRadius: "var(--radius-sm)",
                }}
              >
                {/* Active top indicator pill */}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    style={{
                      position: "absolute", top: 3, left: "50%", x: "-50%",
                      width: 28, height: 3, borderRadius: 9999,
                      background: "var(--color-brand-500)",
                      boxShadow: "0 1px 6px rgba(212,80,58,0.40)",
                    }}
                    transition={NAV_SPRING}
                  />
                )}

                {/* Active floating bubble — ring matches page bg for clean separation */}
                {isActive && (
                  <motion.div
                    layoutId="nav-bubble"
                    style={{
                      position: "absolute",
                      top: -CIRCLE_R,
                      left: "50%",
                      x: "-50%",
                      width: CIRCLE_R * 2,
                      height: CIRCLE_R * 2,
                      borderRadius: "50%",
                      background: "#ffffff",
                      /*
                       * The outer ring uses the page background color (#F7F3EE)
                       * so the bubble looks like it "floats through" the pill top,
                       * matching the reference image exactly.
                       */
                      boxShadow: "0 0 0 5px #F7F3EE, 0 4px 16px rgba(0,0,0,0.13)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      zIndex: 10,
                    }}
                    transition={NAV_SPRING}
                  >
                    <Icon size={22} strokeWidth={2.2} style={{ color: "var(--color-brand-500)" }} />
                    {showBadge && (
                      <Badge
                        variant="count"
                        size="count"
                        aria-hidden="true"
                        style={{ position: "absolute", top: -2, right: -4, border: "2px solid #fff" }}
                      >
                        {count > 9 ? "9+" : count}
                      </Badge>
                    )}
                  </motion.div>
                )}

                {/* Inactive icon */}
                {!isActive && (
                  <div style={{ position: "relative" }}>
                    <Icon size={20} strokeWidth={1.6} style={{ color: "var(--color-neutral-400)" }} />
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

                <span style={{
                  fontSize: 10,
                  fontFamily: "var(--font-text)",
                  color: isActive ? "var(--color-brand-500)" : "var(--color-neutral-500)",
                  fontWeight: isActive ? 700 : 500,
                  lineHeight: 1,
                  transition: "color var(--duration-base) var(--ease-out)",
                }}>
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
