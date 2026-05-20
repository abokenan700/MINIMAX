/**
 * CartConfetti — 6-particle burst on first add-to-cart of session.
 * Fires confetti-fall keyframe (defined in index.css).
 * Brand particles: --color-brand-300 + --color-accent-bronze
 */

const PARTICLES = [
  { color: "var(--color-brand-300)",   size: 6,  x: -20, delay: 0.00, rot: 0,   round: true  },
  { color: "var(--color-accent-bronze)",size: 5, x: -8,  delay: 0.04, rot: 45,  round: false },
  { color: "var(--color-brand-400)",   size: 7,  x:  4,  delay: 0.02, rot: 90,  round: true  },
  { color: "var(--color-accent-bronze)",size: 4, x: 16,  delay: 0.06, rot: 135, round: false },
  { color: "var(--color-brand-300)",   size: 5,  x: -14, delay: 0.08, rot: 60,  round: true  },
  { color: "#fff",                     size: 4,  x:  10, delay: 0.03, rot: 20,  round: false },
];

interface CartConfettiProps {
  active: boolean;
}

export function CartConfetti({ active }: CartConfettiProps) {
  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 50,
      }}
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="confetti-fall"
          style={{
            left: `calc(50% + ${p.x}px)`,
            top: 0,
            width: p.size,
            height: p.size,
            borderRadius: p.round ? "50%" : "2px",
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: "1.4s",
            transform: `rotate(${p.rot}deg)`,
            boxShadow: `0 1px 4px rgba(0,0,0,0.18)`,
          }}
        />
      ))}
    </div>
  );
}
