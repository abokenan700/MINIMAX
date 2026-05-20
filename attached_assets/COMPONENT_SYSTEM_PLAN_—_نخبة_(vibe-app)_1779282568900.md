# COMPONENT SYSTEM PLAN — نخبة (vibe-app)

## TRACK DECISION
HYBRID
- Atoms: REBUILD — only Button is production-grade; Input/Stars/CartButton/Heart-toggle/Badge/Chip are missing or hardcoded
- Molecules: ELEVATE — DealCard, FeaturedCard, SearchBar, SectionHeader, StickyBuyBar, AccountSheet exist but duplicate logic; unify via shared atoms
- Organisms: ELEVATE — Header, BottomNav, FilterSheet, QuickViewSheet are intentional; harden states only
- States/Behaviors: REBUILD — hover/focus/disabled/loading/empty are missing on ~70% of interactive elements
- Tokens: KEEP — `designTokens.ts` + CSS vars are strong; forbid all hardcoded colors below

---

## 01 — Atoms

DELETE: hardcoded color literals across all `.tsx` — `#F97316`, `#EA580C`, `#EF4444`, `#1877F2`, `#16A34A`, `#DC2626`, `#22C55E`, `#FB923C`, `#C2410C`, `#FFF7F0`, `#F5EDE0`, `#FEF0EE`, `#FECACA`, `#DCFCE7`, `#BBF7D0`, `#E8E4DE`, `#E2DDD6`, `#D4CFC9`, `#888`, `#444`, `#1A1814` → REPLACE with `var(--gold)`, `var(--gold-accent)`, `var(--error)`, `var(--success)`, `var(--text-*)`, `var(--border-*)`, `var(--*-bg)` from `designTokens.ts`.

KEEP: `ui/Button.tsx` — cva variants, focus-visible ring, `active:scale-[0.97]`, disabled state. PRODUCTION-GRADE.

ADD: variant `Button/destructive` — `background:var(--error)`, `color:#fff`, `hover:opacity-0.9`, `[box-shadow:0_2px_6px_rgba(220,38,38,0.30)]`.
ADD: variant `Button/success` — `background:var(--success)`, `color:#fff`.
ADD: prop `loading?: boolean` on Button — render `<Loader size={16} className="animate-spin"/>` left, set `aria-busy="true"`, `pointer-events-none`, `opacity:0.9`; freeze label width to prevent layout shift.
ADD: prop `leftIcon?` / `rightIcon?` on Button — RTL-aware via `flex-row-reverse` when `dir==="rtl"`.

REBUILD: `ui/Input.tsx` — current API only exposes icon/suffix. SPLIT into:
- `InputBase` — atom, no label/error, height 44px, `border:1.5px solid var(--border-input)`, `focus:border:var(--gold)`, `focus:ring:0_0_0_3px_var(--gold-pale)`, `disabled:bg:var(--bg-surface-subtle) opacity-0.6 cursor-not-allowed`.
- `InputLabel` — `font-size:13px font-weight:600 color:var(--text-secondary) margin-bottom:6px`. Required → red asterisk after label.
- `InputError` — `role="alert" font-size:12px color:var(--error)` with `<AlertCircle size={12}/>` left; replaces emoji `⚠️` everywhere.
- `InputHelp` — `font-size:11.5px color:var(--text-muted) margin-top:4px`.
- `FormField` — composes Label + InputBase + (Error|Help). Single component used by AccountSheet/EditProfile/AddressBook/Checkout.

ADD: `Checkbox` atom — 20×20px, `border:2px solid var(--border-input)`, checked → `bg:var(--gold border:var(--gold)`, `<Check size={12}/>` inside, `focus-visible:ring:3px var(--gold-pale)`. REPLACE the inline checkbox in `AccountSheet.tsx:497-505`.

ADD: `RadioGroup` + `Radio` atom — 18px circle, checked dot 8px `bg:var(--gold)`, keyboard `ArrowLeft/Right`, ARIA `role="radiogroup"`.

