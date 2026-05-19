import { useMemo } from "react";
import { useLocation } from "wouter";
import { useGetProducts } from "@workspace/api-client-react";
import { SectionHeader } from "./SectionHeader";
import { FeaturedCard } from "./FeaturedCard";
import { Sparkles } from "lucide-react";

interface RecentProduct { id: number }

export function ForYou() {
  const { data: products = [] } = useGetProducts();
  const [, navigate] = useLocation();

  const recentIds = useMemo<number[]>(() => {
    try {
      const stored = localStorage.getItem("nakhba_recent_viewed");
      if (!stored) return [];
      return (JSON.parse(stored) as RecentProduct[]).map(p => p.id).slice(0, 8);
    } catch { return []; }
  }, []);

  const forYou = useMemo(() => {
    if (recentIds.length === 0) return [];
    const recentSet = new Set(recentIds);
    const base = products.filter(p => recentSet.has(p.id));
    if (base.length === 0) return [];
    const brands = new Set(base.map(p => p.brand));
    return products
      .filter(p => brands.has(p.brand) && !recentSet.has(p.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }, [products, recentIds]);

  if (forYou.length < 2) return null;

  return (
    <div style={{ paddingTop: 4, paddingBottom: 8 }}>
      <div style={{ paddingInline: 16, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }} dir="rtl">
        <SectionHeader
          title="مقترح لك"
          icon={<Sparkles size={14} style={{ color: "var(--gold)" }} strokeWidth={2} />}
        />
        <button
          onClick={() => navigate("/search")}
          style={{ fontFamily: "var(--font-main)", fontSize: 12, fontWeight: 700, color: "var(--text-brand)", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}
        >
          عرض المزيد
        </button>
      </div>
      <div
        className="hide-scrollbar"
        dir="rtl"
        style={{ display: "flex", gap: 10, overflowX: "auto", paddingInline: 16 }}
      >
        {forYou.map((item, i) => (
          <div key={item.id} style={{ flexShrink: 0, width: 160, animation: `fadeInUp 0.35s var(--ease-out) both ${i * 50}ms` }}>
            <FeaturedCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
