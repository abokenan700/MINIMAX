import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role"> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, checked, disabled, onChange, ...props }, ref) => {
    const switchId = id ?? `sw-${Math.random().toString(36).slice(2)}`;

    return (
      <label
        htmlFor={switchId}
        className={cn(
          "inline-flex items-center gap-2 cursor-pointer select-none",
          disabled && "opacity-40 pointer-events-none",
          className
        )}
      >
        <span className="relative inline-flex w-9 h-5 flex-shrink-0">
          <input
            ref={ref}
            id={switchId}
            type="checkbox"
            role="switch"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <span
            className={cn(
              "w-full h-full rounded-full",
              "bg-[var(--bg-surface-subtle)] peer-checked:bg-[var(--color-brand-600)]",
              "transition-[background-color] duration-200 ease-out",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--color-brand-600)] peer-focus-visible:outline-offset-2"
            )}
            aria-hidden="true"
          />
          <span
            className={cn(
              "absolute top-0.5 start-0.5 w-4 h-4 rounded-full bg-white shadow-sm",
              "transition-[transform] duration-200 ease-out",
              "peer-checked:translate-x-4"
            )}
            aria-hidden="true"
          />
        </span>
        {label && (
          <span style={{ fontFamily: "var(--font-text)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
            {label}
          </span>
        )}
      </label>
    );
  }
);
Switch.displayName = "Switch";
