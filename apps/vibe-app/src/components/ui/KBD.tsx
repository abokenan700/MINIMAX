import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface KBDProps extends HTMLAttributes<HTMLElement> {}

export const KBD = forwardRef<HTMLElement, KBDProps>(
  ({ className, children, ...props }, ref) => (
    <kbd
      ref={ref as React.Ref<HTMLElement>}
      className={cn(
        "inline-flex items-center justify-center px-1.5 py-0.5 rounded",
        "border border-[var(--border-warm)] bg-[var(--bg-surface-subtle)]",
        "text-[10px] font-semibold text-[var(--text-secondary)] leading-none",
        className
      )}
      style={{ fontFamily: "var(--font-text)" }}
      {...props}
    >
      {children}
    </kbd>
  )
);
KBD.displayName = "KBD";
