import { useRef, useCallback, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Home, LayoutGrid, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { Badge } from "./ui/Badge";

/* ── Geometry ────────────────────────────────────────────────── */
const PILL_H     = 60;
const CORNER_R   = 24;
const CIRCLE_R   = 26;
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

function pillPath(W: number, H: number, cx: number): string {
  const nL = Math.max(0, cx - NOTCH_HALF);
  const nR = Math.min(W, cx + NOTCH_HALF);
  const CR = CORNER_R;
  const d: string[] = [];
  if (nL >= CR) { d.push(`M ${CR} 0`); d.push(`L ${nL} 0`); }
  else          { d.push(`M ${nL} 0`); }
  d.push(`A ${NOTCH_ARC} ${NOTCH_ARC} 0 0 1 ${nR} 0`);
  if (nR <= W - CR) { d.push(`L ${W - CR} 0`); d.push(`Q ${W} 0 ${W} ${CR}`); }
  else              { d.push(`Q ${W} 0 ${W} ${CR}`); }
  d.push(`L ${W} ${H - CR}`);
  d.push(`Q ${W} ${H} ${W - CR} ${H}`);
  d.push(`L ${CR} ${H}`);
  d.push(`Q 0 ${H} 0 ${H - CR}`);
  if (nL >= CR) { d.push(`L 0 ${CR}`); d.push(`Q 0 0 ${CR} 0`); }
  else          { d.push(`L 0 0`); }
  d.push("Z");
  return d.join(" ");
}

export function BottomNav() {
  const [location, navigate] = useLocation();
  const { count }  = useCart();
  const btnRefs    = useRef<(HTMLButtonElement | null)[]>([]);
  const wrapRef    = useRef<HTMLDivElement>(null);
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
  const notchPct  = 87.5 - activeIdx * 25;
  const cx        = (notchPct / 100) * barW;

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
        background: "var(--nav-bg)",
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
            filter: "drop-shadow(0 -2px 6px rgba(0,0,0,0.06)) drop-shadow(0 3px 10px rgba(0,0,0,0.08))",
          }}
        >
          <path
            d={pillPath(barW, PILL_H, cx)}
            fill="#ffffff"
            stroke="rgba(212,80,58,0.12)"
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
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={showBadge ? `${label} — ${count} عناصر` : label}
                tabIndex={isActive ? 0 : -1}
                onClick={() => navigate(NAV_ROUTE[id])}
                className="focus-visible:outline-2 focus-visible:outline-[var(--color-brand-500)] focus-visible:outline-offset-2"
                style={{
                  flex: 1, height: "100%",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "flex-end",
                  paddingBottom: 9, gap: 4,
                  background: "transparent", border: "none", cursor: "pointer",
                  position: "relative", borderRadius: "var(--radius-sm)",
                }}
              >
                {/* Animated pill indicator */}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    style={{
                      position: "absolute", top: 3, left: "50%", x: "-50%",
                      width: 28, height: 3, borderRadius: 9999,
                      background: "var(--color-brand-500)",
                      boxShadow: "0 1px 6px rgba(212,80,58,0.45)",
                    }}
                    transition={{ type: "spring", stiffness: 340, damping: 28 }}
                  />
                )}

                {/* Active bubble */}
                {isActive && (
                  <motion.div
                    layoutId="nav-bubble"
                    style={{
                      position: "absolute", top: -CIRCLE_R, left: "50%", x: "-50%",
                      width: CIRCLE_R * 2, height: CIRCLE_R * 2, borderRadius: "50%",
                      background: "#ffffff",
                      boxShadow: "0 0 0 2px rgba(212,80,58,0.30), 0 4px 14px rgba(0,0,0,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      zIndex: 10,
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  >
                    <Icon size={21} strokeWidth={2.2} style={{ color: "var(--color-brand-500)" }} />
                    {showBadge && (
                      <Badge
                        variant="count"
                        size="count"
                        aria-hidden="true"
                        style={{ position: "absolute", top: 3, right: 3, border: "1.5px solid #fff" }}
                      >
                        {count > 9 ? "9+" : count}
                      </Badge>
                    )}
                  </motion.div>
                )}

                {/* Inactive icon */}
                {!isActive && (
                  <div style={{ position: "relative" }}>
                    <Icon size={20} strokeWidth={1.6} style={{ color: "var(--nav-inactive)" }} />
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
                  color: isActive ? "var(--color-brand-500)" : "var(--nav-inactive)",
                  fontWeight: isActive ? 700 : 500,
                  lineHeight: 1,
                  transition: "color var(--duration-base) var(--ease-out)",
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
