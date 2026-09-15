"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "mimosa_cart_v1";

function loadCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(lines) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveCart(lines);
  }, [lines, hydrated]);

  // A cart line is keyed by variantId so the same variant added twice just bumps quantity.
  const addItem = useCallback((item, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === item.variantId);
      if (existing) {
        return prev.map((l) =>
          l.variantId === item.variantId ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((variantId, quantity) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) => (l.variantId === variantId ? { ...l, quantity } : l))
    );
  }, []);

  const removeItem = useCallback((variantId) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const currencyCode = lines[0]?.currencyCode || "USD";

  return (
    <CartContext.Provider
      value={{
        lines,
        totalQuantity,
        subtotal,
        currencyCode,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
