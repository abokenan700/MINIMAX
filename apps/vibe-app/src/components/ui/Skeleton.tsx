import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circle" | "rect" | "card";
  width?: number | string;
  height?: number | string;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "rect", width, height, className, style, ...props }, ref) => {
    const base = "animate-pulse bg-[var(--bg-surface-subtle)] skeleton";

    const variantClass = {
      text:   "rounded h-3",
      circle: "rounded-full",
      rect:   "rounded-[var(--radius-sm)]",
      card:   "rounded-[var(--radius-card)]",
    }[variant];

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(base, variantClass, className)}
        style={{ width, height, ...style }}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export function ProductCardSkeleton() {
  return (
    <div
      className="overflow-hidden"
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "var(--radius-card)" }}
    >
      <Skeleton variant="rect" style={{ aspectRatio: "1/1" }} />
      <div style={{ height: 1, background: "var(--border-separator)" }} />
      <div className="px-2 pt-2 pb-2.5 flex flex-col gap-2">
        <Skeleton variant="text" width="45%" />
        <Skeleton variant="text" width="82%" height={12} />
        <Skeleton variant="text" width="55%" />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
    </div>
  );
}
