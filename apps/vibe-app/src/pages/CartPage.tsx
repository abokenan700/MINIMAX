import { ShoppingBag, Trash2, Plus, Minus, CheckSquare, Square, ArrowRight, Tag, X, Heart, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { SearchBar } from "../components/SearchBar";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useGetProducts } from "@workspace/api-client-react";
import type { CartItem } from "../context/CartContext";
import type { Product } from "@workspace/api-client-react";
import { Button } from "../components/ui";
import { calcShipping, FREE_SHIPPING_THRESHOLD } from "../lib/shippingPolicy";
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

type CartPanelKey = "sort" | "price" | "brand" | "extra";

/* ═══════════════════════════════════════════════════════════════
   Free Shipping Bar
═══════════════════════════════════════════════════════════════ */
function FreeShippingBar({ total }: { total: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const pct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const reached = total >= FREE_SHIPPING_THRESHOLD;
  return (
    <div dir="rtl" style={{ padding: "10px 12px", background: reached ? "var(--color-brand-50)" : "#F8F8F8", borderBottom: "1px solid var(--border-warm)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "var(--font-main)", fontSize: 12, fontWeight: 700, color: "var(--text-brand)" }}>
          {reached ? "🎉 تأهّلت للشحن المجاني!" : `أضف ${remaining.toLocaleString("ar-SA")} ر.س للحصول على شحن مجاني 🚚`}
        </span>
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: reached ? "var(--color-brand-100)" : "rgba(192,168,130,0.25)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: reached ? "linear-gradient(90deg,var(--color-brand-500),#4A7A3A)" : "var(--gradient-brand)", transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Coupon Input
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
    <div dir="rtl" style={{ padding: "10px 12px", background: "var(--bg-card)", borderBottom: "1px solid var(--border-warm)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${error ? "#E04545" : applied ? "var(--color-brand-500)" : "var(--border-warm)"}`, background: "var(--bg-page)", transition: "border-color 0.2s" }}>
          <Tag size={14} style={{ color: applied ? "var(--color-brand-500)" : "var(--text-muted)", flexShrink: 0 }} />
          {applied ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, color: "var(--color-brand-500)" }}>{couponCode} — خصم {discountPct}٪ ✓</span>
              <button onClick={reset} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9A9692", padding: 0, display: "flex" }}><X size={14} /></button>
            </div>
          ) : (
            <input
              value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && void apply()}
              placeholder="أدخل كود الخصم"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-main)", fontSize: 13, color: "var(--text-primary)", direction: "rtl", letterSpacing: 1 }} />
          )}
        </div>
        {!applied && (
          <button onClick={() => void apply()} disabled={busy}
            style={{ padding: "10px 16px", borderRadius: 12, border: "none", background: "var(--gradient-brand)", color: "#fff", fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer", whiteSpace: "nowrap", opacity: busy ? 0.7 : 1, boxShadow: "var(--shadow-btn)" }}>
            {busy ? "..." : "تطبيق"}
          </button>
        )}
      </div>
      {error && <p style={{ fontSize: 11, color: "#E04545", marginTop: 5, paddingInlineStart: 4 }}>{error}</p>}
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
   شريط التحكم والفلاتر الخاص بالسلة
═══════════════════════════════════════════════════════════════ */
function CartControlsBar({
  count, sort, filters, availableBrands, editMode, selectedCount,
  onSortChange, onFiltersChange, onToggleEdit, onDeleteSelected,
}: {
  count: number;
  sort: string;
  filters: Filters;
  availableBrands: string[];
  editMode: boolean;
  selectedCount: number;
  onSortChange: (k: string) => void;
  onFiltersChange: (f: Filters) => void;
  onToggleEdit: () => void;
  onDeleteSelected: () => void;
}) {
  const [openPanel, setOpenPanel] = useState<CartPanelKey | null>(null);
  const [showExtra, setShowExtra] = useState(false);
  const close = () => setOpenPanel(null);

  const priceActive    = filters.minPrice !== null || filters.maxPrice !== null;
  const brandActive    = filters.brands.length > 0;
  const sortActive     = sort !== "default";
  const discountActive = filters.minDiscount !== null;

  const priceLabel = priceActive
    ? (filters.maxPrice === null
        ? `فوق ${filters.minPrice?.toLocaleString("ar-SA")}`
        : filters.minPrice === null
          ? `تحت ${filters.maxPrice.toLocaleString("ar-SA")}`
          : `${filters.minPrice?.toLocaleString("ar-SA")}–${filters.maxPrice?.toLocaleString("ar-SA")}`)
    : "السعر";
  const brandLabel = brandActive
    ? (filters.brands.length === 1 ? filters.brands[0] : `${filters.brands[0]} +${filters.brands.length - 1}`)
    : "الماركة";
  const sortLabel = sortActive
    ? (CART_SORT_OPTIONS.find(s => s.key === sort)?.label ?? "ترتيب")
    : "ترتيب";

  const activeChips: { id: string; label: string; onRemove: () => void }[] = [];
  if (priceActive) activeChips.push({ id: "price", label: priceLabel, onRemove: () => onFiltersChange({ ...filters, minPrice: null, maxPrice: null }) });
  if (discountActive) activeChips.push({ id: "discount", label: `خصم ${filters.minDiscount}%+`, onRemove: () => onFiltersChange({ ...filters, minDiscount: null }) });
  filters.brands.forEach(b => activeChips.push({ id: `brand-${b}`, label: b, onRemove: () => onFiltersChange({ ...filters, brands: filters.brands.filter(x => x !== b) }) }));

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
      {showExtra && (
        <CartExtraSheet
          minDiscount={filters.minDiscount}
          onApply={(val) => onFiltersChange({ ...filters, minDiscount: val })}
          onClose={() => setShowExtra(false)}
        />
      )}

      <div dir="rtl" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-warm)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px" }}>

          {/* زر تعديل / حذف */}
          {count > 0 && (
            <button
              onClick={editMode && selectedCount > 0 ? onDeleteSelected : onToggleEdit}
              style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: 5,
                padding: "6px 11px", borderRadius: 20,
                border: `1.5px solid ${editMode ? (selectedCount > 0 ? "#E04545" : "var(--color-brand-500)") : "var(--border-warm)"}`,
                background: editMode ? (selectedCount > 0 ? "#FEF0EE" : "var(--color-brand-50)") : "var(--bg-card)",
                fontFamily: "var(--font-main)", fontSize: 12, fontWeight: 700,
                color: editMode ? (selectedCount > 0 ? "#E04545" : "var(--text-brand)") : "var(--text-secondary)",
                cursor: "pointer", whiteSpace: "nowrap",
              }}>
              {editMode
                ? selectedCount > 0
                  ? <><Trash2 size={11} strokeWidth={2} />حذف ({selectedCount})</>
                  : "تم"
                : "تعديل"}
            </button>
          )}

          <div className="hide-scrollbar" style={{ display: "flex", gap: 6, overflowX: "auto", flex: 1 }}>
            <FilterBarBtn label={brandLabel} active={brandActive} onClick={() => setOpenPanel("brand")} />
            <FilterBarBtn label={priceLabel} active={priceActive} onClick={() => setOpenPanel("price")} />
            <FilterBarBtn label={sortLabel}  active={sortActive}  onClick={() => setOpenPanel("sort")} />
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
   Cart Item Row
═══════════════════════════════════════════════════════════════ */
function CartItemRow({ item, editMode, selected, onSelect, onQtyChange, onRemove }: {
  item: CartItem; editMode: boolean; selected: boolean;
  onSelect: (id: number) => void;
  onQtyChange: (id: number, color: string, delta: number) => void;
  onRemove: (id: number, color: string) => void;
}) {
  const { toggleWishlist, isWishlisted } = useWishlist();

  function handleSaveForLater() {
    const fakeProduct = {
      id: item.id, name: item.name, brand: item.brand, price: item.price,
      image: (item as (typeof item) & { images?: string[] }).images?.[0] ?? item.image, category: "", slug: item.name,
      stock: 10, sales: 0, rating: 0, reviewCount: 0,
    } as unknown as Product;
    toggleWishlist(fakeProduct);
    if (!isWishlisted(item.id)) {
      onRemove(item.id, item.color);
      toast("تم حفظ المنتج للوقت لاحقاً ❤️");
    }
  }

  return (
    <div className="flex gap-3 p-3 rounded-2xl transition-[border-color,box-shadow] duration-150"
      style={{ background: "var(--bg-card)", border: `1px solid ${selected ? "var(--color-brand-500)" : "var(--border)"}`, boxShadow: selected ? "0 0 0 1px rgba(166,124,82,0.2)" : "none" }} dir="rtl">
      {editMode && (
        <button onClick={() => onSelect(item.id)} className="flex-shrink-0 flex items-center justify-center self-center" style={{ color: selected ? "var(--text-brand)" : "var(--border)", marginInlineEnd: -4 }} aria-label={selected ? "إلغاء تحديد العنصر" : "تحديد العنصر"}>
          {selected ? <CheckSquare size={20} strokeWidth={2} /> : <Square size={20} strokeWidth={1.5} />}
        </button>
      )}
      <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 80, height: 80, background: "var(--card-img-bg)" }}>
        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" onError={(e) => { e.currentTarget.style.opacity = "0"; }} />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-bold" style={{ color: "var(--text-brand)" }}>{item.brand}</p>
          <p className="font-semibold line-clamp-1 mt-0.5" style={{ fontSize: "13px", color: "var(--text-primary)" }}>{item.name}</p>
          {item.color && (
            <div className="flex items-center gap-1 mt-1">
              <div className="w-3 h-3 rounded-full border" style={{ background: item.color, borderColor: "rgba(0,0,0,0.1)" }} />
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{item.color}</span>
            </div>
          )}
          {!editMode && (
            <button onClick={handleSaveForLater} dir="rtl"
              style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
              <Heart size={12} style={{ color: isWishlisted(item.id) ? "#E04545" : "var(--text-muted)" }} />
              <span style={{ fontSize: 11, color: isWishlisted(item.id) ? "#E04545" : "var(--text-muted)", fontWeight: 600 }}>
                {isWishlisted(item.id) ? "محفوظ في المفضلة" : "احتفظ لوقت لاحق"}
              </span>
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="font-bold" style={{ fontSize: "15px", color: "var(--text-primary)" }}>
              {(item.price * item.qty).toLocaleString("ar-SA")}
            </span>
            <span className="text-[10px] font-normal" style={{ color: "var(--text-secondary)", marginInlineStart: 2 }}>ر.س</span>
            {(item as CartItem & { discount?: number }).discount! > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 20, background: "var(--color-brand-50)", color: "var(--color-brand-700)", marginInlineStart: 6 }}>
                {(item as CartItem & { discount?: number }).discount}%
              </span>
            )}
          </div>
          {!editMode && (
            <div className="flex items-center gap-0.5">
              <button onClick={() => onRemove(item.id, item.color)}
                style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer" }}
                aria-label="إزالة من السلة">
                <div className="w-7 h-7 flex items-center justify-center rounded-full" style={{ background: "#FEF0EE", color: "var(--color-danger-600)" }}>
                  <Trash2 size={12} />
                </div>
              </button>
              <div className="flex items-center rounded-full" style={{ background: "#F0F0F0", border: "1px solid #E8E8E8" }}>
                <button onClick={() => onQtyChange(item.id, item.color, -1)}
                  style={{ minWidth: 40, minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-brand)", background: "none", border: "none", cursor: "pointer" }}
                  aria-label="تقليل الكمية">
                  <Minus size={12} strokeWidth={2.5} />
                </button>
                <span className="text-[13px] font-bold w-5 text-center" style={{ color: "var(--text-primary)" }}>{item.qty}</span>
                <button onClick={() => onQtyChange(item.id, item.color, 1)}
                  style={{ minWidth: 40, minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-brand)", background: "none", border: "none", cursor: "pointer" }}
                  aria-label="زيادة الكمية">
                  <Plus size={12} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Cart Upsell
═══════════════════════════════════════════════════════════════ */
function CartUpsell() {
  const { data: products = [] } = useGetProducts();
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const suggestions = useMemo(() => products.slice(0, 6), [products]);
  if (suggestions.length === 0) return null;
  return (
    <div style={{ margin: "6px 0 0" }} dir="rtl">
      <p style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)", padding: "12px 12px 8px" }}>
        قد يعجبك أيضاً
      </p>
      <div className="hide-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 12px 14px" }}>
        {suggestions.map((p) => (
          <div key={p.id} style={{ flexShrink: 0, width: 110, borderRadius: 14, overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border-warm)", cursor: "pointer" }}
            onClick={() => navigate(`/product/${p.id}`)}>
            <div style={{ width: "100%", aspectRatio: "1/1", background: "var(--card-img-bg)", position: "relative" }}>
              <img src={p.image} alt={p.name} loading="lazy"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: 8 }}
                onError={(e) => { e.currentTarget.style.opacity = "0"; }} />
            </div>
            <div style={{ padding: "7px 8px 9px" }}>
              <p className="line-clamp-2" style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: 5 }}>{p.name}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)" }}>{p.price.toLocaleString("ar-SA")}</span>
                <button onClick={(e) => { e.stopPropagation(); addToCart(p, p.colors?.[0]); }}
                  style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer" }}
                  aria-label="أضف للسلة">
                  <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-brand-50)", border: "1px solid var(--color-brand-500)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Plus size={13} style={{ color: "var(--text-brand)" }} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   تطبيق الفلاتر على عناصر السلة
═══════════════════════════════════════════════════════════════ */
function applyCartFilters(items: CartItem[], sort: string, filters: Filters, query: string): CartItem[] {
  let list = [...items];

  const q = query.trim().toLowerCase();
  if (q) list = list.filter(it => it.name.toLowerCase().includes(q) || it.brand.toLowerCase().includes(q));

  if (filters.minPrice !== null) list = list.filter(it => it.price >= filters.minPrice!);
  if (filters.maxPrice !== null) list = list.filter(it => it.price <= filters.maxPrice!);
  if (filters.minDiscount !== null) list = list.filter(it => ((it as CartItem & { discount?: number }).discount ?? 0) >= filters.minDiscount!);
  if (filters.brands.length > 0) list = list.filter(it => filters.brands.includes(it.brand));

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
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [query, setQuery]       = useState("");
  const [sort, setSort]         = useState("default");
  const [filters, setFilters]   = useState<Filters>(DEFAULT_FILTERS);

  const availableBrands = useMemo(() =>
    [...new Set(items.map(it => it.brand))].sort(),
    [items]
  );

  const filtered = useMemo(() =>
    applyCartFilters(items, sort, filters, query),
    [items, sort, filters, query]
  );

  const shipping   = calcShipping(total);
  const grandTotal = total - discountAmount + shipping;

  function handleSelect(id: number) {
    setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  function handleDeleteSelected() {
    const toDelete = items.filter(i => selected.has(i.id));
    toDelete.forEach((i) => removeFromCart(i.id, i.color));
    setSelected(new Set()); setEditMode(false);
    toast(`تم حذف ${toDelete.length} عنصر${toDelete.length > 1 ? "ات" : ""} من السلة`, { duration: 4000, position: "top-center" });
  }

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
        editMode={editMode}
        selectedCount={selected.size}
        onSortChange={setSort}
        onFiltersChange={setFilters}
        onToggleEdit={() => { setEditMode(v => !v); setSelected(new Set()); }}
        onDeleteSelected={handleDeleteSelected}
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
          <FreeShippingBar total={total} />

          <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col" dir="rtl">
            <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "12px 12px 0" }}>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                  <p className="text-center" style={{ color: "var(--text-muted)", fontSize: 13 }}>لا توجد نتائج مطابقة</p>
                  <button onClick={() => { setFilters(DEFAULT_FILTERS); setSort("default"); }}
                    style={{ padding: "9px 20px", borderRadius: 12, border: "1px solid var(--color-brand-500)", background: "transparent", color: "var(--text-brand)", fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              ) : (
                filtered.map((item) => (
                  <CartItemRow key={`${item.id}-${item.color}`} item={item} editMode={editMode} selected={selected.has(item.id)}
                    onSelect={handleSelect}
                    onQtyChange={updateQty}
                    onRemove={(id, color) => {
                      const itemName = items.find(i => i.id === id && i.color === color)?.name;
                      removeFromCart(id, color);
                      if (itemName) toast(`حُذف "${itemName}" من السلة`, { duration: 3000, position: "top-center" });
                    }} />
                ))
              )}
            </div>

            {!editMode && <div style={{ marginTop: 12 }}><CouponInput /></div>}
            {!editMode && <CartUpsell />}

            {!editMode && (
              <div style={{ margin: "4px 12px 12px", borderRadius: 18, background: "var(--bg-card)", border: "1px solid var(--border-warm)", overflow: "hidden" }}>
                {[
                  { label: "إجمالي المنتجات", value: `${total.toLocaleString("ar-SA")} ر.س`, green: false },
                  ...(discountAmount > 0 ? [{ label: `خصم الكوبون (${couponCode})`, value: `- ${discountAmount.toLocaleString("ar-SA")} ر.س`, green: true }] : []),
                  { label: "رسوم الشحن", value: shipping === 0 ? "مجاني 🎉" : `${shipping} ر.س`, green: shipping === 0 },
                ].map(({ label, value, green }) => (
                  <div key={label} className="flex items-center justify-between" style={{ padding: "11px 14px", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{label}</span>
                    <span className="font-semibold" style={{ fontSize: "13px", color: green ? "var(--color-success-600)" : "var(--text-primary)" }}>{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between" style={{ padding: "13px 14px" }}>
                  <span className="font-bold" style={{ fontSize: "15px", color: "var(--text-primary)" }}>الإجمالي</span>
                  <span className="font-bold" style={{ fontSize: "17px", color: "var(--text-brand)" }}>{grandTotal.toLocaleString("ar-SA")} ر.س</span>
                </div>
              </div>
            )}
          </div>

          {!editMode && (
            <div className="px-3 pt-2 pb-3" style={{ flexShrink: 0, background: "#FFFFFF", borderTop: "1px solid var(--border-warm)" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 10 }} dir="rtl">
                {[
                  { icon: "🔒", text: "دفع آمن 100%" },
                  { icon: "✓", text: "منتجات أصلية" },
                  { icon: "↩", text: "إرجاع مجاني 30 يوماً" },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 11 }}>{icon}</span>
                    <span style={{ fontFamily: "var(--font-main)", fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>{text}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => navigate("/checkout")}
                variant="primary"
                size="lg"
                className="w-full rounded-2xl"
                style={{ background: "linear-gradient(135deg, var(--color-brand-500), var(--color-brand-500))" }}>
                إتمام الطلب — {grandTotal.toLocaleString("ar-SA")} ر.س
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
