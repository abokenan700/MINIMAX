import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
  extra?: ReactNode;
  onViewAll?: () => void;
}

export function SectionHeader({ title, icon, extra, onViewAll }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {/* Orange accent bar — brand identity marker */}
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "3px",
            height: "17px",
            borderRadius: "2px",
            background: "var(--gradient-cta)",
            flexShrink: 0,
          }}
        />
        <h2
          style={{
            fontFamily: "var(--font-main)",
            fontSize: "var(--text-lg)",
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: 0,
            lineHeight: 1.25,
            letterSpacing: "-0.1px",
          }}
        >
          {title}
        </h2>
        {icon && (
          <span style={{ display: "flex", alignItems: "center", color: "var(--text-brand)" }}>
            {icon}
          </span>
        )}
        {extra}
      </div>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="flex items-center gap-0.5 transition-opacity active:opacity-60"
          style={{
            color: "var(--text-brand)",
            fontSize: "var(--text-xs)",
            fontFamily: "var(--font-main)",
            fontWeight: 600,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 0 4px 2px",
            opacity: 0.85,
          }}
          aria-label={`عرض كل ${title}`}
        >
          <span>عرض الكل</span>
          <ChevronLeft size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