ADD: `Switch` atom — track 36×20px, thumb 16×16, `bg:var(--bg-surface-subtle)` off → `var(--gold)` on, `transition:200ms var(--ease-out)`.

ADD: `Badge` atom — sizes `sm=18px / md=22px`, variants `new` (`bg:var(--gradient-cta) color:#fff`) / `discount-soft` (`bg:var(--discount-bg) color:var(--discount-text)`) / `discount-hard` (`bg:var(--error) color:#fff`) / `oos` (`bg:rgba(0,0,0,0.55) color:#fff`) / `count` (`bg:var(--error) color:#fff` 14×14 used in Header cart + BottomNav cart). REPLACE inline badges in: DealCard, FeaturedCard:42-65, QuickViewSheet:129-145, Header:84-87, BottomNav:241-251.

ADD: `Chip` atom — pill, size `xs=24px / sm=28px / md=32px`, variants `outline` / `solid` / `active` (gold-pale bg + gold border + brand text), with optional close `<X size={10}/>`. REPLACE all repeated chips in: SearchBar trending row, SearchFilters ALL_BRANDS/ALL_SIZES/discountOptions/ratingOptions, ControlsBar active chips.

ADD: `Avatar` atom — sizes `xs=24 / sm=32 / md=40 / lg=56 / xl=80`, fallback = first letter on `bg:var(--gradient-cta) color:#fff font-weight:700`, image fallback on error. REPLACE inline avatar in `Header.tsx:106-109`.

ADD: `IconButton` atom — sizes `sm=32 / md=36 / lg=44` (44 = WCAG min touch), variants `ghost / outline / soft / solid`, RTL safe, `aria-label` required (lint rule). REPLACE: `Header header-icon-btn`, wishlist heart buttons in DealCard:48-58 / FeaturedCard:65-75 / QuickViewSheet:147-165 / StickyBuyBar:23-26, quick-view btn FeaturedCard:88-114.

ADD: `Spinner` atom — sizes `sm=14 / md=18 / lg=24`, uses `lucide:Loader` + `animate-spin`. REPLACE every inline `<Loader … className="animate-spin" />`.

ADD: `Divider` atom — orientations `horizontal | vertical`, variants `solid | dashed | gradient`, `color:var(--border)` default. REPLACE every 1px inline `<div>` divider (Header:53, DealCard:62, FeaturedCard:125, AccountSheet:434-440, ProductDetail dividers).

ADD: `PriceTag` atom — props `{price, original?, currency='ر.س', size='sm'|'md'|'lg'|'xl', layout='inline'|'stacked'}`. Renders: bold price + small currency + strikethrough original. REPLACE the 5 duplicate price renderings in DealCard:114-117, FeaturedCard:183-194, QuickViewSheet:219-237, StickyBuyBar:42-44, ProductDetailPage.

ADD: `Stars` interactive mode — current `Stars` is read-only. ADD `editable?: boolean`, `onChange?: (n:number)=>void`, hover preview, `role="radiogroup"` semantics, half-star ARIA value.

ADD: `Heart` atom (Wishlist toggle) — 28×28 IconButton, `aria-pressed`, `pop` animation on toggle (`scale 1→1.25→1` 220ms `var(--ease-spring)`). Single component replaces 4 duplicates.

ADD: `Skeleton` atom — variants `text | circle | rect | card`, shimmer `linear-gradient(90deg,var(--bg-surface-warm) 25%,var(--bg-surface-subtle) 50%,var(--bg-surface-warm) 75%)` `animation:shimmer 1.4s linear infinite`.

ADD: `Tag` atom — non-interactive label (e.g., "تبقّى 3 فقط", "نفذ المخزون"). Variants `info / warning / danger / success / neutral`. REPLACE the four duplicate stock labels in StickyBuyBar:29-41 and any inline status text.

ADD: `KBD` atom — for keyboard hints (e.g., "Esc لإغلاق").

