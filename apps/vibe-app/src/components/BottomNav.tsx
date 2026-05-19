import { useRef, useCallback, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Home, LayoutGrid, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

const ACTIVE_COLOR = "#F97316";
const INACTIVE     = "#AAAAAA";
const BADGE_BG     = "var(--error)";

const PILL_H   = 56;   // bar height
const CORNER_R = 22;   // pill corner radius
const CIRCLE_R = 24;   // active circle radius → diameter 48px
const NOTCH_R  = 28;   // concave arc radius (slightly larger than circle for a smooth rim)

export type NavId = "home" | "categories" | "wishlist" | "cart";

const NAV_ROUTE: Record<NavId, string> = {
  home:       "/",
  categories: "/categories",
  wishlist:   "/wishlist",
  cart:       "/cart",
};

const navItems: { id: NavId; label: string; Icon: React.ElementType }[] = [
  { id: "home",       label: "الرئيسية",  Icon: Home       },
  { id: "categories", label: "التصنيفات", Icon: LayoutGrid },
  { id: "wishlist",   label: "المفضلة",   Icon: Heart      },
  { id: "cart",       label: "السلة",     Icon: ShoppingBag},
];

/**
 * SVG path for a rounded pill with a smooth concave (inward) arc at the top.
 * The concave goes from (cx - NOTCH_R, 0) → curves DOWN → (cx + NOTCH_R, 0).
 * sweep-flag=0 (counter-clockwise) = concave from above.
 */
function makePillPath(W: number, H: number, cx: number): string {
  const nL = Math.max(CORNER_R + 1, cx - NOTCH_R);
  const nR = Math.min(W - CORNER_R - 1, cx + NOTCH_R);
  return [
    `M ${CORNER_R} 0`,
    `L ${nL} 0`,
    `A ${NOTCH_R} ${NOTCH_R} 0 0 1 ${nR} 0`,
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
      ([, route]) => path.startsWith(route) && route !== "/"
    );
    const id = match?.[0];
    return id !== undefined && id in NAV_ROUTE ? (id as NavId) : "home";
  }

  const activeId  = activeIdFromPath(location);
  const activeIdx = navItems.findIndex(n => n.id === activeId);

  // RTL layout: idx 0 (home) is visually rightmost → cx% = 87.5 − idx×25
  const notchPct = 87.5 - activeIdx * 25;
  const cx = (notchPct / 100) * barW;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const total = navItems.length;
      let next = activeIdx;
      switch (e.key) {
        case "ArrowLeft":  next = (activeIdx + 1) % total;         break;
        case "ArrowRight": next = (activeIdx - 1 + total) % total; break;
        case "Home":       next = 0;                                break;
        case "End":        next = total - 1;                        break;
        default: return;
      }
      e.preventDefault();
      navigate(NAV_ROUTE[navItems[next].id]);
      btnRefs.current[next]?.focus();
    },
    [activeIdx, navigate]
  );

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
        background: "transparent",
      }}
    >
      <div
        ref={wrapRef}
        style={{ position: "relative", width: "100%", height: PILL_H, overflow: "visible" }}
      >
        {/* ── SVG pill with true concave notch ── */}
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${barW} ${PILL_H}`}
          width="100%"
          height={PILL_H}
          style={{
            position: "absolute",
            inset: 0,
            overflow: "visible",
            filter:
              "drop-shadow(0 -2px 10px rgba(0,0,0,0.06)) drop-shadow(0 4px 14px rgba(0,0,0,0.10))",
          }}
        >
          <path d={makePillPath(barW, PILL_H, cx)} fill="#ffffff" />
        </svg>

        {/* ── Tab buttons ── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            height: "100%",
            zIndex: 1,
          }}
        >
          {navItems.map(({ id, label, Icon }, idx) => {
            const isActive  = activeId === id;
            const showBadge = id === "cart" && count > 0;

            return (
              <button
                key={id}
                ref={el => { btnRefs.current[idx] = el; }}
                role="tab"
                aria-selected={isActive}
                aria-label={
                  id === "cart" && count > 0 ? `${label} — ${count} عناصر` : label
                }
                tabIndex={isActive ? 0 : -1}
                onClick={() => navigate(NAV_ROUTE[id])}
                style={{
                  flex: 1,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingBottom: 8,
                  gap: 3,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {/* Floating bubble — center sits exactly at the bar top edge */}
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
                      background: "linear-gradient(145deg, #FB923C, #EA580C)",
                      boxShadow:
                        "0 6px 20px rgba(234,88,12,0.45), 0 2px 6px rgba(0,0,0,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={2.2}
                      style={{ color: "#ffffff" }}
                    />
                    {showBadge && (
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          top: 3,
                          right: 3,
                          background: BADGE_BG,
                          fontSize: 8,
                          fontWeight: 800,
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
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
                  <div
                    style={{
                      position: "relative",
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.6}
                      style={{ color: INACTIVE }}
                    />
                    {showBadge && (
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          background: BADGE_BG,
                          fontSize: 8,
                          fontWeight: 800,
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          border: "1.5px solid #fff",
                        }}
                      >
                        {count > 9 ? "9+" : count}
                      </span>
                    )}
                  </div>
                )}

                {/* Label */}
                <span
                  style={{
                    fontSize: "var(--text-2xs)",
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
