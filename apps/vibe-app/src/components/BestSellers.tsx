import { useMemo } from "react";
import { useLocation } from "wouter";
import { useGetProducts } from "@workspace/api-client-react";
import { SectionHeader } from "./SectionHeader";
import { DealCard } from "./DealCard";

export function BestSellers() {
  const { data: products = [], isLoading } = useGetProducts();
  const [, navigate] = useLocation();

  const best = useMemo(
    () => [...products].sort((a, b) => b.sales - a.sales).slice(0, 10),
    [products],
  );

  return (
    <div style={{ background: "var(--bg-page)", paddingBottom: 8 }}>
      <div style={{ padding: "18px 12px 8px" }}>
        <SectionHeader title="الأكثر مبيعاً" onViewAll={() => navigate("/search")} />
      </div>

      <div className="overflow-x-auto pb-2 hide-scrollbar" dir="rtl">
        <div className="flex gap-2.5 px-3" style={{ width: "max-content" }}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 rounded-2xl overflow-hidden animate-pulse"
                  style={{
                    width: "clamp(112px, 30vw, 138px)",
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div style={{ aspectRatio: "1 / 0.95", background: "#F0F0F0" }} />
                  <div style={{ height: 1, background: "var(--border)" }} />
                  <div className="px-2 pt-1.5 pb-2 flex flex-col gap-1.5">
                    <div className="rounded" style={{ height: 8, width: "48%", background: "#E5E5E5" }} />
                    <div className="rounded" style={{ height: 10, width: "84%", background: "#E5E5E5" }} />
                    <div className="rounded" style={{ height: 12, width: "44%", background: "#E5E5E5" }} />
                  </div>
                </div>
              ))
            : best.map((p) => <DealCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
