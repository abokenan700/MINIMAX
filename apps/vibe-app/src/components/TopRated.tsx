import { useMemo } from "react";
import { useLocation } from "wouter";
import { useGetProducts } from "@workspace/api-client-react";
import { SectionHeader } from "./SectionHeader";
import { FeaturedCard } from "./FeaturedCard";

export function TopRated() {
  const { data: products = [], isLoading } = useGetProducts();
  const [, navigate] = useLocation();

  const topRated = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 6),
    [products],
  );

  return (
    <div style={{ background: "var(--bg-page)", paddingBottom: 8 }}>
      <div style={{ padding: "18px 12px 12px" }}>
        <SectionHeader title="الأعلى تقييماً" onViewAll={() => navigate("/search")} />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 12px" }}
        dir="rtl"
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  borderRadius: "var(--radius-card)",
                  overflow: "hidden",
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                }}
              >
                <div style={{ aspectRatio: "1/1", background: "var(--border)" }} />
                <div style={{ padding: "10px 10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ height: 9, width: "50%", background: "var(--border)", borderRadius: 4 }} />
                  <div style={{ height: 11, width: "80%", background: "var(--border)", borderRadius: 4 }} />
                  <div style={{ height: 14, width: "40%", background: "var(--border)", borderRadius: 4 }} />
                </div>
              </div>
            ))
          : topRated.map((p) => <FeaturedCard key={p.id} item={p} />)}
      </div>
    </div>
  );
}
