import type { ReactNode } from "react";
import { Button } from "./ui/Button";

export interface EmptyStateProps {
  illustration?: ReactNode;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ illustration, title, description, primaryAction }: EmptyStateProps) {
  return (
    <div
      dir="rtl"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        gap: 12,
      }}
    >
      {illustration && (
        <div style={{ marginBottom: 4, opacity: 0.7 }}>
          {illustration}
        </div>
      )}
      <p style={{
        fontFamily: "var(--font-text)",
        fontSize: "var(--text-lg)",
        fontWeight: 700,
        color: "var(--text-secondary)",
        lineHeight: "var(--leading-snug)",
      }}>
        {title}
      </p>
      {description && (
        <p style={{
          fontFamily: "var(--font-text)",
          fontSize: "var(--text-sm)",
          color: "var(--text-muted)",
          lineHeight: "var(--leading-normal)",
          maxWidth: 260,
        }}>
          {description}
        </p>
      )}
      {primaryAction && (
        <Button
          variant="primary"
          size="md"
          onClick={primaryAction.onClick}
          style={{ marginTop: 8 }}
        >
          {primaryAction.label}
        </Button>
      )}
    </div>
  );
}
