import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Heart as HeartIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface HeartProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> {
  pressed?: boolean;
  size?: number;
}

export const Heart = forwardRef<HTMLButtonElement, HeartProps>(
  ({ pressed = false, size = 16, className, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="button"
      aria-pressed={pressed}
      aria-label={pressed ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center",
        "cursor-pointer border-none bg-transparent p-0",
        "transition-[transform,opacity] duration-[220ms]",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-brand-500)] focus-visible:outline-offset-2",
        "disabled:pointer-events-none disabled:opacity-40",
        "active:scale-95",
        className
      )}
      {...props}
    >
      <HeartIcon
        size={size}
        strokeWidth={pressed ? 0 : 2}
        className={pressed ? "heart-pop" : ""}
        style={{
          fill: pressed ? "var(--color-brand-500)" : "none",
          stroke: "var(--color-brand-500)",
          transition: "fill 220ms var(--ease-spring), stroke 220ms var(--ease-spring)",
        }}
      />
    </button>
  )
);
Heart.displayName = "Heart";
