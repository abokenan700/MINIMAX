import { useState, useEffect, useRef } from "react";
import {
  X, Star, Check, SlidersHorizontal,
  List, LayoutGrid, ChevronDown,
} from "lucide-react";
import { l1Categories, l2Categories, l3Categories } from "../data/catalog";

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
  { label: "تحت ٣٠٠",      min: null, max: 300  },
  { label: "٣٠٠ – ٦٠٠",   min: 300,  max: 600  },
  { label: "٦٠٠ – ١٢٠٠", min: 600,  max: 1200 },
  { label: "فوق ١٢٠٠",    min: 1200, max: null  },
];

type PanelKey = "sort" | "price" | "rating" | "brand" | "category";

/* ═══════════════════════════════════════════════════════════════
   MINI BOTTOM SHEET WRAPPER
═══════════════════════════════════════════════════════════════ */
function MiniSheet({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300 }}>
      {/* backdrop */}
      <div onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(26,20,16,0.45)", backdropFilter: "blur(2px)" }} />

      {/* sheet */}
      <div dir="rtl" style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "var(--bg-card)",
        borderRadius: "20px 20px 0 0",
        maxHeight: "70vh",
        display: "flex", flexDirection: "column",
        animation: "sheetUp 0.22s var(--ease-out) both",
        boxShadow: "0 -4px 32px rgba(0,0,0,0.12)",
      }}>
        {/* handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border-warm)", margin: "10px auto 0", flexShrink: 0 }} />

        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 14px", borderBottom: "1px solid var(--border-warm)", flexShrink: 0 }}>
          <h3 style={{ fontFamily: "var(--font-main)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{title}</h3>
          <button onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border-warm)", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={13} style={{ color: "var(--text-muted)" }} />
          </button>
        </div>

        {/* content */}
        <div className="hide-scrollbar" style={{ overflowY: "auto", padding: "14px 16px 24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED CHIP
═══════════════════════════════════════════════════════════════ */
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        flexShrink: 0, display: "flex", alignItems: "center", gap: 4,
        padding: "7px 15px", borderRadius: 20,
        border: `1.5px solid ${active ? "var(--color-brand-500)" : "var(--border-warm)"}`,
        background: active ? "var(--color-brand-50)" : "var(--bg-page)",
        fontFamily: "var(--font-main)", fontSize: 13, fontWeight: active ? 700 : 500,
        color: active ? "var(--text-brand)" : "var(--text-secondary)",
        cursor: "pointer", transition: "all 0.15s",
      }}>
      {active && <Check size={11} strokeWidth={2.5} style={{ color: "var(--color-brand-500)", flexShrink: 0 }} />}
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FILTER BAR BUTTON
═══════════════════════════════════════════════════════════════ */
function FilterBarBtn({ label, active, onClick }: {
  label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      style={{
        flexShrink: 0, display: "flex", alignItems: "center", gap: 3,
        padding: "6px 10px 6px 8px", borderRadius: 20,
        border: `1.5px solid ${active ? "var(--color-brand-500)" : "var(--border-warm)"}`,
        background: active ? "var(--color-brand-50)" : "var(--bg-card)",
        fontFamily: "var(--font-main)", fontSize: 12, fontWeight: active ? 700 : 500,
        color: active ? "var(--text-brand)" : "var(--text-secondary)",
        cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
      }}>
      <span>{label}</span>
      <ChevronDown size={10} strokeWidth={2.5}
        style={{ color: active ? "var(--color-brand-500)" : "var(--text-muted)", flexShrink: 0 }} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SORT PANEL CONTENT
═══════════════════════════════════════════════════════════════ */
function SortContent({ sort, onSelect, onClose }: {
  sort: string; onSelect: (k: string) => void; onClose: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {SORT_OPTIONS.map(({ key, label }) => {
        const active = sort === key;
        return (
          <button key={key}
            onClick={() => { onSelect(key); onClose(); }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "13px 14px",
              borderRadius: 12,
              border: `1.5px solid ${active ? "var(--color-brand-500)" : "transparent"}`,
              background: active ? "var(--color-brand-50)" : "var(--bg-page)",
              cursor: "pointer",
            }}>
            <span style={{ fontFamily: "var(--font-main)", fontSize: 14, fontWeight: active ? 700 : 400, color: active ? "var(--text-brand)" : "var(--text-primary)" }}>
              {label}
            </span>
            {active && <Check size={15} style={{ color: "var(--color-brand-500)" }} />}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRICE PANEL CONTENT
═══════════════════════════════════════════════════════════════ */
function PriceContent({ filters, onChange, onClose }: {
  filters: Filters; onChange: (f: Filters) => void; onClose: () => void;
}) {
  function isActive(min: number | null, max: number | null) {
    return filters.minPrice === min && filters.maxPrice === max;
  }
  function toggle(min: number | null, max: number | null) {
    if (isActive(min, max)) onChange({ ...filters, minPrice: null, maxPrice: null });
    else onChange({ ...filters, minPrice: min, maxPrice: max });
    onClose();
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {PRICE_RANGES.map(({ label, min, max }) => (
        <Chip key={label} label={label} active={isActive(min, max)} onClick={() => toggle(min, max)} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RATING PANEL CONTENT
═══════════════════════════════════════════════════════════════ */
function RatingContent({ filters, onChange, onClose }: {
  filters: Filters; onChange: (f: Filters) => void; onClose: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[5, 4, 3].map((r) => {
        const active = filters.minRating === r;
        return (
          <button key={r}
            onClick={() => { onChange({ ...filters, minRating: active ? null : r }); if (!active) onClose(); }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "13px 14px", borderRadius: 12,
              border: `1.5px solid ${active ? "var(--color-brand-500)" : "transparent"}`,
              background: active ? "var(--color-brand-50)" : "var(--bg-page)", cursor: "pointer",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14}
                    style={{ fill: i < r ? "var(--color-brand-500)" : "var(--border-warm)", stroke: i < r ? "var(--color-brand-500)" : "var(--border-warm)" }} />
                ))}
              </div>
              <span style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: active ? 700 : 400, color: active ? "var(--text-brand)" : "var(--text-primary)" }}>
                {r}+ نجوم
              </span>
            </div>
            {active && <Check size={15} style={{ color: "var(--color-brand-500)" }} />}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BRAND PANEL CONTENT
═══════════════════════════════════════════════════════════════ */
function BrandContent({ filters, onChange }: {
  filters: Filters; onChange: (f: Filters) => void;
}) {
  function toggle(b: string) {
    const brands = filters.brands.includes(b)
      ? filters.brands.filter(x => x !== b)
      : [...filters.brands, b];
    onChange({ ...filters, brands });
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {ALL_BRANDS.map((b) => (
        <Chip key={b} label={b} active={filters.brands.includes(b)} onClick={() => toggle(b)} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY PANEL CONTENT  (L1 selected → L2 + L3)
═══════════════════════════════════════════════════════════════ */
function CategoryContent({ categoryParam, onSelect }: {
  categoryParam: string; onSelect: (l1Label: string, l2Label?: string) => void;
}) {
  const currentL1   = l1Categories.find(c => c.label === categoryParam) ?? null;
  const [activeL1Id,  setActiveL1Id]  = useState<string | null>(currentL1?.id ?? null);
  const [activeL2Id,  setActiveL2Id]  = useState<string | null>(null);

  const l2ForActive = activeL1Id ? l2Categories.filter(c => c.parentId === activeL1Id) : [];
  const l2IdsForActive = l2ForActive.map(c => c.id);
  const l3ForActive = activeL2Id
    ? l3Categories.filter(c => c.parentId === activeL2Id)
    : l2IdsForActive.length > 0
      ? l3Categories.filter(c => l2IdsForActive.includes(c.parentId))
      : [];

  const activeL1Label = l1Categories.find(c => c.id === activeL1Id)?.label ?? "";
  const activeL2Label = l2Categories.find(c => c.id === activeL2Id)?.label ?? "";

  function handleL1(id: string, label: string) {
    if (activeL1Id === id) {
      setActiveL1Id(null); setActiveL2Id(null); onSelect("");
    } else {
      setActiveL1Id(id); setActiveL2Id(null); onSelect(label);
    }
  }

  function handleL2(id: string, label: string) {
    if (activeL2Id === id) {
      setActiveL2Id(null); onSelect(activeL1Label);
    } else {
      setActiveL2Id(id); onSelect(activeL1Label, label);
    }
  }

  function handleL3(label: string) {
    onSelect(activeL1Label, activeL2Label ? `${activeL2Label} — ${label}` : label);
  }

  return (
    <div>
      {/* ── إذا لا يوجد L1 محدد: اعرض كل الفئات الرئيسية ── */}
      {!activeL1Id && (
        <>
          <p style={{ fontFamily: "var(--font-main)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, letterSpacing: 0.3 }}>
            الفئة الرئيسية
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
            {l1Categories.map(({ id, label }) => (
              <Chip key={id} label={label} active={activeL1Id === id} onClick={() => handleL1(id, label)} />
            ))}
          </div>
        </>
      )}

      {/* ── L2: الفئات الفرعية ── */}
      {l2ForActive.length > 0 && (
        <>
          <div style={{ height: 1, background: "var(--border-warm)", margin: "10px 0 14px" }} />
          <p style={{ fontFamily: "var(--font-main)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, letterSpacing: 0.3 }}>
            الفئة الفرعية
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {l2ForActive.map(({ id, label }) => (
              <Chip key={id} label={label} active={activeL2Id === id} onClick={() => handleL2(id, label)} />
            ))}
          </div>
        </>
      )}

      {/* ── L3: الفئات الثانوية ── */}
      {l3ForActive.length > 0 && (
        <>
          <div style={{ height: 1, background: "var(--border-warm)", margin: "10px 0 14px" }} />
          <p style={{ fontFamily: "var(--font-main)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, letterSpacing: 0.3 }}>
            الفئة الثانوية
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {l3ForActive.map(({ id, label }) => (
              <Chip key={id} label={label} active={false} onClick={() => handleL3(label)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RangeSlider  (for FilterSheet)
═══════════════════════════════════════════════════════════════ */
function RangeSlider({ min, max, valueMin, valueMax, onChange }: {
  min: number; max: number; valueMin: number | null; valueMax: number | null;
  onChange: (min: number | null, max: number | null) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const vMin = valueMin ?? min;
  const vMax = valueMax ?? max;
  const pctMin = ((vMin - min) / (max - min)) * 100;
  const pctMax = ((vMax - min) / (max - min)) * 100;

  function getVal(e: React.PointerEvent, type: "min" | "max") {
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
              e.currentTarget.onpointermove = (ev) => getVal(ev as unknown as React.PointerEvent, type);
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

/* ═══════════════════════════════════════════════════════════════
   FILTER SHEET  (discount + sizes + new only)
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

  const activeCount = [local.minDiscount !== null, local.isNew, local.sizes.length > 0].filter(Boolean).length;

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
              <button onClick={() => setLocal(p => ({ ...p, minDiscount: null, isNew: false, sizes: [] }))}
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
   CONTROLS BAR — main export
═══════════════════════════════════════════════════════════════ */
export function ControlsBar({ count, sort, filters, viewMode, categoryParam,
  onSortSelect, onFiltersChange, onFilterOpen, onViewToggle, onCategorySelect, onRemoveFilter,
}: {
  count:            number;
  sort:             string;
  filters:          Filters;
  viewMode:         "grid" | "list";
  categoryParam:    string;
  onSortSelect:     (key: string) => void;
  onFiltersChange:  (f: Filters) => void;
  onFilterOpen:     () => void;
  onViewToggle:     () => void;
  onCategorySelect: (l1Label: string, l2Label?: string) => void;
  onRemoveFilter:   (key: keyof Filters, value?: string) => void;
}) {
  const [openPanel, setOpenPanel] = useState<PanelKey | null>(null);
  const close = () => setOpenPanel(null);

  /* active states */
  const priceActive    = filters.minPrice !== null || filters.maxPrice !== null;
  const ratingActive   = filters.minRating !== null;
  const brandActive    = filters.brands.length > 0;
  const categoryActive = categoryParam.trim().length > 0;
  const sortActive     = sort !== "default";
  const extraCount     = [filters.minDiscount !== null, filters.isNew, filters.sizes.length > 0].filter(Boolean).length;

  /* label helpers */
  const priceLabel = priceActive
    ? (filters.maxPrice === null
        ? `فوق ${filters.minPrice?.toLocaleString("ar-SA")}`
        : filters.minPrice === null
          ? `تحت ${filters.maxPrice.toLocaleString("ar-SA")}`
          : `${filters.minPrice?.toLocaleString("ar-SA")}–${filters.maxPrice?.toLocaleString("ar-SA")}`)
    : "السعر";
  const ratingLabel   = ratingActive ? `${filters.minRating}+ ★` : "التقييم";
  const brandLabel    = brandActive
    ? (filters.brands.length === 1 ? filters.brands[0] : `${filters.brands[0]} +${filters.brands.length - 1}`)
    : "الماركة";
  const categoryLabel = categoryActive ? categoryParam : "الفئة";
  const sortLabel     = sortActive ? (SORT_OPTIONS.find(s => s.key === sort)?.label ?? "ترتيب") : "ترتيب";

  /* active chips */
  const activeChips: { key: keyof Filters; label: string; value?: string }[] = [];
  if (priceActive) {
    activeChips.push({ key: "minPrice", label: priceLabel });
  }
  if (ratingActive)  activeChips.push({ key: "minRating",   label: ratingLabel });
  if (filters.minDiscount !== null) activeChips.push({ key: "minDiscount", label: `خصم ${filters.minDiscount}%+` });
  if (filters.isNew) activeChips.push({ key: "isNew", label: "وصل حديثاً" });
  filters.brands.forEach(b => activeChips.push({ key: "brands", label: b, value: b }));
  filters.sizes.forEach(s  => activeChips.push({ key: "sizes",  label: s, value: s }));

  return (
    <>
      {/* ── mini sheet popups (rendered in portal-like fixed layer) */}
      {openPanel === "sort" && (
        <MiniSheet title="ترتيب النتائج" onClose={close}>
          <SortContent sort={sort} onSelect={onSortSelect} onClose={close} />
        </MiniSheet>
      )}
      {openPanel === "price" && (
        <MiniSheet title="نطاق السعر" onClose={close}>
          <PriceContent filters={filters} onChange={onFiltersChange} onClose={close} />
        </MiniSheet>
      )}
      {openPanel === "rating" && (
        <MiniSheet title="التقييم" onClose={close}>
          <RatingContent filters={filters} onChange={onFiltersChange} onClose={close} />
        </MiniSheet>
      )}
      {openPanel === "brand" && (
        <MiniSheet title="الماركة" onClose={close}>
          <BrandContent filters={filters} onChange={onFiltersChange} />
        </MiniSheet>
      )}
      {openPanel === "category" && (
        <MiniSheet title="الفئة" onClose={close}>
          <CategoryContent categoryParam={categoryParam} onSelect={(l1, l2) => { onCategorySelect(l1, l2); }} />
        </MiniSheet>
      )}

      {/* ── sticky bar */}
      <div dir="rtl" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-warm)" }}>

        {/* button row */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px" }}>
          <div className="hide-scrollbar" style={{ display: "flex", gap: 6, overflowX: "auto", flex: 1 }}>
            <FilterBarBtn label={sortLabel}     active={sortActive}     onClick={() => setOpenPanel("sort")} />
            <FilterBarBtn label={priceLabel}    active={priceActive}    onClick={() => setOpenPanel("price")} />
            <FilterBarBtn label={ratingLabel}   active={ratingActive}   onClick={() => setOpenPanel("rating")} />
            <FilterBarBtn label={brandLabel}    active={brandActive}    onClick={() => setOpenPanel("brand")} />
            <FilterBarBtn label={categoryLabel} active={categoryActive} onClick={() => setOpenPanel("category")} />

            {/* extra filters button */}
            <button onClick={onFilterOpen}
              style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: 4,
                padding: "6px 10px", borderRadius: 20,
                border: `1.5px solid ${extraCount > 0 ? "var(--color-brand-500)" : "var(--border-warm)"}`,
                background: extraCount > 0 ? "var(--color-brand-50)" : "var(--bg-card)",
                fontFamily: "var(--font-main)", fontSize: 12, fontWeight: extraCount > 0 ? 700 : 500,
                color: extraCount > 0 ? "var(--text-brand)" : "var(--text-secondary)", cursor: "pointer", whiteSpace: "nowrap",
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

        {/* active chips row */}
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
    </>
  );
}
