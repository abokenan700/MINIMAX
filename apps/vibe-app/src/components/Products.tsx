import { useGetProducts } from "@workspace/api-client-react";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ui/Skeleton";
import { FlashSaleStrip } from "./FlashSaleStrip";

export function Products() {
  const { data: products = [], isLoading } = useGetProducts();

  return (
    <div className="pt-3 pb-0">
      <div style={{
        border: "none",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
        background: "var(--bg-surface-warm)",
      }}>
        <FlashSaleStrip />

        <div className="overflow-x-auto pb-2 pt-2 hide-scrollbar" dir="rtl">
          <div className="flex gap-2.5 px-1.5" style={{ width: "max-content" }}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0" style={{ width: "clamp(138px, 36vw, 162px)" }}>
                    <ProductCardSkeleton />
                  </div>
                ))
              : products.map((p) => (
                  <div key={p.id} className="flex-shrink-0" style={{ width: "clamp(138px, 36vw, 162px)" }}>
                    <ProductCard product={p} layout="horizontal" density="compact" />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
