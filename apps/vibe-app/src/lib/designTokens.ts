/**
 * نخبة Visual Identity System v3.0
 * Brand:    #EA580C (brand-600) — 4.6:1 contrast on white, WCAG AA
 * Surface:  #FBFAF8 (neutral-25) — warm champagne page
 * Display:  Reem Kufi Fun · Text: IBM Plex Sans Arabic
 * Grid:     4-pt geometric base
 *
 * Use CSS vars in style={{}} instead of raw values:
 *   var(--color-brand-500), var(--text-brand), var(--font-display) ... etc
 */

/* ─── Brand Scale — 10-step orange ramp ─────────────────────────── */
export const BRAND_COLOR = {
  50:      "var(--color-brand-50)",
  100:     "var(--color-brand-100)",
  200:     "var(--color-brand-200)",
  300:     "var(--color-brand-300)",
  400:     "var(--color-brand-400)",
  500:     "var(--color-brand-500)",
  600:     "var(--color-brand-500)",   /* DEFAULT — 4.6:1 on white */
  700:     "var(--color-brand-700)",
  800:     "var(--color-brand-800)",
  900:     "var(--color-brand-900)",
  default: "var(--color-brand-default)",
} as const;

/* ─── Neutral Scale — warm champagne ────────────────────────────── */
export const NEUTRAL = {
  0:   "var(--color-neutral-0)",
  25:  "var(--color-neutral-25)",
  50:  "var(--color-neutral-50)",
  100: "var(--color-neutral-100)",
  200: "var(--color-neutral-200)",
  300: "var(--color-neutral-300)",
  400: "var(--color-neutral-400)",
  500: "var(--color-neutral-500)",
  600: "var(--color-neutral-600)",
  700: "var(--color-neutral-700)",
  900: "var(--color-neutral-900)",
} as const;

/* ─── Feedback ───────────────────────────────────────────────────── */
export const FEEDBACK = {
  success600: "var(--color-success-600)",
  success50:  "var(--color-success-50)",
  danger600:  "var(--color-danger-600)",
  danger50:   "var(--color-danger-50)",
  warning600: "var(--color-warning-600)",
  warning50:  "var(--color-warning-50)",
  info600:    "var(--color-info-600)",
  info50:     "var(--color-info-50)",
} as const;

/* ─── Luxury accents ─────────────────────────────────────────────── */
export const LUXURY = {
  ink:    "var(--color-ink-luxury)",     /* #1A1410 — warm near-black */
  bronze: "var(--color-accent-bronze)",  /* #B8763E — ultra-luxury moments ONLY */
} as const;

/* ─── Loyalty tiers ──────────────────────────────────────────────── */
export const TIER = {
  silver: "var(--tier-silver)",
  gold:   "var(--tier-gold)",
  onyx:   "var(--tier-onyx)",
} as const;

/* ─── Text hierarchy ─────────────────────────────────────────────── */
export const TEXT = {
  primary:     "var(--text-primary)",
  secondary:   "var(--text-secondary)",
  tertiary:    "var(--text-tertiary)",
  muted:       "var(--text-muted)",
  placeholder: "var(--text-placeholder)",
  brand:       "var(--text-brand)",
} as const;

/* ─── Surfaces ───────────────────────────────────────────────────── */
export const SURFACE = {
  body:          "var(--bg-body)",
  page:          "var(--bg-page)",
  card:          "var(--bg-card)",
  warm:          "var(--bg-surface-warm)",
  subtle:        "var(--bg-surface-subtle)",
  hover:         "var(--bg-hover)",
} as const;

/* ─── Gradients ──────────────────────────────────────────────────── */
export const GRADIENT = {
  brand:       "var(--gradient-brand)",
  brandHover:  "var(--gradient-brand-hover)",
  surfaceWarm: "var(--gradient-surface-warm)",
} as const;

/* ─── Typography families ────────────────────────────────────────── */
export const FONT = {
  display: "var(--font-display)",   /* Reem Kufi Fun — editorial */
  text:    "var(--font-text)",      /* IBM Plex Sans Arabic — UI */
  numeric: "var(--font-numeric)",   /* IBM Plex Sans Arabic — prices */
  main:    "var(--font-main)",      /* alias for font-text */
} as const;

/* ─── Type scale ─────────────────────────────────────────────────── */
export const FONT_SIZE = {
  "2xs": "var(--text-2xs)",
  xs:    "var(--text-xs)",
  sm:    "var(--text-sm)",
  md:    "var(--text-md)",
  lg:    "var(--text-lg)",
  xl:    "var(--text-xl)",
  "2xl": "var(--text-2xl)",
  "3xl": "var(--text-3xl)",
  "4xl": "var(--text-4xl)",
  base:     "var(--text-md)",        /* backward-compat */
  priceLg:  "var(--text-3xl)",       /* backward-compat */
} as const;

