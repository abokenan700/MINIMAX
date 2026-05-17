import { Truck, ShieldCheck, RotateCcw } from "lucide-react";

interface Feature {
  Icon: React.ElementType;
  title: string;
  sub: string;
}

const features: Feature[] = [
  { Icon: Truck,       title: "توصيل سريع",   sub: "خلال 24 ساعة" },
  { Icon: ShieldCheck, title: "منتجات أصلية", sub: "100% مضمونة"   },
  { Icon: RotateCcw,   title: "إرجاع مجاني",  sub: "حتى 15 يوم"   },
];

export function Features() {
  return (
    <div className="px-3 py-2">
      <div
        className="rounded-2xl flex items-center justify-between"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          padding: "12px 8px",
        }}
      >
        {features.map((f, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 relative">
            {i < features.length - 1 && (
              <div
                aria-hidden="true"
                className="absolute end-0 top-1/2 -translate-y-1/2"
                style={{ width: 1, height: 28, background: "var(--border)" }}
              />
            )}
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 34,
                height: 34,
                background: "var(--gold-light)",
                marginBottom: 1,
              }}
            >
              <f.Icon
                size={16}
                strokeWidth={1.8}
                style={{ color: "var(--text-brand)" }}
              />
            </div>
            <span
              className="font-semibold"
              style={{ fontSize: "clamp(10px, 2.8vw, 11.5px)", color: "var(--text-primary)", lineHeight: 1 }}
            >
              {f.title}
            </span>
            <span
              style={{ fontSize: "clamp(9px, 2.4vw, 10px)", color: "var(--text-muted)", lineHeight: 1 }}
            >
              {f.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
