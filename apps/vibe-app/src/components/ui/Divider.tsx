import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "gradient";
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = "horizontal", variant = "solid", className, style, ...props }, ref) => {
    const isH = orientation === "horizontal";

    const bgStyle =
      variant === "gradient"
        ? "linear-gradient(90deg, transparent, var(--border-warm), transparent)"
        : undefined;

    const borderStyle =
      variant === "dashed" ? "dashed" : variant === "solid" ? "solid" : undefined;

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(isH ? "w-full" : "self-stretch", className)}
        style={{
          ...(isH
            ? { height: 1, background: bgStyle ?? "var(--border-separator)", borderStyle: borderStyle ?? undefined }
            : { width: 1, background: bgStyle ?? "var(--border-separator)" }),
          flexShrink: 0,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Divider.displayName = "Divider";
