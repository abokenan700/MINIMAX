import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader } from "lucide-react";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 cursor-pointer select-none",
    "font-bold border-0 outline-none",
    "transition-[background-color,border-color,color,opacity,transform,box-shadow]",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.97]",
    "focus-visible:outline-2 focus-visible:outline-[var(--color-brand-500)] focus-visible:outline-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "text-white border-none",
          "[background:var(--gradient-brand)]",
          "[box-shadow:var(--shadow-btn)]",
          "hover:opacity-90",
        ].join(" "),

        outline: [
          "bg-transparent text-[var(--text-brand)]",
          "!border-[1.5px] !border-[var(--color-brand-500)]",
          "hover:bg-[var(--color-brand-50)]",
        ].join(" "),

        ghost: [
          "bg-transparent border-none text-[var(--color-brand-500)]",
          "rounded-full hover:bg-[var(--color-brand-50)]",
        ].join(" "),

        circle: [
          "rounded-full border-none text-white flex-shrink-0",
          "[background:var(--gradient-brand)]",
          "[box-shadow:var(--shadow-btn),inset_0_1px_0_rgba(255,255,255,0.18)]",
          "hover:opacity-90",
        ].join(" "),

        "circle-success": [
          "rounded-full border-none text-white flex-shrink-0",
          "[background:linear-gradient(135deg,var(--color-brand-500),var(--color-brand-500))]",
          "[box-shadow:var(--shadow-success)]",
        ].join(" "),

        "circle-dark": [
          "rounded-full border-none text-white flex-shrink-0",
          "[background:var(--gradient-brand)]",
        ].join(" "),

        "solid-gradient": [
          "rounded-full border-none text-white flex-shrink-0",
          "[background:var(--gradient-brand)]",
          "[box-shadow:var(--shadow-btn)]",
          "hover:opacity-90",
        ].join(" "),

        tab: [
          "rounded-full font-semibold",
          "bg-[var(--bg-card)] text-[var(--text-secondary)]",
          "!border !border-[var(--border-warm)]",
          "hover:bg-[var(--bg-surface-warm)]",
        ].join(" "),

        "tab-active": [
          "rounded-full font-semibold text-white border-none",
          "[background:var(--gradient-brand)]",
        ].join(" "),

        text: "bg-transparent border-none text-[var(--text-brand)] font-semibold p-0 active:scale-100 hover:opacity-75",

        accent: [
          "text-white border-none",
          "[background:var(--gradient-accent)]",
          "[box-shadow:var(--shadow-accent)]",
          "hover:opacity-90",
        ].join(" "),

        destructive: [
          "text-white border-none",
          "bg-[var(--color-danger-600)]",
          "[box-shadow:0_2px_6px_rgba(220,38,38,0.30)]",
          "hover:opacity-90",
        ].join(" "),

        success: [
          "text-white border-none",
          "bg-[var(--color-success-600)]",
          "hover:opacity-90",
        ].join(" "),
      },

      size: {
        "2xs": "text-[clamp(8.5px,2.3vw,10px)] px-2 py-0.5 rounded-full",
        xs:    "text-[clamp(9px,2.6vw,11px)] px-3 py-1 rounded-full",
        sm:    "text-[clamp(10px,2.8vw,12px)] px-3 py-[7px] rounded-[var(--radius-md)]",
        md:    "text-[clamp(12px,3.4vw,14px)] px-4 py-[11px] rounded-[var(--radius-md)]",
        lg:    "text-[clamp(13px,3.6vw,15px)] px-5 py-[14px] rounded-[var(--radius-md)]",
        "icon-sm": "w-8 h-8 min-w-8 min-h-8 rounded-full p-0",
        "icon-md": "w-9 h-9 min-w-9 min-h-9 rounded-full p-0",
        touch:     "min-w-[44px] min-h-[44px] rounded-full p-0",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, style, children, disabled, ...props }, ref) => {
    const isRTL = typeof document !== "undefined"
      ? document.documentElement.dir === "rtl"
      : true;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading ? "true" : undefined}
        className={cn(
          buttonVariants({ variant, size }),
          loading && "pointer-events-none opacity-90",
          className
        )}
        style={{ fontFamily: "var(--font-main)", ...style }}
        {...props}
      >
        {loading ? (
          <>
            <Loader size={16} className="animate-spin flex-shrink-0" />
            <span style={{ visibility: "hidden", position: "absolute" }}>{children}</span>
            <span aria-hidden="true" style={{ opacity: 0.5 }}>{children}</span>
          </>
        ) : (
          <>
            {isRTL ? rightIcon : leftIcon}
            {children}
            {isRTL ? leftIcon : rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