DELETE: `ui/index.ts` — re-export all atoms above (Button, IconButton, FormField, InputBase, InputLabel, InputError, Checkbox, Radio, Switch, Badge, Chip, Avatar, Spinner, Divider, PriceTag, Stars, Heart, Skeleton, Tag, Tag, OTPInput, PasswordStrength).

STANDARDIZE: every atom — `forwardRef`, `displayName`, `className` merge via `cn()`, `data-*` pass-through, `aria-*` whitelist, `type="button"` default on `<button>`.

---

## 02 — Molecules

REBUILD: `CartButton.tsx` — currently hardcodes `#F97316`/`#EA580C` and duplicates Button `circle`. REWRITE as composition: `<IconButton variant="solid-gradient" size={size==='sm'?'sm':'md'} loading={pending} success={added}>` — single source for cart-add interaction.

MERGE: `DealCard` + `FeaturedCard` — 80% shared anatomy. Define `ProductCard` with prop `layout="horizontal"|"vertical"` and `density="compact"|"comfortable"`. Shared sub-parts:
- `ProductCard.Media` — image + Badge stack (top-left) + Heart (top-right) + QuickView (bottom-left)
- `ProductCard.Brand` — Brand text + ColorSwatchRow
- `ProductCard.Title` — line-clamp 1 (compact) / 2 (comfortable)
- `ProductCard.Rating` — `<Stars/> + numeric + sales pill`
- `ProductCard.Price` — `<PriceTag/>`
- `ProductCard.Footer` — discount Badge + CartButton
- `ProductCard.Heat` — stock-heat gauge (extract from DealCard:76-102)
- `ProductCard.Viewers` — live viewers row (extract from DealCard:70-73)

DELETE: `DealCard.tsx` and `FeaturedCard.tsx` after migration. Migrate consumers: `BestSellers`, `FeaturedProducts`, `NewArrivals`, `TopRated`, `ForYou`, `Products`, `RecentlyViewed`, `TrendingSection`.

DEFINE: `ColorSwatchRow` molecule — props `{colors, active, onSelect, max=4, size='xs'|'sm'|'md'}`. Replaces inline color rows in FeaturedCard:135-162 and ProductColorPicker. KEEP `ProductColorPicker.tsx` as the `md` preset; DELETE its CSS, route through `ColorSwatchRow`.

DEFINE: `SearchInput` molecule — composes `InputBase` + search icon + clear button + optional `onSubmit`. REPLACE inline implementation in `SearchBar.tsx:65-121`. `SearchBar` becomes the organism that wraps `SearchInput` + `TrendingChips` + `FiltersRow`.

DEFINE: `TrendingChips` molecule — horizontal scroll of `Chip` atoms, accepts `terms: string[]`, `onSelect`. REPLACE SearchBar:124-176.

DEFINE: `AlertBanner` molecule — props `{tone:'info'|'success'|'warning'|'error', icon?, title?, children, dismissible?}`. REPLACE every inline alert: AccountSheet:511-516, AccountSheet:602, AccountSheet:620, AccountSheet:597-600, AccountSheet:612-616.

DEFINE: `SocialAuthRow` molecule — accepts providers array, renders 46×46 `IconButton circle`, "coming soon" badge. EXTRACT from AccountSheet:380-426.

DEFINE: `OTPField` molecule — wraps `ui/OTPInput.tsx` + label + error + resend countdown. ADD: paste auto-submit when 6 digits filled; auto-advance keyboard `inputMode="numeric"` confirmed.

DEFINE: `RangeSlider` molecule — extract from `SearchFilters.tsx:31-72`; ADD: keyboard `ArrowLeft/Right` ±step, `Home/End`, ARIA `role="slider" aria-valuemin/max/now`, focus ring `var(--gold-pale)`. Currently NO keyboard accessibility.

DEFINE: `FilterChipBar` molecule — `Chip` list with close, horizontal scroll. REPLACE ControlsBar active chips inline (SearchFilters:328-343).

