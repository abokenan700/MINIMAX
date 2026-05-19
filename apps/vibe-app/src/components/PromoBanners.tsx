import { Truck, RotateCcw, ShieldCheck, Tag } from "lucide-react";
import { useLocation } from "wouter";

interface PromoItem {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  bg: string;
  iconBg: string;
  iconColor: string;
  path: string;
}

const PROMOS: PromoItem[] = [
  {
    icon: Truck,
    title: "شحن مجاني",
    subtitle: "للطلبات فوق 150 ر.س",
    bg: "linear-gradient(135deg, #FFF7F0 0%, #FFEDD5 100%)",
    iconBg: "rgba(249,115,22,0.12)",
    iconColor: "#F97316",
    path: "/categories",
  },
  {
    icon: RotateCcw,
    title: "إرجاع سهل",
    subtitle: "خلال 30 يوم بلا أسئلة",
    bg: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
    iconBg: "rgba(22,163,74,0.12)",
    iconColor: "#16A34A",
    path: "/categories",
  },
];

export function PromoBanners() {
  const [, navigate] = useLocation();

  return (
    <div
      className="promo-banners-row"
      dir="rtl"
    >
      {PROMOS.map((p) => {
        const Icon = p.icon;
        return (
          <button
            key={p.title}
            className="promo-banner-card card-pressable"
            style={{ background: p.bg }}
            onClick={() => navigate(p.path)}
            aria-label={p.title}
          >
            <div
              className="promo-banner-icon"
              style={{ background: p.iconBg }}
            >
              <Icon size={16} strokeWidth={1.8} style={{ color: p.iconColor }} />
            </div>
            <div className="flex flex-col gap-0.5 text-right min-w-0">
              <span className="promo-banner-title">{p.title}</span>
              <span className="promo-banner-subtitle">{p.subtitle}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function MidPagePromoBanner() {
  const [, navigate] = useLocation();

  return (
    <button
      className="mid-promo-banner card-pressable"
      onClick={() => navigate("/categories")}
      aria-label="عروض الأعضاء الحصرية"
      dir="rtl"
    >
      <div className="mid-promo-shimmer" aria-hidden="true" />
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="mid-promo-icon-wrap">
          <Tag size={18} strokeWidth={2} className="fill-white stroke-white" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="mid-promo-subtitle">وفّر حتى 40% إضافية على كل طلب</span>
        </div>
      </div>
      <div className="mid-promo-cta">
        <ShieldCheck size={12} strokeWidth={2.2} />
        <span>انضم الآن</span>
      </div>
    </button>
  );
}
