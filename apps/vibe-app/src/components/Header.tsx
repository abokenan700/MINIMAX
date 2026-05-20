import logoCoin from "/logo-coin-orig.png";
import { Bell, ShoppingBag, Coins, User } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { useAccountSheet } from "../context/AccountSheetContext";
import { useCart } from "../context/CartContext";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiFetch";
import { IconButton } from "./ui/IconButton";
import { Badge } from "./ui/Badge";
import { Avatar } from "./ui/Avatar";
import { Chip } from "./ui/Chip";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "صباح الخير";
  if (h >= 12 && h < 17) return "مساء الخير";
  if (h >= 17 && h < 21) return "مساء النور";
  return "مرحباً بك";
}

export function Header() {
  const [, navigate]  = useLocation();
  const { user }      = useAuth();
  const { openSheet } = useAccountSheet();
  const { count }     = useCart();
  const greeting      = getGreeting();

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
          <img src={logoCoin} alt="نخبة" className="header-logo-img" decoding="async" />
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
        {/* Points chip */}
        {user && points > 0 && (
          <Chip
            variant="active"
            size="xs"
            leftIcon={<Coins size={11} />}
            aria-label={`نقاطي: ${points}`}
            onClick={() => navigate("/account")}
            style={{ height: 30, paddingInline: 8 }}
          >
            <span style={{ fontWeight: 800, fontSize: 11 }}>
              {points >= 1000 ? `${(points / 1000).toFixed(1)}ك` : points}
            </span>
          </Chip>
        )}

        {/* Cart */}
        <IconButton
          variant="ghost"
          size="lg"
          aria-label={count > 0 ? `السلة — ${count} عناصر` : "السلة"}
          onClick={() => navigate("/cart")}
          style={{ position: "relative" }}
          className="header-icon-btn"
        >
          <ShoppingBag size={19} strokeWidth={1.6} className="header-icon-svg" />
          {count > 0 && (
            <Badge
              variant="count"
              size="count"
              aria-hidden="true"
              style={{ position: "absolute", top: 5, insetInlineEnd: 5, border: "1.5px solid var(--bg-card)" }}
            >
              {count > 9 ? "9+" : count}
            </Badge>
          )}
        </IconButton>

        {/* Notifications */}
        <IconButton
          variant="ghost"
          size="lg"
          aria-label={unread > 0 ? `الإشعارات — ${unread} غير مقروء` : "الإشعارات"}
          onClick={() => navigate("/notifications")}
          style={{ position: "relative" }}
          className="header-icon-btn"
        >
          <Bell size={19} strokeWidth={1.6} className="header-icon-svg" />
          {unread > 0 && (
            <span
              aria-hidden="true"
              className="header-notif-dot"
            />
          )}
        </IconButton>

        {/* Account */}
        <IconButton
          variant="ghost"
          size="lg"
          aria-label={user ? "حسابي" : "تسجيل الدخول"}
          onClick={() => user ? navigate("/account") : openSheet()}
          className="header-icon-btn header-account-btn"
        >
          {user
            ? <Avatar size="sm" name={user.name} />
            : <User size={19} strokeWidth={1.6} className="header-icon-svg" />
          }
        </IconButton>
      </div>
    </header>
  );
}
