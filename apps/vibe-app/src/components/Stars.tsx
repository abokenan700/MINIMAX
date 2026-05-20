import { useState } from "react";
import { Star } from "lucide-react";

interface StarsProps {
  rating: number;
  size?: number;
  editable?: boolean;
  onChange?: (n: number) => void;
}

export function Stars({ rating, size = 12, editable = false, onChange }: StarsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayRating = hovered ?? rating;
  const full = Math.floor(displayRating);
  const half = displayRating - full >= 0.5;

  if (!editable) {
    return (
      <div className="flex items-center gap-0.5" aria-label={`تقييم ${rating} من 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            strokeWidth={1.4}
            style={{
              fill: i <= full ? "var(--color-brand-600)" : i === full + 1 && half ? "rgba(192,168,130,0.55)" : "none",
              stroke: i <= full || (i === full + 1 && half) ? "var(--color-brand-600)" : "var(--border-warm)",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="التقييم"
      className="flex items-center gap-0.5"
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={i === Math.round(rating)}
          aria-label={`${i} نجمة`}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => setHovered(i)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") { e.preventDefault(); onChange?.(Math.min(5, Math.round(rating) + 1)); }
            if (e.key === "ArrowRight") { e.preventDefault(); onChange?.(Math.max(1, Math.round(rating) - 1)); }
          }}
          className="p-0.5 bg-transparent border-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-brand-600)] rounded"
        >
          <Star
            size={size + 2}
            strokeWidth={1.4}
            style={{
              fill: i <= full ? "var(--color-brand-600)" : "none",
              stroke: i <= full ? "var(--color-brand-600)" : "var(--border-warm)",
              transition: "fill 100ms ease, stroke 100ms ease",
            }}
          />
        </button>
      ))}
    </div>
  );
}
