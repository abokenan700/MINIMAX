import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { Categories } from "./components/Categories";
import { BannerSlider } from "./components/BannerSlider";
import { FlashSaleStrip } from "./components/FlashSaleStrip";
import { Products } from "./components/Products";
import { BestSellers } from "./components/BestSellers";
import { TopRated } from "./components/TopRated";
import { Brands } from "./components/Brands";
import { BottomNav } from "./components/BottomNav";
import { NewArrivals } from "./components/NewArrivals";
import { RecentlyViewed } from "./components/RecentlyViewed";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AccountSheet } from "./components/AccountSheet";
import { AccountSheetProvider } from "./context/AccountSheetContext";
import { PromoBanners } from "./components/PromoBanners";
import { useAuth } from "./context/AuthContext";
import { toast } from "sonner";

const RETURN_TO_KEY = "nakhba_return_to";
const TOKEN_KEY     = "nakhba_token";

/* ── Lazy-load page chunks ──────────────────────────────────────── */
const CategoriesPage    = lazy(() => import("./pages/CategoriesPage").then(m => ({ default: m.CategoriesPage })));
const CartPage          = lazy(() => import("./pages/CartPage").then(m => ({ default: m.CartPage })));
const WishlistPage      = lazy(() => import("./pages/WishlistPage").then(m => ({ default: m.WishlistPage })));
const AccountPage       = lazy(() => import("./pages/AccountPage").then(m => ({ default: m.AccountPage })));
const SearchPage        = lazy(() => import("./pages/SearchPage").then(m => ({ default: m.SearchPage })));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage").then(m => ({ default: m.ProductDetailPage })));
const CheckoutPage      = lazy(() => import("./pages/CheckoutPage").then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage  = lazy(() => import("./pages/OrderSuccessPage").then(m => ({ default: m.OrderSuccessPage })));
const OrdersPage        = lazy(() => import("./pages/OrdersPage").then(m => ({ default: m.OrdersPage })));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage").then(m => ({ default: m.NotificationsPage })));
const PriceAlertsPage   = lazy(() => import("./pages/PriceAlertsPage").then(m => ({ default: m.PriceAlertsPage })));
const NotFoundPage      = lazy(() => import("./pages/not-found").then(m => ({ default: m.NotFoundPage })));
const AddressBookPage   = lazy(() => import("./pages/AddressBookPage").then(m => ({ default: m.AddressBookPage })));
const EditProfilePage   = lazy(() => import("./pages/EditProfilePage").then(m => ({ default: m.EditProfilePage })));

function PageLoader() {
  return (
    <div style={{ flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }}>
      <div className="page-spinner" />
    </div>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      try { sessionStorage.setItem(RETURN_TO_KEY, location); } catch { }
      navigate("/");
    }
  }, [user, loading, navigate, location]);

  if (loading) return <PageLoader />;
  if (!user) return null;
  return <Component />;
}

function FocusOnNavigation() {
  const [location] = useLocation();
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;
    main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });
    const handleBlur = () => main.removeAttribute("tabindex");
    main.addEventListener("blur", handleBlur, { once: true });
    return () => main.removeEventListener("blur", handleBlur);
  }, [location]);
  return null;
}

function OAuthCapture() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("oauth_token");
    const err    = params.get("oauth_error");

    if (token) {
      try { localStorage.setItem(TOKEN_KEY, token); } catch { /* ignore */ }
      const clean = window.location.pathname;
      window.history.replaceState({}, "", clean);
      window.location.reload();
    }

    if (err) {
      const msgs: Record<string, string> = {
        cancelled:    "تم إلغاء تسجيل الدخول",
        token_failed: "فشل التحقق من الحساب، حاول مجدداً",
        no_email:     "لم نتمكن من الوصول إلى بريدك الإلكتروني",
        server_error: "خطأ في الخادم، حاول مجدداً",
      };
      toast.error(msgs[err] ?? "تعذّر تسجيل الدخول");
      window.history.replaceState({}, "", window.location.pathname);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return null;
}

/* ── Elegant gradient section divider ────────────────────────────── */
function SectionDivider() {
  return (
    <div className="section-divider" aria-hidden="true">
      <div className="section-divider-line" />
    </div>
  );
}

/* ── Scroll-reveal wrapper ───────────────────────────────────────── */
function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = delay ? `${delay}ms` : "0ms";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.04, rootMargin: "0px 0px -12px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: "translateY(18px)",
        transition: "opacity 0.42s var(--ease-out), transform 0.42s var(--ease-out)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/* ── Home Page ───────────────────────────────────────────────────── */
