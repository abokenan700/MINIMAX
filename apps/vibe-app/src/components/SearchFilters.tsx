import { useState, useEffect } from "react";
import { X, Star, Check, SlidersHorizontal, List, LayoutGrid } from "lucide-react";

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
  minPrice: null, maxPrice: null, minDiscount: null, minRating: null, isNew: false, brands: [], sizes: [],
};

export const SORT_OPTIONS = [
  { key: "default",    label: "الافتراضي" },
  { key: "price_asc",  label: "السعر ↑" },
  { key: "price_desc", label: "السعر ↓" },
  { key: "rating",     label: "الأعلى تقييماً" },
  { key: "discount",   label: "الأكثر خصماً" },
  { key: "newest",     label: "الأحدث" },
];

export const ALL_BRANDS = ["CHANEL", "DIOR", "GUCCI", "LV", "VERSACE", "BURBERRY"];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43"];

/* ─── RangeSlider ─────────────────────────────────────────────── */
import { useRef } from "react";

function RangeSlider({ min, max, valueMin, valueMax, onChange }: {
  min: number; max: number; valueMin: number | null; valueMax: number | null;
  onChange: (min: number | null, max: number | null) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const vMin = valueMin ?? min;
  const vMax = valueMax ?? max;
  const pctMin = ((vMin - min) / (max - min)) * 100;
  const pctMax = ((vMax - min) / (max - min)) * 100;

  function getValueFromEvent(e: React.PointerEvent, type: "min" | "max") {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct  = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const raw  = Math.round((min + pct * (max - min)) / 50) * 50;
    if (type === "min") onChange(Math.min(raw, vMax - 50), valueMax);
    else                onChange(valueMin, Math.max(raw, vMin + 50));
  }

  return (
    <div style={{ padding: "6px 0 10px" }}>
      <div ref={trackRef} style={{ position: "relative", height: 6, borderRadius: 3, background: "var(--border-warm)", margin: "0 8px" }}>
        <div style={{ position: "absolute", left: `${pctMin}%`, right: `${100 - pctMax}%`, height: "100%", background: "var(--gradient-brand)", borderRadius: 3 }} />
        {(["min","max"] as const).map((type) => (
          <div key={type}
            style={{ position: "absolute", top: "50%", left: `${type === "min" ? pctMin : pctMax}%`, transform: "translate(-50%,-50%)", width: 20, height: 20, borderRadius: "50%", background: "#fff", border: "2.5px solid var(--color-brand-500)", cursor: "pointer", touchAction: "none", zIndex: 2 }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              e.currentTarget.onpointermove = (ev) => getValueFromEvent(ev as unknown as React.PointerEvent, type);
              e.currentTarget.onpointerup   = () => { e.currentTarget.onpointermove = null; e.currentTarget.onpointerup = null; };
            }}
          />
        ))}
      </div>
      <div dir="rtl" style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <span style={{ fontFamily: "var(--font-main)", fontSize: 12, fontWeight: 700, color: "var(--text-brand)" }}>{vMin.toLocaleString("ar-SA")} ر.س</span>
        <span style={{ fontFamily: "var(--font-main)", fontSize: 12, fontWeight: 700, color: "var(--text-brand)" }}>{vMax.toLocaleString("ar-SA")} ر.س</span>
      </div>
    </div>
  );
}