DEFINE: `SortMenu` and `FilterDrawer` molecules — keep behavior in `SortSheet` / `FilterSheet`, but rebuild on a shared `BottomSheet` primitive (see Organisms).

DEFINE: `EmptyState` molecule — `{illustration, title, description, primaryAction?}`. ADD across: WishlistPage, CartPage, OrdersPage, SearchPage (no results), NotificationsPage, PriceAlertsPage, AddressBookPage. Currently every page rolls its own.

DEFINE: `ErrorState` molecule — variants `network | server | not-found`, with retry CTA. Wire to `ErrorBoundary`.

DEFINE: `Toast` wrapper — `sonner` is fine but expose `<Toaster/>` defaults centrally: position `top-center`, RTL, `Tajawal`, 3000ms, success/error/info presets. ENFORCE: only `toast.success/error/info` allowed — ban raw `toast()`.

---

## 03 — Organisms

KEEP: `Header.tsx` anatomy (logo + greeting + actions). REFACTOR:
- Replace all `header-icon-btn` JSX with `<IconButton size="lg" variant="ghost"/>`
- Replace cart count and notification dot with `<Badge variant="count"/>`
- Replace `<div className="header-avatar">` with `<Avatar size="sm" name={user.name}/>`
- Replace inline points pill with `<Chip variant="active" leftIcon="🪙">{points}</Chip>` (NOTE: emoji 🪙 violates icon policy → REPLACE with `lucide:Coins`).

KEEP: `BottomNav.tsx` (custom SVG notch is intentional and high-quality). REFACTOR:
- Move `BRAND`, `INACTIVE`, `BADGE_BG`, `NAV_BG` to CSS vars: `--nav-bg=#F5EDE0` (add token), `--nav-inactive=var(--text-muted)`, badge → `<Badge variant="count">`.
- Extract `NavBubble` as internal sub-component.
- ADD focus-visible ring on each tab (currently invisible).

DEFINE: `BottomSheet` primitive — single sheet engine used by AccountSheet, QuickViewSheet, SortSheet, FilterSheet, CompareSheet. Props: `{open, onClose, snapPoints, header, footer, scrollable, backdropBlur=6, dragHandle=true}`. Standard: spring `{stiffness:340, damping:34}`, max-height `88dvh`, border-radius `24px 24px 0 0`, backdrop `rgba(0,0,0,0.48)` blur 6px, body-scroll lock, Escape close, focus trap, restore focus on close.

REWRITE: `AccountSheet.tsx`, `QuickViewSheet.tsx`, `CompareSheet.tsx`, `SortSheet`, `FilterSheet` to consume `<BottomSheet>`. DELETE all inline backdrop/sheet/scroll-lock/escape duplication (~140 lines saved across 5 files).

DEFINE: `Modal` primitive — centered dialog variant of BottomSheet for desktop ≥768px. Currently AccountSheet is a centered modal (bad on mobile). Make it: BottomSheet on `<768px`, Modal on `≥768px`.

DEFINE: `Section` organism — composes `SectionHeader` + horizontal scroll-snap rail OR grid. Props `{title, icon?, viewAllHref?, layout:'rail'|'grid-2'|'grid-3', loading?, empty?}`. REPLACE: BestSellers, FeaturedProducts, NewArrivals, TopRated, ForYou, RecentlyViewed, TrendingSection — each currently re-implements its own section wrapper.

KEEP: `SectionHeader.tsx`. ADD: `loading` variant rendering Skeleton title; `actionSlot` prop for right-side action other than "view all".

DEFINE: `ProductGrid` organism — responsive 2-col mobile / 3-col `≥520px` / 4-col `≥768px`. Uses `ProductCard`. Props `{items, loading, layout, onItemClick}`.

DEFINE: `ProductRail` organism — horizontal scroll-snap `scroll-snap-type:x mandatory; gap:12px; padding-inline:16px; scroll-padding-inline:16px`. RTL safe via `dir`.

