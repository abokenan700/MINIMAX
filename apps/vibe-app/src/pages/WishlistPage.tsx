import { Heart, SlidersHorizontal, LayoutGrid, List, X, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { CartButton } from "../components/CartButton";
import { SearchBar } from "../components/SearchBar";
import { Stars } from "../components/Stars";
import { useWishlist } from "../context/WishlistContext";
import { ProductCard } from "../components/ProductCard";
import { Divider } from "../components/ui/Divider";
import {
  MiniSheet, FilterBarBtn,
  SortContent, PriceContent, RatingContent, BrandContent,
  type Filters, DEFAULT_FILTERS,
} from "../components/SearchFilters";
import type { Product } from "@workspace/api-client-react";

/* ────────────────────────────────────────────────────────────────
   فلاتر المفضلة — الخيارات والمنطق
──────────────────────────────────────────────────────────────── */
const WISHLIST_SORT_OPTIONS = [
  { key: "default",    label: "الافتراضي (الأحدث إضافةً)" },
  { key: "price_asc",  label: "السعر: الأقل أولاً" },
  { key: "price_desc", label: "السعر: الأعلى أولاً" },
  { key: "rating",     label: "الأعلى تقييماً" },
  { key: "discount",   label: "الأكثر خصماً" },
  { key: "newest",     label: "وصل حديثاً أولاً" },
];

type WishPanelKey = "sort" | "price" | "rating" | "brand" | "extra";

const DISCOUNT_OPTIONS = [
  { label: "١٠٪ فأكثر", val: 10 },
  { label: "٢٠٪ فأكثر", val: 20 },
  { label: "٣٠٪ فأكثر", val: 30 },
  { label: "٥٠٪ فأكثر", val: 50 },
];

/* ────────────────────────────────────────────────────────────────
   لوحة الفلاتر الإضافية (خصم + وصل حديثاً)
──────────────────────────────────────────────────────────────── */
function WishExtraSheet({
  filters, onApply, onClose,
}: { filters: Filters; onApply: (f: Filters) => void; onClose: () => void }) {
  const [local, setLocal] = useState<Filters>(filters);
  const activeCount = [local.minDiscount !== null, local.isNew].filter(Boolean).length;

  return (
    <MiniSheet title={`فلاتر إضافية${activeCount > 0 ? ` (${activeCount})` : ""}`} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <p style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>
            نسبة الخصم
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DISCOUNT_OPTIONS.map(({ label, val }) => {
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

        <button onClick={() => setLocal(p => ({ ...p, isNew: !p.isNew }))}
          style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${local.isNew ? "var(--color-brand-500)" : "var(--border-warm)"}`, background: local.isNew ? "var(--color-brand-50)" : "var(--bg-card)", cursor: "pointer" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${local.isNew ? "var(--color-brand-500)" : "var(--border)"}`, background: local.isNew ? "var(--color-brand-500)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            {local.isNew && <Check size={12} style={{ color: "#fff" }} />}
          </div>
          <span style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: local.isNew ? 700 : 400, color: local.isNew ? "var(--text-brand)" : "var(--text-primary)" }}>
            وصل حديثاً فقط
          </span>
        </button>

        <button onClick={() => { onApply(local); onClose(); }}
          style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", background: "var(--gradient-brand)", color: "#fff", fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "var(--shadow-btn)" }}>
          تطبيق{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>
    </MiniSheet>
  );
}

/* ────────────────────────────────────────────────────────────────
   شريط التحكم والفلاتر
──────────────────────────────────────────────────────────────── */
function WishlistControlsBar({
  count, sort, filters, viewMode, availableBrands,
  onSortChange, onFiltersChange, onViewToggle,
}: {
  count: number;
  sort: string;
  filters: Filters;
  viewMode: "grid" | "list";
  availableBrands: string[];
  onSortChange: (k: string) => void;
  onFiltersChange: (f: Filters) => void;
  onViewToggle: () => void;
}) {
  const [openPanel, setOpenPanel] = useState<WishPanelKey | null>(null);
  const [showExtra, setShowExtra] = useState(false);
  const close = () => setOpenPanel(null);

  const priceActive  = filters.minPrice !== null || filters.maxPrice !== null;
  const ratingActive = filters.minRating !== null;
  const brandActive  = filters.brands.length > 0;
  const sortActive   = sort !== "default";
  const extraCount   = [filters.minDiscount !== null, filters.isNew].filter(Boolean).length;

  const priceLabel  = priceActive
    ? (filters.maxPrice === null
        ? `فوق ${filters.minPrice?.toLocaleString("ar-SA")}`
        : filters.minPrice === null
          ? `تحت ${filters.maxPrice.toLocaleString("ar-SA")}`
          : `${filters.minPrice?.toLocaleString("ar-SA")}–${filters.maxPrice?.toLocaleString("ar-SA")}`)
    : "السعر";
  const ratingLabel = ratingActive ? `${filters.minRating}+ ★` : "التقييم";
  const brandLabel  = brandActive
    ? (filters.brands.length === 1 ? filters.brands[0] : `${filters.brands[0]} +${filters.brands.length - 1}`)
    : "الماركة";
  const sortLabel   = sortActive
    ? (WISHLIST_SORT_OPTIONS.find(s => s.key === sort)?.label ?? "ترتيب")
    : "ترتيب";

  const activeChips: { id: string; label: string; onRemove: () => void }[] = [];
  if (priceActive) activeChips.push({ id: "price", label: priceLabel, onRemove: () => onFiltersChange({ ...filters, minPrice: null, maxPrice: null }) });
  if (ratingActive) activeChips.push({ id: "rating", label: ratingLabel, onRemove: () => onFiltersChange({ ...filters, minRating: null }) });
  if (filters.minDiscount !== null) activeChips.push({ id: "discount", label: `خصم ${filters.minDiscount}%+`, onRemove: () => onFiltersChange({ ...filters, minDiscount: null }) });
  if (filters.isNew) activeChips.push({ id: "isNew", label: "وصل حديثاً", onRemove: () => onFiltersChange({ ...filters, isNew: false }) });
  filters.brands.forEach(b => activeChips.push({ id: `brand-${b}`, label: b, onRemove: () => onFiltersChange({ ...filters, brands: filters.brands.filter(x => x !== b) }) }));

  return (
    <>
      {openPanel === "sort" && (
        <MiniSheet title="ترتيب المفضلة" onClose={close}>
          <SortContent
            sort={sort}
            options={WISHLIST_SORT_OPTIONS}
            onSelect={(k) => { onSortChange(k); close(); }}
            onClose={close}
          />
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
          <BrandContent
            filters={filters}
            onChange={onFiltersChange}
            availableBrands={availableBrands}
          />
        </MiniSheet>
      )}
      {showExtra && (
        <WishExtraSheet
          filters={filters}
          onApply={onFiltersChange}
          onClose={() => setShowExtra(false)}
        />
      )}

      <div dir="rtl" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-warm)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px" }}>
          <div className="hide-scrollbar" style={{ display: "flex", gap: 6, overflowX: "auto", flex: 1 }}>
            <FilterBarBtn label={brandLabel}  active={brandActive}  onClick={() => setOpenPanel("brand")} />
            <FilterBarBtn label={priceLabel}  active={priceActive}  onClick={() => setOpenPanel("price")} />
            <FilterBarBtn label={ratingLabel} active={ratingActive} onClick={() => setOpenPanel("rating")} />
            <FilterBarBtn label={sortLabel}   active={sortActive}   onClick={() => setOpenPanel("sort")} />
            <button onClick={() => setShowExtra(true)}
              style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", borderRadius: 20, border: `1.5px solid ${extraCount > 0 ? "var(--color-brand-500)" : "var(--border-warm)"}`, background: extraCount > 0 ? "var(--color-brand-50)" : "var(--bg-card)", fontFamily: "var(--font-main)", fontSize: 12, fontWeight: extraCount > 0 ? 700 : 500, color: extraCount > 0 ? "var(--text-brand)" : "var(--text-secondary)", cursor: "pointer", whiteSpace: "nowrap" }}>
              <SlidersHorizontal size={11} strokeWidth={2} />
              {extraCount > 0 ? `المزيد (${extraCount})` : "المزيد"}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-main)", fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              {count} منتج
            </span>
            <button onClick={onViewToggle}
              style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid var(--border-warm)", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              aria-label={viewMode === "grid" ? "عرض القائمة" : "عرض الشبكة"}>
              {viewMode === "grid"
                ? <List size={13} style={{ color: "var(--text-secondary)" }} />
                : <LayoutGrid size={13} style={{ color: "var(--text-secondary)" }} />}
            </button>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="hide-scrollbar" style={{ display: "flex", gap: 6, padding: "0 12px 8px", overflowX: "auto" }}>
            {activeChips.map(({ id, label, onRemove }) => (
              <div key={id} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: "var(--color-brand-50)", border: "1px solid rgba(192,168,130,0.4)", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-main)", fontSize: 11, fontWeight: 700, color: "var(--text-brand)" }}>{label}</span>
                <button onClick={onRemove} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "var(--text-brand)" }}>
                  <X size={10} strokeWidth={2.5} />
                </button>
              </div>
            ))}
            <button onClick={() => { onFiltersChange(DEFAULT_FILTERS); onSortChange("default"); }}
              style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 3, padding: "4px 10px", borderRadius: 20, background: "transparent", border: "1px solid var(--border)", fontFamily: "var(--font-main)", fontSize: 11, color: "var(--text-muted)", cursor: "pointer" }}>
              <X size={9} strokeWidth={2.5} />
              مسح الكل
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────
   WISH CARD — عرض الشبكة (يستخدم ProductCard الأصلي مباشرة)
