import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, X, SlidersHorizontal, ShieldCheck, ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { SearchBar } from "../components/SearchBar";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useGetProducts } from "@workspace/api-client-react";
import type { CartItem } from "../context/CartContext";
import type { Product } from "@workspace/api-client-react";
import { calcShipping } from "../lib/shippingPolicy";
import { ProductCard } from "../components/ProductCard";
import { Heart } from "../components/ui/Heart";
import { Divider } from "../components/ui/Divider";
import { Badge } from "../components/ui/Badge";
import {
  MiniSheet, FilterBarBtn, Chip,
  SortContent, PriceContent, BrandContent,
  type Filters, DEFAULT_FILTERS,
} from "../components/SearchFilters";

/* ═══════════════════════════════════════════════════════════════
   خيارات الترتيب الخاصة بالسلة
═══════════════════════════════════════════════════════════════ */
const CART_SORT_OPTIONS = [
  { key: "default",    label: "الافتراضي (ترتيب الإضافة)" },
  { key: "price_asc",  label: "السعر: الأقل أولاً" },
  { key: "price_desc", label: "السعر: الأعلى أولاً" },
  { key: "qty_desc",   label: "الكمية: الأعلى أولاً" },
  { key: "discount",   label: "الأكثر خصماً أولاً" },
];

const DISCOUNT_OPTIONS = [
  { label: "١٠٪ فأكثر", val: 10 },
  { label: "٢٠٪ فأكثر", val: 20 },
  { label: "٣٠٪ فأكثر", val: 30 },
  { label: "٥٠٪ فأكثر", val: 50 },
];

type CartPanelKey = "sort" | "price" | "brand" | "category" | "extra";

