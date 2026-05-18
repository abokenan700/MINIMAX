/**
 * مشكلة 32: حُذف تعريف ProductCard المحلي — أُنقل إلى DealCard.tsx
 * مشكلة 144: حُذف useCountdown المحلي — أُنقل إلى hooks/useCountdown.ts
 * مشكلة 127: CountdownDisplay مكوّن منفصل → هو الوحيد الذي يُعاد رسمه كل ثانية
 *            بدلاً من Products بأكملها (DealCards + queries + ...)
 */
import { useGetProducts } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { DealCard } from "./DealCard";
import { FlashSaleStrip } from "./FlashSaleStrip";

export function Products() {
  const { data: products = [], isLoading } = useGetProducts();
  const [, navigate] = useLocation();

  return (
    <div className="py-2">
      <FlashSaleStrip />

      <div className="overflow-x-auto pb-1 hide-scrollbar -mx-3" dir="rtl">
        <div className="flex gap-2.5 px-3" style={{ width: "max-content" }}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 rounded-2xl overflow-hidden animate-pulse"
                  style={{ width: "clamp(112px, 30vw, 138px)", background: "var(--card-bg)", border: "1px solid var(--card-border)", boxShadow: "var(--shadow-card)" }}
                >
                  <div style={{ aspectRatio: "1 / 0.95", background: "#F0F0F0" }} />
                  <div style={{ height: 1, background: "var(--border)" }} />
                  <div className="px-2 pt-1.5 pb-2 flex flex-col gap-1.5">
                    <div className="rounded" style={{ height: 8, width: "48%", background: "#E5E5E5" }} />
                    <div className="rounded" style={{ height: 10, width: "84%", background: "#E5E5E5" }} />
                    <div className="flex items-center justify-between">
                      <div className="rounded" style={{ height: 12, width: "44%", background: "#E5E5E5" }} />
                      <div className="rounded" style={{ height: 8, width: "28%", background: "#E5E5E5" }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="rounded-full" style={{ height: 18, width: "44%", background: "#E5E5E5" }} />
                      <div className="rounded-full" style={{ height: 22, width: 22, background: "#E5E5E5" }} />
                    </div>
                  </div>
                </div>
              ))
            : products.map((p) => (
                <DealCard key={p.id} product={p} />
              ))}
        </div>
      </div>
    </div>
  );
}
