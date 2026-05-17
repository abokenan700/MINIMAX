/**
 * نخبة Visual Identity
 * Palette: #F97316 (orange) · #FFFFFF (white) · #111111 (text)
 * Semantic: #16A34A (success) · #DC2626 (error) · #D97706 (warning)
 *
 * استخدم CSS vars في style={{}} بدلاً من القيم المباشرة:
 *   var(--gold), var(--text-brand), var(--accent) ... إلخ
 */

export const BRAND = {
  gold:          "var(--gold)",              /* #F97316 — bright orange */
  goldDark:      "var(--gold-dark)",         /* #EA580C — darker orange */
  goldAccent:    "var(--gold-accent)",       /* #EA580C */
  goldLight:     "var(--gold-light)",        /* #FFF7F0 — pale orange tint */
  goldMid:       "var(--gold-mid)",          /* #FB923C — mid orange */
  gradientGold:  "var(--gradient-gold)",     /* #F97316 → #EA580C */
  gradientText:  "var(--gradient-brand-text)",
  gradientCta:   "var(--gradient-cta)",      /* #F97316 → #EA580C */
} as const;

export const ACCENT = {
  main:    "var(--accent)",       /* #F97316 — urgency / discount / alert */
  bg:      "var(--accent-bg)",    /* #FFF7F0 */
  light:   "var(--accent-light)", /* #FFF3E8 */
  text:    "var(--accent-text)",  /* #EA580C */
} as const;

export const TEXT = {
  primary:   "var(--text-primary)",   /* #111111 */
  secondary: "var(--text-secondary)", /* #444444 */
  muted:     "var(--text-muted)",     /* #888888 */
  price:     "var(--text-price)",     /* #111111 */
  brand:     "var(--text-brand)",     /* #F97316 */
} as const;

export const SURFACE = {
  page:    "var(--bg-page)",           /* #FFFFFF */
  card:    "var(--bg-card)",           /* #FFFFFF */
  warm:    "var(--bg-surface-warm)",   /* #FAFAFA */
  subtle:  "var(--bg-surface-subtle)", /* #F5F5F5 */
  bgSubtle:"var(--bg-subtle)",         /* #F8F8F8 */
  ctaDark: "var(--bg-cta-dark)",       /* #F97316 — orange, not dark! */
} as const;

export const SEMANTIC = {
  success:    "var(--success)",    /* #16A34A */
  successBg:  "var(--success-bg)", /* #F0FDF4 */
  error:      "var(--error)",      /* #DC2626 */
  errorBg:    "var(--error-bg)",   /* #FEF2F2 */
  warning:    "var(--warning)",    /* #D97706 */
  warningBg:  "var(--warning-bg)", /* #FFFBEB */
} as const;

export const RADIUS = {
  sm:   "var(--radius-sm)",    /* 8px  */
  md:   "var(--radius-md)",    /* 14px */
  lg:   "var(--radius-lg)",    /* 20px */
  card: "var(--radius-card)",  /* 16px */
  xl:   "var(--radius-xl)",    /* 24px */
  full: 9999,
} as const;

export const ICON_SIZE = {
  xs:  12,
  sm:  16,
  md:  20,
  lg:  24,
  xl:  28,
  xxl: 36,
} as const;

export const FONT_SIZE = {
  "2xs": "var(--text-2xs)",  /* clamp(10px, 2.6vw, 11px) */
  xs:    "var(--text-xs)",   /* clamp(11px, 3vw,   12.5px) */
  sm:    "var(--text-sm)",   /* clamp(12px, 3.2vw, 13.5px) */
  base:  "var(--text-base)", /* clamp(13.5px, 3.8vw, 15px) */
  lg:    "var(--text-lg)",   /* clamp(15px, 4.2vw, 17px) */
  xl:    "var(--text-xl)",   /* clamp(19px, 5.5vw, 23px) */
  priceLg: "var(--text-price-lg)", /* clamp(24px, 7vw, 29px) */
} as const;

export const SPACING = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
} as const;

export const WEIGHT = {
  regular:   400,
  medium:    500,
  semibold:  600,
  bold:      700,
  extrabold: 800,
  black:     900,
} as const;

/** Motion — 3 canonical speeds */
export const MOTION = {
  fast:   "var(--duration-fast)",  /* 0.15s */
  base:   "var(--duration-base)",  /* 0.28s */
  slow:   "var(--duration-slow)",  /* 0.50s */
  easeOut:    "var(--ease-out)",
  easeSpring: "var(--ease-spring)",
  easeSlide:  "var(--ease-slide)",
} as const;
