import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface PriceTagProps extends HTMLAttributes<HTMLDivElement> {
  price: number;
  original?: number;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  layout?: "inline" | "stacked";
}

const PRICE_SIZE = {
  sm: "clamp(12px, 3.2vw, 14px)",
  md: "clamp(14px, 3.8vw, 16px)",
  lg: "clamp(16px, 4.2vw, 19px)",
  xl: "clamp(20px, 5.2vw, 24px)",
} as const;

const CURRENCY_SIZE = {
  sm: "clamp(9px, 2.4vw, 10px)",
  md: "clamp(10px, 2.6vw, 11px)",
  lg: "clamp(11px, 2.8vw, 12px)",
  xl: "clamp(12px, 3.0vw, 13px)",
} as const;

const ORIGINAL_SIZE = {
  sm: "clamp(9px, 2.4vw, 10px)",
  md: "clamp(10px, 2.6vw, 11px)",
  lg: "clamp(11px, 2.8vw, 12px)",
  xl: "clamp(12px, 3.0vw, 13px)",
} as const;

export const PriceTag = forwardRef<HTMLDivElement, PriceTagProps>(
  ({ price, original, currency = "ر.س", size = "md", layout = "inline", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        layout === "stacked" ? "flex flex-col gap-0.5" : "flex items-baseline gap-1",
        className
      )}
      dir="ltr"
      {...props}
    >
      <span style={{ fontSize: PRICE_SIZE[size], fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-numeric)", fontVariantNumeric: "tabular-nums" }}>
        {price.toLocaleString("ar-SA")}
      </span>
      <span style={{ fontSize: CURRENCY_SIZE[size], color: "var(--text-muted)", fontFamily: "var(--font-numeric)" }}>
        {currency}
      </span>
      {original !== undefined && original > price && (
        <span
          className="line-through"
          style={{ fontSize: ORIGINAL_SIZE[size], color: "var(--text-muted)", fontFamily: "var(--font-numeric)", fontVariantNumeric: "tabular-nums" }}
        >
          {original.toLocaleString("ar-SA")}
        </span>
      )}
    </div>
  )
);
PriceTag.displayName = "PriceTag";
