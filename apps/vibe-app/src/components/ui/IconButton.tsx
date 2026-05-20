import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-full flex-shrink-0",
    "cursor-pointer select-none transition-[background-color,color,opacity,transform,box-shadow]",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.94]",
    "focus-visible:outline-2 focus-visible:outline-[var(--color-brand-600)] focus-visible:outline-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        ghost:          "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-600)]",
        outline:        "bg-transparent border border-[var(--border-warm)] text-[var(--text-secondary)] hover:bg-[var(--color-brand-50)] hover:border-[var(--border-orange)] hover:text-[var(--color-brand-600)]",
        soft:           "bg-[var(--color-brand-50)] text-[var(--color-brand-600)] hover:bg-[var(--color-brand-100)]",
        solid:          "[background:var(--gradient-brand)] text-white [box-shadow:var(--shadow-btn)] hover:opacity-90",
        "solid-gradient":"[background:var(--gradient-brand)] text-white [box-shadow:var(--shadow-btn)] hover:opacity-90",
        danger:         "bg-[var(--color-danger-50)] text-[var(--color-danger-600)] hover:bg-[var(--color-danger-600)] hover:text-white",
      },
      size: {
        sm: "w-8 h-8 min-w-8 min-h-8",
        md: "w-9 h-9 min-w-9 min-h-9",
        lg: "w-11 h-11 min-w-11 min-h-11",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  }
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
IconButton.displayName = "IconButton";
