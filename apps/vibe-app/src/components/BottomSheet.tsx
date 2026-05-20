import { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  dragHandle?: boolean;
  scrollable?: boolean;
  backdropBlur?: number;
  maxHeight?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function BottomSheet({
  open,
  onClose,
  header,
  footer,
  children,
  dragHandle = true,
  scrollable = true,
  backdropBlur = 6,
  maxHeight = "88dvh",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const savedScrollY = useRef(0);

  /* Escape to close */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); onClose(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /* Body scroll lock with scroll-position restore */
  useEffect(() => {
    if (open) {
      savedScrollY.current = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.top = `-${savedScrollY.current}px`;
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, savedScrollY.current);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [open]);

  /* Focus trap */
  useEffect(() => {
    if (!open || !sheetRef.current) return;
    const el = sheetRef.current;
    const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
    const getFocusable = () => Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(n => n.offsetParent !== null);

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const t = setTimeout(() => {
      const nodes = getFocusable();
      if (nodes[0]) nodes[0].focus();
    }, 350);

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = getFocusable();
      if (!nodes.length) return;
      const first = nodes[0]; const last = nodes[nodes.length - 1];
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
    };
    document.addEventListener("keydown", onTab);

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onTab);
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="bs-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden="true"
            style={{
              position: "fixed", inset: 0, zIndex: "var(--z-overlay)" as unknown as number,
              background: "rgba(0,0,0,0.48)",
              backdropFilter: `blur(${backdropBlur}px)`,
              WebkitBackdropFilter: `blur(${backdropBlur}px)`,
            }}
          />

          {/* Sheet */}
          <motion.div
            key="bs-sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.9 }}
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: "var(--z-modal)" as unknown as number,
              background: "var(--bg-card)",
              borderRadius: "24px 24px 0 0",
              maxHeight,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "var(--shadow-sheet)",
            }}
          >
            {/* Drag handle */}
            {dragHandle && (
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 2px", flexShrink: 0 }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border-warm)" }} />
              </div>
            )}

            {header && (
              <div style={{ flexShrink: 0 }}>{header}</div>
            )}

            <div
              style={{
                flex: "1 1 auto",
                overflowY: scrollable ? "auto" : "hidden",
                overscrollBehavior: "contain",
              }}
            >
              {children}
            </div>

            {footer && (
              <div style={{ flexShrink: 0 }}>{footer}</div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
