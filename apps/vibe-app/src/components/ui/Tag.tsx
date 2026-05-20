import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-semibold leading-none select-none pointer-events-none",
  {
    variants: {
      tone: {
        info:    "bg-[var(--color-info-50)] text-[var(--color-info-600)]",
        warning: "bg-[var(--color-warning-50)] text-[var(--color-warning-600)]",
        danger:  "bg-[var(--color-danger-50)] text-[var(--color-danger-600)]",
        success: "bg-[var(--color-success-50)] text-[var(--color-success-600)]",
        neutral: "bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)]",
      },
      size: {
        xs: "h-5 px-1.5 text-[10px]",
        sm: "h-[22px] px-2 text-[11px]",
        md: "h-6 px-2.5 text-[12px]",
      },
    },
    defaultVariants: { tone: "neutral", size: "sm" },
  }
);

export interface TagProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ className, tone, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(tagVariants({ tone, size }), className)}
      style={{ fontFamily: "var(--font-text)" }}
      {...props}
    />
  )
);
Tag.displayName = "Tag";
