import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const chipVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-full font-medium select-none",
    "transition-[background-color,border-color,color] duration-150",
    "focus-visible:outline-2 focus-visible:outline-[var(--color-brand-600)] focus-visible:outline-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
  ].join(" "),
  {
    variants: {
      variant: {
        outline: "bg-transparent border border-[var(--border-warm)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-subtle)] hover:border-[var(--border-orange)] hover:text-[var(--text-brand)]",
        solid:   "[background:var(--gradient-brand)] text-white border border-transparent",
        active:  "bg-[var(--color-brand-50)] border border-[var(--color-brand-600)] text-[var(--text-brand)]",
      },
      size: {
        xs: "h-6 px-2 text-[10px]",
        sm: "h-7 px-2.5 text-[11px]",
        md: "h-8 px-3 text-[12px]",
      },
    },
    defaultVariants: { variant: "outline", size: "sm" },
  }
);

export interface ChipProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  onClose?: () => void;
  leftIcon?: ReactNode;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, size, onClose, leftIcon, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(chipVariants({ variant, size }), className)}
      style={{ fontFamily: "var(--font-text)" }}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {onClose && (
        <span
          role="button"
          aria-label="إزالة"
          tabIndex={-1}
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="flex-shrink-0 opacity-60 hover:opacity-100 cursor-pointer"
        >
          <X size={10} />
        </span>
      )}
    </button>
  )
);
Chip.displayName = "Chip";
