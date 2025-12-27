import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Load cart from localStorage on startup
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("winkit_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("winkit_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // --- ACTIONS ---

  // Add Item (or increment if exists)
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        // If item exists, increase quantity
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Else add new item with quantity 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Remove Item (or decrement)
  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === productId);
      if (existing.quantity === 1) {
        // Remove completely if qty is 1
        return prev.filter((item) => item._id !== productId);
      }
      // Else decrease quantity
      return prev.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // Get specific item quantity (for ProductCard)
  const getItemQuantity = (productId) => {
    const item = cartItems.find((item) => item._id === productId);
    return item ? item.quantity : 0;
  };

  // NEW: Clear Cart Function
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("winkit_cart");
  };

  // Calculate Totals
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        getItemQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};