KEEP: `StickyBuyBar.tsx`. REFACTOR: use `<Button variant="primary" size="lg" loading={pending} disabled={isOOS}>` and `<Button variant="outline" size="lg">` and `<IconButton variant="outline" size="lg"><Heart/></IconButton>`. DELETE all inline button styles.

KEEP: `FlashSaleStrip.tsx`, `PromoBanners.tsx`, `BannerSlider.tsx`, `Categories.tsx`, `Brands.tsx`. Audit and route through `Section` + `Chip` + `Badge` atoms.

DEFINE: `Cart` organisms — `CartLineItem`, `CartTotalsCard`, `CouponInput`, `ShippingAddressCard`, `CheckoutSummaryBar`. Extract from `CartPage.tsx` and `CheckoutPage.tsx`.

DEFINE: `OrderCard`, `OrderTimeline`, `OrderStatusBadge` — extract from `OrdersPage.tsx`.

DEFINE: `AddressCard` + `AddressForm` — extract from `AddressBookPage.tsx`.

DEFINE: `ReviewCard` + `ReviewForm` + `RatingSummary` — for `ProductDetailPage` reviews block.

DEFINE: `PriceAlertCard` — for `PriceAlertsPage`.

---

## 04 — States & Variants

ADD: every interactive atom MUST implement these 7 states with these exact tokens:
1. default
2. hover — `opacity:0.92` on solid; `bg:var(--gold-pale)` on ghost/outline
3. focus-visible — `outline:2px solid var(--gold); outline-offset:2px` (already on Button — propagate to ALL)
4. active/pressed — `transform:scale(0.97)` `transition:transform 80ms`
5. disabled — `opacity:0.4; pointer-events:none; cursor:not-allowed`
6. loading — `<Spinner/>` + `aria-busy="true"`, frozen width, content `opacity:0.5`
7. success-flash (where applicable) — `bg:var(--success)` + `<Check/>` for 1200ms, then revert

ADD: error variant on InputBase — `border:var(--error)`, focus ring `rgba(220,38,38,0.18)`, helper text auto-replaced by `InputError`.

ADD: `readOnly` state on InputBase — `bg:var(--bg-surface-subtle) color:var(--text-secondary) cursor:default`.

ADD: empty state for every list organism — `EmptyState` with illustration, title, description, CTA. Required pages: Wishlist, Cart, Orders, Notifications, PriceAlerts, Search no-results, AddressBook.

ADD: loading state for every data organism — `Skeleton` matching final layout (ProductCard.Skeleton, OrderCard.Skeleton, ReviewCard.Skeleton, Section.Skeleton).

ADD: error state — `ErrorState` with retry. Wire to React-Query `isError`.

ADD: offline state — global `OfflineBanner` (`AlertBanner tone="warning"`) at top when `navigator.onLine===false`.

DEFINE: ProductCard state matrix —
- `in-stock` → default
- `low-stock (≤5)` → `Tag tone="warning"` "تبقّى N فقط"
- `out-of-stock` → opacity 0.7, `Badge variant="oos"`, CartButton disabled
- `wishlisted` → Heart filled red, `aria-pressed=true`
- `added-to-cart` → CartButton success-flash 1200ms

---

## 05 — Interaction & Behavior

STANDARDIZE: motion durations — ONLY `var(--duration-*)` allowed.

STANDARDIZE: easing — `var(--ease-out)` for enters, `var(--ease-spring)` for bouncy (cards, swatches), `var(--ease-slide)` for sheets. Forbid raw `cubic-bezier(…)`.

STANDARDIZE: focus ring — `outline:2px solid var(--gold); outline-offset:2px`. NO `box-shadow`-based rings.

STANDARDIZE: hit target — every interactive element min `44×44px` tap area (use `min-w-[44px] min-h-[44px]` or invisible padding wrapper). Audit: DealCard heart (currently 13×13 icon, no padding wrapper) and FeaturedCard heart (same) FAIL — wrap in `<IconButton size="sm">`.

STANDARDIZE: transitions — only animate `opacity / transform / background-color / border-color / color / box-shadow`. NEVER `transition:all`.

