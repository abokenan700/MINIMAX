import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import type { Product } from "@workspace/api-client-react";
import { useCartButton } from "../hooks/useCartButton";
import { CartConfetti } from "./CartConfetti";

interface CartButtonProps {
  size?: "sm" | "md";
  product?: Product;
  selectedColor?: string;
}

export function CartButton({ size = "md", product, selectedColor }: CartButtonProps) {
  const { added, handleAdd, showConfetti } = useCartButton(product, selectedColor);

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
        minWidth: 40,
        minHeight: 40,
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        position: "relative",
      }}
    >
      <CartConfetti active={showConfetti} />
      <motion.div
        whileTap={{ scale: 0.80 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        className="flex items-center justify-center"
        style={{
          width: dim,
          height: dim,
          borderRadius: "50%",
          background: added
            ? "rgba(234,88,12,0.12)"
            : "var(--gradient-brand)",
          boxShadow: added ? "none" : "var(--glow-brand-sm)",
          transition: "background 0.2s",
        }}
      >
        {added
          ? <Check size={icon} strokeWidth={2.5} style={{ color: "var(--color-brand-600)" }} />
          : <ShoppingBag size={icon} strokeWidth={2} style={{ color: "#fff" }} />
        }
      </motion.div>
    </button>
  );
}
