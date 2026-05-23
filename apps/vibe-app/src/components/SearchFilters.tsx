import { useState, useEffect, useRef } from "react";
import {
  X, Star, Check, SlidersHorizontal,
  List, LayoutGrid, ChevronDown,
} from "lucide-react";
import { l1Categories, l2Categories } from "../data/catalog";

/* ═══════════════════════════════════════════════════════════════
   TYPES & CONSTANTS
═══════════════════════════════════════════════════════════════ */
export interface Filters {
  minPrice:    number | null;
  maxPrice:    number | null;
  minDiscount: number | null;
  minRating:   number | null;
  isNew:       boolean;
  brands:      string[];
  sizes:       string[];
}

export const DEFAULT_FILTERS: Filters = {
  minPrice: null, maxPrice: null, minDiscount: null,
  minRating: null, isNew: false, brands: [], sizes: [],
};

export const SORT_OPTIONS = [
  { key: "default",    label: "الافتراضي" },
  { key: "price_asc",  label: "السعر: الأقل أولاً" },
  { key: "price_desc", label: "السعر: الأعلى أولاً" },
  { key: "rating",     label: "الأعلى تقييماً" },
  { key: "discount",   label: "الأكثر خصماً" },
  { key: "newest",     label: "الأحدث" },
];

export const ALL_BRANDS = ["CHANEL", "DIOR", "GUCCI", "LV", "VERSACE", "BURBERRY"];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43"];

const PRICE_RANGES = [
  { label: "تحت ٣٠٠",        min: null, max: 300 },
  { label: "٣٠٠ – ٦٠٠",     min: 300,  max: 600 },
  { label: "٦٠٠ – ١٢٠٠",   min: 600,  max: 1200 },
  { label: "فوق ١٢٠٠",      min: 1200, max: null },
];

type PanelKey = "sort" | "price" | "rating" | "brand" | "category";

