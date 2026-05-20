import { useMemo } from "react";
import { useLocation } from "wouter";
import { Clock } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

interface StoredProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  badge: string;
  isNew: boolean;
}

const RV_KEY = "nakhba_recent_viewed";

function getRecentlyViewed(): StoredProduct[] {
  try {
    const stored = localStorage.getItem(RV_KEY);
    return stored ? (JSON.parse(stored) as StoredProduct[]) : [];
  } catch { return []; }
}

export function RecentlyViewed() {
  const [, navigate] = useLocation();
  const recent = useMemo(() => getRecentlyViewed().slice(0, 8), []);

  if (recent.length === 0) return null;

  return (
    <div style={{ background: "var(--bg-page)", padding: "6px 0 12px" }}>
      <div style={{ padding: "12px 12px 10px" }}>
        <SectionHeader
          title="شاهدته مؤخراً"
          icon={<Clock size={14} strokeWidth={2} style={{ color: "var(--text-brand)" }} />}
          onViewAll={() => navigate("/search")}
        />
      </div>

      <div
        className="hide-scrollbar"
        style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 12px" }}
        dir="rtl"
      >
        {recent.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/product/${p.id}`)}
            className="card-pressable flex-shrink-0 overflow-hidden"
            style={{
              width: "clamp(110px, 29vw, 132px)",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--shadow-card)",
              cursor: "pointer",
              padding: 0,
              textAlign: "right",
            }}
          >
            <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", background: "var(--card-img-bg)" }}>
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-contain"
                onError={(e) => { e.currentTarget.style.opacity = "0"; }}
              />
              {p.badge && (
                <span
                  className="absolute top-1.5 end-1.5"
                  style={{
                    padding: "2px 6px",
                    borderRadius: "var(--radius-pill)",
                    background: p.isNew ? "var(--success-bg)" : "var(--color-brand-50)",
                    color: p.isNew ? "var(--color-success-600)" : "var(--color-brand-700)",
                    fontSize: "clamp(8px, 2.1vw, 9px)",
                    fontWeight: 700,
                    border: `1px solid ${p.isNew ? "rgba(22,163,74,0.20)" : "rgba(249,115,22,0.18)"}`,
                  }}
                >
                  {p.badge}
                </span>
              )}
            </div>
            <div style={{ height: 1, background: "var(--border-separator)" }} />
            <div className="px-2 pt-1.5 pb-2" dir="rtl">
              <p className="line-clamp-2" style={{ fontSize: "clamp(9.5px, 2.6vw, 11px)", color: "var(--text-primary)", fontWeight: 600, lineHeight: 1.35 }}>
                {p.name}
              </p>
              <div className="flex items-baseline gap-0.5 mt-1">
                <span style={{ fontSize: "clamp(11px, 3vw, 13px)", fontWeight: 800, color: "var(--text-primary)" }}>
                  {p.price.toLocaleString("ar-SA")}
                </span>
                <span style={{ fontSize: "clamp(8px, 2.2vw, 9px)", color: "var(--text-muted)" }}>ر.س</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
