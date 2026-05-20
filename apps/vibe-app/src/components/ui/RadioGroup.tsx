import { forwardRef, type HTMLAttributes, type InputHTMLAttributes, useRef } from "react";
import { cn } from "../../lib/utils";

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, checked, disabled, ...props }, ref) => {
    const radioId = id ?? `radio-${Math.random().toString(36).slice(2)}`;

    return (
      <label
        htmlFor={radioId}
        className={cn(
          "inline-flex items-center gap-2 cursor-pointer select-none",
          disabled && "opacity-40 pointer-events-none",
          className
        )}
      >
        <span className="relative inline-flex flex-shrink-0 w-[18px] h-[18px]">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            checked={checked}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <span
            className={cn(
              "w-full h-full rounded-full border-2 border-[var(--border-input)] bg-white",
              "flex items-center justify-center",
              "transition-[border-color] duration-150",
              "peer-checked:border-[var(--color-brand-500)]",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--color-brand-500)] peer-focus-visible:outline-offset-2"
            )}
            aria-hidden="true"
          >
            {checked && (
              <span
                style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-brand-500)" }}
              />
            )}
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
Radio.displayName = "Radio";

interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, label, children, onKeyDown, ...props }, ref) => {
    const groupRef = useRef<HTMLDivElement>(null);

    function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
      const radios = Array.from(
        (groupRef.current ?? e.currentTarget).querySelectorAll<HTMLInputElement>("input[type=radio]:not([disabled])")
      );
      const idx = radios.findIndex(r => r === document.activeElement || r.checked);
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = radios[(idx + 1) % radios.length];
        next?.click(); next?.focus();
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = radios[(idx - 1 + radios.length) % radios.length];
        prev?.click(); prev?.focus();
      }
      onKeyDown?.(e);
    }

    return (
      <div
        ref={(el) => { (groupRef as React.MutableRefObject<HTMLDivElement | null>).current = el; if (typeof ref === "function") ref(el); else if (ref) ref.current = el; }}
        role="radiogroup"
        aria-label={label}
        className={cn("flex flex-col gap-2", className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";