STANDARDIZE: keyboard support per component —
- Button/IconButton: Enter + Space activate
- Checkbox/Switch: Space toggle
- Radio: ArrowLeft/Right
- BottomSheet/Modal: Escape close, Tab trap (KEEP AccountSheet implementation as reference, EXTRACT to BottomSheet)
- OTP: digit keys, Backspace, ArrowKeys, Paste
- ProductCard: Enter on focused card navigates
- BottomNav: ArrowLeft/Right per existing impl — apply same to FilterChip groups

STANDARDIZE: scroll lock — `body.style.overflow="hidden"` is brittle. Use the BottomSheet primitive with `position:fixed` lock + scroll-position restore.

STANDARDIZE: ripple/feedback — `whileTap={{scale:0.95–0.97}}` on every primary interactive via framer-motion OR pure CSS `active:scale-[0.97]`. Pick CSS — DROP framer-motion from CartButton/DealCard cart button.

DEFINE: optimistic UI for: add-to-cart, toggle-wishlist, follow-price-alert. Rollback on mutation error with `AlertBanner` toast.

---

## 06 — Responsive Behavior

DEFINE breakpoints (tailwind defaults): `sm=640 / md=768 / lg=1024 / xl=1280`.

DEFINE container — app is mobile-first; ALL pages constrained to `max-width:480px` on `<768px`, `max-width:1200px` on `≥1024px` with 3-col product grid.

ProductCard:
- `<400px` → font-size clamps already correct, KEEP
- `≥400 <520` → unchanged
- `≥520 <768` → image aspect 1:1, 3-col grid
- `≥768` → density `comfortable`, 4-col grid, hover lift `transform:translateY(-2px) shadow-lg`

BottomNav:
- visible `<768px` only; HIDE on `≥768px`, replace with sticky sidebar nav (NEW: `SideNav` organism).

Header:
- `<480px` → current layout
- `≥768px` → expand to include search inline + categories megamenu trigger (NEW: `MegaMenu` organism — defer)

BottomSheet:
- `<768px` → bottom sheet
- `≥768px` → centered Modal max-width 480px

ProductDetailPage:
- `<768px` → image gallery full-bleed, sticky buy bar
- `≥768px` → 2-column: gallery left 60%, info right 40%, sticky info column

SearchInput:
- `<640px` → full-width, 14px font
- `≥640px` → max-width 520px, 15px font

Typography:
- ALREADY using `clamp()` correctly across the codebase — KEEP and propagate via tokens, ban raw `clamp()` in new code (use `var(--text-*)`).

---

## 07 — Composition Rules

ALLOWED:
- Atoms compose into Molecules; Molecules compose into Organisms; Organisms compose into Pages.
- Atoms may use ONLY: design tokens, lucide icons, `cn()`, `cva`, framer-motion (motion only — no Reorder/Drag), Tailwind utilities.
- Molecules may use Atoms + other Molecules + design tokens.
- Organisms may use Atoms + Molecules + page-level hooks (Context, React-Query).

FORBIDDEN:
- Atoms importing from `/context/*`, `/lib/apiFetch.ts`, `/data/catalog.ts`, or any page.
- Hardcoded color/font/radius/duration literals anywhere outside `index.css` and `designTokens.ts`.
- Emoji icons in production UI: `🔥 🪙 ⚡ 💡 ⚠️ 🧪 ✓ 🛍️ 👋 ✨`. Replace with `lucide-react`: `Flame, Coins, Zap, Lightbulb, AlertCircle, FlaskConical, Check, ShoppingBag, Hand, Sparkles`. EXCEPTION: greeting emoji `👋` in welcome string allowed.
- Inline `style={{…}}` for any property that has a Tailwind utility OR a CSS variable. Reserved for dynamic values only.
- `motion.*` for static decoration — only for state transitions.
- Two components solving the same UI problem. Every duplicate MUST be merged within this plan.
- `position:fixed` outside BottomSheet/Modal/Toaster.
- `z-index` literals — define scale: `--z-base=0`, `--z-sticky=10`, `--z-header=50`, `--z-bottom-nav=60`, `--z-overlay=200`, `--z-modal=300`, `--z-toast=400`. REPLACE all numeric `zIndex:` values.

