import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";

interface Slide {
  id: number;
  bg: string;
  bgSet: string;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    id: 0,
    bg:    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80&fm=webp",
    bgSet: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80&fm=webp 1x, https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80&fm=webp 2x",
    title: "تشكيلة جديدة",
    subtitle: "تصاميم راقية تعبّر عن ذوقك",
  },
  {
    id: 1,
    bg:    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&fm=webp",
    bgSet: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&fm=webp 1x, https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80&fm=webp 2x",
    title: "عروض حصرية",
    subtitle: "أفضل الأسعار لأجمل المنتجات",
  },
  {
    id: 2,
    bg:    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80&fm=webp",
    bgSet: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80&fm=webp 1x, https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1600&q=80&fm=webp 2x",
    title: "أحدث الموضة",
    subtitle: "اكتشف أحدث صيحات الموضة",
  },
  {
    id: 3,
    bg:    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80&fm=webp",
    bgSet: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80&fm=webp 1x, https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&q=80&fm=webp 2x",
    title: "إكسسوارات فاخرة",
    subtitle: "أناقة لا مثيل لها في كل مناسبة",
  },
];

const INTERVAL_MS = 3500;

export function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [, navigate] = useLocation();
  const pausedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!pausedRef.current) setCurrent((c) => (c + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-3 pt-3 pb-2">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ aspectRatio: "2.25 / 1", background: "var(--gold-light)" }}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
        onFocus={() => { pausedRef.current = true; }}
        onBlur={() => { pausedRef.current = false; }}
      >
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
              transition: "opacity var(--duration-slow) var(--ease-standard)",
              willChange: (i === current || i === (current + 1) % slides.length) ? "opacity" : "auto",
            }}
            onError={(e) => { e.currentTarget.style.opacity = "0"; }}
          />
        ))}

        {/* Warm gradient overlay aligned with THAWQ palette */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(255,252,248,0) 0%, rgba(26,22,18,0.05) 40%, rgba(26,22,18,0.20) 100%)" }}
        />

      </div>
    </div>
  );
}