/* ─── FilterSheet ─────────────────────────────────────────────── */
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
  const ratingOptions = [4, 3];

  function reset() { setLocal({ ...DEFAULT_FILTERS, brands: filters.brands }); }

  function toggleSize(s: string) {
    setLocal(p => ({ ...p, sizes: p.sizes.includes(s) ? p.sizes.filter(x => x !== s) : [...p.sizes, s] }));
  }

  const activeCount = [
    local.minPrice !== null || local.maxPrice !== null,
    local.minDiscount !== null,
    local.minRating !== null,
    local.isNew,
    local.sizes.length > 0,
  ].filter(Boolean).length;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 200 }}>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet hide-scrollbar" dir="rtl" style={{ maxHeight: "88vh" }}>
        <div className="bottom-sheet-handle" />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 14px", borderBottom: "1px solid var(--border-warm)", position: "sticky", top: 0, background: "var(--bg-card)", zIndex: 1 }}>
          <h2 style={{ fontFamily: "var(--font-main)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            تصفية النتائج {activeCount > 0 && `(${activeCount})`}
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

        <div style={{ padding: 16, overflow: "auto" }}>

          {/* ─── Price Range ──────────────────────────────────── */}
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>نطاق السعر</p>
            <RangeSlider
              min={0} max={3000}
              valueMin={local.minPrice}
              valueMax={local.maxPrice}
              onChange={(mn, mx) => setLocal(p => ({ ...p, minPrice: mn === 0 ? null : mn, maxPrice: mx === 3000 ? null : mx }))}
            />
          </div>

          {/* ─── Size ─────────────────────────────────────────── */}
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

          {/* ─── Discount ─────────────────────────────────────── */}
          <div style={{ marginBottom: 20 }}>
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

          {/* ─── Rating ───────────────────────────────────────── */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>التقييم</p>
            <div style={{ display: "flex", gap: 8 }}>
              {ratingOptions.map((r) => {
                const active = local.minRating === r;
                return (
                  <button key={r}
                    onClick={() => setLocal(p => ({ ...p, minRating: active ? null : r }))}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${active ? "var(--color-brand-500)" : "var(--border-warm)"}`, background: active ? "var(--color-brand-50)" : "var(--bg-card)", cursor: "pointer" }}>
                    <Star size={12} style={{ fill: "var(--color-brand-500)", stroke: "var(--color-brand-500)" }} />
                    <span style={{ fontFamily: "var(--font-main)", fontSize: 12, fontWeight: active ? 700 : 400, color: active ? "var(--text-brand)" : "var(--text-secondary)" }}>{r}+ نجوم</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── New Only ─────────────────────────────────────── */}
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
            تطبيق الفلاتر {activeCount > 0 ? `(${activeCount})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── ControlsBar ─────────────────────────────────────────────── */
export function ControlsBar({ count, sort, filters, viewMode, onSortSelect, onFilterOpen, onViewToggle, onBrandToggle, onRemoveFilter }: {
  count: number;
  sort: string;
  filters: Filters;
  viewMode: "grid" | "list";
  onSortSelect:  (key: string) => void;
  onFilterOpen:  () => void;
  onViewToggle:  () => void;
  onBrandToggle: (brand: string) => void;
  onRemoveFilter: (key: keyof Filters, value?: string) => void;
}) {
  const filterCount = [
    filters.minPrice !== null || filters.maxPrice !== null,
    filters.minDiscount !== null,
    filters.minRating !== null,
    filters.isNew,
    filters.sizes.length > 0,
  ].filter(Boolean).length;

  const activeChips: { key: keyof Filters; label: string; value?: string }[] = [];
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    activeChips.push({
      key: "minPrice",
      label: filters.maxPrice === null
        ? `${filters.minPrice?.toLocaleString("ar-SA")}+ ر.س`
        : filters.minPrice === null
          ? `حتى ${filters.maxPrice.toLocaleString("ar-SA")} ر.س`
          : `${filters.minPrice?.toLocaleString("ar-SA")} — ${filters.maxPrice?.toLocaleString("ar-SA")} ر.س`,
    });
  }
  if (filters.minDiscount !== null) activeChips.push({ key: "minDiscount", label: `خصم ${filters.minDiscount}%+` });
  if (filters.minRating !== null)   activeChips.push({ key: "minRating",   label: `${filters.minRating}+ نجوم` });
  if (filters.isNew)                activeChips.push({ key: "isNew",       label: "وصل حديثاً" });
  filters.sizes.forEach(s => activeChips.push({ key: "sizes", label: s, value: s }));

  const SORT_CHIPS = SORT_OPTIONS.filter(o => o.key !== "default");

  return (
    <div dir="rtl" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-warm)" }}>

      {/* ── Row 1: count + filter button + view toggle ────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px 6px" }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>
          {count.toLocaleString("ar-SA")} نتيجة
        </span>
        <div style={{ flex: 1 }} />
        <button onClick={onFilterOpen}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 20, border: `1px solid ${filterCount > 0 ? "var(--color-brand-500)" : "var(--border-warm)"}`, background: filterCount > 0 ? "var(--color-brand-50)" : "var(--bg-card)", fontFamily: "var(--font-main)", fontSize: 12, fontWeight: 600, color: filterCount > 0 ? "var(--text-brand)" : "var(--text-secondary)", cursor: "pointer", flexShrink: 0 }}>
          <SlidersHorizontal size={12} strokeWidth={2} />
          فلترة {filterCount > 0 ? `(${filterCount})` : ""}
        </button>
        <button onClick={onViewToggle}
          style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid var(--border-warm)", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          aria-label={viewMode === "grid" ? "عرض القائمة" : "عرض الشبكة"}>
          {viewMode === "grid"
            ? <List size={13} style={{ color: "var(--text-secondary)" }} />
            : <LayoutGrid size={13} style={{ color: "var(--text-secondary)" }} />}
        </button>
      </div>

      {/* ── Row 2: sort chips ─────────────────────────────────── */}
      <div className="hide-scrollbar" style={{ display: "flex", gap: 6, padding: "0 12px 7px", overflowX: "auto" }}>
        {SORT_CHIPS.map(({ key, label }) => {
          const active = sort === key;
          return (
            <button key={key}
              onClick={() => onSortSelect(active ? "default" : key)}
              style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${active ? "var(--color-brand-500)" : "var(--border-warm)"}`, background: active ? "var(--color-brand-50)" : "var(--bg-page)", fontFamily: "var(--font-main)", fontSize: 11.5, fontWeight: active ? 700 : 500, color: active ? "var(--text-brand)" : "var(--text-secondary)", cursor: "pointer", transition: "all 0.15s" }}>
              {active && <Check size={10} strokeWidth={2.5} style={{ color: "var(--color-brand-500)" }} />}
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Row 3: brand chips ────────────────────────────────── */}
      <div className="hide-scrollbar" style={{ display: "flex", gap: 6, padding: "0 12px 8px", overflowX: "auto" }}>
        <button
          onClick={() => filters.brands.length > 0 && ALL_BRANDS.forEach(b => filters.brands.includes(b) && onBrandToggle(b))}
          style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${filters.brands.length === 0 ? "var(--color-brand-500)" : "var(--border-warm)"}`, background: filters.brands.length === 0 ? "var(--color-brand-50)" : "var(--bg-page)", fontFamily: "var(--font-main)", fontSize: 11.5, fontWeight: filters.brands.length === 0 ? 700 : 500, color: filters.brands.length === 0 ? "var(--text-brand)" : "var(--text-secondary)", cursor: "pointer", transition: "all 0.15s" }}>
          الكل
        </button>
        {ALL_BRANDS.map((brand) => {
          const active = filters.brands.includes(brand);
          return (
            <button key={brand}
              onClick={() => onBrandToggle(brand)}
              style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${active ? "var(--color-brand-500)" : "var(--border-warm)"}`, background: active ? "var(--color-brand-50)" : "var(--bg-page)", fontFamily: "var(--font-main)", fontSize: 11.5, fontWeight: active ? 700 : 500, color: active ? "var(--text-brand)" : "var(--text-secondary)", cursor: "pointer", transition: "all 0.15s", letterSpacing: 0.3 }}>
              {active && <Check size={10} strokeWidth={2.5} style={{ color: "var(--color-brand-500)" }} />}
              {brand}
            </button>
          );
        })}
      </div>

      {/* ── Row 4: active filter chips ────────────────────────── */}
      {activeChips.length > 0 && (
        <div className="hide-scrollbar" style={{ display: "flex", gap: 6, padding: "0 12px 8px", overflowX: "auto" }}>
          {activeChips.map(({ key, label, value }, idx) => (
            <div key={`${key}-${idx}`}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: "var(--color-brand-50)", border: "1px solid rgba(192,168,130,0.4)", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-main)", fontSize: 11, fontWeight: 700, color: "var(--text-brand)" }}>{label}</span>
              <button onClick={() => {
                if (key === "minPrice") { onRemoveFilter("minPrice"); onRemoveFilter("maxPrice"); }
                else onRemoveFilter(key, value);
              }} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "var(--text-brand)" }}>
                <X size={10} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