/* ═══════════════════════════════════════════════════════════════
   SHARED CHIP BUTTON
═══════════════════════════════════════════════════════════════ */
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        flexShrink: 0, display: "flex", alignItems: "center", gap: 4,
        padding: "6px 14px", borderRadius: 20,
        border: `1.5px solid ${active ? "var(--color-brand-500)" : "var(--border-warm)"}`,
        background: active ? "var(--color-brand-50)" : "var(--bg-page)",
        fontFamily: "var(--font-main)", fontSize: 12.5, fontWeight: active ? 700 : 500,
        color: active ? "var(--text-brand)" : "var(--text-secondary)",
        cursor: "pointer", transition: "all 0.15s",
      }}>
      {active && <Check size={10} strokeWidth={2.5} style={{ color: "var(--color-brand-500)", flexShrink: 0 }} />}
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FILTER BAR BUTTON  (header of each dropdown)
═══════════════════════════════════════════════════════════════ */
function FilterBarBtn({ label, active, isOpen, onClick }: {
  label: string; active: boolean; isOpen: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      style={{
        flexShrink: 0, display: "flex", alignItems: "center", gap: 4,
        padding: "6px 11px 6px 9px", borderRadius: 20,
        border: `1.5px solid ${active || isOpen ? "var(--color-brand-500)" : "var(--border-warm)"}`,
        background: active || isOpen ? "var(--color-brand-50)" : "var(--bg-card)",
        fontFamily: "var(--font-main)", fontSize: 12, fontWeight: active || isOpen ? 700 : 500,
        color: active || isOpen ? "var(--text-brand)" : "var(--text-secondary)",
        cursor: "pointer", transition: "all 0.15s",
      }}>
      <span>{label}</span>
      <ChevronDown size={11} strokeWidth={2.5}
        style={{
          color: active || isOpen ? "var(--color-brand-500)" : "var(--text-muted)",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}
      />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PANEL WRAPPER
═══════════════════════════════════════════════════════════════ */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" style={{
      borderTop: "1px solid var(--border-warm)",
      background: "var(--bg-card)",
      padding: "12px 14px 14px",
      animation: "panelSlideDown 0.18s var(--ease-out) both",
    }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SORT PANEL
═══════════════════════════════════════════════════════════════ */
function SortPanel({ sort, onSelect }: { sort: string; onSelect: (k: string) => void }) {
  return (
    <Panel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {SORT_OPTIONS.filter(o => o.key !== "default").map(({ key, label }) => (
          <Chip key={key} label={label} active={sort === key} onClick={() => onSelect(sort === key ? "default" : key)} />
        ))}
      </div>
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRICE PANEL
═══════════════════════════════════════════════════════════════ */
function PricePanel({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  function isRangeActive(min: number | null, max: number | null) {
    return filters.minPrice === min && filters.maxPrice === max;
  }
  function toggle(min: number | null, max: number | null) {
    if (isRangeActive(min, max)) onChange({ ...filters, minPrice: null, maxPrice: null });
    else onChange({ ...filters, minPrice: min, maxPrice: max });
  }
  return (
    <Panel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {PRICE_RANGES.map(({ label, min, max }) => (
          <Chip key={label} label={label} active={isRangeActive(min, max)} onClick={() => toggle(min, max)} />
        ))}
      </div>
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RATING PANEL
═══════════════════════════════════════════════════════════════ */
function RatingPanel({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  return (
    <Panel>
      <div style={{ display: "flex", gap: 8 }}>
        {[4, 3].map((r) => {
          const active = filters.minRating === r;
          return (
            <button key={r}
              onClick={() => onChange({ ...filters, minRating: active ? null : r })}
              style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: 5,
                padding: "6px 14px", borderRadius: 20,
                border: `1.5px solid ${active ? "var(--color-brand-500)" : "var(--border-warm)"}`,
                background: active ? "var(--color-brand-50)" : "var(--bg-page)",
                cursor: "pointer",
              }}>
              <Star size={12} style={{ fill: "var(--color-brand-500)", stroke: "var(--color-brand-500)" }} />
              <span style={{ fontFamily: "var(--font-main)", fontSize: 12.5, fontWeight: active ? 700 : 500, color: active ? "var(--text-brand)" : "var(--text-secondary)" }}>
                {r}+ نجوم
              </span>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BRAND PANEL
═══════════════════════════════════════════════════════════════ */
function BrandPanel({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  function toggle(b: string) {
    const brands = filters.brands.includes(b)
      ? filters.brands.filter(x => x !== b)
      : [...filters.brands, b];
    onChange({ ...filters, brands });
  }
  return (
    <Panel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {ALL_BRANDS.map((b) => (
          <Chip key={b} label={b} active={filters.brands.includes(b)} onClick={() => toggle(b)} />
        ))}
      </div>
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY PANEL  (L1 + L2)
═══════════════════════════════════════════════════════════════ */
function CategoryPanel({ categoryParam, onSelect }: {
  categoryParam: string;
  onSelect: (l1Label: string, l2Label?: string) => void;
}) {
  const currentL1 = l1Categories.find(c => c.label === categoryParam) ?? null;
  const [activeL1Id, setActiveL1Id] = useState<string | null>(currentL1?.id ?? null);
  const [activeL2Label, setActiveL2Label] = useState<string | null>(null);

  const l2ForActive = activeL1Id
    ? l2Categories.filter(c => c.parentId === activeL1Id)
    : [];

  function handleL1(id: string, label: string) {
    if (activeL1Id === id) {
      setActiveL1Id(null);
      setActiveL2Label(null);
      onSelect("");
    } else {
      setActiveL1Id(id);
      setActiveL2Label(null);
      onSelect(label);
    }
  }

  function handleL2(label: string) {
    const l1Label = l1Categories.find(c => c.id === activeL1Id)?.label ?? "";
    if (activeL2Label === label) {
      setActiveL2Label(null);
      onSelect(l1Label);
    } else {
      setActiveL2Label(label);
      onSelect(l1Label, label);
    }
  }

  return (
    <Panel>
      {/* L1 row */}
      <p style={{ fontFamily: "var(--font-main)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, letterSpacing: 0.3 }}>الفئة الرئيسية</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: l2ForActive.length > 0 ? 14 : 0 }}>
        {l1Categories.map(({ id, label }) => (
          <Chip key={id} label={label} active={activeL1Id === id} onClick={() => handleL1(id, label)} />
        ))}
      </div>

      {/* L2 row — appears when an L1 is selected */}
      {l2ForActive.length > 0 && (
        <>
          <div style={{ height: 1, background: "var(--border-warm)", marginBottom: 12 }} />
          <p style={{ fontFamily: "var(--font-main)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, letterSpacing: 0.3 }}>الفئة الفرعية</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {l2ForActive.map(({ id, label }) => (
              <Chip key={id} label={label} active={activeL2Label === label} onClick={() => handleL2(label)} />
            ))}
          </div>
        </>
      )}
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FILTER SHEET  (sizes + discount + new only)
═══════════════════════════════════════════════════════════════ */
export function FilterSheet({ filters, onApply, onClose }: {
  filters: Filters; onApply: (f: Filters) => void; onClose: () => void;
}) {
  const [local, setLocal] = useState<Filters>(filters);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const discountOptions = [
    { label: "١٠٪ فأكثر", val: 10 },
    { label: "٢٠٪ فأكثر", val: 20 },
    { label: "٣٠٪ فأكثر", val: 30 },
    { label: "٥٠٪ فأكثر", val: 50 },
  ];

  function toggleSize(s: string) {
    setLocal(p => ({ ...p, sizes: p.sizes.includes(s) ? p.sizes.filter(x => x !== s) : [...p.sizes, s] }));
  }

  const activeCount = [
    local.minDiscount !== null,
    local.isNew,
    local.sizes.length > 0,
  ].filter(Boolean).length;

  function reset() {
    setLocal(p => ({ ...p, minDiscount: null, isNew: false, sizes: [] }));
  }

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 200 }}>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet hide-scrollbar" dir="rtl" style={{ maxHeight: "88vh" }}>
        <div className="bottom-sheet-handle" />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 14px", borderBottom: "1px solid var(--border-warm)", position: "sticky", top: 0, background: "var(--bg-card)", zIndex: 1 }}>
          <h2 style={{ fontFamily: "var(--font-main)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            فلاتر إضافية {activeCount > 0 && `(${activeCount})`}
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            {activeCount > 0 && (
              <button onClick={reset}
                style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid var(--border-warm)", background: "transparent", fontFamily: "var(--font-main)", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}>
                إعادة ضبط
              </button>
            )}
            <button onClick={onClose}
              style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid var(--border-warm)", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={14} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
        </div>

        <div style={{ padding: 16 }}>

          {/* Discount */}
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>نسبة الخصم</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {discountOptions.map(({ label, val }) => {
                const active = local.minDiscount === val;
                return (
                  <button key={val}
                    onClick={() => setLocal(p => ({ ...p, minDiscount: active ? null : val }))}
                    style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${active ? "var(--color-brand-500)" : "var(--border-warm)"}`, background: active ? "var(--color-brand-50)" : "var(--bg-card)", fontFamily: "var(--font-main)", fontSize: 12, fontWeight: active ? 700 : 400, color: active ? "var(--text-brand)" : "var(--text-secondary)", cursor: "pointer" }}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size */}
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>المقاس</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {ALL_SIZES.map((s) => {
                const active = local.sizes.includes(s);
                return (
                  <button key={s} onClick={() => toggleSize(s)}
                    style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${active ? "var(--color-brand-500)" : "var(--border-warm)"}`, background: active ? "var(--color-brand-50)" : "var(--bg-card)", fontFamily: "var(--font-main)", fontSize: 12, fontWeight: active ? 700 : 500, color: active ? "var(--text-brand)" : "var(--text-secondary)", cursor: "pointer", minWidth: 44, textAlign: "center" }}>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* New Only */}
          <div style={{ marginBottom: 24 }}>
            <button onClick={() => setLocal(p => ({ ...p, isNew: !p.isNew }))}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${local.isNew ? "var(--color-brand-500)" : "var(--border-warm)"}`, background: local.isNew ? "var(--color-brand-50)" : "var(--bg-card)", cursor: "pointer" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${local.isNew ? "var(--color-brand-500)" : "var(--border)"}`, background: local.isNew ? "var(--color-brand-500)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                {local.isNew && <Check size={12} style={{ color: "#fff" }} />}
              </div>
              <span style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: local.isNew ? 700 : 400, color: local.isNew ? "var(--text-brand)" : "var(--text-primary)" }}>وصل حديثاً فقط</span>
            </button>
          </div>

          <button onClick={() => { onApply(local); onClose(); }}
            style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", background: "var(--gradient-brand)", color: "#fff", fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "var(--shadow-btn)" }}>
            تطبيق {activeCount > 0 ? `(${activeCount})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONTROLS BAR  — main export
═══════════════════════════════════════════════════════════════ */
export function ControlsBar({ count, sort, filters, viewMode, categoryParam,
  onSortSelect, onFiltersChange, onFilterOpen, onViewToggle, onCategorySelect, onRemoveFilter,
}: {
  count:             number;
  sort:              string;
  filters:           Filters;
  viewMode:          "grid" | "list";
  categoryParam:     string;
  onSortSelect:      (key: string) => void;
  onFiltersChange:   (f: Filters) => void;
  onFilterOpen:      () => void;
  onViewToggle:      () => void;
  onCategorySelect:  (l1Label: string, l2Label?: string) => void;
  onRemoveFilter:    (key: keyof Filters, value?: string) => void;
}) {
  const [openPanel, setOpenPanel] = useState<PanelKey | null>(null);

  function togglePanel(p: PanelKey) {
    setOpenPanel(prev => prev === p ? null : p);
  }

  /* active states ─────────────────────────────────────────── */
  const priceActive    = filters.minPrice !== null || filters.maxPrice !== null;
  const ratingActive   = filters.minRating !== null;
  const brandActive    = filters.brands.length > 0;
  const categoryActive = categoryParam.trim().length > 0;
  const sortActive     = sort !== "default";

  const extraCount = [
    filters.minDiscount !== null,
    filters.isNew,
    filters.sizes.length > 0,
  ].filter(Boolean).length;

  /* active chips for removable row ────────────────────────── */
  const activeChips: { key: keyof Filters; label: string; value?: string }[] = [];
  if (priceActive) {
    activeChips.push({
      key: "minPrice",
      label: filters.maxPrice === null
        ? `${filters.minPrice?.toLocaleString("ar-SA")}+ ر.س`
        : filters.minPrice === null
          ? `حتى ${filters.maxPrice.toLocaleString("ar-SA")} ر.س`
          : `${filters.minPrice?.toLocaleString("ar-SA")} — ${filters.maxPrice?.toLocaleString("ar-SA")} ر.س`,
    });
  }
  if (ratingActive)  activeChips.push({ key: "minRating",   label: `${filters.minRating}+ ★` });
  if (filters.minDiscount !== null) activeChips.push({ key: "minDiscount", label: `خصم ${filters.minDiscount}%+` });
  if (filters.isNew) activeChips.push({ key: "isNew",       label: "وصل حديثاً" });
  filters.brands.forEach(b => activeChips.push({ key: "brands", label: b, value: b }));
  filters.sizes.forEach(s  => activeChips.push({ key: "sizes",  label: s, value: s }));

  const sortLabel = SORT_OPTIONS.find(s => s.key === sort)?.label;

  /* close panel on outside scroll ─────────────────────────── */
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!openPanel) return;
    function onScroll(e: Event) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    }
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [openPanel]);

  return (
    <div ref={barRef} dir="rtl" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-warm)" }}>

      {/* ── Button Row ─────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px 8px" }}>

        {/* result count */}
        <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0, marginInlineEnd: 2 }}>
          {count.toLocaleString("ar-SA")} نتيجة
        </span>

        {/* scrollable buttons */}
        <div className="hide-scrollbar" style={{ display: "flex", gap: 6, overflowX: "auto", flex: 1 }}>
          <FilterBarBtn
            label={sortActive ? (sortLabel ?? "ترتيب") : "ترتيب"}
            active={sortActive} isOpen={openPanel === "sort"}
            onClick={() => togglePanel("sort")}
          />
          <FilterBarBtn
            label={priceActive ? "السعر ✓" : "السعر"}
            active={priceActive} isOpen={openPanel === "price"}
            onClick={() => togglePanel("price")}
          />
          <FilterBarBtn
            label={ratingActive ? `${filters.minRating}+ ★` : "التقييم"}
            active={ratingActive} isOpen={openPanel === "rating"}
            onClick={() => togglePanel("rating")}
          />
          <FilterBarBtn
            label={brandActive
              ? filters.brands.length === 1 ? filters.brands[0] : `${filters.brands[0]} +${filters.brands.length - 1}`
              : "الماركة"}
            active={brandActive} isOpen={openPanel === "brand"}
            onClick={() => togglePanel("brand")}
          />
          <FilterBarBtn
            label={categoryActive ? categoryParam : "الفئة"}
            active={categoryActive} isOpen={openPanel === "category"}
            onClick={() => togglePanel("category")}
          />
          {/* extra filters */}
          <button onClick={onFilterOpen}
            style={{
              flexShrink: 0, display: "flex", alignItems: "center", gap: 4,
              padding: "6px 11px", borderRadius: 20,
              border: `1.5px solid ${extraCount > 0 ? "var(--color-brand-500)" : "var(--border-warm)"}`,
              background: extraCount > 0 ? "var(--color-brand-50)" : "var(--bg-card)",
              fontFamily: "var(--font-main)", fontSize: 12, fontWeight: extraCount > 0 ? 700 : 500,
              color: extraCount > 0 ? "var(--text-brand)" : "var(--text-secondary)",
              cursor: "pointer",
            }}>
            <SlidersHorizontal size={11} strokeWidth={2} />
            {extraCount > 0 ? `المزيد (${extraCount})` : "المزيد"}
          </button>
        </div>

        {/* view toggle */}
        <button onClick={onViewToggle}
          style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, border: "1px solid var(--border-warm)", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          aria-label={viewMode === "grid" ? "عرض القائمة" : "عرض الشبكة"}>
          {viewMode === "grid"
            ? <List size={13} style={{ color: "var(--text-secondary)" }} />
            : <LayoutGrid size={13} style={{ color: "var(--text-secondary)" }} />}
        </button>
      </div>

      {/* ── Inline Panels ──────────────────────────────────── */}
      {openPanel === "sort"     && <SortPanel     sort={sort}      onSelect={(k) => { onSortSelect(k); setOpenPanel(null); }} />}
      {openPanel === "price"    && <PricePanel    filters={filters} onChange={(f) => { onFiltersChange(f); }} />}
      {openPanel === "rating"   && <RatingPanel   filters={filters} onChange={(f) => { onFiltersChange(f); }} />}
      {openPanel === "brand"    && <BrandPanel    filters={filters} onChange={(f) => { onFiltersChange(f); }} />}
      {openPanel === "category" && (
        <CategoryPanel
          categoryParam={categoryParam}
          onSelect={(l1, l2) => {
            onCategorySelect(l1, l2);
            if (!l2) setOpenPanel(null);
          }}
        />
      )}

      {/* ── Active Filter Chips ─────────────────────────────── */}
      {activeChips.length > 0 && (
        <div className="hide-scrollbar" style={{ display: "flex", gap: 6, padding: "0 12px 8px", overflowX: "auto" }}>
          {activeChips.map(({ key, label, value }, idx) => (
            <div key={`${key}-${idx}`}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: "var(--color-brand-50)", border: "1px solid rgba(192,168,130,0.4)", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-main)", fontSize: 11, fontWeight: 700, color: "var(--text-brand)" }}>{label}</span>
              <button
                onClick={() => {
                  if (key === "minPrice") { onRemoveFilter("minPrice"); onRemoveFilter("maxPrice"); }
                  else onRemoveFilter(key, value);
                }}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "var(--text-brand)" }}>
                <X size={10} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