──────────────────────────────────────────────────────────────── */
function WishCard({ item }: { item: Product }) {
  return <ProductCard product={item} layout="vertical" density="compact" />;
}

/* ────────────────────────────────────────────────────────────────
   WISH ROW — عرض القائمة
──────────────────────────────────────────────────────────────── */
function WishRow({ item, onRemove }: { item: Product; onRemove: () => void }) {
  const { isWishlisted } = useWishlist();
  const [, navigate] = useLocation();
  const liked = isWishlisted(item.id);
  return (
    <article
      className="card-pressable flex overflow-hidden"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--elev-2)",
        cursor: "pointer",
        direction: "rtl",
      }}
      aria-label={`${item.name} — ${item.price.toLocaleString("ar-SA")} ريال`}
      onClick={() => navigate(`/product/${item.id}`)}
    >
      {/* صورة المنتج */}
      <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0, background: "var(--card-img-bg)" }}>
        <img
          src={item.image} alt={item.name} loading="lazy"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => { e.currentTarget.style.opacity = "0"; }}
        />
        {/* شارة جديد أو خصم */}
        {item.is_new ? (
          <span style={{ position: "absolute", top: 5, insetInlineStart: 5, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: "var(--radius-xs)", background: "var(--color-brand-500)", color: "#fff" }}>
            جديد
          </span>
        ) : item.discount > 0 ? (
          <span style={{ position: "absolute", top: 5, insetInlineStart: 5, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: "var(--radius-xs)", background: "var(--color-danger-600)", color: "#fff" }}>
            -{item.discount}%
          </span>
        ) : null}
      </div>

      {/* فاصل ذهبي عمودي */}
      <Divider orientation="vertical" />

      {/* المحتوى */}
      <div className="flex flex-col justify-between flex-1 min-w-0" style={{ padding: "10px 12px" }}>
        <div>
          <p style={{ fontSize: "clamp(9px,2.4vw,10.5px)", fontWeight: 700, color: "var(--text-brand)", fontFamily: "var(--font-text)", marginBottom: 2 }}>
            {item.brand}
          </p>
          <p className="line-clamp-2" style={{ fontSize: "clamp(11px,3vw,13px)", fontWeight: 600, color: "var(--text-primary)", lineHeight: "var(--leading-snug)", fontFamily: "var(--font-text)" }}>
            {item.name}
          </p>
          <div className="mt-1">
            <Stars rating={item.rating} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          {/* السعر */}
          <div className="flex items-baseline gap-0.5" dir="ltr">
            <span style={{ fontSize: "clamp(9px,2.4vw,10px)", color: "var(--text-muted)", fontFamily: "var(--font-numeric)" }}>ر.س</span>
            <span style={{ fontSize: "clamp(14px,3.8vw,16px)", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-numeric)", fontVariantNumeric: "tabular-nums" }}>
              {item.price.toLocaleString("ar-SA")}
            </span>
            {item.discount > 0 && (
              <span className="line-through" style={{ fontSize: "clamp(9px,2.4vw,10px)", color: "var(--text-muted)", fontFamily: "var(--font-numeric)", marginInlineStart: 4 }}>
                {item.original_price.toLocaleString("ar-SA")}
              </span>
            )}
          </div>

          {/* أزرار الإجراءات */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              style={{ width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${liked ? "rgba(224,69,69,0.35)" : "var(--border-warm)"}`, background: liked ? "#FEF0EE" : "var(--card-bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
              aria-label="إزالة من المفضلة">
              <Heart size={13} className="fill-red-400 stroke-red-400" />
            </button>
            <div onClick={(e) => e.stopPropagation()}>
              <CartButton size="sm" product={item} selectedColor={item.colors?.[0]} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────
   تطبيق الفلاتر على قائمة المفضلة
──────────────────────────────────────────────────────────────── */
function applyWishlistFilters(items: Product[], sort: string, filters: Filters, query: string): Product[] {
  let list = [...items];

  const q = query.trim().toLowerCase();
  if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));

  if (filters.minPrice    !== null) list = list.filter(p => p.price >= filters.minPrice!);
  if (filters.maxPrice    !== null) list = list.filter(p => p.price <= filters.maxPrice!);
  if (filters.minRating   !== null) list = list.filter(p => p.rating >= filters.minRating!);
  if (filters.minDiscount !== null) list = list.filter(p => p.discount >= filters.minDiscount!);
  if (filters.isNew)                list = list.filter(p => p.is_new);
  if (filters.brands.length > 0)   list = list.filter(p => filters.brands.includes(p.brand));

  switch (sort) {
    case "price_asc":  list.sort((a, b) => a.price - b.price);     break;
    case "price_desc": list.sort((a, b) => b.price - a.price);     break;
    case "rating":     list.sort((a, b) => b.rating - a.rating);   break;
    case "discount":   list.sort((a, b) => b.discount - a.discount); break;
    case "newest":     list.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0)); break;
  }

  return list;
}

/* ────────────────────────────────────────────────────────────────
   الصفحة الرئيسية
──────────────────────────────────────────────────────────────── */
export function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const [, navigate] = useLocation();
  const [sort, setSort]       = useState("default");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [query, setQuery]     = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const availableBrands = useMemo(() =>
    [...new Set(wishlist.map(p => p.brand))].sort(),
    [wishlist]
  );

  const filtered = useMemo(() =>
    applyWishlistFilters(wishlist, sort, filters, query),
    [wishlist, sort, filters, query]
  );

  const hasActiveFilters = sort !== "default" || filters.minPrice !== null || filters.maxPrice !== null
    || filters.minRating !== null || filters.minDiscount !== null || filters.isNew || filters.brands.length > 0;

  return (
    <div style={{ flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", paddingBottom: "var(--nav-h)", background: "var(--bg-surface-warm)" }}>
      <h1 className="sr-only">المفضلة</h1>

      <SearchBar
        placeholder="ابحث في المفضلة..."
        value={query}
        onChange={setQuery}
      />

      <WishlistControlsBar
        count={filtered.length}
        sort={sort}
        filters={filters}
        viewMode={viewMode}
        availableBrands={availableBrands}
        onSortChange={setSort}
        onFiltersChange={setFilters}
        onViewToggle={() => setViewMode(v => v === "grid" ? "list" : "grid")}
      />

      {wishlist.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "var(--color-brand-50)" }}>
            <Heart size={32} style={{ color: "var(--text-brand)" }} strokeWidth={1.5} />
          </div>
          <p className="font-semibold text-center" style={{ color: "var(--text-primary)", fontSize: "16px" }}>المفضلة فارغة</p>
          <p className="text-center" style={{ color: "var(--text-muted)", fontSize: "13px" }}>أضف المنتجات التي تعجبك لتجدها هنا</p>
          <button
            onClick={() => navigate("/categories")}
            style={{ padding: "12px 28px", borderRadius: 14, border: "none", background: "var(--gradient-brand)", color: "#fff", fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4, boxShadow: "var(--shadow-btn)" }}>
            تسوّق الآن
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto hide-scrollbar px-3 pt-3">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <p className="text-center" style={{ color: "var(--text-muted)", fontSize: 13 }}>لا توجد نتائج مطابقة</p>
                {hasActiveFilters && (
                  <button onClick={() => { setFilters(DEFAULT_FILTERS); setSort("default"); }}
                    style={{ padding: "9px 20px", borderRadius: 12, border: "1px solid var(--color-brand-500)", background: "transparent", color: "var(--text-brand)", fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    إعادة ضبط الفلاتر
                  </button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-3 pb-3">
                {filtered.map((item, i) => (
                  <div key={item.id} style={{ animation: `staggerFade 0.25s var(--ease-out) both ${i * 25}ms` }}>
                    <WishCard item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 12 }}>
                {filtered.map((item, i) => (
                  <div key={item.id} style={{ animation: `staggerFade 0.25s var(--ease-out) both ${i * 25}ms` }}>
                    <WishRow item={item} onRemove={() => toggleWishlist(item)} />
                  </div>
                ))}
              </div>
            )}
          </div>
      )}
    </div>
  );
}
