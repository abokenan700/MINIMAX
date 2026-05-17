import { useState, useRef, useEffect } from "react";
import { Palette, Check, X } from "lucide-react";
import { useTheme, type ThemeMeta } from "../context/ThemeContext";

function ThemeDot({ theme, active, onClick }: { theme: ThemeMeta; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={theme.nameAr}
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: active ? `2.5px solid var(--text-primary)` : "2.5px solid transparent",
        padding: 3,
        background: "transparent",
        cursor: "pointer",
        flexShrink: 0,
        transition: "transform 0.15s, border-color 0.15s",
        transform: active ? "scale(1.12)" : "scale(1)",
        outline: "none",
      }}
    >
      <span
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${theme.primaryColor} 50%, ${theme.secondaryColor} 50%)`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
        }}
      />
    </button>
  );
}

export function ThemeSwitcher() {
  const { themeId, setThemeId, themes, currentTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div style={{ position: "relative" }}>
      {/* ─── Trigger Button ─── */}
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        aria-label="تغيير الهوية البصرية"
        className="flex items-center justify-center rounded-full"
        style={{
          width: 40,
          height: 40,
          background: open ? "var(--gold-light)" : "transparent",
          border: "none",
          cursor: "pointer",
          transition: "background var(--duration-fast) var(--ease-out)",
          position: "relative",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--gold-light)"; }}
        onMouseLeave={(e) => { if (!open) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        {/* small color dot to indicate active theme */}
        <Palette size={19} strokeWidth={1.6} style={{ color: "var(--text-tertiary)" }} />
        <span
          style={{
            position: "absolute",
            bottom: 6,
            insetInlineEnd: 6,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: currentTheme.primaryColor,
            border: "1.5px solid var(--bg-card)",
          }}
        />
      </button>

      {/* ─── Dropdown Panel ─── */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            insetInlineEnd: 0,
            background: "var(--bg-card)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
            padding: "14px 16px 16px",
            minWidth: 260,
            zIndex: 200,
            animation: "scaleIn 0.14s var(--ease-spring) both",
            transformOrigin: "top right",
          }}
        >
          {/* header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              الهوية البصرية
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "var(--text-muted)", display: "flex" }}
            >
              <X size={15} />
            </button>
          </div>

          {/* theme list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {themes.map(theme => {
              const active = themeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => { setThemeId(theme.id); setOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: "var(--radius-md)",
                    border: active ? "1.5px solid var(--gold)" : "1.5px solid transparent",
                    background: active ? "var(--gold-light)" : "transparent",
                    cursor: "pointer",
                    textAlign: "right",
                    width: "100%",
                    transition: "background 0.12s, border-color 0.12s",
                  }}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {/* color swatch */}
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: `linear-gradient(135deg, ${theme.primaryColor} 50%, ${theme.secondaryColor} 50%)`,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                    }}
                  />
                  {/* label */}
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: active ? 700 : 500, color: "var(--text-primary)", lineHeight: 1.3 }}>
                      {theme.nameAr}
                    </div>
                    <div style={{ fontFamily: "var(--font-main)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.3 }}>
                      {theme.id === "00" ? "البرتقالي الأصلي" : `النموذج ${theme.id}`}
                    </div>
                  </div>
                  {/* checkmark */}
                  {active && (
                    <Check size={15} style={{ color: "var(--gold)", flexShrink: 0 }} strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
