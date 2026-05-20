import { forwardRef, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, checked, onChange, disabled, ...props }, ref) => {
    const checkId = id ?? `chk-${Math.random().toString(36).slice(2)}`;

    return (
      <label
        htmlFor={checkId}
        className={cn(
          "inline-flex items-center gap-2 cursor-pointer select-none",
          disabled && "opacity-40 pointer-events-none",
          className
        )}
      >
        <span className="relative inline-flex flex-shrink-0">
          <input
            ref={ref}
            id={checkId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <span
            className={cn(
              "w-5 h-5 rounded flex items-center justify-center flex-shrink-0",
              "border-2 border-[var(--border-input)] bg-white",
              "transition-[background-color,border-color] duration-150",
              "peer-checked:bg-[var(--color-brand-600)] peer-checked:border-[var(--color-brand-600)]",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--color-brand-600)] peer-focus-visible:outline-offset-2",
              "peer-focus-visible:[box-shadow:0_0_0_3px_var(--color-brand-50)]"
            )}
            aria-hidden="true"
          >
            {checked && <Check size={12} strokeWidth={3} style={{ color: "#fff" }} />}
          </span>
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
Checkbox.displayName = "Checkbox";