NAMING:
- Atoms: PascalCase single noun (`Button`, `Badge`, `Heart`).
- Molecules: PascalCase compound (`SearchInput`, `ColorSwatchRow`, `OTPField`).
- Organisms: PascalCase descriptive (`ProductCard`, `BottomSheet`, `StickyBuyBar`).
- Variants: lowercase kebab (`primary`, `circle-success`, `discount-soft`).
- Sizes: `2xs|xs|sm|md|lg|xl|2xl`. Forbid `tiny/big/huge`.

ACCESSIBILITY MINIMUM:
- Every IconButton requires `aria-label`. Lint rule mandatory.
- Every dialog `role="dialog" aria-modal="true" aria-labelledby`.
- Every form input has associated label (visible or `aria-label`).
- Color contrast ≥4.5:1 for text, ≥3:1 for large text and UI components.
- Focus order matches visual order (RTL aware).

---

## 08 — Opportunities Beyond Current Scope

DEFINE: `CommandPalette` — ⌘K search across products/brands/categories/orders. Major UX leap for `≥768px`.

DEFINE: `CompareTable` organism — currently `CompareSheet.tsx` exists but no spec; build feature-parity comparison with sticky header, color/size/price/rating columns.

DEFINE: `WishlistShareCard` — generate sharable image of wishlist for WhatsApp/X (high impact in خليجي market — see PRD enhancement).

DEFINE: `PriceHistoryChart` molecule — Recharts sparkline for ProductDetail; pairs with PriceAlertCard for explicit value proposition.

DEFINE: `LiveOrderTracker` organism — animated timeline with Lottie checkmark on each completed step; for OrderSuccessPage and OrdersPage.

DEFINE: `StoryStrip` organism — Instagram-style brand stories at top of homepage; tap → opens vertical product carousel sheet. Native to luxury fashion vertical.

DEFINE: `OutfitBuilder` organism — drag products from grid into "outfit canvas"; AI suggestions. Premium feature.

DEFINE: `SizeFitWidget` molecule — height/weight inputs → recommended size with confidence %; reduces returns.

DEFINE: `ReviewMediaGrid` molecule — user-uploaded photos/videos in review cards; tap → full-screen `MediaViewer` organism.

DEFINE: `LoyaltyTierCard` — visualizes points → tier (Bronze/Silver/Gold/نخبة) with progress ring; rendered in AccountPage.

DEFINE: `RecentlyViewedDock` — collapsible bottom-right floating widget on desktop (`≥1024px`); already have data via `RecentlyViewed.tsx` — productize as persistent UI.

DEFINE: `DarkMode` — `index.css` already mentions `nakhba_dark` toggle in `main.tsx:14`; current tokens lack dark counterparts. ADD full dark token set: `--bg-page-dark=#0E0C0A`, `--bg-card-dark=#1A1714`, `--text-primary-dark=#F2EFEA`, `--border-dark=#2A2722`, and dark variants of every semantic color. Wire `<html data-theme="dark">` selector in `index.css`.

DEFINE: `PWAInstallPrompt` — `manifest.json` already linked; add native install banner with custom design.

DEFINE: `HapticFeedback` hook — `navigator.vibrate(10)` on add-to-cart / heart / OTP error; one-line ergonomic utility.

DEFINE: `RTLBidi` audit — current code mixes `dir="rtl"` on individual nodes; centralize via `<html dir="rtl">` (already set) and remove redundant `dir="rtl"` from leaf components. Keep `dir="ltr"` ONLY on OTP (numeric input) and `PriceTag` (numeric).

DEFINE: visual regression — adopt Chromatic/Ladle for every atom + molecule; required to enforce this plan long-term.
