import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ShoppingBag, ChevronLeft } from "lucide-react";

interface Slide {
  id: number;
  bg: string;
  bgSet: string;
  title: string;
  subtitle: string;
  badge?: string;
  cta: string;
}

const slides: Slide[] = [
  {
    id: 0,
    bg:    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=85&fm=webp",
    bgSet: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=85&fm=webp 1x, https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=85&fm=webp 2x",
    title: "تشكيلة جديدة",
    subtitle: "تصاميم راقية تعبّر عن ذوقك",
    badge: "⚡ جديد الموسم",
    cta: "تسوق الآن",
  },
  {
    id: 1,
    bg:    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=85&fm=webp",
    bgSet: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=85&fm=webp 1x, https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=85&fm=webp 2x",
    title: "عروض حصرية",
    subtitle: "أفضل الأسعار لأجمل المنتجات",
    badge: "🔥 حتى 70% خصم",
    cta: "اكتشف الآن",
  },
  {
    id: 2,
    bg:    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=85&fm=webp",
    bgSet: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=85&fm=webp 1x, https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1600&q=85&fm=webp 2x",
    title: "أحدث الموضة",
    subtitle: "اكتشف أحدث صيحات الموضة",
    badge: "✨ كولكشن 2025",
    cta: "تصفح الكولكشن",
  },
  {
    id: 3,
    bg:    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85&fm=webp",
    bgSet: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85&fm=webp 1x, https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&q=85&fm=webp 2x",
    title: "إكسسوارات فاخرة",
    subtitle: "أناقة لا مثيل لها في كل مناسبة",
    badge: "💎 ماركات عالمية",
    cta: "اطّلع عليها",
  },
];

const INTERVAL_MS = 4200;
const n = slides.length;

export function BannerSlider() {
  const [current, setCurrent]   = useState(0);
  const [loaded, setLoaded]     = useState(false);
  const [touchX, setTouchX]     = useState<number | null>(null);
  const [delta, setDelta]       = useState(0);
  const [, navigate]            = useLocation();
  const pausedRef               = useRef(false);
  const resumeTimer             = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!pausedRef.current) setCurrent((c) => (c + 1) % n);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  function resumeAfterDelay() {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => { pausedRef.current = false; }, 2800);
  }

  function onTouchStart(x: number) { pausedRef.current = true; setTouchX(x); setDelta(0); }
  function onTouchMove(x: number)  { if (touchX === null) return; setDelta(x - touchX); }
  function onTouchEnd() {
    if (touchX === null) return;
    if (delta > 50 && current < n - 1) setCurrent((c) => c + 1);
    if (delta < -50 && current > 0)    setCurrent((c) => c - 1);
    setTouchX(null); setDelta(0); resumeAfterDelay();
  }

  const slide = slides[current];

  return (
    <div className="banner-slider-wrap">
      <div
        className="banner-slider-inner"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
        onTouchStart={(e) => onTouchStart(e.touches[0].clientX)}
        onTouchMove={(e)  => onTouchMove(e.touches[0].clientX)}
        onTouchEnd={onTouchEnd}
      >
        {/* Skeleton */}
        {!loaded && <div className="absolute inset-0 z-10 skeleton" style={{ borderRadius: 0 }} />}

        {/* Slide images */}
        {slides.map((s, i) => (
          <img
            key={s.id}
            src={s.bg}
            srcSet={s.bgSet}
            sizes="(max-width: 480px) 100vw, 800px"
            alt={s.title}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "low"}
            decoding={i === 0 ? "sync" : "async"}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: i === current ? 1 : 0,
              transform: `scale(${i === current ? 1.03 : 1})`,
              transition: touchX !== null
                ? "opacity 0.1s"
                : "opacity 0.55s var(--ease-standard), transform 4.5s var(--ease-standard)",
              willChange: (i === current || i === (current + 1) % n) ? "opacity, transform" : "auto",
            }}
            onLoad={() => { if (i === 0) setLoaded(true); }}
            onError={(e) => { e.currentTarget.style.opacity = "0"; if (i === 0) setLoaded(true); }}
          />
        ))}

        {/* Deep gradient overlay — bottom-weighted for text */}
        <div className="banner-gradient-overlay" aria-hidden="true" />

        {/* Top gradient for slide counter */}
        <div className="banner-gradient-top" aria-hidden="true" />

        {/* Slide counter top-right */}
        {loaded && (
          <div className="banner-counter" dir="ltr" aria-hidden="true">
            <span className="banner-counter-current">{current + 1}</span>
            <span className="banner-counter-sep">/</span>
            <span className="banner-counter-total">{n}</span>
          </div>
        )}

        {/* Badge top-left */}
        {loaded && slide.badge && (
          <div
            key={`badge-${current}`}
            className="banner-badge"
            style={{ animation: "fadeInDown 0.38s var(--ease-spring) both" }}
          >
            {slide.badge}
          </div>
        )}

        {/* Text + CTA overlay */}
        {loaded && (
          <div
            className="banner-text-block"
            dir="rtl"
            onClick={() => navigate("/categories")}
          >
            <p
              key={`title-${current}`}
              className="banner-title"
              style={{ animation: "fadeInUp 0.36s var(--ease-out) both" }}
            >
              {slide.title}
            </p>
            <p
              key={`sub-${current}`}
              className="banner-subtitle"
              style={{ animation: "fadeInUp 0.36s var(--ease-out) 0.07s both" }}
            >
              {slide.subtitle}
            </p>

            {/* CTA Button */}
            <button
              key={`cta-${current}`}
              className="banner-cta-btn"
              style={{ animation: "fadeInUp 0.36s var(--ease-out) 0.13s both" }}
              onClick={(e) => { e.stopPropagation(); navigate("/categories"); }}
              aria-label={slide.cta}
            >
              <ShoppingBag size={13} strokeWidth={2.2} />
              <span>{slide.cta}</span>
              <ChevronLeft size={12} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Dot indicators */}
        <div className="banner-dots" role="tablist" aria-label="شرائح البانر">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`الشريحة ${i + 1}`}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); resumeAfterDelay(); }}
              className="banner-dot"
              style={{
                width:   i === current ? 22 : 6,
                opacity: i === current ? 1 : 0.52,
                background: "#fff",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
