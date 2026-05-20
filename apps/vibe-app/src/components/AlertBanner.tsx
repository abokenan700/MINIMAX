import { useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

type Tone = "info" | "success" | "warning" | "error";

const TONE_STYLES: Record<Tone, { bg: string; border: string; text: string; icon: typeof Info }> = {
  info:    { bg: "var(--color-info-50)",    border: "var(--color-info-600)",    text: "var(--color-info-600)",    icon: Info },
  success: { bg: "var(--color-success-50)", border: "var(--color-success-600)", text: "var(--color-success-600)", icon: CheckCircle2 },
  warning: { bg: "var(--color-warning-50)", border: "var(--color-warning-600)", text: "var(--color-warning-600)", icon: AlertTriangle },
  error:   { bg: "var(--color-danger-50)",  border: "var(--color-danger-600)",  text: "var(--color-danger-600)",  icon: AlertCircle },
};

export interface AlertBannerProps {
  tone?: Tone;
  icon?: ReactNode;
  title?: string;
  children?: ReactNode;
  dismissible?: boolean;
  className?: string;
}

export function AlertBanner({ tone = "info", icon, title, children, dismissible = false, className }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const { bg, border, text, icon: DefaultIcon } = TONE_STYLES[tone];
  const resolvedIcon = icon ?? <DefaultIcon size={16} />;

  return (
    <div
      role="alert"
      dir="rtl"
      className={className}
      style={{
        display: "flex",
        gap: 10,
        alignItems: title && children ? "flex-start" : "center",
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: "var(--radius-md)",
        padding: "10px 12px",
        color: text,
        fontFamily: "var(--font-text)",
        fontSize: "var(--text-sm)",
      }}
    >
      <span style={{ flexShrink: 0, marginTop: title && children ? 1 : 0 }}>
        {resolvedIcon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <p style={{ fontWeight: 700, marginBottom: children ? 2 : 0 }}>{title}</p>
        )}
        {children && (
          <p style={{ opacity: 0.85 }}>{children}</p>
        )}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="إغلاق"
          style={{ background: "none", border: "none", cursor: "pointer", color: text, opacity: 0.7, padding: 2, flexShrink: 0 }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
