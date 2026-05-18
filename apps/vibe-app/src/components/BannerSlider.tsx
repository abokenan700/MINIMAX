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

const INTERVAL_MS = 3800;
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
    resumeTimer.current = setTimeout(() => { pausedRef.current = false; }, 2500);
  }

  function onTouchStart(x: number) {
    pausedRef.current = true;
    setTouchX(x);
    setDelta(0);
  }

  function onTouchMove(x: number) {
    if (touchX === null) return;
    setDelta(x - touchX);
  }

  function onTouchEnd() {
    if (touchX === null) return;
    if (delta > 50 && current < n - 1) setCurrent((c) => c + 1);
    if (delta < -50 && current > 0)    setCurrent((c) => c - 1);
    setTouchX(null);
    setDelta(0);
    resumeAfterDelay();
  }

  return (
    <div className="px-3 pt-3 pb-2">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ aspectRatio: "2 / 1", background: "var(--gold-light)", userSelect: "none" }}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
        onFocus={() => { pausedRef.current = true; }}
        onBlur={() => { pausedRef.current = false; }}
        onTouchStart={(e) => onTouchStart(e.touches[0].clientX)}
        onTouchMove={(e)  => onTouchMove(e.touches[0].clientX)}
        onTouchEnd={onTouchEnd}
        onClick={() => navigate("/categories")}
      >
        {/* Skeleton shimmer until first image loads */}
        {!loaded && (
          <div
            className="absolute inset-0 z-10 skeleton"
            style={{ borderRadius: 0 }}
          />
        )}

        {/* Images */}
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
              transform: `translateX(${delta !== 0 && touchX !== null ? (i === current ? `${delta * 0.05}px` : "0") : "0"})`,
              transition: touchX !== null ? "opacity 0.1s" : "opacity var(--duration-slow) var(--ease-standard)",
              willChange: (i === current || i === (current + 1) % n) ? "opacity" : "auto",
            }}
            onLoad={() => { if (i === 0) setLoaded(true); }}
            onError={(e) => { e.currentTarget.style.opacity = "0"; if (i === 0) setLoaded(true); }}
          />
        ))}

        {/* Bottom gradient for text readability */}
        {loaded && (
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: "70%",
              background: "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.22) 45%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Text overlay */}
        {loaded && (
          <div
            className="absolute bottom-0 inset-x-0 pb-8 px-4"
            dir="rtl"
            style={{ pointerEvents: "none" }}
          >
            <p
              key={`title-${current}`}
              style={{
                fontFamily: "var(--font-main)",
                fontSize: "clamp(14px, 4vw, 18px)",
                fontWeight: 800,
                color: "#fff",
                margin: 0,
                lineHeight: 1.2,
                textShadow: "0 1px 6px rgba(0,0,0,0.35)",
                animation: "fadeInUp 0.32s var(--ease-out) both",
              }}
            >
              {slides[current].title}
            </p>
            <p
              key={`sub-${current}`}
              style={{
                fontFamily: "var(--font-main)",
                fontSize: "clamp(10.5px, 2.8vw, 12.5px)",
                fontWeight: 500,
                color: "rgba(255,255,255,0.90)",
                margin: "4px 0 0",
                lineHeight: 1.4,
                textShadow: "0 1px 4px rgba(0,0,0,0.28)",
                animation: "fadeInUp 0.32s var(--ease-out) 0.06s both",
              }}
            >
              {slides[current].subtitle}
            </p>
          </div>
        )}

        {/* Dot indicators */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            insetInlineEnd: 12,
            display: "flex",
            gap: 5,
            alignItems: "center",
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); resumeAfterDelay(); }}
              aria-label={`الشريحة ${i + 1}`}
              style={{
                width: i === current ? 18 : 6,
                height: 6,
                borderRadius: 3,
                background: i === current ? "#fff" : "rgba(255,255,255,0.48)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                flexShrink: 0,
                transition: "width 0.28s var(--ease-spring), background 0.28s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
