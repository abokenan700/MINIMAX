import { useGetProducts } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ui/Skeleton";

export function FeaturedProducts() {
  const { data: products = [], isLoading } = useGetProducts();
  const [, navigate] = useLocation();

  return (
    <div className="px-3 pt-1 pb-3">
      <SectionHeader
        title="منتجات مميزة"
        loading={isLoading}
        onViewAll={() => navigate("/categories")}
      />
      <div className="grid grid-cols-2 gap-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((item) => (
              <ProductCard key={item.id} product={item} layout="vertical" density="comfortable" />
            ))}
      </div>
    </div>
  );
}
