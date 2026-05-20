import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center justify-center font-bold leading-none select-none",
  {
    variants: {
      variant: {
        new:            "[background:var(--gradient-brand)] text-white",
        "discount-soft":"bg-[var(--color-brand-50)] text-[var(--color-brand-700)] border border-[rgba(194,65,12,0.15)]",
        "discount-hard":"bg-[var(--color-danger-600)] text-white",
        oos:            "bg-[rgba(0,0,0,0.55)] text-white",
        count:          "bg-[var(--color-danger-600)] text-white",
        info:           "bg-[var(--color-info-50)] text-[var(--color-info-600)]",
        warning:        "bg-[var(--color-warning-50)] text-[var(--color-warning-600)]",
        success:        "bg-[var(--color-success-50)] text-[var(--color-success-600)]",
      },
      size: {
        sm: "h-[18px] min-w-[18px] px-1 text-[10px] rounded-full",
        md: "h-[22px] min-w-[22px] px-1.5 text-[11px] rounded-full",
        count: "w-[14px] h-[14px] text-[8px] rounded-full p-0",
      },
    },
    defaultVariants: { variant: "new", size: "md" },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      style={{ fontFamily: "var(--font-numeric)", fontVariantNumeric: "tabular-nums" }}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
