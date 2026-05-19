import { useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Home, LayoutGrid, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

const ACTIVE_COLOR = "#F97316";
const INACTIVE     = "#AAAAAA";
const BADGE_BG     = "var(--error)";

const CIRCLE_D = 46;

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

export function BottomNav() {
  const [location, navigate] = useLocation();
  const { count } = useCart();
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  // In RTL flex, idx 0 (home) is visually rightmost → physical left % = 87.5 - idx*25
  const notchPct = 87.5 - activeIdx * 25;

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
      {/* Pill with notch cutout via radial-gradient mask */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 54,
          borderRadius: 22,
          boxShadow: "0 -2px 16px rgba(0,0,0,0.06), 0 6px 24px rgba(0,0,0,0.09)",
          overflow: "visible",
          display: "flex",
          alignItems: "center",
          /* Notch: transparent circle punched at the active tab position */
          backgroundImage: `radial-gradient(circle ${CIRCLE_D / 2 + 2}px at ${notchPct}% 0px, transparent ${CIRCLE_D / 2}px, #ffffff ${CIRCLE_D / 2 + 1}px)`,
          transition: "background-image 0s", // instant jump; bubble handles smooth motion
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
              aria-label={id === "cart" && count > 0 ? `${label} — ${count} عناصر` : label}
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
              {/* Floating bubble — only for active tab, animated via layoutId */}
              {isActive && (
                <motion.div
                  layoutId="nav-bubble"
                  style={{
                    position: "absolute",
                    top: -(CIRCLE_D / 2 + 2),
                    left: "50%",
                    x: "-50%",
                    width: CIRCLE_D,
                    height: CIRCLE_D,
                    borderRadius: "50%",
                    background: "#ffffff",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.13), 0 0 0 1.5px rgba(249,115,22,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                  }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                >
                  <Icon size={22} strokeWidth={2.2} style={{ color: ACTIVE_COLOR }} />
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
                <div style={{ position: "relative", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} strokeWidth={1.6} style={{ color: INACTIVE }} />
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
    </nav>
  );
}
