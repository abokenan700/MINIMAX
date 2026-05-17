import { useState, useRef, useEffect } from "react";
import { Palette, Check, X } from "lucide-react";
import { useTheme, type ThemeMeta } from "../context/ThemeContext";

/* ── Mini card preview (rendered with hard-coded inline styles per theme) ── */
function ThemePreviewCard({ theme, active, onClick }: {
  theme: ThemeMeta;
  active: boolean;
  onClick: () => void;
}) {
  const ctaText = theme.isDark
    ? (theme.id === "10" ? "#06060C" : "#F2E8D9")
    : "#FFFFFF";

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        border: active
          ? `2px solid ${theme.primaryColor}`
          : "2px solid transparent",
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        background: "transparent",
        padding: 0,
        textAlign: "right",
        transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
        transform: active ? "scale(1.02)" : "scale(1)",
        boxShadow: active
          ? `0 4px 16px ${theme.primaryColor}40`
          : "0 2px 8px rgba(0,0,0,0.10)",
        position: "relative",
      }}
      onMouseEnter={e => {
        if (!active) (e.currentTarget as HTMLElement).style.transform = "scale(1.01)";
      }}
      onMouseLeave={e => {
        if (!active) (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      }}
    >
      {/* ── App mockup surface ── */}
      <div style={{
        background: theme.bgColor,
        padding: "10px 10px 6px",
        position: "relative",
      }}>
        {/* fake header bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}>
          {/* brand dot + line */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              flexShrink: 0,
            }} />
            <div style={{
              width: 32, height: 7, borderRadius: 4,
              background: theme.textColor,
              opacity: 0.85,
            }} />
          </div>
          {/* fake nav dots */}
          <div style={{ display: "flex", gap: 3 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: i === 2 ? theme.primaryColor : theme.textColor,
                opacity: i === 2 ? 1 : 0.25,
              }} />
            ))}
          </div>
        </div>

        {/* fake hero banner */}
        <div style={{
          height: 40,
          borderRadius: 10,
          background: `linear-gradient(135deg, ${theme.ctaStart}22, ${theme.ctaEnd}44)`,
          border: `1px solid ${theme.primaryColor}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingInlineEnd: 8,
          marginBottom: 6,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* decorative shimmer */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.15,
            background: `linear-gradient(90deg, transparent 0%, ${theme.primaryColor} 50%, transparent 100%)`,
          }} />
          {/* CTA pill */}
          <div style={{
            background: `linear-gradient(135deg, ${theme.ctaStart}, ${theme.ctaEnd})`,
            borderRadius: 20,
            padding: "3px 10px",
            fontSize: 8,
            fontWeight: 700,
            color: ctaText,
            fontFamily: "sans-serif",
            zIndex: 1,
          }}>
            تسوق
          </div>
        </div>

        {/* fake product cards row */}
        <div style={{ display: "flex", gap: 5 }}>
          {[theme.primaryColor, theme.secondaryColor, theme.primaryColor].map((col, i) => (
            <div key={i} style={{
              flex: 1,
              height: 36,
              borderRadius: 8,
              background: theme.cardColor,
              border: `1px solid ${col}22`,
              boxShadow: `0 1px 4px rgba(0,0,0,${theme.isDark ? "0.40" : "0.07"})`,
              overflow: "hidden",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", bottom: 5, left: 5, right: 5, height: 5,
                borderRadius: 3,
                background: i === 0 ? col : `${theme.textColor}30`,
              }} />
              <div style={{
                position: "absolute", bottom: 13, left: 5,
                width: "60%", height: 4, borderRadius: 2,
                background: `${theme.textColor}20`,
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Label row ── */}
      <div style={{
        background: theme.isDark ? "#1A1A1A" : "#F5F5F5",
        padding: "7px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.primaryColor} 50%, ${theme.secondaryColor} 50%)`,
            flexShrink: 0,
            boxShadow: "0 1px 4px rgba(0,0,0,0.20)",
          }} />
          <div>
            <div style={{
              fontFamily: "var(--font-main)",
              fontSize: 12,
              fontWeight: 700,
              color: theme.isDark ? "#F0F0F0" : "#111",
              lineHeight: 1.2,
            }}>
              {theme.nameAr}
            </div>
            <div style={{
              fontFamily: "var(--font-main)",
              fontSize: 10,
              color: theme.isDark ? "#999" : "#888",
              lineHeight: 1.2,
            }}>
              {theme.tagAr}
            </div>
          </div>
        </div>
        {active ? (
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: theme.primaryColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Check size={11} color={ctaText} strokeWidth={3} />
          </div>
        ) : (
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            border: "1.5px solid #CCC",
            flexShrink: 0,
          }} />
        )}
      </div>
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
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div style={{ position: "relative" }}>
      {/* ── Trigger ── */}
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        aria-label="تغيير الهوية البصرية"
        className="flex items-center justify-center rounded-full"
        style={{
          width: 40, height: 40,
          background: open ? "var(--gold-light)" : "transparent",
          border: "none", cursor: "pointer",
          transition: "background var(--duration-fast) var(--ease-out)",
          position: "relative",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold-light)"; }}
        onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        <Palette size={19} strokeWidth={1.6} style={{ color: "var(--text-tertiary)" }} />
        <span style={{
          position: "absolute", bottom: 6, insetInlineEnd: 6,
          width: 8, height: 8, borderRadius: "50%",
          background: currentTheme.primaryColor,
          border: "1.5px solid var(--bg-card)",
        }} />
      </button>

      {/* ── Full-screen panel ── */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 300,
            display: "flex",
            flexDirection: "column",
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            animation: "fadeIn 0.18s var(--ease-out) both",
          }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            background: "var(--bg-card)",
            borderRadius: "20px 20px 0 0",
            maxHeight: "88vh",
            display: "flex",
            flexDirection: "column",
            animation: "slideUp 0.28s var(--ease-slide) both",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.25)",
          }}>
            {/* handle */}
            <div style={{
              width: 36, height: 4, borderRadius: 2,
              background: "rgba(0,0,0,0.12)",
              margin: "12px auto 0",
              flexShrink: 0,
            }} />

            {/* header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 20px 10px",
              flexShrink: 0,
            }}>
              <div>
                <div style={{
                  fontFamily: "var(--font-main)", fontSize: 16, fontWeight: 800,
                  color: "var(--text-primary)",
                }}>
                  الهوية البصرية
                </div>
                <div style={{
                  fontFamily: "var(--font-main)", fontSize: 12,
                  color: "var(--text-muted)", marginTop: 1,
                }}>
                  اختر النموذج المناسب لتجربة نخبة
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "var(--bg-subtle)", border: "none",
                  cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}
              >
                <X size={16} style={{ color: "var(--text-muted)" }} />
              </button>
            </div>

            {/* divider */}
            <div style={{ height: 1, background: "var(--border-separator)", margin: "0 20px", flexShrink: 0 }} />

            {/* scrollable grid */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 16px 32px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              alignContent: "start",
            }}>
              {themes.map(theme => (
                <ThemePreviewCard
                  key={theme.id}
                  theme={theme}
                  active={themeId === theme.id}
                  onClick={() => { setThemeId(theme.id); setOpen(false); }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
