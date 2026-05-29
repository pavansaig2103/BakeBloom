import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem("bakebloom-cart");
    return stored ? JSON.parse(stored) : [];
  });

  const sync = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem("bakebloom-cart", JSON.stringify(nextItems));
  };

  const addItem = (item) => sync([{ ...item, cartId: crypto.randomUUID() }, ...items]);
  const removeItem = (cartId) => sync(items.filter((item) => item.cartId !== cartId));
  const clearCart = () => sync([]);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({ items, addItem, removeItem, clearCart, total, count }),
    [items, total, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
