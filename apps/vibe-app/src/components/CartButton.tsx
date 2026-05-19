import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import type { Product } from "@workspace/api-client-react";
import { useCartButton } from "../hooks/useCartButton";

interface CartButtonProps {
  size?: "sm" | "md";
  product?: Product;
  selectedColor?: string;
}

/* ── مشكلة 38: الحد الأدنى لمساحة اللمس 44×44px (WCAG 2.5.5) ── */
export function CartButton({ size = "md", product, selectedColor }: CartButtonProps) {
  const { added, handleAdd } = useCartButton(product, selectedColor);

  /* الحجم البصري للدائرة */
  const dim  = size === "sm" ? 28 : 30;
  const icon = size === "sm" ? 13 : 14;

  return (
    <button
      onClick={handleAdd}
      aria-label={added ? "تمت الإضافة للسلة" : "أضف للسلة"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        minWidth: 36,
        minHeight: 36,
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
    >
      <motion.div
        whileTap={{ scale: 0.80 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        className="flex items-center justify-center"
        style={{
          width: dim,
          height: dim,
          borderRadius: "50%",
          background: added ? "rgba(249,115,22,0.15)" : "linear-gradient(135deg, #F97316, #EA580C)",
          boxShadow: added ? "none" : "0 2px 6px rgba(249,115,22,0.35)",
          transition: "background 0.2s",
        }}
      >
        {added
          ? <Check size={icon} strokeWidth={2.5} style={{ color: "#F97316" }} />
          : <ShoppingBag size={icon} strokeWidth={2} style={{ color: "#fff" }} />
        }
      </motion.div>
    </button>
  );
}
