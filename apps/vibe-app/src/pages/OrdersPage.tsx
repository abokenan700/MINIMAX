import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight, Package, Truck, CheckCircle, XCircle, RotateCcw,
  ShoppingBag, AlertTriangle, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useAccountSheet } from "../context/AccountSheetContext";
import { apiFetch } from "../lib/apiFetch";

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  id: number; product_id: number; name: string; brand: string;
  price: string; qty: number; color: string; image: string;
}

interface Order {
  id: number; user_id: number; status: OrderStatus;
  payment_method: string;
  address_name: string | null; address_city: string | null;
  subtotal: string; shipping: string; total: string;
  created_at: string;
  items: OrderItem[];
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  processing: { label: "قيد المعالجة",    color: "var(--text-brand)", bg: "var(--color-brand-50)", icon: <Package size={13} /> },
  shipped:    { label: "في الطريق إليك",  color: "#1565C0",           bg: "#E3F2FD",          icon: <Truck size={13} /> },
  delivered:  { label: "تم التسليم",      color: "var(--color-brand-500)", bg: "var(--color-brand-50)", icon: <CheckCircle size={13} /> },
  cancelled:  { label: "مُلغى",           color: "#C62828",           bg: "#FFEBEE",          icon: <XCircle size={13} /> },
};

type TimelineStep = {
  label: string;
  icon: React.ReactNode;
  done: boolean;
  isCancelled?: boolean;
};

function buildTimeline(status: OrderStatus): TimelineStep[] {
  const steps = [
    { label: "تم تأكيد الطلب",   icon: <CheckCircle size={14} />, done: true },
    { label: "قيد التجهيز",      icon: <Package size={14} />,     done: status !== "cancelled" },
    { label: "شُحن",             icon: <Truck size={14} />,       done: status === "shipped" || status === "delivered" },
    { label: "تم التسليم",       icon: <ShoppingBag size={14} />, done: status === "delivered" },
  ];
  if (status === "cancelled") {
    return [
      { label: "تم تأكيد الطلب", icon: <CheckCircle size={14} />, done: true },
      { label: "مُلغى",           icon: <XCircle size={14} />,     done: true, isCancelled: true },
    ];
  }
  return steps;
}

