import { forwardRef, useState, type InputHTMLAttributes, type LabelHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

/* ─── InputBase ─────────────────────────────────────────────────── */
export interface InputBaseProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  suffix?: ReactNode;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  hasError?: boolean;
}

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(
  ({ icon, suffix, containerClassName, containerStyle, className, onFocus, onBlur, hasError, style, readOnly, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    const borderColor = hasError
      ? "var(--color-danger-600)"
      : focused
      ? "var(--color-brand-600)"
      : "var(--border-input)";

    const focusRing = hasError
      ? "rgba(220,38,38,0.18)"
      : "var(--color-brand-50)";

    return (
      <div
        className={cn("relative", containerClassName)}
        style={{
          borderRadius: "var(--radius-md)",
          border: `1.5px solid ${borderColor}`,
          background: readOnly ? "var(--bg-surface-subtle)" : props.disabled ? "var(--bg-surface-subtle)" : "var(--input-bg-soft)",
          transition: "border-color var(--duration-base) var(--ease-out)",
          boxShadow: focused ? `0 0 0 3px ${focusRing}` : "none",
          opacity: props.disabled ? 0.6 : 1,
          ...containerStyle,
        }}
      >
        {icon && (
          <span
            className="absolute inset-y-0 flex items-center pointer-events-none"
            style={{ insetInlineStart: 14 }}
          >
            {icon}
          </span>
        )}

        <input
          ref={ref}
          dir="rtl"
          readOnly={readOnly}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          className={cn(
            "w-full bg-transparent",
            "placeholder:text-[var(--text-muted)] text-[var(--text-primary)]",
            icon ? "ps-[44px]" : "ps-4",
            suffix ? "pe-10" : "pe-4",
            "py-[11px]",
            readOnly && "cursor-default text-[var(--text-secondary)]",
            className
          )}
          style={{
            fontFamily: "var(--font-main)",
            fontSize: "var(--text-base)",
            border: "none",
            outline: 0,
            boxSizing: "border-box",
            boxShadow: "none",
            WebkitAppearance: "none",
            WebkitTapHighlightColor: "transparent",
            minHeight: 44,
            ...style,
          }}
          {...props}
        />

        {suffix && (
          <span
            className="absolute inset-y-0 flex items-center"
            style={{ insetInlineEnd: 10 }}
          >
            {suffix}
          </span>
        )}
      </div>
    );
  }
);
InputBase.displayName = "InputBase";

/* ─── InputLabel ────────────────────────────────────────────────── */
export interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("block", className)}
      style={{
        fontFamily: "var(--font-text)",
        fontSize: 13,
        fontWeight: 600,
        color: "var(--text-secondary)",
        marginBottom: 6,
      }}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" style={{ color: "var(--color-danger-600)", marginInlineStart: 2 }}>
          *
        </span>
      )}
    </label>
  )
);
InputLabel.displayName = "InputLabel";

/* ─── InputError ────────────────────────────────────────────────── */
export interface InputErrorProps extends HTMLAttributes<HTMLParagraphElement> {}

export const InputError = forwardRef<HTMLParagraphElement, InputErrorProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      role="alert"
      className={cn("flex items-center gap-1", className)}
      style={{
        fontFamily: "var(--font-text)",
        fontSize: 12,
        color: "var(--color-danger-600)",
        marginTop: 4,
      }}
      {...props}
    >
      <AlertCircle size={12} style={{ flexShrink: 0 }} />
      <span>{children}</span>
    </p>
  )
);
InputError.displayName = "InputError";

/* ─── InputHelp ─────────────────────────────────────────────────── */
export interface InputHelpProps extends HTMLAttributes<HTMLParagraphElement> {}

export const InputHelp = forwardRef<HTMLParagraphElement, InputHelpProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(className)}
      style={{
        fontFamily: "var(--font-text)",
        fontSize: 11.5,
        color: "var(--text-muted)",
        marginTop: 4,
      }}
      {...props}
    >
      {children}
    </p>
  )
);
InputHelp.displayName = "InputHelp";

/* ─── FormField ─────────────────────────────────────────────────── */
export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  help?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, required, error, help, htmlFor, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col", className)} style={{ marginBottom: 12 }}>
      {label && (
        <InputLabel htmlFor={htmlFor} required={required}>
          {label}
        </InputLabel>
      )}
      {children}
      {error ? <InputError>{error}</InputError> : help ? <InputHelp>{help}</InputHelp> : null}
    </div>
  );
}

/* ─── Legacy Input alias (backward compat) ──────────────────────── */
export const Input = InputBase;
export type { InputBaseProps as InputProps };