/* ═══════════════════════════════════════════════════════════════
   Coupon Input — تصميم فاخر
═══════════════════════════════════════════════════════════════ */
function CouponInput() {
  const { couponCode, applyCoupon, removeCoupon, discountPct } = useCart();
  const [code, setCode]   = useState("");
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState("");

  async function apply() {
    const trimmed = code.trim();
    if (!trimmed) return;
    setBusy(true); setError("");
    try {
      await applyCoupon(trimmed);
      toast.success(`تم تطبيق كوبون خصم ${discountPct || ""}٪ 🎉`);
      setCode("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "كوبون غير صالح";
      setError(msg); toast.error(msg);
    } finally { setBusy(false); }
  }

  function reset() { removeCoupon(); setCode(""); setError(""); toast("تم إلغاء الكوبون"); }
  const applied = !!couponCode;

  return (
    <div dir="rtl" style={{ margin: "12px 12px 0", borderRadius: 18, overflow: "hidden", border: `1.5px solid ${error ? "rgba(224,69,69,0.5)" : applied ? "rgba(212,175,55,0.55)" : "var(--border-warm)"}`, background: "var(--bg-card)", transition: "border-color 0.25s" }}>
      {/* رأس الكوبون */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: `1px solid ${applied ? "rgba(212,175,55,0.2)" : "var(--border)"}` }}>
        <div style={{ width: 30, height: 30, borderRadius: 10, background: applied ? "linear-gradient(135deg,#d4af37,#b8933a)" : "var(--color-brand-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.3s" }}>
          <Tag size={14} style={{ color: applied ? "#fff" : "var(--color-brand-500)" }} />
        </div>
        <span style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
          {applied ? "كود الخصم مُفعَّل" : "لديك كود خصم؟"}
        </span>
        {applied && (
          <span style={{ marginInlineStart: "auto", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "linear-gradient(135deg,rgba(212,175,55,0.15),rgba(184,118,62,0.15))", color: "#b8933a", border: "1px solid rgba(212,175,55,0.35)" }}>
            خصم {discountPct}٪
          </span>
        )}
      </div>

      {/* حقل الإدخال أو حالة التطبيق */}
      <div style={{ padding: "10px 14px" }}>
        {applied ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontFamily: "var(--font-numeric)", fontSize: 14, fontWeight: 700, letterSpacing: 2, color: "#b8933a" }}>
                {couponCode}
              </span>
            </div>
            <button onClick={reset}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 20, border: "1px solid var(--border)", background: "transparent", fontFamily: "var(--font-main)", fontSize: 11, color: "var(--text-muted)", cursor: "pointer" }}>
              <X size={11} strokeWidth={2.5} />
              إلغاء
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && void apply()}
              placeholder="أدخل الكود هنا"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-numeric)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", direction: "rtl", letterSpacing: 2 }}
            />
            <button
              onClick={() => void apply()}
              disabled={busy || !code.trim()}
              style={{ padding: "8px 18px", borderRadius: 12, border: "none", background: busy || !code.trim() ? "var(--bg-surface-warm)" : "var(--gradient-brand)", color: busy || !code.trim() ? "var(--text-muted)" : "#fff", fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, cursor: busy || !code.trim() ? "not-allowed" : "pointer", whiteSpace: "nowrap", transition: "all 0.2s", boxShadow: !busy && code.trim() ? "var(--shadow-btn)" : "none" }}>
              {busy ? "جاري..." : "تطبيق"}
            </button>
          </div>
        )}
        {error && (
          <p style={{ fontSize: 11, color: "#E04545", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "#E04545", flexShrink: 0 }} />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   لوحة فلاتر إضافية للسلة (خصم فقط)
═══════════════════════════════════════════════════════════════ */
function CartExtraSheet({
  minDiscount, onApply, onClose,
}: { minDiscount: number | null; onApply: (val: number | null) => void; onClose: () => void }) {
  const [local, setLocal] = useState<number | null>(minDiscount);

  return (
    <MiniSheet title="فلتر الخصم" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <p style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>
            اعرض المنتجات التي عليها خصم بنسبة
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DISCOUNT_OPTIONS.map(({ label, val }) => {
              const active = local === val;
              return (
                <button key={val}
                  onClick={() => setLocal(active ? null : val)}
                  style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${active ? "var(--color-brand-500)" : "var(--border-warm)"}`, background: active ? "var(--color-brand-50)" : "var(--bg-card)", fontFamily: "var(--font-main)", fontSize: 12, fontWeight: active ? 700 : 400, color: active ? "var(--text-brand)" : "var(--text-secondary)", cursor: "pointer" }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <button onClick={() => { onApply(local); onClose(); }}
          style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", background: "var(--gradient-brand)", color: "#fff", fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "var(--shadow-btn)" }}>
          تطبيق
        </button>
      </div>
    </MiniSheet>
  );
}

/* ═══════════════════════════════════════════════════════════════
   لوحة الفئات الخاصة بالسلة
═══════════════════════════════════════════════════════════════ */
function CartCategoryContent({
  filters, onChange, availableCategories,
}: { filters: Filters; onChange: (f: Filters) => void; availableCategories: string[] }) {
  function toggle(cat: string) {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  }
  if (availableCategories.length === 0)
    return <p style={{ fontFamily: "var(--font-main)", fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>لا توجد فئات في السلة</p>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {availableCategories.map(cat => (
        <Chip key={cat} label={cat} active={filters.categories.includes(cat)} onClick={() => toggle(cat)} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   شريط التحكم والفلاتر الخاص بالسلة
═══════════════════════════════════════════════════════════════ */
function CartControlsBar({
  count, sort, filters, availableBrands, availableCategories,
  onSortChange, onFiltersChange,
}: {
  count: number;
  sort: string;
  filters: Filters;
  availableBrands: string[];
  availableCategories: string[];
  onSortChange: (k: string) => void;
  onFiltersChange: (f: Filters) => void;
}) {
  const [openPanel, setOpenPanel] = useState<CartPanelKey | null>(null);
  const [showExtra, setShowExtra] = useState(false);
  const close = () => setOpenPanel(null);

  const priceActive    = filters.minPrice !== null || filters.maxPrice !== null;
  const brandActive    = filters.brands.length > 0;
  const categoryActive = filters.categories.length > 0;
  const sortActive     = sort !== "default";
  const discountActive = filters.minDiscount !== null;

  const priceLabel = priceActive
    ? (filters.maxPrice === null
        ? `فوق ${filters.minPrice?.toLocaleString("ar-SA")}`
        : filters.minPrice === null
          ? `تحت ${filters.maxPrice.toLocaleString("ar-SA")}`
          : `${filters.minPrice?.toLocaleString("ar-SA")}–${filters.maxPrice?.toLocaleString("ar-SA")}`)
    : "السعر";
  const brandLabel    = brandActive
    ? (filters.brands.length === 1 ? filters.brands[0] : `${filters.brands[0]} +${filters.brands.length - 1}`)
    : "الماركة";
  const categoryLabel = categoryActive
    ? (filters.categories.length === 1 ? filters.categories[0] : `${filters.categories[0]} +${filters.categories.length - 1}`)
    : "الفئة";
  const sortLabel = sortActive
    ? (CART_SORT_OPTIONS.find(s => s.key === sort)?.label ?? "ترتيب")
    : "ترتيب";

  const activeChips: { id: string; label: string; onRemove: () => void }[] = [];
  if (priceActive) activeChips.push({ id: "price", label: priceLabel, onRemove: () => onFiltersChange({ ...filters, minPrice: null, maxPrice: null }) });
  if (discountActive) activeChips.push({ id: "discount", label: `خصم ${filters.minDiscount}%+`, onRemove: () => onFiltersChange({ ...filters, minDiscount: null }) });
  filters.brands.forEach(b => activeChips.push({ id: `brand-${b}`, label: b, onRemove: () => onFiltersChange({ ...filters, brands: filters.brands.filter(x => x !== b) }) }));
  filters.categories.forEach(c => activeChips.push({ id: `cat-${c}`, label: c, onRemove: () => onFiltersChange({ ...filters, categories: filters.categories.filter(x => x !== c) }) }));

  return (
    <>
      {openPanel === "sort" && (
        <MiniSheet title="ترتيب السلة" onClose={close}>
          <SortContent sort={sort} options={CART_SORT_OPTIONS} onSelect={(k) => { onSortChange(k); close(); }} onClose={close} />
        </MiniSheet>
      )}
      {openPanel === "price" && (
        <MiniSheet title="نطاق السعر" onClose={close}>
          <PriceContent filters={filters} onChange={onFiltersChange} onClose={close} />
        </MiniSheet>
      )}
      {openPanel === "brand" && (
        <MiniSheet title="الماركة" onClose={close}>
          <BrandContent filters={filters} onChange={onFiltersChange} availableBrands={availableBrands} />
        </MiniSheet>
      )}
      {openPanel === "category" && (
        <MiniSheet title="الفئة" onClose={close}>
          <CartCategoryContent filters={filters} onChange={onFiltersChange} availableCategories={availableCategories} />
        </MiniSheet>
      )}
      {showExtra && (
        <CartExtraSheet
          minDiscount={filters.minDiscount}
          onApply={(val) => onFiltersChange({ ...filters, minDiscount: val })}
          onClose={() => setShowExtra(false)}
        />
      )}

      <div dir="rtl" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-warm)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px" }}>

          <div className="hide-scrollbar" style={{ display: "flex", gap: 6, overflowX: "auto", flex: 1 }}>
            <FilterBarBtn label={categoryLabel} active={categoryActive} onClick={() => setOpenPanel("category")} />
            <FilterBarBtn label={brandLabel}    active={brandActive}    onClick={() => setOpenPanel("brand")} />
            <FilterBarBtn label={priceLabel}    active={priceActive}    onClick={() => setOpenPanel("price")} />
            <FilterBarBtn label={sortLabel}     active={sortActive}     onClick={() => setOpenPanel("sort")} />
            <button onClick={() => setShowExtra(true)}
              style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", borderRadius: 20, border: `1.5px solid ${discountActive ? "var(--color-brand-500)" : "var(--border-warm)"}`, background: discountActive ? "var(--color-brand-50)" : "var(--bg-card)", fontFamily: "var(--font-main)", fontSize: 12, fontWeight: discountActive ? 700 : 500, color: discountActive ? "var(--text-brand)" : "var(--text-secondary)", cursor: "pointer", whiteSpace: "nowrap" }}>
              <SlidersHorizontal size={11} strokeWidth={2} />
              {discountActive ? `الخصم (${filters.minDiscount}%+)` : "الخصم"}
            </button>
          </div>

          <span style={{ fontFamily: "var(--font-main)", fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0 }}>
            {count} منتج
          </span>
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

/* ═══════════════════════════════════════════════════════════════
   Cart Item Card — نفس شكل ProductCard العمودي
═══════════════════════════════════════════════════════════════ */
function CartItemCard({ item, onQtyChange, onRemove }: {
  item: CartItem;
  onQtyChange: (id: number, color: string, delta: number) => void;
  onRemove: (id: number, color: string) => void;
}) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [, navigate] = useLocation();
  const itemDiscount = (item as CartItem & { discount?: number }).discount ?? 0;
  const wished = isWishlisted(item.id);

  function handleSaveForLater(e: React.MouseEvent) {
    e.stopPropagation();
    const fakeProduct = {
      id: item.id, name: item.name, brand: item.brand, price: item.price,
      image: item.image, category: "", slug: item.name,
      stock: 10, sales: 0, rating: 0, reviewCount: 0,
      colors: item.color ? [item.color] : [],
      discount: itemDiscount, original_price: item.price,
      is_new: false,
    } as unknown as Product;
    toggleWishlist(fakeProduct);
    if (!wished) {
      onRemove(item.id, item.color);
      toast("تم حفظ المنتج للوقت لاحقاً ❤️");
    }
  }

  return (
    <article
      className="card-pressable flex flex-col overflow-hidden relative"
      onClick={() => navigate(`/product/${item.id}`)}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--elev-2)",
        cursor: "pointer",
      }}
    >
      {/* ── أيقونة المفضلة ── */}
      <div style={{ position: "absolute", top: 6, insetInlineEnd: 6, zIndex: 10 }}>
        <Heart pressed={wished} size={13} onClick={handleSaveForLater} />
      </div>

      {/* ── خصم + لون ── */}
      <div style={{ position: "absolute", top: 32, insetInlineStart: 4, zIndex: 10, display: "flex", flexDirection: "column", gap: 3 }}>
        {itemDiscount > 0 && (
          <span style={{ background: "var(--color-danger-600)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: "var(--radius-xs)", fontFamily: "var(--font-numeric)" }}>
            -{itemDiscount}%
          </span>
        )}
      </div>

      {/* ── الصورة ── */}
      <div className="relative w-full" style={{ aspectRatio: "1 / 1", background: "var(--card-img-bg)" }}>
        <img
          src={item.image} alt={item.name} loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.opacity = "0"; }}
        />
        {/* لون مختار */}
        {item.color && (
          <div style={{ position: "absolute", bottom: 6, insetInlineStart: 6, display: "flex", alignItems: "center", gap: 3, background: "rgba(255,255,255,0.88)", borderRadius: 20, padding: "2px 6px 2px 4px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, border: "1px solid rgba(0,0,0,0.12)", flexShrink: 0 }} />
            <span style={{ fontSize: 9, color: "var(--text-secondary)", fontWeight: 600 }}>{item.color}</span>
          </div>
        )}
      </div>

      <Divider />

      {/* ── المحتوى ── */}
      <div className="flex flex-col gap-0.5 px-2 pt-1.5 pb-2">
        <p style={{ fontSize: "clamp(9.5px,2.6vw,11px)", color: "var(--text-brand)", fontWeight: 700, letterSpacing: "0.3px", fontFamily: "var(--font-text)" }}>
          {item.brand}
        </p>
        <p className="line-clamp-2" style={{ fontSize: "clamp(11px,3vw,13px)", color: "var(--text-primary)", fontWeight: 600, lineHeight: "var(--leading-snug)", fontFamily: "var(--font-text)" }}>
          {item.name}
        </p>

        {/* السعر */}
        <div className="flex items-baseline justify-between mt-0.5" dir="rtl">
          <div className="flex items-baseline gap-0.5" dir="ltr">
            <span style={{ fontSize: "clamp(9px,2.4vw,10px)", color: "var(--text-muted)", fontFamily: "var(--font-numeric)" }}>ر.س</span>
            <span style={{ fontSize: "clamp(14px,3.8vw,16px)", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-numeric)", fontVariantNumeric: "tabular-nums" }}>
              {(item.price * item.qty).toLocaleString("ar-SA")}
            </span>
          </div>
          {itemDiscount > 0 && (
            <Badge variant="discount-soft" size="sm">خصم {itemDiscount}%</Badge>
          )}
        </div>

        {/* أدوات الكمية والحذف */}
        <div className="flex items-center justify-between mt-1" onClick={(e) => e.stopPropagation()}>
            {/* حذف */}
            <button onClick={() => onRemove(item.id, item.color)}
              style={{ minWidth: 36, minHeight: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer" }}
              aria-label="إزالة">
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#FEF0EE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Trash2 size={11} style={{ color: "var(--color-danger-600)" }} />
              </span>
            </button>

            {/* الكمية */}
            <div className="flex items-center rounded-full" style={{ background: "#F0F0F0", border: "1px solid #E8E8E8" }}>
              <button onClick={() => onQtyChange(item.id, item.color, -1)}
                style={{ minWidth: 34, minHeight: 34, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-brand)", background: "none", border: "none", cursor: "pointer" }}
                aria-label="تقليل الكمية">
                <Minus size={11} strokeWidth={2.5} />
              </button>
              <span style={{ fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: "center", color: "var(--text-primary)", fontFamily: "var(--font-numeric)" }}>{item.qty}</span>
              <button onClick={() => onQtyChange(item.id, item.color, 1)}
                style={{ minWidth: 34, minHeight: 34, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-brand)", background: "none", border: "none", cursor: "pointer" }}
                aria-label="زيادة الكمية">
                <Plus size={11} strokeWidth={2.5} />
              </button>
            </div>
          </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Cart Upsell — يستخدم ProductCard الأصلي
═══════════════════════════════════════════════════════════════ */
function CartUpsell() {
  const { data: products = [] } = useGetProducts();
  const { items } = useCart();
  const cartIds = useMemo(() => new Set(items.map(i => i.id)), [items]);
  const suggestions = useMemo(
    () => products.filter(p => !cartIds.has(p.id)).slice(0, 8),
    [products, cartIds]
  );
  if (suggestions.length === 0) return null;
  return (
    <div dir="rtl" style={{ margin: "8px 0 0" }}>
      <p style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)", padding: "10px 12px 8px" }}>
        قد يعجبك أيضاً
      </p>
      <div className="hide-scrollbar" style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 12px 14px" }}>
        {suggestions.map((p) => (
          <div key={p.id} style={{ flexShrink: 0, width: 150 }}>
            <ProductCard product={p} layout="vertical" density="compact" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   تطبيق الفلاتر على عناصر السلة
═══════════════════════════════════════════════════════════════ */
function applyCartFilters(
  items: CartItem[], sort: string, filters: Filters, query: string,
  productCategoryMap: Map<number, string>,
): CartItem[] {
  let list = [...items];

  const q = query.trim().toLowerCase();
  if (q) list = list.filter(it => it.name.toLowerCase().includes(q) || it.brand.toLowerCase().includes(q));

  if (filters.minPrice !== null) list = list.filter(it => it.price >= filters.minPrice!);
  if (filters.maxPrice !== null) list = list.filter(it => it.price <= filters.maxPrice!);
  if (filters.minDiscount !== null) list = list.filter(it => ((it as CartItem & { discount?: number }).discount ?? 0) >= filters.minDiscount!);
  if (filters.brands.length > 0) list = list.filter(it => filters.brands.includes(it.brand));
  if (filters.categories.length > 0) list = list.filter(it => {
    const cat = productCategoryMap.get(it.id);
    return cat ? (filters.categories as string[]).includes(cat) : false;
  });

  switch (sort) {
    case "price_asc":  list.sort((a, b) => a.price - b.price); break;
    case "price_desc": list.sort((a, b) => b.price - a.price); break;
    case "qty_desc":   list.sort((a, b) => b.qty - a.qty);     break;
    case "discount":   list.sort((a, b) => ((b as CartItem & { discount?: number }).discount ?? 0) - ((a as CartItem & { discount?: number }).discount ?? 0)); break;
  }

  return list;
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export function CartPage() {
  const { items, total, discountAmount, couponCode, removeFromCart, updateQty } = useCart();
  const [, navigate] = useLocation();
  const [query, setQuery]   = useState("");
  const [sort, setSort]     = useState("default");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const { data: allProducts } = useGetProducts();

  const productCategoryMap = useMemo(() => {
    const map = new Map<number, string>();
    (allProducts ?? []).forEach(p => { const cat = (p as unknown as { category?: string }).category; if (cat) map.set(p.id, cat); });
    return map;
  }, [allProducts]);

  const availableBrands = useMemo(() =>
    [...new Set(items.map(it => it.brand))].sort(),
    [items]
  );

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach(it => {
      const cat = productCategoryMap.get(it.id);
      if (cat) cats.add(cat);
    });
    return [...cats].sort();
  }, [items, productCategoryMap]);

  const filtered = useMemo(() =>
    applyCartFilters(items, sort, filters, query, productCategoryMap),
    [items, sort, filters, query, productCategoryMap]
  );

  const shipping   = calcShipping(total);
  const grandTotal = total - discountAmount + shipping;

  return (
    <div style={{ flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", paddingBottom: "var(--nav-h)", background: "var(--bg-surface-warm)" }}>
      <h1 className="sr-only">السلة</h1>

      <SearchBar
        placeholder="ابحث في السلة..."
        value={query}
        onChange={setQuery}
      />

      <CartControlsBar
        count={filtered.length}
        sort={sort}
        filters={filters}
        availableBrands={availableBrands}
        availableCategories={availableCategories}
        onSortChange={setSort}
        onFiltersChange={setFilters}
      />

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "var(--color-brand-50)" }}>
            <ShoppingBag size={32} style={{ color: "var(--text-brand)" }} strokeWidth={1.5} />
          </div>
          <p className="font-semibold text-center" style={{ color: "var(--text-primary)", fontSize: "16px" }}>السلة فارغة</p>
          <p className="text-center" style={{ color: "var(--text-muted)", fontSize: "13px" }}>أضف منتجاتك المفضلة وابدأ التسوق</p>
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold"
            style={{ background: "var(--gradient-brand)", color: "#fff", fontSize: "13px", fontFamily: "var(--font-main)" }}>
            <ArrowRight size={15} strokeWidth={2} />
            ابدأ التسوق
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col" dir="rtl">
            <div style={{ padding: "12px 12px 0" }}>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                  <p className="text-center" style={{ color: "var(--text-muted)", fontSize: 13 }}>لا توجد نتائج مطابقة</p>
                  <button onClick={() => { setFilters(DEFAULT_FILTERS); setSort("default"); }}
                    style={{ padding: "9px 20px", borderRadius: 12, border: "1px solid var(--color-brand-500)", background: "transparent", color: "var(--text-brand)", fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filtered.map((item) => (
                    <CartItemCard key={`${item.id}-${item.color}`} item={item}
                      onQtyChange={updateQty}
                      onRemove={(id, color) => {
                        const itemName = items.find(i => i.id === id && i.color === color)?.name;
                        removeFromCart(id, color);
                        if (itemName) toast(`حُذف "${itemName}" من السلة`, { duration: 3000, position: "top-center" });
                      }} />
                  ))}
                </div>
              )}
            </div>

            <CouponInput />
            <CartUpsell />

            {/* ملخص الطلب */}
            <div dir="rtl" style={{ margin: "12px 12px 12px", borderRadius: 18, overflow: "hidden", border: "1px solid var(--border-warm)", background: "var(--bg-card)" }}>
              {/* رأس الملخص */}
              <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 16, borderRadius: 2, background: "var(--gradient-brand)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>ملخص الطلب</span>
              </div>

              {/* بنود الملخص */}
              <div style={{ padding: "4px 0" }}>
                {[
                  { label: "إجمالي المنتجات", value: `${total.toLocaleString("ar-SA")} ر.س`, accent: false },
                  ...(discountAmount > 0 ? [{ label: `كوبون (${couponCode})`, value: `- ${discountAmount.toLocaleString("ar-SA")} ر.س`, accent: true }] : []),
                  { label: "رسوم الشحن", value: shipping === 0 ? "مجاني" : `${shipping} ر.س`, accent: shipping === 0 },
                ].map(({ label, value, accent }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px" }}>
                    <span style={{ fontFamily: "var(--font-main)", fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ fontFamily: "var(--font-numeric)", fontSize: 13, fontWeight: 600, color: accent ? "#22c55e" : "var(--text-primary)" }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* الإجمالي */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 14px", borderTop: "1px solid var(--border-warm)", background: "linear-gradient(135deg,rgba(212,175,55,0.05),rgba(184,118,62,0.05))" }}>
                <span style={{ fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>الإجمالي</span>
                <div className="flex items-baseline gap-1" dir="ltr">
                  <span style={{ fontFamily: "var(--font-numeric)", fontSize: 11, color: "var(--text-muted)" }}>ر.س</span>
                  <span style={{ fontFamily: "var(--font-numeric)", fontSize: 20, fontWeight: 800, color: "var(--text-brand)", fontVariantNumeric: "tabular-nums" }}>
                    {grandTotal.toLocaleString("ar-SA")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* شريط الدفع الثابت — نمط المتاجر الكبرى */}
          <div dir="rtl" style={{ flexShrink: 0, background: "var(--bg-card)", borderTop: "1px solid var(--border-warm)", padding: "8px 12px 12px" }}>

            {/* شارات الثقة — صف صغير فوق */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, marginBottom: 8 }}>
              {[
                { icon: <ShieldCheck size={10} strokeWidth={2.5} />, text: "دفع آمن" },
                { icon: "✓", text: "منتجات أصلية" },
                { icon: "↩", text: "إرجاع 30 يوم" },
              ].map(({ icon, text }, i) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 3, padding: "0 10px", borderInlineEnd: i < 2 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center" }}>{icon}</span>
                  <span style={{ fontFamily: "var(--font-main)", fontSize: 10, color: "var(--text-muted)", fontWeight: 500, whiteSpace: "nowrap" }}>{text}</span>
                </div>
              ))}
            </div>

            {/* الصف الرئيسي: إجمالي (يمين RTL) + زر إتمام (يسار RTL) */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

              {/* معلومات الإجمالي */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-main)", fontSize: 11, color: "var(--text-muted)", marginBottom: 1 }}>
                  الإجمالي ({items.length} {items.length === 1 ? "منتج" : "منتجات"})
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3 }} dir="ltr">
                  <span style={{ fontFamily: "var(--font-numeric)", fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>ر.س</span>
                  <span style={{ fontFamily: "var(--font-numeric)", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.5px" }}>
                    {grandTotal.toLocaleString("ar-SA")}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <p style={{ fontFamily: "var(--font-main)", fontSize: 10, color: "#22c55e", fontWeight: 600, marginTop: 1 }}>
                    وفّرت {discountAmount.toLocaleString("ar-SA")} ر.س
                  </p>
                )}
              </div>

              {/* زر إتمام الطلب المضغوط */}
              <button
                onClick={() => navigate("/checkout")}
                style={{
                  flexShrink: 0,
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "0 18px", height: 52, borderRadius: 14, border: "none",
                  background: "var(--gradient-brand)", color: "#fff", cursor: "pointer",
                  boxShadow: "0 4px 18px rgba(234,88,12,0.35)",
                  transition: "transform 0.13s, box-shadow 0.13s",
                  fontFamily: "var(--font-main)",
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.96)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(234,88,12,0.2)"; }}
                onMouseUp={(e)   => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 18px rgba(234,88,12,0.35)"; }}
                onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.96)"; }}
                onTouchEnd={(e)   => { e.currentTarget.style.transform = ""; }}
              >
                <ShieldCheck size={17} strokeWidth={2.2} color="#fff" />
                <span style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>إتمام الطلب</span>
                <ChevronLeft size={15} strokeWidth={2.5} color="rgba(255,255,255,0.8)" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