/* ─── Weight scale — 5 weights only ─────────────────────────────── */
export const WEIGHT = {
  light:    300,
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const;

/* ─── Line-height ramp ───────────────────────────────────────────── */
export const LEADING = {
  tight:   "var(--leading-tight)",
  snug:    "var(--leading-snug)",
  normal:  "var(--leading-normal)",
  relaxed: "var(--leading-relaxed)",
} as const;

/* ─── Letter-spacing ramp ────────────────────────────────────────── */
export const TRACKING = {
  tight:  "var(--tracking-tight)",
  normal: "var(--tracking-normal)",
  wide:   "var(--tracking-wide)",
  brand:  "var(--tracking-brand)",
} as const;

/* ─── 4-pt spacing grid ──────────────────────────────────────────── */
export const SPACING = {
  0:  "var(--space-0)",   /* 0 */
  1:  "var(--space-1)",   /* 4px */
  2:  "var(--space-2)",   /* 8px */
  3:  "var(--space-3)",   /* 12px */
  4:  "var(--space-4)",   /* 16px */
  5:  "var(--space-5)",   /* 20px */
  6:  "var(--space-6)",   /* 24px */
  7:  "var(--space-7)",   /* 32px */
  8:  "var(--space-8)",   /* 40px */
  9:  "var(--space-9)",   /* 48px */
  10: "var(--space-10)",  /* 56px */
  11: "var(--space-11)",  /* 64px */
  12: "var(--space-12)",  /* 80px */
  /* backward-compat named sizes */
  xs:  "var(--space-1)",
  sm:  "var(--space-2)",
  md:  "var(--space-4)",
  lg:  "var(--space-6)",
  xl:  "var(--space-7)",
  xxl: "var(--space-9)",
} as const;

/* ─── Border radius scale ────────────────────────────────────────── */
export const RADIUS = {
  xs:   "var(--radius-xs)",    /* 4px  */
  sm:   "var(--radius-sm)",    /* 8px  */
  md:   "var(--radius-md)",    /* 12px */
  lg:   "var(--radius-lg)",    /* 16px */
  card: "var(--radius-card)",  /* 16px */
  xl:   "var(--radius-xl)",    /* 20px */
  "2xl":"var(--radius-2xl)",   /* 28px */
  pill: "var(--radius-pill)",  /* 9999px */
  full: 9999,
} as const;

/* ─── Elevation ladder ───────────────────────────────────────────── */
export const ELEVATION = {
  0: "var(--elev-0)",
  1: "var(--elev-1)",
  2: "var(--elev-2)",
  3: "var(--elev-3)",
  4: "var(--elev-4)",
  5: "var(--elev-5)",
  6: "var(--elev-6)",
  brandSm: "var(--glow-brand-sm)",
} as const;

/* ─── Icon sizes ─────────────────────────────────────────────────── */
export const ICON_SIZE = {
  sm:  16,
  md:  20,
  lg:  24,
  xl:  40,   /* empty state icon */
} as const;

/* ─── Layout ─────────────────────────────────────────────────────── */
export const LAYOUT = {
  headerH:     "var(--header-h)",     /* 56px */
  navH:        "var(--nav-h)",        /* 64px */
  containerXs: "var(--container-xs)", /* 360px */
  containerSm: "var(--container-sm)", /* 400px */
  containerMd: "var(--container-md)", /* 430px */
  containerLg: "var(--container-lg)", /* 640px */
  containerXl: "var(--container-xl)", /* 960px */
} as const;

/* ─── Motion ─────────────────────────────────────────────────────── */
export const MOTION = {
  fast:       "var(--duration-fast)",
  base:       "var(--duration-base)",
  slow:       "var(--duration-slow)",
  easeOut:       "var(--ease-out)",
  easeStandard:  "var(--ease-standard)",
  easeSpring:    "var(--ease-spring)",
  easeSlide:     "var(--ease-slide)",
  easeSheet:     "var(--ease-sheet)",
  easeBounce:    "var(--ease-bounce)",
  easeEmphasized:"var(--ease-emphasized)",
} as const;

/* ─── Legacy compatibility shims ─────────────────────────────────── */
export const BRAND = {
  gold:         "var(--color-brand-500)",
  goldDark:     "var(--color-brand-500)",
  goldAccent:   "var(--color-brand-500)",
  goldLight:    "var(--color-brand-50)",
  goldMid:      "var(--color-brand-400)",
  gradientGold: "var(--gradient-brand)",
  gradientText: "var(--gradient-brand)",
  gradientCta:  "var(--gradient-brand)",
} as const;

export const SEMANTIC = {
  success:   "var(--color-success-600)",
  successBg: "var(--color-success-50)",
  error:     "var(--color-danger-600)",
  errorBg:   "var(--color-danger-50)",
  warning:   "var(--color-warning-600)",
  warningBg: "var(--color-warning-50)",
} as const;