function formatOrderId(id: number) {
  return `NKH-${String(id).padStart(6, "0")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" });
}

function estimateDelivery(order: Order): string {
  if (order.status === "delivered") return "تم التسليم";
  if (order.status === "cancelled") return "تم إلغاء الطلب";
  const d = new Date(order.created_at);
  d.setDate(d.getDate() + 3);
  return `متوقع ${d.toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long" })}`;
}

function VisualTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div dir="rtl" style={{ padding: "14px 16px 12px" }}>
      <p style={{ fontFamily: "var(--font-main)", fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 14 }}>مسار الطلب</p>
      <div style={{ position: "relative" }}>
        {/* Vertical connector line */}
        <div style={{ position: "absolute", insetInlineStart: 15, top: 16, bottom: 16, width: 2, background: "linear-gradient(to bottom, var(--color-brand-500) 0%, rgba(192,168,130,0.2) 100%)" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: isLast ? 0 : 18, position: "relative", zIndex: 1 }}>
                {/* Circle */}
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: step.isCancelled ? "#FFEBEE" : step.done ? "var(--color-brand-500)" : "var(--bg-page)",
                  border: `2px solid ${step.isCancelled ? "#E53935" : step.done ? "var(--color-brand-500)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: step.done ? "0 2px 8px rgba(192,168,130,0.35)" : "none",
                  transition: "all 0.3s",
                }}>
                  <span style={{ color: step.isCancelled ? "#E53935" : step.done ? "#fff" : "var(--text-muted)", display: "flex" }}>
                    {step.icon}
                  </span>
                </div>
                {/* Label + dot for active */}
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontFamily: "var(--font-main)", fontSize: 13,
                    fontWeight: step.done ? 700 : 400,
                    color: step.isCancelled ? "#C62828" : step.done ? "var(--text-primary)" : "var(--text-muted)",
                  }}>
                    {step.label}
                  </span>
                  {step.done && !step.isCancelled && i === steps.filter(s => s.done).length - 1 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-brand-500)", animation: "pulse 1.5s ease-in-out infinite" }} />
                      <span style={{ fontSize: 10.5, color: "var(--text-brand)", fontWeight: 600 }}>الحالة الحالية</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CancelOrderModal({ orderId, onClose, onCancelled }: { orderId: number; onClose: () => void; onCancelled: () => void }) {
  const mutation = useMutation({
    mutationFn: () => apiFetch(`/orders/${orderId}/cancel`, { method: "POST", auth: true }),
    onSuccess:  () => { toast.success("تم إلغاء الطلب"); onCancelled(); },
    onError:    (e: Error) => toast.error(e.message),
  });
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }} onClick={onClose} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "calc(100% - 40px)", maxWidth: 340, background: "var(--bg-card)", borderRadius: 22, padding: "28px 22px", textAlign: "center", zIndex: 1 }} dir="rtl">
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FEF0EE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <AlertTriangle size={24} style={{ color: "#E04545" }} />
        </div>
        <h3 style={{ fontFamily: "var(--font-main)", fontSize: 17, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>إلغاء الطلب؟</h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 22 }}>هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ لا يمكن التراجع عن هذه العملية.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1px solid var(--border-warm)", background: "transparent", fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 700, cursor: "pointer", color: "var(--text-secondary)" }}>تراجع</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending}
            style={{ flex: 1, padding: "13px", borderRadius: 12, border: "none", background: "#E04545", color: "#fff", fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 700, cursor: mutation.isPending ? "not-allowed" : "pointer", opacity: mutation.isPending ? 0.7 : 1 }}>
            {mutation.isPending ? "جارٍ الإلغاء..." : "نعم، إلغاء"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReturnRequestModal({ orderId, onClose }: { orderId: number; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const mutation = useMutation({
    mutationFn: () => apiFetch(`/orders/${orderId}/return`, { method: "POST", auth: true, json: true, body: JSON.stringify({ reason }) }),
    onSuccess:  () => { toast.success("تم إرسال طلب الإرجاع — سنتواصل معك خلال 24 ساعة"); onClose(); },
    onError:    (e: Error) => toast.error(e.message),
  });
  const reasons = ["المنتج لا يطابق الوصف", "المنتج وصل تالفاً", "حجم أو مقاس خاطئ", "لم يعجبني المنتج", "سبب آخر"];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }} onClick={onClose} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, maxWidth: 430, margin: "0 auto", background: "var(--bg-card)", borderRadius: "24px 24px 0 0", padding: "20px 20px 40px", zIndex: 1 }} dir="rtl">
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto 18px" }} />
        <h3 style={{ fontFamily: "var(--font-main)", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>طلب إرجاع المنتج</h3>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 10 }}>سبب الإرجاع</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
          {reasons.map(r => (
            <button key={r} onClick={() => setReason(r)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${reason === r ? "var(--color-brand-500)" : "var(--border-warm)"}`, background: reason === r ? "var(--color-brand-50)" : "var(--bg-card)", cursor: "pointer", textAlign: "start" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${reason === r ? "var(--color-brand-500)" : "var(--border)"}`, background: reason === r ? "var(--color-brand-500)" : "transparent", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: reason === r ? 700 : 400, color: reason === r ? "var(--text-brand)" : "var(--text-primary)" }}>{r}</span>
            </button>
          ))}
        </div>
        <button onClick={() => mutation.mutate()} disabled={!reason || mutation.isPending}
          style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "var(--gradient-brand)", color: "#fff", fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 700, cursor: !reason || mutation.isPending ? "not-allowed" : "pointer", opacity: !reason || mutation.isPending ? 0.5 : 1, boxShadow: "var(--shadow-btn)" }}>
          {mutation.isPending ? "جارٍ الإرسال..." : "إرسال طلب الإرجاع"}
        </button>
      </div>
    </div>
  );
}

function OrderCard({ order, onRefresh }: { order: Order; onRefresh: () => void }) {
  const [expanded,     setExpanded]     = useState(false);
  const [showCancel,   setShowCancel]   = useState(false);
  const [showReturn,   setShowReturn]   = useState(false);

  const cfg      = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.processing;
  const timeline = buildTimeline(order.status);
  const canCancel = order.status === "processing";
  const canReturn = order.status === "delivered";

  return (
    <>
      <div style={{ borderRadius: 18, background: "var(--bg-card)", border: "1px solid var(--border-warm)", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "14px 16px" }} dir="rtl">
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <p style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 800, color: "var(--text-brand)" }}>{formatOrderId(order.id)}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{formatDate(order.created_at)}</p>
            </div>
            <span style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 20, background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700 }}>
              {cfg.icon} {cfg.label}
            </span>
          </div>

          {/* Product thumbs */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            {order.items.slice(0, 3).map((item) => (
              <div key={item.id} style={{ width: 52, height: 52, borderRadius: 10, overflow: "hidden", background: "var(--card-img-bg)", flexShrink: 0, border: "1px solid var(--border-warm)" }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }}
                  onError={(e) => { e.currentTarget.style.opacity = "0"; }} />
              </div>
            ))}
            {order.items.length > 3 && (
              <div style={{ width: 52, height: 52, borderRadius: 10, background: "var(--color-brand-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-brand)" }}>+{order.items.length - 3}</span>
              </div>
            )}
            <div style={{ flex: 1 }} />
            <span style={{ fontFamily: "var(--font-main)", fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>
              {Number(order.total).toLocaleString("ar-SA")} ر.س
            </span>
          </div>

          {/* Delivery estimate */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 10, background: "var(--color-brand-50)" }} dir="rtl">
            <Truck size={13} style={{ color: "var(--text-brand)" }} />
            <span style={{ fontSize: 12, color: "var(--text-brand)", fontWeight: 600 }}>
              {estimateDelivery(order)}
            </span>
          </div>
        </div>

        {/* Expanded timeline */}
        {expanded && (
          <div style={{ borderTop: "1px solid var(--border)" }}>
            <VisualTimeline steps={timeline} />
            <div style={{ padding: "0 16px 14px" }} dir="rtl">
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                طريقة الدفع: {order.payment_method === "cod" ? "الدفع عند الاستلام" : "بطاقة ائتمان"}
                {order.address_city ? ` · ${order.address_city}` : ""}
              </p>
            </div>
          </div>
        )}

        {/* Actions row */}
        <div style={{ display: "flex", borderTop: "1px solid var(--border)" }}>
          <button onClick={() => setExpanded((v) => !v)}
            style={{ flex: 1, padding: "11px 0", background: "transparent", border: "none", cursor: "pointer", fontFamily: "var(--font-main)", fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }} dir="rtl">
            {expanded ? "إخفاء التفاصيل" : "تفاصيل الطلب"}
          </button>
          {canCancel && (
            <button onClick={() => setShowCancel(true)}
              style={{ flex: 1, padding: "11px 0", background: "transparent", border: "none", borderInlineStart: "1px solid var(--border)", cursor: "pointer", fontFamily: "var(--font-main)", fontSize: 12.5, fontWeight: 700, color: "#E04545", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }} dir="rtl">
              <XCircle size={13} /> إلغاء الطلب
            </button>
          )}
          {canReturn && (
            <button onClick={() => setShowReturn(true)}
              style={{ flex: 1, padding: "11px 0", background: "transparent", border: "none", borderInlineStart: "1px solid var(--border)", cursor: "pointer", fontFamily: "var(--font-main)", fontSize: 12.5, fontWeight: 700, color: "var(--text-brand)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }} dir="rtl">
              <RotateCcw size={13} /> إرجاع
            </button>
          )}
        </div>
      </div>

      {showCancel && <CancelOrderModal orderId={order.id} onClose={() => setShowCancel(false)} onCancelled={() => { setShowCancel(false); onRefresh(); }} />}
      {showReturn && <ReturnRequestModal orderId={order.id} onClose={() => setShowReturn(false)} />}
    </>
  );
}

function OrderSkeleton() {
  return (
    <div style={{ borderRadius: 18, background: "var(--bg-card)", border: "1px solid var(--border-warm)", padding: "16px", overflow: "hidden" }}>
      <div className="animate-pulse" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ height: 14, width: "40%", borderRadius: 6, background: "#F0F0F0" }} />
          <div style={{ height: 22, width: "28%", borderRadius: 20, background: "#F0F0F0" }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3].map((i) => <div key={i} style={{ width: 52, height: 52, borderRadius: 10, background: "#F0F0F0" }} />)}
        </div>
        <div style={{ height: 36, borderRadius: 10, background: "#F0F0F0" }} />
      </div>
    </div>
  );
}

export function OrdersPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { openSheet } = useAccountSheet();
  const qc = useQueryClient();

  const { data: orders = [], isLoading, isError, refetch } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: () => apiFetch<Order[]>("/orders", { auth: true }),
    enabled: !!user,
  });

  function handleRefresh() {
    void qc.invalidateQueries({ queryKey: ["orders"] });
  }

  return (
    <div style={{ flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-page)", paddingBottom: "var(--nav-h)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--bg-card)", borderBottom: "1px solid var(--border-warm)", flexShrink: 0 }} dir="rtl">
        <button onClick={() => navigate("/account")}
          style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid var(--border-warm)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <ArrowRight size={17} style={{ color: "var(--text-primary)" }} />
        </button>
        <h1 style={{ fontFamily: "var(--font-main)", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", flex: 1 }}>طلباتي</h1>
        {orders.length > 0 && (
          <button onClick={handleRefresh} style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border-warm)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="تحديث">
            <RefreshCw size={15} style={{ color: "var(--text-muted)" }} />
          </button>
        )}
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
        {!user ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 14, padding: "0 24px" }} dir="rtl">
            <Package size={48} style={{ color: "#D4CFC9" }} strokeWidth={1.2} />
            <p style={{ fontFamily: "var(--font-main)", fontSize: 16, fontWeight: 600, color: "var(--text-primary)", textAlign: "center" }}>سجّل دخولك لعرض طلباتك</p>
            <button onClick={() => openSheet()}
              style={{ padding: "12px 28px", borderRadius: 14, border: "none", background: "var(--gradient-brand)", color: "#fff", fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "var(--shadow-btn)" }}>
              تسجيل الدخول
            </button>
          </div>
        ) : isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2].map((i) => <OrderSkeleton key={i} />)}
          </div>
        ) : isError ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 12 }} dir="rtl">
            <Package size={40} style={{ color: "#D4CFC9" }} strokeWidth={1.2} />
            <p style={{ fontFamily: "var(--font-main)", fontSize: 14, color: "var(--text-muted)" }}>تعذّر تحميل الطلبات</p>
            <button onClick={() => void refetch()}
              style={{ padding: "9px 22px", borderRadius: 12, border: "1px solid var(--border-warm)", background: "transparent", color: "var(--text-secondary)", fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              إعادة المحاولة
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 14, padding: "0 24px" }} dir="rtl">
            <Package size={48} style={{ color: "#D4CFC9" }} strokeWidth={1.2} />
            <p style={{ fontFamily: "var(--font-main)", fontSize: 16, fontWeight: 600, color: "var(--text-primary)", textAlign: "center" }}>لا توجد طلبات بعد</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>ابدأ التسوق وستظهر طلباتك هنا</p>
            <button onClick={() => navigate("/")}
              style={{ padding: "12px 28px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,var(--color-brand-500),var(--color-brand-500))", color: "#fff", fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              تسوّق الآن
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {orders.map((order) => <OrderCard key={order.id} order={order} onRefresh={handleRefresh} />)}
          </div>
        )}
      </div>
    </div>
  );
}
