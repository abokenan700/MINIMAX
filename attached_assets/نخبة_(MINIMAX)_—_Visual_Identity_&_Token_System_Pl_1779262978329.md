# نخبة (MINIMAX) — Visual Identity & Token System Plan v3.0

## TRACK DECISION
**HYBRID**

- Color architecture → **REBUILD**: brand tokens named `--gold-*` hold orange values — a critical identity lie that must be eliminated.
- Color values (orange #F97316 ↔ #EA580C) → **ELEVATE**: keep the hue family, refine to a 10-step accessible scale.
- Typography family (Tajawal only) → **REBUILD**: a luxury fashion store cannot ship one neutral mass-market Arabic typeface; pair an editorial display Arabic with a workhorse text Arabic.
- Type fluid `clamp()` scale → **ELEVATE**: keep approach, lock to a documented modular ratio.
- Spacing → **REBUILD**: no base grid currently exists; install 4-pt geometric scale.
- Shadow system → **ELEVATE**: 11 tokens are intentional; collapse duplicates and re-tune for a single luxury feel.
- Motion durations + easings → **ELEVATE**: keep; rename for clarity.
- Dark mode → **REBUILD**: two conflicting implementations (`prefers-color-scheme` AND `html.dark`) with different palettes — unify.
- Iconography → **REBUILD**: lucide-react used ad-hoc with no stroke/size policy.
- Semantic layer → **REBUILD**: brand, surface, feedback are mixed inside primitives.
- Radius scale → **ELEVATE**: keep 7 tokens, formalize use mapping.
- Mid-page promo dark navy gradient (`#1A1A2E → #16213E → #0F3460`) → **DELETE**: foreign to brand identity.

---

## 01 — Color System

DELETE: every token prefixed `--gold-*` — reason: token name lies about its value (orange ≠ gold).
DELETE: `--gold-warm`, `--gold-gradient-start`, `--accent`, `--accent-bg`, `--accent-light`, `--accent-text` — reason: redundant aliases of brand orange.
DELETE: `--bg-cta-dark = #F97316` — reason: misleading name, identical to primary.
DELETE: `--card-bg` (alias of `--bg-card`), `--text-price` (alias of `--text-primary`), `--bg-subtle` (alias of `--bg-surface-subtle`) — reason: synonyms.
DELETE: `--text-brand = #F97316` separate token — replace all uses with `--color-brand-600`.

REBUILD: brand scale — establish a 10-step orange ramp keyed to WCAG AA against `--color-surface-0`.
```
--color-brand-50:  #FFF7ED
--color-brand-100: #FFEDD5
--color-brand-200: #FED7AA
--color-brand-300: #FDBA74
--color-brand-400: #FB923C
--color-brand-500: #F97316   /* legacy primary */
--color-brand-600: #EA580C   /* default actionable */
--color-brand-700: #C2410C
--color-brand-800: #9A3412
--color-brand-900: #7C2D12
```
SET: `--color-brand-default = var(--color-brand-600)` — reason: 4.6:1 contrast on white vs 3.1:1 for 500; the storefront's body text-on-orange and orange-on-white usage requires 600 as the source of truth.

ESTABLISH: neutral scale — 11-step, warm-neutral biased toward champagne (luxury fashion signal).
```
--color-neutral-0:    #FFFFFF
--color-neutral-25:   #FBFAF8
--color-neutral-50:   #F6F4F0
--color-neutral-100:  #EDEAE3
--color-neutral-200:  #DCD7CC
--color-neutral-300:  #BFB8A8
--color-neutral-400:  #948C7C
--color-neutral-500:  #6A6256
--color-neutral-600:  #4A443B
--color-neutral-700:  #2E2A24
--color-neutral-900:  #0E0C09
```
REPLACE: `--text-primary #0F0F0F` → `var(--color-neutral-900) = #0E0C09` — reason: warm-neutral text harmonizes with brand orange where pure black goes dead.
REPLACE: `--text-secondary #3D3D3D` → `var(--color-neutral-600) = #4A443B`.
REPLACE: `--text-tertiary #6B6B6B` → `var(--color-neutral-500) = #6A6256`.
REPLACE: `--text-muted #9A9A9A` → `var(--color-neutral-400) = #948C7C`.
REPLACE: `--text-placeholder #BBBBBB` → `var(--color-neutral-300) = #BFB8A8`.
REPLACE: `--bg-page #FAFAFA` → `var(--color-neutral-25) = #FBFAF8` — reason: warmer page surface against pure white cards.
REPLACE: `--bg-surface-warm #FCFCFC` → `var(--color-neutral-25)`.
REPLACE: `--bg-surface-subtle #F7F7F7` → `var(--color-neutral-50) = #F6F4F0`.
REPLACE: `--bg-hover #F9F9F9` → `var(--color-neutral-50)`.
REPLACE: `--card-img-bg #FAFAFA` → `var(--color-neutral-50)`.
REPLACE: `--card-border rgba(0,0,0,0.07)` → `rgba(14,12,9,0.08)` — reason: warm-tinted hairline matches neutral system.
REPLACE: `--border-separator rgba(0,0,0,0.05)` → `rgba(14,12,9,0.06)`.
REPLACE: `--input-border rgba(0,0,0,0.12)` → `rgba(14,12,9,0.14)`.

ADD: deep brand accent — `--color-ink-luxury = #1A1410` — reason: replaces dead pure-black usage in CTAs, sticky bars, and editorial type for a leather-bound luxury feel.

REBUILD: feedback tokens — name semantically, not by feeling.
```
--color-success-600: #16A34A
--color-success-50:  #ECFDF3
--color-danger-600:  #DC2626
--color-danger-50:   #FEF2F2
--color-warning-600: #B45309
--color-warning-50:  #FFFBEB
--color-info-600:    #1D4ED8
--color-info-50:     #EFF6FF
```
REPLACE: `--success #16A34A` → `var(--color-success-600)`.
REPLACE: `--warning #D97706` → `var(--color-warning-600) = #B45309` — reason: D97706 collides visually with brand orange; warning must be amber-distinct.
DELETE: `--discount-bg`, `--discount-text` — replace usages with `var(--color-brand-50)` and `var(--color-brand-700)` respectively.

REBUILD: gradients — collapse 7 brand gradients into 2 canonical definitions.
```
--gradient-brand:        linear-gradient(135deg, #F97316 0%, #EA580C 100%)
--gradient-brand-hover:  linear-gradient(135deg, #FB923C 0%, #F97316 100%)
--gradient-surface-warm: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)
```
DELETE: `--gradient-cta`, `--gradient-cta-hover`, `--gradient-gold`, `--gradient-accent`, `--gradient-warm`, `--gradient-img-overlay` — replace all references with the 3 above.
DELETE: `--gradient-brand-text` — reason: gradient text on Arabic glyphs renders inconsistently on iOS WebKit at < 16px; replace `.header-brand-name` background-clip with `color: var(--color-brand-700)` and `letter-spacing: 0.18em`.

DELETE: mid-page navy gradient `linear-gradient(120deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)` in `.mid-promo-banner` — reason: foreign to identity; replace with `background: var(--color-ink-luxury)` and a top-right radial highlight `radial-gradient(circle at 88% 12%, rgba(249,115,22,0.22) 0%, transparent 55%)`.

ADD: focus ring token — `--color-focus-ring = rgba(234,88,12,0.45)` — apply universally via `:focus-visible { box-shadow: 0 0 0 3px var(--color-focus-ring); outline: none; }`.

ESTABLISH: contrast policy — every text/background pairing in tokens must declare WCAG ratio in a comment; minimum AA (4.5:1 body, 3:1 large).

---

## 02 — Typography System

DELETE: `--font-main: 'Tajawal', sans-serif` as the only typeface — reason: a luxury fashion brand cannot ship a single utility Arabic sans for both editorial display and UI text.

ESTABLISH: Arabic + Latin pairing — two families, three roles.
```
--font-display: 'Reem Kufi Fun', 'Reem Kufi', 'Tajawal', serif;
--font-text:    'IBM Plex Sans Arabic', 'Tajawal', system-ui, sans-serif;
--font-numeric: 'IBM Plex Sans Arabic', 'Inter Tight', system-ui, sans-serif;
```
- `--font-display`: hero banner titles, brand wordmark "نخبة", section section H1, price-lg.
- `--font-text`: all body, UI labels, buttons, navigation, captions.
- `--font-numeric`: prices, countdowns, badges, statistics — enable `font-variant-numeric: tabular-nums`.

ADD: load via `<link rel="preconnect" href="https://fonts.googleapis.com">` + `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Reem+Kufi+Fun:wght@500;600;700&display=swap">` inside `apps/vibe-app/index.html`.

REBUILD: type scale — replace ad-hoc `clamp()` set with documented modular scale (ratio 1.125 minor third on mobile, base 14px @ 360vw → 16px @ 430vw).
```
--text-2xs:  clamp(10.0px, 0.66rem + 0.10vw, 11.0px);   /* eyebrow, badges */
--text-xs:   clamp(11.5px, 0.74rem + 0.12vw, 12.5px);   /* meta, caption  */
--text-sm:   clamp(12.5px, 0.80rem + 0.18vw, 13.5px);   /* body small     */
--text-md:   clamp(14.0px, 0.88rem + 0.22vw, 15.0px);   /* body default   */
--text-lg:   clamp(15.5px, 0.96rem + 0.30vw, 17.0px);   /* subheading     */
--text-xl:   clamp(18.0px, 1.10rem + 0.45vw, 20.0px);   /* heading        */
--text-2xl:  clamp(21.0px, 1.28rem + 0.62vw, 24.0px);   /* section title  */
--text-3xl:  clamp(24.0px, 1.45rem + 0.85vw, 28.0px);   /* hero, price-lg */
--text-4xl:  clamp(30.0px, 1.80rem + 1.10vw, 36.0px);   /* display only   */
```
DELETE: `--text-base` and `--text-price-lg` — replace with `--text-md` and `--text-3xl` respectively.
DELETE: `--text-2xs: clamp(10px, 2.6vw, 11px)` viewport-only scaling — reason: causes Arabic glyph kerning instability at < 11px on Safari.

REBUILD: weight scale — restrict to 5 weights, ban arbitrary 800/900 spam.
```
--font-weight-light:    300
--font-weight-regular:  400
--font-weight-medium:   500
--font-weight-semibold: 600
--font-weight-bold:     700
```
REPLACE: all `font-weight: 800` / `font-weight: 900` declarations → `var(--font-weight-bold) = 700` — reason: Tajawal-900 and IBM Plex Arabic-900 are inconsistently available and degrade rendering.

ESTABLISH: line-height ramp — purposeful, not arbitrary.
```
--leading-tight:   1.15   /* display, banner titles */
--leading-snug:    1.30   /* headings              */
--leading-normal:  1.55   /* body Arabic           */
--leading-relaxed: 1.75   /* paragraphs > 3 lines  */
```
REPLACE: every hard-coded `line-height: 1.2 / 1.3 / 1.35 / 1.4 / 1.7` in `.deal-card-*`, `.trending-*`, `.banner-*` → the four tokens above.

ESTABLISH: tracking ramp — Arabic prefers neutral or slightly loose tracking.
```
--tracking-tight:  -0.2px   /* display only        */
--tracking-normal:  0
--tracking-wide:    0.3px   /* labels, eyebrows    */
--tracking-brand:   0.18em  /* wordmark "نخبة" only */
```
DELETE: `letter-spacing: 2.5px` on `.header-brand-name` → use `var(--tracking-brand)`.

REBUILD: semantic type roles — replace the 8 `.type-*` classes with 9 strictly-scoped roles.
```
.t-display    { font-family:var(--font-display); font-size:var(--text-4xl); font-weight:600; line-height:var(--leading-tight);   letter-spacing:var(--tracking-tight); }
.t-hero       { font-family:var(--font-display); font-size:var(--text-3xl); font-weight:600; line-height:var(--leading-tight);   letter-spacing:var(--tracking-tight); }
.t-section    { font-family:var(--font-display); font-size:var(--text-2xl); font-weight:600; line-height:var(--leading-snug); }
.t-heading    { font-family:var(--font-text);    font-size:var(--text-xl);  font-weight:600; line-height:var(--leading-snug); }
.t-subheading { font-family:var(--font-text);    font-size:var(--text-lg);  font-weight:600; line-height:var(--leading-snug); }
.t-body       { font-family:var(--font-text);    font-size:var(--text-md);  font-weight:400; line-height:var(--leading-normal); }
.t-body-sm    { font-family:var(--font-text);    font-size:var(--text-sm);  font-weight:400; line-height:var(--leading-normal); }
.t-caption    { font-family:var(--font-text);    font-size:var(--text-xs);  font-weight:400; line-height:var(--leading-normal); color:var(--color-neutral-500); }
.t-label      { font-family:var(--font-text);    font-size:var(--text-2xs); font-weight:600; line-height:1;                     letter-spacing:var(--tracking-wide); text-transform:uppercase; }
.t-price      { font-family:var(--font-numeric); font-size:var(--text-md);  font-weight:700; line-height:1; font-variant-numeric:tabular-nums; }
.t-price-lg   { font-family:var(--font-numeric); font-size:var(--text-3xl); font-weight:700; line-height:1; font-variant-numeric:tabular-nums; }
```

ADD: optical-sizing — `font-optical-sizing: auto;` on `html` for IBM Plex.
ADD: `text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased;` already exists — preserve.

---

## 03 — Spacing & Grid System

ESTABLISH: 4-pt base grid — every spacing, padding, margin, gap, icon-size, button-height MUST snap to a multiple of 4px. No exceptions.
```
--space-0:   0
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px   /* canonical layout gutter */
--space-5:   20px
--space-6:   24px
--space-7:   32px
--space-8:   40px
--space-9:   48px
--space-10:  56px
--space-11:  64px
--space-12:  80px
```
REPLACE: `padding: 0 14px` on `.header-bar` → `padding: 0 var(--space-4)` (16px) — reason: 14px is off-grid.
REPLACE: `padding: 12px 12px 10px` on `.categories-strip` → `padding: var(--space-3) var(--space-3) var(--space-3)`.
REPLACE: `padding: 11px 12px` on `.promo-banner-card` → `padding: var(--space-3) var(--space-4)`.
REPLACE: every off-grid value found in `index.css` (`5px`, `7px`, `9px`, `11px`, `13px`, `14px`, `18px`, `22px`, `28px`) → nearest grid-aligned token.

ESTABLISH: radii scale — re-tune for luxury fashion (slightly tighter than current).
```
--radius-xs:    4px
--radius-sm:    8px
--radius-md:    12px
--radius-lg:    16px
--radius-xl:    20px
--radius-2xl:   28px
--radius-pill:  9999px
```
REPLACE: `--radius-xs 0.375rem (6px)` → `4px`.
REPLACE: `--radius-sm 0.5rem (8px)` → `8px`.
REPLACE: `--radius-md 0.875rem (14px)` → `12px`.
REPLACE: `--radius-card 1rem (16px)` → `var(--radius-lg) = 16px`.
REPLACE: `--radius-lg 1.25rem (20px)` → `var(--radius-xl) = 20px`.
REPLACE: `--radius-xl 1.5rem (24px)` → `var(--radius-2xl) = 28px`.

ESTABLISH: layout container scale — app is mobile-first PWA.
```
--container-xs:   360px
--container-sm:   400px
--container-md:   430px   /* current --app-shell max-width */
--container-lg:   640px   /* tablet upgrade target */
--container-xl:   960px   /* future desktop bridge */
```
REPLACE: `max-width: 430px` hard-coded in `.app-shell` → `max-width: var(--container-md)`.

ESTABLISH: vertical rhythm — section padding policy.
- Hero / Banner block → `padding: var(--space-3) var(--space-3) var(--space-2)`.
- Standard section → `padding: var(--space-6) var(--space-4)`.
- Section title bottom margin → `var(--space-3)`.
- Inter-section divider → `var(--space-6)` vertical breathing.

REPLACE: bottom-nav height `--nav-h: 68px` → `64px` — reason: snaps to grid; current 68 is off-grid.
REPLACE: header height `--header-h: 62px` → `56px` — reason: 56 = `var(--space-11) - var(--space-2)` and meets iOS touch standard.

ESTABLISH: hit-target floor — every interactive element ≥ 40×40px. Audit `.deal-card-cart-btn` (currently 26×26) → wrap in 40×40 invisible hit area.
ESTABLISH: gap-from-screen-edge floor — never less than `var(--space-3) = 12px`.

---

## 04 — Elevation & Shadow System

REBUILD: 7-tier elevation ladder with intent — no more brand-tinted shadows mixed with neutral shadows under generic names.

```
/* Neutral ladder — for surfaces */
--elev-0:  none;
--elev-1:  0 1px 2px rgba(14,12,9,0.05);
--elev-2:  0 2px 4px rgba(14,12,9,0.06), 0 1px 2px rgba(14,12,9,0.04);
--elev-3:  0 4px 8px rgba(14,12,9,0.06), 0 2px 4px rgba(14,12,9,0.04);
--elev-4:  0 8px 16px rgba(14,12,9,0.08), 0 4px 8px rgba(14,12,9,0.05);
--elev-5:  0 16px 32px rgba(14,12,9,0.10), 0 6px 12px rgba(14,12,9,0.06);
--elev-6:  0 24px 64px rgba(14,12,9,0.14), 0 8px 16px rgba(14,12,9,0.08);

/* Brand glow ladder — for primary CTAs and brand highlights only */
--glow-brand-sm: 0 2px 6px rgba(234,88,12,0.22);
```

## 08 — Opportunities Beyond Current Scope

ADD: **brand-grade product card hover** — on `:hover`, fade in a 12-pixel inner border using `box-shadow: inset 0 0 0 1.5px var(--color-brand-300)` and reveal the wishlist button from `opacity: 0` → `1`; current cards have no premium reveal language.

ADD: **editorial banner type lockup** — large `.banner-title` should use `--font-display` (Reem Kufi Fun 600) with brand accent underline drawn via SVG, not the current generic Tajawal-900. This single change shifts perception from "marketplace" to "boutique."

ADD: **price-anchored discount typography** — display strikethrough original price + new price in a stacked layout with `--text-md` strikethrough above and `--text-3xl` final price below; current inline layout buries the headline.

ADD: **brand-tinted scroll containers** — replace hidden scrollbars on `.scroll-area` with a 4px wide custom scrollbar on hover, color `var(--color-brand-300)` track invisible. Desktop tablet upgrade preparation.

ADD: **product card 3-color swatch row** — surface available colors from `lib/colorMap.ts` as a 14px-circle row beneath the product name; currently the data exists but is invisible on the home grid.

ADD: **luxury empty-state language** — every empty state (cart, wishlist, search) gets a centered icon at 40px (`--icon-size-xl`), heading at `.t-heading`, body at `.t-body`, single primary action; no current standard exists.

ADD: **bottom-nav active-state indicator** — current active dot is generic; replace with a 28×3px pill bar above the active icon in `var(--color-brand-600)`, animated horizontal slide with `var(--ease-emphasized)`.

ADD: **product image art direction policy** — all hero and trending product images must be shot or sourced with 1:1 framing, neutral background (`#F2EFE9`–`#FFFFFF` range), and consistent shadow direction (light source upper-right at 20°). Document in `apps/vibe-app/public/ART_DIRECTION.md`.

ADD: **micro-interaction polish — currency glyph** — Saudi Riyal "ر س" should ship as an SVG glyph asset, not 2-character text, to avoid font fallback flicker; embed inline at 0.85em x-height.

ADD: **typography optical-balancing for RTL Arabic** — set `font-feature-settings: "kern" 1, "calt" 1, "ss01" 1;` on `html` for IBM Plex Sans Arabic to enable contextual alternates that significantly improve Arabic readability on mid-density text.

ADD: **brand "نخبة" wordmark vector logo** — replace current text + gradient hack in `.header-brand-name` with a hand-tuned SVG wordmark (kerning, ligature on خ+ب) exported at 21px nominal, scalable. Deliver as `public/brand/wordmark.svg`.

ADD: **introduce a single accent metallic** — add `--color-accent-bronze: #B8763E` for ultra-luxury moments (loyalty tier badges, gift wrap badge, premium seller mark). Strictly forbidden as a primary action color.

ADD: **section eyebrow tokens** — every section in the storefront should support an optional 11px uppercase eyebrow above the title (`.t-label` color `var(--text-tertiary)`); currently absent and adds magazine-grade editorial structure.

ADD: **establish 8-degree tilt token for hero composition** — `--rotation-editorial: -2deg` for promotional product crops on the hero banner; subtle, deliberate, signals editorial taste.

ADD: **enforce token via Stylelint** — install `stylelint` with `stylelint-declaration-strict-value` and configure `color-no-hex: true` rule across `apps/vibe-app/src/**/*.css` — guarantees no future hex leaks past the primitive layer.

ADD: **design tokens as JSON build artifact** — generate `apps/vibe-app/tokens/tokens.json` via Style Dictionary; consume from both CSS and React-Native (future native app target).

ADD: **introduce loyalty tier color tokens** — `--tier-silver #C0BCB1`, `--tier-gold #C49E5C`, `--tier-onyx #1A1410` — reserved for premium membership UI, currently absent but the catalog (Gucci, Dior, Chanel) demands tiering.

ADD: **launch a real "wow" moment** — on first add-to-cart of a session, fire the existing `confetti-fall` keyframe in a 6-particle burst from the cart icon using `var(--color-brand-300)` and `var(--color-accent-bronze)` particles. Single tasteful moment, not repeated.
