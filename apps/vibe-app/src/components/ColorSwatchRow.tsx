import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";
import { colorToCss, needsBorder } from "../lib/colorMap";

type SwatchSize = "xs" | "sm" | "md";

const SWATCH_DIM: Record<SwatchSize, number> = { xs: 14, sm: 18, md: 24 };
const HIT_DIM:    Record<SwatchSize, number> = { xs: 16, sm: 22, md: 30 };

export interface ColorSwatchRowProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onSelect"> {
  colors: string[];
  active?: number;
  onSelect?: (index: number) => void;
  max?: number;
  size?: SwatchSize;
}

export const ColorSwatchRow = forwardRef<HTMLDivElement, ColorSwatchRowProps>(
  ({ colors, active = -1, onSelect, max = 4, size = "xs", className, onClick, ...props }, ref) => {
    const visible = colors.slice(0, max);
    const overflow = colors.length - max;

    return (
      <div
        ref={ref}
        className={cn("flex items-center", className)}
        style={{ gap: 2 }}
        onClick={(e) => { e.stopPropagation(); onClick?.(e); }}
        {...props}
      >
        {visible.map((c, i) => {
          const css     = colorToCss(c);
          const border  = needsBorder(c);
          const isActive = i === active;
          const dim     = SWATCH_DIM[size];
          const hit     = HIT_DIM[size];

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect?.(i)}
              aria-label={`اللون ${c}`}
              aria-pressed={isActive}
              style={{
                width: hit, height: hit, padding: 0,
                border: "none", background: "transparent",
                cursor: onSelect ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, position: "relative",
              }}
            >
              <span
                className="rounded-full block"
                style={{
                  width: dim, height: dim,
                  background: css,
                  boxShadow: `0 1px 4px rgba(0,0,0,0.22)${border ? ", 0 0 0 1px rgba(0,0,0,0.12)" : ""}`,
                  transition: "transform 150ms var(--ease-spring)",
                  transform: isActive ? "scale(1.35)" : "scale(1)",
                  outline: isActive ? "2px solid var(--color-brand-500)" : "none",
                  outlineOffset: 2,
                }}
              />
            </button>
          );
        })}
        {overflow > 0 && (
          <span style={{
            fontSize: 9,
            fontFamily: "var(--font-text)",
            color: "var(--text-muted)",
            fontWeight: 600,
            lineHeight: 1,
          }}>
            +{overflow}
          </span>
        )}
      </div>
    );
  }
);
ColorSwatchRow.displayName = "ColorSwatchRow";
