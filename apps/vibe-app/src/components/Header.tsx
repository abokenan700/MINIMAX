import logoCoin from "/logo-coin-orig.png";
import { Bell, User, ShoppingBag } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { useAccountSheet } from "../context/AccountSheetContext";
import { useCart } from "../context/CartContext";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "صباح الخير";
  if (h >= 12 && h < 17) return "مساء الخير";
  if (h >= 17 && h < 21) return "مساء النور";
  return "مرحباً بك";
}

export function Header() {
  const [, navigate] = useLocation();
  const { user }     = useAuth();
  const { openSheet} = useAccountSheet();
  const { count }    = useCart();
  const greeting     = getGreeting();

  return (
    <header className="header-bar">
      {/* ─── Logo + Brand ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="header-logo-ring">
          <img
            src={logoCoin}
            alt="نخبة"
            className="header-logo-img"
            decoding="async"
          />
        </div>
        <div className="flex flex-col" style={{ gap: 2 }}>
          <span className="header-brand-name">نخبة</span>
          <span className="header-greeting">
            {user ? `${greeting}، ${user.name.split(" ")[0]} 👋` : greeting}
          </span>
        </div>
      </div>

      {/* ─── Actions ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5">
        {/* Cart shortcut */}
        <button
          className="header-icon-btn"
          aria-label={count > 0 ? `السلة — ${count} عناصر` : "السلة"}
          onClick={() => navigate("/cart")}
        >
          <ShoppingBag size={19} strokeWidth={1.6} className="header-icon-svg" />
          {count > 0 && (
            <span className="header-cart-badge" aria-hidden="true">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>

        {/* Notifications */}
        <button
          className="header-icon-btn"
          aria-label="الإشعارات"
          onClick={() => navigate("/notifications")}
        >
          <Bell size={19} strokeWidth={1.6} className="header-icon-svg" />
          <span className="header-notif-dot" aria-hidden="true" />
        </button>

        {/* Account */}
        <button
          className="header-icon-btn header-account-btn"
          aria-label={user ? "حسابي" : "تسجيل الدخول"}
          onClick={() => user ? navigate("/account") : openSheet()}
        >
          {user ? (
            <div className="header-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User size={19} strokeWidth={1.6} className="header-icon-svg" />
          )}
        </button>
      </div>
    </header>
  );
}
