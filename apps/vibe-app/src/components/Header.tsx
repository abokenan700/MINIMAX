import logoCoin from "/logo-coin-orig.png";
import { Bell, User } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { useAccountSheet } from "../context/AccountSheetContext";
import { ThemeSwitcher } from "./ThemeSwitcher";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "صباح الخير";
  if (h >= 12 && h < 17) return "مساء الخير";
  if (h >= 17 && h < 21) return "مساء النور";
  return "مرحباً بك";
}

export function Header() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { openSheet } = useAccountSheet();
  const greeting = getGreeting();

  return (
    <header
      className="flex items-center justify-between px-4"
      style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border-separator)",
        height: "var(--header-h)",
        flexShrink: 0,
      }}
    >
      {/* ─── Logo + Brand ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <img
          src={logoCoin}
          alt="نخبة"
          className="object-cover flex-shrink-0 rounded-full"
          style={{ width: 42, height: 42 }}
          decoding="async"
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-main)",
              background: "var(--gradient-brand-text)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "22px",
              fontWeight: 900,
              letterSpacing: "3px",
              lineHeight: 1,
            }}
          >
            نخبة
          </span>
          <span
            style={{
              fontFamily: "var(--font-main)",
              fontSize: "10.5px",
              color: "var(--text-muted)",
              lineHeight: 1,
              letterSpacing: "0.2px",
            }}
          >
            {user ? `${greeting}، ${user.name.split(" ")[0]}` : greeting}
          </span>
        </div>
      </div>

      {/* ─── Actions ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5">
        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Notifications */}
        <button
          className="flex items-center justify-center rounded-full"
          style={{
            width: 40,
            height: 40,
            position: "relative",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "background var(--duration-fast) var(--ease-out)",
          }}
          aria-label="الإشعارات"
          onClick={() => navigate("/notifications")}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--gold-light)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <Bell size={19} strokeWidth={1.6} style={{ color: "var(--text-tertiary)" }} />
          <span
            style={{
              position: "absolute",
              top: 7,
              insetInlineEnd: 7,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--error)",
              border: "1.5px solid var(--bg-card)",
            }}
          />
        </button>

        {/* Account */}
        <button
          className="flex items-center justify-center rounded-full"
          style={{
            width: 40,
            height: 40,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "background var(--duration-fast) var(--ease-out)",
          }}
          aria-label={user ? "حسابي" : "تسجيل الدخول"}
          onClick={() => user ? navigate("/account") : openSheet()}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--gold-light)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <User size={19} strokeWidth={1.6} style={{ color: "var(--text-tertiary)" }} />
        </button>
      </div>
    </header>
  );
}
