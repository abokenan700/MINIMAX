import logoCoin from "/logo-coin-orig.png";
import { Bell, User, ShoppingBag } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { useAccountSheet } from "../context/AccountSheetContext";
import { useCart } from "../context/CartContext";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiFetch";

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

  const { data: pointsData } = useQuery<{ points: number }>({
    queryKey:  ["user-points"],
    queryFn:   () => apiFetch<{ points: number }>("/api/v1/users/me/points", { auth: true }),
    enabled:   !!user,
    staleTime: 5 * 60_000,
  });
  const points = pointsData?.points ?? 0;

  const { data: notifications = [] } = useQuery<{ id: number; read: string }[]>({
    queryKey:  ["notifications"],
    queryFn:   () => apiFetch<{ id: number; read: string }[]>("/api/v1/notifications", { auth: true }),
    enabled:   !!user,
    staleTime: 60_000,
  });
  const unread = notifications.filter(n => n.read !== "true").length;

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
        {/* Points badge — show if logged in and has points */}
        {user && points > 0 && (
          <button
            className="header-icon-btn"
            aria-label={`نقاطي: ${points}`}
            onClick={() => navigate("/account")}
            style={{ position: "relative", display: "flex", alignItems: "center", gap: 3, padding: "0 8px", borderRadius: 20, background: "var(--gold-pale)", border: "1px solid var(--border-orange)", height: 30, width: "auto" }}
          >
            <span style={{ fontSize: 12 }}>🪙</span>
            <span style={{ fontFamily: "var(--font-main)", fontSize: 11, fontWeight: 800, color: "var(--text-brand)" }}>{points >= 1000 ? `${(points/1000).toFixed(1)}ك` : points}</span>
          </button>
        )}

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
          {unread > 0 && <span className="header-notif-dot" aria-hidden="true" />}
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
