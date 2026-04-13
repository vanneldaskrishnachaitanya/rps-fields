import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const normalizeCart = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const id = item?.id || item?._id;
      if (!id) return null;
      return {
        ...item,
        id: String(id),
        qty: Math.max(1, Number(item?.qty || 1)),
      };
    })
    .filter(Boolean);
};

export function CartProvider({ children }) {
  const { user, authFetch } = useAuth();
  const [cart, setCart] = useState([]);
  const authFetchRef = useRef(authFetch);

  useEffect(() => {
    authFetchRef.current = authFetch;
  }, [authFetch]);

  useEffect(() => {
    let active = true;

    const loadCart = async () => {
      if (!user) {
        if (active) setCart([]);
        return;
      }

      const data = await authFetchRef.current("/auth/cart");
      if (active && data?.success) {
        setCart(normalizeCart(data.cartItems));
      }
    };

    loadCart();
    return () => { active = false; };
  }, [user]);

  const syncCartToDB = async (nextCart) => {
    if (!user) return;
    await authFetchRef.current("/auth/cart", {
      method: "PUT",
      body: JSON.stringify({ cartItems: nextCart }),
    });
  };

  const setAndSyncCart = (updater) => {
    setCart((prev) => {
      const next = normalizeCart(typeof updater === "function" ? updater(prev) : updater);
      if (user) {
        void syncCartToDB(next);
      }
      return next;
    });
  };

  const addToCart = (product) => {
    const productId = String(product?.id || product?._id || "");
    if (!productId) return;

    setAndSyncCart((prev) => {
      const existing = prev.find((i) => i.id === productId);
      if (existing) {
        return prev.map((i) =>
          i.id === productId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, id: productId, qty: 1 }];
    });
  };

  const removeFromCart = (id) =>
    setAndSyncCart((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id, delta) =>
    setAndSyncCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );

  const clearCart = () => setAndSyncCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
