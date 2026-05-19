import { createContext, useContext, useState, useCallback } from "react";
import type { Product } from "@workspace/api-client-react";

interface QuickViewContextValue {
  product: Product | null;
  open: (product: Product) => void;
  close: () => void;
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);

  const open  = useCallback((p: Product) => setProduct(p), []);
  const close = useCallback(() => setProduct(null), []);

  return (
    <QuickViewContext.Provider value={{ product, open, close }}>
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error("useQuickView must be used inside QuickViewProvider");
  return ctx;
}
