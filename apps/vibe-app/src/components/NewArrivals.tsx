import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useGetProducts } from "@workspace/api-client-react";
import { SectionHeader } from "./SectionHeader";
import { FeaturedCard } from "./FeaturedCard";

const TABS = [
  { key: "all",  label: "الكل" },
  { key: "new",  label: "الأحدث" },
  { key: "top",  label: "الأعلى تقييماً" },
  { key: "deal", label: "الأوفر" },
];

export function NewArrivals() {
  const { data: products = [], isLoading } = useGetProducts();
  const [activeTab, setActiveTab]          = useState("all");
  const [, navigate]                       = useLocation();

  const filtered = useMemo(() => {
    if (activeTab === "new")
      return [...products].sort((a, b) => b.id - a.id).slice(0, 8);
    if (activeTab === "top")
      return [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
    if (activeTab === "deal")
      return [...products].sort((a, b) => b.discount - a.discount).slice(0, 8);
    return products.filter((p) => p.is_new || p.discount < 10).slice(0, 8);
  }, [products, activeTab]);

  return (
    <div style={{ background: "var(--bg-page)", paddingBottom: 8 }}>
      <div style={{ padding: "18px 12px 0" }}>
        <SectionHeader title="وصل حديثاً" onViewAll={() => navigate("/search")} />
      </div>

      <div
        className="hide-scrollbar"
        style={{ display: "flex", gap: 8, padding: "10px 12px 12px", overflowX: "auto" }}
        dir="rtl"
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              flexShrink: 0,
              padding: "7px 16px",
              borderRadius: 20,
              cursor: "pointer",
              fontFamily: "var(--font-main)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              background: activeTab === key ? "var(--gradient-cta)" : "var(--bg-card)",
              color: activeTab === key ? "#fff" : "var(--text-secondary)",
              border: activeTab === key ? "none" : "1px solid var(--border-warm)",
              boxShadow: activeTab === key ? "var(--shadow-btn)" : "none",
              transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 12px" }} dir="rtl">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{ borderRadius: "var(--radius-card)", overflow: "hidden", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
              >
                <div style={{ aspectRatio: "1/1", background: "var(--border)" }} />
                <div style={{ padding: "10px 10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ height: 9, width: "50%", background: "var(--border)", borderRadius: 4 }} />
                  <div style={{ height: 11, width: "80%", background: "var(--border)", borderRadius: 4 }} />
                  <div style={{ height: 14, width: "40%", background: "var(--border)", borderRadius: 4 }} />
                </div>
              </div>
            ))
          : filtered.map((p) => <FeaturedCard key={p.id} item={p} />)
        }
      </div>
    </div>
  );
}