function HomePage() {
  const scrollRef  = useRef<HTMLDivElement>(null);
  const qc         = useQueryClient();
  const startYRef  = useRef<number | null>(null);
  const [pullY, setPullY]           = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const THRESHOLD  = 62;

  function onTouchStart(e: React.TouchEvent) {
    const el = scrollRef.current;
    if (el && el.scrollTop === 0) startYRef.current = e.touches[0].clientY;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (startYRef.current === null) return;
    const el = scrollRef.current;
    if (!el || el.scrollTop > 2) { startYRef.current = null; setPullY(0); return; }
    const dy = e.touches[0].clientY - startYRef.current;
    if (dy > 0) setPullY(Math.min(dy * 0.44, THRESHOLD));
  }

  async function onTouchEnd() {
    if (pullY >= THRESHOLD * 0.78 && !refreshing) {
      setRefreshing(true);
      await qc.invalidateQueries();
      setTimeout(() => setRefreshing(false), 950);
    }
    startYRef.current = null;
    setPullY(0);
  }

  const indicatorH = refreshing ? 48 : pullY;

  return (
    <div
      className="scroll-area"
      ref={scrollRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Pull-to-refresh indicator */}
      <div
        aria-live="polite"
        aria-label={refreshing ? "جاري التحديث..." : undefined}
        style={{
          height: indicatorH,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: pullY > 0 ? "none" : "height 0.30s var(--ease-out)",
        }}
      >
        <div
          className="page-spinner"
          style={{
            opacity: pullY > 16 || refreshing ? 1 : 0,
            transform: `scale(${pullY > 16 || refreshing ? 1 : 0.55})`,
            transition: "opacity 0.18s, transform 0.18s",
          }}
        />
      </div>

      <h1 className="sr-only">نخبة — الرئيسية</h1>

      {/* ① Header */}
      <Header />

      {/* ② Search + trending chips */}
      <SearchBar readOnly navigateTo="/search" hideTrending />

      {/* ③ Category bubbles */}
      <Categories />

      {/* ④ Hero banner slider */}
      <RevealSection>
        <BannerSlider />
      </RevealSection>

      {/* ⑥ Trust badges row */}
      <RevealSection>
        <PromoBanners />
      </RevealSection>

      {/* ⑦ Daily deals (عروض اليوم) */}
      <SectionDivider />
      <RevealSection>
        <div style={{ padding: "0 0 4px" }}>
          <Products />
        </div>
      </RevealSection>

      {/* ⑧ Featured brands */}
      <SectionDivider />
      <RevealSection delay={40}>
        <div style={{ padding: "8px 0" }}>
          <Brands />
        </div>
      </RevealSection>

      {/* ⑩ New arrivals */}
      <SectionDivider />
      <RevealSection delay={40}>
        <NewArrivals />
      </RevealSection>

      {/* ⑪ Best sellers */}
      <SectionDivider />
      <RevealSection delay={40}>
        <BestSellers />
      </RevealSection>

      {/* ⑫ Top rated */}
      <SectionDivider />
      <RevealSection delay={40}>
        <TopRated />
      </RevealSection>

      {/* ⑬ Recently viewed */}
      <SectionDivider />
      <RevealSection delay={40}>
        <RecentlyViewed />
      </RevealSection>
    </div>
  );
}

function PageBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AccountSheetProvider>
      <div className="app-shell">
        <a href="#main-content" className="skip-link">تخطى للمحتوى الرئيسي</a>
        <OAuthCapture />
        <FocusOnNavigation />
        <main
          id="main-content"
          style={{ flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}
        >
          <Switch>
            <Route path="/">
              <PageBoundary><HomePage /></PageBoundary>
            </Route>
            <Route path="/categories">
              <PageBoundary><CategoriesPage /></PageBoundary>
            </Route>
            <Route path="/cart">
              <PageBoundary><CartPage /></PageBoundary>
            </Route>
            <Route path="/wishlist">
              <PageBoundary><WishlistPage /></PageBoundary>
            </Route>
            <Route path="/search">
              <PageBoundary><SearchPage /></PageBoundary>
            </Route>
            <Route path="/product/:id">
              <PageBoundary><ProductDetailPage /></PageBoundary>
            </Route>
            <Route path="/notifications">
              <PageBoundary><NotificationsPage /></PageBoundary>
            </Route>
            <Route path="/checkout">
              <PageBoundary><ProtectedRoute component={CheckoutPage} /></PageBoundary>
            </Route>
            <Route path="/order/success">
              <PageBoundary><ProtectedRoute component={OrderSuccessPage} /></PageBoundary>
            </Route>
            <Route path="/orders">
              <PageBoundary><ProtectedRoute component={OrdersPage} /></PageBoundary>
            </Route>
            <Route path="/account">
              <PageBoundary><AccountPage /></PageBoundary>
            </Route>
            <Route path="/price-alerts">
              <PageBoundary><PriceAlertsPage /></PageBoundary>
            </Route>
            <Route path="/addresses">
              <PageBoundary><ProtectedRoute component={AddressBookPage} /></PageBoundary>
            </Route>
            <Route path="/edit-profile">
              <PageBoundary><ProtectedRoute component={EditProfilePage} /></PageBoundary>
            </Route>
            <Route>
              <PageBoundary><NotFoundPage /></PageBoundary>
            </Route>
          </Switch>
        </main>

        <div className="bottom-bar">
          <BottomNav />
        </div>

        <AccountSheet />
      </div>
    </AccountSheetProvider>
  );
}
