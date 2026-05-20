import { Search, X, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  onClear?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  readOnly?: boolean;
  autoFocus?: boolean;
  filtersRow?: React.ReactNode;
  navigateTo?: string;
  hideTrending?: boolean;
}

const TRENDING_TERMS = [
  "عطر شانيل",
  "حذاء نايك",
  "حقيبة ديور",
  "ساعة فاخرة",
  "عروض اليوم",
  "ملابس فاخرة",
];

export function SearchBar({
  placeholder = "ابحث عن منتجات، ماركات والمزيد...",
  value,
  onChange,
  onClear,
  onKeyDown,
  onFocus,
  readOnly = false,
  autoFocus = false,
  filtersRow,
  navigateTo,
  hideTrending = false,
}: SearchBarProps) {
  const [, navigate] = useLocation();
  const [focused, setFocused] = useState(false);

  const showTrending = readOnly && !!navigateTo && !hideTrending;

  function handleFocus() {
    setFocused(true);
    if (navigateTo) navigate(navigateTo);
    onFocus?.();
  }

  function handleBlur() {
    setFocused(false);
  }

  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderBottom: (filtersRow || showTrending) ? undefined : "1px solid var(--border)",
        flexShrink: 0,
      }}
    >
      <div className="px-3 pt-2 pb-1.5">
        <div
          className="flex items-center gap-3 rounded-2xl px-4"
          style={{
            background: "var(--input-bg)",
            border: "1px solid var(--color-brand-500)",
            paddingTop: "7px",
            paddingBottom: "7px",
            boxShadow: focused ? "0 0 0 2.5px var(--color-brand-50)" : "none",
            transition: "box-shadow 0.18s ease",
          }}
          dir="rtl"
        >
          <Search
            size={16}
            strokeWidth={1.8}
            className="flex-shrink-0"
            style={{
              color: focused ? "var(--color-brand-500)" : "var(--text-muted)",
              transition: "color 0.18s ease",
            }}
          />
          <input
            type={readOnly ? "text" : "search"}
            aria-label={placeholder}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            readOnly={readOnly}
            autoFocus={autoFocus}
            className="flex-1 min-w-0 bg-transparent placeholder:text-[--text-muted] text-[--text-primary] outline-none focus:outline-none focus-visible:outline-none"
            dir="rtl"
            style={{
              fontFamily: "var(--font-main)",
              fontSize: "clamp(11px, 3.2vw, 13px)",
              cursor: readOnly ? "pointer" : "text",
              outline: "none",
              outlineOffset: "0",
              border: "none",
              boxShadow: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
          />
          {onClear && value && value.length > 0 && (
            <button
              onClick={onClear}
              aria-label="مسح البحث"
              style={{ display: "flex", background: "none", border: "none", cursor: "pointer", padding: 2 }}
            >
              <X size={14} style={{ color: "var(--text-muted)" }} />
            </button>
          )}
        </div>
      </div>

      {/* Trending keywords — shown only on home page (readOnly mode) */}
      {showTrending && (
        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "2px 12px 10px",
            overflowX: "auto",
            borderBottom: "1px solid var(--border)",
          }}
          dir="rtl"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <TrendingUp size={11} style={{ color: "var(--text-brand)" }} />
            <span style={{ fontFamily: "var(--font-main)", fontSize: "clamp(9.5px, 2.5vw, 11px)", color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap" }}>
              الأكثر بحثاً:
            </span>
          </div>
          {TRENDING_TERMS.map((term) => (
            <button
              key={term}
              onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
              style={{
                flexShrink: 0,
                padding: "4px 10px",
                borderRadius: 20,
                border: "1px solid var(--border-warm)",
                background: "var(--bg-surface-subtle)",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-main)",
                fontSize: "clamp(10px, 2.6vw, 11.5px)",
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.15s, color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--color-brand-50)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-brand)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border-orange)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--bg-surface-subtle)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border-warm)";
              }}
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {filtersRow && (
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            paddingBottom: "10px",
          }}
        >
          {filtersRow}
        </div>
      )}
    </div>
  );
}
