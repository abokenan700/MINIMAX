import { useMemo } from "react";
import { useLocation } from "wouter";
import { Clock } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Divider } from "./ui/Divider";
import { PriceTag } from "./ui/PriceTag";
import { Badge } from "./ui/Badge";

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
                <span className="absolute top-1.5 end-1.5">
                  <Badge variant={p.isNew ? "new" : "discount-soft"} size="sm">
                    {p.badge}
                  </Badge>
                </span>
              )}
            </div>
            <Divider />
            <div className="px-2 pt-1.5 pb-2" dir="rtl">
              <p className="line-clamp-2" style={{ fontSize: "clamp(9.5px, 2.6vw, 11px)", color: "var(--text-primary)", fontWeight: 600, lineHeight: 1.35, fontFamily: "var(--font-text)" }}>
                {p.name}
              </p>
              <PriceTag price={p.price} size="sm" style={{ marginTop: 4 }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
