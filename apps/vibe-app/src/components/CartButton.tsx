import { ShoppingBag, Check } from "lucide-react";
import type { Product } from "@workspace/api-client-react";
import { useCartButton } from "../hooks/useCartButton";
import { CartConfetti } from "./CartConfetti";
import { IconButton } from "./ui/IconButton";
import { Spinner } from "./ui/Spinner";

interface CartButtonProps {
  size?: "sm" | "md";
  product?: Product;
  selectedColor?: string;
}

export function CartButton({ size = "md", product, selectedColor }: CartButtonProps) {
  const { added, pending, handleAdd, showConfetti } = useCartButton(product, selectedColor);

  const iconSize = size === "sm" ? 13 : 14;
  const btnSize  = size === "sm" ? "sm" : "md";

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <CartConfetti active={showConfetti} />
      <IconButton
        variant={added ? "soft" : "solid-gradient"}
        size={btnSize}
        aria-label={pending ? "جارٍ الإضافة" : added ? "تمت الإضافة للسلة" : "أضف للسلة"}
        onClick={handleAdd}
        disabled={pending}
        style={{
          transition: "background 200ms var(--ease-out)",
        }}
      >
        {pending
          ? <Spinner size="sm" />
          : added
          ? <Check size={iconSize} strokeWidth={2.5} />
          : <ShoppingBag size={iconSize} strokeWidth={2} />
        }
      </IconButton>
    </div>
  );
}
