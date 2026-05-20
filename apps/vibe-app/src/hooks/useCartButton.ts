import { useState, useEffect, useCallback } from "react";
import type { Product } from "@workspace/api-client-react";
import { useCart } from "../context/CartContext";

const SESSION_KEY = "nakhba_confetti_fired";

function isFirstAddOfSession(): boolean {
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return false;
    sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

export function useCartButton(product?: Product, selectedColor?: string, duration = 1500) {
  const [added, setAdded]               = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { addToCart }                   = useCart();

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), duration);
    return () => clearTimeout(timer);
  }, [added, duration]);

  useEffect(() => {
    if (!showConfetti) return;
    const timer = setTimeout(() => setShowConfetti(false), 1600);
    return () => clearTimeout(timer);
  }, [showConfetti]);

  const handleAdd = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (added) return;
    if (product) addToCart(product, selectedColor);
    setAdded(true);
    if (isFirstAddOfSession()) setShowConfetti(true);
  }, [added, product, selectedColor, addToCart]);

  return { added, handleAdd, showConfetti };
}
