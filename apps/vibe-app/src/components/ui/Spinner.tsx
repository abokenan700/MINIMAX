import { forwardRef, type HTMLAttributes } from "react";
import { Loader } from "lucide-react";
import { cn } from "../../lib/utils";

interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = { sm: 14, md: 18, lg: 24 } as const;

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = "md", className, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label="جارٍ التحميل"
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <Loader
        size={SIZE_MAP[size]}
        className="animate-spin text-current"
        strokeWidth={2}
      />
    </span>
  )
);
Spinner.displayName = "Spinner";
