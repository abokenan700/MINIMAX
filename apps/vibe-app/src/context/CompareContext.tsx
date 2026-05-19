import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "@workspace/api-client-react";
import { toast } from "sonner";

interface CompareContextValue {
  items: Product[];
  add:    (p: Product) => void;
  remove: (id: number) => void;
  clear:  () => void;
  isInCompare: (id: number) => boolean;
  open:   boolean;
  setOpen:(v: boolean) => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems]  = useState<Product[]>([]);
  const [open, setOpen]    = useState(false);

  function add(p: Product) {
    if (items.find(i => i.id === p.id)) { setOpen(true); return; }
    if (items.length >= 3) { toast.error("يمكنك مقارنة حتى ٣ منتجات فقط"); return; }
    setItems(prev => [...prev, p]);
    if (items.length + 1 >= 2) setOpen(true);
    toast(`أُضيف "${p.name}" للمقارنة`, { duration: 2000 });
  }

  function remove(id: number) {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id);
      if (next.length < 2) setOpen(false);
      return next;
    });
  }

  function clear() { setItems([]); setOpen(false); }

  function isInCompare(id: number) { return items.some(i => i.id === id); }

  return (
    <CompareContext.Provider value={{ items, add, remove, clear, isInCompare, open, setOpen }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}
