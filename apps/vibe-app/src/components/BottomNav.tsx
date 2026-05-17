import { useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Home, LayoutGrid, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const GOLD     = "var(--text-brand)";
const INACTIVE = "#AAAAAA";
const BADGE_BG = "var(--error)";

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const total = navItems.length;
      let next = activeIdx;
      switch (e.key) {
        case "ArrowLeft":  next = (activeIdx + 1) % total;          break;
        case "ArrowRight": next = (activeIdx - 1 + total) % total;  break;
        case "Home":       next = 0;                                  break;
        case "End":        next = total - 1;                          break;
        default:           return;
      }
      e.preventDefault();
      const nextItem = navItems[next];
      navigate(NAV_ROUTE[nextItem.id]);
      btnRefs.current[next]?.focus();
    },
    [activeIdx, navigate]
  );

  return (
    <nav
      role="tablist"
      aria-label="التنقل الرئيسي"
      onKeyDown={handleKeyDown}
      className="h-full flex items-center justify-between px-1"
      style={{
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(20px) saturate(1.8)",
        WebkitBackdropFilter: "blur(20px) saturate(1.8)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        paddingBottom: "max(6px, env(safe-area-inset-bottom, 0px))",
        paddingTop: 6,
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
            className="flex flex-col items-center flex-1 py-1 relative"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              gap: 3,
              transition: "opacity var(--duration-fast) var(--ease-out)",
            }}
          >
            {/* Top indicator pill */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: -6,
                left: "50%",
                transform: `translateX(-50%) scaleX(${isActive ? 1 : 0})`,
                width: 20,
                height: 2.5,
                borderRadius: "0 0 2px 2px",
                background: "var(--gradient-cta)",
                opacity: isActive ? 1 : 0,
                transition: "transform var(--duration-base) var(--ease-spring), opacity var(--duration-base) var(--ease-out)",
              }}
            />

            <div className="relative" style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon
                size={isActive ? 22 : 20}
                strokeWidth={isActive ? 2.2 : 1.6}
                style={{
                  color: isActive ? GOLD : INACTIVE,
                  transition: "color var(--duration-fast) var(--ease-out), width var(--duration-fast) var(--ease-out)",
                }}
              />
              {showBadge && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1.5 -end-1.5 text-white rounded-full flex items-center justify-center leading-none"
                  style={{
                    background: BADGE_BG,
                    fontSize: 8,
                    fontWeight: 800,
                    width: 15,
                    height: 15,
                    border: "1.5px solid rgba(255,255,255,0.9)",
                  }}
                >
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </div>

            <span
              style={{
                fontSize: "var(--text-2xs)",
                fontFamily: "var(--font-main)",
                color: isActive ? GOLD : INACTIVE,
                fontWeight: isActive ? 700 : 500,
                lineHeight: 1,
                transition: "color var(--duration-fast) var(--ease-out), font-weight var(--duration-fast) var(--ease-out)",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
