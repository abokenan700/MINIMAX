import { useMemo } from "react";
import { useLocation } from "wouter";
import { useGetProducts } from "@workspace/api-client-react";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ui/Skeleton";

export function NewArrivals() {
  const { data: products = [], isLoading } = useGetProducts();
  const [, navigate] = useLocation();

  const newProducts = useMemo(
    () => [...products].sort((a, b) => b.id - a.id).slice(0, 10),
    [products],
  );

  return (
    <div style={{ background: "var(--bg-page)", paddingBottom: 8 }}>
      <div style={{ padding: "10px 12px 8px" }}>
        <SectionHeader title="وصل حديثاً" loading={isLoading} onViewAll={() => navigate("/search")} />
      </div>

      <div className="overflow-x-auto pb-2 hide-scrollbar" dir="rtl">
        <div className="flex gap-3 px-3" style={{ width: "max-content" }}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-shrink-0" style={{ width: "clamp(148px, 40vw, 172px)" }}>
                  <ProductCardSkeleton />
                </div>
              ))
            : newProducts.map((p) => (
                <div key={p.id} className="flex-shrink-0" style={{ width: "clamp(148px, 40vw, 172px)" }}>
                  <ProductCard product={p} layout="vertical" />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
