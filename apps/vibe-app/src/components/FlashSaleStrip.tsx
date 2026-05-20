import { memo } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { Flame } from "lucide-react";
import { useLocation } from "wouter";

const FLASH_SESSION_KEY = "nakhba_flash_end_ms";

function getFlashEndMs(): number {
  try {
    const stored = sessionStorage.getItem(FLASH_SESSION_KEY);
    if (stored) return Number(stored);
    const end = Date.now() + (1 * 3600 + 47 * 60 + 22) * 1000;
    sessionStorage.setItem(FLASH_SESSION_KEY, String(end));
    return end;
  } catch {
    return Date.now() + (1 * 3600 + 47 * 60 + 22) * 1000;
  }
}

const FLASH_END_MS = getFlashEndMs();

const FlashCountdown = memo(function FlashCountdown() {
  const raw = useCountdown(FLASH_END_MS);
  const parts = raw.split(" : ");
  return (
    <div className="flex items-center gap-1" dir="ltr">
      {parts.map((p, i) => (
        <span key={i} className="flash-digit">{p}</span>
      ))}
    </div>
  );
});

export function FlashSaleStrip() {
  const [, navigate] = useLocation();

  return (
    <div
      className="flash-sale-strip"
      onClick={() => navigate("/categories")}
      role="button"
      aria-label="انتقل إلى عروض اليوم"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate("/categories")}
    >
      {/* Animated shimmer layer */}
      <div className="flash-shimmer" aria-hidden="true" />

      {/* Left: label */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flash-icon-wrap">
          <Flame size={14} strokeWidth={2.5} className="fill-white stroke-white" />
        </div>
        <div className="flex flex-col leading-none gap-0.5">
          <span className="flash-title">عروض</span>
          <span className="flash-subtitle">أسعار لن تتكرر</span>
        </div>
      </div>

      {/* Center: countdown */}
      <div className="flex items-center gap-1.5">
        <span className="flash-ends-label">ينتهي</span>
        <FlashCountdown />
      </div>

      {/* Right: CTA */}
      <div className="flash-cta-btn" aria-hidden="true">
        <span>اكتشف</span>
      </div>
    </div>
  );
}
